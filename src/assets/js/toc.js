// "On this page" (service pages): scroll-spy and closing the mobile <details> after a tap.
// Without JS the links still work as plain anchors.
const links = [...document.querySelectorAll("[data-toc-link]")];
const ids = [...new Set(links.map((link) => decodeURIComponent(link.hash.slice(1))))];
const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

function setActive(id) {
  for (const link of links) {
    if (link.hash === `#${id}`) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
}

if (sections.length && "IntersectionObserver" in window) {
  const inBand = new Map();
  // The "band" is the top 40% of the viewport: the first section (in page order) touching it is current.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) inBand.set(entry.target.id, entry.isIntersecting);
      const current = sections.find((section) => inBand.get(section.id));
      if (current) setActive(current.id);
    },
    { rootMargin: "0px 0px -60% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

for (const details of document.querySelectorAll("[data-toc-details]")) {
  details.addEventListener("click", (event) => {
    if (event.target.closest("[data-toc-link]")) details.open = false;
  });
}
