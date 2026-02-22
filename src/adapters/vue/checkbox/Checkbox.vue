<template>
  <label
    :style="containerStyles"
    :class="checkboxOutput.classNames"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Hidden native checkbox (for accessibility and form submission) -->
    <input
      ref="inputRef"
      type="checkbox"
      :checked="checked"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      :disabled="disabled"
      :required="required"
      :style="{
        position: 'absolute',
        opacity: 0,
        width: '1px',
        height: '1px',
        margin: '-1px',
      }"
      :aria-checked="checkboxOutput.ariaAttrs['aria-checked']"
      :aria-disabled="checkboxOutput.ariaAttrs['aria-disabled']"
      :aria-label="checkboxOutput.ariaAttrs['aria-label']"
      :aria-describedby="checkboxOutput.ariaAttrs['aria-describedby']"
      :aria-required="checkboxOutput.ariaAttrs['aria-required']"
      :aria-invalid="checkboxOutput.ariaAttrs['aria-invalid']"
      :data-momoto-bg-quality="showQualityWarnings ? checkboxOutput.resolvedTokens.backgroundColor.qualityScore : undefined"
      :data-momoto-bg-decision="showQualityWarnings ? checkboxOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined"
      :data-momoto-check-quality="showQualityWarnings ? checkboxOutput.resolvedTokens.checkColor.qualityScore : undefined"
      :data-testid="testId"
    />

    <!-- Visual checkbox box -->
    <span
      :class="`${CLASS_PREFIX}__box`"
      :style="boxStyles"
    >
      <!-- Checkmark or dash icon -->
      <svg
        v-if="showIcon"
        :class="`${CLASS_PREFIX}__icon`"
        :style="iconStyles"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          v-if="indeterminate"
          d="M4 8h8"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          v-else
          d="M3 8l3 3 7-7"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <!-- Label (optional) -->
    <span
      v-if="label"
      :class="`${CLASS_PREFIX}__label`"
      :style="labelStyles"
    >
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
/**
 * @fileoverview Vue Checkbox Adapter
 *
 * FASE 15: Component Expansion
 *
 * Vue 3 adapter for CheckboxCore.
 * This is a THIN wrapper that delegates all logic to CheckboxCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to CheckboxCore)
 * - ✅ 100% token-driven (via CheckboxCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/vue/checkbox
 * @version 1.0.0
 */

import { ref, computed, watch, onMounted } from 'vue';
import { CheckboxCore, CLASS_PREFIX } from '../../core/checkbox';
import type { CheckboxProps } from './types';

// ============================================================================
// PROPS
// ============================================================================

const props = withDefaults(defineProps<CheckboxProps>(), {
  // Check state
  checked: false,
  indeterminate: false,

  // Behavior
  disabled: false,
  required: false,
  invalid: false,

  // Layout
  size: 'md',

  // Dev mode
  showQualityWarnings: import.meta.env.DEV,
});

// ============================================================================
// EMITS
// ============================================================================

const emit = defineEmits<{
  'update:checked': [checked: boolean];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

// ============================================================================
// STATE (Vue-specific)
// ============================================================================

const isHovered = ref(false);
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

// ============================================================================
// INDETERMINATE STATE SYNC
// ============================================================================

// Sync indeterminate state with native checkbox property
watch(() => props.indeterminate, (newVal) => {
  if (inputRef.value) {
    inputRef.value.indeterminate = newVal;
  }
});

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate;
  }
});

// ============================================================================
// CHECKBOX CORE INTEGRATION
// ============================================================================

/**
 * Process checkbox logic via CheckboxCore.
 *
 * This computed property delegates ALL logic to CheckboxCore.processCheckbox().
 * NO logic duplication - pure delegation.
 */
const checkboxOutput = computed(() => {
  return CheckboxCore.processCheckbox({
    // Tokens
    tokens: {
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      checkColor: props.checkColor,
      labelColor: props.labelColor,
      hoverBackgroundColor: props.hoverBackgroundColor,
      hoverBorderColor: props.hoverBorderColor,
      focusBackgroundColor: props.focusBackgroundColor,
      focusBorderColor: props.focusBorderColor,
      focusOutlineColor: props.focusOutlineColor,
      checkedBackgroundColor: props.checkedBackgroundColor,
      checkedBorderColor: props.checkedBorderColor,
      checkedCheckColor: props.checkedCheckColor,
      checkedHoverBackgroundColor: props.checkedHoverBackgroundColor,
      checkedHoverBorderColor: props.checkedHoverBorderColor,
      checkedHoverCheckColor: props.checkedHoverCheckColor,
      checkedFocusBackgroundColor: props.checkedFocusBackgroundColor,
      checkedFocusBorderColor: props.checkedFocusBorderColor,
      checkedFocusCheckColor: props.checkedFocusCheckColor,
      checkedFocusOutlineColor: props.checkedFocusOutlineColor,
      indeterminateBackgroundColor: props.indeterminateBackgroundColor,
      indeterminateBorderColor: props.indeterminateBorderColor,
      indeterminateCheckColor: props.indeterminateCheckColor,
      indeterminateHoverBackgroundColor: props.indeterminateHoverBackgroundColor,
      indeterminateHoverBorderColor: props.indeterminateHoverBorderColor,
      indeterminateHoverCheckColor: props.indeterminateHoverCheckColor,
      indeterminateFocusBackgroundColor: props.indeterminateFocusBackgroundColor,
      indeterminateFocusBorderColor: props.indeterminateFocusBorderColor,
      indeterminateFocusCheckColor: props.indeterminateFocusCheckColor,
      indeterminateFocusOutlineColor: props.indeterminateFocusOutlineColor,
      disabledBackgroundColor: props.disabledBackgroundColor,
      disabledBorderColor: props.disabledBorderColor,
      disabledCheckColor: props.disabledCheckColor,
      disabledLabelColor: props.disabledLabelColor,
      checkedDisabledBackgroundColor: props.checkedDisabledBackgroundColor,
      checkedDisabledBorderColor: props.checkedDisabledBorderColor,
      checkedDisabledCheckColor: props.checkedDisabledCheckColor,
      indeterminateDisabledBackgroundColor: props.indeterminateDisabledBackgroundColor,
      indeterminateDisabledBorderColor: props.indeterminateDisabledBorderColor,
      indeterminateDisabledCheckColor: props.indeterminateDisabledCheckColor,
    },

    // Check state
    isChecked: props.checked,
    isIndeterminate: props.indeterminate,

    // Interaction state
    disabled: props.disabled,
    isHovered: isHovered.value,
    isFocused: isFocused.value,

    // Layout
    size: props.size,

    // Content
    label: props.label,

    // ARIA
    required: props.required,
    invalid: props.invalid,
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
  () => checkboxOutput.value.qualityWarnings,
  (warnings) => {
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        console.warn(`[Checkbox] ${warning.message}`, warning.details);
      });
    }
  },
  { immediate: true }
);

// ============================================================================
// COMPUTED STYLES
// ============================================================================

const containerStyles = computed(() => ({
  display: checkboxOutput.value.styles.containerDisplay,
  alignItems: checkboxOutput.value.styles.containerAlignItems,
  gap: `${checkboxOutput.value.styles.containerGap}px`,
  cursor: checkboxOutput.value.styles.containerCursor,
  opacity: checkboxOutput.value.styles.containerOpacity,
}));

const boxStyles = computed(() => {
  const styles: Record<string, string | number> = {
    position: 'relative',
    width: `${checkboxOutput.value.styles.boxWidth}px`,
    height: `${checkboxOutput.value.styles.boxHeight}px`,
    backgroundColor: checkboxOutput.value.styles.boxBackgroundColor,
    borderWidth: `${checkboxOutput.value.styles.boxBorderWidth}px`,
    borderStyle: checkboxOutput.value.styles.boxBorderStyle,
    borderColor: checkboxOutput.value.styles.boxBorderColor,
    borderRadius: `${checkboxOutput.value.styles.boxBorderRadius}px`,
    display: checkboxOutput.value.styles.boxDisplay || 'inline-flex',
    alignItems: checkboxOutput.value.styles.boxAlignItems || 'center',
    justifyContent: checkboxOutput.value.styles.boxJustifyContent || 'center',
    transition: checkboxOutput.value.styles.boxTransition || 'none',
  };

  if (checkboxOutput.value.styles.outlineColor) {
    styles.outline = `${checkboxOutput.value.styles.outlineWidth}px solid ${checkboxOutput.value.styles.outlineColor}`;
    styles.outlineOffset = `${checkboxOutput.value.styles.outlineOffset}px`;
  }

  return styles;
});

const iconStyles = computed(() => ({
  width: `${checkboxOutput.value.styles.iconSize}px`,
  height: `${checkboxOutput.value.styles.iconSize}px`,
  color: checkboxOutput.value.styles.iconColor,
  display: checkboxOutput.value.styles.iconDisplay,
}));

const labelStyles = computed(() => checkboxOutput.value.styles.labelColor ? {
  fontSize: `${checkboxOutput.value.styles.labelFontSize}px`,
  color: checkboxOutput.value.styles.labelColor,
} : undefined);

const showIcon = computed(() => props.checked || props.indeterminate);

// ============================================================================
// EVENT HANDLERS (Vue-specific)
// ============================================================================

function handleChange(event: Event) {
  if (props.disabled) {
    return;
  }
  const target = event.target as HTMLInputElement;
  emit('update:checked', target.checked);
}

function handleMouseEnter() {
  if (props.disabled) {
    return;
  }
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
}

function handleFocus(event: FocusEvent) {
  if (props.disabled) {
    return;
  }
  isFocused.value = true;
  emit('focus', event);
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit('blur', event);
}
</script>

<!--
CONTRACT COMPLIANCE:

✅ Zero logic duplication
   - ALL logic delegated to CheckboxCore.processCheckbox()
   - Adapter is THIN wrapper

✅ 100% token-driven
   - All colors from EnrichedToken (via CheckboxCore)
   - NO local color calculations

✅ State management via framework
   - Uses Vue's ref() for interaction state
   - CheckboxCore handles state determination

✅ Framework-specific concerns only
   - Template rendering (Vue-specific)
   - Event handling (Vue events → CheckboxCore)
   - Reactivity (Vue computed)
   - Indeterminate state sync (Vue watch + onMounted)

✅ Identical behavior to React
   - Same CheckboxCore
   - Same tokens
   - Same output

✅ Tri-state support
   - Unchecked, checked, indeterminate
   - Proper ARIA compliance

PATTERN: Exact copy of TextField.vue adapted for Checkbox
-->
