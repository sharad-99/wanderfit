export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash",
].filter(Boolean);

const SEGMENTS = [
  { code: "SOLO-EXPLORER", label: "Solo Explorer" },
  { code: "SOLO-RECHARGE", label: "Solo Recharge" },
  { code: "COUPLE-ROMANTIC", label: "Romantic Getaway" },
  { code: "COUPLE-ACTIVE", label: "Active Couple" },
  { code: "FAMILY-YOUNGKIDS", label: "Family with Young Children" },
  { code: "FAMILY-TEENS", label: "Family with Teenagers" },
  { code: "MULTIGEN", label: "Multigenerational Trip" },
  { code: "FRIENDS-GROUP", label: "Friends Group" },
  { code: "BLEISURE", label: "Business + Leisure" },
];

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    segment: {
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
    activities: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          category: { type: "STRING" },
          whyFit: { type: "STRING" },
          bestTime: { type: "STRING" },
          durationHours: { type: "NUMBER" },
          intensity: { type: "STRING" },
          estCostPerPerson: { type: "STRING" },
          matchScore: { type: "NUMBER" },
        },
        required: [
          "name",
          "category",
          "whyFit",
          "bestTime",
          "durationHours",
          "intensity",
          "estCostPerPerson",
          "matchScore",
        ],
      },
    },
    limitations: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["segment", "activities", "limitations"],
};

function buildPrompt(t) {
  const ages = t.ages && t.ages.length ? t.ages.join(", ") : "not provided";
  const themes = t.themes && t.themes.length ? t.themes.join(", ") : "none selected";

  return `You are the inference engine inside a travel operator's booking flow. From a small set of
booking-form signals you must (a) infer what kind of trip this party is really taking, and
(b) recommend activities that match that intent.

TRIP BRIEF
Destination: ${t.destination}
Party composition: ${t.adults} adult(s), ${t.children} child(ren)
Ages of travellers: ${ages}
Relationship declared by booker: ${t.relationship || "not declared"}
Trip length: ${t.tripLength} day(s)
Budget band: ${t.budget}
Preferred pace: ${t.pace}
Themes the booker selected: ${themes}
Mobility / accessibility needs: ${t.mobility || "none stated"}
Free-text note from booker: ${t.notes || "none"}
${t.override ? `IMPORTANT — a human agent has overridden the segment. Use exactly: ${t.override}. Set confidence to 1 and explain in the rationale that this was set by a human agent, not predicted.` : ""}

STEP 1 — SEGMENT INFERENCE
Choose exactly one segment code from this closed list:
${SEGMENTS.map((s) => `${s.code} = ${s.label}`).join("\n")}

Reason from the composition, not from stereotypes about gender. Useful patterns:
- Two adults of similar age, no children, leisure themes -> likely a romantic getaway; skew to
  intimate, low-noise, scenic, dining and sunset-timed experiences.
- One adult, longer stay -> exploratory intent; skew to culture, neighbourhood walks, food markets,
  and experiences where meeting other travellers is natural.
- Adults plus children under 12 -> constraint-led planning; skew to short-duration, low-queue,
  stroller-friendly, water/theme/animal attractions, with nap and meal windows respected.
- Adults plus teenagers -> autonomy and photo-worthy adventure matter more than novelty.
- Adults spanning more than 35 years of age range -> multigenerational; every recommendation needs a
  low-effort participation path so nobody sits out.
- Three or more adults of similar age, no children -> friends group; social, nightlife, shared activities.
Set "confidence" between 0 and 1. Be honest: thin or contradictory signals mean a LOWER number.
Name the closest alternative segment in "runnerUp".
List 3 to 5 short "signals" — the specific form facts that drove the call, e.g. "2 adults, ages 31/33",
"0 children", "5-day stay". Keep each signal under 6 words.

STEP 2 — ACTIVITY RECOMMENDATIONS
Return exactly 6 activities that genuinely exist or are plausibly available in or near ${t.destination}.
Rules:
- Every activity must be defensible for the inferred segment. If the segment is a romantic getaway,
  do not recommend a water park.
- "whyFit" must reference the party's actual facts (ages, children, pace, budget), in one or two
  sentences. Do not write generic marketing copy.
- Respect the budget band and the pace. A relaxed pace means fewer, longer activities.
- Honour any mobility need in every single recommendation.
- "intensity" is one of: Low, Moderate, High.
- "estCostPerPerson" is a short string with a currency figure and a tilde, e.g. "~₹1,200" or "~$35".
- "matchScore" is 0 to 100 and should vary meaningfully across the six; do not give everything 90+.
- Order the list from best match to weakest.

STEP 3 — LIMITATIONS
List 2 to 4 honest limitations of this recommendation, specific to this brief. Mention thin signals,
assumptions made, or things a real system would need live data for (pricing, seasonality, opening
hours, availability). Do not pad with generic disclaimers.

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
              temperature: 0.7,
              maxOutputTokens: 2600,
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
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("");

      if (!text) {
        lastErr = `${model}: empty response`;
        continue;
      }

      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (!parsed?.segment || !Array.isArray(parsed?.activities)) {
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

/* ---------- deterministic fallback so the demo never goes dark ---------- */

function inferSegmentLocally(t) {
  const adults = Number(t.adults) || 1;
  const children = Number(t.children) || 0;
  const ages = (t.ages || []).map(Number).filter((n) => !Number.isNaN(n));
  const spread = ages.length > 1 ? Math.max(...ages) - Math.min(...ages) : 0;
  const childAges = ages.filter((a) => a < 18);
  const signals = [
    `${adults} adult${adults > 1 ? "s" : ""}`,
    `${children} child${children === 1 ? "" : "ren"}`,
    `${t.tripLength}-day stay`,
  ];
  if (ages.length) signals.push(`ages ${ages.join("/")}`);

  let code, label, confidence, rationale, runnerUp;

  if (children > 0 && spread > 35 && adults > 2) {
    code = "MULTIGEN";
    label = "Multigenerational Trip";
    confidence = 0.72;
    runnerUp = "FAMILY-YOUNGKIDS";
    rationale =
      "Age spread across more than three decades alongside children points to grandparents travelling with a family unit, so every activity needs a low-effort participation path.";
  } else if (children > 0 && childAges.some((a) => a < 12)) {
    code = "FAMILY-YOUNGKIDS";
    label = "Family with Young Children";
    confidence = 0.86;
    runnerUp = "FAMILY-TEENS";
    rationale =
      "Children under twelve in the party make schedule constraints the dominant planning factor: short durations, low queues and predictable meal windows outrank novelty.";
  } else if (children > 0) {
    code = "FAMILY-TEENS";
    label = "Family with Teenagers";
    confidence = 0.78;
    runnerUp = "FAMILY-YOUNGKIDS";
    rationale =
      "Teenagers in the party shift the brief toward adventure and photo-worthy experiences with some independence, rather than supervised attractions.";
  } else if (adults === 2 && spread <= 10) {
    code = "COUPLE-ROMANTIC";
    label = "Romantic Getaway";
    confidence = 0.81;
    runnerUp = "COUPLE-ACTIVE";
    rationale =
      "Two adults of similar age travelling without children is the strongest single predictor of a couples' leisure trip, so intimate, scenic and evening-weighted experiences are prioritised.";
  } else if (adults === 1) {
    code = "SOLO-EXPLORER";
    label = "Solo Explorer";
    confidence = 0.74;
    runnerUp = "SOLO-RECHARGE";
    rationale =
      "A single traveller typically optimises for cultural depth and spontaneity over comfort, and values experiences where meeting other people is a natural by-product.";
  } else {
    code = "FRIENDS-GROUP";
    label = "Friends Group";
    confidence = 0.69;
    runnerUp = "COUPLE-ACTIVE";
    rationale =
      "Three or more adults with no children and no wide age spread reads as a friends group, where shared and social activities outperform solitary ones.";
  }

  if (t.override) {
    const found = SEGMENTS.find((s) => s.code === t.override);
    if (found) {
      code = found.code;
      label = found.label;
      confidence = 1;
      rationale =
        "Segment was set manually by a human agent. The model's own prediction was overridden and is not being used.";
    }
  }

  return { code, label, confidence, rationale, signals, runnerUp };
}

const CATALOG = {
  "COUPLE-ROMANTIC": [
    ["Sunset cruise for two", "Scenic", "Low", 2],
    ["Private rooftop dinner", "Dining", "Low", 2.5],
    ["Old-quarter heritage walk", "Culture", "Low", 2],
    ["Couples spa afternoon", "Wellness", "Low", 3],
    ["Vineyard or estate tasting", "Food & Drink", "Low", 4],
    ["Dawn hot-air balloon ride", "Adventure", "Moderate", 3],
  ],
  "COUPLE-ACTIVE": [
    ["Coastal cycling route", "Adventure", "High", 4],
    ["Guided kayak morning", "Adventure", "Moderate", 3],
    ["Summit sunrise trek", "Adventure", "High", 5],
    ["Street-food crawl", "Food & Drink", "Low", 3],
    ["Climbing or via ferrata session", "Adventure", "High", 4],
    ["Sunset viewpoint drive", "Scenic", "Low", 2],
  ],
  "FAMILY-YOUNGKIDS": [
    ["Water park day pass", "Attraction", "Moderate", 5],
    ["Interactive science museum", "Learning", "Low", 3],
    ["Wildlife park with feeding show", "Attraction", "Low", 4],
    ["Beach morning with shallow lagoon", "Outdoors", "Low", 3],
    ["Toy train or ferry ride", "Scenic", "Low", 1.5],
    ["Family cooking class", "Food & Drink", "Low", 2],
  ],
  "FAMILY-TEENS": [
    ["Zipline and adventure park", "Adventure", "High", 4],
    ["Surf or paddleboard lesson", "Adventure", "Moderate", 3],
    ["Street-art and photo walk", "Culture", "Low", 2.5],
    ["Escape-room challenge", "Attraction", "Low", 1.5],
    ["Night market food trail", "Food & Drink", "Low", 3],
    ["Snorkel or dive taster", "Adventure", "Moderate", 4],
  ],
  MULTIGEN: [
    ["Accessible garden and conservatory", "Outdoors", "Low", 2],
    ["Private van heritage tour", "Culture", "Low", 4],
    ["Lakeside boat ride", "Scenic", "Low", 1.5],
    ["Craft workshop with seating", "Learning", "Low", 2],
    ["Long-table regional lunch", "Dining", "Low", 2],
    ["Evening light-and-sound show", "Culture", "Low", 1.5],
  ],
  "SOLO-EXPLORER": [
    ["Neighbourhood food walk", "Food & Drink", "Low", 3],
    ["Small-group heritage tour", "Culture", "Low", 3],
    ["Local craft workshop", "Learning", "Low", 2.5],
    ["Sunrise photography walk", "Scenic", "Moderate", 2],
    ["Live music or jazz night", "Nightlife", "Low", 3],
    ["Day trip to a nearby village", "Culture", "Moderate", 6],
  ],
  "SOLO-RECHARGE": [
    ["Morning yoga by the water", "Wellness", "Low", 1.5],
    ["Spa and thermal circuit", "Wellness", "Low", 3],
    ["Quiet coastal walk", "Outdoors", "Low", 2],
    ["Bookshop and café afternoon", "Leisure", "Low", 2],
    ["Sound-bath or meditation session", "Wellness", "Low", 1.5],
    ["Slow regional lunch", "Dining", "Low", 2],
  ],
  "FRIENDS-GROUP": [
    ["Brewery or distillery tour", "Food & Drink", "Low", 3],
    ["Beach club day", "Leisure", "Low", 5],
    ["Group watersports session", "Adventure", "Moderate", 3],
    ["Night market and bar hop", "Nightlife", "Low", 4],
    ["Escape room or bowling", "Attraction", "Low", 2],
    ["Sunset catamaran", "Scenic", "Low", 3],
  ],
  BLEISURE: [
    ["Two-hour city highlights tour", "Culture", "Low", 2],
    ["Hotel-adjacent spa slot", "Wellness", "Low", 1.5],
    ["Chef's counter dinner", "Dining", "Low", 2],
    ["Early-morning river run route", "Outdoors", "Moderate", 1],
    ["Design and architecture walk", "Culture", "Low", 2],
    ["Rooftop bar with skyline view", "Nightlife", "Low", 2],
  ],
};

const COST_BAND = { Budget: "~₹800", Moderate: "~₹2,000", Premium: "~₹5,500" };

function fallbackPayload(t) {
  const segment = inferSegmentLocally(t);
  const rows = CATALOG[segment.code] || CATALOG["SOLO-EXPLORER"];
  const cost = COST_BAND[t.budget] || "~₹2,000";

  const activities = rows.map(([name, category, intensity, hours], i) => ({
    name: `${name} — ${t.destination}`,
    category,
    whyFit: `Matched to a ${segment.label.toLowerCase()} of ${t.adults} adult(s) and ${t.children} child(ren) on a ${t.pace.toLowerCase()} ${t.tripLength}-day trip.`,
    bestTime: i % 2 === 0 ? "Morning" : "Late afternoon",
    durationHours: hours,
    intensity,
    estCostPerPerson: cost,
    matchScore: 92 - i * 6,
  }));

  return {
    segment,
    activities,
    limitations: [
      "Offline mode: recommendations came from a fixed rule-based catalogue, not a language model.",
      "Activity names are illustrative templates and are not checked against live availability.",
      "Pricing is a static band estimate and ignores season, weekday and group discounts.",
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
    destination: String(body.destination).slice(0, 120),
    adults: Number(body.adults) || 1,
    children: Number(body.children) || 0,
    ages: Array.isArray(body.ages) ? body.ages.slice(0, 12) : [],
    relationship: body.relationship || "",
    tripLength: Number(body.tripLength) || 3,
    budget: body.budget || "Moderate",
    pace: body.pace || "Balanced",
    themes: Array.isArray(body.themes) ? body.themes : [],
    mobility: body.mobility || "",
    notes: String(body.notes || "").slice(0, 500),
    override: body.override || "",
  };

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({ ...fallbackPayload(trip), mode: "offline", reason: "no-api-key" });
  }

  const result = await callGemini(apiKey, buildPrompt(trip));

  if (!result.ok) {
    return Response.json({ ...fallbackPayload(trip), mode: "offline", reason: result.error });
  }

  return Response.json({ ...result.data, mode: "live", model: result.model });
}
