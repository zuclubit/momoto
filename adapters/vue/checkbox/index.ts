/**
 * @fileoverview Vue Checkbox Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for Vue Checkbox components.
 *
 * @module momoto-ui/adapters/vue/checkbox
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { default as Checkbox } from './Checkbox.vue';

// ============================================================================
// TYPES
// ============================================================================

export type { CheckboxProps } from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic Checkbox with v-model
 * ```vue
 * <script setup lang="ts">
 * import { Checkbox } from '@momoto/ui-adapters/vue/checkbox';
 * import { ref } from 'vue';
 *
 * const accepted = ref(false);
 * </script>
 *
 * <template>
 *   <Checkbox
 *     label="Accept terms and conditions"
 *     :checked="accepted"
 *     @update:checked="accepted = $event"
 *     :backgroundColor="checkboxBg"
 *     :borderColor="checkboxBorder"
 *     :checkColor="checkmark"
 *   />
 * </template>
 * ```
 *
 * # Example 2: Tri-state Checkbox (indeterminate)
 * ```vue
 * <script setup lang="ts">
 * import { Checkbox } from '@momoto/ui-adapters/vue/checkbox';
 * import { ref, computed } from 'vue';
 *
 * const items = ref([
 *   { id: 1, checked: false },
 *   { id: 2, checked: false },
 *   { id: 3, checked: false },
 * ]);
 *
 * const allChecked = computed(() => items.value.every(item => item.checked));
 * const someChecked = computed(() => items.value.some(item => item.checked));
 * const indeterminate = computed(() => someChecked.value && !allChecked.value);
 *
 * function handleSelectAll(checked: boolean) {
 *   items.value.forEach(item => item.checked = checked);
 * }
 * </script>
 *
 * <template>
 *   <Checkbox
 *     label="Select all"
 *     :checked="allChecked"
 *     :indeterminate="indeterminate"
 *     @update:checked="handleSelectAll"
 *     :backgroundColor="checkboxBg"
 *     :borderColor="checkboxBorder"
 *     :checkColor="checkmark"
 *   />
 * </template>
 * ```
 */
