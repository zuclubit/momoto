/**
 * @fileoverview ButtonCore Types - Framework-Agnostic Button Types
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Shared type definitions used by all framework adapters.
 * These types are framework-agnostic and define the contract
 * for button behavior across React, Vue, Svelte, and Angular.
 *
 * @module momoto-ui/adapters/core/button/types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// BUTTON STATE
// ============================================================================

/**
 * ButtonState - All possible button states.
 *
 * State priority (highest to lowest):
 * 1. disabled (blocks all interactions)
 * 2. active (mouse down)
 * 3. focus (keyboard focus)
 * 4. hover (mouse over)
 * 5. base (default state)
 */
export type ButtonState = 'base' | 'hover' | 'focus' | 'active' | 'disabled';

/**
 * ButtonSize - Available button sizes.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * ButtonVariant - Theme variants for ButtonWithVariant.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

/**
 * IconPosition - Position of icon relative to label.
 */
export type IconPosition = 'left' | 'right';

// ============================================================================
// TOKEN TYPES
// ============================================================================

/**
 * ButtonTokens - All tokens required for a button.
 *
 * This includes base tokens AND all state variants.
 */
export interface ButtonTokens {
  // Base tokens
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor?: EnrichedToken | null;

  // Hover state
  hoverBackgroundColor?: EnrichedToken;
  hoverTextColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken | null;

  // Focus state
  focusBackgroundColor?: EnrichedToken;
  focusTextColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken | null;
  focusOutlineColor?: EnrichedToken | null;

  // Active state
  activeBackgroundColor?: EnrichedToken;
  activeTextColor?: EnrichedToken;
  activeBorderColor?: EnrichedToken | null;

  // Disabled state
  disabledBackgroundColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken | null;
}

/**
 * ResolvedButtonTokens - Tokens resolved for current state.
 *
 * This is the result of token resolution based on ButtonState.
 */
export interface ResolvedButtonTokens {
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor: EnrichedToken | null;
  outlineColor: EnrichedToken | null;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * SizeConfig - Size configuration for a button size.
 */
export interface SizeConfig {
  height: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  iconSize: number;
  gap: number;
}

/**
 * ButtonSizeConfig - Configuration for all button sizes.
 */
export type ButtonSizeConfig = Record<ButtonSize, SizeConfig>;

// ============================================================================
// STYLE TYPES
// ============================================================================

/**
 * ButtonStyles - Framework-agnostic style object.
 *
 * This uses standard CSS property names that can be converted
 * to framework-specific formats:
 * - React: CSSProperties
 * - Vue: :style binding
 * - Svelte: style directive
 * - Angular: [ngStyle]
 */
export interface ButtonStyles {
  // Layout
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  width: string;
  display: string;
  alignItems: string;
  justifyContent: string;
  gap: number;

  // Typography
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  fontFamily: string;

  // Colors (from tokens)
  backgroundColor: string;
  color: string;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;

  // Focus outline
  outline?: string;
  outlineOffset?: number;

  // Visual polish
  borderRadius: number;
  cursor: string;
  transition: string;
  userSelect: string;
  textDecoration: string;
  whiteSpace: string;
}

// ============================================================================
// ARIA TYPES
// ============================================================================

/**
 * ARIAAttributes - Accessibility attributes.
 *
 * Framework-agnostic ARIA attributes that can be applied
 * to the button element in any framework.
 */
export interface ARIAAttributes {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-disabled'?: boolean;
  'aria-pressed'?: boolean;
  role?: string;
}

// ============================================================================
// STATE TRACKER TYPES
// ============================================================================

/**
 * StateTracker - Tracks button interaction states.
 *
 * This interface defines the state that framework adapters
 * need to track for button interactions.
 */
export interface StateTracker {
  isHovered: boolean;
  isFocused: boolean;
  isActive: boolean;
}

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

/**
 * ButtonEventHandlers - Framework-agnostic event handlers.
 *
 * These are the raw event handler functions that framework
 * adapters will wire up to their respective event systems.
 */
export interface ButtonEventHandlers {
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

/**
 * StateUpdater - Functions to update state.
 *
 * Framework adapters will provide these functions to update
 * their framework-specific state management.
 */
export interface StateUpdater {
  setHovered: (value: boolean) => void;
  setFocused: (value: boolean) => void;
  setActive: (value: boolean) => void;
}

// ============================================================================
// CORE INPUT TYPES
// ============================================================================

/**
 * DetermineStateInput - Input for state determination.
 */
export interface DetermineStateInput {
  disabled: boolean;
  loading: boolean;
  isActive: boolean;
  isFocused: boolean;
  isHovered: boolean;
}

/**
 * ResolveTokensInput - Input for token resolution.
 */
export interface ResolveTokensInput {
  state: ButtonState;
  tokens: ButtonTokens;
}

/**
 * ComputeStylesInput - Input for style computation.
 */
export interface ComputeStylesInput {
  resolvedTokens: ResolvedButtonTokens;
  size: ButtonSize;
  fullWidth: boolean;
  hasIcon: boolean;
  currentState: ButtonState;
  sizeConfig: SizeConfig;
}

/**
 * CreateEventHandlersInput - Input for event handler creation.
 */
export interface CreateEventHandlersInput {
  disabled: boolean;
  loading: boolean;
  onClick?: () => void;
  stateUpdater: StateUpdater;
}

/**
 * GenerateARIAInput - Input for ARIA generation.
 */
export interface GenerateARIAInput {
  label: string;
  disabled: boolean;
  loading: boolean;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

// ============================================================================
// QUALITY WARNING TYPES
// ============================================================================

/**
 * QualityWarning - Quality warning for dev mode.
 */
export interface QualityWarning {
  type: 'low_quality_bg' | 'low_quality_text' | 'wcag_fail';
  message: string;
  details: Record<string, any>;
}

/**
 * QualityCheckInput - Input for quality checks.
 */
export interface QualityCheckInput {
  resolvedTokens: ResolvedButtonTokens;
  showWarnings: boolean;
}

// ============================================================================
// NOTE: All types are exported inline above (export type/interface)
// No need for redundant re-exports which cause TypeScript conflicts
// ============================================================================
