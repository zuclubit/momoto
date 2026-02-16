import { _ as Result } from '../../UIState-DmEU8dBf.mjs';
import { T as ThemeAdapterPort, b as ThemeConfig, a as ThemeChangeOptions, d as ThemeState, c as ThemePreferences, S as SystemPreferences } from '../../ThemeAdapterPort-gPCXWkLs.mjs';
import '../../TokenCollection-CtE784DZ.mjs';
import '../../DesignToken-Bln084x4.mjs';

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
    private mediaQueryHandler;
    private pendingTimeouts;
    private isDisposed;
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
    /**
     * Dispose of the adapter and clean up all resources.
     *
     * Call this method when the adapter is no longer needed to prevent memory leaks.
     * After calling dispose(), the adapter should not be used.
     *
     * @example
     * ```typescript
     * const adapter = new CssVariablesAdapter();
     * // ... use adapter ...
     * adapter.dispose(); // Clean up when done
     * ```
     */
    dispose(): void;
}

export { type CssAdapterOptions, CssVariablesAdapter, CssVariablesAdapter as default };
