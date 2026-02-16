/**
 * @fileoverview Badge Core Exports
 *
 * Centralized exports for the Badge core module.
 *
 * @module adapters/core/badge
 * @version 1.0.0
 */

// Core
export { BadgeCore, default as BadgeCoreDefault } from './badgeCore';

// Types
export type {
  BadgeProps,
  BadgeComputeOutput,
} from './badgeCore.types';

export { BadgeVariant, BadgeSize } from './badgeCore.types';

// Constants
export {
  SIZE_CONFIG,
  VARIANT_CONFIG,
  DEFAULT_VARIANT,
  DEFAULT_SIZE,
} from './constants';

// Style Computer
export {
  computeStyles,
  validateProps,
  getDefaultVariant,
  getDefaultSize,
} from './styleComputer';
