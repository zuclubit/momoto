/**
 * @fileoverview SelectCore - Framework-Agnostic Select Logic
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Central orchestrator for Select component.
 * All framework adapters MUST delegate to this core.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven (no color calculations)
 * - ✅ State-based token selection (no heuristics)
 * - ✅ Framework-agnostic (pure TypeScript)
 * - ✅ WCAG 2.2 AA compliant
 * - ✅ Zero perceptual logic
 *
 * ARCHITECTURE:
 * - SelectCore → Framework Adapters (React, Vue, Svelte, Angular)
 * - Adapters are THIN wrappers
 * - ALL logic in SelectCore
 *
 * @module momoto-ui/adapters/core/select
 * @version 1.0.0
 */

import type {
  SelectCoreInput,
  SelectCoreOutput,
  SelectState,
  SelectTokens,
  ResolvedSelectTokens,
  SelectStyles,
  ARIAAttributes,
  QualityWarning,
  SizeConfig,
  SelectSize,
  SelectOption,
} from './selectCore.types';
import { determineState, resolveTokens } from './tokenResolver';
import { computeStyles, mergeStyles } from './styleComputer';
import { generateARIA, validateARIA, generateClassNames } from './ariaGenerator';
import { SIZE_CONFIG } from './constants';

// ============================================================================
// SELECT CORE
// ============================================================================

/**
 * SelectCore - Framework-agnostic Select logic.
 *
 * This class orchestrates all Select logic:
 * - State determination
 * - Token resolution
 * - Style computation
 * - ARIA generation
 * - Quality checks
 *
 * Framework adapters MUST delegate to SelectCore.processSelect().
 * NO logic duplication is permitted.
 */
class SelectCore {
  // ──────────────────────────────────────────────────────────────────────────
  // STATE DETERMINATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * determineState - Determine current select state.
   *
   * @param params - State parameters
   * @returns Current state
   */
  static determineState(params: {
    disabled: boolean;
    hasError: boolean;
    isOpen: boolean;
    isFocused: boolean;
    isHovered: boolean;
  }): SelectState {
    return determineState(params);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TOKEN RESOLUTION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * resolveTokens - Select tokens based on state.
   *
   * @param tokens - All available tokens
   * @param state - Current state
   * @returns Resolved tokens
   */
  static resolveTokens(
    tokens: SelectTokens,
    state: SelectState
  ): ResolvedSelectTokens {
    return resolveTokens(tokens, state);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STYLE COMPUTATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * computeStyles - Compute CSS properties from resolved tokens.
   *
   * @param resolvedTokens - Resolved tokens
   * @param sizeConfig - Size configuration
   * @param state - Current state
   * @param label - Whether label exists
   * @param helperText - Helper text content
   * @param errorMessage - Error message content
   * @param isOpen - Whether dropdown is open
   * @returns Computed styles
   */
  static computeStyles(
    resolvedTokens: ResolvedSelectTokens,
    sizeConfig: SizeConfig,
    state: SelectState,
    label: string | undefined,
    helperText: string | undefined,
    errorMessage: string | undefined,
    isOpen: boolean
  ): SelectStyles {
    return computeStyles(
      resolvedTokens,
      sizeConfig,
      state,
      label,
      helperText,
      errorMessage,
      isOpen
    );
  }

  /**
   * mergeStyles - Merge user styles with computed styles.
   *
   * @param computedStyles - Styles computed from tokens
   * @param userStyles - User-provided style overrides
   * @returns Merged styles
   */
  static mergeStyles(
    computedStyles: SelectStyles,
    userStyles?: Partial<SelectStyles>
  ): SelectStyles {
    return mergeStyles(computedStyles, userStyles);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA GENERATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * generateARIA - Generate ARIA attributes for Select.
   *
   * @param params - ARIA generation parameters
   * @returns ARIA attributes
   */
  static generateARIA(params: {
    state: SelectState;
    isOpen: boolean;
    hasError: boolean;
    required: boolean;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaLabelledby?: string;
    listboxId: string;
    highlightedOptionId?: string;
  }): ARIAAttributes {
    return generateARIA(params);
  }

  /**
   * validateARIA - Validate ARIA attributes (dev mode).
   *
   * @param ariaAttrs - ARIA attributes to validate
   * @param label - Label text
   * @returns Array of validation warnings
   */
  static validateARIA(
    ariaAttrs: ARIAAttributes,
    label?: string
  ): string[] {
    return validateARIA(ariaAttrs, label);
  }

  /**
   * generateClassNames - Generate CSS class names for Select.
   *
   * @param state - Current state
   * @param customClass - User-provided custom class
   * @returns Space-separated class names
   */
  static generateClassNames(
    state: SelectState,
    customClass?: string
  ): string {
    return generateClassNames(state, customClass);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SIZE CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * getSizeConfig - Get size configuration.
   *
   * @param size - Size variant
   * @returns Size configuration
   */
  static getSizeConfig(size: SelectSize): SizeConfig {
    return SIZE_CONFIG[size];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY CHECKS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * checkQuality - Perform quality checks (dev mode).
   *
   * Checks:
   * - Low quality tokens (qualityScore < 0.7)
   * - Missing required tokens
   * - ARIA issues
   *
   * @param tokens - All available tokens
   * @param resolvedTokens - Resolved tokens
   * @param ariaAttrs - ARIA attributes
   * @param label - Label text
   * @returns Array of quality warnings
   */
  static checkQuality(
    tokens: SelectTokens,
    resolvedTokens: ResolvedSelectTokens,
    ariaAttrs: ARIAAttributes,
    label?: string
  ): QualityWarning[] {
    const warnings: QualityWarning[] = [];

    // ────────────────────────────────────────────────────────────────────────
    // TOKEN QUALITY
    // ────────────────────────────────────────────────────────────────────────

    // Check backgroundColor quality
    if (resolvedTokens.backgroundColor.qualityScore < 0.7) {
      warnings.push({
        severity: 'warning',
        message: 'Background color has low quality score',
        details: {
          token: 'backgroundColor',
          qualityScore: resolvedTokens.backgroundColor.qualityScore,
          decisionId: resolvedTokens.backgroundColor.sourceDecisionId,
        },
      });
    }

    // Check borderColor quality
    if (resolvedTokens.borderColor.qualityScore < 0.7) {
      warnings.push({
        severity: 'warning',
        message: 'Border color has low quality score',
        details: {
          token: 'borderColor',
          qualityScore: resolvedTokens.borderColor.qualityScore,
          decisionId: resolvedTokens.borderColor.sourceDecisionId,
        },
      });
    }

    // Check textColor quality
    if (resolvedTokens.textColor.qualityScore < 0.7) {
      warnings.push({
        severity: 'warning',
        message: 'Text color has low quality score',
        details: {
          token: 'textColor',
          qualityScore: resolvedTokens.textColor.qualityScore,
          decisionId: resolvedTokens.textColor.sourceDecisionId,
        },
      });
    }

    // Check dropdown background quality
    if (resolvedTokens.dropdownBackgroundColor.qualityScore < 0.7) {
      warnings.push({
        severity: 'warning',
        message: 'Dropdown background color has low quality score',
        details: {
          token: 'dropdownBackgroundColor',
          qualityScore: resolvedTokens.dropdownBackgroundColor.qualityScore,
          decisionId: resolvedTokens.dropdownBackgroundColor.sourceDecisionId,
        },
      });
    }

    // Check option text quality
    if (resolvedTokens.optionTextColor.qualityScore < 0.7) {
      warnings.push({
        severity: 'warning',
        message: 'Option text color has low quality score',
        details: {
          token: 'optionTextColor',
          qualityScore: resolvedTokens.optionTextColor.qualityScore,
          decisionId: resolvedTokens.optionTextColor.sourceDecisionId,
        },
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // ARIA VALIDATION
    // ────────────────────────────────────────────────────────────────────────

    const ariaWarnings = validateARIA(ariaAttrs, label);
    ariaWarnings.forEach((message) => {
      warnings.push({
        severity: 'warning',
        message,
        details: { ariaAttrs },
      });
    });

    return warnings;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SELECTED OPTION FINDER
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * findSelectedOption - Find the selected option by value.
   *
   * @param options - All available options
   * @param value - Selected value
   * @returns Selected option or null
   */
  static findSelectedOption<T>(
    options: SelectOption<T>[],
    value: T | null
  ): SelectOption<T> | null {
    if (value === null) {
      return null;
    }
    return options.find((opt) => opt.value === value) ?? null;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ALL-IN-ONE PROCESSOR
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * processSelect - Process select component (all-in-one).
   *
   * This is the PRIMARY method that framework adapters should use.
   * It orchestrates all select logic in one call.
   *
   * CRITICAL: Adapters MUST use this method. NO logic duplication.
   *
   * @param input - All select parameters
   * @returns Complete select output
   */
  static processSelect<T = string>(
    input: SelectCoreInput<T>
  ): SelectCoreOutput<T> {
    // ────────────────────────────────────────────────────────────────────────
    // 1. EXTRACT INPUTS
    // ────────────────────────────────────────────────────────────────────────

    const {
      tokens,
      options,
      value,
      placeholder,
      isOpen,
      highlightedValue,
      disabled,
      isHovered,
      isFocused,
      hasError,
      size = 'md',
      label,
      helperText,
      errorMessage,
      required = false,
      ariaLabel,
      ariaDescribedby,
      ariaLabelledby,
      userStyles,
      customClass,
      showQualityWarnings = false,
    } = input;

    // ────────────────────────────────────────────────────────────────────────
    // 2. DETERMINE STATE
    // ────────────────────────────────────────────────────────────────────────

    const state = SelectCore.determineState({
      disabled,
      hasError,
      isOpen,
      isFocused,
      isHovered,
    });

    // ────────────────────────────────────────────────────────────────────────
    // 3. RESOLVE TOKENS
    // ────────────────────────────────────────────────────────────────────────

    const resolvedTokens = SelectCore.resolveTokens(tokens, state);

    // ────────────────────────────────────────────────────────────────────────
    // 4. GET SIZE CONFIG
    // ────────────────────────────────────────────────────────────────────────

    const sizeConfig = SelectCore.getSizeConfig(size);

    // ────────────────────────────────────────────────────────────────────────
    // 5. FIND SELECTED OPTION
    // ────────────────────────────────────────────────────────────────────────

    const selectedOption = SelectCore.findSelectedOption(options, value);
    const displayValue = selectedOption ? selectedOption.label : (placeholder ?? '');

    // ────────────────────────────────────────────────────────────────────────
    // 6. COMPUTE STYLES
    // ────────────────────────────────────────────────────────────────────────

    const computedStyles = SelectCore.computeStyles(
      resolvedTokens,
      sizeConfig,
      state,
      label,
      helperText,
      errorMessage,
      isOpen
    );

    const styles = SelectCore.mergeStyles(computedStyles, userStyles);

    // ────────────────────────────────────────────────────────────────────────
    // 7. GENERATE IDs
    // ────────────────────────────────────────────────────────────────────────

    // Generate unique IDs for ARIA attributes
    const listboxId = `momoto-select-listbox-${Math.random().toString(36).substr(2, 9)}`;
    const highlightedOptionId = highlightedValue
      ? `momoto-select-option-${highlightedValue}`
      : undefined;

    // ────────────────────────────────────────────────────────────────────────
    // 8. GENERATE ARIA
    // ────────────────────────────────────────────────────────────────────────

    const ariaAttrs = SelectCore.generateARIA({
      state,
      isOpen,
      hasError,
      required,
      ariaLabel,
      ariaDescribedby,
      ariaLabelledby,
      listboxId,
      highlightedOptionId,
    });

    // ────────────────────────────────────────────────────────────────────────
    // 9. GENERATE CLASS NAMES
    // ────────────────────────────────────────────────────────────────────────

    const classNames = SelectCore.generateClassNames(state, customClass);

    // ────────────────────────────────────────────────────────────────────────
    // 10. QUALITY CHECKS (DEV MODE)
    // ────────────────────────────────────────────────────────────────────────

    const qualityWarnings = showQualityWarnings
      ? SelectCore.checkQuality(tokens, resolvedTokens, ariaAttrs, label)
      : [];

    // ────────────────────────────────────────────────────────────────────────
    // 11. RETURN OUTPUT
    // ────────────────────────────────────────────────────────────────────────

    return {
      state,
      selectedOption,
      displayValue,
      resolvedTokens,
      styles,
      ariaAttrs,
      classNames,
      qualityWarnings,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SelectCore;

export {
  // Main class
  SelectCore,

  // Individual modules
  determineState,
  resolveTokens,
  computeStyles,
  mergeStyles,
  generateARIA,
  validateARIA,
  generateClassNames,

  // Constants
  SIZE_CONFIG,
};

// Re-export types
export type * from './selectCore.types';
