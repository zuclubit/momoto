/**
 * @fileoverview ButtonCore - Framework-Agnostic Button Logic
 *
 * FASE 13: Multi-Framework Adapters
 *
 * This is the CORE button logic extracted from the React Button component.
 * It provides all button behavior in a framework-agnostic way.
 *
 * Framework adapters (React, Vue, Svelte, Angular) are thin wrappers
 * that delegate to this core logic.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven (NO color calculations)
 * - ✅ State management via token SELECTION (NOT computation)
 * - ✅ NO perceptual logic
 * - ✅ Framework-agnostic pure functions
 *
 * @module momoto-ui/adapters/core/button/buttonCore
 * @version 1.0.0
 */

import type {
  ButtonState,
  ButtonSize,
  ButtonTokens,
  ResolvedButtonTokens,
  ButtonStyles,
  ARIAAttributes,
  ButtonEventHandlers,
  StateUpdater,
  DetermineStateInput,
  ResolveTokensInput,
  ComputeStylesInput,
  CreateEventHandlersInput,
  GenerateARIAInput,
  QualityCheckInput,
  QualityWarning,
  SizeConfig,
} from './buttonCore.types';

import { determineState, resolveTokens } from './tokenResolver';
import { computeStyles, mergeStyles } from './styleComputer';
import { generateARIA, generateClassNames } from './ariaGenerator';
import { SIZE_CONFIG, CLASS_PREFIX } from './constants';

// ============================================================================
// BUTTON CORE CLASS
// ============================================================================

/**
 * ButtonCore - Framework-agnostic button logic.
 *
 * This class provides ALL button behavior in a framework-agnostic way:
 * - State determination
 * - Token resolution
 * - Style computation
 * - ARIA generation
 * - Event handler creation
 * - Quality checks
 *
 * Framework adapters simply:
 * 1. Manage framework-specific state (useState, ref, etc.)
 * 2. Call ButtonCore methods
 * 3. Render button element with results
 *
 * ARCHITECTURE:
 * ```
 * ┌─────────────────────────────────────┐
 * │   Framework Adapter (React/Vue/etc) │
 * │   - State management                │
 * │   - Rendering                       │
 * └─────────────┬───────────────────────┘
 *               │
 *               │ delegates to
 *               ▼
 * ┌─────────────────────────────────────┐
 * │   ButtonCore (framework-agnostic)   │
 * │   - State determination             │
 * │   - Token resolution                │
 * │   - Style computation               │
 * │   - ARIA generation                 │
 * │   - Event handlers                  │
 * └─────────────────────────────────────┘
 * ```
 *
 * CONTRACT: All methods are pure functions with NO side effects.
 * NO framework dependencies. NO perceptual logic.
 */
class ButtonCore {
  // ──────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Determine current button state based on interaction flags.
   *
   * @param input - State determination input
   * @returns Current button state
   */
  static determineState(input: DetermineStateInput): ButtonState {
    return determineState(input);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TOKEN RESOLUTION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Resolve tokens for current button state.
   *
   * @param input - Token resolution input
   * @returns Resolved tokens for current state
   */
  static resolveTokens(input: ResolveTokensInput): ResolvedButtonTokens {
    return resolveTokens(input);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STYLE COMPUTATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Compute button styles from resolved tokens and configuration.
   *
   * @param input - Style computation input
   * @returns Framework-agnostic button styles
   */
  static computeStyles(input: ComputeStylesInput): ButtonStyles {
    return computeStyles(input);
  }

  /**
   * Merge user-provided styles with computed styles.
   *
   * @param computedStyles - Styles computed by computeStyles()
   * @param userStyles - User-provided styles (optional)
   * @returns Merged styles
   */
  static mergeStyles(
    computedStyles: ButtonStyles,
    userStyles?: Partial<ButtonStyles>
  ): ButtonStyles {
    return mergeStyles(computedStyles, userStyles);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA GENERATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Generate ARIA attributes for button accessibility.
   *
   * @param input - ARIA generation input
   * @returns ARIA attributes object
   */
  static generateARIA(input: GenerateARIAInput): ARIAAttributes {
    return generateARIA(input);
  }

  /**
   * Generate CSS class names for button states.
   *
   * @param state - Current button state
   * @param size - Button size
   * @param modifiers - Additional modifiers
   * @returns Space-separated class names
   */
  static generateClassNames(
    state: ButtonState,
    size: ButtonSize,
    modifiers?: {
      fullWidth?: boolean;
      hasIcon?: boolean;
      loading?: boolean;
      customClass?: string;
    }
  ): string {
    const classes = generateClassNames(
      CLASS_PREFIX,
      state,
      size,
      {
        fullWidth: modifiers?.fullWidth,
        hasIcon: modifiers?.hasIcon,
        loading: modifiers?.loading,
      }
    );

    // Append custom class if provided
    if (modifiers?.customClass) {
      return `${classes} ${modifiers.customClass}`;
    }

    return classes;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Create button event handlers.
   *
   * This generates framework-agnostic event handler functions.
   * Framework adapters will wire these up to their event systems.
   *
   * @param input - Event handler creation input
   * @returns Button event handlers
   */
  static createEventHandlers(input: CreateEventHandlersInput): ButtonEventHandlers {
    const { disabled, loading, onClick, stateUpdater } = input;

    return {
      onClick: () => {
        if (disabled || loading) {
          return;
        }
        onClick?.();
      },

      onMouseEnter: () => {
        if (disabled || loading) {
          return;
        }
        stateUpdater.setHovered(true);
      },

      onMouseLeave: () => {
        stateUpdater.setHovered(false);
        stateUpdater.setActive(false);
      },

      onFocus: () => {
        if (disabled || loading) {
          return;
        }
        stateUpdater.setFocused(true);
      },

      onBlur: () => {
        stateUpdater.setFocused(false);
      },

      onMouseDown: () => {
        if (disabled || loading) {
          return;
        }
        stateUpdater.setActive(true);
      },

      onMouseUp: () => {
        stateUpdater.setActive(false);
      },
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get size configuration for a button size.
   *
   * @param size - Button size
   * @returns Size configuration
   */
  static getSizeConfig(size: ButtonSize): SizeConfig {
    return SIZE_CONFIG[size];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY CHECKS (DEV MODE)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Check token quality and generate warnings.
   *
   * This is for DEV MODE only. It checks:
   * - Low quality tokens
   * - Low confidence tokens
   * - WCAG contrast failures
   *
   * Framework adapters should call this in development mode
   * and log warnings to console.
   *
   * @param input - Quality check input
   * @returns Array of quality warnings (empty if no issues)
   */
  static checkQuality(input: QualityCheckInput): QualityWarning[] {
    const { resolvedTokens, showWarnings } = input;

    if (!showWarnings) {
      return [];
    }

    const warnings: QualityWarning[] = [];

    // Check background token quality
    if (resolvedTokens.backgroundColor.isLowQuality) {
      warnings.push({
        type: 'low_quality_bg',
        message: `Low quality background token: ${resolvedTokens.backgroundColor.name}`,
        details: {
          score: resolvedTokens.backgroundColor.qualityScore,
          reason: resolvedTokens.backgroundColor.reason,
          decisionId: resolvedTokens.backgroundColor.sourceDecisionId,
        },
      });
    }

    // Check text token quality
    if (resolvedTokens.textColor.isLowQuality) {
      warnings.push({
        type: 'low_quality_text',
        message: `Low quality text token: ${resolvedTokens.textColor.name}`,
        details: {
          score: resolvedTokens.textColor.qualityScore,
          reason: resolvedTokens.textColor.reason,
          decisionId: resolvedTokens.textColor.sourceDecisionId,
        },
      });
    }

    // Check WCAG contrast
    const accessibility = resolvedTokens.textColor.accessibility;
    if (accessibility && !accessibility.passesAA) {
      warnings.push({
        type: 'wcag_fail',
        message: 'Text color fails WCAG AA contrast',
        details: {
          wcagRatio: accessibility.wcagRatio,
          textToken: resolvedTokens.textColor.name,
          bgToken: resolvedTokens.backgroundColor.name,
        },
      });
    }

    return warnings;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMPLETE BUTTON LOGIC (ALL-IN-ONE)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Process complete button logic in one call.
   *
   * This is a convenience method that performs all button logic:
   * 1. Determine state
   * 2. Resolve tokens
   * 3. Compute styles
   * 4. Generate ARIA
   * 5. Generate class names
   * 6. Check quality (dev mode)
   *
   * Framework adapters can use this for simpler integration.
   *
   * @param params - All button parameters
   * @returns Complete button output
   */
  static processButton(params: {
    // Tokens
    tokens: ButtonTokens;

    // Interaction state
    disabled: boolean;
    loading: boolean;
    isHovered: boolean;
    isFocused: boolean;
    isActive: boolean;

    // Layout
    size: ButtonSize;
    fullWidth: boolean;
    hasIcon: boolean;

    // Content
    label: string;

    // ARIA
    ariaLabel?: string;
    ariaDescribedby?: string;

    // Styles
    userStyles?: Partial<ButtonStyles>;

    // Dev mode
    showQualityWarnings?: boolean;
    customClass?: string;
  }) {
    // 1. Determine state
    const currentState = ButtonCore.determineState({
      disabled: params.disabled,
      loading: params.loading,
      isActive: params.isActive,
      isFocused: params.isFocused,
      isHovered: params.isHovered,
    });

    // 2. Resolve tokens
    const resolvedTokens = ButtonCore.resolveTokens({
      state: currentState,
      tokens: params.tokens,
    });

    // 3. Get size config
    const sizeConfig = ButtonCore.getSizeConfig(params.size);

    // 4. Compute styles
    const computedStyles = ButtonCore.computeStyles({
      resolvedTokens,
      size: params.size,
      fullWidth: params.fullWidth,
      hasIcon: params.hasIcon,
      currentState,
      sizeConfig,
    });

    const styles = ButtonCore.mergeStyles(computedStyles, params.userStyles);

    // 5. Generate ARIA
    const ariaAttrs = ButtonCore.generateARIA({
      label: params.label,
      disabled: params.disabled,
      loading: params.loading,
      ariaLabel: params.ariaLabel,
      ariaDescribedby: params.ariaDescribedby,
    });

    // 6. Generate class names
    const classNames = ButtonCore.generateClassNames(
      currentState,
      params.size,
      {
        fullWidth: params.fullWidth,
        hasIcon: params.hasIcon,
        loading: params.loading,
        customClass: params.customClass,
      }
    );

    // 7. Check quality (dev mode)
    const qualityWarnings = ButtonCore.checkQuality({
      resolvedTokens,
      showWarnings: params.showQualityWarnings ?? false,
    });

    return {
      currentState,
      resolvedTokens,
      styles,
      ariaAttrs,
      classNames,
      qualityWarnings,
      sizeConfig,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ButtonCore;

export {
  // Main class
  ButtonCore,

  // Individual modules (for fine-grained control)
  determineState,
  resolveTokens,
  computeStyles,
  mergeStyles,
  generateARIA,
  generateClassNames,

  // Constants
  SIZE_CONFIG,
  CLASS_PREFIX,
};

// Re-export types
export type * from './buttonCore.types';

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ 100% token-driven
 *    - ALL colors from EnrichedToken
 *    - NO color calculations
 *    - NO perceptual decisions
 *
 * ✅ State management via token SELECTION
 *    - Selects tokens based on state
 *    - Does NOT compute state tokens
 *
 * ✅ Framework-agnostic
 *    - Pure functions with NO side effects
 *    - NO framework dependencies
 *    - Can be used in React, Vue, Svelte, Angular
 *
 * ✅ Zero logic duplication
 *    - All button logic in ONE place
 *    - Framework adapters are thin wrappers
 *
 * ✅ Full Momoto traceability
 *    - Quality warnings expose decision IDs
 *    - All metadata preserved
 *
 * EXTRACTED FROM:
 * - React Button.tsx (all core logic)
 * - Now usable in ANY framework
 */
