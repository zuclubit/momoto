/**
 * @fileoverview Vue Button Adapter - Exports
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Central export point for Vue Button components.
 *
 * @module momoto-ui/adapters/vue/button
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { default as Button } from './Button.vue';
export { default as ButtonWithVariant } from './ButtonWithVariant.vue';

// ============================================================================
// TYPES
// ============================================================================

export type {
  ButtonProps,
  ButtonWithVariantProps,
} from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Button with explicit tokens
 * ```vue
 * <script setup lang="ts">
 * import { Button } from '@momoto/ui-adapters/vue/button';
 * import { ref } from 'vue';
 *
 * const primaryBg = ref(submitBackgroundToken);
 * const primaryText = ref(submitTextToken);
 *
 * const handleClick = () => {
 *   console.log('Clicked!');
 * };
 * </script>
 *
 * <template>
 *   <Button
 *     label="Submit"
 *     :backgroundColor="primaryBg"
 *     :textColor="primaryText"
 *     @click="handleClick"
 *   />
 * </template>
 * ```
 *
 * # Example 2: ButtonWithVariant (preferred)
 * ```vue
 * <script setup lang="ts">
 * import { ButtonWithVariant } from '@momoto/ui-adapters/vue/button';
 *
 * const handleClick = () => {
 *   console.log('Clicked!');
 * };
 * </script>
 *
 * <template>
 *   <ButtonWithVariant
 *     label="Submit"
 *     variant="primary"
 *     @click="handleClick"
 *   />
 * </template>
 * ```
 *
 * # Example 3: With icon
 * ```vue
 * <script setup lang="ts">
 * import { ButtonWithVariant } from '@momoto/ui-adapters/vue/button';
 * import IconCheck from './icons/IconCheck.vue';
 * </script>
 *
 * <template>
 *   <ButtonWithVariant
 *     label="Save"
 *     variant="primary"
 *     :icon="IconCheck"
 *     iconPosition="left"
 *     @click="handleSave"
 *   />
 * </template>
 * ```
 *
 * # Example 4: Loading state
 * ```vue
 * <script setup lang="ts">
 * import { ButtonWithVariant } from '@momoto/ui-adapters/vue/button';
 * import { ref } from 'vue';
 *
 * const isLoading = ref(false);
 *
 * const handleSubmit = async () => {
 *   isLoading.value = true;
 *   await submitForm();
 *   isLoading.value = false;
 * };
 * </script>
 *
 * <template>
 *   <ButtonWithVariant
 *     label="Submit"
 *     variant="primary"
 *     :loading="isLoading"
 *     @click="handleSubmit"
 *   />
 * </template>
 * ```
 */
