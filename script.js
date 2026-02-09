document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("inview");
        revealObserver.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Active section in table of contents
  const toc = document.querySelector(".toc");
  const tocLinks = toc ? Array.from(toc.querySelectorAll("a[href^=\"#\"]")) : [];
  const sections = tocLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (tocLinks.length && sections.length) {
    const map = new Map(sections.map((s, i) => [s, tocLinks[i]]));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible) return;
        const active = map.get(visible.target);
        if (!active) return;
        tocLinks.forEach((a) => a.classList.remove("active"));
        active.classList.add("active");
      },
      { threshold: [0.2, 0.35, 0.5], rootMargin: "-10% 0px -70% 0px" }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }
});

