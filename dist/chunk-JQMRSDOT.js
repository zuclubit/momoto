'use strict';

var chunkM34SGDAQ_js = require('./chunk-M34SGDAQ.js');
var chunk5YMPXU57_js = require('./chunk-5YMPXU57.js');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

/* @zuclubit/momoto-ui - Color Intelligence Design System */
function themeReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_THEME":
      return {
        ...state,
        activeTheme: action.payload.name,
        isDark: action.payload.isDark,
        appliedTokens: action.payload.tokens,
        error: null,
        isLoading: false
      };
    case "SET_AVAILABLE_THEMES":
      return { ...state, availableThemes: action.payload };
    case "SET_SYSTEM_PREFERENCES":
      return { ...state, systemPreferences: action.payload };
    case "TOGGLE_DARK_MODE":
      return { ...state, isDark: !state.isDark };
    case "CLEAR_THEME":
      return {
        ...state,
        activeTheme: null,
        appliedTokens: null,
        error: null
      };
    default:
      return state;
  }
}
var initialState = {
  activeTheme: null,
  isDark: false,
  availableThemes: [],
  isLoading: true,
  error: null,
  systemPreferences: null,
  appliedTokens: null
};
var ThemeContext = react.createContext(null);
function ThemeProvider({
  children,
  initialTheme,
  themes = [],
  cssOptions,
  followSystem = false,
  onThemeChange,
  onSystemPreferencesChange
}) {
  const [state, dispatch] = react.useReducer(themeReducer, initialState);
  const adapterRef = react.useRef(null);
  const registeredThemesRef = react.useRef(/* @__PURE__ */ new Map());
  react.useEffect(() => {
    adapterRef.current = new chunkM34SGDAQ_js.CssVariablesAdapter(cssOptions);
    for (const theme of themes) {
      registeredThemesRef.current.set(theme.name, theme);
      adapterRef.current.registerTheme(theme);
    }
    dispatch({ type: "SET_AVAILABLE_THEMES", payload: Array.from(registeredThemesRef.current.keys()) });
    const unsubscribeTheme = adapterRef.current.onThemeChange((themeState) => {
      onThemeChange?.(themeState);
    });
    const unsubscribeSystem = adapterRef.current.onSystemPreferencesChange((prefs) => {
      dispatch({ type: "SET_SYSTEM_PREFERENCES", payload: prefs });
      onSystemPreferencesChange?.(prefs);
    });
    adapterRef.current.detectSystemPreferences().then((result) => {
      if (result.success) {
        dispatch({ type: "SET_SYSTEM_PREFERENCES", payload: result.value });
      }
    });
    if (initialTheme) {
      adapterRef.current.apply(initialTheme).then((result) => {
        if (result.success) {
          dispatch({
            type: "SET_THEME",
            payload: {
              name: initialTheme.name,
              isDark: initialTheme.isDark,
              tokens: initialTheme.tokens
            }
          });
        } else {
          dispatch({ type: "SET_ERROR", payload: result.error });
        }
      });
    } else if (followSystem) {
      adapterRef.current.syncWithSystem();
      dispatch({ type: "SET_LOADING", payload: false });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
    return () => {
      unsubscribeTheme();
      unsubscribeSystem();
    };
  }, []);
  react.useEffect(() => {
    if (!followSystem || !state.systemPreferences) return;
    const shouldBeDark = state.systemPreferences.prefersDark;
    if (shouldBeDark !== state.isDark && adapterRef.current) {
      adapterRef.current.toggleDarkMode({ animate: true });
    }
  }, [followSystem, state.systemPreferences?.prefersDark]);
  const applyTheme = react.useCallback(async (config) => {
    if (!adapterRef.current) {
      return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
    }
    dispatch({ type: "SET_LOADING", payload: true });
    const result = await adapterRef.current.apply(config);
    if (result.success) {
      registeredThemesRef.current.set(config.name, config);
      dispatch({
        type: "SET_THEME",
        payload: {
          name: config.name,
          isDark: config.isDark,
          tokens: config.tokens
        }
      });
      dispatch({
        type: "SET_AVAILABLE_THEMES",
        payload: Array.from(registeredThemesRef.current.keys())
      });
    } else {
      dispatch({ type: "SET_ERROR", payload: result.error });
    }
    return result;
  }, []);
  const switchTheme = react.useCallback(
    async (themeName, options) => {
      if (!adapterRef.current) {
        return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
      }
      const theme = registeredThemesRef.current.get(themeName);
      if (!theme) {
        return chunk5YMPXU57_js.failure(new Error(`Theme "${themeName}" not found`));
      }
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await adapterRef.current.switchTo(themeName, options);
      if (result.success) {
        dispatch({
          type: "SET_THEME",
          payload: {
            name: themeName,
            isDark: theme.isDark,
            tokens: theme.tokens
          }
        });
      } else {
        dispatch({ type: "SET_ERROR", payload: result.error });
      }
      return result;
    },
    []
  );
  const toggleDarkMode = react.useCallback(
    async (options) => {
      if (!adapterRef.current) {
        return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
      }
      const result = await adapterRef.current.toggleDarkMode(options);
      if (result.success) {
        dispatch({ type: "TOGGLE_DARK_MODE" });
      }
      return result;
    },
    []
  );
  const registerTheme = react.useCallback(async (config) => {
    if (!adapterRef.current) {
      return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
    }
    const result = await adapterRef.current.registerTheme(config);
    if (result.success) {
      registeredThemesRef.current.set(config.name, config);
      dispatch({
        type: "SET_AVAILABLE_THEMES",
        payload: Array.from(registeredThemesRef.current.keys())
      });
    }
    return result;
  }, []);
  const unregisterTheme = react.useCallback(
    async (themeName) => {
      if (!adapterRef.current) {
        return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
      }
      const result = await adapterRef.current.unregisterTheme(themeName);
      if (result.success) {
        registeredThemesRef.current.delete(themeName);
        dispatch({
          type: "SET_AVAILABLE_THEMES",
          payload: Array.from(registeredThemesRef.current.keys())
        });
        if (state.activeTheme === themeName) {
          dispatch({ type: "CLEAR_THEME" });
        }
      }
      return result;
    },
    [state.activeTheme]
  );
  const syncWithSystem = react.useCallback(async () => {
    if (!adapterRef.current) {
      return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
    }
    return adapterRef.current.syncWithSystem();
  }, []);
  const getPreferences = react.useCallback(async () => {
    if (!adapterRef.current) {
      return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
    }
    return adapterRef.current.getPreferences();
  }, []);
  const setPreferences = react.useCallback(
    async (prefs) => {
      if (!adapterRef.current) {
        return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
      }
      return adapterRef.current.setPreferences(prefs);
    },
    []
  );
  const getVariable = react.useCallback(
    async (name) => {
      if (!adapterRef.current) {
        return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
      }
      return adapterRef.current.getVariable(name);
    },
    []
  );
  const setVariable = react.useCallback(
    async (name, value) => {
      if (!adapterRef.current) {
        return chunk5YMPXU57_js.failure(new Error("Theme adapter not initialized"));
      }
      return adapterRef.current.setVariable(name, value);
    },
    []
  );
  const contextValue = react.useMemo(
    () => ({
      ...state,
      applyTheme,
      switchTheme,
      toggleDarkMode,
      registerTheme,
      unregisterTheme,
      syncWithSystem,
      getPreferences,
      setPreferences,
      getVariable,
      setVariable
    }),
    [
      state,
      applyTheme,
      switchTheme,
      toggleDarkMode,
      registerTheme,
      unregisterTheme,
      syncWithSystem,
      getPreferences,
      setPreferences,
      getVariable,
      setVariable
    ]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(ThemeContext.Provider, { value: contextValue, children });
}
function useThemeContext() {
  const context = react.useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
function useTheme() {
  const context = useThemeContext();
  return react.useMemo(
    () => ({
      /** Si el modo oscuro está activo */
      isDark: context.isDark,
      /** Nombre del tema activo */
      themeName: context.activeTheme,
      /** Si está cargando */
      isLoading: context.isLoading,
      /** Error actual */
      error: context.error,
      /** Preferencias del sistema */
      systemPreferences: context.systemPreferences
    }),
    [
      context.isDark,
      context.activeTheme,
      context.isLoading,
      context.error,
      context.systemPreferences
    ]
  );
}
function useDarkMode() {
  const { isDark, toggleDarkMode, switchTheme, activeTheme, availableThemes } = useThemeContext();
  const toggle = react.useCallback(
    (options) => toggleDarkMode(options),
    [toggleDarkMode]
  );
  const setDark = react.useCallback(
    async (options) => {
      if (isDark) return;
      const darkThemeName = activeTheme ? `${activeTheme}-dark` : null;
      if (darkThemeName && availableThemes.includes(darkThemeName)) {
        await switchTheme(darkThemeName, options);
      } else {
        await toggleDarkMode(options);
      }
    },
    [isDark, activeTheme, availableThemes, switchTheme, toggleDarkMode]
  );
  const setLight = react.useCallback(
    async (options) => {
      if (!isDark) return;
      const lightThemeName = activeTheme?.replace(/-dark$/, "") ?? null;
      if (lightThemeName && availableThemes.includes(lightThemeName)) {
        await switchTheme(lightThemeName, options);
      } else {
        await toggleDarkMode(options);
      }
    },
    [isDark, activeTheme, availableThemes, switchTheme, toggleDarkMode]
  );
  return react.useMemo(
    () => ({
      isDark,
      toggle,
      setDark,
      setLight
    }),
    [isDark, toggle, setDark, setLight]
  );
}
function useThemeSwitcher() {
  const { activeTheme, availableThemes, switchTheme, registerTheme, unregisterTheme } = useThemeContext();
  const switchTo = react.useCallback(
    (themeName, options) => switchTheme(themeName, options),
    [switchTheme]
  );
  return react.useMemo(
    () => ({
      /** Tema activo actual */
      current: activeTheme,
      /** Lista de temas disponibles */
      themes: availableThemes,
      /** Cambiar a un tema */
      switchTo,
      /** Registrar un nuevo tema */
      register: registerTheme,
      /** Eliminar un tema */
      unregister: unregisterTheme
    }),
    [activeTheme, availableThemes, switchTo, registerTheme, unregisterTheme]
  );
}
function useThemeVariable(variableName) {
  const { getVariable, setVariable } = useThemeContext();
  const [value, setValue] = react.useState(null);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState(null);
  react.useEffect(() => {
    let mounted = true;
    setLoading(true);
    getVariable(variableName).then((result) => {
      if (!mounted) return;
      if (result.success) {
        setValue(result.value);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [variableName, getVariable]);
  const set = react.useCallback(
    async (newValue) => {
      const result = await setVariable(variableName, newValue);
      if (result.success) {
        setValue(newValue);
      }
      return result;
    },
    [variableName, setVariable]
  );
  return react.useMemo(
    () => ({
      value,
      loading,
      error,
      set
    }),
    [value, loading, error, set]
  );
}
function useSystemPreferences() {
  const { systemPreferences, syncWithSystem } = useThemeContext();
  return react.useMemo(
    () => ({
      /** Prefiere modo oscuro */
      prefersDark: systemPreferences?.prefersDark ?? false,
      /** Prefiere movimiento reducido */
      prefersReducedMotion: systemPreferences?.prefersReducedMotion ?? false,
      /** Preferencia de contraste */
      prefersContrast: systemPreferences?.prefersContrast ?? "no-preference",
      /** Prefiere transparencia reducida */
      prefersReducedTransparency: systemPreferences?.prefersReducedTransparency ?? false,
      /** Colores forzados activos */
      forcedColors: systemPreferences?.forcedColors ?? false,
      /** Sincronizar tema con preferencias del sistema */
      sync: syncWithSystem
    }),
    [systemPreferences, syncWithSystem]
  );
}
function useAppliedTokens() {
  const { appliedTokens } = useThemeContext();
  return react.useMemo(
    () => ({
      /** Colección de tokens aplicados */
      tokens: appliedTokens,
      /** Si hay tokens aplicados */
      hasTokens: appliedTokens !== null
    }),
    [appliedTokens]
  );
}
function useThemePreferences() {
  const { getPreferences, setPreferences } = useThemeContext();
  const [preferences, setLocalPreferences] = react.useState(null);
  const [loading, setLoading] = react.useState(true);
  react.useEffect(() => {
    let mounted = true;
    getPreferences().then((result) => {
      if (!mounted) return;
      if (result.success) {
        setLocalPreferences(result.value);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [getPreferences]);
  const setFollowSystem = react.useCallback(
    async (follow) => {
      await setPreferences({ followSystem: follow });
      setLocalPreferences((prev) => prev ? { ...prev, followSystem: follow } : { followSystem: follow });
    },
    [setPreferences]
  );
  const setPreferredTheme = react.useCallback(
    async (themeName) => {
      await setPreferences({ preferredTheme: themeName });
      setLocalPreferences((prev) => prev ? { ...prev, preferredTheme: themeName } : { preferredTheme: themeName });
    },
    [setPreferences]
  );
  const setDarkModeOverride = react.useCallback(
    async (isDark) => {
      await setPreferences({ darkModeOverride: isDark });
      setLocalPreferences((prev) => prev ? { ...prev, darkModeOverride: isDark } : { darkModeOverride: isDark });
    },
    [setPreferences]
  );
  return react.useMemo(
    () => ({
      preferences,
      loading,
      setFollowSystem,
      setPreferredTheme,
      setDarkModeOverride
    }),
    [preferences, loading, setFollowSystem, setPreferredTheme, setDarkModeOverride]
  );
}

exports.ThemeContext = ThemeContext;
exports.ThemeProvider = ThemeProvider;
exports.useAppliedTokens = useAppliedTokens;
exports.useDarkMode = useDarkMode;
exports.useSystemPreferences = useSystemPreferences;
exports.useTheme = useTheme;
exports.useThemeContext = useThemeContext;
exports.useThemePreferences = useThemePreferences;
exports.useThemeSwitcher = useThemeSwitcher;
exports.useThemeVariable = useThemeVariable;
//# sourceMappingURL=chunk-JQMRSDOT.js.map
//# sourceMappingURL=chunk-JQMRSDOT.js.map