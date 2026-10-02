// Scroll reveal, loaded on every page (layouts/base.njk). Transitions are CSS ([data-reveal] in
// main.css); this only decides when. Progressive enhancement:
//   - nothing is hidden until this runs, and anything already on screen when it runs is left alone;
//   - it doesn't run at all when the visitor prefers reduced motion.
//   data-reveal         fade up (section headings, cards, split text panels)
//   data-reveal="draw"  trust icons: draw each line on, bump the icon, fade the label up
const ITEM_STAGGER = 120; // ms between elements that come into view together (reading order)
const MAX_STAGGER_STEPS = 6; // so a big jump (e.g. End key) doesn't queue up a long cascade
const SHAPE_STAGGER = 80; // ms between the lines inside one trust icon
const DRAW = 900; // ms to draw one line; matches the stroke-dashoffset transition in main.css
const LABEL_AFTER = 450; // ms after a trust icon starts drawing that its label fades in

const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";
const root = document.documentElement;
const observers = new Map();

// Apply class changes without transitions (otherwise hiding would itself animate).
function instantly(change) {
  root.classList.add("reveal-instant");
  change();
  void root.offsetWidth; // flush styles before transitions come back on
  root.classList.remove("reveal-instant");
}

function onScreen(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < innerHeight && rect.bottom > 0;
}

function prepareDraw(el) {
  if (el.drawShapes) return;
  // Skip Tabler's invisible bounding-box path (stroke="none").
  el.drawShapes = [...el.querySelectorAll(SHAPES)].filter((shape) => shape.getAttribute("stroke") !== "none");
  el.drawShapes.forEach((shape) => {
    // +1 so round line caps don't leave a dot at the end of an undrawn line.
    shape.style.setProperty("--draw-length", `${Math.ceil(shape.getTotalLength()) + 1}`);
  });
}

function show(el, delay) {
  if (el.dataset.reveal === "draw") {
    el.drawShapes.forEach((shape, i) => shape.style.setProperty("--draw-delay", `${delay + i * SHAPE_STAGGER}ms`));
    el.style.setProperty("--bump-delay", `${delay + (el.drawShapes.length - 1) * SHAPE_STAGGER + DRAW}ms`);
    el.style.setProperty("--label-delay", `${delay + LABEL_AFTER}ms`);
  } else {
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  }
  el.classList.add("is-shown");
}

// Elements that enter the viewport in the same callback cascade in reading (DOM) order, so a
// desktop row of cards runs left to right; on mobile they enter one at a time and start at once.
function showBatch(els) {
  els
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    .forEach((el, i) => show(el, Math.min(i, MAX_STAGGER_STEPS) * ITEM_STAGGER));
}

// Trust icons need more of the item in view (spec: 0.4); the rest reveal a little earlier.
function observerFor(el) {
  const threshold = el.dataset.reveal === "draw" ? 0.4 : 0.15;
  if (!observers.has(threshold)) {
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
        entering.forEach((target) => observer.unobserve(target)); // reveal once
        if (entering.length) showBatch(entering);
      },
      { threshold },
    );
    observers.set(threshold, observer);
  }
  return observers.get(threshold);
}

// Hide and watch. Elements already on screen are revealed straight away by the observer's first
// callback (only used by replay; on load they're skipped instead).
function arm(els) {
  els.filter((el) => el.dataset.reveal === "draw").forEach(prepareDraw);
  instantly(() =>
    els.forEach((el) => {
      el.classList.add("is-ready");
      el.classList.remove("is-shown");
    }),
  );
  els.forEach((el) => observerFor(el).observe(el));
}

if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  arm([...document.querySelectorAll("[data-reveal]")].filter((el) => !onScreen(el)));

  // Styleguide: replay buttons re-arm every reveal inside their aria-controls element, so they
  // play again now (if on screen) or when scrolled to. Hidden unless this runs.
  for (const button of document.querySelectorAll("[data-reveal-replay]")) {
    const target = document.getElementById(button.getAttribute("aria-controls"));
    if (!target) continue;
    button.hidden = false;
    button.addEventListener("click", () => {
      const els = [...target.querySelectorAll("[data-reveal]")];
      if (target.matches("[data-reveal]")) els.unshift(target);
      requestAnimationFrame(() => arm(els));
    });
  }
}
