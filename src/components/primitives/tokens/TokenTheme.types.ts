/**
 * @fileoverview Token Theme Types - Component Token Contracts
 *
 * FASE 11: UI Primitives & Component Kit
 *
 * Defines the contract for component tokens. ALL components consume
 * tokens from this theme structure, ensuring:
 * - 100% Momoto-governed decisions
 * - 0% component-level heuristics
 * - Full traceability and explainability
 *
 * @module momoto-ui/components/primitives/tokens/TokenTheme
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// TOKEN THEME STRUCTURE
// ============================================================================

/**
 * Complete token theme for component system.
 *
 * This interface defines ALL tokens that components can consume.
 * Every token is an EnrichedToken with full Momoto metadata.
 *
 * CONTRACT RULES:
 * - Components MUST only use tokens from this theme
 * - Components MUST NOT calculate colors
 * - Components MUST NOT hardcode values
 * - ALL visual decisions come from tokens
 */
export interface TokenTheme {
  /** Primitive color tokens (base palette) */
  colors: {
    primary: EnrichedToken;
    secondary: EnrichedToken;
    accent: EnrichedToken;
    success: EnrichedToken;
    warning: EnrichedToken;
    error: EnrichedToken;
    info: EnrichedToken;

    background: {
      primary: EnrichedToken;
      secondary: EnrichedToken;
      tertiary: EnrichedToken;
    };

    surface: {
      primary: EnrichedToken;
      secondary: EnrichedToken;
      elevated: EnrichedToken;
    };

    border: {
      primary: EnrichedToken;
      secondary: EnrichedToken;
      focus: EnrichedToken;
    };

    text: {
      primary: EnrichedToken;
      secondary: EnrichedToken;
      tertiary: EnrichedToken;
      disabled: EnrichedToken;
      inverse: EnrichedToken;
    };
  };

  /** Semantic tokens for Button component */
  button: {
    primary: ButtonTokenSet;
    secondary: ButtonTokenSet;
    tertiary: ButtonTokenSet;
    danger: ButtonTokenSet;
  };

  /** Semantic tokens for TextField component */
  textField: {
    default: TextFieldTokenSet;
    error: TextFieldTokenSet;
  };

  /** Semantic tokens for Select component */
  select: {
    default: SelectTokenSet;
  };

  /** Semantic tokens for Checkbox component */
  checkbox: {
    default: CheckboxTokenSet;
  };

  /** Semantic tokens for Switch component */
  switch: {
    default: SwitchTokenSet;
  };

  /** Semantic tokens for Badge component */
  badge: {
    default: BadgeTokenSet;
    success: BadgeTokenSet;
    warning: BadgeTokenSet;
    error: BadgeTokenSet;
    info: BadgeTokenSet;
  };

  /** Semantic tokens for Alert component */
  alert: {
    info: AlertTokenSet;
    success: AlertTokenSet;
    warning: AlertTokenSet;
    error: AlertTokenSet;
  };

  /** Semantic tokens for Card component */
  card: {
    default: CardTokenSet;
    elevated: CardTokenSet;
  };

  /** Semantic tokens for Tooltip component */
  tooltip: {
    default: TooltipTokenSet;
  };
}

// ============================================================================
// COMPONENT TOKEN SETS
// ============================================================================

/**
 * Token set for Button component.
 *
 * Includes ALL visual states (base, hover, focus, active, disabled).
 * Components MUST use these tokens, NOT calculate states.
 */
export interface ButtonTokenSet {
  /** Base state */
  background: EnrichedToken;
  text: EnrichedToken;
  border: EnrichedToken;

  /** Hover state */
  hover: {
    background: EnrichedToken;
    text: EnrichedToken;
    border: EnrichedToken;
  };

  /** Focus state */
  focus: {
    background: EnrichedToken;
    text: EnrichedToken;
    border: EnrichedToken;
    outline: EnrichedToken;
  };

  /** Active/pressed state */
  active: {
    background: EnrichedToken;
    text: EnrichedToken;
    border: EnrichedToken;
  };

  /** Disabled state */
  disabled: {
    background: EnrichedToken;
    text: EnrichedToken;
    border: EnrichedToken;
  };
}

/**
 * Token set for TextField component.
 */
export interface TextFieldTokenSet {
  background: EnrichedToken;
  text: EnrichedToken;
  border: EnrichedToken;
  label: EnrichedToken;
  placeholder: EnrichedToken;

  focus: {
    border: EnrichedToken;
    outline: EnrichedToken;
  };

  disabled: {
    background: EnrichedToken;
    text: EnrichedToken;
    border: EnrichedToken;
  };
}

/**
 * Token set for Select component.
 */
export interface SelectTokenSet {
  trigger: {
    background: EnrichedToken;
    text: EnrichedToken;
    border: EnrichedToken;
  };

  triggerHover: {
    background: EnrichedToken;
    text: EnrichedToken;
    border: EnrichedToken;
  };

  triggerFocus: {
    border: EnrichedToken;
    outline: EnrichedToken;
  };

  dropdown: {
    background: EnrichedToken;
    border: EnrichedToken;
  };

  option: {
    background: EnrichedToken;
    text: EnrichedToken;
  };

  optionHover: {
    background: EnrichedToken;
    text: EnrichedToken;
  };

  optionSelected: {
    background: EnrichedToken;
    text: EnrichedToken;
  };
}

/**
 * Token set for Checkbox component.
 */
export interface CheckboxTokenSet {
  box: {
    background: EnrichedToken;
    border: EnrichedToken;
  };

  boxHover: {
    background: EnrichedToken;
    border: EnrichedToken;
  };

  boxChecked: {
    background: EnrichedToken;
    border: EnrichedToken;
  };

  checkmark: EnrichedToken;
  label: EnrichedToken;

  disabled: {
    background: EnrichedToken;
    border: EnrichedToken;
    checkmark: EnrichedToken;
    label: EnrichedToken;
  };
}

/**
 * Token set for Switch component.
 */
export interface SwitchTokenSet {
  track: {
    background: EnrichedToken;
  };

  trackChecked: {
    background: EnrichedToken;
  };

  thumb: EnrichedToken;
  label: EnrichedToken;

  disabled: {
    track: EnrichedToken;
    thumb: EnrichedToken;
    label: EnrichedToken;
  };
}

/**
 * Token set for Badge component.
 */
export interface BadgeTokenSet {
  background: EnrichedToken;
  text: EnrichedToken;
  border: EnrichedToken;
}

/**
 * Token set for Alert component.
 */
export interface AlertTokenSet {
  background: EnrichedToken;
  text: EnrichedToken;
  border: EnrichedToken;
  icon: EnrichedToken;
}

/**
 * Token set for Card component.
 */
export interface CardTokenSet {
  background: EnrichedToken;
  text: EnrichedToken;
  border: EnrichedToken;
}

/**
 * Token set for Tooltip component.
 */
export interface TooltipTokenSet {
  background: EnrichedToken;
  text: EnrichedToken;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Deeply partial token theme for customization.
 *
 * Allows partial overrides of theme tokens while maintaining type safety.
 */
export type PartialTokenTheme = {
  [K in keyof TokenTheme]?: Partial<TokenTheme[K]>;
};

/**
 * Token path for accessing nested tokens.
 *
 * Examples:
 * - 'colors.primary'
 * - 'button.primary.background'
 * - 'button.primary.hover.background'
 */
export type TokenPath = string;

// ============================================================================
// EXPORTS
// ============================================================================

export default TokenTheme;

/**
 * USAGE NOTES:
 *
 * 1. Theme Structure:
 *    - `colors.*` - Primitive tokens (base palette)
 *    - `button.*`, `textField.*`, etc. - Semantic component tokens
 *    - Each component has all states (hover, focus, disabled)
 *
 * 2. Component Contract:
 *    ```typescript
 *    function Button({ variant }: ButtonProps) {
 *      const theme = useTokenTheme();
 *      const tokens = theme.button[variant];
 *
 *      return (
 *        <button style={{
 *          backgroundColor: tokens.background.value.hex,
 *          color: tokens.text.value.hex,
 *        }}>
 *          {children}
 *        </button>
 *      );
 *    }
 *    ```
 *
 * 3. No Calculations:
 *    Components MUST NOT:
 *    - ❌ Calculate hover color from base color
 *    - ❌ Lighten/darken colors for states
 *    - ❌ Compute contrast ratios
 *    - ❌ Make any perceptual decisions
 *
 * 4. All States from Tokens:
 *    Every interactive state (hover, focus, active, disabled) has
 *    dedicated tokens. Components simply SELECT the right token
 *    based on current state.
 *
 * 5. Traceability:
 *    Every token includes Momoto metadata:
 *    - qualityScore
 *    - confidence
 *    - reason
 *    - sourceDecisionId
 *    - accessibility metrics
 */
