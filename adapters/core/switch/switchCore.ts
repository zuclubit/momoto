/**
 * @fileoverview SwitchCore - Framework-Agnostic Switch Logic
 *
 * FASE 15.5: Component Expansion - Switch (Final Base Component)
 *
 * @module momoto-ui/adapters/core/switch
 * @version 1.0.0
 */

import type {
  SwitchCoreInput,
  SwitchCoreOutput,
  SwitchState,
  SwitchTokens,
  ResolvedSwitchTokens,
  SwitchStyles,
  ARIAAttributes,
  QualityWarning,
  SizeConfig,
  SwitchSize,
} from './switchCore.types';
import { determineState, resolveTokens } from './tokenResolver';
import { computeStyles, mergeStyles } from './styleComputer';
import { generateARIA, validateARIA, generateClassNames } from './ariaGenerator';
import { SIZE_CONFIG } from './constants';

class SwitchCore {
  static determineState(params: {
    disabled: boolean;
    hasError: boolean;
    isChecked: boolean;
    isFocused: boolean;
    isHovered: boolean;
  }): SwitchState {
    return determineState(params);
  }

  static resolveTokens(tokens: SwitchTokens, state: SwitchState): ResolvedSwitchTokens {
    return resolveTokens(tokens, state);
  }

  static computeStyles(
    resolvedTokens: ResolvedSwitchTokens,
    sizeConfig: SizeConfig,
    state: SwitchState,
    isChecked: boolean,
    label: string | undefined,
    helperText: string | undefined,
    errorMessage: string | undefined
  ): SwitchStyles {
    return computeStyles(resolvedTokens, sizeConfig, state, isChecked, label, helperText, errorMessage);
  }

  static mergeStyles(computedStyles: SwitchStyles, userStyles?: Partial<SwitchStyles>): SwitchStyles {
    return mergeStyles(computedStyles, userStyles);
  }

  static generateARIA(params: {
    state: SwitchState;
    isChecked: boolean;
    hasError: boolean;
    required: boolean;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaLabelledby?: string;
  }): ARIAAttributes {
    return generateARIA(params);
  }

  static validateARIA(ariaAttrs: ARIAAttributes, label?: string): string[] {
    return validateARIA(ariaAttrs, label);
  }

  static generateClassNames(state: SwitchState, customClass?: string): string {
    return generateClassNames(state, customClass);
  }

  static getSizeConfig(size: SwitchSize): SizeConfig {
    return SIZE_CONFIG[size];
  }

  static checkQuality(
    tokens: SwitchTokens,
    resolvedTokens: ResolvedSwitchTokens,
    ariaAttrs: ARIAAttributes,
    label?: string
  ): QualityWarning[] {
    const warnings: QualityWarning[] = [];

    if (resolvedTokens.trackBackgroundColor.qualityScore < 0.7) {
      warnings.push({
        severity: 'warning',
        message: 'Track background color has low quality score',
        details: {
          token: 'trackBackgroundColor',
          qualityScore: resolvedTokens.trackBackgroundColor.qualityScore,
          decisionId: resolvedTokens.trackBackgroundColor.sourceDecisionId,
        },
      });
    }

    if (resolvedTokens.thumbColor.qualityScore < 0.7) {
      warnings.push({
        severity: 'warning',
        message: 'Thumb color has low quality score',
        details: {
          token: 'thumbColor',
          qualityScore: resolvedTokens.thumbColor.qualityScore,
          decisionId: resolvedTokens.thumbColor.sourceDecisionId,
        },
      });
    }

    const ariaWarnings = validateARIA(ariaAttrs, label);
    ariaWarnings.forEach((message) => {
      warnings.push({ severity: 'warning', message, details: { ariaAttrs } });
    });

    return warnings;
  }

  static processSwitch(input: SwitchCoreInput): SwitchCoreOutput {
    const {
      tokens,
      isChecked,
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

    const state = SwitchCore.determineState({ disabled, hasError, isChecked, isFocused, isHovered });
    const resolvedTokens = SwitchCore.resolveTokens(tokens, state);
    const sizeConfig = SwitchCore.getSizeConfig(size);
    const computedStyles = SwitchCore.computeStyles(
      resolvedTokens,
      sizeConfig,
      state,
      isChecked,
      label,
      helperText,
      errorMessage
    );
    const styles = SwitchCore.mergeStyles(computedStyles, userStyles);
    const ariaAttrs = SwitchCore.generateARIA({
      state,
      isChecked,
      hasError,
      required,
      ariaLabel,
      ariaDescribedby,
      ariaLabelledby,
    });
    const classNames = SwitchCore.generateClassNames(state, customClass);
    const qualityWarnings = showQualityWarnings
      ? SwitchCore.checkQuality(tokens, resolvedTokens, ariaAttrs, label)
      : [];

    return { state, resolvedTokens, styles, ariaAttrs, classNames, qualityWarnings };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SwitchCore;

export {
  // Main class
  SwitchCore,

  // Individual modules
  determineState,
  resolveTokens,
  computeStyles,
  mergeStyles,
  generateARIA,
  generateClassNames,

  // Constants
  SIZE_CONFIG,
};

// Re-export types
export type * from './switchCore.types';
