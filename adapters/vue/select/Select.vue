<script setup lang="ts" generic="T = string">
/**
 * @fileoverview Vue Select Adapter
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Vue adapter for SelectCore.
 * This is a THIN wrapper that delegates all logic to SelectCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to SelectCore)
 * - ✅ 100% token-driven (via SelectCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/vue/select
 * @version 1.0.0
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { SelectCore, CLASS_PREFIX } from '../../core/select';
import type { SelectProps } from './types';
import type { SelectOption } from '../../core/select';

// ──────────────────────────────────────────────────────────────────────────
// PROPS
// ──────────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<SelectProps<T>>(), {
  disabled: false,
  required: false,
  error: false,
  size: 'md',
  showQualityWarnings: true,
});

// ──────────────────────────────────────────────────────────────────────────
// EMITS
// ──────────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  'update:value': [value: T | null];
}>();

// ──────────────────────────────────────────────────────────────────────────
// STATE (Vue-specific)
// ──────────────────────────────────────────────────────────────────────────

const isOpen = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);
const highlightedValue = ref<T | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

// ──────────────────────────────────────────────────────────────────────────
// SELECT CORE INTEGRATION
// ──────────────────────────────────────────────────────────────────────────

const selectOutput = computed(() =>
  SelectCore.processSelect<T>({
    tokens: {
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      textColor: props.textColor,
      placeholderColor: props.placeholderColor,
      iconColor: props.iconColor,
      hoverBackgroundColor: props.hoverBackgroundColor,
      hoverBorderColor: props.hoverBorderColor,
      hoverTextColor: props.hoverTextColor,
      hoverIconColor: props.hoverIconColor,
      focusBackgroundColor: props.focusBackgroundColor,
      focusBorderColor: props.focusBorderColor,
      focusTextColor: props.focusTextColor,
      focusOutlineColor: props.focusOutlineColor,
      focusIconColor: props.focusIconColor,
      openBackgroundColor: props.openBackgroundColor,
      openBorderColor: props.openBorderColor,
      openTextColor: props.openTextColor,
      openOutlineColor: props.openOutlineColor,
      openIconColor: props.openIconColor,
      openHoverBackgroundColor: props.openHoverBackgroundColor,
      openHoverBorderColor: props.openHoverBorderColor,
      openFocusBackgroundColor: props.openFocusBackgroundColor,
      openFocusBorderColor: props.openFocusBorderColor,
      openFocusOutlineColor: props.openFocusOutlineColor,
      disabledBackgroundColor: props.disabledBackgroundColor,
      disabledBorderColor: props.disabledBorderColor,
      disabledTextColor: props.disabledTextColor,
      disabledPlaceholderColor: props.disabledPlaceholderColor,
      disabledLabelColor: props.disabledLabelColor,
      disabledIconColor: props.disabledIconColor,
      errorBackgroundColor: props.errorBackgroundColor,
      errorBorderColor: props.errorBorderColor,
      errorTextColor: props.errorTextColor,
      errorMessageColor: props.errorMessageColor,
      errorIconColor: props.errorIconColor,
      errorHoverBackgroundColor: props.errorHoverBackgroundColor,
      errorHoverBorderColor: props.errorHoverBorderColor,
      errorFocusBackgroundColor: props.errorFocusBackgroundColor,
      errorFocusBorderColor: props.errorFocusBorderColor,
      errorFocusOutlineColor: props.errorFocusOutlineColor,
      labelColor: props.labelColor,
      helperTextColor: props.helperTextColor,
      dropdownBackgroundColor: props.dropdownBackgroundColor,
      dropdownBorderColor: props.dropdownBorderColor,
      dropdownShadowColor: props.dropdownShadowColor,
      optionTextColor: props.optionTextColor,
      optionHoverBackgroundColor: props.optionHoverBackgroundColor,
      optionHoverTextColor: props.optionHoverTextColor,
      optionSelectedBackgroundColor: props.optionSelectedBackgroundColor,
      optionSelectedTextColor: props.optionSelectedTextColor,
      optionDisabledTextColor: props.optionDisabledTextColor,
      optionDisabledBackgroundColor: props.optionDisabledBackgroundColor,
    },
    options: props.options,
    value: props.value,
    placeholder: props.placeholder,
    isOpen: isOpen.value,
    highlightedValue: highlightedValue.value,
    disabled: props.disabled,
    isHovered: isHovered.value,
    isFocused: isFocused.value,
    hasError: props.error,
    size: props.size,
    label: props.label,
    helperText: props.helperText,
    errorMessage: props.errorMessage,
    required: props.required,
    ariaLabel: props.ariaLabel,
    ariaDescribedby: props.ariaDescribedby,
    ariaLabelledby: props.ariaLabelledby,
    userStyles: props.style,
    customClass: props.class,
    showQualityWarnings: props.showQualityWarnings,
  })
);

// ──────────────────────────────────────────────────────────────────────────
// QUALITY WARNINGS
// ──────────────────────────────────────────────────────────────────────────

watch(
  () => selectOutput.value.qualityWarnings,
  (warnings) => {
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        console.warn(`[Select] ${warning.message}`, warning.details);
      });
    }
  }
);

// ──────────────────────────────────────────────────────────────────────────
// CLOSE ON OUTSIDE CLICK
// ──────────────────────────────────────────────────────────────────────────

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

// ──────────────────────────────────────────────────────────────────────────
// EVENT HANDLERS
// ──────────────────────────────────────────────────────────────────────────

const handleFieldClick = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const handleOptionClick = (optionValue: T, optionDisabled?: boolean) => {
  if (props.disabled || optionDisabled) return;
  emit('update:value', optionValue);
  isOpen.value = false;
};

// ──────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────

const getOptionStyle = (option: SelectOption<T>, isHighlighted: boolean) => {
  const isSelected = option.value === props.value;
  let bgColor = 'transparent';
  let txtColor = selectOutput.value.styles.optionTextColor;

  if (option.disabled) {
    bgColor = selectOutput.value.styles.optionDisabledBackgroundColor;
    txtColor = selectOutput.value.styles.optionDisabledTextColor;
  } else if (isSelected) {
    bgColor = selectOutput.value.styles.optionSelectedBackgroundColor;
    txtColor = selectOutput.value.styles.optionSelectedTextColor;
  } else if (isHighlighted) {
    bgColor = selectOutput.value.styles.optionHoverBackgroundColor;
    txtColor = selectOutput.value.styles.optionHoverTextColor;
  }

  return {
    padding: `${selectOutput.value.styles.optionPaddingY}px ${selectOutput.value.styles.optionPaddingX}px`,
    fontSize: `${selectOutput.value.styles.optionFontSize}px`,
    color: txtColor,
    backgroundColor: bgColor,
    cursor: option.disabled ? selectOutput.value.styles.optionDisabledCursor : selectOutput.value.styles.optionCursor,
    transition: selectOutput.value.styles.optionTransition,
    opacity: option.disabled ? selectOutput.value.styles.optionDisabledOpacity : 1,
  };
};

const displayHelperText = computed(() =>
  props.error && props.errorMessage ? props.errorMessage : props.helperText
);
</script>

<template>
  <div ref="containerRef" :class="selectOutput.classNames" :style="{
    display: selectOutput.styles.containerDisplay,
    flexDirection: selectOutput.styles.containerFlexDirection,
    gap: `${selectOutput.styles.containerGap}px`,
  }">
    <!-- Label -->
    <label v-if="label" :class="`${CLASS_PREFIX}__label`" :style="{
      display: selectOutput.styles.labelDisplay,
      fontSize: `${selectOutput.styles.labelFontSize}px`,
      color: selectOutput.styles.labelColor,
      fontWeight: selectOutput.styles.labelFontWeight,
    }">
      {{ label }}<template v-if="required"> *</template>
    </label>

    <!-- Field -->
    <div
      :role="selectOutput.ariaAttrs.role"
      :aria-expanded="selectOutput.ariaAttrs['aria-expanded']"
      :aria-controls="selectOutput.ariaAttrs['aria-controls']"
      :aria-activedescendant="selectOutput.ariaAttrs['aria-activedescendant']"
      :aria-disabled="selectOutput.ariaAttrs['aria-disabled']"
      :aria-required="selectOutput.ariaAttrs['aria-required']"
      :aria-invalid="selectOutput.ariaAttrs['aria-invalid']"
      :aria-label="selectOutput.ariaAttrs['aria-label']"
      :aria-describedby="selectOutput.ariaAttrs['aria-describedby']"
      :aria-labelledby="selectOutput.ariaAttrs['aria-labelledby']"
      :tabindex="disabled ? -1 : 0"
      :class="`${CLASS_PREFIX}__field`"
      :data-testid="testId"
      :style="{
        position: selectOutput.styles.fieldPosition,
        display: selectOutput.styles.fieldDisplay,
        alignItems: selectOutput.styles.fieldAlignItems,
        justifyContent: selectOutput.styles.fieldJustifyContent,
        height: `${selectOutput.styles.fieldHeight}px`,
        padding: `0 ${selectOutput.styles.fieldPaddingX}px`,
        backgroundColor: selectOutput.styles.fieldBackgroundColor,
        borderWidth: `${selectOutput.styles.fieldBorderWidth}px`,
        borderStyle: selectOutput.styles.fieldBorderStyle,
        borderColor: selectOutput.styles.fieldBorderColor,
        borderRadius: `${selectOutput.styles.fieldBorderRadius}px`,
        color: selectOutput.styles.fieldTextColor,
        fontSize: `${selectOutput.styles.fieldFontSize}px`,
        cursor: selectOutput.styles.fieldCursor,
        transition: selectOutput.styles.fieldTransition,
        opacity: selectOutput.styles.fieldOpacity,
        outline: selectOutput.styles.outlineColor ? `${selectOutput.styles.outlineWidth}px solid ${selectOutput.styles.outlineColor}` : 'none',
        outlineOffset: `${selectOutput.styles.outlineOffset}px`,
      }"
      @click="handleFieldClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <!-- Display value -->
      <span :class="`${CLASS_PREFIX}__value`" :style="{
        color: selectOutput.selectedOption ? selectOutput.styles.fieldTextColor : selectOutput.styles.placeholderColor,
        flex: 1,
      }">
        {{ selectOutput.displayValue }}
      </span>

      <!-- Chevron icon -->
      <svg :class="`${CLASS_PREFIX}__icon`" :style="{
        width: `${selectOutput.styles.iconSize}px`,
        height: `${selectOutput.styles.iconSize}px`,
        color: selectOutput.styles.iconColor,
        transform: selectOutput.styles.iconTransform,
        transition: selectOutput.styles.fieldTransition,
        flexShrink: 0,
      }" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- Dropdown -->
      <div v-if="isOpen && !disabled" :id="selectOutput.ariaAttrs['aria-controls']" role="listbox" :class="`${CLASS_PREFIX}__dropdown`" :style="{
        position: selectOutput.styles.dropdownPosition,
        top: selectOutput.styles.dropdownTop,
        left: selectOutput.styles.dropdownLeft,
        right: selectOutput.styles.dropdownRight,
        zIndex: selectOutput.styles.dropdownZIndex,
        backgroundColor: selectOutput.styles.dropdownBackgroundColor,
        borderWidth: `${selectOutput.styles.dropdownBorderWidth}px`,
        borderStyle: selectOutput.styles.dropdownBorderStyle,
        borderColor: selectOutput.styles.dropdownBorderColor,
        borderRadius: `${selectOutput.styles.dropdownBorderRadius}px`,
        boxShadow: selectOutput.styles.dropdownBoxShadow,
        maxHeight: `${selectOutput.styles.dropdownMaxHeight}px`,
        overflowY: selectOutput.styles.dropdownOverflowY,
      }">
        <div
          v-for="option in options"
          :key="String(option.value)"
          :id="`momoto-select-option-${String(option.value)}`"
          role="option"
          :aria-selected="option.value === value"
          :aria-disabled="option.disabled"
          :class="`${CLASS_PREFIX}__option`"
          :style="getOptionStyle(option, highlightedValue === option.value)"
          @click="handleOptionClick(option.value, option.disabled)"
          @mouseenter="highlightedValue = option.value"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- Helper text -->
    <span v-if="displayHelperText" :class="`${CLASS_PREFIX}__helper`" :style="{
      display: selectOutput.styles.helperDisplay,
      fontSize: `${selectOutput.styles.helperFontSize}px`,
      color: selectOutput.styles.helperColor,
    }">
      {{ displayHelperText }}
    </span>
  </div>
</template>
