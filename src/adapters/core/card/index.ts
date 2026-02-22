/**
 * @fileoverview Card Component - Core Exports
 *
 * @module adapters/core/card
 * @version 1.0.0
 */

// ============================================================================
// EXPORTS
// ============================================================================

export { default as CardCore } from './cardCore';
export { CardCore as default } from './cardCore';

// Types
export type * from './cardCore.types';
export { CardVariant, CardPadding, CardRadius } from './cardCore.types';

// Constants
export {
  PADDING_CONFIG,
  RADIUS_CONFIG,
  SHADOW_CONFIG,
  VARIANT_CONFIG,
  TRANSITION_CONFIG,
  TRANSITION_PROPERTIES,
} from './constants';

// Utilities
export {
  computeStyles,
  getDefaultVariant,
  validateProps,
} from './styleComputer';
