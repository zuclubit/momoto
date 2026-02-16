/**
 * @fileoverview React Checkbox Types
 *
 * FASE 15: Component Expansion
 *
 * React-specific types for Checkbox component.
 *
 * @module momoto-ui/adapters/react/checkbox/types
 * @version 1.0.0
 */

import type React from 'react';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';
import type { CheckboxSize } from '../../core/checkbox';

// ============================================================================
// CHECKBOX PROPS
// ============================================================================

/**
 * CheckboxProps - React-specific Checkbox component props.
 *
 * Extends CheckboxCore contract with React-specific props:
 * - Event handlers (onChange, onFocus, onBlur)
 * - React styling (className, style)
 * - ARIA attributes
 * - Data attributes for testing
 *
 * CONTRACT: All colors must be EnrichedToken (NO hex strings).
 */
export interface CheckboxProps {
  // ──────────────────────────────────────────────────────────────────────────
  // CHECK STATE
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Checked state of the checkbox.
   * @default false
   */
  checked?: boolean;

  /**
   * Indeterminate state (tri-state checkbox).
   * Takes precedence over checked state for display.
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Label text displayed next to checkbox.
   */
  label?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS (ALL MUST BE EnrichedToken)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Background color token (REQUIRED).
   */
  backgroundColor: EnrichedToken;

  /**
   * Border color token (REQUIRED).
   */
  borderColor: EnrichedToken;

  /**
   * Checkmark/dash color token (REQUIRED).
   */
  checkColor: EnrichedToken;

  /**
   * Label color token (optional).
   */
  labelColor?: EnrichedToken;

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
  focusOutlineColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (CHECKED)
  // ───────────────────────────────────────────────────────────────────────────

  checkedBackgroundColor?: EnrichedToken;
  checkedBorderColor?: EnrichedToken;
  checkedCheckColor?: EnrichedToken;

  checkedHoverBackgroundColor?: EnrichedToken;
  checkedHoverBorderColor?: EnrichedToken;
  checkedHoverCheckColor?: EnrichedToken;

  checkedFocusBackgroundColor?: EnrichedToken;
  checkedFocusBorderColor?: EnrichedToken;
  checkedFocusCheckColor?: EnrichedToken;
  checkedFocusOutlineColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (INDETERMINATE)
  // ───────────────────────────────────────────────────────────────────────────

  indeterminateBackgroundColor?: EnrichedToken;
  indeterminateBorderColor?: EnrichedToken;
  indeterminateCheckColor?: EnrichedToken;

  indeterminateHoverBackgroundColor?: EnrichedToken;
  indeterminateHoverBorderColor?: EnrichedToken;
  indeterminateHoverCheckColor?: EnrichedToken;

  indeterminateFocusBackgroundColor?: EnrichedToken;
  indeterminateFocusBorderColor?: EnrichedToken;
  indeterminateFocusCheckColor?: EnrichedToken;
  indeterminateFocusOutlineColor?: EnrichedToken;

  // ───────────────────────────────────────────────────────────────────────────
  // STATE-SPECIFIC TOKENS (DISABLED)
  // ───────────────────────────────────────────────────────────────────────────

  disabledBackgroundColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken;
  disabledCheckColor?: EnrichedToken;
  disabledLabelColor?: EnrichedToken;

  checkedDisabledBackgroundColor?: EnrichedToken;
  checkedDisabledBorderColor?: EnrichedToken;
  checkedDisabledCheckColor?: EnrichedToken;

  indeterminateDisabledBackgroundColor?: EnrichedToken;
  indeterminateDisabledBorderColor?: EnrichedToken;
  indeterminateDisabledCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // BEHAVIOR
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Change handler for checkbox state.
   */
  onChange?: (checked: boolean) => void;

  /**
   * Focus handler.
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Blur handler.
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Disabled state.
   * @default false
   */
  disabled?: boolean;

  /**
   * Required field indicator.
   * @default false
   */
  required?: boolean;

  /**
   * Invalid state (validation failed).
   * @default false
   */
  invalid?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Checkbox size.
   * @default 'md'
   */
  size?: CheckboxSize;

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
   * ID of element that describes the checkbox.
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

export default CheckboxProps;
