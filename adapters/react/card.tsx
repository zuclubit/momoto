/**
 * @fileoverview Card Component - React Adapter
 *
 * Card container component with variants, elevation, and interactive states.
 *
 * @module adapters/react/card
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import CardCore from '../core/card/cardCore';
import type { CardProps } from '../core/card/cardCore.types';

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Card Component
 *
 * Flexible container component with elevation and interactive states.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <h2>Title</h2>
 *   <p>Content here...</p>
 * </Card>
 *
 * // Interactive card with onClick
 * <Card variant="interactive" onClick={() => console.log('clicked')}>
 *   <h2>Clickable Card</h2>
 * </Card>
 *
 * // Outlined card with custom padding
 * <Card variant="outlined" padding="md">
 *   <h2>Outlined Card</h2>
 * </Card>
 * ```
 */
export function Card(props: CardProps): JSX.Element {
  const [, setIsHovered] = useState(false);

  // Create core instance
  const core = new CardCore(props);

  // Compute output
  const output = core.compute();
  const { styles, ariaProps, dataAttributes, handlers } = output;

  // Enhance handlers with state management
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setIsHovered(true);
    core.setState({ isHovered: true });
    handlers.onMouseEnter?.(e);
  }, [handlers.onMouseEnter]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    setIsHovered(false);
    core.setState({ isHovered: false });
    handlers.onMouseLeave?.(e);
  }, [handlers.onMouseLeave]);

  return (
    <div
      id={props.id}
      className={props.className}
      style={styles.container}
      onClick={handlers.onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...ariaProps}
      {...dataAttributes}
    >
      {props.children as React.ReactNode}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Card;

// Re-export types and enums for convenience
export type { CardProps } from '../core/card/cardCore.types';
export { CardVariant, CardPadding, CardRadius } from '../core/card/cardCore.types';
