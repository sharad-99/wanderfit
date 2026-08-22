export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash",
].filter(Boolean);

const COHORTS = [
  ["SOLO-EXPLORER", "Solo Explorer"],
  ["COUPLE-ROMANTIC", "Romantic Getaway"],
  ["FRIENDS-GROUP", "Friends Group"],
  ["FAMILY-YOUNGKIDS", "Family with Young Children"],
  ["FAMILY-TEENS", "Family with Teenagers"],
  ["FAMILY-MIXED", "Family, Mixed Ages"],
  ["MULTIGEN", "Multigenerational Trip"],
];

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    cohort: {
      type: "OBJECT",
      properties: {
        code: { type: "STRING" },
        label: { type: "STRING" },
        confidence: { type: "NUMBER" },
        rationale: { type: "STRING" },
        signals: { type: "ARRAY", items: { type: "STRING" } },
        runnerUp: { type: "STRING" },
      },
      required: ["code", "label", "confidence", "rationale", "signals"],
    },
    theme: {
      type: "OBJECT",
      properties: {
        primary: { type: "STRING" },
        secondary: { type: "STRING" },
        why: { type: "STRING" },
      },
      required: ["primary", "secondary", "why"],
    },
    days: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          dayNumber: { type: "NUMBER" },
          title: { type: "STRING" },
          slots: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                time: { type: "STRING" },
                name: { type: "STRING" },
                category: { type: "STRING" },
                whyFit: { type: "STRING" },
                durationHours: { type: "NUMBER" },
                intensity: { type: "STRING" },
                estCostPerPerson: { type: "STRING" },
                valueScore: { type: "NUMBER" },
              },
              required: [
                "time",
                "name",
                "category",
                "whyFit",
                "durationHours",
                "intensity",
                "estCostPerPerson",
                "valueScore",
              ],
            },
          },
        },
        required: ["dayNumber", "title", "slots"],
      },
    },
    budget: {
      type: "OBJECT",
      properties: {
        perPersonTotal: { type: "STRING" },
        groupTotal: { type: "STRING" },
        note: { type: "STRING" },
      },
      required: ["perPersonTotal", "groupTotal", "note"],
    },
    limitations: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["cohort", "theme", "days", "budget", "limitations"],
};

function buildPrompt(t) {
  const kidAges =
    t.childAges && t.childAges.length
      ? t.childAges.join(", ")
      : t.children > 0
      ? "NOT PROVIDED — you must assume a likely range and lower your confidence accordingly"
      : "no children";

  return `You are the inference engine inside a travel operator's booking flow. You are given only four
facts. From them you must predict what kind of trip this is, name its theme, and lay out a
day-by-day itinerary that extracts the most value from the number of days available.

TRIP BRIEF
Destination: ${t.destination}
Duration: ${t.duration} day(s)
Adults: ${t.adults}
Children: ${t.children}
Ages of children: ${kidAges}

STEP 1 — COHORT PREDICTION
Pick exactly one code from this closed list:
${COHORTS.map(([c, l]) => `${c} = ${l}`).join("\n")}

Reason from composition alone. Useful patterns:
- 1 adult, 0 children -> solo, exploratory intent, culture and food weighted high.
- 2 adults, 0 children -> overwhelmingly a couples' leisure trip; intimate, scenic, evening-weighted.
- 3 or more adults, 0 children -> friends group; social and shared activities.
- Adults with children under 12 -> constraints dominate: short durations, low queues, predictable
  meal and rest windows, water and animal and theme attractions.
- Adults with teenagers -> adventure and photo-worthy experiences with some autonomy.
- 4 or more adults with children -> likely multigenerational; every activity needs a low-effort
  participation path so nobody is left sitting out.
- Children present but ages unknown -> use FAMILY-MIXED and set confidence no higher than 0.6.

"confidence" is 0 to 1 and must be honest. Four inputs is thin evidence — do not return 0.95 unless
the composition is genuinely unambiguous. Missing child ages must visibly reduce it.
"signals" is 3 to 4 items, each under 6 words, naming the facts that drove the call.
"runnerUp" names the closest alternative cohort you rejected.

STEP 2 — THEME
Name the trip's primary theme and a secondary theme in two or three words each, in the vocabulary a
traveller would use, not a marketer. Examples of register: "Romance and scenery", "Play and wonder",
"Discovery and street food", "Adventure and autonomy". In "why", explain in one or two sentences why
this composition implies this theme for ${t.destination} specifically.

STEP 3 — DAY-BY-DAY ITINERARY
Produce exactly ${t.duration} day object(s), numbered 1 to ${t.duration}.
This is the core of the task: with only ${t.duration} day(s), the itinerary must be the highest-value
selection possible, not a generic list. Rules:
- Front-load the highest value. Day 1 carries the single most defining experience of ${t.destination}
  for this cohort. Never leave the signature experience to the last day.
- Slots per day: 2 if the cohort has children under 12 or the trip is 1 day; otherwise 3.
- Give each day a short "title" of three to five words naming that day's idea.
- "time" is a slot label: Morning, Midday, Afternoon, Evening or Night.
- Cluster each day geographically so the party is not crossing the destination twice in one day.
- Vary intensity within and across days. Do not stack three high-intensity activities on one day.
- If children under 12 are present, keep afternoons lighter and end evenings early.
- "whyFit" must cite the party's actual facts — the ages, the count, the number of days — in one or
  two sentences. No generic marketing copy.
- "valueScore" is 0 to 100, meaning how much this contributes to the trip being worth it for THIS
  cohort. Vary it meaningfully. Day 1 morning should usually be the highest.
- "intensity" is Low, Moderate or High.
- "estCostPerPerson" is a short string like "~₹1,200" or "~$35". Use the local currency of
  ${t.destination} where you can, otherwise Indian rupees.
- Every activity must plausibly exist in or near ${t.destination}.

STEP 4 — BUDGET
"perPersonTotal" and "groupTotal" as short currency strings covering activities only, for the whole
${t.duration} day(s), for a party of ${t.adults + t.children}. "note" states in one sentence what is
excluded, for example flights, hotels and local transport.

STEP 5 — LIMITATIONS
2 to 4 honest limitations specific to this brief. Mention the thin input set, any assumption you made
about ages, and what a production system would need live data for. No generic filler.

Return only JSON matching the schema.`;
}

async function callGemini(apiKey, prompt) {
  let lastErr = "no model attempted";
  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.75,
              maxOutputTokens: 4000,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
          }),
        }
      );
      if (!res.ok) {
        lastErr = `${model}: HTTP ${res.status}`;
        continue;
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("");
      if (!text) {
        lastErr = `${model}: empty response`;
        continue;
      }
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (!parsed?.cohort || !Array.isArray(parsed?.days) || !parsed.days.length) {
        lastErr = `${model}: malformed payload`;
        continue;
      }
      return { ok: true, data: parsed, model };
    } catch (err) {
      lastErr = `${model}: ${err.message}`;
    }
  }
  return { ok: false, error: lastErr };
}

/* ---------------- deterministic fallback ---------------- */

function predictCohort(t) {
  const a = t.adults;
  const c = t.children;
  const ages = t.childAges || [];
  const signals = [
    `${a} adult${a > 1 ? "s" : ""}`,
    `${c} child${c === 1 ? "" : "ren"}`,
    `${t.duration}-day trip`,
  ];
  if (ages.length) signals.push(`kids aged ${ages.join("/")}`);
  else if (c > 0) signals.push("ages not given");

  let code, label, confidence, rationale, runnerUp;

  if (c > 0 && a >= 4) {
    code = "MULTIGEN";
    label = "Multigenerational Trip";
    confidence = 0.66;
    runnerUp = "FAMILY-MIXED";
    rationale =
      "Four or more adults travelling with children usually means grandparents are along, so every activity needs a low-effort way to take part.";
  } else if (c > 0 && ages.length && ages.every((x) => x >= 12)) {
    code = "FAMILY-TEENS";
    label = "Family with Teenagers";
    confidence = 0.79;
    runnerUp = "FAMILY-MIXED";
    rationale =
      "Teenagers shift the trip toward adventure and photo-worthy experiences with some independence, rather than supervised attractions.";
  } else if (c > 0 && ages.length && ages.some((x) => x < 12)) {
    code = "FAMILY-YOUNGKIDS";
    label = "Family with Young Children";
    confidence = 0.87;
    runnerUp = "FAMILY-MIXED";
    rationale =
      "With children under twelve, scheduling constraints outrank novelty: short durations, low queues and predictable rest windows drive the plan.";
  } else if (c > 0) {
    code = "FAMILY-MIXED";
    label = "Family, Mixed Ages";
    confidence = 0.55;
    runnerUp = "FAMILY-YOUNGKIDS";
    rationale =
      "Children are present but their ages were not supplied, so the itinerary hedges across age bands. Adding ages is the single biggest accuracy gain available.";
  } else if (a === 1) {
    code = "SOLO-EXPLORER";
    label = "Solo Explorer";
    confidence = 0.76;
    runnerUp = "COUPLE-ROMANTIC";
    rationale =
      "A single traveller optimises for cultural depth and spontaneity over comfort, and values settings where meeting people happens naturally.";
  } else if (a === 2) {
    code = "COUPLE-ROMANTIC";
    label = "Romantic Getaway";
    confidence = 0.83;
    runnerUp = "FRIENDS-GROUP";
    rationale =
      "Two adults with no children is the strongest single predictor of a couples' leisure trip, so intimate, scenic and evening-weighted experiences lead.";
  } else {
    code = "FRIENDS-GROUP";
    label = "Friends Group";
    confidence = 0.71;
    runnerUp = "COUPLE-ROMANTIC";
    rationale =
      "Three or more adults with no children reads as a friends group, where shared and social experiences outperform solitary ones.";
  }

  return { code, label, confidence, rationale, signals, runnerUp };
}

const THEMES = {
  "SOLO-EXPLORER": ["Discovery and street food", "Culture at your own pace"],
  "COUPLE-ROMANTIC": ["Romance and scenery", "Slow evenings"],
  "FRIENDS-GROUP": ["Shared adventure", "Nights out"],
  "FAMILY-YOUNGKIDS": ["Play and wonder", "Short hops, early nights"],
  "FAMILY-TEENS": ["Adventure and autonomy", "Photo-worthy days"],
  "FAMILY-MIXED": ["Something for every age", "Flexible days"],
  MULTIGEN: ["Togetherness at an easy pace", "Comfort first"],
};

const POOL = {
  "SOLO-EXPLORER": [
    ["Old quarter walking tour", "Culture", "Moderate", 3, 94],
    ["Morning market and breakfast trail", "Food", "Low", 2.5, 90],
    ["Local craft workshop", "Learning", "Low", 2.5, 82],
    ["Sunset viewpoint hike", "Outdoors", "Moderate", 2, 86],
    ["Live music at a neighbourhood bar", "Nightlife", "Low", 3, 74],
    ["Day trip to a nearby village", "Culture", "Moderate", 6, 88],
    ["Museum of regional history", "Culture", "Low", 2, 70],
    ["Street-food crawl after dark", "Food", "Low", 3, 84],
    ["Riverside cycle route", "Outdoors", "Moderate", 3, 72],
  ],
  "COUPLE-ROMANTIC": [
    ["Sunset cruise for two", "Scenic", "Low", 2, 95],
    ["Private rooftop dinner", "Dining", "Low", 2.5, 91],
    ["Couples spa afternoon", "Wellness", "Low", 3, 84],
    ["Heritage quarter stroll", "Culture", "Low", 2, 80],
    ["Vineyard or estate tasting", "Food", "Low", 4, 86],
    ["Dawn hot-air balloon ride", "Adventure", "Moderate", 3, 89],
    ["Secluded beach morning", "Outdoors", "Low", 3, 78],
    ["Chef's counter tasting menu", "Dining", "Low", 2.5, 82],
    ["Late-night jazz and cocktails", "Nightlife", "Low", 2.5, 71],
  ],
  "FRIENDS-GROUP": [
    ["Group watersports session", "Adventure", "High", 3, 92],
    ["Brewery or distillery tour", "Food", "Low", 3, 84],
    ["Beach club afternoon", "Leisure", "Low", 5, 88],
    ["Sunset catamaran", "Scenic", "Low", 3, 90],
    ["Night market and bar hop", "Nightlife", "Low", 4, 86],
    ["Escape room challenge", "Attraction", "Low", 1.5, 70],
    ["Cliff or waterfall trek", "Adventure", "High", 5, 80],
    ["Long shared lunch", "Dining", "Low", 2, 68],
    ["Karaoke or live gig night", "Nightlife", "Low", 3, 72],
  ],
  "FAMILY-YOUNGKIDS": [
    ["Water park day pass", "Attraction", "Moderate", 5, 94],
    ["Wildlife park with feeding show", "Attraction", "Low", 4, 90],
    ["Interactive science museum", "Learning", "Low", 3, 85],
    ["Shallow lagoon beach morning", "Outdoors", "Low", 3, 82],
    ["Toy train or harbour ferry ride", "Scenic", "Low", 1.5, 76],
    ["Family cooking class", "Food", "Low", 2, 70],
    ["Aquarium with touch pool", "Attraction", "Low", 2.5, 88],
    ["Playground park and picnic", "Outdoors", "Low", 2, 66],
    ["Early puppet or magic show", "Entertainment", "Low", 1.5, 68],
  ],
  "FAMILY-TEENS": [
    ["Zipline and adventure park", "Adventure", "High", 4, 93],
    ["Surf or paddleboard lesson", "Adventure", "Moderate", 3, 89],
    ["Snorkel or dive taster", "Adventure", "Moderate", 4, 87],
    ["Street-art and photo walk", "Culture", "Low", 2.5, 78],
    ["Night market food trail", "Food", "Low", 3, 84],
    ["Escape room challenge", "Attraction", "Low", 1.5, 72],
    ["Kayak through the mangroves", "Outdoors", "Moderate", 3, 80],
    ["Rooftop viewpoint at sunset", "Scenic", "Low", 1.5, 74],
    ["Go-karting or bowling evening", "Entertainment", "Moderate", 2, 68],
  ],
  "FAMILY-MIXED": [
    ["Wildlife park with feeding show", "Attraction", "Low", 4, 90],
    ["Harbour or lake boat ride", "Scenic", "Low", 2, 84],
    ["Interactive science museum", "Learning", "Low", 3, 82],
    ["Beach morning with easy access", "Outdoors", "Low", 3, 86],
    ["Family cooking class", "Food", "Low", 2, 74],
    ["Cable car to a viewpoint", "Scenic", "Low", 2, 80],
    ["Heritage site with guided loop", "Culture", "Low", 2.5, 76],
    ["Early evening light show", "Entertainment", "Low", 1.5, 70],
    ["Market visit and shared lunch", "Food", "Low", 2, 66],
  ],
  MULTIGEN: [
    ["Private van heritage tour", "Culture", "Low", 4, 92],
    ["Accessible garden and conservatory", "Outdoors", "Low", 2, 86],
    ["Lakeside boat ride", "Scenic", "Low", 1.5, 88],
    ["Long-table regional lunch", "Dining", "Low", 2, 80],
    ["Craft workshop with seating", "Learning", "Low", 2, 74],
    ["Evening light-and-sound show", "Culture", "Low", 1.5, 78],
    ["Cable car to a viewpoint", "Scenic", "Low", 2, 82],
    ["Temple or cathedral visit", "Culture", "Low", 1.5, 70],
    ["Hotel garden afternoon tea", "Leisure", "Low", 1.5, 64],
  ],
};

const SLOT_LABELS = [
  ["Morning", "Afternoon", "Evening"],
  ["Morning", "Late afternoon"],
];

function fallbackPayload(t) {
  const cohort = predictCohort(t);
  const pool = [...(POOL[cohort.code] || POOL["SOLO-EXPLORER"])].sort((a, b) => b[4] - a[4]);
  const kidsYoung =
    cohort.code === "FAMILY-YOUNGKIDS" ||
    (cohort.code === "FAMILY-MIXED" && t.children > 0);
  const perDay = kidsYoung || t.duration === 1 ? 2 : 3;
  const labels = perDay === 2 ? SLOT_LABELS[1] : SLOT_LABELS[0];
  const party = t.adults + t.children;

  const days = [];
  let idx = 0;
  let runningCost = 0;

  for (let d = 1; d <= t.duration; d++) {
    const slots = [];
    for (let s = 0; s < perDay; s++) {
      const item = pool[idx % pool.length];
      idx++;
      const [name, category, intensity, hours, base] = item;
      const cost = category === "Dining" || category === "Attraction" ? 2200 : 1400;
      runningCost += cost;
      slots.push({
        time: labels[s],
        name: `${name} — ${t.destination}`,
        category,
        whyFit: `Selected for a ${cohort.label.toLowerCase()} of ${t.adults} adult(s) and ${t.children} child(ren) with only ${t.duration} day(s) available.`,
        durationHours: hours,
        intensity,
        estCostPerPerson: `~₹${cost.toLocaleString("en-IN")}`,
        valueScore: Math.max(45, base - (d - 1) * 5 - s * 4),
      });
    }
    days.push({
      dayNumber: d,
      title: d === 1 ? "The one you came for" : `Day ${d} — widening out`,
      slots,
    });
  }

  return {
    cohort,
    theme: {
      primary: THEMES[cohort.code][0],
      secondary: THEMES[cohort.code][1],
      why: `A party of ${t.adults} adult(s) and ${t.children} child(ren) in ${t.destination} for ${t.duration} day(s) points to this theme more strongly than any alternative.`,
    },
    days,
    budget: {
      perPersonTotal: `~₹${runningCost.toLocaleString("en-IN")}`,
      groupTotal: `~₹${(runningCost * party).toLocaleString("en-IN")}`,
      note: "Activities only. Flights, accommodation and local transport are excluded.",
    },
    limitations: [
      "Offline mode: this itinerary came from a fixed rule-based catalogue, not a language model.",
      "Activity names are illustrative templates and are not checked against live availability.",
      "Costs are static band estimates and ignore season, weekday and group discounts.",
    ],
  };
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Request body was not valid JSON." }, { status: 400 });
  }

  if (!body.destination || !String(body.destination).trim()) {
    return Response.json({ error: "Add a destination before running the engine." }, { status: 400 });
  }

  const trip = {
    destination: String(body.destination).slice(0, 120).trim(),
    duration: Math.min(Math.max(Number(body.duration) || 3, 1), 7),
    adults: Math.min(Math.max(Number(body.adults) || 1, 1), 12),
    children: Math.min(Math.max(Number(body.children) || 0, 0), 10),
    childAges: Array.isArray(body.childAges)
      ? body.childAges.map(Number).filter((n) => !Number.isNaN(n) && n >= 0 && n < 18).slice(0, 10)
      : [],
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ ...fallbackPayload(trip), mode: "offline", reason: "no-api-key", trip });
  }

  const result = await callGemini(apiKey, buildPrompt(trip));
  if (!result.ok) {
    return Response.json({ ...fallbackPayload(trip), mode: "offline", reason: result.error, trip });
  }

  return Response.json({ ...result.data, mode: "live", model: result.model, trip });
}
