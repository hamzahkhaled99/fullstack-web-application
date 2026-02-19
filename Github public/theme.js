(() => {
  const THEME_KEY = "bsh_theme";
  const LANG_KEY = "bsh_lang";
  const root = document.documentElement;

  const getInitialTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  };

  const getLang = () => (localStorage.getItem(LANG_KEY) === "ar" ? "ar" : "en");

  const getThemeLabel = (theme, lang) => {
    const nextIsLight = theme === "dark";
    if (lang === "ar") return nextIsLight ? "فاتح" : "داكن";
    return nextIsLight ? "Light" : "Dark";
  };

  const getThemeAria = (theme, lang) => {
    const nextIsLight = theme === "dark";
    if (lang === "ar") return nextIsLight ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن";
    return nextIsLight ? "Switch to light mode" : "Switch to dark mode";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById("themeToggle");
    if (btn) {
      const lang = getLang();
      btn.textContent = getThemeLabel(theme, lang);
      btn.setAttribute("aria-label", getThemeAria(theme, lang));
    }
  };

  applyTheme(getInitialTheme());

  const bindToggle = (btn) => {
    if (!btn || btn.dataset.boundThemeToggle === "1") return;
    btn.dataset.boundThemeToggle = "1";
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
    });
  };

  const mountToggle = () => {
    let btn = document.getElementById("themeToggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "themeToggle";
      btn.className = "theme-toggle";
      btn.type = "button";
      document.body.appendChild(btn);
    }
    bindToggle(btn);
    applyTheme(root.getAttribute("data-theme") || "dark");
  };

  document.addEventListener("bsh:languageChanged", () => {
    applyTheme(root.getAttribute("data-theme") || getInitialTheme());
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountToggle);
  } else {
    mountToggle();
  }
})();
