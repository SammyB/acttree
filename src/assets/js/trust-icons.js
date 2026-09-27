// "Draw-on" animation for the trust icons (components/trust-icons.njk). Progressive enhancement:
// nothing is hidden until this runs, and it doesn't run when the visitor prefers reduced motion.
// Timing lives here; the transitions themselves are CSS (.draw-item in main.css).
const ITEM_STAGGER = 120; // ms between items that come into view together (reading order)
const SHAPE_STAGGER = 80; // ms between the lines inside one icon
const DRAW = 900; // ms to draw one line; matches the stroke-dashoffset transition in main.css
const LABEL_AFTER = 450; // ms after an item starts drawing that its label fades in

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

function prepare(item) {
  // Skip Tabler's invisible bounding-box path (stroke="none").
  const shapes = [...item.querySelectorAll(SHAPES)].filter((shape) => shape.getAttribute("stroke") !== "none");
  shapes.forEach((shape) => {
    // +1 so round line caps don't leave a dot at the end of an undrawn line.
    shape.style.setProperty("--draw-length", `${Math.ceil(shape.getTotalLength()) + 1}`);
  });
  item.drawShapes = shapes;
}

function play(item, delay) {
  item.drawShapes.forEach((shape, i) => {
    shape.style.setProperty("--draw-delay", `${delay + i * SHAPE_STAGGER}ms`);
  });
  const drawn = delay + (item.drawShapes.length - 1) * SHAPE_STAGGER + DRAW;
  item.style.setProperty("--bump-delay", `${drawn}ms`);
  item.style.setProperty("--label-delay", `${delay + LABEL_AFTER}ms`);
  item.classList.add("is-drawn");
}

// Items that enter the viewport in the same callback are staggered in reading (DOM) order, so a
// desktop row cascades left to right; on mobile items enter one at a time and start straight away.
function playBatch(items) {
  items
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    .forEach((item, i) => play(item, i * ITEM_STAGGER));
}

function replay(list) {
  const items = [...list.querySelectorAll(".draw-item")];
  list.classList.add("is-resetting"); // no transitions while snapping back to undrawn
  items.forEach((item) => item.classList.remove("is-drawn"));
  void list.offsetWidth; // flush styles before transitions come back on
  list.classList.remove("is-resetting");
  requestAnimationFrame(() => playBatch(items));
}

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
      entering.forEach((item) => observer.unobserve(item)); // animate once
      if (entering.length) playBatch(entering);
    },
    { threshold: 0.4 },
  );

  for (const list of document.querySelectorAll("[data-draw-icons]")) {
    const items = list.querySelectorAll(".draw-item");
    items.forEach(prepare);
    // Hide instantly: without is-resetting the lines and labels would transition out.
    list.classList.add("is-ready", "is-resetting");
    void list.offsetWidth;
    list.classList.remove("is-resetting");
    items.forEach((item) => observer.observe(item));
  }

  // Styleguide: replay buttons (aria-controls = the list's id). Hidden unless this runs.
  for (const button of document.querySelectorAll("[data-draw-replay]")) {
    const list = document.getElementById(button.getAttribute("aria-controls"));
    if (!list?.classList.contains("is-ready")) continue;
    button.hidden = false;
    button.addEventListener("click", () => replay(list));
  }
}
