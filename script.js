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
