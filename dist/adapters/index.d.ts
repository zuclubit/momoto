export { CssAdapterOptions, CssVariablesAdapter } from './css/index.js';
export { ThemeContext, ThemeContextActions, ThemeContextState, ThemeContextValue, ThemeProvider, ThemeProviderProps, useAppliedTokens, useDarkMode, useSystemPreferences, useTheme, useThemeContext, useThemePreferences, useThemeSwitcher, useThemeVariable } from './react/index.js';
export { FullTailwindConfig, TailwindAdapterOptions, TailwindConfigAdapter, TailwindConfigResult, TailwindThemeConfig } from './tailwind/index.js';
import * as React from 'react';
import { ReactNode, ReactElement } from 'react';
import { d as GovernanceEnforcementOutput } from '../EnforceEnterpriseGovernance-DZntOSrO.js';
import { E as EnterprisePolicy, P as PolicySet, i as PolicyScope } from '../GovernanceEvaluator-EG_kiS-i.js';
import { T as TokenCollection } from '../TokenCollection-q4YtsOMz.js';
import '../UIState-CG23I-mF.js';
import '../ThemeAdapterPort-U3_XSldO.js';
import '../DesignToken-wtGoW8Zp.js';

/**
 * Governance mode determines policy strictness.
 */
type GovernanceMode = 'strict' | 'default' | 'lenient' | 'disabled';
/**
 * Configuration for the GovernanceProvider.
 */
interface GovernanceProviderConfig {
    /** Governance mode */
    mode?: GovernanceMode;
    /** Enable console logging */
    enableAuditLog?: boolean;
    /** Custom policies to add */
    customPolicies?: EnterprisePolicy[];
    /** Whether to fail-fast on blocking violations */
    failFast?: boolean;
    /** Auto-fix violations when possible */
    autoFix?: boolean;
}
/**
 * Governance context value.
 */
interface GovernanceContextValue {
    readonly mode: GovernanceMode;
    readonly policySet: PolicySet;
    readonly isEnabled: boolean;
    readonly setMode: (mode: GovernanceMode) => void;
    readonly addPolicy: (policy: EnterprisePolicy) => void;
    readonly removePolicy: (policyId: string) => void;
    readonly enablePolicy: (policyId: string) => void;
    readonly disablePolicy: (policyId: string) => void;
    readonly checkColor: (colorHex: string, purpose?: 'brand' | 'text' | 'background' | 'border') => Promise<GovernanceEnforcementOutput | null>;
    readonly checkAccessibility: (foregroundHex: string, backgroundHex: string) => Promise<GovernanceEnforcementOutput | null>;
    readonly checkTokens: (tokens: TokenCollection) => Promise<GovernanceEnforcementOutput | null>;
    readonly checkTheme: (config: {
        hasLightMode: boolean;
        hasDarkMode: boolean;
        brandColorHex?: string;
    }) => Promise<GovernanceEnforcementOutput | null>;
    readonly checkComponent: (componentName: string, tokens?: TokenCollection, brandColorHex?: string) => Promise<GovernanceEnforcementOutput | null>;
    readonly isColorCompliant: (colorHex: string) => Promise<boolean>;
    readonly isAccessibilityCompliant: (fg: string, bg: string) => Promise<boolean>;
    readonly getPoliciesByScope: (scope: PolicyScope) => readonly EnterprisePolicy[];
    readonly getComplianceScore: () => number;
}
declare const GovernanceContext: React.Context<GovernanceContextValue | null>;
/**
 * GovernanceProvider - React provider for enterprise governance.
 *
 * Wrap your application with this provider to enable governance
 * checks throughout your component tree.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GovernanceProvider>
 *   <App />
 * </GovernanceProvider>
 *
 * // Strict mode with audit logging
 * <GovernanceProvider mode="strict" enableAuditLog>
 *   <App />
 * </GovernanceProvider>
 *
 * // With custom policies
 * <GovernanceProvider customPolicies={[myCustomPolicy]}>
 *   <App />
 * </GovernanceProvider>
 * ```
 */
declare function GovernanceProvider({ children, mode: initialMode, enableAuditLog, customPolicies, failFast, autoFix, }: GovernanceProviderConfig & {
    children: ReactNode;
}): ReactElement;
/**
 * Hook to access the governance context.
 *
 * @throws Error if used outside GovernanceProvider
 */
declare function useGovernance(): GovernanceContextValue;
/**
 * Hook for color governance checks.
 *
 * @example
 * ```tsx
 * function ColorPicker({ color }: { color: string }) {
 *   const { isCompliant, result, check } = useColorGovernance(color);
 *
 *   return (
 *     <div>
 *       <div style={{ backgroundColor: color }} />
 *       {!isCompliant && <span>This color has issues</span>}
 *     </div>
 *   );
 * }
 * ```
 */
declare function useColorGovernance(colorHex: string, purpose?: 'brand' | 'text' | 'background' | 'border'): {
    isCompliant: boolean;
    result: GovernanceEnforcementOutput | null;
    loading: boolean;
    check: () => Promise<void>;
};
/**
 * Hook for accessibility governance checks.
 */
declare function useAccessibilityGovernance(foregroundHex: string, backgroundHex: string): {
    isCompliant: boolean;
    result: GovernanceEnforcementOutput | null;
    loading: boolean;
    check: () => Promise<void>;
};
/**
 * Hook to get overall compliance status.
 */
declare function useComplianceStatus(): {
    score: number;
    status: string;
    mode: GovernanceMode;
    totalPolicies: number;
    enabledPolicies: number;
};

export { GovernanceContext, type GovernanceContextValue, type GovernanceMode, GovernanceProvider, type GovernanceProviderConfig, useAccessibilityGovernance, useColorGovernance, useComplianceStatus, useGovernance };
