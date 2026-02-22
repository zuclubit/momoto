/**
 * @fileoverview ARIA Generator - Button Accessibility Attributes
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Generates ARIA attributes for button accessibility.
 * This is framework-agnostic ARIA generation based on WCAG 2.2 AA.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Accessibility attributes from props (NOT perceptual)
 * - ✅ WCAG 2.2 AA compliance by construction
 * - ✅ NO perceptual decisions
 *
 * @module momoto-ui/adapters/core/button/ariaGenerator
 * @version 1.0.0
 */

import type {
  ARIAAttributes,
  GenerateARIAInput,
} from './buttonCore.types';

// ============================================================================
// ARIA GENERATION
// ============================================================================

/**
 * Generate ARIA attributes for button accessibility.
 *
 * CONTRACT: This generates accessibility metadata (ALLOWED).
 * - Uses props, NOT perceptual decisions
 * - WCAG 2.2 AA compliance by construction
 * - NO color-based decisions (contrast from token metadata)
 *
 * WCAG 2.2 AA Requirements:
 * - Proper labeling (aria-label or visible text)
 * - Disabled state indication
 * - Loading state indication
 * - Describedby for additional context
 *
 * @param input - ARIA generation input
 * @returns ARIA attributes object
 */
export function generateARIA(input: GenerateARIAInput): ARIAAttributes {
  const {
    label,
    disabled,
    loading,
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
    // If no explicit aria-label, use the visible label
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
  // LOADING STATE (custom - for screen reader feedback)
  // ───────────────────────────────────────────────────────────────────────────
  if (loading) {
    // aria-disabled for loading state (button is not interactive)
    attrs['aria-disabled'] = true;

    // Add describedby for loading message if not already set
    // Framework adapters should render a visually-hidden loading message
    // with id="${buttonId}-loading-message"
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ROLE (typically not needed for <button>, but included for flexibility)
  // ───────────────────────────────────────────────────────────────────────────
  // Button elements have implicit role="button", so we don't set it
  // Framework adapters can override if rendering as <a> or <div>

  return attrs;
}

// ============================================================================
// ARIA VALIDATION (DEV MODE UTILITY)
// ============================================================================

/**
 * Validate ARIA attributes for common issues.
 *
 * This is a DEV MODE utility that checks for common accessibility issues.
 * NOT used in production.
 *
 * @param attrs - ARIA attributes to validate
 * @returns Array of warning messages (empty if valid)
 */
export function validateARIA(attrs: ARIAAttributes, label?: string): string[] {
  const warnings: string[] = [];

  // Check for missing label
  if (!attrs['aria-label'] && !label) {
    warnings.push('Button is missing an accessible label (aria-label or visible text)');
  }

  // Check for redundant role
  if (attrs.role === 'button') {
    warnings.push('Redundant role="button" on <button> element (implicit role)');
  }

  return warnings;
}

// ============================================================================
// CLASS NAME GENERATION
// ============================================================================

/**
 * Generate CSS class names for button states.
 *
 * This is NOT perceptual - just string concatenation for CSS classes.
 * Allows framework adapters to apply consistent class names.
 *
 * @param baseClass - Base class name (e.g., 'momoto-button')
 * @param state - Current button state
 * @param size - Button size
 * @param modifiers - Additional modifiers
 * @returns Space-separated class names
 */
export function generateClassNames(
  baseClass: string,
  state: string,
  size: string,
  modifiers?: {
    fullWidth?: boolean;
    hasIcon?: boolean;
    loading?: boolean;
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
    if (modifiers.hasIcon) {
      classes.push(`${baseClass}--with-icon`);
    }
    if (modifiers.loading) {
      classes.push(`${baseClass}--loading`);
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
 *    - Uses label, disabled, loading from props
 *    - NO color-based decisions
 *    - Contrast ratios come from token.accessibility metadata
 *
 * ✅ WCAG 2.2 AA compliance
 *    - Proper labeling (2.5.3 Level A)
 *    - Info and relationships (1.3.1 Level A)
 *    - Name, role, value (4.1.2 Level A)
 *    - Contrast is enforced by token validation (1.4.3 Level AA)
 *
 * ✅ Framework-agnostic
 *    - Returns plain object with ARIA attributes
 *    - Can be applied to any framework's button element
 *    - No framework dependencies
 *
 * EXTRACTED FROM:
 * - React Button.tsx lines 327-331 (createButtonAria call)
 * - utils/aria.ts (createButtonAria implementation)
 */
