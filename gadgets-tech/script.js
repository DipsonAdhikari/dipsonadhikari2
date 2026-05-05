const toggle = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const revealElements = [...document.querySelectorAll('.reveal')];
const cards = [...document.querySelectorAll('.device-card')];
const searchInput = document.getElementById('phone-search');
const filterButtons = [...document.querySelectorAll('.filter-button')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let activeBrand = 'all';

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

const normalize = (value) => value.trim().toLowerCase();

const applyFilters = () => {
  const query = normalize(searchInput.value);

  cards.forEach((card) => {
    const brandMatches = activeBrand === 'all' || card.dataset.brand === activeBrand;
    const text = `${card.textContent} ${card.dataset.search}`.toLowerCase();
    const searchMatches = !query || text.includes(query);

    card.classList.toggle('is-hidden', !brandMatches || !searchMatches);
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeBrand = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    applyFilters();
  });
});

searchInput?.addEventListener('input', applyFilters);

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

filterButtons[0]?.setAttribute('aria-pressed', 'true');
applyFilters();

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
