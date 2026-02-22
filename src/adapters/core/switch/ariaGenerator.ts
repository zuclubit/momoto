/**
 * @fileoverview SwitchCore ARIA Generator
 *
 * FASE 15.5: Component Expansion - Switch
 *
 * @module momoto-ui/adapters/core/switch/ariaGenerator
 * @version 1.0.0
 */

import type { ARIAAttributes, SwitchState } from './switchCore.types';
import { CLASS_PREFIX } from './constants';

export function generateARIA(params: {
  state: SwitchState;
  isChecked: boolean;
  hasError: boolean;
  required: boolean;
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaLabelledby?: string;
}): ARIAAttributes {
  const { state, isChecked, hasError, required, ariaLabel, ariaDescribedby, ariaLabelledby } = params;
  const disabled = state === 'disabled' || state === 'checkedDisabled';

  return {
    role: 'switch',
    'aria-checked': isChecked,
    'aria-disabled': disabled ? true : undefined,
    'aria-required': required ? true : undefined,
    'aria-invalid': hasError ? true : undefined,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
  };
}

export function validateARIA(ariaAttrs: ARIAAttributes, label?: string): string[] {
  const warnings: string[] = [];

  if (!ariaAttrs['aria-label'] && !ariaAttrs['aria-labelledby'] && !label) {
    warnings.push('Switch has no accessible name. Provide label, aria-label, or aria-labelledby.');
  }

  if (ariaAttrs['aria-label'] && ariaAttrs['aria-labelledby']) {
    warnings.push('Switch has both aria-label and aria-labelledby. Use only one.');
  }

  return warnings;
}

export function generateClassNames(state: SwitchState, customClass?: string): string {
  const classes = [CLASS_PREFIX, `${CLASS_PREFIX}--${state}`];
  if (customClass) classes.push(customClass);
  return classes.join(' ');
}
