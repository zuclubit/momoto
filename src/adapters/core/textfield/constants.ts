/**
 * @fileoverview TextField Constants - Framework-Agnostic Constants
 *
 * FASE 15: Component Expansion
 *
 * Shared constants for TextField component.
 * Non-perceptual configuration values (sizes, spacing, etc.)
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Non-perceptual constants (sizes, spacing) ALLOWED
 * - ✅ NO color constants (all colors from Momoto)
 * - ✅ NO magic numbers for perceptual decisions
 *
 * @module momoto-ui/adapters/core/textfield/constants
 * @version 1.0.0
 */

import type { TextFieldSizeConfig } from './textFieldCore.types';

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

/**
 * SIZE_CONFIG - Size configurations for all text field sizes.
 *
 * Non-perceptual layout constants (ALLOWED by contract).
 */
export const SIZE_CONFIG: TextFieldSizeConfig = {
  sm: {
    height: 32,
    paddingX: 12,
    paddingY: 6,
    fontSize: 14,
    labelFontSize: 12,
    helperFontSize: 11,
  },
  md: {
    height: 40,
    paddingX: 16,
    paddingY: 8,
    fontSize: 16,
    labelFontSize: 14,
    helperFontSize: 12,
  },
  lg: {
    height: 48,
    paddingX: 20,
    paddingY: 12,
    fontSize: 18,
    labelFontSize: 16,
    helperFontSize: 14,
  },
} as const;

// ============================================================================
// STYLE CONSTANTS
// ============================================================================

/**
 * BORDER_RADIUS - Default border radius for text fields.
 */
export const BORDER_RADIUS = 6;

/**
 * TRANSITION_DURATION - Default transition duration in milliseconds.
 */
export const TRANSITION_DURATION = 150;

/**
 * FOCUS_OUTLINE_WIDTH - Focus outline width in pixels.
 */
export const FOCUS_OUTLINE_WIDTH = 2;

/**
 * LABEL_MARGIN_BOTTOM - Space between label and input in pixels.
 */
export const LABEL_MARGIN_BOTTOM = 6;

/**
 * HELPER_MARGIN_TOP - Space between input and helper text in pixels.
 */
export const HELPER_MARGIN_TOP = 4;

// ============================================================================
// QUALITY THRESHOLDS
// ============================================================================

/**
 * QUALITY_THRESHOLD - Threshold for low quality warnings.
 *
 * NOT a perceptual decision - just a reporting threshold.
 */
export const QUALITY_THRESHOLD = 0.5;

/**
 * CONFIDENCE_THRESHOLD - Threshold for low confidence warnings.
 *
 * NOT a perceptual decision - just a reporting threshold.
 */
export const CONFIDENCE_THRESHOLD = 0.5;

// ============================================================================
// CLASS NAME PREFIXES
// ============================================================================

/**
 * CLASS_PREFIX - Base class name prefix for text field elements.
 */
export const CLASS_PREFIX = 'momoto-textfield';

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  SIZE_CONFIG,
  BORDER_RADIUS,
  TRANSITION_DURATION,
  FOCUS_OUTLINE_WIDTH,
  LABEL_MARGIN_BOTTOM,
  HELPER_MARGIN_TOP,
  QUALITY_THRESHOLD,
  CONFIDENCE_THRESHOLD,
  CLASS_PREFIX,
} as const;

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ All constants are non-perceptual
 *    - Sizes, spacing, timing (ALLOWED)
 *    - NO color values
 *    - NO perceptual thresholds
 *
 * ✅ Quality thresholds are for REPORTING only
 *    - Do NOT affect color decisions
 *    - Only control dev warnings
 *
 * ✅ Framework-agnostic
 *    - Can be used in React, Vue, Svelte, Angular
 *
 * PATTERN: Exact copy of button/constants.ts adapted for TextField
 */
