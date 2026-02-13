# Portfolio-Sarika

A static single-page portfolio for Sarika S Shirolkar, built with plain HTML, CSS, and JavaScript.

## Live Site

- `https://sarikashirolkar.github.io/Portfolio-Sarika/`

## Project Files

- `index.html`: page structure and resume content
- `styles.css`: visual design, layout, and responsive behavior
- `script.js`: scroll reveal, active nav, projects carousel, AI assistant interactions
- `resume.pdf`: downloadable resume
- `cloudflare/worker.js`: secure OpenAI proxy for chatbot
- `cloudflare/wrangler.toml.example`: Cloudflare Worker config template

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
- If no API endpoint is configured, it uses a local resume-based fallback response map
- For live ChatGPT answers, connect to the Cloudflare Worker backend

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
2. Install Wrangler and login:

```sh
npm i -g wrangler
wrangler login
```

3. Set your secret API key:

```sh
wrangler secret put OPENAI_API_KEY
```

4. Deploy:

```sh
wrangler deploy
```

5. Put deployed Worker URL into `data-chat-api-url` in `index.html`

Optional vars in `wrangler.toml`:
- `OPENAI_MODEL` (default: `gpt-5-mini`)
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
