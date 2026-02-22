/**
 * @fileoverview Style Computer - TextField Style Computation Logic
 *
 * FASE 15: Component Expansion
 *
 * Computes text field styles from resolved tokens and configuration.
 * Framework-agnostic style computation.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ ALL colors from EnrichedToken (NO calculations)
 * - ✅ Layout/sizing from configuration (ALLOWED)
 * - ✅ NO perceptual decisions
 *
 * @module momoto-ui/adapters/core/textfield/styleComputer
 * @version 1.0.0
 */

import type {
  TextFieldStyles,
  ComputeStylesInput,
} from './textFieldCore.types';
import {
  BORDER_RADIUS,
  TRANSITION_DURATION,
  LABEL_MARGIN_BOTTOM,
  HELPER_MARGIN_TOP,
} from './constants';

// ============================================================================
// STYLE COMPUTATION
// ============================================================================

/**
 * Compute text field styles from resolved tokens and configuration.
 *
 * CONTRACT: All colors come from EnrichedToken.toCssValue() (ALLOWED).
 * Layout/sizing values come from configuration (ALLOWED).
 * NO perceptual calculations.
 *
 * @param input - Style computation input
 * @returns Framework-agnostic text field styles
 */
export function computeStyles(input: ComputeStylesInput): TextFieldStyles {
  const {
    resolvedTokens,
    fullWidth,
    multiline,
    currentState,
    sizeConfig,
  } = input;

  const styles: TextFieldStyles = {
    // ─────────────────────────────────────────────────────────────────────────
    // CONTAINER (from configuration - ALLOWED)
    // ─────────────────────────────────────────────────────────────────────────
    containerWidth: fullWidth ? '100%' : 'auto',
    containerDisplay: 'flex',
    containerFlexDirection: 'column',
    containerGap: 4,

    // ─────────────────────────────────────────────────────────────────────────
    // INPUT (from configuration + tokens)
    // ─────────────────────────────────────────────────────────────────────────
    inputHeight: multiline ? 0 : sizeConfig.height, // 0 for textarea (auto-height)
    inputPaddingLeft: sizeConfig.paddingX,
    inputPaddingRight: sizeConfig.paddingX,
    inputPaddingTop: sizeConfig.paddingY,
    inputPaddingBottom: sizeConfig.paddingY,
    inputFontSize: sizeConfig.fontSize,
    inputFontWeight: 400,
    inputLineHeight: 1.5,
    inputFontFamily: 'inherit',

    // ─────────────────────────────────────────────────────────────────────────
    // COLORS (from EnrichedToken - MOMOTO GOVERNED)
    // ─────────────────────────────────────────────────────────────────────────
    inputBackgroundColor: resolvedTokens.backgroundColor.toCssValue(),
    inputColor: resolvedTokens.textColor.toCssValue(),

    // ─────────────────────────────────────────────────────────────────────────
    // VISUAL POLISH (non-perceptual - ALLOWED)
    // ─────────────────────────────────────────────────────────────────────────
    inputBorderRadius: BORDER_RADIUS,
    inputOutline: 'none', // Handled by border color changes
    inputCursor: currentState === 'disabled' ? 'not-allowed' : 'text',
    inputTransition: `all ${TRANSITION_DURATION}ms ease-in-out`,
  };

  // ───────────────────────────────────────────────────────────────────────────
  // BORDER (conditional - from token if provided)
  // ───────────────────────────────────────────────────────────────────────────
  if (resolvedTokens.borderColor) {
    styles.inputBorderWidth = 1;
    styles.inputBorderStyle = 'solid';
    styles.inputBorderColor = resolvedTokens.borderColor.toCssValue();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PLACEHOLDER (conditional - from token if provided)
  // ───────────────────────────────────────────────────────────────────────────
  if (resolvedTokens.placeholderColor) {
    styles.placeholderColor = resolvedTokens.placeholderColor.toCssValue();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // LABEL (conditional - from token if provided)
  // ───────────────────────────────────────────────────────────────────────────
  if (resolvedTokens.labelColor) {
    styles.labelFontSize = sizeConfig.labelFontSize;
    styles.labelFontWeight = 500;
    styles.labelColor = resolvedTokens.labelColor.toCssValue();
    styles.labelMarginBottom = LABEL_MARGIN_BOTTOM;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // HELPER TEXT (conditional - from token if provided)
  // ───────────────────────────────────────────────────────────────────────────
  if (resolvedTokens.helperTextColor) {
    styles.helperFontSize = sizeConfig.helperFontSize;
    styles.helperColor = resolvedTokens.helperTextColor.toCssValue();
    styles.helperMarginTop = HELPER_MARGIN_TOP;
  }

  return styles;
}

// ============================================================================
// STYLE MERGING UTILITY
// ============================================================================

/**
 * Merge user-provided styles with computed styles.
 *
 * User styles take precedence over computed styles.
 *
 * @param computedStyles - Styles computed by computeStyles()
 * @param userStyles - User-provided styles (optional)
 * @returns Merged styles
 */
export function mergeStyles(
  computedStyles: TextFieldStyles,
  userStyles?: Partial<TextFieldStyles>
): TextFieldStyles {
  if (!userStyles) {
    return computedStyles;
  }

  return {
    ...computedStyles,
    ...userStyles,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeStyles,
  mergeStyles,
};

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ ALL colors from EnrichedToken.toCssValue()
 *    - backgroundColor: from token
 *    - textColor: from token
 *    - borderColor: from token (if provided)
 *    - placeholderColor: from token (if provided)
 *    - labelColor: from token (if provided)
 *    - helperTextColor: from token (if provided)
 *    - NO color calculations
 *
 * ✅ Layout/sizing from configuration
 *    - height, padding, fontSize from SIZE_CONFIG
 *    - Non-perceptual constants (ALLOWED)
 *
 * ✅ NO perceptual decisions
 *    - NO "is color dark?" checks
 *    - NO contrast calculations
 *    - NO color transformations
 *
 * ✅ Framework-agnostic
 *    - Returns plain object with CSS properties
 *    - Can be converted to any framework's style format
 *
 * PATTERN: Exact copy of button/styleComputer.ts adapted for TextField
 */
