/**
 * @fileoverview SwitchCore Types
 *
 * FASE 15.5: Component Expansion - Switch (Final Base Component)
 *
 * Type definitions for framework-agnostic Switch component.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven (no color calculations)
 * - ✅ State-based token selection (no heuristics)
 * - ✅ Framework-agnostic (pure TypeScript)
 * - ✅ WCAG 2.2 AA compliant
 *
 * @module momoto-ui/adapters/core/switch/types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// SWITCH STATE
// ============================================================================

/**
 * SwitchState - All possible switch states.
 *
 * State priority (highest to lowest):
 * 1. disabled
 * 2. error
 * 3. checked (on state)
 * 4. focus
 * 5. hover
 * 6. base
 */
export type SwitchState =
  | 'base'
  | 'hover'
  | 'focus'
  | 'checked'
  | 'checkedHover'
  | 'checkedFocus'
  | 'disabled'
  | 'checkedDisabled'
  | 'error'
  | 'errorHover'
  | 'errorFocus';

// ============================================================================
// SWITCH SIZE
// ============================================================================

/**
 * SwitchSize - Predefined size variants.
 */
export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * SizeConfig - Size-specific dimensions.
 */
export interface SizeConfig {
  /** Track width in pixels */
  trackWidth: number;

  /** Track height in pixels */
  trackHeight: number;

  /** Thumb size in pixels */
  thumbSize: number;

  /** Label font size in pixels */
  labelFontSize: number;

  /** Helper text font size in pixels */
  helperFontSize: number;

  /** Gap between switch and label in pixels */
  labelGap: number;

  /** Gap between switch and helper text in pixels */
  helperGap: number;
}

// ============================================================================
// SWITCH TOKENS (INPUT)
// ============================================================================

/**
 * SwitchTokens - All token inputs for Switch.
 *
 * CRITICAL: All colors MUST come from EnrichedToken.
 * NO color calculations, NO hardcoded values.
 */
export interface SwitchTokens {
  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - BASE STATE (OFF)
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (base state, off) */
  trackBackgroundColor: EnrichedToken;

  /** Track border color (base state, off) */
  trackBorderColor: EnrichedToken;

  /** Thumb color (base state, off) */
  thumbColor: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - HOVER STATE (OFF)
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (hover, off) */
  hoverTrackBackgroundColor?: EnrichedToken;

  /** Track border color (hover, off) */
  hoverTrackBorderColor?: EnrichedToken;

  /** Thumb color (hover, off) */
  hoverThumbColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - FOCUS STATE (OFF)
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (focus, off) */
  focusTrackBackgroundColor?: EnrichedToken;

  /** Track border color (focus, off) */
  focusTrackBorderColor?: EnrichedToken;

  /** Thumb color (focus, off) */
  focusThumbColor?: EnrichedToken;

  /** Focus outline color */
  focusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - CHECKED STATE (ON)
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (checked, on) */
  checkedTrackBackgroundColor: EnrichedToken;

  /** Track border color (checked, on) */
  checkedTrackBorderColor?: EnrichedToken;

  /** Thumb color (checked, on) */
  checkedThumbColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - CHECKED + HOVER STATE (ON)
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (checked + hover, on) */
  checkedHoverTrackBackgroundColor?: EnrichedToken;

  /** Track border color (checked + hover, on) */
  checkedHoverTrackBorderColor?: EnrichedToken;

  /** Thumb color (checked + hover, on) */
  checkedHoverThumbColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - CHECKED + FOCUS STATE (ON)
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (checked + focus, on) */
  checkedFocusTrackBackgroundColor?: EnrichedToken;

  /** Track border color (checked + focus, on) */
  checkedFocusTrackBorderColor?: EnrichedToken;

  /** Thumb color (checked + focus, on) */
  checkedFocusThumbColor?: EnrichedToken;

  /** Focus outline color (checked) */
  checkedFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - DISABLED STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (disabled, off) */
  disabledTrackBackgroundColor?: EnrichedToken;

  /** Track border color (disabled, off) */
  disabledTrackBorderColor?: EnrichedToken;

  /** Thumb color (disabled, off) */
  disabledThumbColor?: EnrichedToken;

  /** Label color (disabled) */
  disabledLabelColor?: EnrichedToken;

  /** Track background color (checked + disabled, on) */
  checkedDisabledTrackBackgroundColor?: EnrichedToken;

  /** Track border color (checked + disabled, on) */
  checkedDisabledTrackBorderColor?: EnrichedToken;

  /** Thumb color (checked + disabled, on) */
  checkedDisabledThumbColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK - ERROR STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Track background color (error) */
  errorTrackBackgroundColor?: EnrichedToken;

  /** Track border color (error) */
  errorTrackBorderColor?: EnrichedToken;

  /** Thumb color (error) */
  errorThumbColor?: EnrichedToken;

  /** Error message text color */
  errorMessageColor?: EnrichedToken;

  /** Track background color (error + hover) */
  errorHoverTrackBackgroundColor?: EnrichedToken;

  /** Track border color (error + hover) */
  errorHoverTrackBorderColor?: EnrichedToken;

  /** Thumb color (error + hover) */
  errorHoverThumbColor?: EnrichedToken;

  /** Track background color (error + focus) */
  errorFocusTrackBackgroundColor?: EnrichedToken;

  /** Track border color (error + focus) */
  errorFocusTrackBorderColor?: EnrichedToken;

  /** Thumb color (error + focus) */
  errorFocusThumbColor?: EnrichedToken;

  /** Error focus outline color */
  errorFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // LABEL & HELPER TEXT
  // ──────────────────────────────────────────────────────────────────────────

  /** Label text color */
  labelColor?: EnrichedToken;

  /** Helper text color */
  helperTextColor?: EnrichedToken;
}

// ============================================================================
// RESOLVED TOKENS (OUTPUT)
// ============================================================================

/**
 * ResolvedSwitchTokens - Tokens after state-based selection.
 *
 * These are the FINAL tokens to use for styling.
 */
export interface ResolvedSwitchTokens {
  // Track
  trackBackgroundColor: EnrichedToken;
  trackBorderColor: EnrichedToken;

  // Thumb
  thumbColor: EnrichedToken;

  // Outline
  outlineColor: EnrichedToken | null;

  // Label & helper
  labelColor: EnrichedToken;
  helperTextColor: EnrichedToken;
}

// ============================================================================
// SWITCH STYLES (OUTPUT)
// ============================================================================

/**
 * SwitchStyles - Computed CSS properties for Switch.
 */
export interface SwitchStyles {
  // Container
  containerDisplay: string;
  containerAlignItems: string;
  containerGap: number;

  // Track
  trackPosition: string;
  trackDisplay: string;
  trackWidth: number;
  trackHeight: number;
  trackBackgroundColor: string;
  trackBorderWidth: number;
  trackBorderStyle: string;
  trackBorderColor: string;
  trackBorderRadius: number;
  trackCursor: string;
  trackTransition: string;
  trackOpacity: number;

  // Outline (focus)
  outlineWidth: number;
  outlineOffset: number;
  outlineColor: string | null;

  // Thumb
  thumbPosition: string;
  thumbDisplay: string;
  thumbWidth: number;
  thumbHeight: number;
  thumbBackgroundColor: string;
  thumbBorderRadius: number;
  thumbTransition: string;
  thumbTransform: string; // translateX for checked state

  // Label
  labelDisplay: string;
  labelFontSize: number;
  labelColor: string;
  labelFontWeight: number;

  // Helper text
  helperDisplay: string;
  helperFontSize: number;
  helperColor: string;

  // User overrides
  [key: string]: string | number | null;
}

// ============================================================================
// ARIA ATTRIBUTES
// ============================================================================

/**
 * ARIAAttributes - WCAG 2.2 AA compliant ARIA attributes for Switch.
 */
export interface ARIAAttributes {
  /** Switch role */
  'role': 'switch';

  /** Whether switch is checked (on) */
  'aria-checked': boolean;

  /** Whether switch is disabled */
  'aria-disabled'?: boolean;

  /** Whether switch is required */
  'aria-required'?: boolean;

  /** Whether switch has error */
  'aria-invalid'?: boolean;

  /** Accessible label */
  'aria-label'?: string;

  /** ID of element describing the switch */
  'aria-describedby'?: string;

  /** ID of label element */
  'aria-labelledby'?: string;
}

// ============================================================================
// QUALITY WARNING
// ============================================================================

/**
 * QualityWarning - Dev mode quality warning.
 */
export interface QualityWarning {
  /** Warning severity */
  severity: 'error' | 'warning' | 'info';

  /** Human-readable message */
  message: string;

  /** Technical details */
  details: Record<string, unknown>;
}

// ============================================================================
// SWITCH CORE INPUT
// ============================================================================

/**
 * SwitchCoreInput - Input parameters for SwitchCore.processSwitch().
 */
export interface SwitchCoreInput {
  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  /** All token inputs */
  tokens: SwitchTokens;

  // ──────────────────────────────────────────────────────────────────────────
  // SWITCH STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Whether switch is checked (on) */
  isChecked: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // INTERACTION STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Whether switch is disabled */
  disabled: boolean;

  /** Whether switch is hovered */
  isHovered: boolean;

  /** Whether switch is focused */
  isFocused: boolean;

  /** Whether switch has error */
  hasError: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  /** Size variant */
  size?: SwitchSize;

  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  /** Switch label */
  label?: string;

  /** Helper text */
  helperText?: string;

  /** Error message */
  errorMessage?: string;

  /** Whether switch is required */
  required?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────────────────────────────────────

  /** Custom aria-label */
  ariaLabel?: string;

  /** ID of element describing the switch */
  ariaDescribedby?: string;

  /** ID of label element */
  ariaLabelledby?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  /** User-provided style overrides */
  userStyles?: Partial<SwitchStyles>;

  /** Custom CSS class */
  customClass?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  /** Enable quality warnings in dev mode */
  showQualityWarnings?: boolean;
}

// ============================================================================
// SWITCH CORE OUTPUT
// ============================================================================

/**
 * SwitchCoreOutput - Output from SwitchCore.processSwitch().
 */
export interface SwitchCoreOutput {
  // ──────────────────────────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Determined state */
  state: SwitchState;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  /** Resolved tokens (after state selection) */
  resolvedTokens: ResolvedSwitchTokens;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLES
  // ──────────────────────────────────────────────────────────────────────────

  /** Computed styles */
  styles: SwitchStyles;

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────────────────────────────────────

  /** ARIA attributes */
  ariaAttrs: ARIAAttributes;

  // ──────────────────────────────────────────────────────────────────────────
  // CSS CLASSES
  // ──────────────────────────────────────────────────────────────────────────

  /** Generated CSS class names */
  classNames: string;

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY
  // ──────────────────────────────────────────────────────────────────────────

  /** Quality warnings (dev mode) */
  qualityWarnings: QualityWarning[];
}
