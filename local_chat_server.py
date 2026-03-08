#!/usr/bin/env python3
import json
import os
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib import error, request

NOT_AVAILABLE = "That is not available in resume/portfolio context."

PORTFOLIO_DOCS = [
    {
        "source": "profile",
        "text": "Sarika S Shirolkar. Software Engineer focused on AI Agents, ML Systems, and Cloud Applications. Location: Bengaluru, India.",
    },
    {
        "source": "education",
        "text": "B.E (CSE - AI & ML), VTU - Sai Vidya Institute of Technology. CGPA 9.1. Graduation year 2026.",
    },
    {
        "source": "experience",
        "text": "Software Engineer (AI Agents & ML Systems), AI Workflow Automation, Oct 2025 to Present. Built AI voice scheduling workflows using Retell AI, n8n, and Google Calendar. Built Python data services, automated scraping + SQL pipelines, and delivered end-to-end ML execution.",
    },
    {
        "source": "experience",
        "text": "Software Engineer (Cloud Applications), AI Workflow Automation, Mar 2025 to Sep 2025. Deployed backend services on Azure Linux VMs and improved development velocity with AI-assisted development and deployment reliability practices.",
    },
    {
        "source": "experience",
        "text": "AI & ML Intern, Bharat Electronics Limited, Jul 2025 to Sep 2025. Built and evaluated deep learning computer vision systems with preprocessing, training, validation, and error analysis.",
    },
    {
        "source": "experience",
        "text": "Project Intern, IEEE IAMPro'25, Apr 2025 to Sep 2025. Object identification and classification for crime scene imagery.",
    },
    {
        "source": "projects",
        "text": "Key projects: appointo.ai, IBM-Sales-Risk-Prediction-Model, Amazon-Business-Risk-Prediction-Model, retell-calendar-mvp, DAWNVision, Crater-Detection, AI-Research-Agent, Portfolio-Sarika.",
    },
    {
        "source": "skills",
        "text": "Skills: Python, SQL, Java, C, TensorFlow, Keras, Pandas, NumPy, OpenCV, YOLO, LangChain, Streamlit, Azure, Linux, Windows, macOS, MySQL, MongoDB, Power BI, Tableau.",
    },
    {
        "source": "leadership",
        "text": "Leadership: First author of an IEEE conference paper. Chair, IEEE CIS SVIT with workshops, hackathons, and peer mentoring.",
    },
]


def tokenize(text: str):
    return [t for t in re.split(r"[^a-z0-9+.#-]+", text.lower()) if t]


def retrieve_context(question: str, top_k: int = 4):
    q_tokens = tokenize(question)
    if not q_tokens:
        return [], []

    ranked = []
    for doc in PORTFOLIO_DOCS:
        text = doc["text"].lower()
        score = 0
        for tok in q_tokens:
            if tok in text:
                score += 2 if len(tok) > 4 else 1
        if score > 0:
            ranked.append((score, doc))

    ranked.sort(key=lambda x: x[0], reverse=True)
    top_docs = [item[1] for item in ranked[:top_k]]
    sources = []
    for doc in top_docs:
        if doc["source"] not in sources:
            sources.append(doc["source"])
    return top_docs, sources


def ask_ollama(question: str, context_docs):
    context = "\n\n".join(
        [f"[{idx + 1}] ({doc['source']}) {doc['text']}" for idx, doc in enumerate(context_docs)]
    )
    prompt = (
        "You are Sarika's professional portfolio assistant.\n"
        "Use ONLY the provided context.\n"
        f"If answer is missing, respond exactly with: {NOT_AVAILABLE}\n"
        "Keep the answer concise in 2-4 sentences.\n"
        "Prefer concrete facts: role names, dates, tools, outcomes.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}"
    )

    body = {
        "model": os.environ.get("OLLAMA_MODEL", "llama3.2:3b"),
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.1},
    }
    req = request.Request(
        os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434/api/generate"),
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
            data = json.loads(raw)
            answer = str(data.get("response", "")).strip()
            return answer if answer else NOT_AVAILABLE
    except (error.URLError, TimeoutError, json.JSONDecodeError):
        return "Local model is unavailable. Start Ollama and pull the model first."


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, payload, status=200):
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self):
        self._send_json({}, 204)

    def do_POST(self):
        if self.path not in ("/", "/chat"):
            self._send_json({"error": "Not found"}, 404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            question = str(body.get("question", "")).strip()
        except (ValueError, json.JSONDecodeError):
            self._send_json({"error": "Invalid JSON body"}, 400)
            return

        if not question:
            self._send_json({"error": "Question is required"}, 400)
            return
        if len(question) > 500:
            self._send_json({"error": "Question too long"}, 400)
            return

        docs, sources = retrieve_context(question)
        if not docs:
            self._send_json({"answer": NOT_AVAILABLE, "sources": []}, 200)
            return

        answer = ask_ollama(question, docs)
        self._send_json({"answer": answer, "sources": sources}, 200)


if __name__ == "__main__":
    host = os.environ.get("CHAT_HOST", "127.0.0.1")
    port = int(os.environ.get("CHAT_PORT", "8008"))
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Local chat server running on http://{host}:{port}")
    print("POST /chat with JSON: {\"question\":\"...\"}")
    server.serve_forever()
