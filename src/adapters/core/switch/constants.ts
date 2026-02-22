/**
 * @fileoverview SwitchCore Constants
 *
 * FASE 15.5: Component Expansion - Switch (Final Base Component)
 *
 * @module momoto-ui/adapters/core/switch/constants
 * @version 1.0.0
 */

import type { SizeConfig, SwitchSize } from './switchCore.types';

export const SIZE_CONFIG: Record<SwitchSize, SizeConfig> = {
  sm: {
    trackWidth: 36,
    trackHeight: 20,
    thumbSize: 16,
    labelFontSize: 14,
    helperFontSize: 12,
    labelGap: 8,
    helperGap: 4,
  },
  md: {
    trackWidth: 44,
    trackHeight: 24,
    thumbSize: 20,
    labelFontSize: 16,
    helperFontSize: 13,
    labelGap: 12,
    helperGap: 6,
  },
  lg: {
    trackWidth: 52,
    trackHeight: 28,
    thumbSize: 24,
    labelFontSize: 18,
    helperFontSize: 14,
    labelGap: 16,
    helperGap: 8,
  },
};

export const TRACK_BORDER_WIDTH = 2;
export const TRACK_PADDING = 2;
export const THUMB_BORDER_RADIUS = 9999; // Full circle
export const TRACK_BORDER_RADIUS = 9999; // Full pill shape
export const OUTLINE_WIDTH = 2;
export const OUTLINE_OFFSET = 2;
export const TRANSITION_DURATION = 200;
export const TRANSITION_EASING = 'ease-in-out';
export const TRANSITION_PROPERTIES = ['background-color', 'border-color', 'transform'];
export const TRANSITION = TRANSITION_PROPERTIES.map(
  (prop) => `${prop} ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`
).join(', ');
export const LABEL_FONT_WEIGHT = 400;
export const DISABLED_OPACITY = 0.6;
export const DISABLED_CURSOR = 'not-allowed';
export const CLASS_PREFIX = 'momoto-switch';
