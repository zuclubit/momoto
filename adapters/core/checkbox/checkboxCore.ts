/**
 * @fileoverview CheckboxCore - Framework-Agnostic Checkbox Logic
 *
 * FASE 15: Component Expansion
 *
 * Core checkbox logic extracted following ButtonCore/TextFieldCore pattern.
 * Provides all checkbox behavior in a framework-agnostic way.
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
 * @module momoto-ui/adapters/core/checkbox/checkboxCore
 * @version 1.0.0
 */

import type {
  CheckboxState,
  CheckboxSize,
  CheckboxTokens,
  ResolvedCheckboxTokens,
  CheckboxStyles,
  ARIAAttributes,
  CheckboxEventHandlers,
  DetermineStateInput,
  ResolveTokensInput,
  ComputeStylesInput,
  CreateEventHandlersInput,
  GenerateARIAInput,
  QualityCheckInput,
  QualityWarning,
  SizeConfig,
} from './checkboxCore.types';

import { determineState, resolveTokens } from './tokenResolver';
import { computeStyles, mergeStyles } from './styleComputer';
import { generateARIA, generateClassNames } from './ariaGenerator';
import { SIZE_CONFIG, CLASS_PREFIX } from './constants';

// ============================================================================
// CHECKBOX CORE CLASS
// ============================================================================

/**
 * CheckboxCore - Framework-agnostic checkbox logic.
 *
 * Provides ALL checkbox behavior in a framework-agnostic way:
 * - State determination
 * - Token resolution
 * - Style computation
 * - ARIA generation
 * - Event handler creation
 * - Quality checks
 *
 * Framework adapters simply:
 * 1. Manage framework-specific state (useState, ref, etc.)
 * 2. Call CheckboxCore methods
 * 3. Render checkbox element with results
 *
 * PATTERN: Exact copy of TextFieldCore/ButtonCore adapted for Checkbox
 *
 * CONTRACT: All methods are pure functions with NO side effects.
 * NO framework dependencies. NO perceptual logic.
 */
class CheckboxCore {
  // ──────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Determine current checkbox state based on check state and interaction flags.
   *
   * @param input - State determination input
   * @returns Current checkbox state
   */
  static determineState(input: DetermineStateInput): CheckboxState {
    return determineState(input);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TOKEN RESOLUTION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Resolve tokens for current checkbox state.
   *
   * @param input - Token resolution input
   * @returns Resolved tokens for current state
   */
  static resolveTokens(input: ResolveTokensInput): ResolvedCheckboxTokens {
    return resolveTokens(input);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STYLE COMPUTATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Compute checkbox styles from resolved tokens and configuration.
   *
   * @param input - Style computation input
   * @returns Framework-agnostic checkbox styles
   */
  static computeStyles(input: ComputeStylesInput): CheckboxStyles {
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
    computedStyles: CheckboxStyles,
    userStyles?: Partial<CheckboxStyles>
  ): CheckboxStyles {
    return mergeStyles(computedStyles, userStyles);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA GENERATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Generate ARIA attributes for checkbox accessibility.
   *
   * @param input - ARIA generation input
   * @returns ARIA attributes object
   */
  static generateARIA(input: GenerateARIAInput): ARIAAttributes {
    return generateARIA(input);
  }

  /**
   * Generate CSS class names for checkbox states.
   *
   * @param state - Current checkbox state
   * @param size - Checkbox size
   * @param modifiers - Additional modifiers
   * @returns Space-separated class names
   */
  static generateClassNames(
    state: CheckboxState,
    size: CheckboxSize,
    modifiers?: {
      hasLabel?: boolean;
      customClass?: string;
    }
  ): string {
    const classes = generateClassNames(
      CLASS_PREFIX,
      state,
      size,
      {
        hasLabel: modifiers?.hasLabel,
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
   * Create checkbox event handlers.
   *
   * Framework adapters will wire these up to their event systems.
   *
   * @param input - Event handler creation input
   * @returns Checkbox event handlers
   */
  static createEventHandlers(input: CreateEventHandlersInput): CheckboxEventHandlers {
    const { disabled, onChange, stateUpdater } = input;

    return {
      onChange: (checked: boolean) => {
        if (disabled) {
          return;
        }
        onChange?.(checked);
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
   * Get size configuration for a checkbox size.
   *
   * @param size - Checkbox size
   * @returns Size configuration
   */
  static getSizeConfig(size: CheckboxSize): SizeConfig {
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

    // Check border token quality
    if (resolvedTokens.borderColor.isLowQuality) {
      warnings.push({
        type: 'low_quality_border',
        message: `Low quality border token: ${resolvedTokens.borderColor.name}`,
        details: {
          score: resolvedTokens.borderColor.qualityScore,
          reason: resolvedTokens.borderColor.reason,
          decisionId: resolvedTokens.borderColor.sourceDecisionId,
        },
      });
    }

    // Check check/icon token quality
    if (resolvedTokens.checkColor.isLowQuality) {
      warnings.push({
        type: 'low_quality_check',
        message: `Low quality check token: ${resolvedTokens.checkColor.name}`,
        details: {
          score: resolvedTokens.checkColor.qualityScore,
          reason: resolvedTokens.checkColor.reason,
          decisionId: resolvedTokens.checkColor.sourceDecisionId,
        },
      });
    }

    // Check WCAG contrast (check vs background)
    const accessibility = resolvedTokens.checkColor.accessibility;
    if (accessibility && !accessibility.passesAA) {
      warnings.push({
        type: 'wcag_fail',
        message: 'Check color fails WCAG AA contrast against background',
        details: {
          wcagRatio: accessibility.wcagRatio,
          checkToken: resolvedTokens.checkColor.name,
          bgToken: resolvedTokens.backgroundColor.name,
        },
      });
    }

    return warnings;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMPLETE CHECKBOX LOGIC (ALL-IN-ONE)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Process complete checkbox logic in one call.
   *
   * Convenience method that performs all checkbox logic:
   * 1. Determine state
   * 2. Resolve tokens
   * 3. Compute styles
   * 4. Generate ARIA
   * 5. Generate class names
   * 6. Check quality (dev mode)
   *
   * Framework adapters can use this for simpler integration.
   *
   * @param params - All checkbox parameters
   * @returns Complete checkbox output
   */
  static processCheckbox(params: {
    // Tokens
    tokens: CheckboxTokens;

    // Check state
    isChecked: boolean;
    isIndeterminate: boolean;

    // Interaction state
    disabled: boolean;
    isHovered: boolean;
    isFocused: boolean;

    // Layout
    size: CheckboxSize;

    // Content
    label?: string;

    // ARIA
    required?: boolean;
    invalid?: boolean;
    ariaLabel?: string;
    ariaDescribedby?: string;

    // Styles
    userStyles?: Partial<CheckboxStyles>;

    // Dev mode
    showQualityWarnings?: boolean;
    customClass?: string;
  }) {
    // 1. Determine state
    const currentState = CheckboxCore.determineState({
      isChecked: params.isChecked,
      isIndeterminate: params.isIndeterminate,
      disabled: params.disabled,
      isFocused: params.isFocused,
      isHovered: params.isHovered,
    });

    // 2. Resolve tokens
    const resolvedTokens = CheckboxCore.resolveTokens({
      state: currentState,
      tokens: params.tokens,
    });

    // 3. Get size config
    const sizeConfig = CheckboxCore.getSizeConfig(params.size);

    // 4. Compute styles
    const computedStyles = CheckboxCore.computeStyles({
      resolvedTokens,
      size: params.size,
      currentState,
      sizeConfig,
    });

    const styles = CheckboxCore.mergeStyles(computedStyles, params.userStyles);

    // 5. Generate ARIA
    const ariaAttrs = CheckboxCore.generateARIA({
      isChecked: params.isChecked,
      isIndeterminate: params.isIndeterminate,
      disabled: params.disabled,
      required: params.required ?? false,
      invalid: params.invalid ?? false,
      ariaLabel: params.ariaLabel,
      ariaDescribedby: params.ariaDescribedby,
    });

    // 6. Generate class names
    const classNames = CheckboxCore.generateClassNames(
      currentState,
      params.size,
      {
        hasLabel: !!params.label,
        customClass: params.customClass,
      }
    );

    // 7. Check quality (dev mode)
    const qualityWarnings = CheckboxCore.checkQuality({
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

export default CheckboxCore;

export {
  // Main class
  CheckboxCore,

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
export type * from './checkboxCore.types';

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
 *    - All checkbox logic in ONE place
 *    - Framework adapters are thin wrappers
 *
 * ✅ Full Momoto traceability
 *    - Quality warnings expose decision IDs
 *    - All metadata preserved
 *
 * ✅ Tri-state support
 *    - Unchecked, checked, indeterminate
 *    - Full ARIA compliance for tri-state
 *
 * PATTERN: Exact copy of TextFieldCore/ButtonCore adapted for Checkbox
 * VERIFIED: Follows established ComponentCore pattern from FASE 14/15
 */
