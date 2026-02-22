/**
 * @fileoverview Token Resolver - Button Token Resolution Logic
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Resolves button tokens based on current state.
 * This is the CORE logic extracted from the React Button component.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Token SELECTION based on state (NOT calculation)
 * - ✅ NO color calculations or transformations
 * - ✅ Fallback to base tokens if state tokens not provided
 *
 * @module momoto-ui/adapters/core/button/tokenResolver
 * @version 1.0.0
 */

import type {
  ButtonState,
  ButtonTokens,
  ResolvedButtonTokens,
  DetermineStateInput,
  ResolveTokensInput,
} from './buttonCore.types';

// ============================================================================
// STATE DETERMINATION
// ============================================================================

/**
 * Determine current button state based on interaction flags.
 *
 * State priority (highest to lowest):
 * 1. disabled (blocks all interactions)
 * 2. active (mouse down)
 * 3. focus (keyboard focus)
 * 4. hover (mouse over)
 * 5. base (default state)
 *
 * CONTRACT: This is state SELECTION logic (ALLOWED).
 * NOT perceptual calculation.
 *
 * @param input - State determination input
 * @returns Current button state
 */
export function determineState(input: DetermineStateInput): ButtonState {
  const { disabled, loading, isActive, isFocused, isHovered } = input;

  // Priority 1: Disabled state (blocks all interactions)
  if (disabled || loading) {
    return 'disabled';
  }

  // Priority 2: Active state (mouse down)
  if (isActive) {
    return 'active';
  }

  // Priority 3: Focus state (keyboard focus)
  if (isFocused) {
    return 'focus';
  }

  // Priority 4: Hover state (mouse over)
  if (isHovered) {
    return 'hover';
  }

  // Priority 5: Base state (default)
  return 'base';
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

/**
 * Resolve tokens for current button state.
 *
 * CONTRACT: This is token SELECTION (ALLOWED).
 * - Selects the appropriate token for the current state
 * - Falls back to base token if state token not provided
 * - NO color calculations or transformations
 *
 * @param input - Token resolution input
 * @returns Resolved tokens for current state
 */
export function resolveTokens(input: ResolveTokensInput): ResolvedButtonTokens {
  const { state, tokens } = input;

  switch (state) {
    case 'disabled':
      return {
        backgroundColor: tokens.disabledBackgroundColor || tokens.backgroundColor,
        textColor: tokens.disabledTextColor || tokens.textColor,
        borderColor: tokens.disabledBorderColor || tokens.borderColor || null,
        outlineColor: null,
      };

    case 'active':
      return {
        backgroundColor: tokens.activeBackgroundColor || tokens.backgroundColor,
        textColor: tokens.activeTextColor || tokens.textColor,
        borderColor: tokens.activeBorderColor || tokens.borderColor || null,
        outlineColor: null,
      };

    case 'focus':
      return {
        backgroundColor: tokens.focusBackgroundColor || tokens.backgroundColor,
        textColor: tokens.focusTextColor || tokens.textColor,
        borderColor: tokens.focusBorderColor || tokens.borderColor || null,
        outlineColor: tokens.focusOutlineColor || null,
      };

    case 'hover':
      return {
        backgroundColor: tokens.hoverBackgroundColor || tokens.backgroundColor,
        textColor: tokens.hoverTextColor || tokens.textColor,
        borderColor: tokens.hoverBorderColor || tokens.borderColor || null,
        outlineColor: null,
      };

    case 'base':
    default:
      return {
        backgroundColor: tokens.backgroundColor,
        textColor: tokens.textColor,
        borderColor: tokens.borderColor || null,
        outlineColor: null,
      };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  determineState,
  resolveTokens,
};

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Token SELECTION only (NOT calculation)
 *    - Selects tokens based on state
 *    - Falls back to base tokens
 *    - NO color transformations
 *
 * ✅ State determination is LOGIC (ALLOWED)
 *    - Priority-based state selection
 *    - NOT perceptual decision
 *
 * ✅ Framework-agnostic
 *    - Pure functions with no side effects
 *    - No framework dependencies
 *    - Can be used in React, Vue, Svelte, Angular
 *
 * EXTRACTED FROM:
 * - React Button.tsx lines 160-166 (determineState)
 * - React Button.tsx lines 172-222 (resolveTokens)
 */
