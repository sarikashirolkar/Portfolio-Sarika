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
  introduction:
    'I am Sarika S Shirolkar, an Engineer and IEEE Leader focused on practical AI and ML systems.',
  experience:
    'I am currently a Data Analyst and ML Engineer at AI Workflow Automation (October 2025 to Present). Earlier, I worked there as an Azure Cloud Engineer (March 2025 to September 2025).',
  education:
    'I am pursuing a B.Tech in Computer Science (AI and ML) at Sai Vidya Institute of Technology, Bangalore.',
  projects:
    'My key projects include Secure Object Identification (published through IEEE) and AI voice scheduling agents.',
  skills:
    'My core skills include Python, Power BI, and Azure.'
};

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
