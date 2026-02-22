/**
 * @fileoverview Button Constants - Framework-Agnostic Constants
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Shared constants used by all framework adapters.
 * These are non-perceptual configuration values (sizes, spacing, etc.)
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Non-perceptual constants (sizes, spacing) are ALLOWED
 * - ✅ NO color constants (all colors from Momoto)
 * - ✅ NO magic numbers for perceptual decisions
 *
 * @module momoto-ui/adapters/core/button/constants
 * @version 1.0.0
 */

import type { ButtonSizeConfig } from './buttonCore.types';

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

/**
 * SIZE_CONFIG - Size configurations for all button sizes.
 *
 * These are non-perceptual layout constants (ALLOWED by contract).
 *
 * Defines:
 * - height: Total button height in pixels
 * - paddingX: Horizontal padding (left/right)
 * - paddingY: Vertical padding (top/bottom)
 * - fontSize: Text size in pixels
 * - iconSize: Icon dimensions in pixels
 * - gap: Space between icon and label in pixels
 */
export const SIZE_CONFIG: ButtonSizeConfig = {
  sm: {
    height: 32,
    paddingX: 12,
    paddingY: 6,
    fontSize: 14,
    iconSize: 16,
    gap: 6,
  },
  md: {
    height: 40,
    paddingX: 16,
    paddingY: 8,
    fontSize: 16,
    iconSize: 20,
    gap: 8,
  },
  lg: {
    height: 48,
    paddingX: 20,
    paddingY: 12,
    fontSize: 18,
    iconSize: 24,
    gap: 10,
  },
} as const;

// ============================================================================
// STYLE CONSTANTS
// ============================================================================

/**
 * BORDER_RADIUS - Default border radius for buttons.
 *
 * Non-perceptual visual constant (ALLOWED).
 */
export const BORDER_RADIUS = 8;

/**
 * TRANSITION_DURATION - Default transition duration in milliseconds.
 *
 * Non-perceptual timing constant (ALLOWED).
 */
export const TRANSITION_DURATION = 150;

/**
 * FOCUS_OUTLINE_WIDTH - Focus outline width in pixels.
 *
 * Accessibility constant (ALLOWED).
 */
export const FOCUS_OUTLINE_WIDTH = 2;

/**
 * FOCUS_OUTLINE_OFFSET - Focus outline offset in pixels.
 *
 * Accessibility constant (ALLOWED).
 */
export const FOCUS_OUTLINE_OFFSET = 2;

// ============================================================================
// QUALITY THRESHOLDS
// ============================================================================

/**
 * QUALITY_THRESHOLD - Threshold for low quality warnings.
 *
 * Tokens with qualityScore below this will trigger warnings in dev mode.
 * This is NOT a perceptual decision - just a reporting threshold.
 */
export const QUALITY_THRESHOLD = 0.5;

/**
 * CONFIDENCE_THRESHOLD - Threshold for low confidence warnings.
 *
 * Tokens with confidence below this will trigger warnings in dev mode.
 * This is NOT a perceptual decision - just a reporting threshold.
 */
export const CONFIDENCE_THRESHOLD = 0.5;

// ============================================================================
// CLASS NAME PREFIXES
// ============================================================================

/**
 * CLASS_PREFIX - Base class name prefix for button elements.
 *
 * Used for CSS class generation across all frameworks.
 */
export const CLASS_PREFIX = 'momoto-button';

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  SIZE_CONFIG,
  BORDER_RADIUS,
  TRANSITION_DURATION,
  FOCUS_OUTLINE_WIDTH,
  FOCUS_OUTLINE_OFFSET,
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
 *    - They do NOT affect color decisions
 *    - They only control dev warnings
 *
 * ✅ Framework-agnostic
 *    - Can be used in React, Vue, Svelte, Angular
 *    - No framework-specific code
 */
