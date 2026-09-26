// Pause/play button for the logo marquee. The animation is pure CSS; this only toggles
// .is-paused. Without JS the button stays hidden and the marquee still pauses on hover and focus.
for (const region of document.querySelectorAll("[data-marquee]")) {
  const button = region.querySelector("[data-marquee-toggle]");
  if (!button) continue;
  button.hidden = false;
  button.addEventListener("click", () => {
    const paused = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(paused));
    region.classList.toggle("is-paused", paused);
  });
}
