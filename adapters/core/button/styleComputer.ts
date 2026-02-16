/**
 * @fileoverview Style Computer - Button Style Computation Logic
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Computes button styles from resolved tokens and configuration.
 * This is framework-agnostic style computation that returns a plain object.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ ALL colors from EnrichedToken (NO calculations)
 * - ✅ Layout/sizing from configuration (ALLOWED)
 * - ✅ NO perceptual decisions
 *
 * @module momoto-ui/adapters/core/button/styleComputer
 * @version 1.0.0
 */

import type {
  ButtonStyles,
  ComputeStylesInput,
} from './buttonCore.types';
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
 * Compute button styles from resolved tokens and configuration.
 *
 * CONTRACT: All colors come from EnrichedToken.toCssValue() (ALLOWED).
 * Layout/sizing values come from configuration (ALLOWED).
 * NO perceptual calculations.
 *
 * @param input - Style computation input
 * @returns Framework-agnostic button styles
 */
export function computeStyles(input: ComputeStylesInput): ButtonStyles {
  const {
    resolvedTokens,
    size,
    fullWidth,
    hasIcon,
    currentState,
    sizeConfig,
  } = input;

  // Base styles
  const styles: ButtonStyles = {
    // ─────────────────────────────────────────────────────────────────────────
    // LAYOUT (from configuration - ALLOWED)
    // ─────────────────────────────────────────────────────────────────────────
    height: sizeConfig.height,
    paddingLeft: sizeConfig.paddingX,
    paddingRight: sizeConfig.paddingX,
    paddingTop: sizeConfig.paddingY,
    paddingBottom: sizeConfig.paddingY,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hasIcon ? sizeConfig.gap : 0,

    // ─────────────────────────────────────────────────────────────────────────
    // TYPOGRAPHY (from configuration - ALLOWED)
    // ─────────────────────────────────────────────────────────────────────────
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily: 'inherit',

    // ─────────────────────────────────────────────────────────────────────────
    // COLORS (from EnrichedToken - MOMOTO GOVERNED)
    // ─────────────────────────────────────────────────────────────────────────
    backgroundColor: resolvedTokens.backgroundColor.toCssValue(),
    color: resolvedTokens.textColor.toCssValue(),

    // ─────────────────────────────────────────────────────────────────────────
    // VISUAL POLISH (non-perceptual - ALLOWED)
    // ─────────────────────────────────────────────────────────────────────────
    borderRadius: BORDER_RADIUS,
    cursor: currentState === 'disabled' ? 'not-allowed' : 'pointer',
    transition: `all ${TRANSITION_DURATION}ms ease-in-out`,
    userSelect: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  // ───────────────────────────────────────────────────────────────────────────
  // BORDER (conditional - from token if provided)
  // ───────────────────────────────────────────────────────────────────────────
  if (resolvedTokens.borderColor) {
    styles.borderWidth = 1;
    styles.borderStyle = 'solid';
    styles.borderColor = resolvedTokens.borderColor.toCssValue();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // FOCUS OUTLINE (conditional - from token if in focus state)
  // ───────────────────────────────────────────────────────────────────────────
  if (currentState === 'focus' && resolvedTokens.outlineColor) {
    styles.outline = `${FOCUS_OUTLINE_WIDTH}px solid ${resolvedTokens.outlineColor.toCssValue()}`;
    styles.outlineOffset = FOCUS_OUTLINE_OFFSET;
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
 * This allows framework adapters to accept custom styles from users.
 *
 * @param computedStyles - Styles computed by computeStyles()
 * @param userStyles - User-provided styles (optional)
 * @returns Merged styles
 */
export function mergeStyles(
  computedStyles: ButtonStyles,
  userStyles?: Partial<ButtonStyles>
): ButtonStyles {
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
 *    - color (text): from token
 *    - borderColor: from token (if provided)
 *    - outline: from token (if provided)
 *    - NO color calculations
 *
 * ✅ Layout/sizing from configuration
 *    - height, padding, fontSize, etc. from SIZE_CONFIG
 *    - These are non-perceptual constants (ALLOWED)
 *
 * ✅ NO perceptual decisions
 *    - NO "is color dark?" checks
 *    - NO contrast calculations
 *    - NO color transformations
 *
 * ✅ Framework-agnostic
 *    - Returns plain object with CSS properties
 *    - Can be converted to any framework's style format:
 *      - React: CSSProperties (direct use)
 *      - Vue: :style binding
 *      - Svelte: style directive
 *      - Angular: [ngStyle]
 *
 * EXTRACTED FROM:
 * - React Button.tsx lines 277-321 (buttonStyle computation)
 */
