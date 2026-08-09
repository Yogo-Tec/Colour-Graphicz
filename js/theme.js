/**
 * Sri Mahavishnu Colour Graphicz - Theme Manager
 * Supports OS Auto-detection, Manual Toggle, LocalStorage Persistence
 * Dark Mode: Dark Purple (#0B0716), Purple Glow (#A855F7), White Text (#FFFFFF)
 * Light Mode: Cream BG (#FFFBF5), Orange (#FF5722), Dark Purple Text (#1E0F38)
 */

(function () {
  "use strict";

  const STORAGE_KEY = "smcg_theme_mode"; // 'auto' | 'dark' | 'light'

  function getSystemPreference() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || "auto";
  }

  function applyTheme(mode) {
    const effectiveTheme = mode === "auto" ? getSystemPreference() : mode;
    
    if (effectiveTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Update Theme Toggle Button UI elements
    const toggleBtns = document.querySelectorAll(".theme-switcher-btn");
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector("i");
      const label = btn.querySelector(".theme-label");

      if (effectiveTheme === "dark") {
        if (icon) icon.className = "bi bi-moon-stars-fill text-purple";
        if (label) label.textContent = mode === "auto" ? "Dark (Auto)" : "Dark Mode";
      } else {
        if (icon) icon.className = "bi bi-sun-fill text-orange";
        if (label) label.textContent = mode === "auto" ? "Light (Auto)" : "Light Mode";
      }
    });

    // Broadcast theme change event for Three.js canvas & canvas background updates
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: effectiveTheme, mode } }));
  }

  function initThemeEngine() {
    const currentMode = getStoredTheme();
    applyTheme(currentMode);

    // Watch system changes if in 'auto' mode
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (getStoredTheme() === "auto") {
        applyTheme("auto");
      }
    });

    // Theme Switcher Click Listener
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme-switcher-btn");
      if (!btn) return;

      const activeMode = getStoredTheme();
      let nextMode = "dark";
      if (activeMode === "auto") {
        nextMode = getSystemPreference() === "dark" ? "light" : "dark";
      } else if (activeMode === "dark") {
        nextMode = "light";
      } else {
        nextMode = "dark";
      }

      localStorage.setItem(STORAGE_KEY, nextMode);
      applyTheme(nextMode);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeEngine);
  } else {
    initThemeEngine();
  }
})();
