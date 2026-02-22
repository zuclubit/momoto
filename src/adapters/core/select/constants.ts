/**
 * @fileoverview SelectCore Constants
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Constant values for Select component.
 * NO color calculations, NO magic numbers in components.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Only dimensional/structural constants
 * - ✅ NO color values (all from tokens)
 * - ✅ NO perceptual heuristics
 *
 * @module momoto-ui/adapters/core/select/constants
 * @version 1.0.0
 */

import type { SizeConfig, SelectSize } from './selectCore.types';

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

/**
 * SIZE_CONFIG - Predefined size variants.
 *
 * NOTE: These are dimensional values only.
 * All colors come from tokens.
 */
export const SIZE_CONFIG: Record<SelectSize, SizeConfig> = {
  sm: {
    height: 32,
    paddingX: 12,
    fontSize: 14,
    labelFontSize: 12,
    helperFontSize: 12,
    iconSize: 16,
    labelGap: 4,
    helperGap: 4,
  },
  md: {
    height: 40,
    paddingX: 16,
    fontSize: 16,
    labelFontSize: 14,
    helperFontSize: 13,
    iconSize: 20,
    labelGap: 6,
    helperGap: 6,
  },
  lg: {
    height: 48,
    paddingX: 20,
    fontSize: 18,
    labelFontSize: 16,
    helperFontSize: 14,
    iconSize: 24,
    labelGap: 8,
    helperGap: 8,
  },
};

// ============================================================================
// BORDER & OUTLINE
// ============================================================================

/**
 * BORDER_WIDTH - Field border width in pixels.
 */
export const BORDER_WIDTH = 1;

/**
 * BORDER_RADIUS - Field border radius in pixels.
 */
export const BORDER_RADIUS = 6;

/**
 * OUTLINE_WIDTH - Focus/open outline width in pixels.
 */
export const OUTLINE_WIDTH = 2;

/**
 * OUTLINE_OFFSET - Focus/open outline offset in pixels.
 */
export const OUTLINE_OFFSET = 2;

// ============================================================================
// DROPDOWN
// ============================================================================

/**
 * DROPDOWN_BORDER_WIDTH - Dropdown border width in pixels.
 */
export const DROPDOWN_BORDER_WIDTH = 1;

/**
 * DROPDOWN_BORDER_RADIUS - Dropdown border radius in pixels.
 */
export const DROPDOWN_BORDER_RADIUS = 6;

/**
 * DROPDOWN_MAX_HEIGHT - Maximum dropdown height in pixels.
 */
export const DROPDOWN_MAX_HEIGHT = 240;

/**
 * DROPDOWN_Z_INDEX - Dropdown z-index.
 */
export const DROPDOWN_Z_INDEX = 1000;

/**
 * DROPDOWN_OFFSET - Gap between field and dropdown in pixels.
 */
export const DROPDOWN_OFFSET = 4;

/**
 * DROPDOWN_SHADOW - Dropdown box-shadow.
 * NOTE: Shadow color comes from token.
 */
export const DROPDOWN_SHADOW = '0 4px 12px';

// ============================================================================
// OPTION
// ============================================================================

/**
 * OPTION_PADDING_X - Option horizontal padding in pixels.
 */
export const OPTION_PADDING_X = 12;

/**
 * OPTION_PADDING_Y - Option vertical padding in pixels.
 */
export const OPTION_PADDING_Y = 8;

/**
 * OPTION_DISABLED_OPACITY - Opacity for disabled options.
 */
export const OPTION_DISABLED_OPACITY = 0.5;

// ============================================================================
// TRANSITIONS
// ============================================================================

/**
 * TRANSITION_DURATION - Animation duration in milliseconds.
 */
export const TRANSITION_DURATION = 150;

/**
 * TRANSITION_EASING - Animation easing function.
 */
export const TRANSITION_EASING = 'ease-in-out';

/**
 * TRANSITION_PROPERTIES - CSS properties to transition.
 */
export const TRANSITION_PROPERTIES = [
  'background-color',
  'border-color',
  'color',
  'box-shadow',
  'transform',
];

/**
 * TRANSITION - Complete transition CSS value.
 */
export const TRANSITION = TRANSITION_PROPERTIES.map(
  (prop) => `${prop} ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`
).join(', ');

// ============================================================================
// LABEL
// ============================================================================

/**
 * LABEL_FONT_WEIGHT - Label font weight.
 */
export const LABEL_FONT_WEIGHT = 500;

// ============================================================================
// DISABLED STATE
// ============================================================================

/**
 * DISABLED_OPACITY - Opacity for disabled field.
 */
export const DISABLED_OPACITY = 0.6;

/**
 * DISABLED_CURSOR - Cursor for disabled field.
 */
export const DISABLED_CURSOR = 'not-allowed';

// ============================================================================
// CSS CLASS PREFIX
// ============================================================================

/**
 * CLASS_PREFIX - Base CSS class prefix for Select.
 */
export const CLASS_PREFIX = 'momoto-select';

// ============================================================================
// ICON ROTATION
// ============================================================================

/**
 * ICON_ROTATION_CLOSED - Chevron rotation when dropdown is closed.
 */
export const ICON_ROTATION_CLOSED = 0;

/**
 * ICON_ROTATION_OPEN - Chevron rotation when dropdown is open (180deg).
 */
export const ICON_ROTATION_OPEN = 180;
