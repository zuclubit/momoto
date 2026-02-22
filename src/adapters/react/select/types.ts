/**
 * @fileoverview React Select Types
 *
 * FASE 15.4: Component Expansion - Select
 *
 * React-specific types for Select component.
 *
 * @module momoto-ui/adapters/react/select/types
 * @version 1.0.0
 */

import type {
  SelectSize,
  SelectStyles,
  SelectOption,
} from '../../core/select/selectCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// SELECT PROPS
// ============================================================================

/**
 * SelectProps - Props for React Select component.
 */
export interface SelectProps<T = string> {
  // ──────────────────────────────────────────────────────────────────────────
  // OPTIONS & VALUE
  // ──────────────────────────────────────────────────────────────────────────

  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FIELD BASE
  // ──────────────────────────────────────────────────────────────────────────

  backgroundColor: EnrichedToken;
  borderColor: EnrichedToken;
  textColor: EnrichedToken;
  placeholderColor?: EnrichedToken;
  iconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FIELD HOVER
  // ──────────────────────────────────────────────────────────────────────────

  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;
  hoverTextColor?: EnrichedToken;
  hoverIconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FIELD FOCUS
  // ──────────────────────────────────────────────────────────────────────────

  focusBackgroundColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken;
  focusTextColor?: EnrichedToken;
  focusOutlineColor?: EnrichedToken;
  focusIconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FIELD OPEN
  // ──────────────────────────────────────────────────────────────────────────

  openBackgroundColor?: EnrichedToken;
  openBorderColor?: EnrichedToken;
  openTextColor?: EnrichedToken;
  openOutlineColor?: EnrichedToken;
  openIconColor?: EnrichedToken;

  openHoverBackgroundColor?: EnrichedToken;
  openHoverBorderColor?: EnrichedToken;

  openFocusBackgroundColor?: EnrichedToken;
  openFocusBorderColor?: EnrichedToken;
  openFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FIELD DISABLED
  // ──────────────────────────────────────────────────────────────────────────

  disabledBackgroundColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;
  disabledPlaceholderColor?: EnrichedToken;
  disabledLabelColor?: EnrichedToken;
  disabledIconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FIELD ERROR
  // ──────────────────────────────────────────────────────────────────────────

  errorBackgroundColor?: EnrichedToken;
  errorBorderColor?: EnrichedToken;
  errorTextColor?: EnrichedToken;
  errorMessageColor?: EnrichedToken;
  errorIconColor?: EnrichedToken;

  errorHoverBackgroundColor?: EnrichedToken;
  errorHoverBorderColor?: EnrichedToken;

  errorFocusBackgroundColor?: EnrichedToken;
  errorFocusBorderColor?: EnrichedToken;
  errorFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - LABEL & HELPER
  // ──────────────────────────────────────────────────────────────────────────

  labelColor?: EnrichedToken;
  helperTextColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - DROPDOWN
  // ──────────────────────────────────────────────────────────────────────────

  dropdownBackgroundColor: EnrichedToken;
  dropdownBorderColor?: EnrichedToken;
  dropdownShadowColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - OPTIONS
  // ──────────────────────────────────────────────────────────────────────────

  optionTextColor: EnrichedToken;
  optionHoverBackgroundColor?: EnrichedToken;
  optionHoverTextColor?: EnrichedToken;
  optionSelectedBackgroundColor?: EnrichedToken;
  optionSelectedTextColor?: EnrichedToken;
  optionDisabledTextColor?: EnrichedToken;
  optionDisabledBackgroundColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // BEHAVIOR
  // ──────────────────────────────────────────────────────────────────────────

  disabled?: boolean;
  required?: boolean;
  error?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  size?: SelectSize;

  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  label?: string;
  helperText?: string;
  errorMessage?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  className?: string;
  style?: Partial<SelectStyles>;

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY
  // ──────────────────────────────────────────────────────────────────────────

  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaLabelledby?: string;

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
// NOTE: Types are exported inline above (export interface)
// ============================================================================
