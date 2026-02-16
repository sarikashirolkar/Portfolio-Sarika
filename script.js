const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('main section[id]');
const header = document.querySelector('.site-header');
const projectsCarousel = document.querySelector('#projects-carousel');
const projectArrows = document.querySelectorAll('.projects-arrow');
const themeToggle = document.querySelector('#theme-toggle');
const themeToggleText = document.querySelector('.theme-toggle-text');
const themeToggleKnob = document.querySelector('.theme-toggle-knob');
const heroProfileImage = document.querySelector('.hero-photo img');
const THEME_STORAGE_KEY = 'portfolio-theme';

const applyTheme = (theme) => {
  const isLight = theme === 'light';
  document.body.classList.toggle('theme-light', isLight);
  if (heroProfileImage) {
    heroProfileImage.src = isLight ? 'profile.jpg' : 'profile-dark.png';
  }
  if (!themeToggle) return;
  if (themeToggleText) {
    themeToggleText.textContent = isLight ? 'LIGHT MODE' : 'DARK MODE';
  }
  if (themeToggleKnob) {
    themeToggleKnob.textContent = isLight ? '☀' : '☾';
  }
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
};

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('theme-light');
    const nextTheme = isCurrentlyLight ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

let lastY = window.scrollY;
window.addEventListener(
  'scroll',
  () => {
    const currentY = window.scrollY;
    const hide = currentY > 240 && currentY > lastY;
    header.classList.toggle('is-hidden', hide);
    lastY = currentY;
  },
  { passive: true }
);

if (projectsCarousel && projectArrows.length) {
  const updateProjectArrowState = () => {
    const maxScrollLeft = projectsCarousel.scrollWidth - projectsCarousel.clientWidth;
    const leftBtn = document.querySelector('.projects-arrow[data-direction="left"]');
    const rightBtn = document.querySelector('.projects-arrow[data-direction="right"]');

    if (!leftBtn || !rightBtn) return;

    leftBtn.disabled = projectsCarousel.scrollLeft <= 4;
    rightBtn.disabled = projectsCarousel.scrollLeft >= maxScrollLeft - 4;
  };

  const scrollProjects = (direction) => {
    const firstCard = projectsCarousel.querySelector('.project-card');
    const track = projectsCarousel.querySelector('.projects-track');
    if (!firstCard || !track) return;

    const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0');
    const step = firstCard.getBoundingClientRect().width + gap;

    projectsCarousel.scrollBy({
      left: direction === 'right' ? step : -step,
      behavior: 'smooth'
    });
  };

  projectArrows.forEach((btn) => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.direction;
      if (!direction) return;
      scrollProjects(direction);
    });
  });

  projectsCarousel.addEventListener('scroll', updateProjectArrowState, { passive: true });
  window.addEventListener('resize', updateProjectArrowState);
  updateProjectArrowState();
}

const chatWindow = document.querySelector('#chat-window');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatSuggestions = document.querySelector('#chat-suggestions');

const knowledgeBase = {
  profile: {
    fullName: "Sarika S Shirolkar",
    headline: "Software Engineer (AI Agents & ML Systems) | Data Analyst | ML Engineer | IEEE Leader",
    location: "Bengaluru, KA",
    summary:
      "I build practical AI agents and ML systems — from voice scheduling agents to ML prediction pipelines, and I deploy cloud apps on Azure."
  },

  roles: {
    current: {
      title: "Software Engineer (AI Agents & ML Systems)",
      company: "AI Workflow Automation",
      start: "Oct 2025",
      end: "Present",
      highlights: [
        "Building an AI voice scheduling agent for a France-based dental clinic using Retell AI, n8n, and Google Calendar.",
        "Designed Python services for large historical datasets for forecasting and decision-making.",
        "Built automated data pipelines (web scraping + SQL) for ML/analytics.",
        "Owned ML execution end-to-end: framing → features → training → evaluation → dashboards."
      ],
      source: "resume"
    },
    previous: [
      {
        title: "Software Engineer (Cloud Applications)",
        company: "AI Workflow Automation",
        start: "Mar 2025",
        end: "Sep 2025",
        highlights: [
          "Deployed backend services on Azure Linux VMs for scalability/reliability/failure recovery.",
          "Improved dev velocity ~40% with AI-assisted dev + code reviews + testing + perf optimization.",
          "Standardized deployment practices (config/logging/monitoring/rollback-friendly releases)."
        ],
        source: "resume"
      },
      {
        title: "AI & ML Intern",
        company: "Bharat Electronics Limited",
        start: "Jul 2025",
        end: "Sep 2025",
        highlights: [
          "Built/evaluated deep learning computer vision systems with robust experimentation.",
          "Did preprocessing, training, validation, error analysis for real-world reliability."
        ],
        source: "resume"
      }
    ]
  },

  education: {
    degree: "B.E (CSE — AI & ML)",
    university: "Visvesvaraya Technological University - Sai Vidya Institute of Technology",
    graduationYear: "2026",
    cgpa: "9.1"
  },

  projects: [
    {
      name: "Secure Object Identification for Autonomous Systems (IEEE Publication)",
      tags: ["ieee", "yolov8", "object-detection", "computer-vision", "adverse-weather"],
      oneLiner:
        "YOLOv8 real-time object detection under adverse weather; benchmarking + error analysis; published at an IEEE international conference.",
      details: [
        "Focused on accuracy + robustness under challenging conditions.",
        "Performance validation and benchmarking."
      ]
    },
    {
      name: "AI Voice Scheduling Agent for Dental Clinics",
      tags: ["retell-ai", "n8n", "google-calendar", "voice-agent", "webhooks"],
      oneLiner:
        "An end-to-end AI voice agent that books/reschedules/cancels appointments and checks availability with real-time calendar sync.",
      details: [
        "Structured AI outputs + webhook-driven workflows.",
        "Real-time calendar synchronization."
      ]
    },
    {
      name: "Business Risk Prediction Model",
      tags: ["classification", "feature-engineering", "precision-recall", "thresholding"],
      oneLiner:
        "Prediction system to flag high-risk records from large transactional datasets using feature engineering and precision-recall evaluation."
    },
    {
      name: "AI Research Agent (LangChain + Streamlit)",
      tags: ["langchain", "streamlit", "research", "summarization", "tooling"],
      oneLiner:
        "AI assistant that gathers sources, summarizes, and generates structured research outputs with tool integration."
    },
    {
      name: "AI Agent for LinkedIn Content Automation (n8n)",
      tags: ["n8n", "automation", "content", "llm-workflows"],
      oneLiner:
        "Workflow that generates and schedules LinkedIn posts using prompt orchestration + validation + publishing triggers."
    },
    {
      name: "Resume Builder Deployment (Azure App Service)",
      tags: ["azure", "app-service", "deployment"],
      oneLiner:
        "Deployed a resume-builder application on Azure App Services with cloud-ready configuration."
    },
    {
      name: "Crater Detection Model",
      tags: ["computer-vision", "detection", "space"],
      oneLiner:
        "Model to detect lunar/martian craters and evaluate detection performance."
    },
    {
      name: "Netflix Power BI Dashboard",
      tags: ["power-bi", "dashboards", "analytics"],
      oneLiner:
        "Interactive dashboard for exploratory analysis with filtered views and KPIs."
    }
  ],

  skills: {
    programming: ["Python", "SQL", "Java", "C"],
    ml: [
      "classification",
      "regression",
      "clustering",
      "feature engineering",
      "model evaluation",
      "error analysis"
    ],
    genai: ["LangChain", "prompt workflows", "LLM prototyping"],
    cv: ["YOLOv8", "CNNs", "Transformers", "OpenCV"],
    libraries: [
      "scikit-learn",
      "TensorFlow",
      "Keras",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Streamlit",
      "BeautifulSoup"
    ],
    cloud: ["Azure VMs", "Azure App Service", "Azure Blob Storage", "Linux"],
    dataViz: ["Power BI", "Tableau"],
    databases: ["MySQL", "MongoDB"],
    tools: ["Git", "VS Code", "Jupyter", "Google Colab", "Kaggle"],
    os: ["Windows", "Linux", "macOS"]
  },

  hobbies: {
    nonTech: [
      "Trekking and going on adventures in the wild",
      "Exploring nature and travel"
    ],
    tech: [
      "Attending tech meetups and conferences (Microsoft, GDG, IEEE events)",
      "Building small AI agents and workflow automations for fun",
      "Experimenting with ML models and dashboards"
    ],
    whyItMatters:
      "Trekking keeps me resilient and curious, and tech events keep me updated and connected to builders."
  },

  leadership: {
    ieee: [
      "First author of a peer-reviewed IEEE conference paper.",
      "Chair, IEEE CIS SVIT — led ML workshops/hackathons and mentored peers."
    ],
    other: [
      "U&I Team Leader — raised funds and taught students (math/science/soft skills).",
      "Infosys Pragati Cohort Intern — 12-week women-in-tech mentorship."
    ],
    ranks: [
      "Ranked 2nd (Sem 6, 2024–2025)",
      "Ranked 9th (Sem 2, 2022–2023)",
      "Ranked 10th (Sem 4, 2023–2024)"
    ]
  },

  faqs: [
    {
      id: "intro",
      match: ["who are you", "tell me about yourself", "introduce yourself", "give me your summary"],
      answer:
        "I’m Sarika S Shirolkar, a Software Engineer focused on AI agents and ML systems. I build practical automation — like AI voice scheduling agents — and end-to-end ML pipelines, and I deploy cloud applications on Azure."
    },
    {
      id: "current-role",
      match: ["what do you do currently", "current job", "where do you work now", "your role at ai workflow automation"],
      answer:
        "I’m a Software Engineer (AI Agents & ML Systems) at AI Workflow Automation (Oct 2025–Present), building AI voice agents and ML/data pipelines for decision-making and dashboards."
    },
    {
      id: "voice-agent",
      match: [
        "tell me about the voice agent",
        "ai voice scheduling agent",
        "how does your dental clinic agent work",
        "retell n8n google calendar project"
      ],
      answer:
        "I built an AI voice scheduling agent using Retell AI + n8n + Google Calendar that can book, reschedule, cancel appointments, and check availability via calls, while syncing updates to the calendar in real time using webhook-driven workflows."
    },
    {
      id: "ieee-paper",
      match: [
        "what is your ieee publication",
        "tell me about your research paper",
        "secure object identification project",
        "yolov8 project"
      ],
      answer:
        "My IEEE project focuses on secure object identification for autonomous systems using YOLOv8 for real-time object detection under adverse weather, with benchmarking, error analysis, and performance validation published at an IEEE international conference."
    },
    {
      id: "azure-experience",
      match: ["azure experience", "cloud deployment experience", "what have you deployed on azure", "linux vm experience"],
      answer:
        "I’ve deployed backend services on Azure Linux VMs and deployed cloud apps via Azure App Service. I also use Azure Blob Storage and follow deployment practices like logging/monitoring basics and rollback-friendly releases."
    },
    {
      id: "ml-process",
      match: ["how do you build a machine learning model", "your ml workflow", "how do you approach ml projects"],
      answer:
        "I approach ML end-to-end: define the problem and success metrics, prepare and clean data, engineer features, train and evaluate models (including error analysis), iterate on thresholds/metrics, and deliver results into dashboards or deployable outputs."
    },
    {
      id: "internship-bel",
      match: ["bharat electronics internship", "what did you do at bel"],
      answer:
        "At Bharat Electronics Limited, I worked on deep learning computer vision systems — preprocessing datasets, training/validation, and doing error analysis to improve robustness in real-world conditions."
    },
    {
      id: "skills",
      match: ["what are your core skills", "skills", "tools you use"],
      answer:
        "Core: Python, SQL, ML evaluation + error analysis, YOLOv8/CV, LangChain + Streamlit for prototypes, and Azure (VMs, App Service, Blob Storage). I also build dashboards in Power BI."
    },
    {
      id: "hobbies",
      match: ["what are your hobbies", "what do you do for fun", "hobbies", "interests outside work"],
      answer:
        "Outside of tech, I enjoy trekking and going on adventures in the wild — it keeps me curious, resilient, and connected to nature. On the tech side, I attend meetups and conferences (Microsoft, GDG, IEEE) and I like building small AI agents and ML prototypes."
    }
  ],

  entities: {
    companies: ["AI Workflow Automation", "Bharat Electronics Limited", "IEEE", "VTU", "Sai Vidya Institute of Technology"],
    tech: ["Retell AI", "n8n", "Google Calendar", "LangChain", "Streamlit", "YOLOv8", "Azure", "Power BI"],
    synonyms: {
      "ai workflow automation": ["aiworkflow", "ai workflow", "awa"],
      "retell ai": ["retell", "retellai"],
      "google calendar": ["gcal", "g-calendar"],
      "power bi": ["pbi", "powerbi"],
      "azure app service": ["app service", "app services"],
      "azure virtual machine": ["azure vm", "linux vm", "vm"]
    }
  },

  intents: [
    { intent: "INTRO", keywords: ["introduce", "who are you", "about you", "summary"] },
    { intent: "EXPERIENCE", keywords: ["experience", "work history", "roles", "job"] },
    { intent: "PROJECT_VOICE_AGENT", keywords: ["voice", "retell", "call", "appointment", "n8n", "calendar"] },
    { intent: "PROJECT_IEEE", keywords: ["ieee", "paper", "publication", "yolo", "yolov8", "object detection"] },
    { intent: "SKILLS", keywords: ["skills", "tools", "stack", "tech"] },
    { intent: "EDUCATION", keywords: ["education", "college", "university", "cgpa"] },
    { intent: "CONTACT", keywords: ["email", "linkedin", "contact", "phone"] }
  ],

  contact: {
    email: "sarikashirolkar@gmail.com",
    linkedin: "linkedin.com/in/sarikashirolkar",
    phone: "+91 9741056565"
  }
};

module.exports = knowledgeBase;


const chatState = {
  lastIntent: 'introduction'
};

const appendMessage = (role, text) => {
  if (!chatWindow) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const detectIntent = (userInput) => {
  const normalized = userInput.toLowerCase();
  const doc = typeof nlp === 'function' ? nlp(userInput) : null;
  const hasNoun = doc ? doc.has('#Noun') : false;

  if (
    normalized.includes('work') ||
    normalized.includes('job') ||
    normalized.includes('company')
  ) {
    return 'experience';
  }

  if (
    normalized.includes('skills') ||
    normalized.includes('stack') ||
    normalized.includes('python')
  ) {
    return 'skills';
  }

  if (
    normalized.includes('education') ||
    normalized.includes('college') ||
    normalized.includes('b.tech') ||
    normalized.includes('degree')
  ) {
    return 'education';
  }

  if (
    normalized.includes('introduce') ||
    normalized.includes('introduction') ||
    normalized.includes('about') ||
    normalized.includes('who')
  ) {
    return 'introduction';
  }

  if (
    normalized.includes('ieee') ||
    normalized.includes('paper') ||
    normalized.includes('research') ||
    hasNoun
  ) {
    return 'projects';
  }

  return chatState.lastIntent || 'introduction';
};

const respondToMessage = (userText) => {
  const trimmed = userText.trim();
  if (!trimmed) return;

  appendMessage('user', trimmed);
  const intent = detectIntent(trimmed);
  chatState.lastIntent = intent;
  appendMessage('assistant', knowledgeBase[intent]);
};

if (chatWindow && chatForm && chatInput && chatSuggestions) {
  appendMessage(
    'assistant',
    'Hi, I am Sarika\'s chatbot. Ask about my introduction, experience, education, projects, or skills.'
  );

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    respondToMessage(chatInput.value);
    chatInput.value = '';
    chatInput.focus();
  });

  chatSuggestions.addEventListener('click', (event) => {
    const clicked = event.target.closest('.chat-q-btn');
    if (!clicked) return;
    const suggestionText = clicked.dataset.q;
    if (!suggestionText) return;
    respondToMessage(suggestionText);
    chatInput.focus();
  });
}
