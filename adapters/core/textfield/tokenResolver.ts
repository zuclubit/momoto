/**
 * @fileoverview Token Resolver - TextField Token Resolution Logic
 *
 * FASE 15: Component Expansion
 *
 * Resolves text field tokens based on current state.
 * Follows ButtonCore pattern exactly.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Token SELECTION based on state (NOT calculation)
 * - ✅ NO color calculations or transformations
 * - ✅ Fallback to base tokens if state tokens not provided
 *
 * @module momoto-ui/adapters/core/textfield/tokenResolver
 * @version 1.0.0
 */

import type {
  TextFieldState,
  ResolvedTextFieldTokens,
  DetermineStateInput,
  ResolveTokensInput,
} from './textFieldCore.types';

// ============================================================================
// STATE DETERMINATION
// ============================================================================

/**
 * Determine current text field state based on interaction flags.
 *
 * State priority (highest to lowest):
 * 1. disabled (blocks all interactions)
 * 2. error (validation failed)
 * 3. success (validation passed)
 * 4. focus (keyboard focus - CRITICAL for inputs)
 * 5. hover (mouse over)
 * 6. base (default state)
 *
 * CONTRACT: This is state SELECTION logic (ALLOWED).
 * NOT perceptual calculation.
 *
 * @param input - State determination input
 * @returns Current text field state
 */
export function determineState(input: DetermineStateInput): TextFieldState {
  const { disabled, error, success, isFocused, isHovered } = input;

  // Priority 1: Disabled state
  if (disabled) {
    return 'disabled';
  }

  // Priority 2: Error state
  if (error) {
    return 'error';
  }

  // Priority 3: Success state
  if (success) {
    return 'success';
  }

  // Priority 4: Focus state (CRITICAL for inputs)
  if (isFocused) {
    return 'focus';
  }

  // Priority 5: Hover state
  if (isHovered) {
    return 'hover';
  }

  // Priority 6: Base state
  return 'base';
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

/**
 * Resolve tokens for current text field state.
 *
 * CONTRACT: This is token SELECTION (ALLOWED).
 * - Selects the appropriate token for the current state
 * - Falls back to base token if state token not provided
 * - NO color calculations or transformations
 *
 * @param input - Token resolution input
 * @returns Resolved tokens for current state
 */
export function resolveTokens(input: ResolveTokensInput): ResolvedTextFieldTokens {
  const { state, tokens } = input;

  switch (state) {
    case 'disabled':
      return {
        backgroundColor: tokens.disabledBackgroundColor || tokens.backgroundColor,
        textColor: tokens.disabledTextColor || tokens.textColor,
        placeholderColor: tokens.disabledTextColor || tokens.placeholderColor || null,
        borderColor: tokens.disabledBorderColor || tokens.borderColor || null,
        labelColor: tokens.disabledLabelColor || tokens.labelColor || null,
        helperTextColor: tokens.disabledTextColor || tokens.helperTextColor || null,
      };

    case 'error':
      return {
        backgroundColor: tokens.errorBackgroundColor || tokens.backgroundColor,
        textColor: tokens.errorTextColor || tokens.textColor,
        placeholderColor: tokens.placeholderColor || null,
        borderColor: tokens.errorBorderColor || tokens.borderColor || null,
        labelColor: tokens.errorLabelColor || tokens.labelColor || null,
        helperTextColor: tokens.errorHelperTextColor || tokens.helperTextColor || null,
      };

    case 'success':
      return {
        backgroundColor: tokens.successBackgroundColor || tokens.backgroundColor,
        textColor: tokens.successTextColor || tokens.textColor,
        placeholderColor: tokens.placeholderColor || null,
        borderColor: tokens.successBorderColor || tokens.borderColor || null,
        labelColor: tokens.successLabelColor || tokens.labelColor || null,
        helperTextColor: tokens.successHelperTextColor || tokens.helperTextColor || null,
      };

    case 'focus':
      return {
        backgroundColor: tokens.focusBackgroundColor || tokens.backgroundColor,
        textColor: tokens.textColor,
        placeholderColor: tokens.placeholderColor || null,
        borderColor: tokens.focusBorderColor || tokens.borderColor || null,
        labelColor: tokens.labelColor || null,
        helperTextColor: tokens.helperTextColor || null,
      };

    case 'hover':
      return {
        backgroundColor: tokens.hoverBackgroundColor || tokens.backgroundColor,
        textColor: tokens.textColor,
        placeholderColor: tokens.placeholderColor || null,
        borderColor: tokens.hoverBorderColor || tokens.borderColor || null,
        labelColor: tokens.labelColor || null,
        helperTextColor: tokens.helperTextColor || null,
      };

    case 'base':
    default:
      return {
        backgroundColor: tokens.backgroundColor,
        textColor: tokens.textColor,
        placeholderColor: tokens.placeholderColor || null,
        borderColor: tokens.borderColor || null,
        labelColor: tokens.labelColor || null,
        helperTextColor: tokens.helperTextColor || null,
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
 *
 * PATTERN: Exact copy of button/tokenResolver.ts adapted for TextField
 * EXTRACTED FROM: ButtonCore pattern (FASE 13/14)
 */
