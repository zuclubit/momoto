/**
 * @fileoverview Svelte Button Adapter - Exports
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Central export point for Svelte Button components.
 *
 * @module momoto-ui/adapters/svelte/button
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { default as Button } from './Button.svelte';
export { default as ButtonWithVariant } from './ButtonWithVariant.svelte';

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
 * ```svelte
 * <script lang="ts">
 *   import { Button } from '@momoto/ui-adapters/svelte/button';
 *
 *   let primaryBg = submitBackgroundToken;
 *   let primaryText = submitTextToken;
 *
 *   function handleClick() {
 *     console.log('Clicked!');
 *   }
 * </script>
 *
 * <Button
 *   label="Submit"
 *   backgroundColor={primaryBg}
 *   textColor={primaryText}
 *   on:click={handleClick}
 * />
 * ```
 *
 * # Example 2: ButtonWithVariant (preferred)
 * ```svelte
 * <script lang="ts">
 *   import { ButtonWithVariant } from '@momoto/ui-adapters/svelte/button';
 *
 *   function handleClick() {
 *     console.log('Clicked!');
 *   }
 * </script>
 *
 * <ButtonWithVariant
 *   label="Submit"
 *   variant="primary"
 *   on:click={handleClick}
 * />
 * ```
 *
 * # Example 3: With icon
 * ```svelte
 * <script lang="ts">
 *   import { ButtonWithVariant } from '@momoto/ui-adapters/svelte/button';
 *   import IconCheck from './icons/IconCheck.svelte';
 * </script>
 *
 * <ButtonWithVariant
 *   label="Save"
 *   variant="primary"
 *   icon={IconCheck}
 *   iconPosition="left"
 *   on:click={handleSave}
 * />
 * ```
 *
 * # Example 4: Loading state
 * ```svelte
 * <script lang="ts">
 *   import { ButtonWithVariant } from '@momoto/ui-adapters/svelte/button';
 *
 *   let isLoading = false;
 *
 *   async function handleSubmit() {
 *     isLoading = true;
 *     await submitForm();
 *     isLoading = false;
 *   }
 * </script>
 *
 * <ButtonWithVariant
 *   label="Submit"
 *   variant="primary"
 *   loading={isLoading}
 *   on:click={handleSubmit}
 * />
 * ```
 */
