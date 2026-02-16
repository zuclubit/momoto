/**
 * @fileoverview React Adapters Index
 *
 * Exporta todos los adaptadores React del sistema de diseño.
 *
 * @module momoto-ui/adapters/react
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import {
 *   ThemeProvider,
 *   useTheme,
 *   useDarkMode,
 *   useThemeSwitcher,
 *   useThemeVariable,
 *   useSystemPreferences,
 * } from '@zuclubit/momoto-ui/adapters/react';
 *
 * function App() {
 *   return (
 *     <ThemeProvider initialTheme={brandTheme}>
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 *
 * function ThemeToggle() {
 *   const { isDark, toggle } = useDarkMode();
 *   return <button onClick={toggle}>{isDark ? '🌙' : '☀️'}</button>;
 * }
 * ```
 */

// Provider
export {
  ThemeProvider,
  useThemeContext,
  ThemeContext,
  type ThemeProviderProps,
  type ThemeContextState,
  type ThemeContextActions,
  type ThemeContextValue,
} from './ReactThemeProvider';

// Hooks
export {
  useTheme,
  useDarkMode,
  useThemeSwitcher,
  useThemeVariable,
  useSystemPreferences,
  useAppliedTokens,
  useThemePreferences,
} from './useTheme';

// ============================================================================
// COMPONENTS (FASE 14)
// ============================================================================

// Button
export { Button, ButtonWithVariant } from './button';
export type { ButtonProps, ButtonVariantProps } from './button';

// TextField (FASE 15)
export { TextField } from './textfield';
export type { TextFieldProps } from './textfield';

// Checkbox (FASE 15)
export { Checkbox } from './checkbox';
export type { CheckboxProps } from './checkbox';

// Select (FASE 15)
export { Select } from './select';
export type { SelectProps } from './select';

// Switch (FASE 15)
export { Switch } from './switch';
export type { SwitchProps } from './switch';

// Card (FASE 16.3 - Layout Primitives)
export { Card } from './card';
export type { CardProps } from './card';
export { CardVariant, CardPadding, CardRadius } from './card';

// Stat (FASE 16.3 - KPI Components)
export { Stat } from './stat';
export type { StatProps, StatTrend } from './stat';
export { StatSize, TrendDirection } from './stat';

// Badge (FASE 16.3 - Status Components)
export { Badge } from './badge';
export type { BadgeProps } from './badge';
export { BadgeVariant, BadgeSize } from './badge';
