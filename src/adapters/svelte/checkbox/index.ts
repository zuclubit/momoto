/**
 * @fileoverview Svelte Checkbox Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for Svelte Checkbox components.
 *
 * @module momoto-ui/adapters/svelte/checkbox
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { default as Checkbox } from './Checkbox.svelte';

// ============================================================================
// TYPES
// ============================================================================

export type { CheckboxProps } from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic Checkbox with two-way binding
 * ```svelte
 * <script lang="ts">
 *   import { Checkbox } from '@momoto/ui-adapters/svelte/checkbox';
 *
 *   let accepted = false;
 * </script>
 *
 * <Checkbox
 *   label="Accept terms and conditions"
 *   bind:checked={accepted}
 *   backgroundColor={checkboxBg}
 *   borderColor={checkboxBorder}
 *   checkColor={checkmark}
 * />
 * ```
 *
 * # Example 2: Tri-state Checkbox (indeterminate)
 * ```svelte
 * <script lang="ts">
 *   import { Checkbox } from '@momoto/ui-adapters/svelte/checkbox';
 *
 *   let items = [
 *     { id: 1, checked: false },
 *     { id: 2, checked: false },
 *     { id: 3, checked: false },
 *   ];
 *
 *   $: allChecked = items.every(item => item.checked);
 *   $: someChecked = items.some(item => item.checked);
 *   $: indeterminate = someChecked && !allChecked;
 *
 *   function handleSelectAll(event) {
 *     const checked = event.detail;
 *     items = items.map(item => ({ ...item, checked }));
 *   }
 * </script>
 *
 * <Checkbox
 *   label="Select all"
 *   checked={allChecked}
 *   {indeterminate}
 *   on:change={handleSelectAll}
 *   backgroundColor={checkboxBg}
 *   borderColor={checkboxBorder}
 *   checkColor={checkmark}
 * />
 * ```
 */
