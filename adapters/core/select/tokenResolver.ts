/**
 * @fileoverview SelectCore Token Resolver
 *
 * FASE 15.4: Component Expansion - Select
 *
 * State determination and token resolution for Select component.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ State SELECTION (not calculation)
 * - ✅ Token SELECTION (not modification)
 * - ✅ NO color calculations
 * - ✅ NO perceptual heuristics
 *
 * @module momoto-ui/adapters/core/select/tokenResolver
 * @version 1.0.0
 */

import type {
  SelectState,
  SelectTokens,
  ResolvedSelectTokens,
} from './selectCore.types';

// ============================================================================
// STATE DETERMINATION
// ============================================================================

/**
 * determineState - Determine current select state.
 *
 * State priority (highest to lowest):
 * 1. disabled
 * 2. error
 * 3. open (dropdown is open)
 * 4. focus
 * 5. hover
 * 6. base
 *
 * @param params - State parameters
 * @returns Current state
 */
export function determineState(params: {
  disabled: boolean;
  hasError: boolean;
  isOpen: boolean;
  isFocused: boolean;
  isHovered: boolean;
}): SelectState {
  const { disabled, hasError, isOpen, isFocused, isHovered } = params;

  // Priority 1: disabled
  if (disabled) {
    return 'disabled';
  }

  // Priority 2: error (with interaction variants)
  if (hasError) {
    if (isFocused) {
      return 'errorFocus';
    }
    if (isHovered) {
      return 'errorHover';
    }
    return 'error';
  }

  // Priority 3: open (with interaction variants)
  if (isOpen) {
    if (isFocused) {
      return 'openFocus';
    }
    if (isHovered) {
      return 'openHover';
    }
    return 'open';
  }

  // Priority 4: focus
  if (isFocused) {
    return 'focus';
  }

  // Priority 5: hover
  if (isHovered) {
    return 'hover';
  }

  // Priority 6: base
  return 'base';
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

/**
 * resolveTokens - Select tokens based on state.
 *
 * CRITICAL: This function SELECTS tokens, it does NOT calculate or modify colors.
 * All fallback logic is explicit token selection.
 *
 * @param tokens - All available tokens
 * @param state - Current state
 * @returns Resolved tokens
 */
export function resolveTokens(
  tokens: SelectTokens,
  state: SelectState
): ResolvedSelectTokens {
  // ──────────────────────────────────────────────────────────────────────────
  // STATE-BASED TOKEN SELECTION
  // ──────────────────────────────────────────────────────────────────────────

  switch (state) {
    // ────────────────────────────────────────────────────────────────────────
    // BASE STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'base':
      return {
        // Field
        backgroundColor: tokens.backgroundColor,
        borderColor: tokens.borderColor,
        textColor: tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor: tokens.iconColor ?? tokens.textColor,
        outlineColor: null,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor: tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // HOVER STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'hover':
      return {
        // Field
        backgroundColor:
          tokens.hoverBackgroundColor ?? tokens.backgroundColor,
        borderColor:
          tokens.hoverBorderColor ?? tokens.borderColor,
        textColor:
          tokens.hoverTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.hoverIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor: null,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor: tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // FOCUS STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'focus':
      return {
        // Field
        backgroundColor:
          tokens.focusBackgroundColor ?? tokens.backgroundColor,
        borderColor:
          tokens.focusBorderColor ?? tokens.borderColor,
        textColor:
          tokens.focusTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.focusIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor:
          tokens.focusOutlineColor ?? tokens.focusBorderColor ?? tokens.borderColor,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor: tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // OPEN STATE (dropdown visible)
    // ────────────────────────────────────────────────────────────────────────
    case 'open':
      return {
        // Field
        backgroundColor:
          tokens.openBackgroundColor ?? tokens.backgroundColor,
        borderColor:
          tokens.openBorderColor ?? tokens.borderColor,
        textColor:
          tokens.openTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.openIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor:
          tokens.openOutlineColor ?? tokens.focusOutlineColor ?? tokens.borderColor,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor: tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // OPEN + HOVER STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'openHover':
      return {
        // Field
        backgroundColor:
          tokens.openHoverBackgroundColor ??
          tokens.openBackgroundColor ??
          tokens.backgroundColor,
        borderColor:
          tokens.openHoverBorderColor ??
          tokens.openBorderColor ??
          tokens.borderColor,
        textColor:
          tokens.openTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.openIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor:
          tokens.openOutlineColor ?? tokens.focusOutlineColor ?? tokens.borderColor,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor: tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // OPEN + FOCUS STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'openFocus':
      return {
        // Field
        backgroundColor:
          tokens.openFocusBackgroundColor ??
          tokens.openBackgroundColor ??
          tokens.backgroundColor,
        borderColor:
          tokens.openFocusBorderColor ??
          tokens.openBorderColor ??
          tokens.borderColor,
        textColor:
          tokens.openTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.openIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor:
          tokens.openFocusOutlineColor ??
          tokens.openOutlineColor ??
          tokens.focusOutlineColor ??
          tokens.borderColor,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor: tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // DISABLED STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'disabled':
      return {
        // Field
        backgroundColor:
          tokens.disabledBackgroundColor ?? tokens.backgroundColor,
        borderColor:
          tokens.disabledBorderColor ?? tokens.borderColor,
        textColor:
          tokens.disabledTextColor ?? tokens.textColor,
        placeholderColor:
          tokens.disabledPlaceholderColor ??
          tokens.placeholderColor ??
          tokens.textColor,
        iconColor:
          tokens.disabledIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor: null,

        // Label & helper
        labelColor:
          tokens.disabledLabelColor ?? tokens.labelColor ?? tokens.textColor,
        helperTextColor: tokens.helperTextColor ?? tokens.textColor,

        // Dropdown (not shown when disabled, but provide fallbacks)
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // ERROR STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'error':
      return {
        // Field
        backgroundColor:
          tokens.errorBackgroundColor ?? tokens.backgroundColor,
        borderColor:
          tokens.errorBorderColor ?? tokens.borderColor,
        textColor:
          tokens.errorTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.errorIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor: null,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor:
          tokens.errorMessageColor ?? tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // ERROR + HOVER STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'errorHover':
      return {
        // Field
        backgroundColor:
          tokens.errorHoverBackgroundColor ??
          tokens.errorBackgroundColor ??
          tokens.backgroundColor,
        borderColor:
          tokens.errorHoverBorderColor ??
          tokens.errorBorderColor ??
          tokens.borderColor,
        textColor:
          tokens.errorTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.errorIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor: null,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor:
          tokens.errorMessageColor ?? tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    // ────────────────────────────────────────────────────────────────────────
    // ERROR + FOCUS STATE
    // ────────────────────────────────────────────────────────────────────────
    case 'errorFocus':
      return {
        // Field
        backgroundColor:
          tokens.errorFocusBackgroundColor ??
          tokens.errorBackgroundColor ??
          tokens.backgroundColor,
        borderColor:
          tokens.errorFocusBorderColor ??
          tokens.errorBorderColor ??
          tokens.borderColor,
        textColor:
          tokens.errorTextColor ?? tokens.textColor,
        placeholderColor: tokens.placeholderColor ?? tokens.textColor,
        iconColor:
          tokens.errorIconColor ?? tokens.iconColor ?? tokens.textColor,
        outlineColor:
          tokens.errorFocusOutlineColor ??
          tokens.errorBorderColor ??
          tokens.borderColor,

        // Label & helper
        labelColor: tokens.labelColor ?? tokens.textColor,
        helperTextColor:
          tokens.errorMessageColor ?? tokens.helperTextColor ?? tokens.textColor,

        // Dropdown
        dropdownBackgroundColor: tokens.dropdownBackgroundColor,
        dropdownBorderColor:
          tokens.dropdownBorderColor ?? tokens.borderColor,
        dropdownShadowColor:
          tokens.dropdownShadowColor ?? tokens.borderColor,

        // Options
        optionTextColor: tokens.optionTextColor,
        optionHoverBackgroundColor:
          tokens.optionHoverBackgroundColor ?? tokens.backgroundColor,
        optionHoverTextColor:
          tokens.optionHoverTextColor ?? tokens.optionTextColor,
        optionSelectedBackgroundColor:
          tokens.optionSelectedBackgroundColor ?? tokens.backgroundColor,
        optionSelectedTextColor:
          tokens.optionSelectedTextColor ?? tokens.optionTextColor,
        optionDisabledTextColor:
          tokens.optionDisabledTextColor ?? tokens.optionTextColor,
        optionDisabledBackgroundColor:
          tokens.optionDisabledBackgroundColor ?? tokens.dropdownBackgroundColor,
      };

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = state;
      throw new Error(`Unknown state: ${_exhaustive}`);
    }
  }
}
