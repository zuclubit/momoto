/**
 * @fileoverview Badge Component - React Adapter
 *
 * Status indicator badge component.
 *
 * @module adapters/react/badge
 * @version 1.0.0
 */

import React from 'react';
import BadgeCore from '../core/badge/badgeCore';
import type { BadgeProps } from '../core/badge/badgeCore.types';

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Badge Component
 *
 * Display status indicators, tags, and labels.
 *
 * @example
 * ```tsx
 * // Solid badge
 * <Badge
 *   variant="solid"
 *   backgroundColor={successBg}
 *   textColor={successText}
 * >
 *   Won
 * </Badge>
 *
 * // Subtle badge
 * <Badge
 *   variant="subtle"
 *   backgroundColor={warningBg}
 *   textColor={warningText}
 *   size="md"
 * >
 *   Negotiation
 * </Badge>
 *
 * // Outline badge
 * <Badge
 *   variant="outline"
 *   textColor={primaryText}
 *   borderColor={primaryBorder}
 * >
 *   Lead
 * </Badge>
 *
 * // Clickable badge
 * <Badge
 *   onClick={() => console.log('Clicked!')}
 *   backgroundColor={neutralBg}
 *   textColor={neutralText}
 * >
 *   Clickable
 * </Badge>
 * ```
 */
export function Badge(props: BadgeProps): JSX.Element {
  // Create core instance
  const core = new BadgeCore(props);

  // Compute output
  const output = core.compute();
  const { styles, dataAttributes, ariaProps } = output;

  // Handle click
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (props.onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      props.onClick();
    }
  };

  return (
    <span
      id={props.id}
      className={props.className}
      style={styles.container}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...dataAttributes}
      {...ariaProps}
    >
      {props.children as React.ReactNode}
    </span>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Badge;

// Re-export types and enums for convenience
export type { BadgeProps } from '../core/badge/badgeCore.types';
export { BadgeVariant, BadgeSize } from '../core/badge/badgeCore.types';
