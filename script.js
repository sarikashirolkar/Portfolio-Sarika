/* global HTMLDialogElement */

const STORAGE = {
  endpoint: "rag_endpoint",
  openaiKey: "rag_openai_key",
  theme: "theme_preference",
};

const COMPANY = {
  name: "AI Workflow Automation",
  url: "https://aiworkflowautomate.com",
};

// Resume-only knowledge base (no phone number). Keep this small + factual.
// Source: Sarika_SDE1.pdf (extracted via pdftotext).
const RESUME_CHUNKS = [
  {
    id: "exp_jmle_now",
    title: `Junior Machine Learning Engineer — ${COMPANY.name} (Oct 2025 – Present)`,
    text:
      "Currently developing an AI voice scheduling agent for a France-based dental clinic using Retell AI, n8n, and Google Calendar. Enables automated appointment booking, rescheduling, cancellation, and availability checks via phone calls with real-time calendar updates.",
    url: COMPANY.url,
  },
  {
    id: "exp_jmle_models",
    title: `Junior Machine Learning Engineer — ${COMPANY.name}`,
    text:
      "Developed ML models (scikit-learn) to predict key business drivers from historical data, supporting forecasting and decision-making for U.S. stakeholders.",
    url: COMPANY.url,
  },
  {
    id: "exp_jmle_pipelines",
    title: `Junior Machine Learning Engineer — ${COMPANY.name}`,
    text:
      "Built automated data pipelines (web scraping + SQL) to collect, clean, and preprocess structured datasets for ML and analytics workflows. Owned end-to-end ML execution: framing, feature engineering, training, evaluation (metrics, error analysis), and delivery into dashboards.",
    url: COMPANY.url,
  },
  {
    id: "exp_cloud_azure",
    title: `Software Engineer (Cloud Applications) — ${COMPANY.name} (Mar 2025 – Sep 2025)`,
    text:
      "Designed, deployed, and maintained Python applications on Microsoft Azure (Linux VMs, App Services) focusing on scalability, reliability, and secure configuration. Standardized deployment practices to reduce operational issues.",
    url: COMPANY.url,
  },
  {
    id: "exp_bel",
    title: "AI & ML Intern — Bharat Electronics Limited (Jul 2025 – Sep 2025)",
    text:
      "Developed and evaluated computer vision systems using deep learning. Performed dataset preprocessing, training, validation, and error analysis to improve reliability under real-world conditions.",
  },
  {
    id: "exp_ieee",
    title: "Project Intern — IEEE IAMPro'25 (Apr 2025 – Sep 2025)",
    text: "Project internship with IEEE IAMPro'25.",
  },
  {
    id: "lead_ieee_pub",
    title: "IEEE Publication",
    text:
      "First author of a peer-reviewed paper published at an IEEE International Conference on applied object detection for autonomous systems.",
  },
  {
    id: "lead_ieee_cis_chair",
    title: "Chair, IEEE CIS SVIT",
    text: "Led ML workshops and hackathons; mentored peers on applied ML pipelines and experimentation.",
  },
  {
    id: "lead_ui_team_lead",
    title: "U&I Team Leader",
    text:
      "Raised 10,000 and taught Mathematics, Science, and soft skills to underprivileged communities.",
  },
  {
    id: "award_ideathon",
    title: "Ideathon (E-Cell SVIT) — 3rd Place (Oct 21, 2022)",
    text: "Placed 3rd at E-Cell SVIT Ideathon (Oct 21, 2022).",
  },
  {
    id: "proj_yolo_ieee",
    title: "Secure Object Identification for Autonomous Systems (YOLOv8) — IEEE Publication",
    text:
      "Designed and evaluated a YOLOv8-based real-time object detection system under adverse weather conditions. Conducted benchmarking, error analysis, and performance validation; published in an IEEE International Conference.",
    url: "https://github.com/sarikashirolkar/Secure-Identification-of-Autonomous-Vehicles",
  },
  {
    id: "proj_voice_agent",
    title: "AI Voice Scheduling Agent for Dental Clinics",
    text:
      "Developed an end-to-end AI voice agent using Retell AI, n8n, and Google Calendar to autonomously book, reschedule, cancel appointments, and check availability via phone calls. Implemented structured AI outputs, webhook-driven workflows, and real-time calendar sync.",
    url: "https://drive.google.com/file/d/1e5rg6Ll0rzpui_2mAxQJ2MkeFIDcRYk8/view?usp=sharing",
  },
  {
    id: "proj_risk",
    title: "Business Risk Prediction Model",
    text:
      "Built a supervised ML model on historical transactional-style data to predict high-risk records. Performed feature engineering, handled class imbalance, evaluated with precision/recall and PR-focused analysis, and optimized thresholds for business impact.",
    url: "https://github.com/sarikashirolkar/Amazon-Business-Risk-Prediction-Model",
  },
  {
    id: "proj_research_agent",
    title: "AI Research Agent (LangChain + Streamlit)",
    text:
      "Built an AI research assistant that autonomously gathers sources, summarizes findings, and generates structured outputs with tool integration for faster research workflows.",
    url: "https://github.com/sarikashirolkar/AI-Research-Agent",
  },
  {
    id: "proj_resume_builder",
    title: "Resume Builder Deployment (Azure App Service)",
    text:
      "Deployed a resume-builder application on Azure App Services with scalable hosting and cloud-ready configuration.",
    url: "https://github.com/sarikashirolkar/Resume-Builder",
  },
  {
    id: "proj_crater",
    title: "Crater Detection Model",
    text:
      "Developed a computer vision model to detect lunar/Martian craters and evaluate detection performance on image datasets.",
    url: "https://github.com/sarikashirolkar/Crater-Detection",
  },
  {
    id: "skills",
    title: "Technical Skills",
    text:
      "Programming: Python, SQL, Java, C. AI/ML: classification, regression, clustering, feature engineering, model evaluation, error analysis. GenAI: LangChain, prompt-driven workflows. Deep Learning/CV: CNNs, YOLOv8, Transformers, OpenCV. Libraries: scikit-learn, TensorFlow, Keras, Pandas, NumPy, Matplotlib, Streamlit, BeautifulSoup. Cloud: Azure (VMs, App Services, Blob Storage), Linux. Data/Visualization: Power BI, Tableau. Databases: MySQL, MongoDB. Tools: Git, VS Code, Jupyter, Colab, Kaggle. OS: Windows, Linux, macOS.",
  },
  {
    id: "edu",
    title: "Education",
    text:
      "B.E (CSE — AI & ML), 2026, VTU - Sai Vidya Institute of Technology, CGPA 9.1. Science (PCMC, CBSE), 2022, Kendriya Vidyalaya CRPF, 77.7%. 10th Grade, 2020, St. John's School Kempapura, 96.1%.",
  },
];

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+/#\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t && t.length > 1);
}

function buildTfIdf(chunks) {
  const docs = chunks.map((c) => tokenize(`${c.title}\n${c.text}`));
  const df = new Map();
  for (const tokens of docs) {
    const seen = new Set(tokens);
    for (const t of seen) df.set(t, (df.get(t) || 0) + 1);
  }
  const N = docs.length;
  const idf = new Map();
  for (const [t, d] of df.entries()) {
    idf.set(t, Math.log((N + 1) / (d + 1)) + 1);
  }
  const tf = docs.map((tokens) => {
    const m = new Map();
    for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
    return m;
  });
  return { tf, idf };
}

const TFIDF = buildTfIdf(RESUME_CHUNKS);

function scoreChunk(queryTokens, idx) {
  const tf = TFIDF.tf[idx];
  let score = 0;
  for (const t of queryTokens) {
    const f = tf.get(t) || 0;
    if (!f) continue;
    score += (1 + Math.log(f)) * (TFIDF.idf.get(t) || 0);
  }
  // small title boost
  const titleTokens = new Set(tokenize(RESUME_CHUNKS[idx].title));
  for (const t of queryTokens) if (titleTokens.has(t)) score += 0.15;
  return score;
}

function retrieve(query, k = 4) {
  const qt = tokenize(query);
  if (!qt.length) return [];
  const scored = RESUME_CHUNKS.map((c, i) => ({ c, s: scoreChunk(qt, i) })).filter((x) => x.s > 0);
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, k).map((x) => x.c);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function addMsg(log, role, html) {
  const el = document.createElement("div");
  el.className = "msg";
  const badge = document.createElement("div");
  badge.className = `msg__role ${role === "me" ? "msg__role--me" : ""}`;
  badge.textContent = role === "me" ? "Me" : "AI";
  const bubble = document.createElement("div");
  bubble.className = "msg__bubble";
  bubble.innerHTML = html;
  el.appendChild(badge);
  el.appendChild(bubble);
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

function formatCitations(chunks) {
  if (!chunks.length) return "";
  const items = chunks
    .map((c) => {
      const link = c.url ? ` · <a href="${escapeHtml(c.url)}" target="_blank" rel="noreferrer">link</a>` : "";
      return `<div>• <strong>${escapeHtml(c.title)}</strong>${link}</div>`;
    })
    .join("");
  return `<div class="cite"><div style="font-weight:900; margin-bottom:6px;">Matched resume excerpts</div>${items}</div>`;
}

function answerFromChunks(opts) {
  const title = opts && opts.title ? String(opts.title) : "";
  const chunks = (opts && opts.chunks) || [];
  const intro = opts && opts.intro ? String(opts.intro) : "";
  const body = chunks
    .map((c) => `<p>${escapeHtml(c.text)}</p>`)
    .join("");
  const head = title ? `<p style="font-weight:950; margin:0 0 10px;">${escapeHtml(title)}</p>` : "";
  const pre = intro ? `<p>${escapeHtml(intro)}</p>` : "";
  return { html: `${head}${pre}${body}${formatCitations(chunks)}`, citations: chunks };
}

function intentLabel(intent) {
  const m = {
    professional_summary: "Professional summary",
    who_am_i: "Who am i",
    outside_resume: "Outside the resume",
    ml_projects: "ML projects",
    azure_projects: "Azure projects",
    agentic_ai_projects: "Agentic AI projects",
    ieee_publications: "IEEE paper publications",
    chair_ieee_cis_svit: "Chair, IEEE CIS SVIT",
  };
  return m[intent] || intent;
}

function localIntent(intent) {
  const byId = new Map(RESUME_CHUNKS.map((c) => [c.id, c]));
  const pick = (ids) => ids.map((id) => byId.get(id)).filter(Boolean);

  switch (intent) {
    case "professional_summary":
      return answerFromChunks({
        title: "Professional summary (from resume)",
        chunks: pick(["exp_jmle_now", "exp_jmle_pipelines", "exp_cloud_azure", "exp_bel", "lead_ieee_cis_chair"]),
      });
    case "who_am_i":
      return answerFromChunks({
        title: "who am i",
        chunks: pick(["exp_jmle_now", "exp_jmle_pipelines", "exp_cloud_azure", "exp_bel", "lead_ieee_cis_chair"]),
      });  
    case "ml_projects":
      return answerFromChunks({
        title: "ML projects",
        chunks: pick(["proj_yolo_ieee", "proj_risk", "proj_crater"]),
      });
    case "azure_projects":
      return answerFromChunks({
        title: "Azure work and projects",
        chunks: pick(["exp_cloud_azure", "proj_resume_builder", "exp_jmle_pipelines"]),
      });
    case "agentic_ai_projects":
      return answerFromChunks({
        title: "Agentic AI projects",
        chunks: pick(["exp_jmle_now", "proj_voice_agent", "proj_research_agent"]),
      });
    case "ieee_publications":
      return answerFromChunks({
        title: "IEEE publications",
        chunks: pick(["lead_ieee_pub", "proj_yolo_ieee"]),
      });
    case "chair_ieee_cis_svit":
      return answerFromChunks({
        title: "Leadership: Chair, IEEE CIS SVIT",
        chunks: pick(["lead_ieee_cis_chair"]),
      });
    case "outside_resume":
      return {
        html:
          "<p>I can only answer using your resume + this portfolio. For \"outside the resume\", check the Profile section for photos (events, hackathons, teams, internships, and trekking).</p>",
        citations: [],
      };
    default:
      return null;
  }
}

function localAnswer(q) {
  const top = retrieve(q, 5);
  if (!top.length) {
    return {
      html:
        "<p>I can only answer using your resume data. I couldn't find a close match for that question. Try asking about roles, Azure, projects, or skills.</p>",
      citations: [],
    };
  }

  const bullets = top
    .slice(0, 3)
    .map((c) => `<p>${escapeHtml(c.text)}</p>`)
    .join("");

  return {
    html: `${bullets}${formatCitations(top)}`,
    citations: top,
  };
}

async function endpointAnswer(endpoint, q) {
  const ctx = retrieve(q, 6).map((c) => ({
    id: c.id,
    title: c.title,
    text: c.text,
    url: c.url || null,
  }));

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: q,
      context: ctx,
      metadata: { site: "portfolio", owner: "sarika" },
    }),
  });
  if (!res.ok) throw new Error(`Endpoint returned ${res.status}`);
  const data = await res.json();
  const answer = (data && (data.answer || data.text || data.message)) || "";
  return {
    html: `<p>${escapeHtml(answer)}</p>${formatCitations(ctx)}`,
    citations: ctx,
  };
}

async function openAiAnswer(apiKey, q) {
  // Minimal client-side chat (BYOK). This keeps the site static, but the key lives in the browser.
  const ctx = retrieve(q, 6);
  const contextText = ctx
    .map((c, i) => `[#${i + 1}] ${c.title}\n${c.text}${c.url ? `\nURL: ${c.url}` : ""}`)
    .join("\n\n");

  const prompt =
    "You are a resume Q&A assistant. Answer ONLY using the provided resume context. " +
    "If the answer is not in the context, say you don't know and suggest what to ask instead.\n\n" +
    `RESUME CONTEXT:\n${contextText}\n\nQUESTION:\n${q}\n`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You answer based only on the resume context." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI returned ${res.status}`);
  const data = await res.json();
  const answer = data?.choices?.[0]?.message?.content || "";
  return { html: `<p>${escapeHtml(answer)}</p>${formatCitations(ctx)}`, citations: ctx };
}

function setModeLabel() {
  const mode = $("#chat-mode");
  if (!mode) return;
  const endpoint = localStorage.getItem(STORAGE.endpoint) || "";
  const key = localStorage.getItem(STORAGE.openaiKey) || "";
  if (endpoint) mode.textContent = "Mode: Resume RAG (endpoint)";
  else if (key) mode.textContent = "Mode: Resume RAG (OpenAI BYOK)";
  else mode.textContent = "Mode: Resume-only (local)";
}

function initChat() {
  const log = $("#chat-log");
  const form = $("#chat-form");
  const input = $("#chat-input");
  if (!log || !form || !input) return;

  addMsg(
    log,
    "ai",
    `<p>Ask me anything about my experience, projects, Azure work, and skills. I will only use my resume to answer.</p>`
  );
  setModeLabel();

  async function respond(q) {
    const endpoint = (localStorage.getItem(STORAGE.endpoint) || "").trim();
    const key = (localStorage.getItem(STORAGE.openaiKey) || "").trim();

    addMsg(log, "me", `<p>${escapeHtml(q)}</p>`);

    const thinking = document.createElement("div");
    thinking.className = "msg";
    thinking.innerHTML =
      `<div class="msg__role">AI</div>` +
      `<div class="msg__bubble"><p class="msg__thinking">Thinking...</p></div>`;
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;

    try {
      let out;
      if (endpoint) out = await endpointAnswer(endpoint, q);
      else if (key) out = await openAiAnswer(key, q);
      else out = localAnswer(q);
      thinking.remove();
      addMsg(log, "ai", out.html);
    } catch (e) {
      console.error(e);
      thinking.remove();
      const fallback = localAnswer(q);
      addMsg(
        log,
        "ai",
        `<p>I couldn't reach the AI chat provider, so I switched to local resume excerpts.</p>${fallback.html}`
      );
    }
  }

  async function respondIntent(intent) {
    const label = intentLabel(intent);
    addMsg(log, "me", `<p><strong>${escapeHtml(label)}</strong></p>`);
    const thinking = document.createElement("div");
    thinking.className = "msg";
    thinking.innerHTML =
      `<div class="msg__role">AI</div>` +
      `<div class="msg__bubble"><p class="msg__thinking">Thinking...</p></div>`;
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;

    try {
      const out = localIntent(intent) || localAnswer(label);
      thinking.remove();
      addMsg(log, "ai", out.html);
    } catch (e) {
      console.error(e);
      thinking.remove();
      addMsg(log, "ai", `<p>Something went wrong rendering that option.</p>`);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    await respond(q);
  });

  $all(".pill").forEach((b) => {
    b.addEventListener("click", async () => {
      const intent = (b.getAttribute("data-intent") || "").trim();
      if (intent) return respondIntent(intent);
      const q = (b.getAttribute("data-q") || "").trim();
      if (!q) return;
      return respond(q);
    });
  });
}

function initNavActive() {
  const rootEl = $(".snap");
  const links = $all('.nav__links a[href^="#"]');
  if (!links.length) return;
  const targets = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if (!targets.length) return;

  const map = new Map(targets.map((t, i) => [t, links[i]]));
  // If the main container isn't a scroller, let IntersectionObserver use the viewport.
  const rootStyle = rootEl ? getComputedStyle(rootEl) : null;
  const root =
    rootEl && rootStyle && rootStyle.overflowY !== "visible" && rootStyle.overflowY !== "unset" ? rootEl : null;
  const io = new IntersectionObserver(
    (entries) => {
      const v = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (!v) return;
      const a = map.get(v.target);
      if (!a) return;
      links.forEach((x) => x.classList.remove("active"));
      a.classList.add("active");
    },
    { root, threshold: [0.25, 0.4, 0.6], rootMargin: "-10% 0px -70% 0px" }
  );
  targets.forEach((t) => io.observe(t));
}

function initReveal() {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rootEl = $(".snap");
  const rootStyle = rootEl ? getComputedStyle(rootEl) : null;
  const root =
    rootEl && rootStyle && rootStyle.overflowY !== "visible" && rootStyle.overflowY !== "unset" ? rootEl : null;
  const marked = $all("[data-reveal]");
  const els = marked.length
    ? marked
    : [
        ...$all(".hero__copy"),
        ...$all(".chat"),
        ...$all(".panel"),
        ...$all(".sectionHead"),
        ...$all(".card"),
        ...$all(".tile"),
        ...$all(".skillStage"),
        ...$all(".contactCard"),
      ];
  if (!els.length) return;

  els.forEach((el) => el.classList.add("reveal"));

  if (reduce) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { root, threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

function initCarousel() {
  const el = $("#carousel");
  if (!el) return;
  const imgs = $all(".carousel__img", el);
  const dots = $(".carousel__dots", el);
  if (!imgs.length || !dots) return;

  dots.innerHTML = "";
  const dotEls = imgs.map(() => {
    const d = document.createElement("div");
    d.className = "dot";
    dots.appendChild(d);
    return d;
  });

  let idx = 0;
  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    imgs.forEach((im, k) => im.classList.toggle("is-active", k === idx));
    dotEls.forEach((d, k) => d.classList.toggle("is-active", k === idx));
  }
  show(0);

  const everyMs = 3700;
  let timer = window.setInterval(() => show(idx + 1), everyMs);

  el.addEventListener("pointerdown", () => {
    // Manual interaction: advance and reset interval.
    show(idx + 1);
    window.clearInterval(timer);
    timer = window.setInterval(() => show(idx + 1), everyMs);
  });
}

function initModal() {
  const dlg = $("#modal");
  const btn = $("#chat-settings");
  const endpoint = $("#endpoint");
  const openaiKey = $("#openaiKey");
  const save = $("#saveSettings");
  const clear = $("#clearSettings");
  if (!dlg || !btn || !endpoint || !openaiKey || !save || !clear) return;

  const open = () => {
    endpoint.value = localStorage.getItem(STORAGE.endpoint) || "";
    openaiKey.value = localStorage.getItem(STORAGE.openaiKey) || "";
    if (typeof dlg.showModal === "function") dlg.showModal();
  };
  btn.addEventListener("click", open);

  save.addEventListener("click", () => {
    const ep = endpoint.value.trim();
    const key = openaiKey.value.trim();
    if (ep) localStorage.setItem(STORAGE.endpoint, ep);
    else localStorage.removeItem(STORAGE.endpoint);
    if (key) localStorage.setItem(STORAGE.openaiKey, key);
    else localStorage.removeItem(STORAGE.openaiKey);
    setModeLabel();
  });

  clear.addEventListener("click", () => {
    localStorage.removeItem(STORAGE.endpoint);
    localStorage.removeItem(STORAGE.openaiKey);
    endpoint.value = "";
    openaiKey.value = "";
    setModeLabel();
  });
}

function initBackground() {
  const canvas = $("#bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // Glossy spheres: mostly still; they only react when the cursor gets close.
  const MOTION = {
    repelRadiusPad: 150,
    repelStrength: 420, // impulse scale (keep gentle)
    springK: 1.45,
    damping: 6.0,
    maxSpeed: 520,
  };

  // Make the background less prominent.
  const LOOK = {
    opacity: 0.62,
    auraAlpha: 0.14,
    rimAlpha: 0.34,
    vignetteAlpha: 0.14,
  };

  let w = 0;
  let h = 0;
  let dpr = 1;

  const pointer = { x: 0, y: 0, active: false };
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    pointer.t = performance.now();
    start();
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
    pointer.t = performance.now();
    start(); // let spheres settle back, then we can sleep
  });

  // Palette aimed at the glossy reference: black/white/magenta with a cool rim light.
  const colors = [
    { base: [18, 18, 22], hi: [64, 74, 98], rim: [124, 176, 255] }, // graphite
    { base: [226, 228, 234], hi: [255, 255, 255], rim: [140, 190, 255] }, // pearl
    { base: [154, 16, 78], hi: [255, 96, 164], rim: [126, 178, 255] }, // magenta
    { base: [20, 22, 34], hi: [38, 50, 86], rim: [120, 176, 255] }, // midnight
    { base: [8, 58, 132], hi: [92, 172, 255], rim: [160, 220, 255] }, // cobalt
    { base: [6, 86, 86], hi: [112, 228, 216], rim: [168, 252, 255] }, // teal
    { base: [118, 92, 10], hi: [244, 210, 120], rim: [255, 244, 186] }, // gold
  ];

  const spriteCache = new Map();
  function qRadius(r) {
    return clamp(Math.round(r / 10) * 10, 50, 200);
  }
  function spriteKey(ci, r) {
    return `${ci}:${r}`;
  }
  function getSprite(ci, radius) {
    const qr = qRadius(radius);
    const k = spriteKey(ci, qr);
    if (spriteCache.has(k)) return spriteCache.get(k);

    const s = document.createElement("canvas");
    const pad = 14;
    const size = (qr + pad) * 2;
    s.width = size;
    s.height = size;
    const c = s.getContext("2d");
    if (!c) return null;

    const col = colors[ci % colors.length];
    const cx = size / 2;
    const cy = size / 2;

    // Outer aura / rim glow.
    const aura = c.createRadialGradient(cx, cy, qr * 0.85, cx, cy, qr + pad);
    aura.addColorStop(0, `rgba(${col.rim[0]},${col.rim[1]},${col.rim[2]},0.00)`);
    aura.addColorStop(1, `rgba(${col.rim[0]},${col.rim[1]},${col.rim[2]},${LOOK.auraAlpha})`);
    c.fillStyle = aura;
    c.beginPath();
    c.arc(cx, cy, qr + pad, 0, Math.PI * 2);
    c.fill();

    // Sphere body (clipped).
    c.save();
    c.beginPath();
    c.arc(cx, cy, qr, 0, Math.PI * 2);
    c.clip();

    // Base shading.
    const g = c.createRadialGradient(cx - qr * 0.35, cy - qr * 0.35, 0, cx, cy, qr * 1.15);
    g.addColorStop(0.0, `rgb(${col.hi[0]},${col.hi[1]},${col.hi[2]})`);
    g.addColorStop(
      0.45,
      `rgb(${Math.round((col.hi[0] + col.base[0]) / 2)},${Math.round((col.hi[1] + col.base[1]) / 2)},${Math.round(
        (col.hi[2] + col.base[2]) / 2
      )})`
    );
    g.addColorStop(1.0, `rgb(${col.base[0]},${col.base[1]},${col.base[2]})`);
    c.fillStyle = g;
    c.fillRect(cx - qr, cy - qr, qr * 2, qr * 2);

    // Shadow falloff (bottom-right).
    const sg = c.createRadialGradient(cx + qr * 0.45, cy + qr * 0.45, qr * 0.1, cx + qr * 0.45, cy + qr * 0.45, qr * 1.05);
    sg.addColorStop(0.0, "rgba(0,0,0,0)");
    sg.addColorStop(1.0, "rgba(0,0,0,0.62)");
    c.globalCompositeOperation = "multiply";
    c.fillStyle = sg;
    c.fillRect(cx - qr, cy - qr, qr * 2, qr * 2);

    // Specular highlight.
    const hg = c.createRadialGradient(cx - qr * 0.33, cy - qr * 0.33, 0, cx - qr * 0.22, cy - qr * 0.22, qr * 0.65);
    hg.addColorStop(0.0, "rgba(255,255,255,0.70)");
    hg.addColorStop(0.35, "rgba(255,255,255,0.22)");
    hg.addColorStop(1.0, "rgba(255,255,255,0)");
    c.globalCompositeOperation = "screen";
    c.fillStyle = hg;
    c.beginPath();
    c.ellipse(cx - qr * 0.22, cy - qr * 0.28, qr * 0.44, qr * 0.30, -0.55, 0, Math.PI * 2);
    c.fill();

    // Rim light stroke.
    c.globalCompositeOperation = "source-over";
    c.strokeStyle = `rgba(${col.rim[0]},${col.rim[1]},${col.rim[2]},${LOOK.rimAlpha})`;
    c.lineWidth = Math.max(2, Math.round(qr * 0.06));
    c.beginPath();
    c.arc(cx, cy, qr - c.lineWidth * 0.4, 0, Math.PI * 2);
    c.stroke();

    c.restore();

    spriteCache.set(k, { canvas: s, r: qr + pad });
    return spriteCache.get(k);
  }

  let circles = [];
  let vignette = null;

  function makeVignette() {
    const g = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.15,
      w / 2,
      h / 2,
      Math.min(w, h) * 0.9
    );
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(1, `rgba(255,255,255,${LOOK.vignetteAlpha})`);
    vignette = g;
  }

  function initCircles() {
    // Cluster bias (like the reference): mostly around right/center.
    const count = clamp(Math.floor((w * h) / 78000), 14, 26);
    const fx = w * 0.68;
    const fy = h * 0.48;

    circles = new Array(count).fill(0).map((_, i) => {
      // Slightly smaller spheres so they don't overpower the UI.
      const r = 42 + Math.pow(Math.random(), 1.8) * 112;
      const a = Math.random() * Math.PI * 2;
      const m = (0.10 + Math.random() * 0.22) * Math.min(w, h);
      const x0 = clamp(fx + Math.cos(a) * m + (Math.random() - 0.5) * 60, r + 8, w - r - 8);
      const y0 = clamp(fy + Math.sin(a) * m + (Math.random() - 0.5) * 60, r + 8, h - r - 8);
      return {
        x0,
        y0,
        x: x0,
        y: y0,
        vx: 0,
        vy: 0,
        r,
        ci: i % colors.length,
        hover: 0,
        hoverPhase: Math.random() * Math.PI * 2,
        hoverSpd: 0.55 + Math.random() * 0.55,
        hoverAmp: 5 + Math.random() * 10,
        // Ambient drift: very slow, small amplitude, always on.
        driftPhase: Math.random() * Math.PI * 2,
        driftSpd: 0.07 + Math.random() * 0.10,
        driftAmp: 6 + Math.random() * 10,
      };
    });
  }

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initCircles();
    makeVignette();
    drawStatic();
  }
  resize();
  window.addEventListener("resize", resize);

  // Click: cycle sphere color (only when clicking a sphere).
  canvas.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hit = null;
    let bestD2 = Infinity;
    for (const c of circles) {
      const dx = x - c.x;
      const dy = y - c.y;
      const d2 = dx * dx + dy * dy;
      if (d2 <= c.r * c.r && d2 < bestD2) {
        bestD2 = d2;
        hit = c;
      }
    }
    if (!hit) return;
    hit.ci = (hit.ci + 1) % colors.length;
    // tiny kick so the change feels alive
    hit.vx += (Math.random() - 0.5) * 120;
    hit.vy += (Math.random() - 0.5) * 120;
    start();
  });

  function drawAll() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    for (const c of circles) {
      const sp = getSprite(c.ci, c.r);
      if (!sp) continue;
      ctx.globalAlpha = LOOK.opacity;
      const s = (c.r * 2) / sp.r;
      const drawR = sp.r * s;
      ctx.drawImage(sp.canvas, c.x - drawR, c.y - drawR, drawR * 2, drawR * 2);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    if (vignette) {
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function drawStatic() {
    // Render a static frame without burning CPU when idle.
    if (!circles.length) return;
    drawAll();
  }

  let last = performance.now();
  let rafId = 0;
  let running = false;

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(step);
  }

  function step(now) {
    const dt = clamp((now - last) / 1000, 0.0, 0.05);
    last = now;

    const px = pointer.x;
    const py = pointer.y;

    for (const c of circles) {
      // Ambient drift target (always on).
      c.driftPhase += dt * c.driftSpd;
      const ax = Math.cos(c.driftPhase * 0.90) * c.driftAmp;
      const ay = Math.sin(c.driftPhase * 1.03) * c.driftAmp * 0.72;

      // Hover activation: spheres are perfectly still until you're close.
      let hoverTarget = 0;
      if (pointer.active) {
        const dx = c.x - px;
        const dy = c.y - py;
        const rr = c.r + 52;
        if (dx * dx + dy * dy < rr * rr) hoverTarget = 1;
      }
      // Smooth hover easing.
      const ease = 1 - Math.exp(-7.5 * dt);
      c.hover += (hoverTarget - c.hover) * ease;

      // Subtle "alive" motion only while hovered.
      c.hoverPhase += dt * c.hoverSpd;
      const ox = Math.cos(c.hoverPhase) * c.hoverAmp * c.hover;
      const oy = Math.sin(c.hoverPhase * 0.9) * c.hoverAmp * 0.72 * c.hover;

      // Spring towards rest (+ hover offset).
      const tx = c.x0 + ax + ox;
      const ty = c.y0 + ay + oy;
      c.vx += (tx - c.x) * (MOTION.springK * 16) * dt;
      c.vy += (ty - c.y) * (MOTION.springK * 16) * dt;

      // Cursor repel (only near).
      if (pointer.active && c.hover > 0.001) {
        const dx = c.x - px;
        const dy = c.y - py;
        const rr = c.r + MOTION.repelRadiusPad;
        const d2 = dx * dx + dy * dy;
        if (d2 < rr * rr) {
          const d = Math.max(1, Math.sqrt(d2));
          const fall = 1 - d / rr;
          const f = fall * fall * MOTION.repelStrength;
          c.vx += (dx / d) * f * dt;
          c.vy += (dy / d) * f * dt;
        }
      }

      // Damping (stable across frame rate).
      const damp = Math.exp(-MOTION.damping * dt);
      c.vx *= damp;
      c.vy *= damp;

      // Clamp speed.
      const spd = Math.hypot(c.vx, c.vy);
      if (spd > MOTION.maxSpeed) {
        const s = MOTION.maxSpeed / spd;
        c.vx *= s;
        c.vy *= s;
      }

      // Integrate.
      c.x += c.vx * dt;
      c.y += c.vy * dt;

      // Keep within bounds.
      c.x = clamp(c.x, c.r + 6, w - c.r - 6);
      c.y = clamp(c.y, c.r + 6, h - c.r - 6);
    }

    // Draw.
    drawAll();

    rafId = requestAnimationFrame(step);
  }

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    // Render a static frame.
    drawStatic();
    return;
  }

  // Start immediately: slow ambient drift is always on.
  start();
}

function initSkillsBubble() {
  const canvas = $("#skills");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const skills = [
    { label: "Python", icon: "python", url: "https://docs.python.org/3/" },
    { label: "scikit-learn", icon: "scikitlearn", url: "https://scikit-learn.org/stable/" },
    { label: "TensorFlow", icon: "tensorflow", url: "https://www.tensorflow.org/" },
    { label: "Keras", icon: "keras", url: "https://keras.io/" },
    { label: "Pandas", icon: "pandas", url: "https://pandas.pydata.org/docs/" },
    { label: "NumPy", icon: "numpy", url: "https://numpy.org/doc/" },
    { label: "Matplotlib", icon: "matplotlib", url: "https://matplotlib.org/stable/" },
    { label: "Streamlit", icon: "streamlit", url: "https://docs.streamlit.io/" },
    { label: "BeautifulSoup", icon: "beautifulsoup", url: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/" },
    { label: "OpenCV", icon: "opencv", url: "https://docs.opencv.org/" },
    { label: "LangChain", icon: "langchain", url: "https://python.langchain.com/docs/" },
    { label: "Azure", icon: "microsoftazure", url: "https://learn.microsoft.com/azure/" },
    { label: "Linux", icon: "linux", url: "https://www.kernel.org/doc/" },
    { label: "GitHub", icon: "github", url: "https://docs.github.com/" },
    { label: "MongoDB", icon: "mongodb", url: "https://www.mongodb.com/docs/" },
    { label: "MySQL", icon: "mysql", url: "https://dev.mysql.com/doc/" },
    { label: "Power BI", icon: "powerbi", url: "https://learn.microsoft.com/power-bi/" },
    { label: "Tableau", icon: "tableau", url: "https://help.tableau.com/" },
    { label: "SQL", icon: "sqlite", url: "https://www.postgresql.org/docs/" },
    { label: "Java", icon: "openjdk", url: "https://docs.oracle.com/en/java/" },
  ];

  const iconCache = new Map();
  function loadIcon(slug) {
    if (iconCache.has(slug)) return iconCache.get(slug);
    const img = new Image();
    // Simple Icons CDN. If a slug doesn't exist, the image will error and we fall back to a circle.
    img.src = `https://cdn.simpleicons.org/${encodeURIComponent(slug)}/f4f6ff`;
    iconCache.set(slug, img);
    return img;
  }

  let w = 0,
    h = 0,
    dpr = 1;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.max(320, Math.floor(rect.width));
    h = Math.max(320, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layoutTargets();
  }
  window.addEventListener("resize", resize);

  const pointer = { x: -9999, y: -9999, down: false };
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  });
  canvas.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  const nodes = skills.map((s, i) => {
    const r = 26 + (i % 3) * 4;
    return {
      ...s,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      vx: 0,
      vy: 0,
      r,
      // Slow, subtle float.
      amp: 1.4 + Math.random() * 2.2,
      spd: 0.000075 + Math.random() * 0.00011,
      ph: Math.random() * Math.PI * 2,
    };
  });

  function layoutTargets() {
    const pad = 40;
    const maxX = Math.max(1, w / 2 - pad);
    const maxY = Math.max(1, h / 2 - pad);
    const g = Math.PI * (3 - Math.sqrt(5));
    const nTotal = nodes.length;
    for (let i = 0; i < nTotal; i++) {
      const t = (i + 0.5) / Math.max(1, nTotal);
      const rr = Math.sqrt(t);
      const a = i * g;
      const x = w / 2 + Math.cos(a) * rr * maxX;
      const y = h / 2 + Math.sin(a) * rr * maxY;
      nodes[i].tx = clamp(x, pad, w - pad);
      nodes[i].ty = clamp(y, pad, h - pad);
      if (!Number.isFinite(nodes[i].x) || !Number.isFinite(nodes[i].y) || (nodes[i].x === 0 && nodes[i].y === 0)) {
        nodes[i].x = nodes[i].tx;
        nodes[i].y = nodes[i].ty;
      }
    }
  }

  resize();

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = performance.now();
  function step(now) {
    const dt = clamp((now - last) / 1000, 0.0, 0.05);
    last = now;

    ctx.clearRect(0, 0, w, h);

    const repelR = 90;
    for (const n of nodes) {
      const t = now * n.spd + n.ph;
      const targetX = n.tx + Math.cos(t * 1.15) * n.amp;
      const targetY = n.ty + Math.sin(t * 0.92) * n.amp;

      // spring towards target
      n.vx += (targetX - n.x) * 1.7 * dt;
      n.vy += (targetY - n.y) * 1.7 * dt;

      // cursor dodge
      const dx = n.x - pointer.x;
      const dy = n.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < repelR * repelR) {
        const d = Math.max(1, Math.sqrt(d2));
        const fall = 1 - d / repelR;
        const f = fall * fall * 190;
        n.vx += (dx / d) * f * dt;
        n.vy += (dy / d) * f * dt;
      }

      // damping
      const damp = Math.exp(-6.8 * dt);
      n.vx *= damp;
      n.vy *= damp;

      // integrate
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      // bounds
      const pad = 36;
      n.x = clamp(n.x, pad, w - pad);
      n.y = clamp(n.y, pad, h - pad);
    }

    // render nodes (no big circle)
    for (const n of nodes) {
      const chip = ctx.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, 0, n.x, n.y, n.r);
      chip.addColorStop(0, "rgba(255,255,255,0.18)");
      chip.addColorStop(1, "rgba(255,255,255,0.06)");
      ctx.fillStyle = chip;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // icon
      const img = loadIcon(n.icon);
      const isReady = img && img.complete && img.naturalWidth > 0;
      if (isReady) {
        const s = Math.floor(n.r * 1.08);
        ctx.drawImage(img, n.x - s / 2, n.y - s / 2, s, s);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.font = "900 13px Space Grotesk, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label.slice(0, 2).toUpperCase(), n.x, n.y);
      }

      // label under
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = "800 11.5px Space Grotesk, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(n.label, n.x, n.y + n.r + 8);
    }

    requestAnimationFrame(step);
  }

  if (!reduce) requestAnimationFrame(step);
  else {
    // static render
    layoutTargets();
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x = n.tx;
      n.y = n.ty;
      const chip = ctx.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, 0, n.x, n.y, n.r);
      chip.addColorStop(0, "rgba(255,255,255,0.16)");
      chip.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = chip;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.80)";
      ctx.font = "800 11.5px Space Grotesk, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(n.label, n.x, n.y + n.r + 8);
    }
  }

  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    // hit test
    for (const n of nodes) {
      const dx = x - n.x;
      const dy = y - n.y;
      if (dx * dx + dy * dy <= n.r * n.r) {
        window.open(n.url, "_blank", "noopener,noreferrer");
        return;
      }
    }
  });
}

function initYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function initThemeToggle() {
  const root = document.documentElement;

  const read = () => (localStorage.getItem(STORAGE.theme) || "").trim();
  const write = (v) => localStorage.setItem(STORAGE.theme, v);

  function apply(theme) {
    const t = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", t);
    return t;
  }

  // Default is dark.
  const initial = read();
  const active = apply(initial || "dark");

  const nav = $(".nav");
  if (!nav) return;

  // Progressive enhancement: inject toggle without changing HTML structure.
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav__toggle";
  toggle.setAttribute("aria-label", "Toggle theme");
  toggle.setAttribute("aria-pressed", String(active === "light"));

  const setLabel = (theme) => {
    // Label shows the action: what you'll switch to.
    toggle.textContent = theme === "light" ? "Dark" : "Light";
    toggle.setAttribute("aria-pressed", String(theme === "light"));
  };
  setLabel(active);

  const cta = $(".nav__cta", nav);
  if (cta && cta.parentNode) cta.parentNode.insertBefore(toggle, cta);
  else nav.appendChild(toggle);

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    write(next);
    const t = apply(next);
    setLabel(t);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initThemeToggle();
  initReveal();
  initBackground();
  initNavActive();
  initCarousel();
  initModal();
  initChat();
  initSkillsBubble();
});
