// Mobile menu toggle and dropdown / mega-menu disclosure buttons.
const header = document.querySelector("header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = menuToggle && document.getElementById(menuToggle.getAttribute("aria-controls"));
const submenuToggles = [...document.querySelectorAll("[data-submenu-toggle]")];

function setMenu(open) {
  if (!menu) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menu.toggleAttribute("data-open", open);
  menuToggle.querySelector('[data-menu-icon="open"]').hidden = open;
  menuToggle.querySelector('[data-menu-icon="close"]').hidden = !open;
}

function setSubmenu(toggle, open) {
  toggle.setAttribute("aria-expanded", String(open));
  document.getElementById(toggle.getAttribute("aria-controls")).hidden = !open;
}

function closeSubmenus(except) {
  submenuToggles.forEach((toggle) => toggle !== except && setSubmenu(toggle, false));
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

submenuToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    closeSubmenus(toggle);
    setSubmenu(toggle, open);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openSubmenu = submenuToggles.find((toggle) => toggle.getAttribute("aria-expanded") === "true");
  if (openSubmenu) {
    closeSubmenus();
    openSubmenu.focus();
  } else if (menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!header?.contains(event.target)) closeSubmenus();
});
