/**
 * @fileoverview Stat Component - React Adapter
 *
 * KPI/Stat display component with trend indicators.
 *
 * @module adapters/react/stat
 * @version 1.0.0
 */

import StatCore from '../core/stat/statCore';
import type { StatProps } from '../core/stat/statCore.types';
import { getTrendSymbol } from '../core/stat/styleComputer';

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Stat Component
 *
 * Display KPIs and metrics with optional trend indicators.
 *
 * @example
 * ```tsx
 * // Basic stat
 * <Stat
 *   label="Total Revenue"
 *   value="$75,000"
 *   size="xl"
 * />
 *
 * // Stat with trend
 * <Stat
 *   label="Active Clients"
 *   value={42}
 *   trend={{
 *     direction: TrendDirection.UP,
 *     value: '+10.3%',
 *     description: 'vs last month',
 *   }}
 *   size="lg"
 * />
 *
 * // Stat with helper text
 * <Stat
 *   label="Weighted Value"
 *   value="$58,000"
 *   helperText="Probability-weighted forecast"
 *   size="md"
 * />
 * ```
 */
export function Stat(props: StatProps): JSX.Element {
  // Create core instance
  const core = new StatCore(props);

  // Compute output
  const output = core.compute();
  const { styles, dataAttributes } = output;

  return (
    <div
      id={props.id}
      className={props.className}
      style={styles.container}
      {...dataAttributes}
    >
      {/* Label */}
      <div style={styles.label}>{props.label}</div>

      {/* Value */}
      <div style={styles.value}>{props.value}</div>

      {/* Trend */}
      {props.trend && styles.trend && (
        <div style={styles.trend}>
          <span style={{ fontSize: '1.125rem' }}>
            {getTrendSymbol(props.trend.direction)}
          </span>
          <span>{props.trend.value}</span>
          {props.trend.description && (
            <span style={{ opacity: 0.5, fontWeight: 400 }}>
              {props.trend.description}
            </span>
          )}
        </div>
      )}

      {/* Helper Text */}
      {props.helperText && styles.helperText && (
        <div style={styles.helperText}>{props.helperText}</div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Stat;

// Re-export types and enums for convenience
export type { StatProps, StatTrend } from '../core/stat/statCore.types';
export { StatSize, TrendDirection } from '../core/stat/statCore.types';
