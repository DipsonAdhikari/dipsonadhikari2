let phoneList = [];

const app = document.getElementById("app");
const year = document.getElementById("year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const labels = {
  phoneName: "Phone name",
  brand: "Brand",
  launchStatus: "Launch status",
  launchDate: "Launch date",
  releaseDate: "Release date",
  variants: "Variants",
  colors: "Colors",
  modelNumbers: "Model numbers",
  displaySize: "Size",
  displayType: "Type",
  resolution: "Resolution",
  refreshRate: "Refresh rate",
  peakBrightness: "Peak brightness",
  typicalBrightness: "Typical brightness",
  hbmBrightness: "HBM brightness",
  hdrSupport: "HDR support",
  protection: "Protection",
  alwaysOnDisplay: "Always-on display",
  chipset: "Chipset",
  cpu: "CPU",
  gpu: "GPU",
  ramOptions: "RAM options",
  storageOptions: "Storage options",
  storageType: "Storage type",
  ramType: "RAM type",
  coolingSystem: "Cooling system",
  rearCameraSummary: "Rear camera",
  mainCameraMegapixels: "Main camera",
  mainCameraAperture: "Main aperture",
  mainCameraFocalLength: "Main focal length",
  mainCameraSensorSize: "Main sensor size",
  mainCameraPixelSize: "Main pixel size",
  mainCameraOIS: "Main OIS",
  ultrawideCamera: "Ultrawide",
  telephotoCamera: "Telephoto",
  macroCamera: "Macro",
  depthCamera: "Depth",
  videoRecording: "Video recording",
  cameraFeatures: "Camera features",
  selfieMegapixels: "Selfie camera",
  selfieAperture: "Selfie aperture",
  selfieFocalLength: "Selfie focal length",
  selfieAutofocus: "Selfie autofocus",
  selfieVideo: "Selfie video",
  selfieFeatures: "Selfie features",
  batteryCapacity: "Capacity",
  batteryType: "Type",
  wiredCharging: "Wired charging",
  wirelessCharging: "Wireless charging",
  reverseWiredCharging: "Reverse wired",
  reverseWirelessCharging: "Reverse wireless",
  chargingTime: "Charging time",
  chargerInBox: "Charger in box",
  bypassCharging: "Bypass charging",
  os: "OS",
  uiSkin: "UI skin",
  androidUpdates: "OS updates",
  securityUpdates: "Security updates",
  aiFeatures: "AI features",
  bloatwareLevel: "Bloatware level",
  dimensions: "Dimensions",
  weight: "Weight",
  frontMaterial: "Front material",
  backMaterial: "Back material",
  frameMaterial: "Frame material",
  ipRating: "IP rating",
  milStdRating: "MIL-STD rating",
  fingerprintType: "Fingerprint",
  faceUnlock: "Face unlock",
  buttons: "Buttons",
  stylusSupport: "Stylus support",
  simType: "SIM type",
  dualSim: "Dual SIM",
  esim: "eSIM",
  hybridSim: "Hybrid SIM",
  fiveG: "5G",
  wifi: "Wi-Fi",
  bluetooth: "Bluetooth",
  nfc: "NFC",
  usbType: "USB",
  headphoneJack: "Headphone jack",
  irBlaster: "IR blaster",
  gps: "GPS"
};

const hiddenSpecKeys = new Set(["launchStatus", "priceNepal", "priceIndia", "priceGlobal", "availability"]);

const sectionTitles = {
  basicInfo: "Basic Info",
  display: "Display",
  performance: "Performance",
  rearCamera: "Rear Camera",
  selfieCamera: "Selfie Camera",
  battery: "Battery and Charging",
  software: "Software",
  build: "Build and Durability",
  connectivity: "Connectivity",
  memory: "Advanced Memory Specs",
  camera: "Advanced Camera Specs",
  audio: "Audio Specs",
  sensors: "Sensors and Security",
  miscellaneous: "Miscellaneous Geek Specs"
};

const advancedTitles = {
  display: "Advanced Display Specs",
  performance: "Advanced Chipset/Performance Specs",
  memory: "Advanced Memory Specs",
  camera: "Advanced Camera Specs",
  battery: "Advanced Battery Specs",
  connectivity: "Advanced Connectivity Specs",
  audio: "Audio Specs",
  sensors: "Sensors and Security",
  miscellaneous: "Miscellaneous Geek Specs"
};

const normalize = (value) => String(value || "").toLowerCase();
const notEmpty = (value) => value !== null && value !== undefined && String(value).trim() !== "";
const formatList = (value) => Array.isArray(value) ? value.join(", ") : value;
const labelize = (key) => labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

const isNotSpecified = (value) => String(value).trim().toLowerCase() === "not specified";
const visibleEntries = (specs, includeNotSpecified = true) =>
  Object.entries(specs || {}).filter(([key, value]) => !hiddenSpecKeys.has(key) && notEmpty(value) && (includeNotSpecified || !isNotSpecified(value)));

const getRouteSlug = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("phone");
};

const setMeta = (title, description) => {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.append(meta);
  }
  meta.content = description;
};

if (!reduceMotion && finePointer) {
  let cursorFrame = null;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;

      if (cursorFrame) {
        return;
      }

      cursorFrame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${cursorX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${cursorY}px`);
        cursorFrame = null;
      });
    },
    { passive: true }
  );
}

const enhanceMotion = (root = app) => {
  if (reduceMotion || !finePointer) {
    return;
  }

  root
    .querySelectorAll(".phone-card, .product-gallery")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 7;
        const rotateY = (x - 0.5) * 7;

        card.style.setProperty("--tilt-x", `${rotateY}deg`);
        card.style.setProperty("--tilt-y", `${rotateX}deg`);
        card.style.setProperty("--spotlight-x", `${x * 100}%`);
        card.style.setProperty("--spotlight-y", `${y * 100}%`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
        card.style.removeProperty("--spotlight-x");
        card.style.removeProperty("--spotlight-y");
      });
    });
};

const renderLoadError = (message) => {
  app.innerHTML = `
    <section class="load-state">
      <p class="eyebrow">Catalog Error</p>
      <h1>Phone data could not be loaded.</h1>
      <p>${message}</p>
      <p>Open this section through a local server or your deployed website so the browser can fetch <code>phones.json</code>.</p>
    </section>
  `;
};

const card = (phone) => `
  <article class="phone-card" data-brand="${phone.brand}">
    <a class="phone-image" href="./?phone=${phone.slug}" data-phone-link="${phone.slug}">
      <img src="${phone.images[0]}" alt="${phone.phoneName}">
    </a>
    <div class="phone-card-body">
      <div class="card-kicker">
        <span class="brand-pill ${normalize(phone.brand)}">${phone.brand}</span>
        <span>${phone.launch.announcedDate}</span>
      </div>
      <h3><a href="./?phone=${phone.slug}" data-phone-link="${phone.slug}">${phone.phoneName}</a></h3>
      <dl class="mini-specs">
        <div><dt>Display</dt><dd>${phone.quickHighlights.display}</dd></div>
        <div><dt>Chipset</dt><dd>${phone.quickHighlights.chipset}</dd></div>
        <div><dt>Camera</dt><dd>${phone.quickHighlights.rearCamera}</dd></div>
        <div><dt>Battery</dt><dd>${phone.quickHighlights.battery}; ${phone.quickHighlights.charging}</dd></div>
        <div><dt>Memory</dt><dd>${phone.quickHighlights.ramStorage}</dd></div>
        <div><dt>Build</dt><dd>${phone.quickHighlights.ipRating}</dd></div>
      </dl>
      <div class="badge-row">${phone.badges.map((badge) => `<span>${badge}</span>`).join("")}</div>
      <a class="details-link" href="./?phone=${phone.slug}" data-phone-link="${phone.slug}">View Details</a>
    </div>
  </article>
`;

const renderList = () => {
  setMeta(
    "Smartphone Specs and Features | Gadgets & Tech",
    "Browse smartphone specifications with images, key hardware summaries, camera notes, battery details, and advanced technical tables."
  );

  const brands = ["All", ...new Set(phoneList.map((phone) => phone.brand))];
  const badgeCount = new Set(phoneList.flatMap((phone) => phone.badges || [])).size;
  const brandFilter = document.getElementById("brand-filter");
  if (brandFilter) {
    brandFilter.innerHTML = brands.map((brand) => `<option value="${brand.toLowerCase()}">${brand}</option>`).join("");
  }

  app.innerHTML = `
    <section class="catalog-hero">
      <div>
        <p class="eyebrow">Gadgets & Tech</p>
        <h1>Smartphone Specs</h1>
        <p>Flagship and midrange profiles with hardware highlights, launch notes, cameras, batteries, software, durability, and deep technical tables.</p>
      </div>
      <div class="catalog-stats" aria-label="Catalog stats">
        <article>
          <strong>${phoneList.length}</strong>
          <span>Phones</span>
        </article>
        <article>
          <strong>${brands.length - 1}</strong>
          <span>Brands</span>
        </article>
        <article>
          <strong>${badgeCount}</strong>
          <span>Tags</span>
        </article>
      </div>
    </section>
    <p class="result-count" id="result-count"></p>
    <section class="phone-grid" id="phone-grid">
      ${phoneList.map(card).join("")}
    </section>
  `;

  bindListEvents();
  enhanceMotion(app);
};

const renderSpecRows = (specs, includeNotSpecified = true) => {
  const rows = visibleEntries(specs, includeNotSpecified);
  if (!rows.length) {
    return `<p class="empty-note">No confirmed data yet.</p>`;
  }

  return `
    <table class="spec-table">
      <tbody>
        ${rows.map(([key, value]) => `
          <tr class="${isNotSpecified(value) ? "muted-row" : ""}">
            <th>${labelize(key)}</th>
            <td>${formatList(value)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};

const specSection = (title, specs) => `
  <section class="spec-section">
    <h3>${title}</h3>
    ${renderSpecRows(specs, true)}
  </section>
`;

const accordion = (title, specs) => `
  <details class="advanced-panel">
    <summary>${title}</summary>
    ${renderSpecRows(specs, false)}
  </details>
`;

const renderDetail = (phone) => {
  if (!phone) {
    renderList();
    return;
  }

  setMeta(
    `${phone.phoneName} Specs, Camera, Battery and Features`,
    `View full ${phone.phoneName} specifications including display, chipset, camera, battery, charging, software, IP rating, connectivity, and advanced geek specs.`
  );

  const basicOrder = ["basicInfo", "display", "performance", "rearCamera", "selfieCamera", "battery", "software", "build", "connectivity"];
  const advancedOrder = ["display", "performance", "memory", "camera", "battery", "connectivity", "audio", "sensors", "miscellaneous"];
  const highlights = phone.quickHighlights;
  const keySpecs = [
    ["Display", highlights.display],
    ["Chipset", highlights.chipset],
    ["Camera", highlights.rearCamera],
    ["Battery", `${highlights.battery}; ${highlights.charging}`],
    ["RAM", highlights.ramStorage],
    ["Software", highlights.software]
  ];
  const relatedPhones = phoneList
    .filter((item) => item.slug !== phone.slug && item.brand === phone.brand)
    .slice(0, 3);

  app.innerHTML = `
    <section class="detail-shell">
      <div class="product-area">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="../../">Home</a>
          <a href="./" data-route="list">Catalog</a>
          <span>${phone.phoneName}</span>
        </nav>

        <div class="product-title-row">
          <div>
            <span class="brand-pill ${normalize(phone.brand)}">${phone.brand}</span>
            <h1>${phone.phoneName}</h1>
          </div>
        </div>

        <div class="product-grid">
          <div class="product-gallery">
            <img src="${phone.images[0]}" alt="${phone.phoneName}">
          </div>

          <div class="buy-panel">
            <div class="profile-row">
              <p class="profile-label">Device Profile</p>
            </div>
            <p class="profile-summary">
              ${phone.phoneName} combines ${highlights.display}, ${highlights.chipset}, ${highlights.rearCamera}, and ${highlights.battery} battery hardware.
            </p>
            <div class="intro-meta">
              <span>Announced ${phone.launch.announcedDate}</span>
              <span>Released ${phone.launch.releaseDate}</span>
            </div>
            <section class="key-spec-panel">
              <div class="panel-title">
                <h2>Key Specs</h2>
                <a href="#basic-specs">See full specs</a>
              </div>
              <div class="key-spec-grid">
                ${keySpecs.map(([label, value]) => `
                  <article>
                    <span>${label}</span>
                    <strong>${value}</strong>
                  </article>
                `).join("")}
              </div>
            </section>
            <div class="variant-box">
              <strong>Variants</strong>
              <span>${phone.variants.join(", ")}</span>
            </div>
            <div class="variant-box">
              <strong>Colors</strong>
              <span>${phone.colors.join(", ")}</span>
            </div>
            <div class="badge-row">${phone.badges.map((badge) => `<span>${badge}</span>`).join("")}</div>
          </div>
        </div>
      </div>

      <aside class="side-rail">
        <section class="rail-card">
          <h2>Related Phones</h2>
          <div class="related-list">
            ${relatedPhones.map((item) => `
              <a href="./?phone=${item.slug}" data-phone-link="${item.slug}">
                <img src="${item.images[0]}" alt="${item.phoneName}">
                <span>${item.launch.announcedDate}</span>
                <strong>${item.phoneName}</strong>
              </a>
            `).join("") || "<p>No related phones yet.</p>"}
          </div>
        </section>
      </aside>
    </section>

    <section class="pros-cons">
      <article>
        <h2>Pros</h2>
        <ul>${phone.pros.map((item) => `<li>${item}</li>`).join("") || "<li>Not specified</li>"}</ul>
      </article>
      <article>
        <h2>Cons</h2>
        <ul>${phone.cons.map((item) => `<li>${item}</li>`).join("") || "<li>Not specified</li>"}</ul>
      </article>
    </section>

    <section class="section-head" id="basic-specs">
      <div>
        <p class="eyebrow">Basic Specs</p>
        <h2>Important specs first</h2>
      </div>
      <p>Designed for normal buyers who need the main facts fast.</p>
    </section>
    <div class="spec-layout">
      ${basicOrder.map((key) => specSection(sectionTitles[key], phone.basicSpecs[key])).join("")}
    </div>

    <section class="section-head">
      <div>
        <p class="eyebrow">Advanced Specs</p>
        <h2>Deep Technical Tables</h2>
      </div>
      <p>Display, chipset, memory, camera, battery, network, audio, sensors, and extra engineering details.</p>
    </section>
    <section class="advanced-list">
      ${advancedOrder.map((key) => accordion(advancedTitles[key], phone.advancedSpecs[key])).join("")}
    </section>
  `;

  enhanceMotion(app);
};

const bindListEvents = () => {
  const search = document.getElementById("phone-search");
  const brand = document.getElementById("brand-filter");
  const grid = document.getElementById("phone-grid");
  const count = document.getElementById("result-count");

  const applyFilters = () => {
    const query = normalize(search.value);
    const brandValue = brand.value;
    let shown = 0;

    grid.querySelectorAll(".phone-card").forEach((item) => {
      const phone = phoneList.find((entry) => entry.slug === item.querySelector("[data-phone-link]").dataset.phoneLink);
      const haystack = normalize(`${phone.phoneName} ${phone.brand} ${phone.badges.join(" ")} ${Object.values(phone.quickHighlights).join(" ")}`);
      const brandMatches = brandValue === "all" || normalize(phone.brand) === brandValue;
      const searchMatches = !query || haystack.includes(query);
      const visible = brandMatches && searchMatches;

      item.hidden = !visible;
      if (visible) shown += 1;
    });

    count.textContent = `${shown} profile${shown === 1 ? "" : "s"} shown`;
  };

  [search, brand].forEach((control) => control.addEventListener("input", applyFilters));

  applyFilters();
};

const navigateToPhone = (slug) => {
  const phone = phoneList.find((item) => item.slug === slug);
  history.pushState({ slug }, "", `./?phone=${slug}`);
  renderDetail(phone);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.addEventListener("click", (event) => {
  const phoneLink = event.target.closest("[data-phone-link]");
  if (phoneLink) {
    event.preventDefault();
    navigateToPhone(phoneLink.dataset.phoneLink);
    return;
  }

  const listLink = event.target.closest("[data-route='list']");
  if (listLink) {
    event.preventDefault();
    history.pushState({}, "", "./");
    renderList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

window.addEventListener("popstate", () => {
  const slug = getRouteSlug();
  const phone = phoneList.find((item) => item.slug === slug);
  slug ? renderDetail(phone) : renderList();
});

if (year) {
  year.textContent = new Date().getFullYear();
}

const boot = async () => {
  try {
    app.innerHTML = `<section class="load-state"><p class="eyebrow">Loading</p><h1>Preparing phone catalog...</h1></section>`;
    const response = await fetch("phones.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const data = await response.json();
    phoneList = Array.isArray(data.phones) ? data.phones : [];

    const initialSlug = getRouteSlug();
    const initialPhone = phoneList.find((item) => item.slug === initialSlug);
    initialSlug ? renderDetail(initialPhone) : renderList();
  } catch (error) {
    renderLoadError(error.message);
  }
};

boot();
