/**
 * @fileoverview ARIA Generator - TextField Accessibility Attributes
 *
 * FASE 15: Component Expansion
 *
 * Generates ARIA attributes for text field accessibility.
 * Framework-agnostic ARIA generation based on WCAG 2.2 AA.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Accessibility attributes from props (NOT perceptual)
 * - ✅ WCAG 2.2 AA compliance by construction
 * - ✅ NO perceptual decisions
 *
 * @module momoto-ui/adapters/core/textfield/ariaGenerator
 * @version 1.0.0
 */

import type {
  ARIAAttributes,
  GenerateARIAInput,
  TextFieldState,
  TextFieldSize,
} from './textFieldCore.types';

// ============================================================================
// ARIA GENERATION
// ============================================================================

/**
 * Generate ARIA attributes for text field accessibility.
 *
 * CONTRACT: This generates accessibility metadata (ALLOWED).
 * - Uses props, NOT perceptual decisions
 * - WCAG 2.2 AA compliance by construction
 * - NO color-based decisions (contrast from token metadata)
 *
 * WCAG 2.2 AA Requirements for Text Inputs:
 * - Proper labeling (aria-label or visible label)
 * - Error state indication (aria-invalid)
 * - Required field indication (aria-required)
 * - Disabled state indication (aria-disabled)
 * - Describedby for helper text/errors
 *
 * @param input - ARIA generation input
 * @returns ARIA attributes object
 */
export function generateARIA(input: GenerateARIAInput): ARIAAttributes {
  const {
    label,
    disabled,
    error,
    required,
    ariaLabel,
    ariaDescribedby,
  } = input;

  const attrs: ARIAAttributes = {};

  // ───────────────────────────────────────────────────────────────────────────
  // LABEL (WCAG 2.2: 2.5.3 Label in Name - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (ariaLabel) {
    attrs['aria-label'] = ariaLabel;
  } else if (label) {
    attrs['aria-label'] = label;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DESCRIBEDBY (WCAG 2.2: 1.3.1 Info and Relationships - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (ariaDescribedby) {
    attrs['aria-describedby'] = ariaDescribedby;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DISABLED STATE (WCAG 2.2: 4.1.2 Name, Role, Value - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (disabled) {
    attrs['aria-disabled'] = true;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ERROR STATE (WCAG 2.2: 3.3.1 Error Identification - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (error) {
    attrs['aria-invalid'] = true;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // REQUIRED FIELD (WCAG 2.2: 3.3.2 Labels or Instructions - Level A)
  // ───────────────────────────────────────────────────────────────────────────
  if (required) {
    attrs['aria-required'] = true;
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
    warnings.push('TextField is missing an accessible label (aria-label or visible label)');
  }

  // Check for invalid + describedby without error message
  if (attrs['aria-invalid'] && !attrs['aria-describedby']) {
    warnings.push('Invalid field should have aria-describedby pointing to error message');
  }

  return warnings;
}

// ============================================================================
// CLASS NAME GENERATION
// ============================================================================

/**
 * Generate CSS class names for text field states.
 *
 * NOT perceptual - just string concatenation for CSS classes.
 *
 * @param baseClass - Base class name
 * @param state - Current text field state
 * @param size - Text field size
 * @param modifiers - Additional modifiers
 * @returns Space-separated class names
 */
export function generateClassNames(
  baseClass: string,
  state: TextFieldState,
  size: TextFieldSize,
  modifiers?: {
    fullWidth?: boolean;
    multiline?: boolean;
    hasLabel?: boolean;
    hasHelper?: boolean;
  }
): string {
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    `${baseClass}--${state}`,
  ];

  if (modifiers) {
    if (modifiers.fullWidth) {
      classes.push(`${baseClass}--full-width`);
    }
    if (modifiers.multiline) {
      classes.push(`${baseClass}--multiline`);
    }
    if (modifiers.hasLabel) {
      classes.push(`${baseClass}--with-label`);
    }
    if (modifiers.hasHelper) {
      classes.push(`${baseClass}--with-helper`);
    }
  }

  return classes.join(' ');
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
 *    - Uses label, disabled, error, required from props
 *    - NO color-based decisions
 *    - Contrast ratios come from token.accessibility metadata
 *
 * ✅ WCAG 2.2 AA compliance
 *    - Proper labeling (2.5.3 Level A)
 *    - Info and relationships (1.3.1 Level A)
 *    - Name, role, value (4.1.2 Level A)
 *    - Error identification (3.3.1 Level A)
 *    - Labels or instructions (3.3.2 Level A)
 *    - Contrast enforced by token validation (1.4.3 Level AA)
 *
 * ✅ Framework-agnostic
 *    - Returns plain object with ARIA attributes
 *    - Can be applied to any framework's input element
 *
 * PATTERN: Exact copy of button/ariaGenerator.ts adapted for TextField
 * CRITICAL for inputs - proper ARIA is essential for form accessibility
 */
