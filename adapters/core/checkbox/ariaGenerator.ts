/**
 * @fileoverview ARIA Generator - Checkbox Accessibility Attributes
 *
 * FASE 15: Component Expansion
 *
 * Generates ARIA attributes for checkbox accessibility.
 * Framework-agnostic ARIA generation based on WCAG 2.2 AA.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Accessibility attributes from props (NOT perceptual)
 * - ✅ WCAG 2.2 AA compliance by construction
 * - ✅ NO perceptual decisions
 *
 * @module momoto-ui/adapters/core/checkbox/ariaGenerator
 * @version 1.0.0
 */

import type {
  ARIAAttributes,
  GenerateARIAInput,
  CheckboxState,
  CheckboxSize,
} from './checkboxCore.types';

// ============================================================================
// ARIA GENERATION
// ============================================================================

/**
 * Generate ARIA attributes for checkbox accessibility.
 *
 * CONTRACT: This generates accessibility metadata (ALLOWED).
 * - Uses props, NOT perceptual decisions
 * - WCAG 2.2 AA compliance by construction
 * - NO color-based decisions (contrast from token metadata)
 *
 * WCAG 2.2 AA Requirements for Checkboxes:
 * - Proper checked state (aria-checked)
 * - Indeterminate state indication (aria-checked="mixed")
 * - Disabled state indication (aria-disabled)
 * - Required field indication (aria-required)
 * - Error state indication (aria-invalid)
 * - Proper labeling (aria-label or associated label)
 *
 * @param input - ARIA generation input
 * @returns ARIA attributes object
 */
export function generateARIA(input: GenerateARIAInput): ARIAAttributes {
  const {
    isChecked,
    isIndeterminate,
    disabled,
    required,
    invalid,
    ariaLabel,
    ariaDescribedby,
  } = input;

  const attrs: ARIAAttributes = {};

  // ───────────────────────────────────────────────────────────────────────────
  // CHECKED STATE (WCAG 2.2: 4.1.2 Name, Role, Value - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (isIndeterminate) {
    attrs['aria-checked'] = 'mixed';
  } else {
    attrs['aria-checked'] = isChecked;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DISABLED STATE (WCAG 2.2: 4.1.2 Name, Role, Value - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (disabled) {
    attrs['aria-disabled'] = true;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // LABEL (WCAG 2.2: 2.5.3 Label in Name - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (ariaLabel) {
    attrs['aria-label'] = ariaLabel;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DESCRIBEDBY (WCAG 2.2: 1.3.1 Info and Relationships - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (ariaDescribedby) {
    attrs['aria-describedby'] = ariaDescribedby;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // REQUIRED FIELD (WCAG 2.2: 3.3.2 Labels or Instructions - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (required) {
    attrs['aria-required'] = true;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ERROR STATE (WCAG 2.2: 3.3.1 Error Identification - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (invalid) {
    attrs['aria-invalid'] = true;
  }

  return attrs;
}

// ============================================================================
// ARIA VALIDATION (DEV MODE UTILITY)
// ============================================================================

/**
 * Validate ARIA attributes for common issues.
 *
 * DEV MODE utility - checks for accessibility issues.
 * NOT used in production.
 *
 * @param attrs - ARIA attributes to validate
 * @param label - Visible label (if any)
 * @returns Array of warning messages (empty if valid)
 */
export function validateARIA(attrs: ARIAAttributes, label?: string): string[] {
  const warnings: string[] = [];

  // Check for missing label
  if (!attrs['aria-label'] && !label) {
    warnings.push('Checkbox is missing an accessible label (aria-label or visible label)');
  }

  // Check for invalid + describedby without error message
  if (attrs['aria-invalid'] && !attrs['aria-describedby']) {
    warnings.push('Invalid checkbox should have aria-describedby pointing to error message');
  }

  return warnings;
}

// ============================================================================
// CLASS NAME GENERATION
// ============================================================================

/**
 * Generate CSS class names for checkbox states.
 *
 * NOT perceptual - just string concatenation for CSS classes.
 *
 * @param baseClass - Base class name
 * @param state - Current checkbox state
 * @param size - Checkbox size
 * @param modifiers - Additional modifiers
 * @returns Space-separated class names
 */
export function generateClassNames(
  baseClass: string,
  state: CheckboxState,
  size: CheckboxSize,
  modifiers?: {
    hasLabel?: boolean;
    customClass?: string;
  }
): string {
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    `${baseClass}--${state}`,
  ];

  if (modifiers) {
    if (modifiers.hasLabel) {
      classes.push(`${baseClass}--with-label`);
    }
  }

  const classString = classes.join(' ');

  // Append custom class if provided
  if (modifiers?.customClass) {
    return `${classString} ${modifiers.customClass}`;
  }

  return classString;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateARIA,
  validateARIA,
  generateClassNames,
};

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Accessibility from props (NOT perceptual)
 *    - Uses isChecked, isIndeterminate, disabled, required, invalid from props
 *    - NO color-based decisions
 *    - Contrast ratios come from token.accessibility metadata
 *
 * ✅ WCAG 2.2 AA compliance
 *    - Proper checked state (4.1.2 Level A)
 *    - Indeterminate state (4.1.2 Level A)
 *    - Disabled state (4.1.2 Level A)
 *    - Proper labeling (2.5.3 Level A)
 *    - Info and relationships (1.3.1 Level A)
 *    - Error identification (3.3.1 Level A)
 *    - Required fields (3.3.2 Level A)
 *    - Contrast enforced by token validation (1.4.3 Level AA)
 *
 * ✅ Framework-agnostic
 *    - Returns plain object with ARIA attributes
 *    - Can be applied to any framework's checkbox element
 *
 * PATTERN: Exact copy of textfield/ariaGenerator.ts adapted for Checkbox
 * CRITICAL for checkboxes - proper ARIA is essential for form accessibility
 */
