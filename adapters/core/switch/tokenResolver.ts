/**
 * @fileoverview SwitchCore Token Resolver
 *
 * FASE 15.5: Component Expansion - Switch
 *
 * @module momoto-ui/adapters/core/switch/tokenResolver
 * @version 1.0.0
 */

import type { SwitchState, SwitchTokens, ResolvedSwitchTokens } from './switchCore.types';

export function determineState(params: {
  disabled: boolean;
  hasError: boolean;
  isChecked: boolean;
  isFocused: boolean;
  isHovered: boolean;
}): SwitchState {
  const { disabled, hasError, isChecked, isFocused, isHovered } = params;

  if (disabled) {
    return isChecked ? 'checkedDisabled' : 'disabled';
  }

  if (hasError) {
    if (isFocused) return 'errorFocus';
    if (isHovered) return 'errorHover';
    return 'error';
  }

  if (isChecked) {
    if (isFocused) return 'checkedFocus';
    if (isHovered) return 'checkedHover';
    return 'checked';
  }

  if (isFocused) return 'focus';
  if (isHovered) return 'hover';
  return 'base';
}

export function resolveTokens(tokens: SwitchTokens, state: SwitchState): ResolvedSwitchTokens {
  switch (state) {
    case 'base':
      return {
        trackBackgroundColor: tokens.trackBackgroundColor,
        trackBorderColor: tokens.trackBorderColor,
        thumbColor: tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'hover':
      return {
        trackBackgroundColor: tokens.hoverTrackBackgroundColor ?? tokens.trackBackgroundColor,
        trackBorderColor: tokens.hoverTrackBorderColor ?? tokens.trackBorderColor,
        thumbColor: tokens.hoverThumbColor ?? tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'focus':
      return {
        trackBackgroundColor: tokens.focusTrackBackgroundColor ?? tokens.trackBackgroundColor,
        trackBorderColor: tokens.focusTrackBorderColor ?? tokens.trackBorderColor,
        thumbColor: tokens.focusThumbColor ?? tokens.thumbColor,
        outlineColor: tokens.focusOutlineColor ?? tokens.focusTrackBorderColor ?? tokens.trackBorderColor,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'checked':
      return {
        trackBackgroundColor: tokens.checkedTrackBackgroundColor,
        trackBorderColor: tokens.checkedTrackBorderColor ?? tokens.checkedTrackBackgroundColor,
        thumbColor: tokens.checkedThumbColor ?? tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'checkedHover':
      return {
        trackBackgroundColor:
          tokens.checkedHoverTrackBackgroundColor ?? tokens.checkedTrackBackgroundColor,
        trackBorderColor:
          tokens.checkedHoverTrackBorderColor ??
          tokens.checkedTrackBorderColor ??
          tokens.checkedTrackBackgroundColor,
        thumbColor: tokens.checkedHoverThumbColor ?? tokens.checkedThumbColor ?? tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'checkedFocus':
      return {
        trackBackgroundColor:
          tokens.checkedFocusTrackBackgroundColor ?? tokens.checkedTrackBackgroundColor,
        trackBorderColor:
          tokens.checkedFocusTrackBorderColor ??
          tokens.checkedTrackBorderColor ??
          tokens.checkedTrackBackgroundColor,
        thumbColor: tokens.checkedFocusThumbColor ?? tokens.checkedThumbColor ?? tokens.thumbColor,
        outlineColor:
          tokens.checkedFocusOutlineColor ??
          tokens.focusOutlineColor ??
          tokens.checkedTrackBackgroundColor,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'disabled':
      return {
        trackBackgroundColor:
          tokens.disabledTrackBackgroundColor ?? tokens.trackBackgroundColor,
        trackBorderColor: tokens.disabledTrackBorderColor ?? tokens.trackBorderColor,
        thumbColor: tokens.disabledThumbColor ?? tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.disabledLabelColor ?? tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'checkedDisabled':
      return {
        trackBackgroundColor:
          tokens.checkedDisabledTrackBackgroundColor ?? tokens.checkedTrackBackgroundColor,
        trackBorderColor:
          tokens.checkedDisabledTrackBorderColor ??
          tokens.checkedTrackBorderColor ??
          tokens.checkedTrackBackgroundColor,
        thumbColor:
          tokens.checkedDisabledThumbColor ?? tokens.disabledThumbColor ?? tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.disabledLabelColor ?? tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'error':
      return {
        trackBackgroundColor: tokens.errorTrackBackgroundColor ?? tokens.trackBackgroundColor,
        trackBorderColor: tokens.errorTrackBorderColor ?? tokens.trackBorderColor,
        thumbColor: tokens.errorThumbColor ?? tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.errorMessageColor ?? tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'errorHover':
      return {
        trackBackgroundColor:
          tokens.errorHoverTrackBackgroundColor ??
          tokens.errorTrackBackgroundColor ??
          tokens.trackBackgroundColor,
        trackBorderColor:
          tokens.errorHoverTrackBorderColor ?? tokens.errorTrackBorderColor ?? tokens.trackBorderColor,
        thumbColor: tokens.errorHoverThumbColor ?? tokens.errorThumbColor ?? tokens.thumbColor,
        outlineColor: null,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.errorMessageColor ?? tokens.helperTextColor ?? tokens.thumbColor,
      };

    case 'errorFocus':
      return {
        trackBackgroundColor:
          tokens.errorFocusTrackBackgroundColor ??
          tokens.errorTrackBackgroundColor ??
          tokens.trackBackgroundColor,
        trackBorderColor:
          tokens.errorFocusTrackBorderColor ?? tokens.errorTrackBorderColor ?? tokens.trackBorderColor,
        thumbColor: tokens.errorFocusThumbColor ?? tokens.errorThumbColor ?? tokens.thumbColor,
        outlineColor:
          tokens.errorFocusOutlineColor ?? tokens.errorTrackBorderColor ?? tokens.trackBorderColor,
        labelColor: tokens.labelColor ?? tokens.thumbColor,
        helperTextColor: tokens.errorMessageColor ?? tokens.helperTextColor ?? tokens.thumbColor,
      };

    default: {
      const _exhaustive: never = state;
      throw new Error(`Unknown state: ${_exhaustive}`);
    }
  }
}
