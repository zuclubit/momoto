/**
 * @fileoverview Svelte TextField Types
 *
 * FASE 15: Component Expansion
 *
 * Svelte-specific types for TextField component.
 *
 * @module momoto-ui/adapters/svelte/textfield/types
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
 * TextFieldProps - Props for Svelte TextField component.
 */
export interface TextFieldProps {
  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  value: string;
  placeholder?: string;
  label?: string;
  helperText?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - BASE
  // ──────────────────────────────────────────────────────────────────────────

  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor?: EnrichedToken | null;
  placeholderColor?: EnrichedToken | null;
  labelColor?: EnrichedToken | null;
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

  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  required?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  size?: TextFieldSize;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  class?: string;
  style?: Partial<TextFieldStyles>;

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY (ARIA)
  // ──────────────────────────────────────────────────────────────────────────

  ariaLabel?: string;
  ariaDescribedby?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TESTING
  // ──────────────────────────────────────────────────────────────────────────

  testId?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  showQualityWarnings?: boolean;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { TextFieldProps };
