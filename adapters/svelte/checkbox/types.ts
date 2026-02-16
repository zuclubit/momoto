/**
 * @fileoverview Svelte Checkbox Types
 *
 * FASE 15: Component Expansion
 *
 * Svelte-specific types for Checkbox component.
 *
 * @module momoto-ui/adapters/svelte/checkbox/types
 * @version 1.0.0
 */

import type {
  CheckboxSize,
  CheckboxStyles,
} from '../../core/checkbox/checkboxCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// CHECKBOX PROPS
// ============================================================================

/**
 * CheckboxProps - Props for Svelte Checkbox component.
 */
export interface CheckboxProps {
  // ──────────────────────────────────────────────────────────────────────────
  // CHECK STATE
  // ──────────────────────────────────────────────────────────────────────────

  checked?: boolean;
  indeterminate?: boolean;
  label?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - BASE
  // ──────────────────────────────────────────────────────────────────────────

  backgroundColor: EnrichedToken;
  borderColor: EnrichedToken;
  checkColor: EnrichedToken;
  labelColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - HOVER
  // ──────────────────────────────────────────────────────────────────────────

  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FOCUS
  // ──────────────────────────────────────────────────────────────────────────

  focusBackgroundColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken;
  focusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - CHECKED
  // ──────────────────────────────────────────────────────────────────────────

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

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - INDETERMINATE
  // ──────────────────────────────────────────────────────────────────────────

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

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - DISABLED
  // ──────────────────────────────────────────────────────────────────────────

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

  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  size?: CheckboxSize;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  class?: string;
  style?: Partial<CheckboxStyles>;

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY
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

export type { CheckboxProps };
