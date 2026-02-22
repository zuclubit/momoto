/**
 * @fileoverview React Select Adapter - Exports
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Central export point for React Select component.
 *
 * @module momoto-ui/adapters/react/select
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { Select } from './Select';

// ============================================================================
// TYPES
// ============================================================================

export type { SelectProps } from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic Select
 * ```tsx
 * import { Select } from '@momoto/ui-adapters/react/select';
 * import { useState } from 'react';
 *
 * function MyForm() {
 *   const [country, setCountry] = useState<string | null>(null);
 *
 *   const options = [
 *     { label: 'United States', value: 'us' },
 *     { label: 'Canada', value: 'ca' },
 *     { label: 'Mexico', value: 'mx' },
 *   ];
 *
 *   return (
 *     <Select
 *       options={options}
 *       value={country}
 *       onChange={setCountry}
 *       placeholder="Select a country"
 *       label="Country"
 *       backgroundColor={fieldBg}
 *       borderColor={fieldBorder}
 *       textColor={fieldText}
 *       dropdownBackgroundColor={dropdownBg}
 *       optionTextColor={optionText}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 2: Select with Error State
 * ```tsx
 * import { Select } from '@momoto/ui-adapters/react/select';
 * import { useState } from 'react';
 *
 * function FormWithValidation() {
 *   const [role, setRole] = useState<string | null>(null);
 *   const [touched, setTouched] = useState(false);
 *
 *   const options = [
 *     { label: 'Admin', value: 'admin' },
 *     { label: 'User', value: 'user' },
 *     { label: 'Guest', value: 'guest' },
 *   ];
 *
 *   const hasError = touched && !role;
 *
 *   return (
 *     <Select
 *       options={options}
 *       value={role}
 *       onChange={(value) => {
 *         setRole(value);
 *         setTouched(true);
 *       }}
 *       placeholder="Select a role"
 *       label="Role"
 *       required
 *       error={hasError}
 *       errorMessage="Please select a role"
 *       backgroundColor={fieldBg}
 *       borderColor={fieldBorder}
 *       textColor={fieldText}
 *       errorBorderColor={errorBorder}
 *       errorMessageColor={errorText}
 *       dropdownBackgroundColor={dropdownBg}
 *       optionTextColor={optionText}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 3: Select with Disabled Options
 * ```tsx
 * import { Select } from '@momoto/ui-adapters/react/select';
 * import { useState } from 'react';
 *
 * function PrioritySelect() {
 *   const [priority, setPriority] = useState<string | null>(null);
 *
 *   const options = [
 *     { label: 'Low', value: 'low' },
 *     { label: 'Medium', value: 'medium' },
 *     { label: 'High', value: 'high' },
 *     { label: 'Critical (requires approval)', value: 'critical', disabled: true },
 *   ];
 *
 *   return (
 *     <Select
 *       options={options}
 *       value={priority}
 *       onChange={setPriority}
 *       placeholder="Select priority"
 *       label="Priority"
 *       helperText="Critical priority requires manager approval"
 *       backgroundColor={fieldBg}
 *       borderColor={fieldBorder}
 *       textColor={fieldText}
 *       dropdownBackgroundColor={dropdownBg}
 *       optionTextColor={optionText}
 *       optionDisabledTextColor={disabledText}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 4: Select with Custom Size
 * ```tsx
 * import { Select } from '@momoto/ui-adapters/react/select';
 * import { useState } from 'react';
 *
 * function CompactSelect() {
 *   const [status, setStatus] = useState<string | null>(null);
 *
 *   const options = [
 *     { label: 'Active', value: 'active' },
 *     { label: 'Inactive', value: 'inactive' },
 *     { label: 'Pending', value: 'pending' },
 *   ];
 *
 *   return (
 *     <Select
 *       options={options}
 *       value={status}
 *       onChange={setStatus}
 *       placeholder="Status"
 *       size="sm"
 *       backgroundColor={fieldBg}
 *       borderColor={fieldBorder}
 *       textColor={fieldText}
 *       dropdownBackgroundColor={dropdownBg}
 *       optionTextColor={optionText}
 *     />
 *   );
 * }
 * ```
 */
