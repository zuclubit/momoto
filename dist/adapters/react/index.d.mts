import React__default, { ReactNode } from 'react';
import { R as Result } from '../../UIState-CG23I-mF.mjs';
import { T as TokenCollection } from '../../TokenCollection-BHaIwQnZ.mjs';
import { a as ThemeConfig, b as ThemeState, S as SystemPreferences, c as ThemeChangeOptions, d as ThemePreferences } from '../../ThemeAdapterPort-CuBksSzq.mjs';
import { CssAdapterOptions } from '../css/index.mjs';
import '../../DesignToken-CKW5vfOU.mjs';

/**
 * @fileoverview React Theme Provider
 *
 * Provider de React para el sistema de temas basado en Color Intelligence.
 * Implementa ThemeAdapterPort para entornos React.
 *
 * @module momoto-ui/adapters/react/ReactThemeProvider
 * @version 1.0.0
 */

/**
 * Estado del contexto de tema.
 */
interface ThemeContextState {
    /** Tema activo actual */
    readonly activeTheme: string | null;
    /** Si está en modo oscuro */
    readonly isDark: boolean;
    /** Temas disponibles */
    readonly availableThemes: string[];
    /** Si está cargando */
    readonly isLoading: boolean;
    /** Error actual si existe */
    readonly error: Error | null;
    /** Preferencias del sistema */
    readonly systemPreferences: SystemPreferences | null;
    /** Tokens aplicados actualmente */
    readonly appliedTokens: TokenCollection | null;
}
/**
 * Acciones disponibles en el contexto.
 */
interface ThemeContextActions {
    /** Aplica un tema */
    applyTheme: (config: ThemeConfig) => Promise<Result<void, Error>>;
    /** Cambia a un tema registrado */
    switchTheme: (themeName: string, options?: ThemeChangeOptions) => Promise<Result<void, Error>>;
    /** Alterna modo oscuro */
    toggleDarkMode: (options?: ThemeChangeOptions) => Promise<Result<void, Error>>;
    /** Registra un nuevo tema */
    registerTheme: (config: ThemeConfig) => Promise<Result<void, Error>>;
    /** Elimina un tema registrado */
    unregisterTheme: (themeName: string) => Promise<Result<void, Error>>;
    /** Sincroniza con preferencias del sistema */
    syncWithSystem: () => Promise<Result<void, Error>>;
    /** Obtiene preferencias guardadas */
    getPreferences: () => Promise<Result<ThemePreferences, Error>>;
    /** Guarda preferencias */
    setPreferences: (prefs: Partial<ThemePreferences>) => Promise<Result<void, Error>>;
    /** Obtiene una variable CSS */
    getVariable: (name: string) => Promise<Result<string | null, Error>>;
    /** Establece una variable CSS */
    setVariable: (name: string, value: string) => Promise<Result<void, Error>>;
}
/**
 * Valor completo del contexto de tema.
 */
type ThemeContextValue = ThemeContextState & ThemeContextActions;
/**
 * Props del ThemeProvider.
 */
interface ThemeProviderProps {
    /** Nodos hijos */
    children: ReactNode;
    /** Tema inicial a aplicar */
    initialTheme?: ThemeConfig;
    /** Temas pre-registrados */
    themes?: ThemeConfig[];
    /** Opciones del adaptador CSS */
    cssOptions?: CssAdapterOptions;
    /** Si sincronizar automáticamente con el sistema */
    followSystem?: boolean;
    /** Callback cuando cambia el tema */
    onThemeChange?: (state: ThemeState) => void;
    /** Callback cuando cambian las preferencias del sistema */
    onSystemPreferencesChange?: (prefs: SystemPreferences) => void;
}
declare const ThemeContext: React__default.Context<ThemeContextValue | null>;
/**
 * ThemeProvider - Provider de React para el sistema de temas.
 *
 * Envuelve la aplicación para proporcionar acceso al sistema de temas
 * basado en Color Intelligence.
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@zuclubit/momoto-ui/adapters/react';
 *
 * function App() {
 *   return (
 *     <ThemeProvider
 *       initialTheme={brandTheme}
 *       themes={[brandTheme, brandDarkTheme]}
 *       followSystem={true}
 *       onThemeChange={(state) => console.log('Theme changed:', state)}
 *     >
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
declare function ThemeProvider({ children, initialTheme, themes, cssOptions, followSystem, onThemeChange, onSystemPreferencesChange, }: ThemeProviderProps): React__default.ReactElement;
/**
 * Hook para acceder al contexto de tema.
 *
 * @throws Error si se usa fuera de ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     isDark,
 *     activeTheme,
 *     toggleDarkMode,
 *     switchTheme,
 *   } = useThemeContext();
 *
 *   return (
 *     <button onClick={() => toggleDarkMode({ animate: true })}>
 *       {isDark ? '🌙' : '☀️'}
 *     </button>
 *   );
 * }
 * ```
 */
declare function useThemeContext(): ThemeContextValue;

require('./chunk-6X6S3TNF.js');
var chunk3TMKA3SC_js = require('./chunk-3TMKA3SC.js');
var chunkWTTLT5UT_js = require('./chunk-WTTLT5UT.js');
var chunkWT2WCRGB_js = require('./chunk-WT2WCRGB.js');
require('./chunk-GQ57ELE2.js');
var chunkINDVKMSQ_js = require('./chunk-INDVKMSQ.js');
var chunkUQITNDIL_js = require('./chunk-UQITNDIL.js');
var chunkZOXFJ3DQ_js = require('./chunk-ZOXFJ3DQ.js');
var chunkLLXCPT4B_js = require('./chunk-LLXCPT4B.js');
var chunkX3KESCNX_js = require('./chunk-X3KESCNX.js');
var chunkJQMRSDOT_js = require('./chunk-JQMRSDOT.js');
require('./chunk-VY6ULM67.js');
var chunkM34SGDAQ_js = require('./chunk-M34SGDAQ.js');
var chunkDJQAGD5B_js = require('./chunk-DJQAGD5B.js');
require('./chunk-CPA5K77K.js');
var chunkG26SQWFY_js = require('./chunk-G26SQWFY.js');
var chunk63UENVY2_js = require('./chunk-63UENVY2.js');
var chunk5YMPXU57_js = require('./chunk-5YMPXU57.js');
require('./chunk-ZM4FIU5F.js');



Object.defineProperty(exports, "ColorScale", {
  enumerable: true,
  get: function () { return chunk3TMKA3SC_js.ColorScale; }
});
Object.defineProperty(exports, "ColorSwatch", {
  enumerable: true,
  get: function () { return chunk3TMKA3SC_js.ColorSwatch; }
});
Object.defineProperty(exports, "ColorSwatchGroup", {
  enumerable: true,
  get: function () { return chunk3TMKA3SC_js.ColorSwatchGroup; }
});
Object.defineProperty(exports, "TokenDisplay", {
  enumerable: true,
  get: function () { return chunk3TMKA3SC_js.TokenDisplay; }
});
Object.defineProperty(exports, "AccessibleButton", {
  enumerable: true,
  get: function () { return chunkWTTLT5UT_js.AccessibleButton; }
});
Object.defineProperty(exports, "ColorBlindnessCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.ColorBlindnessCheck; }
});
Object.defineProperty(exports, "ConformanceChecker", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.ConformanceChecker; }
});
Object.defineProperty(exports, "ConformanceCheckerDefault", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.conformance_default; }
});
Object.defineProperty(exports, "ContrastRatioCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.ContrastRatioCheck; }
});
Object.defineProperty(exports, "DependencyDirectionCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.DependencyDirectionCheck; }
});
Object.defineProperty(exports, "GamutBoundaryCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.GamutBoundaryCheck; }
});
Object.defineProperty(exports, "HardcodedColorCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.HardcodedColorCheck; }
});
Object.defineProperty(exports, "PerceptualUniformityCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.PerceptualUniformityCheck; }
});
Object.defineProperty(exports, "PortContractCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.PortContractCheck; }
});
Object.defineProperty(exports, "ReportGenerator", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.ReportGenerator; }
});
Object.defineProperty(exports, "ReportGeneratorDefault", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.report_generator_default; }
});
Object.defineProperty(exports, "TokenCompletenessCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.TokenCompletenessCheck; }
});
Object.defineProperty(exports, "TokenNamingConventionCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.TokenNamingConventionCheck; }
});
Object.defineProperty(exports, "TokenTypeValidationCheck", {
  enumerable: true,
  get: function () { return chunkWT2WCRGB_js.TokenTypeValidationCheck; }
});
Object.defineProperty(exports, "ApplyPerceptualPolicy", {
  enumerable: true,
  get: function () { return chunkINDVKMSQ_js.ApplyPerceptualPolicy; }
});
Object.defineProperty(exports, "AuditVisualDecisions", {
  enumerable: true,
  get: function () { return chunkINDVKMSQ_js.AuditVisualDecisions; }
});
Object.defineProperty(exports, "EXPORT_PRESETS", {
  enumerable: true,
  get: function () { return chunkINDVKMSQ_js.EXPORT_PRESETS; }
});
Object.defineProperty(exports, "EvaluateComponentAccessibility", {
  enumerable: true,
  get: function () { return chunkINDVKMSQ_js.EvaluateComponentAccessibility; }
});
Object.defineProperty(exports, "ExportDesignTokens", {
  enumerable: true,
  get: function () { return chunkINDVKMSQ_js.ExportDesignTokens; }
});
Object.defineProperty(exports, "GenerateComponentTokens", {
  enumerable: true,
  get: function () { return chunkINDVKMSQ_js.GenerateComponentTokens; }
});
Object.defineProperty(exports, "PRESET_POLICIES", {
  enumerable: true,
  get: function () { return chunkINDVKMSQ_js.PRESET_POLICIES; }
});
Object.defineProperty(exports, "COMPONENT_INTENTS", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.COMPONENT_INTENTS; }
});
Object.defineProperty(exports, "ComponentIntent", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.ComponentIntent; }
});
Object.defineProperty(exports, "DEFAULT_CONFIG", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.DEFAULT_CONFIG; }
});
Object.defineProperty(exports, "DEFAULT_DERIVATION_CONFIG", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.DEFAULT_DERIVATION_CONFIG; }
});
Object.defineProperty(exports, "DesignToken", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.DesignToken; }
});
Object.defineProperty(exports, "INTENT_CATEGORIES", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.INTENT_CATEGORIES; }
});
Object.defineProperty(exports, "INTENT_SEVERITY", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.INTENT_SEVERITY; }
});
Object.defineProperty(exports, "INTENT_VARIANTS", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.INTENT_VARIANTS; }
});
Object.defineProperty(exports, "LIGHTNESS_SCALE", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.LIGHTNESS_SCALE; }
});
Object.defineProperty(exports, "ROLE_ACCESSIBILITY", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.ROLE_ACCESSIBILITY; }
});
Object.defineProperty(exports, "RolePair", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.RolePair; }
});
Object.defineProperty(exports, "STATE_DERIVATION_RULES", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.STATE_DERIVATION_RULES; }
});
Object.defineProperty(exports, "STATE_PRIORITY", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.STATE_PRIORITY; }
});
Object.defineProperty(exports, "STATE_TRANSITIONS", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.STATE_TRANSITIONS; }
});
Object.defineProperty(exports, "TokenCollection", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.TokenCollection; }
});
Object.defineProperty(exports, "TokenDerivationService", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.TokenDerivationService; }
});
Object.defineProperty(exports, "UIRole", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.UIRole; }
});
Object.defineProperty(exports, "UIState", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.UIState; }
});
Object.defineProperty(exports, "UIStateMachine", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.UIStateMachine; }
});
Object.defineProperty(exports, "UI_ROLES", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.UI_ROLES; }
});
Object.defineProperty(exports, "UI_STATES", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.UI_STATES; }
});
Object.defineProperty(exports, "UXDecision", {
  enumerable: true,
  get: function () { return chunkUQITNDIL_js.UXDecision; }
});
Object.defineProperty(exports, "GovernanceContext", {
  enumerable: true,
  get: function () { return chunkZOXFJ3DQ_js.GovernanceContext; }
});
Object.defineProperty(exports, "GovernanceProvider", {
  enumerable: true,
  get: function () { return chunkZOXFJ3DQ_js.GovernanceProvider; }
});
Object.defineProperty(exports, "useAccessibilityGovernance", {
  enumerable: true,
  get: function () { return chunkZOXFJ3DQ_js.useAccessibilityGovernance; }
});
Object.defineProperty(exports, "useColorGovernance", {
  enumerable: true,
  get: function () { return chunkZOXFJ3DQ_js.useColorGovernance; }
});
Object.defineProperty(exports, "useComplianceStatus", {
  enumerable: true,
  get: function () { return chunkZOXFJ3DQ_js.useComplianceStatus; }
});
Object.defineProperty(exports, "useGovernance", {
  enumerable: true,
  get: function () { return chunkZOXFJ3DQ_js.useGovernance; }
});
Object.defineProperty(exports, "ConsoleAuditAdapter", {
  enumerable: true,
  get: function () { return chunkLLXCPT4B_js.ConsoleAuditAdapter; }
});
Object.defineProperty(exports, "EnforceEnterpriseGovernance", {
  enumerable: true,
  get: function () { return chunkLLXCPT4B_js.EnforceEnterpriseGovernance; }
});
Object.defineProperty(exports, "NoOpAuditAdapter", {
  enumerable: true,
  get: function () { return chunkLLXCPT4B_js.NoOpAuditAdapter; }
});
Object.defineProperty(exports, "checkAccessibilityGovernance", {
  enumerable: true,
  get: function () { return chunkLLXCPT4B_js.checkAccessibilityGovernance; }
});
Object.defineProperty(exports, "checkColorGovernance", {
  enumerable: true,
  get: function () { return chunkLLXCPT4B_js.checkColorGovernance; }
});
Object.defineProperty(exports, "consoleAuditAdapter", {
  enumerable: true,
  get: function () { return chunkLLXCPT4B_js.consoleAuditAdapter; }
});
Object.defineProperty(exports, "noOpAuditAdapter", {
  enumerable: true,
  get: function () { return chunkLLXCPT4B_js.noOpAuditAdapter; }
});
Object.defineProperty(exports, "APCA_THRESHOLDS", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.APCA_THRESHOLDS; }
});
Object.defineProperty(exports, "AccessibilityService", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.AccessibilityService; }
});
Object.defineProperty(exports, "ENTERPRISE_POLICIES", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.ENTERPRISE_POLICIES; }
});
Object.defineProperty(exports, "EnterprisePolicy", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.EnterprisePolicy; }
});
Object.defineProperty(exports, "GovernanceEvaluator", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.GovernanceEvaluator; }
});
Object.defineProperty(exports, "PerceptualColor", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.PerceptualColor; }
});
Object.defineProperty(exports, "PolicySet", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.PolicySet; }
});
Object.defineProperty(exports, "WCAG_THRESHOLDS", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.WCAG_THRESHOLDS; }
});
Object.defineProperty(exports, "accessibilityService", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.accessibilityService; }
});
Object.defineProperty(exports, "createDefaultPolicySet", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.createDefaultPolicySet; }
});
Object.defineProperty(exports, "createLenientPolicySet", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.createLenientPolicySet; }
});
Object.defineProperty(exports, "createStrictPolicySet", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.createStrictPolicySet; }
});
Object.defineProperty(exports, "governanceEvaluator", {
  enumerable: true,
  get: function () { return chunkX3KESCNX_js.governanceEvaluator; }
});
Object.defineProperty(exports, "ThemeContext", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.ThemeContext; }
});
Object.defineProperty(exports, "ThemeProvider", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.ThemeProvider; }
});
Object.defineProperty(exports, "useAppliedTokens", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useAppliedTokens; }
});
Object.defineProperty(exports, "useDarkMode", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useDarkMode; }
});
Object.defineProperty(exports, "useSystemPreferences", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useSystemPreferences; }
});
Object.defineProperty(exports, "useTheme", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useTheme; }
});
Object.defineProperty(exports, "useThemeContext", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useThemeContext; }
});
Object.defineProperty(exports, "useThemePreferences", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useThemePreferences; }
});
Object.defineProperty(exports, "useThemeSwitcher", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useThemeSwitcher; }
});
Object.defineProperty(exports, "useThemeVariable", {
  enumerable: true,
  get: function () { return chunkJQMRSDOT_js.useThemeVariable; }
});
Object.defineProperty(exports, "CssVariablesAdapter", {
  enumerable: true,
  get: function () { return chunkM34SGDAQ_js.CssVariablesAdapter; }
});
Object.defineProperty(exports, "TailwindConfigAdapter", {
  enumerable: true,
  get: function () { return chunkDJQAGD5B_js.TailwindConfigAdapter; }
});
Object.defineProperty(exports, "InMemoryAuditAdapter", {
  enumerable: true,
  get: function () { return chunkG26SQWFY_js.InMemoryAuditAdapter; }
});
Object.defineProperty(exports, "W3CTokenExporter", {
  enumerable: true,
  get: function () { return chunk63UENVY2_js.W3CTokenExporter; }
});
Object.defineProperty(exports, "BrandConstructors", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.BrandConstructors; }
});
Object.defineProperty(exports, "TypeGuards", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.TypeGuards; }
});
Object.defineProperty(exports, "failure", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.failure; }
});
Object.defineProperty(exports, "success", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.success; }
});
Object.defineProperty(exports, "tryBrand", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.tryBrand; }
});
Object.defineProperty(exports, "unwrap", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.unwrap; }
});
Object.defineProperty(exports, "unwrapOr", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.unwrapOr; }
});
Object.defineProperty(exports, "validationFailure", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.validationFailure; }
});
Object.defineProperty(exports, "validationSuccess", {
  enumerable: true,
  get: function () { return chunk5YMPXU57_js.validationSuccess; }
});

/**
 * Hook simplificado para acceder al estado del tema.
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { isDark, themeName } = useTheme();
 *
 *   return (
 *     <header className={isDark ? 'bg-gray-900' : 'bg-white'}>
 *       Current theme: {themeName}
 *     </header>
 *   );
 * }
 * ```
 */
declare function useTheme(): {
    /** Si el modo oscuro está activo */
    isDark: boolean;
    /** Nombre del tema activo */
    themeName: string | null;
    /** Si está cargando */
    isLoading: boolean;
    /** Error actual */
    error: Error | null;
    /** Preferencias del sistema */
    systemPreferences: undefined | null;
};
/**
 * Hook para controlar el modo oscuro.
 *
 * @example
 * ```tsx
 * function DarkModeToggle() {
 *   const { isDark, toggle, setDark, setLight } = useDarkMode();
 *
 *   return (
 *     <div>
 *       <button onClick={toggle}>Toggle</button>
 *       <button onClick={setDark}>Dark</button>
 *       <button onClick={setLight}>Light</button>
 *       <span>{isDark ? '🌙' : '☀️'}</span>
 *     </div>
 *   );
 * }
 * ```
 */
declare function useDarkMode(): {
    isDark: boolean;
    toggle: (options?: ThemeChangeOptions) => Promise<undefined<void, Error>>;
    setDark: (options?: ThemeChangeOptions) => Promise<void>;
    setLight: (options?: ThemeChangeOptions) => Promise<void>;
}
/**
 * Hook para cambiar entre temas.
 *
 * @example
 * ```tsx
 * function ThemePicker() {
 *   const { themes, current, switchTo } = useThemeSwitcher();
 *
 *   return (
 *     <select
 *       value={current ?? ''}
 *       onChange={(e) => switchTo(e.target.value, { animate: true })}
 *     >
 *       {themes.map((theme) => (
 *         <option key={theme} value={theme}>
 *           {theme}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
declare function useThemeSwitcher(): {
    /** Tema activo actual */
    current: string | null;
    /** Lista de temas disponibles */
    themes: string[];
    /** Cambiar a un tema */
    switchTo: (themeName: string, options?: ThemeChangeOptions) => Promise<undefined<void, Error>>;
    /** Registrar un nuevo tema */
    register: (config: undefined) => Promise<undefined<void, Error>>;
    /** Eliminar un tema */
    unregister: (themeName: string) => Promise<undefined<void, Error>>;
}
/**
 * Hook para acceder a variables CSS del tema.
 *
 * @example
 * ```tsx
 * function BrandColorDisplay() {
 *   const { value, loading } = useThemeVariable('--color-brand-500');
 *
 *   if (loading) return <span>Loading...</span>;
 *
 *   return (
 *     <div style={{ backgroundColor: value ?? '#ccc' }}>
 *       Brand color: {value}
 *     </div>
 *   );
 * }
 * ```
 */
declare function useThemeVariable(variableName: string): {
    value: string | null;
    loading: boolean;
    error: Error | null;
    set: (newValue: string) => Promise<undefined<void, Error>>;
}
/**
 * Hook para detectar preferencias del sistema.
 *
 * @example
 * ```tsx
 * function AccessibilityInfo() {
 *   const {
 *     prefersDark,
 *     prefersReducedMotion,
 *     prefersContrast,
 *   } = useSystemPreferences();
 *
 *   return (
 *     <div>
 *       <p>Prefers dark: {prefersDark ? 'Yes' : 'No'}</p>
 *       <p>Reduced motion: {prefersReducedMotion ? 'Yes' : 'No'}</p>
 *       <p>Contrast: {prefersContrast}</p>
 *     </div>
 *   );
 * }
 * ```
 */
declare function useSystemPreferences(): {
    /** Prefiere modo oscuro */
    prefersDark: boolean;
    /** Prefiere movimiento reducido */
    prefersReducedMotion: boolean;
    /** Preferencia de contraste */
    prefersContrast: "custom" | "less" | "more" | "no-preference";
    /** Prefiere transparencia reducida */
    prefersReducedTransparency: boolean;
    /** Colores forzados activos */
    forcedColors: boolean;
    /** Sincronizar tema con preferencias del sistema */
    sync: () => Promise<undefined<void, Error>>;
}
/**
 * Hook para acceder a los tokens aplicados actualmente.
 *
 * @example
 * ```tsx
 * function TokenDebugger() {
 *   const { tokens, hasTokens } = useAppliedTokens();
 *
 *   if (!hasTokens) return <p>No tokens applied</p>;
 *
 *   return (
 *     <pre>
 *       {tokens?.export({ format: 'json' })}
 *     </pre>
 *   );
 * }
 * ```
 */
declare function useAppliedTokens(): {
    /** Colección de tokens aplicados */
    tokens: undefined | null;
    /** Si hay tokens aplicados */
    hasTokens: boolean;
};
/**
 * Hook para manejar preferencias de tema persistidas.
 *
 * @example
 * ```tsx
 * function PreferencesManager() {
 *   const {
 *     preferences,
 *     loading,
 *     setFollowSystem,
 *     setPreferredTheme,
 *   } = useThemePreferences();
 *
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={preferences?.followSystem ?? false}
 *           onChange={(e) => setFollowSystem(e.target.checked)}
 *         />
 *         Follow system
 *       </label>
 *     </div>
 *   );
 * }
 * ```
 */
declare function useThemePreferences(): {
    preferences: Record<string, unknown> | null;
    loading: boolean;
    setFollowSystem: (follow: boolean) => Promise<void>;
    setPreferredTheme: (themeName: string) => Promise<void>;
    setDarkModeOverride: (isDark: boolean | null) => Promise<void>;
};

export { ThemeContext, type ThemeContextActions, type ThemeContextState, type ThemeContextValue, ThemeProvider, type ThemeProviderProps, useAppliedTokens, useDarkMode, useSystemPreferences, useTheme, useThemeContext, useThemePreferences, useThemeSwitcher, useThemeVariable };
