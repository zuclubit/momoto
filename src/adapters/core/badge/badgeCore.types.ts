/**
 * @fileoverview Badge Component Types
 *
 * Type definitions for the Badge component (status indicators).
 *
 * @module adapters/core/badge/badgeCore.types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Badge Variants
 */
export enum BadgeVariant {
  SOLID = 'solid',
  SUBTLE = 'subtle',
  OUTLINE = 'outline',
}

/**
 * Badge Size Variants
 */
export enum BadgeSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Badge Props
 */
export interface BadgeProps {
  /** Badge content/label */
  children: React.ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Background color */
  backgroundColor?: EnrichedToken;
  /** Text color */
  textColor?: EnrichedToken;
  /** Border color (for outline variant) */
  borderColor?: EnrichedToken;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Unique identifier */
  id?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Badge Compute Output
 */
export interface BadgeComputeOutput {
  styles: {
    container: React.CSSProperties;
  };
  dataAttributes: Record<string, string>;
  ariaProps: Record<string, string>;
}
