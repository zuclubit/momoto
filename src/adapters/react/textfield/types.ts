/**
 * @fileoverview React TextField Types
 *
 * FASE 15: Component Expansion
 *
 * React-specific types for TextField component.
 *
 * @module momoto-ui/adapters/react/textfield/types
 * @version 1.0.0
 */

import type React from 'react';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';
import type { TextFieldSize } from '../../core/textfield';

// ============================================================================
// TEXTFIELD PROPS
// ============================================================================

/**
 * TextFieldProps - React-specific TextField component props.
 *
 * Extends TextFieldCore contract with React-specific props:
 * - Event handlers (onChange, onFocus, onBlur)
 * - React styling (className, style)
 * - ARIA attributes
 * - Data attributes for testing
 *
 * CONTRACT: All colors must be EnrichedToken (NO hex strings).
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
  // TOKENS (ALL MUST BE EnrichedToken)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Background color token (REQUIRED).
   */
  backgroundColor: EnrichedToken;

  /**
   * Text color token (REQUIRED).
   */
  textColor: EnrichedToken;

  /**
   * Border color token (optional).
   */
  borderColor?: EnrichedToken;

  /**
   * Placeholder color token (optional).
   */
  placeholderColor?: EnrichedToken;

  /**
   * Label color token (optional).
   */
  labelColor?: EnrichedToken;

  /**
   * Helper text color token (optional).
   */
  helperTextColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (HOVER)
  // ───────────────────────────────────────────────────────────────────────────

  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (FOCUS)
  // ───────────────────────────────────────────────────────────────────────────

  focusBackgroundColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (ERROR)
  // ───────────────────────────────────────────────────────────────────────────

  errorBackgroundColor?: EnrichedToken;
  errorTextColor?: EnrichedToken;
  errorBorderColor?: EnrichedToken;
  errorLabelColor?: EnrichedToken;
  errorHelperTextColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (SUCCESS)
  // ───────────────────────────────────────────────────────────────────────────

  successBackgroundColor?: EnrichedToken;
  successTextColor?: EnrichedToken;
  successBorderColor?: EnrichedToken;
  successLabelColor?: EnrichedToken;
  successHelperTextColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (DISABLED)
  // ───────────────────────────────────────────────────────────────────────────

  disabledBackgroundColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken;
  disabledLabelColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // BEHAVIOR
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Change handler for input value.
   */
  onChange?: (value: string) => void;

  /**
   * Focus handler.
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  /**
   * Blur handler.
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  /**
   * Disabled state.
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

  /**
   * Input type for single-line inputs.
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Text field size.
   * @default 'md'
   */
  size?: TextFieldSize;

  /**
   * Full width (100% of container).
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
  // STYLING (React-specific)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * Inline styles (merged with computed styles).
   */
  style?: React.CSSProperties;

  // ──────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Show quality warnings in dev mode.
   * @default process.env.NODE_ENV === 'development'
   */
  showQualityWarnings?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA & ACCESSIBILITY
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * ARIA label (overrides visible label for screen readers).
   */
  'aria-label'?: string;

  /**
   * ID of element that describes the input.
   */
  'aria-describedby'?: string;

  /**
   * Test ID for testing frameworks.
   */
  'data-testid'?: string;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default TextFieldProps;
