const siteHeader = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const revealElements = [...document.querySelectorAll('.reveal')];
const sections = [...document.querySelectorAll('main section[id]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

toggle.addEventListener('click', () => {
  const isOpen = navPanel.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a, .nav-cta').forEach((link) => {
  link.addEventListener('click', () => {
    navPanel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

const updateHeaderState = () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
};

const setActiveNavLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
};

if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveNavLink(visibleEntry.target.id);
    }
  },
  {
    threshold: 0.35,
    rootMargin: '-30% 0px -45% 0px'
  }
);

sections.forEach((section) => sectionObserver.observe(section));

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();
