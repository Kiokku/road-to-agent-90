const THEME_KEY = "agent-learning-hub-theme";
const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  toggle?.setAttribute("aria-pressed", String(theme === "dark"));
  toggle?.setAttribute("title", `Use ${theme === "dark" ? "light" : "dark"} theme`);
}

applyTheme(localStorage.getItem(THEME_KEY) ?? systemTheme());

toggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
});

document.querySelector("[data-current-link]")?.addEventListener("click", () => {
  const currentWeek = document.querySelector(`.week-row[data-week="${document.body.dataset.currentWeek}"]`);
  if (currentWeek instanceof HTMLDetailsElement) currentWeek.open = true;
});

document.querySelectorAll(".week-row").forEach((row) => {
  row.addEventListener("toggle", () => {
    if (!row.open) return;
    document.querySelectorAll(".week-row[open]").forEach((other) => {
      if (other !== row) other.removeAttribute("open");
    });
  });
});
