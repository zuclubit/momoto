/**
 * @fileoverview Vue TextField Types
 *
 * FASE 15: Component Expansion
 *
 * Vue-specific types for TextField component.
 * These extend the core TextFieldTokens with Vue-specific props.
 *
 * @module momoto-ui/adapters/vue/textfield/types
 * @version 1.0.0
 */

import type {
  TextFieldSize,
  TextFieldStyles,
} from '../../core/textfield/textFieldCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// TEXTFIELD PROPS
// ============================================================================

/**
 * TextFieldProps - Props for Vue TextField component.
 *
 * This matches the React TextFieldProps but uses Vue-specific types
 * and patterns (e.g., v-model via update:value emit).
 */
export interface TextFieldProps {
  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Current value of the text field.
   */
  value: string;

  /**
   * Placeholder text when input is empty.
   */
  placeholder?: string;

  /**
   * Label text displayed above the input.
   */
  label?: string;

  /**
   * Helper text displayed below the input.
   */
  helperText?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - BASE
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Background color token (required).
   */
  backgroundColor: EnrichedToken;

  /**
   * Text color token (required).
   */
  textColor: EnrichedToken;

  /**
   * Border color token (optional).
   */
  borderColor?: EnrichedToken | null;

  /**
   * Placeholder color token (optional).
   */
  placeholderColor?: EnrichedToken | null;

  /**
   * Label color token (optional).
   */
  labelColor?: EnrichedToken | null;

  /**
   * Helper text color token (optional).
   */
  helperTextColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - HOVER STATE
  // ──────────────────────────────────────────────────────────────────────────

  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FOCUS STATE
  // ──────────────────────────────────────────────────────────────────────────

  focusBackgroundColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - ERROR STATE
  // ──────────────────────────────────────────────────────────────────────────

  errorBackgroundColor?: EnrichedToken;
  errorTextColor?: EnrichedToken;
  errorBorderColor?: EnrichedToken | null;
  errorLabelColor?: EnrichedToken | null;
  errorHelperTextColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - SUCCESS STATE
  // ──────────────────────────────────────────────────────────────────────────

  successBackgroundColor?: EnrichedToken;
  successTextColor?: EnrichedToken;
  successBorderColor?: EnrichedToken | null;
  successLabelColor?: EnrichedToken | null;
  successHelperTextColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - DISABLED STATE
  // ──────────────────────────────────────────────────────────────────────────

  disabledBackgroundColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken | null;
  disabledLabelColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // BEHAVIOR
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Input type for single-line inputs.
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';

  /**
   * Disabled state (blocks interactions).
   * @default false
   */
  disabled?: boolean;

  /**
   * Error state (validation failed).
   * @default false
   */
  error?: boolean;

  /**
   * Success state (validation passed).
   * @default false
   */
  success?: boolean;

  /**
   * Required field indicator.
   * @default false
   */
  required?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Text field size (affects height, padding, fontSize).
   * @default 'md'
   */
  size?: TextFieldSize;

  /**
   * Full width input (width: 100%).
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Multiline input (uses textarea instead of input).
   * @default false
   */
  multiline?: boolean;

  /**
   * Number of rows for multiline input.
   * @default 3
   */
  rows?: number;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Custom CSS class name(s).
   */
  class?: string;

  /**
   * Custom inline styles (merged with computed styles).
   */
  style?: Partial<TextFieldStyles>;

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY (ARIA)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * ARIA label (overrides visible label for screen readers).
   */
  ariaLabel?: string;

  /**
   * ARIA describedby (references description element ID).
   */
  ariaDescribedby?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TESTING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Test ID for automated testing.
   */
  testId?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Show quality warnings in console (dev mode).
   * @default import.meta.env.DEV
   */
  showQualityWarnings?: boolean;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  TextFieldProps,
};
