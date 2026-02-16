/**
 * @fileoverview TextFieldCore - Framework-Agnostic TextField Logic
 *
 * FASE 15: Component Expansion
 *
 * Core text field logic extracted following ButtonCore pattern.
 * Provides all text field behavior in a framework-agnostic way.
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
 * @module momoto-ui/adapters/core/textfield/textFieldCore
 * @version 1.0.0
 */

import type {
  TextFieldState,
  TextFieldSize,
  TextFieldTokens,
  ResolvedTextFieldTokens,
  TextFieldStyles,
  ARIAAttributes,
  TextFieldEventHandlers,
  DetermineStateInput,
  ResolveTokensInput,
  ComputeStylesInput,
  CreateEventHandlersInput,
  GenerateARIAInput,
  QualityCheckInput,
  QualityWarning,
  SizeConfig,
} from './textFieldCore.types';

import { determineState, resolveTokens } from './tokenResolver';
import { computeStyles, mergeStyles } from './styleComputer';
import { generateARIA, generateClassNames } from './ariaGenerator';
import { SIZE_CONFIG, CLASS_PREFIX } from './constants';

// ============================================================================
// TEXTFIELD CORE CLASS
// ============================================================================

/**
 * TextFieldCore - Framework-agnostic text field logic.
 *
 * Provides ALL text field behavior in a framework-agnostic way:
 * - State determination
 * - Token resolution
 * - Style computation
 * - ARIA generation
 * - Event handler creation
 * - Quality checks
 *
 * Framework adapters simply:
 * 1. Manage framework-specific state (useState, ref, etc.)
 * 2. Call TextFieldCore methods
 * 3. Render text field element with results
 *
 * PATTERN: Exact copy of ButtonCore adapted for TextField
 *
 * CONTRACT: All methods are pure functions with NO side effects.
 * NO framework dependencies. NO perceptual logic.
 */
class TextFieldCore {
  // ──────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Determine current text field state based on interaction flags.
   *
   * @param input - State determination input
   * @returns Current text field state
   */
  static determineState(input: DetermineStateInput): TextFieldState {
    return determineState(input);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TOKEN RESOLUTION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Resolve tokens for current text field state.
   *
   * @param input - Token resolution input
   * @returns Resolved tokens for current state
   */
  static resolveTokens(input: ResolveTokensInput): ResolvedTextFieldTokens {
    return resolveTokens(input);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STYLE COMPUTATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Compute text field styles from resolved tokens and configuration.
   *
   * @param input - Style computation input
   * @returns Framework-agnostic text field styles
   */
  static computeStyles(input: ComputeStylesInput): TextFieldStyles {
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
    computedStyles: TextFieldStyles,
    userStyles?: Partial<TextFieldStyles>
  ): TextFieldStyles {
    return mergeStyles(computedStyles, userStyles);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA GENERATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Generate ARIA attributes for text field accessibility.
   *
   * @param input - ARIA generation input
   * @returns ARIA attributes object
   */
  static generateARIA(input: GenerateARIAInput): ARIAAttributes {
    return generateARIA(input);
  }

  /**
   * Generate CSS class names for text field states.
   *
   * @param state - Current text field state
   * @param size - Text field size
   * @param modifiers - Additional modifiers
   * @returns Space-separated class names
   */
  static generateClassNames(
    state: TextFieldState,
    size: TextFieldSize,
    modifiers?: {
      fullWidth?: boolean;
      multiline?: boolean;
      hasLabel?: boolean;
      hasHelper?: boolean;
      customClass?: string;
    }
  ): string {
    const classes = generateClassNames(
      CLASS_PREFIX,
      state,
      size,
      {
        fullWidth: modifiers?.fullWidth,
        multiline: modifiers?.multiline,
        hasLabel: modifiers?.hasLabel,
        hasHelper: modifiers?.hasHelper,
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
   * Create text field event handlers.
   *
   * Framework adapters will wire these up to their event systems.
   *
   * @param input - Event handler creation input
   * @returns Text field event handlers
   */
  static createEventHandlers(input: CreateEventHandlersInput): TextFieldEventHandlers {
    const { disabled, onChange, stateUpdater } = input;

    return {
      onChange: (value: string) => {
        if (disabled) {
          return;
        }
        onChange?.(value);
      },

      onFocus: () => {
        if (disabled) {
          return;
        }
        stateUpdater.setFocused(true);
      },

      onBlur: () => {
        stateUpdater.setFocused(false);
      },

      onMouseEnter: () => {
        if (disabled) {
          return;
        }
        stateUpdater.setHovered(true);
      },

      onMouseLeave: () => {
        stateUpdater.setHovered(false);
      },
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Get size configuration for a text field size.
   *
   * @param size - Text field size
   * @returns Size configuration
   */
  static getSizeConfig(size: TextFieldSize): SizeConfig {
    return SIZE_CONFIG[size];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY CHECKS (DEV MODE)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Check token quality and generate warnings.
   *
   * DEV MODE only - checks for quality/accessibility issues.
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
  // COMPLETE TEXTFIELD LOGIC (ALL-IN-ONE)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Process complete text field logic in one call.
   *
   * Convenience method that performs all text field logic:
   * 1. Determine state
   * 2. Resolve tokens
   * 3. Compute styles
   * 4. Generate ARIA
   * 5. Generate class names
   * 6. Check quality (dev mode)
   *
   * Framework adapters can use this for simpler integration.
   *
   * @param params - All text field parameters
   * @returns Complete text field output
   */
  static processTextField(params: {
    // Tokens
    tokens: TextFieldTokens;

    // Interaction state
    disabled: boolean;
    error: boolean;
    success: boolean;
    isHovered: boolean;
    isFocused: boolean;

    // Layout
    size: TextFieldSize;
    fullWidth: boolean;
    multiline: boolean;

    // Content
    label?: string;
    helperText?: string;

    // ARIA
    required?: boolean;
    ariaLabel?: string;
    ariaDescribedby?: string;

    // Styles
    userStyles?: Partial<TextFieldStyles>;

    // Dev mode
    showQualityWarnings?: boolean;
    customClass?: string;
  }) {
    // 1. Determine state
    const currentState = TextFieldCore.determineState({
      disabled: params.disabled,
      error: params.error,
      success: params.success,
      isFocused: params.isFocused,
      isHovered: params.isHovered,
    });

    // 2. Resolve tokens
    const resolvedTokens = TextFieldCore.resolveTokens({
      state: currentState,
      tokens: params.tokens,
    });

    // 3. Get size config
    const sizeConfig = TextFieldCore.getSizeConfig(params.size);

    // 4. Compute styles
    const computedStyles = TextFieldCore.computeStyles({
      resolvedTokens,
      size: params.size,
      fullWidth: params.fullWidth,
      multiline: params.multiline,
      currentState,
      sizeConfig,
    });

    const styles = TextFieldCore.mergeStyles(computedStyles, params.userStyles);

    // 5. Generate ARIA
    const ariaAttrs = TextFieldCore.generateARIA({
      label: params.label,
      disabled: params.disabled,
      error: params.error,
      required: params.required ?? false,
      ariaLabel: params.ariaLabel,
      ariaDescribedby: params.ariaDescribedby,
    });

    // 6. Generate class names
    const classNames = TextFieldCore.generateClassNames(
      currentState,
      params.size,
      {
        fullWidth: params.fullWidth,
        multiline: params.multiline,
        hasLabel: !!params.label,
        hasHelper: !!params.helperText,
        customClass: params.customClass,
      }
    );

    // 7. Check quality (dev mode)
    const qualityWarnings = TextFieldCore.checkQuality({
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

export default TextFieldCore;

export {
  // Main class
  TextFieldCore,

  // Individual modules
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
export type * from './textFieldCore.types';

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
 *    - All text field logic in ONE place
 *    - Framework adapters are thin wrappers
 *
 * ✅ Full Momoto traceability
 *    - Quality warnings expose decision IDs
 *    - All metadata preserved
 *
 * PATTERN: Exact copy of ButtonCore adapted for TextField
 * VERIFIED: Follows established ComponentCore pattern from FASE 14
 */
