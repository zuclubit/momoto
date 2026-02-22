/**
 * @fileoverview Button Types - Type Definitions for Button Component
 *
 * FASE 11: UI Primitives & Component Kit
 *
 * Complete type definitions for the canonical Button component.
 * Demonstrates token-first API design.
 *
 * @module momoto-ui/components/primitives/Button/types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens';
import type { AriaProps } from '../utils/aria';

// ============================================================================
// BUTTON PROPS
// ============================================================================

/**
 * Button component props.
 *
 * CONTRACT PRINCIPLES:
 * - ALL colors via EnrichedToken
 * - ALL states via tokens (hover, focus, active, disabled)
 * - NO calculations, NO decisions
 * - Accessibility via token metadata
 */
export interface ButtonProps extends AriaProps {
  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  /** Button label text (required for accessibility) */
  label: string;

  /** Optional icon element */
  icon?: React.ReactNode;

  /** Icon position relative to label */
  iconPosition?: 'left' | 'right';

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - BASE STATE (REQUIRED)
  // ──────────────────────────────────────────────────────────────────────────

  /** Background color token */
  backgroundColor: EnrichedToken;

  /** Text color token */
  textColor: EnrichedToken;

  /** Border color token (optional, for outlined buttons) */
  borderColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - HOVER STATE (OPTIONAL)
  // ──────────────────────────────────────────────────────────────────────────

  /** Background color on hover */
  hoverBackgroundColor?: EnrichedToken;

  /** Text color on hover */
  hoverTextColor?: EnrichedToken;

  /** Border color on hover */
  hoverBorderColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FOCUS STATE (OPTIONAL)
  // ──────────────────────────────────────────────────────────────────────────

  /** Background color on focus */
  focusBackgroundColor?: EnrichedToken;

  /** Text color on focus */
  focusTextColor?: EnrichedToken;

  /** Border color on focus */
  focusBorderColor?: EnrichedToken;

  /** Focus outline color (for focus ring) */
  focusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - ACTIVE STATE (OPTIONAL)
  // ──────────────────────────────────────────────────────────────────────────

  /** Background color on active/pressed */
  activeBackgroundColor?: EnrichedToken;

  /** Text color on active/pressed */
  activeTextColor?: EnrichedToken;

  /** Border color on active/pressed */
  activeBorderColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - DISABLED STATE (OPTIONAL)
  // ──────────────────────────────────────────────────────────────────────────

  /** Background color when disabled */
  disabledBackgroundColor?: EnrichedToken;

  /** Text color when disabled */
  disabledTextColor?: EnrichedToken;

  /** Border color when disabled */
  disabledBorderColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // BEHAVIOR
  // ──────────────────────────────────────────────────────────────────────────

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Whether button is disabled */
  disabled?: boolean;

  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';

  /** Loading state (disables interaction but shows spinner) */
  loading?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  /** Button size */
  size?: 'sm' | 'md' | 'lg';

  /** Full width button */
  fullWidth?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  /** Additional CSS class */
  className?: string;

  /** Additional inline styles (use sparingly) */
  style?: React.CSSProperties;

  // ──────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ──────────────────────────────────────────────────────────────────────────

  /** Whether to show quality warnings in dev mode */
  showQualityWarnings?: boolean;

  /** Custom data attributes for debugging */
  'data-testid'?: string;
}

// ============================================================================
// BUTTON VARIANT PROPS (THEME-BASED)
// ============================================================================

/**
 * Button props when using theme variants.
 *
 * Simplified API that gets tokens from theme context.
 * Preferred approach for most use cases.
 */
export interface ButtonVariantProps extends Omit<ButtonProps,
  | 'backgroundColor'
  | 'textColor'
  | 'borderColor'
  | 'hoverBackgroundColor'
  | 'hoverTextColor'
  | 'hoverBorderColor'
  | 'focusBackgroundColor'
  | 'focusTextColor'
  | 'focusBorderColor'
  | 'focusOutlineColor'
  | 'activeBackgroundColor'
  | 'activeTextColor'
  | 'activeBorderColor'
  | 'disabledBackgroundColor'
  | 'disabledTextColor'
  | 'disabledBorderColor'
> {
  /** Button variant (gets tokens from theme) */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
}

// ============================================================================
// INTERNAL TYPES
// ============================================================================

/**
 * Current button state (internal).
 */
export type ButtonState = 'base' | 'hover' | 'focus' | 'active' | 'disabled';

/**
 * Resolved tokens for current state (internal).
 */
export interface ResolvedButtonTokens {
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor: EnrichedToken | null;
  outlineColor: EnrichedToken | null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ButtonProps;

/**
 * TYPE DESIGN PRINCIPLES:
 *
 * 1. Token-First:
 *    - ALL visual properties via EnrichedToken
 *    - NO color strings, NO style calculations
 *
 * 2. Explicit States:
 *    - Separate token props for each state
 *    - Component SELECTS tokens, doesn't calculate them
 *
 * 3. Optional State Tokens:
 *    - Fallback to base tokens if state tokens not provided
 *    - Allows progressive enhancement
 *
 * 4. Accessibility Built-In:
 *    - Extends AriaProps for ARIA attributes
 *    - Token metadata includes WCAG compliance
 *
 * 5. Two API Levels:
 *    - ButtonProps: Full control, all tokens explicit
 *    - ButtonVariantProps: Theme-based, gets tokens from context
 *
 * USAGE PATTERNS:
 *
 * Pattern A - Explicit Tokens (Full Control):
 * ```tsx
 * <Button
 *   label="Click me"
 *   backgroundColor={primaryBg}
 *   textColor={primaryText}
 *   hoverBackgroundColor={primaryBgHover}
 *   onClick={handleClick}
 * />
 * ```
 *
 * Pattern B - Theme Variants (Recommended):
 * ```tsx
 * <Button
 *   label="Click me"
 *   variant="primary"
 *   onClick={handleClick}
 * />
 * ```
 */
