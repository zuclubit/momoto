<template>
  <div :style="containerStyles" :class="textFieldOutput.classNames">
    <!-- Label (optional) -->
    <label
      v-if="label"
      :class="`${CLASS_PREFIX}__label`"
      :style="labelStyles"
    >
      {{ label }}
      <span v-if="required" aria-label="required"> *</span>
    </label>

    <!-- Input (single-line) -->
    <input
      v-if="!multiline"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="`${CLASS_PREFIX}__input`"
      :style="inputStyles"
      :aria-label="textFieldOutput.ariaAttrs['aria-label']"
      :aria-describedby="textFieldOutput.ariaAttrs['aria-describedby']"
      :aria-disabled="textFieldOutput.ariaAttrs['aria-disabled']"
      :aria-invalid="textFieldOutput.ariaAttrs['aria-invalid']"
      :aria-required="textFieldOutput.ariaAttrs['aria-required']"
      :data-momoto-bg-quality="showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.qualityScore : undefined"
      :data-momoto-bg-decision="showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined"
      :data-momoto-text-quality="showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.qualityScore : undefined"
      :data-momoto-wcag-ratio="showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.accessibility?.wcagRatio : undefined"
      :data-testid="testId"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >

    <!-- Textarea (multiline) -->
    <textarea
      v-else
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="`${CLASS_PREFIX}__input ${CLASS_PREFIX}__input--multiline`"
      :style="inputStyles"
      :aria-label="textFieldOutput.ariaAttrs['aria-label']"
      :aria-describedby="textFieldOutput.ariaAttrs['aria-describedby']"
      :aria-disabled="textFieldOutput.ariaAttrs['aria-disabled']"
      :aria-invalid="textFieldOutput.ariaAttrs['aria-invalid']"
      :aria-required="textFieldOutput.ariaAttrs['aria-required']"
      :data-momoto-bg-quality="showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.qualityScore : undefined"
      :data-momoto-bg-decision="showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined"
      :data-momoto-text-quality="showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.qualityScore : undefined"
      :data-momoto-wcag-ratio="showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.accessibility?.wcagRatio : undefined"
      :data-testid="testId"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    />

    <!-- Helper text (optional) -->
    <div
      v-if="helperText"
      :class="`${CLASS_PREFIX}__helper`"
      :style="helperStyles"
    >
      {{ helperText }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview Vue TextField Adapter
 *
 * FASE 15: Component Expansion
 *
 * Vue 3 adapter for TextFieldCore.
 * This is a THIN wrapper that delegates all logic to TextFieldCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to TextFieldCore)
 * - ✅ 100% token-driven (via TextFieldCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/vue/textfield
 * @version 1.0.0
 */

import { ref, computed, watch } from 'vue';
import { TextFieldCore, CLASS_PREFIX } from '../../core/textfield';
import type { TextFieldProps } from './types';

// ============================================================================
// PROPS
// ============================================================================

const props = withDefaults(defineProps<TextFieldProps>(), {
  // Behavior
  disabled: false,
  error: false,
  success: false,
  required: false,
  type: 'text',

  // Layout
  size: 'md',
  fullWidth: false,
  multiline: false,
  rows: 3,

  // Dev mode
  showQualityWarnings: import.meta.env.DEV,
});

// ============================================================================
// EMITS
// ============================================================================

const emit = defineEmits<{
  'update:value': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

// ============================================================================
// STATE (Vue-specific)
// ============================================================================

const isHovered = ref(false);
const isFocused = ref(false);

// ============================================================================
// TEXTFIELD CORE INTEGRATION
// ============================================================================

/**
 * Process text field logic via TextFieldCore.
 *
 * This computed property delegates ALL logic to TextFieldCore.processTextField().
 * NO logic duplication - pure delegation.
 */
const textFieldOutput = computed(() => {
  return TextFieldCore.processTextField({
    // Tokens
    tokens: {
      backgroundColor: props.backgroundColor,
      textColor: props.textColor,
      borderColor: props.borderColor,
      placeholderColor: props.placeholderColor,
      labelColor: props.labelColor,
      helperTextColor: props.helperTextColor,
      hoverBackgroundColor: props.hoverBackgroundColor,
      hoverBorderColor: props.hoverBorderColor,
      focusBackgroundColor: props.focusBackgroundColor,
      focusBorderColor: props.focusBorderColor,
      errorBackgroundColor: props.errorBackgroundColor,
      errorTextColor: props.errorTextColor,
      errorBorderColor: props.errorBorderColor,
      errorLabelColor: props.errorLabelColor,
      errorHelperTextColor: props.errorHelperTextColor,
      successBackgroundColor: props.successBackgroundColor,
      successTextColor: props.successTextColor,
      successBorderColor: props.successBorderColor,
      successLabelColor: props.successLabelColor,
      successHelperTextColor: props.successHelperTextColor,
      disabledBackgroundColor: props.disabledBackgroundColor,
      disabledTextColor: props.disabledTextColor,
      disabledBorderColor: props.disabledBorderColor,
      disabledLabelColor: props.disabledLabelColor,
    },

    // Interaction state
    disabled: props.disabled,
    error: props.error,
    success: props.success,
    isHovered: isHovered.value,
    isFocused: isFocused.value,

    // Layout
    size: props.size,
    fullWidth: props.fullWidth,
    multiline: props.multiline,

    // Content
    label: props.label,
    helperText: props.helperText,

    // ARIA
    required: props.required,
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
  () => textFieldOutput.value.qualityWarnings,
  (warnings) => {
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        console.warn(`[TextField] ${warning.message}`, warning.details);
      });
    }
  },
  { immediate: true }
);

// ============================================================================
// COMPUTED STYLES
// ============================================================================

const containerStyles = computed(() => ({
  width: textFieldOutput.value.styles.containerWidth,
  display: textFieldOutput.value.styles.containerDisplay,
  flexDirection: textFieldOutput.value.styles.containerFlexDirection,
  gap: `${textFieldOutput.value.styles.containerGap}px`,
}));

const inputStyles = computed(() => ({
  height: props.multiline ? 'auto' : `${textFieldOutput.value.styles.inputHeight}px`,
  paddingLeft: `${textFieldOutput.value.styles.inputPaddingLeft}px`,
  paddingRight: `${textFieldOutput.value.styles.inputPaddingRight}px`,
  paddingTop: `${textFieldOutput.value.styles.inputPaddingTop}px`,
  paddingBottom: `${textFieldOutput.value.styles.inputPaddingBottom}px`,
  fontSize: `${textFieldOutput.value.styles.inputFontSize}px`,
  fontWeight: textFieldOutput.value.styles.inputFontWeight,
  lineHeight: textFieldOutput.value.styles.inputLineHeight,
  fontFamily: textFieldOutput.value.styles.inputFontFamily,
  backgroundColor: textFieldOutput.value.styles.inputBackgroundColor,
  color: textFieldOutput.value.styles.inputColor,
  borderRadius: `${textFieldOutput.value.styles.inputBorderRadius}px`,
  outline: textFieldOutput.value.styles.inputOutline,
  cursor: textFieldOutput.value.styles.inputCursor,
  transition: textFieldOutput.value.styles.inputTransition,
  borderWidth: textFieldOutput.value.styles.inputBorderWidth ? `${textFieldOutput.value.styles.inputBorderWidth}px` : undefined,
  borderStyle: textFieldOutput.value.styles.inputBorderStyle,
  borderColor: textFieldOutput.value.styles.inputBorderColor,
}));

const labelStyles = computed(() => textFieldOutput.value.styles.labelColor ? {
  fontSize: `${textFieldOutput.value.styles.labelFontSize}px`,
  fontWeight: textFieldOutput.value.styles.labelFontWeight,
  color: textFieldOutput.value.styles.labelColor,
  marginBottom: `${textFieldOutput.value.styles.labelMarginBottom}px`,
} : undefined);

const helperStyles = computed(() => textFieldOutput.value.styles.helperColor ? {
  fontSize: `${textFieldOutput.value.styles.helperFontSize}px`,
  color: textFieldOutput.value.styles.helperColor,
  marginTop: `${textFieldOutput.value.styles.helperMarginTop}px`,
} : undefined);

// ============================================================================
// EVENT HANDLERS (Vue-specific)
// ============================================================================

const handleInput = (event: Event) => {
  if (props.disabled) {
    return;
  }
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:value', target.value);
};

const handleMouseEnter = () => {
  if (props.disabled) {
    return;
  }
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
};

const handleFocus = (event: FocusEvent) => {
  if (props.disabled) {
    return;
  }
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};
</script>

<!--
CONTRACT COMPLIANCE:

✅ Zero logic duplication
   - ALL logic delegated to TextFieldCore.processTextField()
   - Adapter is THIN wrapper

✅ 100% token-driven
   - All colors from EnrichedToken (via TextFieldCore)
   - NO local color calculations

✅ State management via framework
   - Uses Vue's ref() for interaction state
   - TextFieldCore handles state determination

✅ Framework-specific concerns only
   - Template rendering (Vue-specific)
   - Event handling (Vue events → TextFieldCore)
   - Reactivity (Vue computed)

✅ Identical behavior to React
   - Same TextFieldCore
   - Same tokens
   - Same output

PATTERN: Exact copy of Button.vue adapted for TextField
-->
