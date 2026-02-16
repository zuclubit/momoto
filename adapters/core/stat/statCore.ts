/**
 * @fileoverview Stat Core
 *
 * Framework-agnostic core logic for the Stat component (KPI display).
 *
 * @module adapters/core/stat/statCore
 * @version 1.0.0
 */

import type { StatProps, StatComputeOutput } from './statCore.types';
import { computeStyles, validateProps } from './styleComputer';

// ============================================================================
// STAT CORE
// ============================================================================

/**
 * Stat Core Class
 *
 * Framework-agnostic Stat logic that can be adapted to any UI framework.
 *
 * @example
 * ```typescript
 * const core = new StatCore({
 *   label: 'Total Revenue',
 *   value: '$75,000',
 *   trend: {
 *     direction: TrendDirection.UP,
 *     value: '+10.3%',
 *     description: 'vs last month',
 *   },
 * });
 * const output = core.compute();
 * // Use output.styles and output.dataAttributes
 * ```
 */
export class StatCore {
  private props: StatProps;

  constructor(props: StatProps) {
    this.props = props;
    validateProps(props);
  }

  /**
   * Compute all styles and attributes
   */
  compute(): StatComputeOutput {
    return computeStyles(this.props);
  }

  /**
   * Get current props
   */
  getProps(): StatProps {
    return this.props;
  }

  /**
   * Update props
   */
  updateProps(newProps: Partial<StatProps>): void {
    this.props = { ...this.props, ...newProps };
  }
}

export default StatCore;
