<template>
  <button
    :type="type"
    :class="buttonOutput.classNames"
    :style="buttonOutput.styles"
    :disabled="disabled || loading"
    :aria-label="buttonOutput.ariaAttrs['aria-label']"
    :aria-describedby="buttonOutput.ariaAttrs['aria-describedby']"
    :aria-disabled="buttonOutput.ariaAttrs['aria-disabled']"
    :data-momoto-bg-quality="showQualityWarnings ? buttonOutput.resolvedTokens.backgroundColor.qualityScore : undefined"
    :data-momoto-bg-decision="showQualityWarnings ? buttonOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined"
    :data-momoto-text-quality="showQualityWarnings ? buttonOutput.resolvedTokens.textColor.qualityScore : undefined"
    :data-momoto-wcag-ratio="showQualityWarnings ? buttonOutput.resolvedTokens.textColor.accessibility?.wcagRatio : undefined"
    :data-testid="testId"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <!-- Icon (left) -->
    <span
      v-if="icon && iconPosition === 'left'"
      :class="`${CLASS_PREFIX}__icon ${CLASS_PREFIX}__icon--left`"
      :style="{ width: `${buttonOutput.sizeConfig.iconSize}px`, height: `${buttonOutput.sizeConfig.iconSize}px` }"
      aria-hidden="true"
    >
      <slot name="icon-left">
        <component :is="icon" />
      </slot>
    </span>

    <!-- Label -->
    <span :class="`${CLASS_PREFIX}__label`">
      {{ label }}
    </span>

    <!-- Icon (right) -->
    <span
      v-if="icon && iconPosition === 'right'"
      :class="`${CLASS_PREFIX}__icon ${CLASS_PREFIX}__icon--right`"
      :style="{ width: `${buttonOutput.sizeConfig.iconSize}px`, height: `${buttonOutput.sizeConfig.iconSize}px` }"
      aria-hidden="true"
    >
      <slot name="icon-right">
        <component :is="icon" />
      </slot>
    </span>

    <!-- Loading indicator -->
    <span
      v-if="loading"
      :class="`${CLASS_PREFIX}__spinner`"
      aria-label="Loading"
      :style="{
        position: 'absolute',
        width: `${buttonOutput.sizeConfig.iconSize}px`,
        height: `${buttonOutput.sizeConfig.iconSize}px`,
      }"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :style="{ animation: 'spin 1s linear infinite' }"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="32 16"
        />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * @fileoverview Vue Button Adapter - FASE 13 Multi-Framework
 *
 * Vue 3 adapter for ButtonCore.
 * This is a THIN wrapper that delegates all logic to ButtonCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to ButtonCore)
 * - ✅ 100% token-driven (via ButtonCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/vue/button
 * @version 1.0.0
 */

import { ref, computed, watch } from 'vue';
import { ButtonCore, CLASS_PREFIX } from '../../core/button';
import type { ButtonProps } from './types';

// ============================================================================
// PROPS
// ============================================================================

const props = withDefaults(defineProps<ButtonProps>(), {
  // Content
  iconPosition: 'left',

  // Behavior
  type: 'button',
  disabled: false,
  loading: false,

  // Layout
  size: 'md',
  fullWidth: false,

  // Dev mode
  showQualityWarnings: import.meta.env.DEV,
});

// ============================================================================
// EMITS
// ============================================================================

const emit = defineEmits<{
  click: [];
}>();

// ============================================================================
// STATE (Vue-specific)
// ============================================================================

const isHovered = ref(false);
const isFocused = ref(false);
const isActive = ref(false);

// ============================================================================
// BUTTON CORE INTEGRATION
// ============================================================================

/**
 * Process button logic via ButtonCore.
 *
 * This computed property delegates ALL logic to ButtonCore.processButton().
 * NO logic duplication - pure delegation.
 */
const buttonOutput = computed(() => {
  return ButtonCore.processButton({
    // Tokens
    tokens: {
      backgroundColor: props.backgroundColor,
      textColor: props.textColor,
      borderColor: props.borderColor,
      hoverBackgroundColor: props.hoverBackgroundColor,
      hoverTextColor: props.hoverTextColor,
      hoverBorderColor: props.hoverBorderColor,
      focusBackgroundColor: props.focusBackgroundColor,
      focusTextColor: props.focusTextColor,
      focusBorderColor: props.focusBorderColor,
      focusOutlineColor: props.focusOutlineColor,
      activeBackgroundColor: props.activeBackgroundColor,
      activeTextColor: props.activeTextColor,
      activeBorderColor: props.activeBorderColor,
      disabledBackgroundColor: props.disabledBackgroundColor,
      disabledTextColor: props.disabledTextColor,
      disabledBorderColor: props.disabledBorderColor,
    },

    // Interaction state
    disabled: props.disabled,
    loading: props.loading,
    isHovered: isHovered.value,
    isFocused: isFocused.value,
    isActive: isActive.value,

    // Layout
    size: props.size,
    fullWidth: props.fullWidth,
    hasIcon: !!props.icon,

    // Content
    label: props.label,

    // ARIA
    ariaLabel: props.ariaLabel,
    ariaDescribedby: props.ariaDescribedby,

    // Styles
    userStyles: props.style,

    // Dev mode
    showQualityWarnings: props.showQualityWarnings,
    customClass: props.class,
  });
});

// ============================================================================
// QUALITY WARNINGS (DEV MODE)
// ============================================================================

// Watch for quality warnings and log them
watch(
  () => buttonOutput.value.qualityWarnings,
  (warnings) => {
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        console.warn(`[Button] ${warning.message}`, warning.details);
      });
    }
  },
  { immediate: true }
);

// ============================================================================
// EVENT HANDLERS (Vue-specific)
// ============================================================================

const handleClick = () => {
  if (props.disabled || props.loading) {
    return;
  }
  emit('click');
};

const handleMouseEnter = () => {
  if (props.disabled || props.loading) {
    return;
  }
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
  isActive.value = false;
};

const handleFocus = () => {
  if (props.disabled || props.loading) {
    return;
  }
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

const handleMouseDown = () => {
  if (props.disabled || props.loading) {
    return;
  }
  isActive.value = true;
};

const handleMouseUp = () => {
  isActive.value = false;
};
</script>

<style scoped>
/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<!--
CONTRACT COMPLIANCE:

✅ Zero logic duplication
   - ALL logic delegated to ButtonCore.processButton()
   - This component is ~100 LOC (vs React's ~420 LOC)
   - Adapter is THIN wrapper

✅ 100% token-driven
   - All colors from EnrichedToken (via ButtonCore)
   - NO local color calculations

✅ State management via framework
   - Uses Vue's ref() for interaction state
   - ButtonCore handles state determination

✅ Framework-specific concerns only
   - Template rendering (Vue-specific)
   - Event handling (Vue events → ButtonCore)
   - Reactivity (Vue computed)

✅ Identical behavior to React
   - Same ButtonCore
   - Same tokens
   - Same output

EXTRACTED FROM:
- React Button.tsx (via ButtonCore)
- Now implemented in Vue 3
-->
