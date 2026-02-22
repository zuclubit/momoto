<script lang="ts">
/**
 * @fileoverview ButtonWithVariant - Svelte Adapter with Theme Variant
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Svelte Button that resolves tokens from theme based on variant.
 * This is the preferred API for most use cases.
 *
 * @module momoto-ui/adapters/svelte/button/ButtonWithVariant
 * @version 1.0.0
 */

import { getContext } from 'svelte';
import Button from './Button.svelte';
import type { ButtonWithVariantProps } from './types';
import type { TokenTheme } from '../../../components/primitives/tokens/TokenTheme.types';

// ============================================================================
// PROPS
// ============================================================================

export let variant: ButtonWithVariantProps['variant'] = 'primary';

// Re-export all other props from Button (except tokens)
export let label: ButtonWithVariantProps['label'];
export let icon: ButtonWithVariantProps['icon'] = undefined;
export let iconPosition: ButtonWithVariantProps['iconPosition'] = 'left';
export let type: ButtonWithVariantProps['type'] = 'button';
export let disabled: ButtonWithVariantProps['disabled'] = false;
export let loading: ButtonWithVariantProps['loading'] = false;
export let size: ButtonWithVariantProps['size'] = 'md';
export let fullWidth: ButtonWithVariantProps['fullWidth'] = false;
let className: ButtonWithVariantProps['class'] = undefined;
export { className as class };
export let style: ButtonWithVariantProps['style'] = undefined;
export let ariaLabel: ButtonWithVariantProps['ariaLabel'] = undefined;
export let ariaDescribedby: ButtonWithVariantProps['ariaDescribedby'] = undefined;
export let testId: ButtonWithVariantProps['testId'] = undefined;
export let showQualityWarnings: ButtonWithVariantProps['showQualityWarnings'] = true;

// ============================================================================
// THEME CONTEXT
// ============================================================================

/**
 * Get theme from context.
 *
 * In Svelte, the theme is provided via setContext/getContext:
 * ```ts
 * // In TokenProvider.svelte
 * setContext('momoto-theme', theme);
 * ```
 */
const theme = getContext<TokenTheme>('momoto-theme');

if (!theme) {
  throw new Error('[ButtonWithVariant] No theme found. Wrap your app with TokenProvider.');
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

/**
 * Resolve tokens from theme based on variant.
 */
$: tokens = (() => {
  const variantTokens = theme.button[variant];

  if (!variantTokens) {
    throw new Error(`[ButtonWithVariant] Invalid variant: ${variant}`);
  }

  return variantTokens;
})();
</script>

<Button
  {label}
  {icon}
  {iconPosition}
  {type}
  {disabled}
  {loading}
  {size}
  {fullWidth}
  class={className}
  {style}
  {ariaLabel}
  {ariaDescribedby}
  {testId}
  {showQualityWarnings}
  backgroundColor={tokens.background}
  textColor={tokens.text}
  borderColor={tokens.border}
  hoverBackgroundColor={tokens.hover.background}
  hoverTextColor={tokens.hover.text}
  hoverBorderColor={tokens.hover.border}
  focusBackgroundColor={tokens.focus.background}
  focusTextColor={tokens.focus.text}
  focusBorderColor={tokens.focus.border}
  focusOutlineColor={tokens.focus.outline}
  activeBackgroundColor={tokens.active.background}
  activeTextColor={tokens.active.text}
  activeBorderColor={tokens.active.border}
  disabledBackgroundColor={tokens.disabled.background}
  disabledTextColor={tokens.disabled.text}
  disabledBorderColor={tokens.disabled.border}
  on:click
>
  <!-- Forward icon slots -->
  <slot name="icon-left" slot="icon-left" />
  <slot name="icon-right" slot="icon-right" />
</Button>

<!--
CONTRACT COMPLIANCE:

✅ Token resolution from theme
   - Accesses theme.button[variant]
   - Passes resolved tokens to Button

✅ Zero logic duplication
   - Delegates to Button component
   - Button delegates to ButtonCore

✅ Framework-specific theme access
   - Uses Svelte's getContext
   - Same contract as React's useTokenTheme()

USAGE EXAMPLE:

```svelte
<script>
  import { ButtonWithVariant } from '@momoto/ui-adapters/svelte/button';

  function handleSubmit() {
    console.log('Submitted!');
  }
</script>

<ButtonWithVariant
  label="Submit"
  variant="primary"
  on:click={handleSubmit}
/>
```
-->
