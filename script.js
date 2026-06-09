const siteHeader = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const revealElements = [...document.querySelectorAll('.reveal')];
const sections = [...document.querySelectorAll('main section[id]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (!reduceMotion && finePointer) {
  let cursorFrame = null;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener(
    'pointermove',
    (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;

      if (cursorFrame) {
        return;
      }

      cursorFrame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--cursor-x', `${cursorX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${cursorY}px`);
        cursorFrame = null;
      });
    },
    { passive: true }
  );

  document
    .querySelectorAll('.profile-panel, .toolkit-card, .education-card, .work-card')
    .forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 7;
        const rotateY = (x - 0.5) * 7;

        card.style.setProperty('--tilt-x', `${rotateY}deg`);
        card.style.setProperty('--tilt-y', `${rotateX}deg`);
        card.style.setProperty('--spotlight-x', `${x * 100}%`);
        card.style.setProperty('--spotlight-y', `${y * 100}%`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
        card.style.removeProperty('--spotlight-x');
        card.style.removeProperty('--spotlight-y');
      });
    });
}

if (toggle && navPanel) {
  toggle.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.nav-links a, .nav-cta').forEach((link) => {
  link.addEventListener('click', () => {
    navPanel?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const updateHeaderState = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 12);
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

const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
