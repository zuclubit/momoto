/**
 * @fileoverview Vue TextField Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for Vue TextField components.
 *
 * @module momoto-ui/adapters/vue/textfield
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { default as TextField } from './TextField.vue';

// ============================================================================
// TYPES
// ============================================================================

export type { TextFieldProps } from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic TextField with v-model
 * ```vue
 * <script setup lang="ts">
 * import { TextField } from '@momoto/ui-adapters/vue/textfield';
 * import { ref } from 'vue';
 *
 * const email = ref('');
 * </script>
 *
 * <template>
 *   <TextField
 *     label="Email"
 *     :value="email"
 *     @update:value="email = $event"
 *     :backgroundColor="inputBgToken"
 *     :textColor="inputTextToken"
 *     placeholder="Enter your email"
 *     type="email"
 *   />
 * </template>
 * ```
 *
 * # Example 2: TextField with validation
 * ```vue
 * <script setup lang="ts">
 * import { TextField } from '@momoto/ui-adapters/vue/textfield';
 * import { ref, computed } from 'vue';
 *
 * const password = ref('');
 * const hasError = computed(() => password.value.length > 0 && password.value.length < 8);
 * </script>
 *
 * <template>
 *   <TextField
 *     label="Password"
 *     :value="password"
 *     @update:value="password = $event"
 *     :backgroundColor="inputBgToken"
 *     :textColor="inputTextToken"
 *     :error="hasError"
 *     :errorBorderColor="errorBorderToken"
 *     :helperText="hasError ? 'Password must be at least 8 characters' : undefined"
 *     type="password"
 *     required
 *   />
 * </template>
 * ```
 *
 * # Example 3: Multiline TextField
 * ```vue
 * <script setup lang="ts">
 * import { TextField } from '@momoto/ui-adapters/vue/textfield';
 * import { ref } from 'vue';
 *
 * const message = ref('');
 * </script>
 *
 * <template>
 *   <TextField
 *     label="Message"
 *     :value="message"
 *     @update:value="message = $event"
 *     :backgroundColor="inputBgToken"
 *     :textColor="inputTextToken"
 *     placeholder="Enter your message"
 *     multiline
 *     :rows="5"
 *     fullWidth
 *   />
 * </template>
 * ```
 */
