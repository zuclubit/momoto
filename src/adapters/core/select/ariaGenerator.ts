/**
 * @fileoverview SelectCore ARIA Generator
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Generates WCAG 2.2 AA compliant ARIA attributes for Select.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ WCAG 2.2 AA compliant
 * - ✅ Proper combobox/listbox/option semantics
 * - ✅ NO perceptual logic (contrast from token metadata)
 *
 * @module momoto-ui/adapters/core/select/ariaGenerator
 * @version 1.0.0
 */

import type { ARIAAttributes, SelectState } from './selectCore.types';
import { CLASS_PREFIX } from './constants';

// ============================================================================
// ARIA GENERATION
// ============================================================================

/**
 * generateARIA - Generate ARIA attributes for Select.
 *
 * Implements WCAG 2.2 AA requirements:
 * - Proper combobox role
 * - aria-expanded for dropdown state
 * - aria-controls for listbox reference
 * - aria-activedescendant for keyboard navigation
 * - aria-disabled, aria-required, aria-invalid
 *
 * @param params - ARIA generation parameters
 * @returns ARIA attributes
 */
export function generateARIA(params: {
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
  const {
    state,
    isOpen,
    hasError,
    required,
    ariaLabel,
    ariaDescribedby,
    ariaLabelledby,
    listboxId,
    highlightedOptionId,
  } = params;

  const disabled = state === 'disabled';

  return {
    // Combobox role (standard for select/dropdown)
    role: 'combobox',

    // Whether dropdown is expanded
    'aria-expanded': isOpen,

    // ID of the listbox element
    'aria-controls': listboxId,

    // ID of the currently focused option (for keyboard navigation)
    'aria-activedescendant': highlightedOptionId,

    // Disabled state
    'aria-disabled': disabled ? true : undefined,

    // Required state
    'aria-required': required ? true : undefined,

    // Invalid state (error)
    'aria-invalid': hasError ? true : undefined,

    // Accessible label
    'aria-label': ariaLabel,

    // ID of element describing the field
    'aria-describedby': ariaDescribedby,

    // ID of label element
    'aria-labelledby': ariaLabelledby,
  };
}

// ============================================================================
// ARIA VALIDATION (DEV MODE)
// ============================================================================

/**
 * validateARIA - Validate ARIA attributes (dev mode).
 *
 * Checks for common ARIA issues:
 * - Missing required attributes
 * - Conflicting attributes
 * - Invalid values
 *
 * @param ariaAttrs - ARIA attributes to validate
 * @param label - Label text
 * @returns Array of validation warnings
 */
export function validateARIA(
  ariaAttrs: ARIAAttributes,
  label?: string
): string[] {
  const warnings: string[] = [];

  // Warning: No accessible name
  if (!ariaAttrs['aria-label'] && !ariaAttrs['aria-labelledby'] && !label) {
    warnings.push(
      'Select has no accessible name. Provide label, aria-label, or aria-labelledby.'
    );
  }

  // Warning: Conflicting label attributes
  if (ariaAttrs['aria-label'] && ariaAttrs['aria-labelledby']) {
    warnings.push(
      'Select has both aria-label and aria-labelledby. Use only one.'
    );
  }

  // Warning: aria-activedescendant without aria-expanded
  if (ariaAttrs['aria-activedescendant'] && !ariaAttrs['aria-expanded']) {
    warnings.push(
      'aria-activedescendant is set but dropdown is not expanded.'
    );
  }

  return warnings;
}

// ============================================================================
// CLASS NAME GENERATION
// ============================================================================

/**
 * generateClassNames - Generate CSS class names for Select.
 *
 * @param state - Current state
 * @param customClass - User-provided custom class
 * @returns Space-separated class names
 */
export function generateClassNames(
  state: SelectState,
  customClass?: string
): string {
  const classes = [
    CLASS_PREFIX,
    `${CLASS_PREFIX}--${state}`,
  ];

  if (customClass) {
    classes.push(customClass);
  }

  return classes.join(' ');
}
