# Portfolio-Sarika

A static single-page portfolio for Sarika S Shirolkar, built with plain HTML, CSS, and JavaScript.

## Live Site

- `https://sarikashirolkar.github.io/Portfolio-Sarika/`

## Project Files

- `index.html`: page structure and resume content
- `styles.css`: visual design, layout, and responsive behavior
- `script.js`: scroll reveal, active nav, projects carousel, AI assistant interactions
- `resume.pdf`: downloadable resume
- `cloudflare/worker.js`: OpenAI-backed chatbot worker with portfolio knowledge base
- `cloudflare/wrangler.toml.example`: Cloudflare Worker config template
- `cloudflare/package.json`: Worker dependencies (LangChain + Wrangler)

## Run Locally

Open `index.html` directly or run a local server:

```sh
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## AI About Me Assistant

The site includes an AI assistant section.

How it works:
- Frontend chat UI is in `index.html` + `styles.css` + `script.js`
- Responses are always in third-person assistant POV (e.g. "Sarika built...", "Sarika works at...")
- If no API endpoint is configured, it uses a local resume-based fallback response map
- For grounded AI answers, connect to the Cloudflare Worker backend (OpenAI)

### Local Ollama Setup (No Paid API Key)

This option runs fully local with an open-source model through Ollama.

1. Start Ollama:

```sh
ollama serve
```

2. Pull a model once (example):

```sh
ollama pull llama3.2:3b
```

3. Start local backend from repo root:

```sh
python3 local_chat_server.py
```

4. Point frontend chat endpoint to local server:

```html
<body data-chat-api-url="http://127.0.0.1:8008/chat">
```

or

```html
<script>window.CHAT_API_URL = "http://127.0.0.1:8008/chat";</script>
```

Optional environment vars for the local backend:
- `OLLAMA_MODEL` (default: `llama3.2:3b`)
- `OLLAMA_URL` (default: `http://127.0.0.1:11434/api/generate`)
- `CHAT_HOST` (default: `127.0.0.1`)
- `CHAT_PORT` (default: `8008`)

### Configure Frontend Endpoint

Set your Worker URL in either one:

1. `index.html` body attribute:

```html
<body data-chat-api-url="https://your-worker.your-subdomain.workers.dev">
```

2. or set global variable before loading `script.js`:

```html
<script>window.CHAT_API_URL = "https://your-worker.your-subdomain.workers.dev";</script>
```

### Cloudflare Worker Setup

From `cloudflare/`:

1. Copy `wrangler.toml.example` to `wrangler.toml`
2. Install dependencies:

```sh
npm install
```

3. Login to Wrangler:

```sh
wrangler login
```

4. Set your secret API key:

```sh
wrangler secret put OPENAI_API_KEY
```

5. Deploy:

```sh
wrangler deploy
```

6. Put deployed Worker URL into `data-chat-api-url` in `index.html`

Optional vars in `wrangler.toml`:
- `OPENAI_MODEL` (default: `gpt-5-mini`)
- `EMBEDDING_MODEL` (default: `text-embedding-3-small`)
- `ALLOWED_ORIGIN` (set to your site origin for strict CORS)

## Deploy to GitHub Pages

1. Go to repository `Settings` -> `Pages`.
2. Set source to `Deploy from a branch`.
3. Select `main` and folder `/ (root)`.
4. Save and wait for deployment.

## Updating Content

- Resume text and sections: `index.html`
- Styling/theme: `styles.css`
- Interactions: `script.js`
- Chat backend behavior: `cloudflare/worker.js`
- New resume file: replace `resume.pdf` (same filename)
