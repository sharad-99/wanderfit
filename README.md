# WanderFit

Cohort-aware itinerary engine. Vibe-coded prototype for the Digital Transformation & AI
capstone (Travel & Tourism).

## The idea

A booking form gives an operator four facts: destination, duration, adults, children.
Everyone gets the same generic activity list anyway. WanderFit uses those four facts to:

1. **Predict the cohort** — romantic getaway, family with young children, solo explorer,
   multigenerational, friends group — with an explicit confidence score and the signals behind it.
2. **Name the trip's theme**, derived from the cohort and the destination.
3. **Build a day-by-day itinerary** sized to the days actually available. Two days is not a
   truncated five-day plan; it is a different, higher-value selection, with the signature
   experience placed on Day 1.

Children's ages are optional. Leave them blank and the engine still runs, assumes an age band,
and visibly drops its confidence — below 65% it states that a production build would route the
booking to a human agent.

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | From aistudio.google.com |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.0-flash` |

If the key is missing or the call fails, the app falls back to a deterministic rule-based engine
and labels itself "Rule-based fallback" in the interface. The demo never goes dark.

Visit `/api/diagnose` on the deployed URL to see exactly why a key is being rejected.

## Stack

Next.js 14 (App Router), no CSS framework. Gemini is called server-side from
`app/api/recommend/route.js`, so the key is never exposed to the browser.

## Disclosure

Application code was generated with an AI coding assistant (Claude) and reviewed by the team.
All activity and cost data is synthetic or illustrative.
