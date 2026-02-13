const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('main section[id]');
const header = document.querySelector('.site-header');
const projectsCarousel = document.querySelector('#projects-carousel');
const projectArrows = document.querySelectorAll('.projects-arrow');

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
const CHAT_API_URL = window.CHAT_API_URL || document.body.dataset.chatApiUrl || '';

const localResumeFacts = {
  projects:
    'I have worked on appointo.ai, IBM-Sales-Risk-Prediction-Model, Amazon-Business-Risk-Prediction-Model, retell-calendar-mvp, DAWNVision, Crater-Detection, AI-Research-Agent, and Portfolio-Sarika.',
  ai:
    'My AI work includes AI voice scheduling systems with Retell AI, ML risk prediction pipelines, computer vision work with YOLO, and an AI research agent using LangChain and Streamlit.',
  skills:
    'My skills include Python, SQL, Java, C, TensorFlow, Keras, OpenCV, Pandas, NumPy, LangChain, Azure, Power BI, Tableau, MySQL, MongoDB, Linux, Windows, and macOS.',
  experience:
    'I am a Software Engineer at AI Workflow Automation (AI Agents/ML Systems), previously a Cloud Applications Engineer at the same company, and an AI/ML intern at Bharat Electronics Limited, plus project internship work under IEEE IAMPro.',
  hobbies:
    'My hobbies are not listed in my current resume or portfolio. If needed, I can add a hobbies section.'
};

const getLocalFallback = (question) => {
  const q = question.toLowerCase();
  if (q.includes('project')) return localResumeFacts.projects;
  if (q.includes('ai') || q.includes('ml') || q.includes('machine learning')) return localResumeFacts.ai;
  if (q.includes('skill') || q.includes('tech stack')) return localResumeFacts.skills;
  if (q.includes('experience') || q.includes('work')) return localResumeFacts.experience;
  if (q.includes('hobbies') || q.includes('hobby')) return localResumeFacts.hobbies;
  return 'I can answer questions about my experience, projects, AI work, and skills based on my resume and portfolio.';
};

const appendChatMessage = (role, text) => {
  if (!chatWindow) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const appendTypingIndicator = () => {
  if (!chatWindow) return null;
  const msg = document.createElement('div');
  msg.className = 'chat-msg assistant typing';
  msg.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
};

const askAssistant = async (question) => {
  if (!CHAT_API_URL) {
    return getLocalFallback(question);
  }

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  const data = await response.json();
  if (typeof data.answer !== 'string' || !data.answer.trim()) {
    throw new Error('Invalid chat response');
  }
  return data.answer.trim();
};

if (chatWindow && chatForm && chatInput) {
  appendChatMessage(
    'assistant',
    'Hi, I am Sarika\'s AI About Me Assistant. Ask me about projects, AI work, skills, experience, or hobbies.'
  );

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    appendChatMessage('user', question);
    chatInput.value = '';
    chatInput.disabled = true;

    const typingNode = appendTypingIndicator();
    try {
      const answer = await askAssistant(question);
      if (typingNode) typingNode.remove();
      appendChatMessage('assistant', answer);
    } catch {
      if (typingNode) typingNode.remove();
      appendChatMessage(
        'assistant',
        'I could not reach the live assistant right now. I can still answer from resume context: ' + getLocalFallback(question)
      );
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
    }
  });
}
