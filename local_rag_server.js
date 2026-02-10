// Minimal local-only chat endpoint for this portfolio.
//
// Usage:
// 1) Install Ollama: https://ollama.com
// 2) Run a model:    ollama run llama3.2
// 3) Start server:   node local_rag_server.js
// 4) In the site, set Chat Settings -> endpoint to:
//    http://127.0.0.1:8787/chat
//
// This is optional. The site also works with local retrieval only (no model).

import http from "node:http";

const PORT = Number(process.env.PORT || 8787);
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/chat";
const MODEL = process.env.OLLAMA_MODEL || "llama3.2";

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function send(res, code, obj) {
  const s = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(s),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(s);
}

function buildPrompt(question, context) {
  const ctx = Array.isArray(context) ? context : [];
  const contextText = ctx
    .map((c, i) => `[#${i + 1}] ${c.title}\n${c.text}${c.url ? `\nURL: ${c.url}` : ""}`)
    .join("\n\n");

  return (
    "You are a resume Q&A assistant. Answer ONLY using the provided resume context. " +
    "If the answer is not in the context, say you don't know and suggest what to ask instead.\n\n" +
    `RESUME CONTEXT:\n${contextText}\n\nQUESTION:\n${question}\n`
  );
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST" || (req.url || "") !== "/chat") return send(res, 404, { error: "Not found" });

  try {
    const body = await readJson(req);
    const question = String(body?.question || "").trim();
    const context = body?.context || [];
    if (!question) return send(res, 400, { error: "Missing question" });

    const prompt = buildPrompt(question, context);

    const ollamaRes = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: [
          { role: "system", content: "Answer only using the provided resume context." },
          { role: "user", content: prompt },
        ],
        options: { temperature: 0.2 },
      }),
    });

    if (!ollamaRes.ok) {
      const t = await ollamaRes.text();
      return send(res, 502, { error: `Ollama returned ${ollamaRes.status}`, detail: t.slice(0, 600) });
    }

    const data = await ollamaRes.json();
    const answer = data?.message?.content || data?.response || "";
    return send(res, 200, { answer });
  } catch (e) {
    return send(res, 500, { error: "Server error", detail: String(e?.message || e) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`local_rag_server listening on http://127.0.0.1:${PORT}/chat`);
});

