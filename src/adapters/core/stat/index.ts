/**
 * @fileoverview Stat Core Exports
 *
 * Centralized exports for the Stat core module.
 *
 * @module adapters/core/stat
 * @version 1.0.0
 */

// Core
export { StatCore, default as StatCoreDefault } from './statCore';

// Types
export type {
  StatProps,
  StatComputeOutput,
  StatTrend,
} from './statCore.types';

export { StatSize, TrendDirection } from './statCore.types';

// Constants
export {
  SIZE_CONFIG,
  TREND_SYMBOLS,
  DEFAULT_SIZE,
} from './constants';

// Style Computer
export {
  computeStyles,
  validateProps,
  getDefaultSize,
  getTrendSymbol,
} from './styleComputer';
