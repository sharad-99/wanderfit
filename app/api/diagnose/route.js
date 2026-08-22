export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash",
].filter(Boolean);

export async function GET() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return Response.json({
      keyPresent: false,
      verdict: "No GEMINI_API_KEY reached the server.",
      fix: "Vercel → Project → Settings → Environment Variables. Add GEMINI_API_KEY, tick Production, then Deployments → latest → Redeploy. Environment variables only apply to builds made after they are added.",
      models: [],
    });
  }

  const shape = {
    length: key.length,
    startsWithAIza: key.startsWith("AIza"),
    hasWhitespace: /\s/.test(key),
    hasQuotes: /["']/.test(key),
    preview: `${key.slice(0, 6)}…${key.slice(-4)}`,
  };

  const models = [];
  for (const model of CANDIDATES) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Reply with the single word: ok" }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        }
      );
      const body = await res.json().catch(() => ({}));
      models.push({
        model,
        status: res.status,
        ok: res.ok,
        message: body?.error?.message?.slice(0, 220) || (res.ok ? "responded" : "no message"),
      });
      if (res.ok) break;
    } catch (err) {
      models.push({ model, status: 0, ok: false, message: err.message?.slice(0, 220) });
    }
  }

  const working = models.find((m) => m.ok);
  const first = models[0] || {};

  let verdict, fix;
  if (working) {
    verdict = `Key works. ${working.model} responded normally.`;
    fix = "Nothing to fix. If the app still shows the fallback, redeploy so the running build picks up the variable.";
  } else if (shape.hasWhitespace || shape.hasQuotes) {
    verdict = "The stored key contains quotes or whitespace.";
    fix = "Re-paste the key with no surrounding quotes and no trailing space or newline, then redeploy.";
  } else if (first.status === 400) {
    verdict = "Google rejected the key as malformed.";
    fix = "The value looks truncated or altered. Copy it again from aistudio.google.com and re-paste.";
  } else if (first.status === 403) {
    verdict = "Key was recognised but access is denied.";
    fix = "Usually the Generative Language API is disabled on that Cloud project, or the key has referrer restrictions. Create a fresh key in a new project from aistudio.google.com.";
  } else if (first.status === 429) {
    verdict = "Free-tier rate limit hit.";
    fix = "Wait sixty seconds and retry. Avoid rapid repeated runs during rehearsal.";
  } else if (first.status === 404) {
    verdict = "No candidate model name was available to this key.";
    fix = "Set a GEMINI_MODEL environment variable to a model your key can reach, then redeploy.";
  } else {
    verdict = "Every model attempt failed.";
    fix = "Read the message field below — it is Google's own error text.";
  }

  return Response.json({ keyPresent: true, shape, models, verdict, fix });
}
