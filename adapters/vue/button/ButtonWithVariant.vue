<script setup lang="ts">
/**
 * @fileoverview ButtonWithVariant - Vue Adapter with Theme Variant
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Vue Button that resolves tokens from theme based on variant.
 * This is the preferred API for most use cases.
 *
 * @module momoto-ui/adapters/vue/button/ButtonWithVariant
 * @version 1.0.0
 */

import { inject, computed } from 'vue';
import Button from './Button.vue';
import type { ButtonWithVariantProps } from './types';
import type { TokenTheme } from '../../../components/primitives/tokens/TokenTheme.types';

// ============================================================================
// PROPS
// ============================================================================

const props = withDefaults(defineProps<ButtonWithVariantProps>(), {
  variant: 'primary',
});

// ============================================================================
// EMITS
// ============================================================================

const emit = defineEmits<{
  click: [];
}>();

// ============================================================================
// THEME INJECTION
// ============================================================================

/**
 * Inject theme from TokenProvider.
 *
 * In Vue, the theme is provided via provide/inject:
 * ```ts
 * // In TokenProvider.vue
 * provide('momoto-theme', theme);
 * ```
 */
const theme = inject<TokenTheme>('momoto-theme');

if (!theme) {
  throw new Error('[ButtonWithVariant] No theme found. Wrap your app with TokenProvider.');
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

/**
 * Resolve tokens from theme based on variant.
 */
const tokens = computed(() => {
  const variantTokens = theme.button[props.variant];

  if (!variantTokens) {
    throw new Error(`[ButtonWithVariant] Invalid variant: ${props.variant}`);
  }

  return variantTokens;
});

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <Button
    v-bind="props"
    :backgroundColor="tokens.background"
    :textColor="tokens.text"
    :borderColor="tokens.border"
    :hoverBackgroundColor="tokens.hover.background"
    :hoverTextColor="tokens.hover.text"
    :hoverBorderColor="tokens.hover.border"
    :focusBackgroundColor="tokens.focus.background"
    :focusTextColor="tokens.focus.text"
    :focusBorderColor="tokens.focus.border"
    :focusOutlineColor="tokens.focus.outline"
    :activeBackgroundColor="tokens.active.background"
    :activeTextColor="tokens.active.text"
    :activeBorderColor="tokens.active.border"
    :disabledBackgroundColor="tokens.disabled.background"
    :disabledTextColor="tokens.disabled.text"
    :disabledBorderColor="tokens.disabled.border"
    @click="handleClick"
  >
    <!-- Forward icon slots -->
    <template v-if="$slots['icon-left']" #icon-left>
      <slot name="icon-left" />
    </template>
    <template v-if="$slots['icon-right']" #icon-right>
      <slot name="icon-right" />
    </template>
  </Button>
</template>

<!--
CONTRACT COMPLIANCE:

✅ Token resolution from theme
   - Accesses theme.button[variant]
   - Passes resolved tokens to Button

✅ Zero logic duplication
   - Delegates to Button component
   - Button delegates to ButtonCore

✅ Framework-specific theme access
   - Uses Vue's provide/inject
   - Same contract as React's useTokenTheme()

USAGE EXAMPLE:

```vue
<script setup>
import { ButtonWithVariant } from '@momoto/ui-adapters/vue/button';
</script>

<template>
  <ButtonWithVariant
    label="Submit"
    variant="primary"
    @click="handleSubmit"
  />
</template>
```
-->
