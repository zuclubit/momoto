/**
 * @fileoverview ARIA Utilities - Accessibility Helpers
 *
 * FASE 11: UI Primitives & Component Kit
 *
 * Pure utilities for ARIA attributes. NO perceptual logic,
 * NO decisions, just attribute helpers.
 *
 * @module momoto-ui/components/primitives/utils/aria
 * @version 1.0.0
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Common ARIA props that components might need.
 */
export interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-relevant'?: string;
  'aria-busy'?: boolean;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-activedescendant'?: string;
  'aria-checked'?: boolean | 'mixed';
  'aria-selected'?: boolean;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}

/**
 * ARIA role values.
 */
export type AriaRole =
  | 'button'
  | 'link'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'textbox'
  | 'combobox'
  | 'listbox'
  | 'option'
  | 'menu'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'tab'
  | 'tabpanel'
  | 'tablist'
  | 'dialog'
  | 'alertdialog'
  | 'alert'
  | 'status'
  | 'log'
  | 'progressbar'
  | 'slider'
  | 'spinbutton'
  | 'tooltip'
  | 'grid'
  | 'gridcell'
  | 'row'
  | 'rowgroup'
  | 'table'
  | 'cell'
  | 'article'
  | 'banner'
  | 'complementary'
  | 'contentinfo'
  | 'form'
  | 'main'
  | 'navigation'
  | 'region'
  | 'search'
  | 'presentation'
  | 'none';

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generate unique ID for ARIA relationships.
 *
 * PURE UTILITY - NO LOGIC.
 * Simple counter-based ID generator.
 *
 * @param prefix - Optional prefix for ID
 * @returns Unique ID string
 *
 * @example
 * ```typescript
 * const labelId = generateAriaId('label'); // 'label-1'
 * const descId = generateAriaId('desc'); // 'desc-2'
 * ```
 */
let idCounter = 0;

export function generateAriaId(prefix = 'momoto-aria'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/**
 * Filter ARIA props from a props object.
 *
 * PURE UTILITY - NO LOGIC.
 * Extracts only ARIA-related props.
 *
 * @param props - Props object
 * @returns Object with only ARIA props
 *
 * @example
 * ```typescript
 * const props = {
 *   'aria-label': 'Button',
 *   'aria-disabled': true,
 *   onClick: () => {},
 *   className: 'button'
 * };
 *
 * const ariaProps = filterAriaProps(props);
 * // { 'aria-label': 'Button', 'aria-disabled': true }
 * ```
 */
export function filterAriaProps(props: Record<string, any>): AriaProps {
  const ariaProps: AriaProps = {};

  for (const key in props) {
    if (key.startsWith('aria-') || key === 'role') {
      ariaProps[key as keyof AriaProps] = props[key];
    }
  }

  return ariaProps;
}

/**
 * Merge multiple ARIA describedby IDs.
 *
 * PURE UTILITY - NO LOGIC.
 * Concatenates space-separated ID strings.
 *
 * @param ids - Array of ID strings
 * @returns Space-separated ID string
 *
 * @example
 * ```typescript
 * const describedby = mergeAriaDescribedBy(['help-text', 'error-text']);
 * // 'help-text error-text'
 * ```
 */
export function mergeAriaDescribedBy(...ids: (string | undefined)[]): string | undefined {
  const filtered = ids.filter(Boolean) as string[];
  return filtered.length > 0 ? filtered.join(' ') : undefined;
}

/**
 * Create ARIA live region props.
 *
 * PURE UTILITY - NO LOGIC.
 * Returns standard live region attributes.
 *
 * @param mode - Live region mode ('polite' or 'assertive')
 * @param atomic - Whether entire region should be announced
 * @returns ARIA live region props
 *
 * @example
 * ```typescript
 * const liveProps = createAriaLiveRegion('assertive', true);
 * // { 'aria-live': 'assertive', 'aria-atomic': true }
 * ```
 */
export function createAriaLiveRegion(
  mode: 'polite' | 'assertive' = 'polite',
  atomic = false
): AriaProps {
  return {
    'aria-live': mode,
    'aria-atomic': atomic,
  };
}

/**
 * Create ARIA props for form field with label and error.
 *
 * PURE UTILITY - NO LOGIC.
 * Generates standard form field ARIA attributes.
 *
 * @param options - Field options
 * @returns ARIA props for form field
 *
 * @example
 * ```typescript
 * const ariaProps = createFormFieldAria({
 *   labelId: 'label-1',
 *   descriptionId: 'desc-1',
 *   errorId: 'error-1',
 *   required: true,
 *   invalid: true,
 * });
 * // {
 * //   'aria-labelledby': 'label-1',
 * //   'aria-describedby': 'desc-1 error-1',
 * //   'aria-required': true,
 * //   'aria-invalid': true
 * // }
 * ```
 */
export function createFormFieldAria(options: {
  labelId?: string;
  descriptionId?: string;
  errorId?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}): AriaProps {
  const describedby = mergeAriaDescribedBy(
    options.descriptionId,
    options.invalid ? options.errorId : undefined
  );

  return {
    ...(options.labelId && { 'aria-labelledby': options.labelId }),
    ...(describedby && { 'aria-describedby': describedby }),
    ...(options.required && { 'aria-required': true }),
    ...(options.invalid && { 'aria-invalid': true }),
    ...(options.disabled && { 'aria-disabled': true }),
  };
}

/**
 * Create ARIA props for button.
 *
 * PURE UTILITY - NO LOGIC.
 * Returns standard button ARIA attributes.
 *
 * @param options - Button options
 * @returns ARIA props for button
 *
 * @example
 * ```typescript
 * const ariaProps = createButtonAria({
 *   label: 'Submit',
 *   disabled: true,
 *   pressed: false,
 * });
 * // { 'aria-label': 'Submit', 'aria-disabled': true, 'aria-pressed': false }
 * ```
 */
export function createButtonAria(options: {
  label?: string;
  describedby?: string;
  disabled?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  haspopup?: boolean;
  controls?: string;
}): AriaProps {
  return {
    ...(options.label && { 'aria-label': options.label }),
    ...(options.describedby && { 'aria-describedby': options.describedby }),
    ...(options.disabled && { 'aria-disabled': true }),
    ...(options.pressed !== undefined && { 'aria-pressed': options.pressed }),
    ...(options.expanded !== undefined && { 'aria-expanded': options.expanded }),
    ...(options.haspopup && { 'aria-haspopup': true }),
    ...(options.controls && { 'aria-controls': options.controls }),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateAriaId,
  filterAriaProps,
  mergeAriaDescribedBy,
  createAriaLiveRegion,
  createFormFieldAria,
  createButtonAria,
};

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ NO perceptual logic
 * ✅ NO color calculations
 * ✅ NO decisions
 * ✅ Pure attribute helpers
 * ✅ No side effects (except ID counter)
 *
 * These utilities exist solely to reduce boilerplate in setting
 * ARIA attributes. They make NO decisions about when or how to
 * use accessibility features - that's up to components and tokens.
 *
 * IMPORTANT: These helpers do NOT validate or enforce accessibility.
 * Accessibility compliance comes from:
 * 1. Token metadata (WCAG ratios, AA/AAA pass)
 * 2. Proper semantic HTML
 * 3. Correct ARIA usage in components
 */
