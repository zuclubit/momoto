/**
 * @fileoverview Badge Core
 *
 * Framework-agnostic core logic for the Badge component.
 *
 * @module adapters/core/badge/badgeCore
 * @version 1.0.0
 */

import type { BadgeProps, BadgeComputeOutput } from './badgeCore.types';
import { computeStyles, validateProps } from './styleComputer';

// ============================================================================
// BADGE CORE
// ============================================================================

/**
 * Badge Core Class
 *
 * Framework-agnostic Badge logic that can be adapted to any UI framework.
 *
 * @example
 * ```typescript
 * const core = new BadgeCore({
 *   children: 'Won',
 *   variant: BadgeVariant.SOLID,
 *   backgroundColor: successBg,
 *   textColor: successText,
 * });
 * const output = core.compute();
 * // Use output.styles, output.dataAttributes, output.ariaProps
 * ```
 */
export class BadgeCore {
  private props: BadgeProps;

  constructor(props: BadgeProps) {
    this.props = props;
    validateProps(props);
  }

  /**
   * Compute all styles and attributes
   */
  compute(): BadgeComputeOutput {
    return computeStyles(this.props);
  }

  /**
   * Get current props
   */
  getProps(): BadgeProps {
    return this.props;
  }

  /**
   * Update props
   */
  updateProps(newProps: Partial<BadgeProps>): void {
    this.props = { ...this.props, ...newProps };
  }
}

export default BadgeCore;
