/**
 * @fileoverview Style Computer - Checkbox Style Computation Logic
 *
 * FASE 15: Component Expansion
 *
 * Computes checkbox styles from resolved tokens and configuration.
 * Framework-agnostic style computation.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ ALL colors from EnrichedToken (NO calculations)
 * - ✅ Layout/sizing from configuration (ALLOWED)
 * - ✅ NO perceptual decisions
 *
 * @module momoto-ui/adapters/core/checkbox/styleComputer
 * @version 1.0.0
 */

import type {
  CheckboxStyles,
  ComputeStylesInput,
} from './checkboxCore.types';
import {
  BORDER_RADIUS,
  TRANSITION_DURATION,
  FOCUS_OUTLINE_WIDTH,
  FOCUS_OUTLINE_OFFSET,
} from './constants';

// ============================================================================
// STYLE COMPUTATION
// ============================================================================

/**
 * Compute checkbox styles from resolved tokens and configuration.
 *
 * CONTRACT: All colors come from EnrichedToken.toCssValue() (ALLOWED).
 * Layout/sizing values come from configuration (ALLOWED).
 * NO perceptual calculations.
 *
 * @param input - Style computation input
 * @returns Framework-agnostic checkbox styles
 */
export function computeStyles(input: ComputeStylesInput): CheckboxStyles {
  const {
    resolvedTokens,
    currentState,
    sizeConfig,
  } = input;

  const isDisabled = currentState === 'disabled' || currentState === 'checkedDisabled' || currentState === 'indeterminateDisabled';

  const styles: CheckboxStyles = {
    // ─────────────────────────────────────────────────────────────────────────
    // CONTAINER (from configuration - ALLOWED)
    // ─────────────────────────────────────────────────────────────────────────
    containerDisplay: 'inline-flex',
    containerAlignItems: 'center',
    containerGap: sizeConfig.gap,
    containerCursor: isDisabled ? 'not-allowed' : 'pointer',
    containerOpacity: isDisabled ? 0.6 : 1,

    // ─────────────────────────────────────────────────────────────────────────
    // CHECKBOX BOX (from configuration + tokens)
    // ─────────────────────────────────────────────────────────────────────────
    boxWidth: sizeConfig.boxSize,
    boxHeight: sizeConfig.boxSize,
    boxBackgroundColor: resolvedTokens.backgroundColor.toCssValue(),
    boxBorderWidth: sizeConfig.borderWidth,
    boxBorderStyle: 'solid',
    boxBorderColor: resolvedTokens.borderColor.toCssValue(),
    boxBorderRadius: BORDER_RADIUS,
    boxDisplay: 'inline-flex',
    boxAlignItems: 'center',
    boxJustifyContent: 'center',
    boxTransition: `all ${TRANSITION_DURATION}ms ease-in-out`,

    // ─────────────────────────────────────────────────────────────────────────
    // CHECKMARK/DASH ICON (from tokens - MOMOTO GOVERNED)
    // ─────────────────────────────────────────────────────────────────────────
    iconSize: sizeConfig.iconSize,
    iconColor: resolvedTokens.checkColor.toCssValue(),
    iconDisplay: 'block',

    // ─────────────────────────────────────────────────────────────────────────
    // FOCUS OUTLINE (from token if provided)
    // ─────────────────────────────────────────────────────────────────────────
    outlineColor: resolvedTokens.outlineColor?.toCssValue() || null,
    outlineWidth: resolvedTokens.outlineColor ? FOCUS_OUTLINE_WIDTH : undefined,
    outlineOffset: resolvedTokens.outlineColor ? FOCUS_OUTLINE_OFFSET : undefined,

    // ─────────────────────────────────────────────────────────────────────────
    // LABEL (from token if provided)
    // ─────────────────────────────────────────────────────────────────────────
    labelFontSize: sizeConfig.labelFontSize,
    labelColor: resolvedTokens.labelColor?.toCssValue() || null,
  };

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
  computedStyles: CheckboxStyles,
  userStyles?: Partial<CheckboxStyles>
): CheckboxStyles {
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
 *    - borderColor: from token
 *    - checkColor: from token
 *    - outlineColor: from token (if provided)
 *    - labelColor: from token (if provided)
 *    - NO color calculations
 *
 * ✅ Layout/sizing from configuration
 *    - boxSize, borderWidth, iconSize, labelFontSize from SIZE_CONFIG
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
 * PATTERN: Exact copy of textfield/styleComputer.ts adapted for Checkbox
 */
