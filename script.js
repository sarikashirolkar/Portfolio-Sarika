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
    themeToggleText.textContent = isLight ? 'DAY MODE' : 'NIGHT MODE';
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
const chatQuestions = document.querySelector('#chat-questions');

const qaPairs = {
  intro: {
    question: 'Can you give me a quick introduction about yourself and your AI/ML background?',
    answer:
      'I am an AI and ML engineer focused on building practical intelligent systems, especially AI agents, computer vision solutions, and cloud-based applications. My experience includes developing ML pipelines, deploying services on Azure, and working on research projects like YOLO-based object detection published at an IEEE conference. I enjoy turning complex AI ideas into real-world, production-ready tools.'
  },
  a2w: {
    question: 'What kind of work have you done at AI Workflow Automation?',
    answer:
      'At AI Workflow Automation, I worked on designing AI agents, building Python-based data pipelines, and developing ML systems for forecasting and decision-making. I also deployed backend services on Azure Linux VMs and improved development workflows through structured deployment and monitoring practices. My role combined engineering, AI experimentation, and cloud deployment.'
  },
  'voice-agent': {
    question: 'Tell me about the AI voice scheduling agent you built - how does it work?',
    answer:
      'I developed an AI voice scheduling agent for a dental clinic that automates appointment booking through phone conversations. It integrates Retell AI, n8n workflows, and Google Calendar to manage real-time availability, rescheduling, and cancellations. The system uses structured AI outputs and webhook-driven automation to ensure reliable updates and smooth user interactions.'
  },
  hobbies: {
    question: 'What are your hobbies?',
    answer:
      'Outside of tech, I enjoy trekking and going on adventures in the wild - staying intact with nature! On the technical side, I regularly attend tech events and communities such as Microsoft, GDG, IEEE, and other meetups to keep learning, networking, and staying updated with the latest innovations.'
  },
  ieee: {
    question: 'Can you explain your IEEE research project and what problem it solved?',
    answer:
      'My IEEE research focused on secure object identification using YOLOv8 for autonomous systems operating in challenging weather conditions. The goal was to improve real-time detection accuracy and reliability through benchmarking and error analysis. The project demonstrated how deep learning models can perform robustly in real-world environments.'
  },
  azure: {
    question: 'What experience do you have deploying applications on Azure or cloud environments?',
    answer:
      'I have deployed backend services and applications on Azure Linux VMs and Azure App Services, focusing on scalability, stability, and secure configurations. My work included environment setup, monitoring basics, and optimizing deployment workflows to improve development speed and system reliability.'
  },
  proud: {
    question: 'Which project are you most proud of and why?',
    answer:
      'One of my proudest projects is the AI voice scheduling agent because it combines LLM workflows, automation, and real-time integrations into a production-ready system. It demonstrates how AI can move beyond experimentation into solving real operational problems for businesses.'
  },
  stack: {
    question: 'What tools, frameworks, and programming languages do you work with regularly?',
    answer:
      'I primarily work with Python, SQL, and Java along with frameworks like TensorFlow, scikit-learn, and LangChain. My workflow includes tools such as Git, Streamlit, Azure services, and data libraries like Pandas and NumPy for building AI pipelines, dashboards, and cloud-ready applications.'
  },
  approach: {
    question: 'How do you approach solving a new technical problem or learning a new technology?',
    answer:
      'I start by understanding the problem deeply and breaking it into smaller technical components. Then I prototype quickly, test different approaches, and refine solutions through experimentation and error analysis. Continuous learning through research, documentation, and real-world implementation helps me adapt quickly to new technologies.'
  }
};

const appendChatMessage = (role, text) => {
  if (!chatWindow) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  requestAnimationFrame(() => {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
};

const appendTypingIndicator = () => {
  if (!chatWindow) return null;
  const msg = document.createElement('div');
  msg.className = 'chat-msg assistant typing';
  msg.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  chatWindow.appendChild(msg);
  requestAnimationFrame(() => {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
  return msg;
};

const appendHobbyImages = () => {
  if (!chatWindow) return;
  const media = document.createElement('div');
  media.className = 'chat-media-grid';
  media.innerHTML =
    '<img src="hobby-trekking.jpg" alt="Sarika trekking outdoors" loading="lazy" />' +
    '<img src="hobby-gdg.jpg" alt="Sarika at GDG tech event" loading="lazy" />';
  chatWindow.appendChild(media);
  media.querySelectorAll('img').forEach((img) => {
    img.addEventListener(
      'load',
      () => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      },
      { once: true }
    );
  });
  requestAnimationFrame(() => {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
};

if (chatWindow && chatQuestions) {
  appendChatMessage(
    'assistant',
    'hi there - ask your questions and get instant insights about sarika.'
  );

  const setQuestionButtonsDisabled = (disabled) => {
    chatQuestions.querySelectorAll('.chat-q-btn').forEach((btn) => {
      btn.disabled = disabled;
    });
  };

  chatQuestions.addEventListener('click', async (event) => {
    const clicked = event.target.closest('.chat-q-btn');
    if (!clicked) return;

    const selectedKey = clicked.dataset.q;
    const selectedItem = qaPairs[selectedKey];
    if (!selectedItem) return;

    appendChatMessage('user', selectedItem.question);
    setQuestionButtonsDisabled(true);

    const typingNode = appendTypingIndicator();
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (typingNode) typingNode.remove();
    appendChatMessage('assistant', selectedItem.answer);
    if (selectedKey === 'hobbies') {
      appendHobbyImages();
    }

    setQuestionButtonsDisabled(false);
    clicked.focus();
  });
}
