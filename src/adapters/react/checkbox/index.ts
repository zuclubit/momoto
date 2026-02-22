/**
 * @fileoverview React Checkbox Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for React Checkbox components.
 *
 * @module momoto-ui/adapters/react/checkbox
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { Checkbox, default } from './Checkbox';

// ============================================================================
// TYPES
// ============================================================================

export type { CheckboxProps } from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic Checkbox
 * ```tsx
 * import { Checkbox } from '@momoto/ui-adapters/react/checkbox';
 * import { useState } from 'react';
 *
 * function MyComponent() {
 *   const [accepted, setAccepted] = useState(false);
 *
 *   return (
 *     <Checkbox
 *       label="Accept terms and conditions"
 *       checked={accepted}
 *       onChange={setAccepted}
 *       backgroundColor={checkboxBg}
 *       borderColor={checkboxBorder}
 *       checkColor={checkmark}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 2: Tri-state Checkbox (indeterminate)
 * ```tsx
 * import { Checkbox } from '@momoto/ui-adapters/react/checkbox';
 * import { useState, useMemo } from 'react';
 *
 * function SelectAll() {
 *   const [items, setItems] = useState([
 *     { id: 1, checked: false },
 *     { id: 2, checked: false },
 *     { id: 3, checked: false },
 *   ]);
 *
 *   const allChecked = items.every(item => item.checked);
 *   const someChecked = items.some(item => item.checked);
 *   const indeterminate = someChecked && !allChecked;
 *
 *   const handleSelectAll = (checked: boolean) => {
 *     setItems(items.map(item => ({ ...item, checked })));
 *   };
 *
 *   return (
 *     <Checkbox
 *       label="Select all"
 *       checked={allChecked}
 *       indeterminate={indeterminate}
 *       onChange={handleSelectAll}
 *       backgroundColor={checkboxBg}
 *       borderColor={checkboxBorder}
 *       checkColor={checkmark}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 3: Checkbox with validation
 * ```tsx
 * import { Checkbox } from '@momoto/ui-adapters/react/checkbox';
 * import { useState } from 'react';
 *
 * function TermsCheckbox() {
 *   const [accepted, setAccepted] = useState(false);
 *   const [submitted, setSubmitted] = useState(false);
 *
 *   const invalid = submitted && !accepted;
 *
 *   return (
 *     <Checkbox
 *       label="I accept the terms and conditions"
 *       checked={accepted}
 *       onChange={setAccepted}
 *       backgroundColor={checkboxBg}
 *       borderColor={checkboxBorder}
 *       checkColor={checkmark}
 *       required
 *       invalid={invalid}
 *       aria-describedby={invalid ? 'terms-error' : undefined}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 4: Checkbox with custom tokens for checked state
 * ```tsx
 * import { Checkbox } from '@momoto/ui-adapters/react/checkbox';
 * import { useState } from 'react';
 *
 * function StyledCheckbox() {
 *   const [checked, setChecked] = useState(false);
 *
 *   return (
 *     <Checkbox
 *       label="Enable notifications"
 *       checked={checked}
 *       onChange={setChecked}
 *       backgroundColor={checkboxBg}
 *       borderColor={checkboxBorder}
 *       checkColor={checkmark}
 *       checkedBackgroundColor={primaryBg}
 *       checkedBorderColor={primaryBorder}
 *       checkedCheckColor={onPrimaryText}
 *       size="lg"
 *     />
 *   );
 * }
 * ```
 */
