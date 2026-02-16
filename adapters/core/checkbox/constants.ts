/**
 * @fileoverview Checkbox Constants - Framework-Agnostic Constants
 *
 * FASE 15: Component Expansion
 *
 * Shared constants for Checkbox component.
 * Non-perceptual configuration values (sizes, spacing, etc.)
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Non-perceptual constants (sizes, spacing) ALLOWED
 * - ✅ NO color constants (all colors from Momoto)
 * - ✅ NO magic numbers for perceptual decisions
 *
 * @module momoto-ui/adapters/core/checkbox/constants
 * @version 1.0.0
 */

import type { CheckboxSizeConfig } from './checkboxCore.types';

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

/**
 * SIZE_CONFIG - Size configurations for all checkbox sizes.
 *
 * Non-perceptual layout constants (ALLOWED by contract).
 */
export const SIZE_CONFIG: CheckboxSizeConfig = {
  sm: {
    boxSize: 16,
    borderWidth: 1,
    iconSize: 10,
    labelFontSize: 14,
    gap: 8,
  },
  md: {
    boxSize: 20,
    borderWidth: 2,
    iconSize: 12,
    labelFontSize: 16,
    gap: 10,
  },
  lg: {
    boxSize: 24,
    borderWidth: 2,
    iconSize: 14,
    labelFontSize: 18,
    gap: 12,
  },
} as const;

// ============================================================================
// STYLE CONSTANTS
// ============================================================================

/**
 * BORDER_RADIUS - Default border radius for checkbox box.
 */
export const BORDER_RADIUS = 4;

/**
 * TRANSITION_DURATION - Default transition duration in milliseconds.
 */
export const TRANSITION_DURATION = 150;

/**
 * FOCUS_OUTLINE_WIDTH - Focus outline width in pixels.
 */
export const FOCUS_OUTLINE_WIDTH = 2;

/**
 * FOCUS_OUTLINE_OFFSET - Focus outline offset in pixels.
 */
export const FOCUS_OUTLINE_OFFSET = 2;

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
 * CLASS_PREFIX - Base class name prefix for checkbox elements.
 */
export const CLASS_PREFIX = 'momoto-checkbox';

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
 *    - Do NOT affect color decisions
 *    - Only control dev warnings
 *
 * ✅ Framework-agnostic
 *    - Can be used in React, Vue, Svelte, Angular
 *
 * PATTERN: Exact copy of textfield/constants.ts adapted for Checkbox
 */
