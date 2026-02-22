/**
 * @fileoverview Card Component - Core Logic
 *
 * Framework-agnostic card component core.
 * Handles styling, state, tokens, and behavior.
 *
 * @module adapters/core/card/cardCore
 * @version 1.0.0
 */

import type {
  CardProps,
  CardState,
  CardStyles,
  CardCoreOutput,
  CardTokens,
} from './cardCore.types';
import { CardVariant } from './cardCore.types';
import { computeStyles, getDefaultVariant, validateProps } from './styleComputer';
import { SHADOW_CONFIG, VARIANT_CONFIG } from './constants';
// EnrichedToken is used via CardProps from cardCore.types

// ============================================================================
// CORE CLASS
// ============================================================================

/**
 * Card Core
 *
 * Framework-agnostic card component logic
 */
class CardCore {
  private props: CardProps;
  private state: CardState;

  constructor(props: CardProps) {
    this.props = props;
    this.state = {
      isHovered: false,
      isFocused: false,
      isPressed: false,
      isDisabled: props.disabled || false,
    };

    // Validate props
    const errors = validateProps(props);
    if (errors.length > 0) {
      console.warn('[CardCore] Validation errors:', errors);
    }
  }

  /**
   * Resolve tokens from props
   */
  private resolveTokens(): {
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    shadow: string;
    hoverBackgroundColor?: string;
    hoverBorderColor?: string;
    hoverShadow?: string;
  } {
    const variant = this.props.variant || getDefaultVariant(this.props);
    const variantConfig = VARIANT_CONFIG[variant];

    // Background color
    const backgroundColor = this.props.backgroundColor
      ? this.props.backgroundColor.toCssValue()
      : '#ffffff';

    // Border color
    const borderColor = this.props.borderColor
      ? this.props.borderColor.toCssValue()
      : 'rgba(0, 0, 0, 0.1)';

    // Border width
    const borderWidth = this.props.borderWidth || '1px';

    // Shadow
    const shadow = variantConfig.hasShadow
      ? (this.props.shadowColor || SHADOW_CONFIG[variantConfig.shadowLevel])
      : SHADOW_CONFIG.none;

    // Hover tokens (only for interactive variant)
    let hoverBackgroundColor: string | undefined;
    let hoverBorderColor: string | undefined;
    let hoverShadow: string | undefined;

    if (variantConfig.hasHoverEffect) {
      hoverBackgroundColor = this.props.hoverBackgroundColor?.toCssValue();
      hoverBorderColor = this.props.hoverBorderColor?.toCssValue();
      hoverShadow = variantConfig.hoverShadowLevel
        ? (this.props.hoverShadowColor || SHADOW_CONFIG[variantConfig.hoverShadowLevel])
        : undefined;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      shadow,
      hoverBackgroundColor,
      hoverBorderColor,
      hoverShadow,
    };
  }

  /**
   * Generate ARIA attributes
   */
  private generateARIA(): Record<string, string | boolean | undefined> {
    const { role, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy } = this.props;

    return {
      role: role || (this.props.onClick ? 'button' : undefined),
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-disabled': this.state.isDisabled,
    };
  }

  /**
   * Generate data attributes
   */
  private generateDataAttributes(): Record<string, string> {
    const variant = this.props.variant || getDefaultVariant(this.props);

    return {
      'data-card': 'true',
      'data-variant': variant,
      'data-disabled': String(this.state.isDisabled),
      'data-testid': this.props.testId || 'card',
    };
  }

  /**
   * Generate event handlers
   */
  private generateHandlers() {
    const { onClick, onMouseEnter, onMouseLeave } = this.props;

    return {
      onClick: onClick && !this.state.isDisabled ? onClick : undefined,

      onMouseEnter: (e: React.MouseEvent) => {
        this.state.isHovered = true;
        onMouseEnter?.();
      },

      onMouseLeave: (e: React.MouseEvent) => {
        this.state.isHovered = false;
        onMouseLeave?.();
      },
    };
  }

  /**
   * Compute complete card output
   */
  compute(): CardCoreOutput {
    const tokens = this.resolveTokens();
    const styles = computeStyles(this.props, this.state, tokens);
    const ariaProps = this.generateARIA();
    const dataAttributes = this.generateDataAttributes();
    const handlers = this.generateHandlers();

    return {
      styles,
      ariaProps,
      dataAttributes,
      handlers,
    };
  }

  /**
   * Update state
   */
  setState(newState: Partial<CardState>): void {
    this.state = { ...this.state, ...newState };
  }

  /**
   * Get current state
   */
  getState(): CardState {
    return { ...this.state };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default CardCore;

export {
  CardCore,
};

export type * from './cardCore.types';
