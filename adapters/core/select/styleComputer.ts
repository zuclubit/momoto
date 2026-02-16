/**
 * @fileoverview SelectCore Style Computer
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Converts resolved tokens into CSS properties.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Styles computed ONLY from tokens
 * - ✅ NO color calculations
 * - ✅ NO perceptual heuristics
 * - ✅ Dimensional values from constants
 *
 * @module momoto-ui/adapters/core/select/styleComputer
 * @version 1.0.0
 */

import type {
  SelectStyles,
  ResolvedSelectTokens,
  SizeConfig,
  SelectState,
} from './selectCore.types';
import {
  BORDER_WIDTH,
  BORDER_RADIUS,
  OUTLINE_WIDTH,
  OUTLINE_OFFSET,
  DROPDOWN_BORDER_WIDTH,
  DROPDOWN_BORDER_RADIUS,
  DROPDOWN_MAX_HEIGHT,
  DROPDOWN_Z_INDEX,
  DROPDOWN_OFFSET,
  DROPDOWN_SHADOW,
  OPTION_PADDING_X,
  OPTION_PADDING_Y,
  OPTION_DISABLED_OPACITY,
  TRANSITION,
  LABEL_FONT_WEIGHT,
  DISABLED_OPACITY,
  DISABLED_CURSOR,
  ICON_ROTATION_CLOSED,
  ICON_ROTATION_OPEN,
} from './constants';

// ============================================================================
// STYLE COMPUTATION
// ============================================================================

/**
 * computeStyles - Compute CSS properties from resolved tokens.
 *
 * CRITICAL: All colors come from tokens.
 * NO color calculations, NO magic numbers.
 *
 * @param resolvedTokens - Resolved tokens
 * @param sizeConfig - Size configuration
 * @param state - Current state
 * @param label - Whether label exists
 * @param helperText - Helper text content
 * @param errorMessage - Error message content
 * @param isOpen - Whether dropdown is open
 * @returns Computed styles
 */
export function computeStyles(
  resolvedTokens: ResolvedSelectTokens,
  sizeConfig: SizeConfig,
  state: SelectState,
  label: string | undefined,
  helperText: string | undefined,
  errorMessage: string | undefined,
  isOpen: boolean
): SelectStyles {
  const disabled = state === 'disabled';
  const hasError = state.startsWith('error');

  // Determine helper text to display (error takes priority)
  const displayHelperText = hasError && errorMessage ? errorMessage : helperText;

  return {
    // ────────────────────────────────────────────────────────────────────────
    // CONTAINER
    // ────────────────────────────────────────────────────────────────────────
    containerDisplay: 'flex',
    containerFlexDirection: 'column',
    containerGap: label ? sizeConfig.labelGap : 0,

    // ────────────────────────────────────────────────────────────────────────
    // FIELD
    // ────────────────────────────────────────────────────────────────────────
    fieldPosition: 'relative',
    fieldDisplay: 'flex',
    fieldAlignItems: 'center',
    fieldJustifyContent: 'space-between',
    fieldHeight: sizeConfig.height,
    fieldPaddingX: sizeConfig.paddingX,
    fieldBackgroundColor: resolvedTokens.backgroundColor.toCssValue(),
    fieldBorderWidth: BORDER_WIDTH,
    fieldBorderStyle: 'solid',
    fieldBorderColor: resolvedTokens.borderColor.toCssValue(),
    fieldBorderRadius: BORDER_RADIUS,
    fieldTextColor: resolvedTokens.textColor.toCssValue(),
    fieldFontSize: sizeConfig.fontSize,
    fieldCursor: disabled ? DISABLED_CURSOR : 'pointer',
    fieldTransition: TRANSITION,
    fieldOpacity: disabled ? DISABLED_OPACITY : 1,

    // ────────────────────────────────────────────────────────────────────────
    // OUTLINE (focus/open)
    // ────────────────────────────────────────────────────────────────────────
    outlineWidth: OUTLINE_WIDTH,
    outlineOffset: OUTLINE_OFFSET,
    outlineColor: resolvedTokens.outlineColor
      ? resolvedTokens.outlineColor.toCssValue()
      : null,

    // ────────────────────────────────────────────────────────────────────────
    // PLACEHOLDER
    // ────────────────────────────────────────────────────────────────────────
    placeholderColor: resolvedTokens.placeholderColor.toCssValue(),

    // ────────────────────────────────────────────────────────────────────────
    // ICON (chevron)
    // ────────────────────────────────────────────────────────────────────────
    iconSize: sizeConfig.iconSize,
    iconColor: resolvedTokens.iconColor.toCssValue(),
    iconTransform: `rotate(${isOpen ? ICON_ROTATION_OPEN : ICON_ROTATION_CLOSED}deg)`,

    // ────────────────────────────────────────────────────────────────────────
    // LABEL
    // ────────────────────────────────────────────────────────────────────────
    labelDisplay: label ? 'block' : 'none',
    labelFontSize: sizeConfig.labelFontSize,
    labelColor: resolvedTokens.labelColor.toCssValue(),
    labelFontWeight: LABEL_FONT_WEIGHT,

    // ────────────────────────────────────────────────────────────────────────
    // HELPER TEXT
    // ────────────────────────────────────────────────────────────────────────
    helperDisplay: displayHelperText ? 'block' : 'none',
    helperFontSize: sizeConfig.helperFontSize,
    helperColor: resolvedTokens.helperTextColor.toCssValue(),

    // ────────────────────────────────────────────────────────────────────────
    // DROPDOWN MENU
    // ────────────────────────────────────────────────────────────────────────
    dropdownPosition: 'absolute',
    dropdownTop: `calc(100% + ${DROPDOWN_OFFSET}px)`,
    dropdownLeft: '0',
    dropdownRight: '0',
    dropdownZIndex: DROPDOWN_Z_INDEX,
    dropdownBackgroundColor: resolvedTokens.dropdownBackgroundColor.toCssValue(),
    dropdownBorderWidth: DROPDOWN_BORDER_WIDTH,
    dropdownBorderStyle: 'solid',
    dropdownBorderColor: resolvedTokens.dropdownBorderColor.toCssValue(),
    dropdownBorderRadius: DROPDOWN_BORDER_RADIUS,
    dropdownBoxShadow: `${DROPDOWN_SHADOW} ${resolvedTokens.dropdownShadowColor.toCssValue()}`,
    dropdownMaxHeight: DROPDOWN_MAX_HEIGHT,
    dropdownOverflowY: 'auto',

    // ────────────────────────────────────────────────────────────────────────
    // OPTION
    // ────────────────────────────────────────────────────────────────────────
    optionPaddingX: OPTION_PADDING_X,
    optionPaddingY: OPTION_PADDING_Y,
    optionFontSize: sizeConfig.fontSize,
    optionTextColor: resolvedTokens.optionTextColor.toCssValue(),
    optionCursor: 'pointer',
    optionTransition: TRANSITION,

    // ────────────────────────────────────────────────────────────────────────
    // OPTION - HOVER
    // ────────────────────────────────────────────────────────────────────────
    optionHoverBackgroundColor: resolvedTokens.optionHoverBackgroundColor.toCssValue(),
    optionHoverTextColor: resolvedTokens.optionHoverTextColor.toCssValue(),

    // ────────────────────────────────────────────────────────────────────────
    // OPTION - SELECTED
    // ────────────────────────────────────────────────────────────────────────
    optionSelectedBackgroundColor: resolvedTokens.optionSelectedBackgroundColor.toCssValue(),
    optionSelectedTextColor: resolvedTokens.optionSelectedTextColor.toCssValue(),

    // ────────────────────────────────────────────────────────────────────────
    // OPTION - DISABLED
    // ────────────────────────────────────────────────────────────────────────
    optionDisabledTextColor: resolvedTokens.optionDisabledTextColor.toCssValue(),
    optionDisabledBackgroundColor: resolvedTokens.optionDisabledBackgroundColor.toCssValue(),
    optionDisabledCursor: DISABLED_CURSOR,
    optionDisabledOpacity: OPTION_DISABLED_OPACITY,
  };
}

// ============================================================================
// STYLE MERGING
// ============================================================================

/**
 * mergeStyles - Merge user styles with computed styles.
 *
 * User styles take priority over computed styles.
 *
 * @param computedStyles - Styles computed from tokens
 * @param userStyles - User-provided style overrides
 * @returns Merged styles
 */
export function mergeStyles(
  computedStyles: SelectStyles,
  userStyles?: Partial<SelectStyles>
): SelectStyles {
  if (!userStyles) {
    return computedStyles;
  }

  // Filter out undefined values from userStyles
  const filteredUserStyles = Object.fromEntries(
    Object.entries(userStyles).filter(([, value]) => value !== undefined)
  );

  return {
    ...computedStyles,
    ...filteredUserStyles,
  } as SelectStyles;
}
