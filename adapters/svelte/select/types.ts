/**
 * @fileoverview Svelte Select Types
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Svelte-specific types for Select component.
 *
 * @module momoto-ui/adapters/svelte/select/types
 * @version 1.0.0
 */

import type {
  SelectSize,
  SelectStyles,
  SelectOption,
} from '../../core/select/selectCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

export interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value: T | null;
  placeholder?: string;

  backgroundColor: EnrichedToken;
  borderColor: EnrichedToken;
  textColor: EnrichedToken;
  placeholderColor?: EnrichedToken;
  iconColor?: EnrichedToken;

  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;
  hoverTextColor?: EnrichedToken;
  hoverIconColor?: EnrichedToken;

  focusBackgroundColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken;
  focusTextColor?: EnrichedToken;
  focusOutlineColor?: EnrichedToken;
  focusIconColor?: EnrichedToken;

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

  disabledBackgroundColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;
  disabledPlaceholderColor?: EnrichedToken;
  disabledLabelColor?: EnrichedToken;
  disabledIconColor?: EnrichedToken;

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

  labelColor?: EnrichedToken;
  helperTextColor?: EnrichedToken;

  dropdownBackgroundColor: EnrichedToken;
  dropdownBorderColor?: EnrichedToken;
  dropdownShadowColor?: EnrichedToken;

  optionTextColor: EnrichedToken;
  optionHoverBackgroundColor?: EnrichedToken;
  optionHoverTextColor?: EnrichedToken;
  optionSelectedBackgroundColor?: EnrichedToken;
  optionSelectedTextColor?: EnrichedToken;
  optionDisabledTextColor?: EnrichedToken;
  optionDisabledBackgroundColor?: EnrichedToken;

  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  size?: SelectSize;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  class?: string;
  style?: Partial<SelectStyles>;
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaLabelledby?: string;
  testId?: string;
  showQualityWarnings?: boolean;
}

export type { SelectProps };
