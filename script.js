/* global HTMLDialogElement */

const STORAGE = {
  endpoint: "rag_endpoint",
  openaiKey: "rag_openai_key",
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
  },
  {
    id: "exp_jmle_models",
    title: `Junior Machine Learning Engineer — ${COMPANY.name}`,
    text:
      "Developed ML models (scikit-learn) to predict key business drivers from historical data, supporting forecasting and decision-making for U.S. stakeholders.",
  },
  {
    id: "exp_jmle_pipelines",
    title: `Junior Machine Learning Engineer — ${COMPANY.name}`,
    text:
      "Built automated data pipelines (web scraping + SQL) to collect, clean, and preprocess structured datasets for ML and analytics workflows. Owned end-to-end ML execution: framing, feature engineering, training, evaluation (metrics, error analysis), and delivery into dashboards.",
  },
  {
    id: "exp_cloud_azure",
    title: `Software Engineer (Cloud Applications) — ${COMPANY.name} (Mar 2025 – Sep 2025)`,
    text:
      "Designed, deployed, and maintained Python applications on Microsoft Azure (Linux VMs, App Services) focusing on scalability, reliability, and secure configuration. Standardized deployment practices to reduce operational issues.",
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
      `<div class="msg__bubble"><p style="color: rgba(255,255,255,.72); font-weight: 800;">Thinking...</p></div>`;
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    await respond(q);
  });

  $all(".pill").forEach((b) => {
    b.addEventListener("click", async () => {
      const q = (b.getAttribute("data-q") || "").trim();
      if (!q) return;
      await respond(q);
    });
  });
}

function initNavActive() {
  const root = $(".snap");
  const links = $all('.nav__links a[href^="#"]');
  if (!root || !links.length) return;
  const targets = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if (!targets.length) return;

  const map = new Map(targets.map((t, i) => [t, links[i]]));
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

  let w = 0;
  let h = 0;
  let dpr = 1;

  const pointer = { x: 0, y: 0, active: false };
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => (pointer.active = false));

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = [
    // Brighter alphas so blobs read clearly against the background.
    { r: 246, g: 193, b: 119, a: 0.28 },
    { r: 156, g: 207, b: 216, a: 0.24 },
    { r: 203, g: 166, b: 247, a: 0.18 },
    { r: 166, g: 227, b: 161, a: 0.18 },
  ];

  // Fewer, larger blobs look more intentional than many tiny ones.
  const N = Math.floor((w * h) / 72000);
  const objs = new Array(clamp(N, 16, 38)).fill(0).map((_, i) => {
    const c = colors[i % colors.length];
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      // Bigger radius = more visible.
      r: 70 + Math.random() * 110,
      c,
      spin: (Math.random() - 0.5) * 0.015,
      phase: Math.random() * Math.PI * 2,
    };
  });

  function drawBlob(o) {
    const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    const { r, g, b, a } = o.c;
    // Add a mid-stop so the edge feels sharper (less "washed out").
    grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
    grad.addColorStop(0.58, `rgba(${r},${g},${b},${a * 0.55})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();

    // Subtle crisp outline so shapes don't disappear on bright gradients.
    ctx.strokeStyle = `rgba(255,255,255,0.08)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // subtle vignette
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.12, w / 2, h / 2, Math.min(w, h) * 0.72);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    const px = pointer.x;
    const py = pointer.y;
    const repelR = 190;
    const repelR2 = repelR * repelR;

    // Make overlaps pop a bit (more visible) while drawing blobs.
    ctx.globalCompositeOperation = "lighter";
    for (const o of objs) {
      // cursor dodge / repulsion
      if (pointer.active) {
        const dx = o.x - px;
        const dy = o.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < repelR2) {
          const d = Math.max(1, Math.sqrt(d2));
          const force = (1 - d / repelR) * 0.85;
          o.vx += (dx / d) * force;
          o.vy += (dy / d) * force;
        }
      }

      // gentle drift + swirl
      o.phase += o.spin;
      o.vx += Math.cos(o.phase) * 0.0022;
      o.vy += Math.sin(o.phase) * 0.0022;

      // friction
      o.vx *= 0.985;
      o.vy *= 0.985;

      o.x += o.vx;
      o.y += o.vy;

      // wrap around edges
      if (o.x < -o.r) o.x = w + o.r;
      if (o.x > w + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = h + o.r;
      if (o.y > h + o.r) o.y = -o.r;

      drawBlob(o);
    }
    ctx.globalCompositeOperation = "source-over";

    // faint connecting lines for a "network" feel
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    for (let i = 0; i < objs.length; i++) {
      for (let j = i + 1; j < objs.length; j++) {
        const a = objs[i];
        const b = objs[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 120 * 120) continue;
        const alpha = 1 - Math.sqrt(d2) / 120;
        ctx.globalAlpha = alpha * 0.85;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(step);
  }

  // Motion reduction
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) requestAnimationFrame(step);
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
    img.src = `https://cdn.simpleicons.org/${encodeURIComponent(slug)}/ffffff`;
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
  }
  resize();
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

  const center = () => ({ x: w / 2, y: h / 2 });

  const nodes = skills.map((s, i) => {
    const a = (i / skills.length) * Math.PI * 2;
    const rad = 0.16 + (i % 5) * 0.05;
    return {
      ...s,
      x: w / 2 + Math.cos(a) * w * 0.22,
      y: h / 2 + Math.sin(a) * h * 0.22,
      vx: 0,
      vy: 0,
      a,
      r: 26 + (i % 3) * 4,
      orbit: rad,
    };
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // big bubble
    const c = center();
    const R = Math.min(w, h) * 0.44;
    const g = ctx.createRadialGradient(c.x, c.y, R * 0.05, c.x, c.y, R);
    g.addColorStop(0, "rgba(255,255,255,0.06)");
    g.addColorStop(1, "rgba(255,255,255,0.02)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // physics
    const repelR = 90;
    for (const n of nodes) {
      // orbit target
      n.a += 0.006 + n.orbit * 0.004;
      const tx = c.x + Math.cos(n.a) * (R * (0.18 + n.orbit));
      const ty = c.y + Math.sin(n.a) * (R * (0.18 + n.orbit));

      // spring towards orbit
      n.vx += (tx - n.x) * 0.0026;
      n.vy += (ty - n.y) * 0.0026;

      // cursor dodge
      const dx = n.x - pointer.x;
      const dy = n.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < repelR * repelR) {
        const d = Math.max(1, Math.sqrt(d2));
        const f = (1 - d / repelR) * 0.85;
        n.vx += (dx / d) * f;
        n.vy += (dy / d) * f;
      }

      // keep inside bubble
      const dxC = n.x - c.x;
      const dyC = n.y - c.y;
      const dC = Math.max(1, Math.sqrt(dxC * dxC + dyC * dyC));
      const maxD = R - n.r - 10;
      if (dC > maxD) {
        const over = dC - maxD;
        n.vx -= (dxC / dC) * over * 0.012;
        n.vy -= (dyC / dC) * over * 0.012;
      }

      // friction + integrate
      n.vx *= 0.92;
      n.vy *= 0.92;
      n.x += n.vx;
      n.y += n.vy;
    }

    // render nodes
    for (const n of nodes) {
      // bubble chip
      const chip = ctx.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, 0, n.x, n.y, n.r);
      chip.addColorStop(0, "rgba(255,255,255,0.12)");
      chip.addColorStop(1, "rgba(255,255,255,0.04)");
      ctx.fillStyle = chip;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // icon
      const img = loadIcon(n.icon);
      const isReady = img && img.complete && img.naturalWidth > 0;
      if (isReady) {
        const s = Math.floor(n.r * 1.05);
        ctx.drawImage(img, n.x - s / 2, n.y - s / 2, s, s);
      } else {
        // fallback glyph
        ctx.fillStyle = "rgba(255,255,255,0.86)";
        ctx.font = "900 14px Space Grotesk, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label.slice(0, 2).toUpperCase(), n.x, n.y);
      }

      // label under
      ctx.fillStyle = "rgba(255,255,255,0.86)";
      ctx.font = "800 12px Space Grotesk, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(n.label, n.x, n.y + n.r + 8);
    }

    requestAnimationFrame(draw);
  }

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) requestAnimationFrame(draw);

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

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initBackground();
  initNavActive();
  initCarousel();
  initModal();
  initChat();
  initSkillsBubble();
});
