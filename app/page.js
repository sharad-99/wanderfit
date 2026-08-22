"use client";

import { useState } from "react";

const THEMES = [
  "Culture & heritage",
  "Food & dining",
  "Nature & outdoors",
  "Adventure",
  "Wellness",
  "Nightlife",
  "Shopping",
  "Beaches",
];

const SEGMENT_OPTIONS = [
  ["SOLO-EXPLORER", "Solo Explorer"],
  ["SOLO-RECHARGE", "Solo Recharge"],
  ["COUPLE-ROMANTIC", "Romantic Getaway"],
  ["COUPLE-ACTIVE", "Active Couple"],
  ["FAMILY-YOUNGKIDS", "Family with Young Children"],
  ["FAMILY-TEENS", "Family with Teenagers"],
  ["MULTIGEN", "Multigenerational Trip"],
  ["FRIENDS-GROUP", "Friends Group"],
  ["BLEISURE", "Business + Leisure"],
];

const PRESETS = {
  couple: {
    label: "Couple, early 30s",
    form: {
      destination: "Bali, Indonesia",
      adults: 2,
      children: 0,
      ages: [32, 30],
      relationship: "Partners",
      tripLength: 5,
      budget: "Premium",
      pace: "Relaxed",
      themes: ["Food & dining", "Beaches"],
      mobility: "",
      notes: "First trip together since the wedding.",
    },
  },
  family: {
    label: "Family, two young kids",
    form: {
      destination: "Singapore",
      adults: 2,
      children: 2,
      ages: [38, 36, 9, 6],
      relationship: "Family",
      tripLength: 4,
      budget: "Moderate",
      pace: "Balanced",
      themes: ["Nature & outdoors"],
      mobility: "Travelling with a stroller",
      notes: "Kids nap after lunch.",
    },
  },
  solo: {
    label: "Solo traveller, 27",
    form: {
      destination: "Kyoto, Japan",
      adults: 1,
      children: 0,
      ages: [27],
      relationship: "Travelling alone",
      tripLength: 7,
      budget: "Budget",
      pace: "Packed",
      themes: ["Culture & heritage", "Food & dining"],
      mobility: "",
      notes: "Wants to meet other travellers.",
    },
  },
};

const BLANK = {
  destination: "",
  adults: 2,
  children: 0,
  ages: [],
  relationship: "",
  tripLength: 4,
  budget: "Moderate",
  pace: "Balanced",
  themes: [],
  mobility: "",
  notes: "",
};

export default function Page() {
  const [form, setForm] = useState(PRESETS.couple.form);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [override, setOverride] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleTheme = (theme) =>
    setForm((f) => ({
      ...f,
      themes: f.themes.includes(theme)
        ? f.themes.filter((x) => x !== theme)
        : [...f.themes, theme],
    }));

  const setAge = (i, value) =>
    setForm((f) => {
      const ages = [...f.ages];
      ages[i] = value === "" ? "" : Number(value);
      return { ...f, ages };
    });

  async function run(overrideCode = "") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ages: form.ages.filter((a) => a !== "" && !Number.isNaN(a)),
          override: overrideCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "The engine could not complete this request.");
        setLoading(false);
        return;
      }
      setResult(data);
      setOverride("");
    } catch {
      setError("The engine could not be reached. Check your connection and run it again.");
    }
    setLoading(false);
  }

  const acts = result?.activities || [];
  const meanScore = acts.length
    ? Math.round(acts.reduce((s, a) => s + (a.matchScore || 0), 0) / acts.length)
    : 0;

  return (
    <div className="shell">
      <header className="masthead">
        <h1 className="wordmark">
          Wander<span>Fit</span>
        </h1>
        <p className="masthead-note">
          Capstone prototype · Travel &amp; Tourism · Use case #1
        </p>
      </header>

      <section className="thesis">
        <h2>
          Six form fields are enough to know <em>what kind of trip</em> this really is.
        </h2>
        <p>
          Operators sell the same activity list to everyone. WanderFit reads the party
          composition on the booking form, infers the trip's intent, and recommends only what
          fits it — with the confidence shown, and a human agent free to overrule it.
        </p>
      </section>

      <div className="workbench">
        {/* ---------------- form ---------------- */}
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <div className="panel-head">
            <p className="eyebrow">Trip brief</p>
            <div className="chips">
              {Object.entries(PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setForm(p.form);
                    setResult(null);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-body">
            <div className="field">
              <label htmlFor="dest">Destination</label>
              <input
                id="dest"
                className="control"
                value={form.destination}
                onChange={(e) => set("destination", e.target.value)}
                placeholder="Goa, India"
              />
            </div>

            <div className="field row2">
              <div>
                <label htmlFor="adults">Adults</label>
                <input
                  id="adults"
                  type="number"
                  min="1"
                  max="12"
                  className="control"
                  value={form.adults}
                  onChange={(e) => set("adults", Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="children">Children</label>
                <input
                  id="children"
                  type="number"
                  min="0"
                  max="10"
                  className="control"
                  value={form.children}
                  onChange={(e) => set("children", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="field">
              <label>Ages of travellers</label>
              <div className="ages">
                {form.ages.map((age, i) => (
                  <input
                    key={i}
                    className="age-input"
                    type="number"
                    min="0"
                    max="110"
                    value={age}
                    aria-label={`Traveller ${i + 1} age`}
                    onChange={(e) => setAge(i, e.target.value)}
                  />
                ))}
                <button
                  type="button"
                  className="age-add"
                  onClick={() => set("ages", [...form.ages, ""])}
                >
                  + Add age
                </button>
                {form.ages.length > 0 && (
                  <button type="button" className="linkish" onClick={() => set("ages", [])}>
                    Clear
                  </button>
                )}
              </div>
              <p className="hint">
                Ages are the strongest signal the engine has. It works without them, but the
                confidence drops.
              </p>
            </div>

            <div className="field row2">
              <div>
                <label htmlFor="len">Trip length (days)</label>
                <input
                  id="len"
                  type="number"
                  min="1"
                  max="30"
                  className="control"
                  value={form.tripLength}
                  onChange={(e) => set("tripLength", Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="budget">Budget band</label>
                <select
                  id="budget"
                  className="control"
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                >
                  <option>Budget</option>
                  <option>Moderate</option>
                  <option>Premium</option>
                </select>
              </div>
            </div>

            <div className="field row2">
              <div>
                <label htmlFor="pace">Pace</label>
                <select
                  id="pace"
                  className="control"
                  value={form.pace}
                  onChange={(e) => set("pace", e.target.value)}
                >
                  <option>Relaxed</option>
                  <option>Balanced</option>
                  <option>Packed</option>
                </select>
              </div>
              <div>
                <label htmlFor="rel">Relationship</label>
                <select
                  id="rel"
                  className="control"
                  value={form.relationship}
                  onChange={(e) => set("relationship", e.target.value)}
                >
                  <option value="">Not declared</option>
                  <option>Travelling alone</option>
                  <option>Partners</option>
                  <option>Family</option>
                  <option>Friends</option>
                  <option>Colleagues</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Themes the booker selected</label>
              <div className="chips">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="chip"
                    aria-pressed={form.themes.includes(t)}
                    onClick={() => toggleTheme(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="mob">Mobility or accessibility needs</label>
              <input
                id="mob"
                className="control"
                value={form.mobility}
                onChange={(e) => set("mobility", e.target.value)}
                placeholder="Wheelchair user, stroller, limited walking"
              />
            </div>

            <div className="field">
              <label htmlFor="notes">Note from the booker</label>
              <textarea
                id="notes"
                className="control"
                rows="2"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Anything they typed in the free-text box"
              />
            </div>

            <button className="submit" type="submit" disabled={loading}>
              {loading ? "Reading the party…" : "Infer segment and recommend"}
            </button>

            <p className="hint" style={{ textAlign: "center", marginTop: 10 }}>
              <button
                type="button"
                className="linkish"
                onClick={() => {
                  setForm(BLANK);
                  setResult(null);
                }}
              >
                Clear the form
              </button>
            </p>
          </div>
        </form>

        {/* ---------------- results ---------------- */}
        <div className="stack">
          {error && (
            <div className="error">
              <strong>The engine did not run.</strong>
              {error}
            </div>
          )}

          {loading && (
            <>
              <div className="skeleton" style={{ height: 168 }} />
              <div className="cards">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton" />
                ))}
              </div>
            </>
          )}

          {!loading && !result && !error && (
            <div className="empty">
              <h3>Nothing inferred yet</h3>
              <p>
                Load one of the three sample parties above, or fill in a brief of your own, then
                run the engine. The segment call appears here first, followed by the activities
                that follow from it.
              </p>
            </div>
          )}

          {!loading && result && (
            <>
              {/* signature element */}
              <div className="stub">
                <div className="stub-top">
                  <div>
                    <p className="stub-code">
                      {result.segment.code}
                      {result.segment.runnerUp
                        ? ` · runner-up ${result.segment.runnerUp}`
                        : ""}
                    </p>
                    <h3 className="stub-label">{result.segment.label}</h3>
                    <p className="stub-rationale">{result.segment.rationale}</p>
                  </div>
                  <div className="conf">
                    <div className="conf-label">
                      <span>Confidence</span>
                      <span>{Math.round((result.segment.confidence || 0) * 100)}%</span>
                    </div>
                    <div className="conf-track">
                      <div
                        className="conf-fill"
                        style={{
                          width: `${Math.round((result.segment.confidence || 0) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="signals">
                      {(result.segment.signals || []).map((s, i) => (
                        <span key={i} className="signal">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="stub-foot">
                  <p>Machine predicts. Agent decides.</p>
                  <div className="override">
                    <label htmlFor="ov" className="signal" style={{ border: "none" }}>
                      Set segment manually
                    </label>
                    <select
                      id="ov"
                      value={override}
                      onChange={(e) => setOverride(e.target.value)}
                    >
                      <option value="">Choose…</option>
                      {SEGMENT_OPTIONS.map(([code, label]) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button type="button" disabled={!override} onClick={() => run(override)}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* kpis */}
              <dl className="kpis">
                <div className="kpi">
                  <dt>Mean match score</dt>
                  <dd>
                    {meanScore}
                    <small>across {acts.length} recommendations</small>
                  </dd>
                </div>
                <div className="kpi">
                  <dt>Segment confidence</dt>
                  <dd>
                    {Math.round((result.segment.confidence || 0) * 100)}%
                    <small>below 60% routes to an agent</small>
                  </dd>
                </div>
                <div className="kpi">
                  <dt>Shortlisting time</dt>
                  <dd>
                    ~12s
                    <small>versus ~15 min manual, modelled</small>
                  </dd>
                </div>
                <div className="kpi">
                  <dt>Engine mode</dt>
                  <dd style={{ fontSize: 17 }}>
                    {result.mode === "live" ? "Live model" : "Offline rules"}
                    <small>{result.mode === "live" ? result.model : "language model unavailable"}</small>
                  </dd>
                </div>
              </dl>

              {/* activities */}
              <div className="panel">
                <div className="panel-head">
                  <p className="eyebrow">Recommended activities · ranked</p>
                  <span className={`mode-flag${result.mode === "live" ? " live" : ""}`}>
                    {result.mode === "live" ? "AI generated" : "Rule-based fallback"}
                  </span>
                </div>
                <div className="panel-body">
                  <div className="cards">
                    {acts.map((a, i) => (
                      <article className="act" key={i}>
                        <p className="act-rank">
                          <span>
                            {String(i + 1).padStart(2, "0")} · {a.category}
                          </span>
                          <span>{Math.round(a.matchScore)}</span>
                        </p>
                        <h4>{a.name}</h4>
                        <p className="act-why">{a.whyFit}</p>
                        <div className="act-meta">
                          <span className="tag">{a.bestTime}</span>
                          <span className="tag">{a.durationHours}h</span>
                          <span className="tag">{a.intensity}</span>
                          <span className="tag warm">{a.estCostPerPerson}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* limitations */}
              {result.limitations?.length > 0 && (
                <div className="limits">
                  <p>What this prototype does not know</p>
                  <ul>
                    {result.limitations.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="foot">
        <span>
          WanderFit · Digital Transformation &amp; AI capstone prototype, IIM Lucknow
        </span>
        <span>Synthetic and illustrative data. Not a booking system.</span>
      </footer>
    </div>
  );
}
