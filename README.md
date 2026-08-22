# WanderFit

Party-aware activity recommendation engine. Built as the vibe-coded prototype for the
Digital Transformation & AI capstone (Travel & Tourism).

## What it does

Takes the signals already present on a booking form — party composition, ages, trip length,
budget, pace, themes — and does two things:

1. **Infers the travel segment** (romantic getaway, family with young children, solo explorer,
   multigenerational, and so on) with an explicit confidence score and the signals that drove it.
2. **Recommends six activities** that follow from that segment, each with a reason tied to the
   party's actual facts, a match score, duration, intensity and cost band.

A human agent can override the inferred segment at any time and re-run — the machine predicts,
the agent decides.

## Running it

Deployed on Vercel. Set one environment variable:

| Name | Value |
| --- | --- |
| `GEMINI_API_KEY` | Your key from aistudio.google.com |
| `GEMINI_MODEL` | Optional. Defaults to `gemini-2.0-flash`. |

If the key is missing or the model call fails, the app falls back to a deterministic rule-based
engine and labels itself "Offline rules" in the interface. The demo never goes dark.

## Stack

Next.js 14 (App Router), no CSS framework, Gemini API called server-side from
`app/api/recommend/route.js`. The key is never exposed to the browser.

## Disclosure

Application code was generated with an AI coding assistant (Claude) and reviewed by the team.
All activity data is synthetic or illustrative.
