// Prev/next buttons for scroll-snap carousels. Without JS the list still scrolls by swipe or keyboard.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

for (const carousel of document.querySelectorAll("[data-carousel]")) {
  const track = carousel.querySelector("[data-carousel-track]");
  const controls = carousel.querySelector("[data-carousel-controls]");
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  if (!track || !controls) continue;

  const step = () => track.firstElementChild?.getBoundingClientRect().width ?? track.clientWidth;
  const scroll = (direction) =>
    track.scrollBy({ left: direction * step(), behavior: reducedMotion.matches ? "auto" : "smooth" });

  const update = () => {
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    controls.hidden = track.scrollWidth <= track.clientWidth;
  };

  prev.addEventListener("click", () => scroll(-1));
  next.addEventListener("click", () => scroll(1));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}
