import { failure, success } from './chunk-445P5ZF2.mjs';
import { __publicField } from './chunk-ABD7DB5B.mjs';

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// adapters/css/CssVariablesAdapter.ts
var DEFAULT_OPTIONS = {
  rootSelector: ":root",
  variablePrefix: "",
  styleElementId: "momoto-ui-theme",
  useDarkModeMediaQuery: true,
  darkModeClass: "dark",
  storageKey: "momoto-ui-theme-preferences",
  defaultTransitionDuration: 200
};
var CssVariablesAdapter = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(options = {}) {
    // ─────────────────────────────────────────────────────────────────────────
    // PROPERTIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "options");
    __publicField(this, "registeredThemes", /* @__PURE__ */ new Map());
    __publicField(this, "activeTheme", null);
    __publicField(this, "isDarkMode", false);
    __publicField(this, "styleElement", null);
    __publicField(this, "themeChangeListeners", /* @__PURE__ */ new Set());
    __publicField(this, "systemPrefsListeners", /* @__PURE__ */ new Set());
    __publicField(this, "mediaQueryList", null);
    this.options = { ...DEFAULT_OPTIONS, ...options };
    if (this.isAvailable()) {
      this.initializeStyleElement();
      this.initializeMediaQueryListener();
      this.loadPreferences();
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // THEME APPLICATION
  // ─────────────────────────────────────────────────────────────────────────
  async apply(config) {
    if (!this.isAvailable()) {
      return failure(new Error("CSS adapter requires DOM environment"));
    }
    try {
      const css = this.generateCss(config);
      if (this.styleElement) {
        this.styleElement.textContent = css;
      }
      if (config.isDark) {
        document.documentElement.classList.add(this.options.darkModeClass);
      } else {
        document.documentElement.classList.remove(this.options.darkModeClass);
      }
      this.activeTheme = config.name;
      this.isDarkMode = config.isDark;
      this.registeredThemes.set(config.name, config);
      this.notifyThemeChange();
      return success(void 0);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to apply theme")
      );
    }
  }
  async remove() {
    if (!this.isAvailable()) {
      return failure(new Error("CSS adapter requires DOM environment"));
    }
    try {
      if (this.styleElement) {
        this.styleElement.textContent = "";
      }
      document.documentElement.classList.remove(this.options.darkModeClass);
      this.activeTheme = null;
      this.notifyThemeChange();
      return success(void 0);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to remove theme")
      );
    }
  }
  async switchTo(themeName, options) {
    const theme = this.registeredThemes.get(themeName);
    if (!theme) {
      return failure(new Error(`Theme "${themeName}" not found`));
    }
    if (options?.animate) {
      this.enableTransitions(options.animationDuration);
    }
    const result = await this.apply(theme);
    if (options?.animate) {
      setTimeout(
        () => this.disableTransitions(),
        options.animationDuration || this.options.defaultTransitionDuration
      );
    }
    if (options?.persist) {
      await this.setPreferences({ preferredTheme: themeName });
    }
    options?.onComplete?.();
    return result;
  }
  async toggleDarkMode(options) {
    if (!this.activeTheme) {
      return failure(new Error("No active theme to toggle"));
    }
    const currentTheme = this.registeredThemes.get(this.activeTheme);
    if (!currentTheme) {
      return failure(new Error("Active theme not found"));
    }
    const targetIsDark = !this.isDarkMode;
    const darkSuffix = "-dark";
    const lightName = currentTheme.name.endsWith(darkSuffix) ? currentTheme.name.slice(0, -darkSuffix.length) : currentTheme.name;
    const targetThemeName = targetIsDark ? `${lightName}${darkSuffix}` : lightName;
    const targetTheme = this.registeredThemes.get(targetThemeName);
    if (targetTheme) {
      return this.switchTo(targetThemeName, options);
    }
    if (options?.animate) {
      this.enableTransitions(options.animationDuration);
    }
    this.isDarkMode = targetIsDark;
    if (targetIsDark) {
      document.documentElement.classList.add(this.options.darkModeClass);
    } else {
      document.documentElement.classList.remove(this.options.darkModeClass);
    }
    if (options?.animate) {
      setTimeout(
        () => this.disableTransitions(),
        options.animationDuration || this.options.defaultTransitionDuration
      );
    }
    if (options?.persist) {
      await this.setPreferences({ darkModeOverride: targetIsDark });
    }
    this.notifyThemeChange();
    options?.onComplete?.();
    return success(void 0);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // THEME STATE
  // ─────────────────────────────────────────────────────────────────────────
  async getState() {
    return success({
      activeTheme: this.activeTheme || "",
      isDark: this.isDarkMode,
      availableThemes: Array.from(this.registeredThemes.keys()),
      lastUpdate: /* @__PURE__ */ new Date(),
      appliedVariables: this.countAppliedVariables()
    });
  }
  async registerTheme(config) {
    this.registeredThemes.set(config.name, config);
    return success(void 0);
  }
  async unregisterTheme(themeName) {
    if (this.activeTheme === themeName) {
      await this.remove();
    }
    this.registeredThemes.delete(themeName);
    return success(void 0);
  }
  async listThemes() {
    return success(Array.from(this.registeredThemes.keys()));
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PREFERENCES
  // ─────────────────────────────────────────────────────────────────────────
  async getPreferences() {
    if (!this.isAvailable()) {
      return success({});
    }
    try {
      const stored = localStorage.getItem(this.options.storageKey);
      return success(stored ? JSON.parse(stored) : {});
    } catch {
      return success({});
    }
  }
  async setPreferences(preferences) {
    if (!this.isAvailable()) {
      return failure(new Error("Storage not available"));
    }
    try {
      const currentResult = await this.getPreferences();
      const current = currentResult.success ? currentResult.value : {};
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.options.storageKey, JSON.stringify(updated));
      return success(void 0);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to save preferences")
      );
    }
  }
  async detectSystemPreferences() {
    if (!this.isAvailable()) {
      return success({
        prefersDark: false,
        prefersContrast: "no-preference",
        prefersReducedMotion: false,
        prefersReducedTransparency: false,
        forcedColors: false
      });
    }
    return success({
      prefersDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
      prefersContrast: this.detectContrastPreference(),
      prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      prefersReducedTransparency: window.matchMedia("(prefers-reduced-transparency: reduce)").matches,
      forcedColors: window.matchMedia("(forced-colors: active)").matches
    });
  }
  async syncWithSystem() {
    const prefsResult = await this.detectSystemPreferences();
    if (!prefsResult.success) {
      return failure(prefsResult.error);
    }
    const prefs = prefsResult.value;
    if (prefs.prefersDark !== this.isDarkMode) {
      await this.toggleDarkMode({ animate: true });
    }
    return success(void 0);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SUBSCRIPTIONS
  // ─────────────────────────────────────────────────────────────────────────
  onThemeChange(callback) {
    this.themeChangeListeners.add(callback);
    return () => this.themeChangeListeners.delete(callback);
  }
  onSystemPreferencesChange(callback) {
    this.systemPrefsListeners.add(callback);
    return () => this.systemPrefsListeners.delete(callback);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────
  async getVariable(variableName) {
    if (!this.isAvailable()) {
      return success(null);
    }
    try {
      const root = document.documentElement;
      const value = getComputedStyle(root).getPropertyValue(variableName).trim();
      return success(value || null);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to get variable")
      );
    }
  }
  async setVariable(variableName, value) {
    if (!this.isAvailable()) {
      return failure(new Error("DOM not available"));
    }
    try {
      document.documentElement.style.setProperty(variableName, value);
      return success(void 0);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to set variable")
      );
    }
  }
  async getAllVariables() {
    if (!this.isAvailable()) {
      return success({});
    }
    try {
      const variables = {};
      const styles = getComputedStyle(document.documentElement);
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith("--")) {
          variables[prop] = styles.getPropertyValue(prop).trim();
        }
      }
      return success(variables);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to get variables")
      );
    }
  }
  isAvailable() {
    return typeof document !== "undefined" && typeof window !== "undefined";
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  initializeStyleElement() {
    let element = document.getElementById(this.options.styleElementId);
    if (!element) {
      element = document.createElement("style");
      element.id = this.options.styleElementId;
      document.head.appendChild(element);
    }
    this.styleElement = element;
  }
  initializeMediaQueryListener() {
    if (!this.options.useDarkModeMediaQuery) return;
    this.mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (_e) => {
      this.notifySystemPrefsChange();
      this.getPreferences().then((result) => {
        if (result.success && result.value.followSystem) {
          this.syncWithSystem();
        }
      });
    };
    this.mediaQueryList.addEventListener("change", handler);
  }
  loadPreferences() {
    this.getPreferences().then((result) => {
      if (!result.success) return;
      const prefs = result.value;
      if (prefs.preferredTheme) {
        this.switchTo(prefs.preferredTheme);
      }
      if (prefs.darkModeOverride !== null && prefs.darkModeOverride !== void 0) {
        this.isDarkMode = prefs.darkModeOverride;
      } else if (prefs.followSystem) {
        this.syncWithSystem();
      }
    });
  }
  generateCss(config) {
    const prefix = config.namespace || this.options.variablePrefix;
    const cssContent = config.tokens.export({
      format: "css",
      prefix
    });
    const selector = config.rootSelector || this.options.rootSelector;
    return `${selector} {
${cssContent}
}`;
  }
  enableTransitions(duration) {
    const ms = duration || this.options.defaultTransitionDuration;
    document.documentElement.style.setProperty(
      "--theme-transition",
      `all ${ms}ms ease-in-out`
    );
    document.documentElement.style.setProperty("transition", `var(--theme-transition)`);
  }
  disableTransitions() {
    document.documentElement.style.removeProperty("--theme-transition");
    document.documentElement.style.removeProperty("transition");
  }
  countAppliedVariables() {
    if (!this.styleElement?.textContent) return 0;
    const matches = this.styleElement.textContent.match(/--[^:]+:/g);
    return matches?.length || 0;
  }
  detectContrastPreference() {
    if (window.matchMedia("(prefers-contrast: more)").matches) return "more";
    if (window.matchMedia("(prefers-contrast: less)").matches) return "less";
    if (window.matchMedia("(prefers-contrast: custom)").matches) return "custom";
    return "no-preference";
  }
  notifyThemeChange() {
    this.getState().then((result) => {
      if (result.success) {
        for (const listener of this.themeChangeListeners) {
          listener(result.value);
        }
      }
    });
  }
  notifySystemPrefsChange() {
    this.detectSystemPreferences().then((result) => {
      if (result.success) {
        for (const listener of this.systemPrefsListeners) {
          listener(result.value);
        }
      }
    });
  }
};
var CssVariablesAdapter_default = CssVariablesAdapter;

export { CssVariablesAdapter, CssVariablesAdapter_default };
//# sourceMappingURL=chunk-MWLAVRNX.mjs.map
//# sourceMappingURL=chunk-MWLAVRNX.mjs.map