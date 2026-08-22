"use client";

import { useState } from "react";

const PRESETS = {
  couple: {
    label: "2 adults, 4 days",
    form: { destination: "Bali, Indonesia", duration: 4, adults: 2, children: 0, childAges: [] },
  },
  family: {
    label: "Family, 2 days",
    form: { destination: "Singapore", duration: 2, adults: 2, children: 2, childAges: [9, 6] },
  },
  solo: {
    label: "Solo, 5 days",
    form: { destination: "Kyoto, Japan", duration: 5, adults: 1, children: 0, childAges: [] },
  },
};

export default function Page() {
  const [form, setForm] = useState(PRESETS.family.form);
  const [result, setResult] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const setChildren = (n) =>
    setForm((f) => ({ ...f, children: n, childAges: f.childAges.slice(0, n) }));

  const setAge = (i, v) =>
    setForm((f) => {
      const a = [...f.childAges];
      a[i] = v === "" ? "" : Number(v);
      return { ...f, childAges: a };
    });

  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          childAges: form.childAges.filter((a) => a !== "" && !Number.isNaN(a)),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "The engine could not complete this request.");
        setLoading(false);
        return;
      }
      setResult(data);
      setActiveDay(0);
    } catch {
      setError("The engine could not be reached. Check your connection and run it again.");
    }
    setLoading(false);
  }

  const days = result?.days || [];
  const day = days[activeDay];
  const totalActs = days.reduce((s, d) => s + (d.slots?.length || 0), 0);
  const conf = Math.round((result?.cohort?.confidence || 0) * 100);

  return (
    <div className="shell">
      <header className="masthead">
        <h1 className="wordmark">
          Wander<span>Fit</span>
        </h1>
        <p className="masthead-note">Capstone prototype · Travel &amp; Tourism · Use case #1</p>
      </header>

      <section className="thesis">
        <h2>
          Four facts. That is all it takes to know <em>what kind of trip</em> this is.
        </h2>
        <p>
          Where they are going, for how long, and who is going. From that alone WanderFit predicts the
          cohort and its theme, then builds the day-by-day itinerary that gets the most out of the days
          they actually have — with the confidence shown, never hidden.
        </p>
      </section>

      <div className="workbench">
        {/* ---------- input ---------- */}
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <div className="panel-head">
            <p className="eyebrow">Booking form</p>
            <div className="chips">
              {Object.entries(PRESETS).map(([k, p]) => (
                <button
                  key={k}
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
                placeholder="Jaipur, India"
              />
            </div>

            <div className="field">
              <label htmlFor="dur">Duration (days)</label>
              <input
                id="dur"
                className="control"
                type="number"
                min="1"
                max="7"
                value={form.duration}
                onChange={(e) => set("duration", Number(e.target.value))}
              />
              <p className="hint">
                The engine plans for exactly this many days — fewer days means harder choices, not a
                shorter version of the same list.
              </p>
            </div>

            <div className="field row2">
              <div>
                <label htmlFor="ad">Adults</label>
                <input
                  id="ad"
                  className="control"
                  type="number"
                  min="1"
                  max="12"
                  value={form.adults}
                  onChange={(e) => set("adults", Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="ch">Children</label>
                <input
                  id="ch"
                  className="control"
                  type="number"
                  min="0"
                  max="10"
                  value={form.children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                />
              </div>
            </div>

            {form.children > 0 && (
              <div className="field">
                <label>Ages of children — optional</label>
                <div className="ages">
                  {Array.from({ length: form.children }).map((_, i) => (
                    <input
                      key={i}
                      className="age-input"
                      type="number"
                      min="0"
                      max="17"
                      placeholder="?"
                      aria-label={`Child ${i + 1} age`}
                      value={form.childAges[i] ?? ""}
                      onChange={(e) => setAge(i, e.target.value)}
                    />
                  ))}
                  {form.childAges.some((a) => a !== "") && (
                    <button type="button" className="linkish" onClick={() => set("childAges", [])}>
                      Clear
                    </button>
                  )}
                </div>
                <p className="hint">
                  Leave blank and the engine still runs — it will assume an age band and drop its
                  confidence to show you it is guessing.
                </p>
              </div>
            )}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? "Reading the party…" : "Predict theme and build itinerary"}
            </button>
          </div>
        </form>

        {/* ---------- output ---------- */}
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
              <div className="skeleton" style={{ height: 64 }} />
              <div className="skeleton" style={{ height: 260 }} />
            </>
          )}

          {!loading && !result && !error && (
            <div className="empty">
              <h3>Nothing predicted yet</h3>
              <p>
                Load one of the three sample bookings, or type your own. The cohort call appears here
                first, then the theme, then the itinerary that follows from both.
              </p>
            </div>
          )}

          {!loading && result && (
            <>
              <div className="stub">
                <div className="stub-top">
                  <div>
                    <p className="stub-code">
                      {result.cohort.code}
                      {result.cohort.runnerUp ? ` · runner-up ${result.cohort.runnerUp}` : ""}
                    </p>
                    <h3 className="stub-label">{result.cohort.label}</h3>
                    <p className="stub-rationale">{result.cohort.rationale}</p>
                  </div>
                  <div className="conf">
                    <div className="conf-label">
                      <span>Confidence</span>
                      <span>{conf}%</span>
                    </div>
                    <div className="conf-track">
                      <div className="conf-fill" style={{ width: `${conf}%` }} />
                    </div>
                    <div className="signals">
                      {(result.cohort.signals || []).map((s, i) => (
                        <span key={i} className="signal">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="stub-foot">
                  <p>
                    {conf < 65
                      ? "Below 65% — a production build would route this to a human agent."
                      : "Machine predicts. Agent keeps the final say."}
                  </p>
                  <span className={`mode-flag${result.mode === "live" ? " live" : ""}`}>
                    {result.mode === "live" ? `AI · ${result.model}` : "Rule-based fallback"}
                  </span>
                </div>
              </div>

              <div className="theme-bar">
                <h4>{result.theme.primary}</h4>
                <span className="sec">with {result.theme.secondary}</span>
                <p>{result.theme.why}</p>
              </div>

              <dl className="kpis">
                <div className="kpi">
                  <dt>Days planned</dt>
                  <dd>
                    {days.length}
                    <small>{totalActs} activities scheduled</small>
                  </dd>
                </div>
                <div className="kpi">
                  <dt>Cost per person</dt>
                  <dd style={{ fontSize: 20 }}>
                    {result.budget?.perPersonTotal}
                    <small>group {result.budget?.groupTotal}</small>
                  </dd>
                </div>
                <div className="kpi">
                  <dt>Planning time</dt>
                  <dd>
                    ~15s
                    <small>versus hours of manual research</small>
                  </dd>
                </div>
              </dl>

              <div className="panel">
                <div className="panel-head">
                  <p className="eyebrow">Day-by-day itinerary</p>
                  <div className="daytabs">
                    {days.map((d, i) => (
                      <button
                        key={i}
                        type="button"
                        className="daytab"
                        aria-selected={i === activeDay}
                        onClick={() => setActiveDay(i)}
                      >
                        Day {d.dayNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {day && (
                  <div className="panel-body">
                    <div className="dayhead">
                      <h3>{day.title}</h3>
                      <span>
                        {day.slots.length} activities ·{" "}
                        {day.slots.reduce((s, x) => s + (x.durationHours || 0), 0)}h
                      </span>
                    </div>

                    <div className="timeline">
                      {day.slots.map((s, i) => (
                        <div className="slot" key={i}>
                          <p className="slot-time">
                            {s.time} · {s.category}
                          </p>
                          <h5>
                            <span>{s.name}</span>
                            <b>value {Math.round(s.valueScore)}</b>
                          </h5>
                          <p>{s.whyFit}</p>
                          <div className="act-meta">
                            <span className="tag">{s.durationHours}h</span>
                            <span className="tag">{s.intensity}</span>
                            <span className="tag warm">{s.estCostPerPerson}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {result.budget?.note && (
                <p className="hint" style={{ margin: 0 }}>
                  {result.budget.note}
                </p>
              )}

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
        <span>WanderFit · Digital Transformation &amp; AI capstone prototype, IIM Lucknow</span>
        <span>Synthetic and illustrative data. Not a booking system.</span>
      </footer>
    </div>
  );
}
