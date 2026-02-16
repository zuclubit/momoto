/**
 * @fileoverview Svelte TextField Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for Svelte TextField components.
 *
 * @module momoto-ui/adapters/svelte/textfield
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { default as TextField } from './TextField.svelte';

// ============================================================================
// TYPES
// ============================================================================

export type { TextFieldProps } from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic TextField with two-way binding
 * ```svelte
 * <script lang="ts">
 *   import { TextField } from '@momoto/ui-adapters/svelte/textfield';
 *
 *   let email = '';
 * </script>
 *
 * <TextField
 *   label="Email"
 *   bind:value={email}
 *   backgroundColor={inputBgToken}
 *   textColor={inputTextToken}
 *   placeholder="Enter your email"
 *   type="email"
 * />
 * ```
 *
 * # Example 2: TextField with validation
 * ```svelte
 * <script lang="ts">
 *   import { TextField } from '@momoto/ui-adapters/svelte/textfield';
 *
 *   let password = '';
 *   $: hasError = password.length > 0 && password.length < 8;
 * </script>
 *
 * <TextField
 *   label="Password"
 *   bind:value={password}
 *   backgroundColor={inputBgToken}
 *   textColor={inputTextToken}
 *   error={hasError}
 *   errorBorderColor={errorBorderToken}
 *   helperText={hasError ? 'Password must be at least 8 characters' : undefined}
 *   type="password"
 *   required
 * />
 * ```
 *
 * # Example 3: Multiline TextField
 * ```svelte
 * <script lang="ts">
 *   import { TextField } from '@momoto/ui-adapters/svelte/textfield';
 *
 *   let message = '';
 * </script>
 *
 * <TextField
 *   label="Message"
 *   bind:value={message}
 *   backgroundColor={inputBgToken}
 *   textColor={inputTextToken}
 *   placeholder="Enter your message"
 *   multiline
 *   rows={5}
 *   fullWidth
 * />
 * ```
 */
