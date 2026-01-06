import { R as Result } from '../../UIState-CG23I-mF.mjs';
import { T as ThemeAdapterPort, a as ThemeConfig, c as ThemeChangeOptions, b as ThemeState, d as ThemePreferences, S as SystemPreferences } from '../../ThemeAdapterPort-CuBksSzq.mjs';
import '../../TokenCollection-BHaIwQnZ.mjs';
import '../../DesignToken-CKW5vfOU.mjs';

/**
 * @fileoverview CSS Variables Adapter
 *
 * Adaptador para aplicar tokens de diseño como CSS Custom Properties.
 * Implementa ThemeAdapterPort para entornos DOM.
 *
 * @module momoto-ui/adapters/css/CssVariablesAdapter
 * @version 1.0.0
 */

/**
 * Opciones de configuración del adaptador CSS.
 */
interface CssAdapterOptions {
    /** Selector raíz para aplicar variables */
    readonly rootSelector?: string;
    /** Prefijo para variables CSS */
    readonly variablePrefix?: string;
    /** ID del elemento style a crear/usar */
    readonly styleElementId?: string;
    /** Si usar media query para modo oscuro */
    readonly useDarkModeMediaQuery?: boolean;
    /** Clase para modo oscuro */
    readonly darkModeClass?: string;
    /** Clave de localStorage para preferencias */
    readonly storageKey?: string;
    /** Duración de transición por defecto (ms) */
    readonly defaultTransitionDuration?: number;
}
/**
 * CssVariablesAdapter - Adaptador de temas para CSS Custom Properties.
 *
 * Este adaptador aplica tokens de diseño al DOM mediante CSS Custom Properties,
 * con soporte para modo oscuro, transiciones y persistencia de preferencias.
 *
 * @example
 * ```typescript
 * const adapter = new CssVariablesAdapter({
 *   rootSelector: ':root',
 *   darkModeClass: 'dark',
 *   useDarkModeMediaQuery: true,
 * });
 *
 * await adapter.apply({
 *   name: 'brand',
 *   isDark: false,
 *   tokens: tokenCollection,
 * });
 *
 * // Later, toggle dark mode
 * await adapter.toggleDarkMode({ animate: true });
 * ```
 */
declare class CssVariablesAdapter implements ThemeAdapterPort {
    private readonly options;
    private registeredThemes;
    private activeTheme;
    private isDarkMode;
    private styleElement;
    private themeChangeListeners;
    private systemPrefsListeners;
    private mediaQueryList;
    constructor(options?: CssAdapterOptions);
    apply(config: ThemeConfig): Promise<Result<void, Error>>;
    remove(): Promise<Result<void, Error>>;
    switchTo(themeName: string, options?: ThemeChangeOptions): Promise<Result<void, Error>>;
    toggleDarkMode(options?: ThemeChangeOptions): Promise<Result<void, Error>>;
    getState(): Promise<Result<ThemeState, Error>>;
    registerTheme(config: ThemeConfig): Promise<Result<void, Error>>;
    unregisterTheme(themeName: string): Promise<Result<void, Error>>;
    listThemes(): Promise<Result<string[], Error>>;
    getPreferences(): Promise<Result<ThemePreferences, Error>>;
    setPreferences(preferences: Partial<ThemePreferences>): Promise<Result<void, Error>>;
    detectSystemPreferences(): Promise<Result<SystemPreferences, Error>>;
    syncWithSystem(): Promise<Result<void, Error>>;
    onThemeChange(callback: (state: ThemeState) => void): () => void;
    onSystemPreferencesChange(callback: (prefs: SystemPreferences) => void): () => void;
    getVariable(variableName: string): Promise<Result<string | null, Error>>;
    setVariable(variableName: string, value: string): Promise<Result<void, Error>>;
    getAllVariables(): Promise<Result<Record<string, string>, Error>>;
    isAvailable(): boolean;
    private initializeStyleElement;
    private initializeMediaQueryListener;
    private loadPreferences;
    private generateCss;
    private enableTransitions;
    private disableTransitions;
    private countAppliedVariables;
    private detectContrastPreference;
    private notifyThemeChange;
    private notifySystemPrefsChange;
}

export { type CssAdapterOptions, CssVariablesAdapter, CssVariablesAdapter as default };
