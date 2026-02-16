<script lang="ts">
/**
 * @fileoverview Svelte Select Adapter
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Svelte adapter for SelectCore.
 * This is a THIN wrapper that delegates all logic to SelectCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to SelectCore)
 * - ✅ 100% token-driven (via SelectCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/svelte/select
 * @version 1.0.0
 */

import { onMount, onDestroy, createEventDispatcher } from 'svelte';
import { SelectCore, CLASS_PREFIX } from '../../core/select';
import type { SelectProps } from './types';

export let options: SelectProps['options'];
export let value: SelectProps['value'];
export let placeholder: SelectProps['placeholder'] = undefined;

export let backgroundColor: SelectProps['backgroundColor'];
export let borderColor: SelectProps['borderColor'];
export let textColor: SelectProps['textColor'];
export let placeholderColor: SelectProps['placeholderColor'] = undefined;
export let iconColor: SelectProps['iconColor'] = undefined;

export let hoverBackgroundColor: SelectProps['hoverBackgroundColor'] = undefined;
export let hoverBorderColor: SelectProps['hoverBorderColor'] = undefined;
export let hoverTextColor: SelectProps['hoverTextColor'] = undefined;
export let hoverIconColor: SelectProps['hoverIconColor'] = undefined;

export let focusBackgroundColor: SelectProps['focusBackgroundColor'] = undefined;
export let focusBorderColor: SelectProps['focusBorderColor'] = undefined;
export let focusTextColor: SelectProps['focusTextColor'] = undefined;
export let focusOutlineColor: SelectProps['focusOutlineColor'] = undefined;
export let focusIconColor: SelectProps['focusIconColor'] = undefined;

export let openBackgroundColor: SelectProps['openBackgroundColor'] = undefined;
export let openBorderColor: SelectProps['openBorderColor'] = undefined;
export let openTextColor: SelectProps['openTextColor'] = undefined;
export let openOutlineColor: SelectProps['openOutlineColor'] = undefined;
export let openIconColor: SelectProps['openIconColor'] = undefined;
export let openHoverBackgroundColor: SelectProps['openHoverBackgroundColor'] = undefined;
export let openHoverBorderColor: SelectProps['openHoverBorderColor'] = undefined;
export let openFocusBackgroundColor: SelectProps['openFocusBackgroundColor'] = undefined;
export let openFocusBorderColor: SelectProps['openFocusBorderColor'] = undefined;
export let openFocusOutlineColor: SelectProps['openFocusOutlineColor'] = undefined;

export let disabledBackgroundColor: SelectProps['disabledBackgroundColor'] = undefined;
export let disabledBorderColor: SelectProps['disabledBorderColor'] = undefined;
export let disabledTextColor: SelectProps['disabledTextColor'] = undefined;
export let disabledPlaceholderColor: SelectProps['disabledPlaceholderColor'] = undefined;
export let disabledLabelColor: SelectProps['disabledLabelColor'] = undefined;
export let disabledIconColor: SelectProps['disabledIconColor'] = undefined;

export let errorBackgroundColor: SelectProps['errorBackgroundColor'] = undefined;
export let errorBorderColor: SelectProps['errorBorderColor'] = undefined;
export let errorTextColor: SelectProps['errorTextColor'] = undefined;
export let errorMessageColor: SelectProps['errorMessageColor'] = undefined;
export let errorIconColor: SelectProps['errorIconColor'] = undefined;
export let errorHoverBackgroundColor: SelectProps['errorHoverBackgroundColor'] = undefined;
export let errorHoverBorderColor: SelectProps['errorHoverBorderColor'] = undefined;
export let errorFocusBackgroundColor: SelectProps['errorFocusBackgroundColor'] = undefined;
export let errorFocusBorderColor: SelectProps['errorFocusBorderColor'] = undefined;
export let errorFocusOutlineColor: SelectProps['errorFocusOutlineColor'] = undefined;

export let labelColor: SelectProps['labelColor'] = undefined;
export let helperTextColor: SelectProps['helperTextColor'] = undefined;

export let dropdownBackgroundColor: SelectProps['dropdownBackgroundColor'];
export let dropdownBorderColor: SelectProps['dropdownBorderColor'] = undefined;
export let dropdownShadowColor: SelectProps['dropdownShadowColor'] = undefined;

export let optionTextColor: SelectProps['optionTextColor'];
export let optionHoverBackgroundColor: SelectProps['optionHoverBackgroundColor'] = undefined;
export let optionHoverTextColor: SelectProps['optionHoverTextColor'] = undefined;
export let optionSelectedBackgroundColor: SelectProps['optionSelectedBackgroundColor'] = undefined;
export let optionSelectedTextColor: SelectProps['optionSelectedTextColor'] = undefined;
export let optionDisabledTextColor: SelectProps['optionDisabledTextColor'] = undefined;
export let optionDisabledBackgroundColor: SelectProps['optionDisabledBackgroundColor'] = undefined;

export let disabled: SelectProps['disabled'] = false;
export let required: SelectProps['required'] = false;
export let error: SelectProps['error'] = false;
export let size: SelectProps['size'] = 'md';
export let label: SelectProps['label'] = undefined;
export let helperText: SelectProps['helperText'] = undefined;
export let errorMessage: SelectProps['errorMessage'] = undefined;

let className: SelectProps['class'] = undefined;
export { className as class };
export let style: SelectProps['style'] = undefined;

export let ariaLabel: SelectProps['ariaLabel'] = undefined;
export let ariaDescribedby: SelectProps['ariaDescribedby'] = undefined;
export let ariaLabelledby: SelectProps['ariaLabelledby'] = undefined;
export let testId: SelectProps['testId'] = undefined;
export let showQualityWarnings: SelectProps['showQualityWarnings'] = true;

let isOpen = false;
let isHovered = false;
let isFocused = false;
let highlightedValue = null;
let containerRef: HTMLDivElement | null = null;

const dispatch = createEventDispatcher<{ change: typeof value }>();

$: selectOutput = SelectCore.processSelect({
  tokens: {
    backgroundColor, borderColor, textColor, placeholderColor, iconColor,
    hoverBackgroundColor, hoverBorderColor, hoverTextColor, hoverIconColor,
    focusBackgroundColor, focusBorderColor, focusTextColor, focusOutlineColor, focusIconColor,
    openBackgroundColor, openBorderColor, openTextColor, openOutlineColor, openIconColor,
    openHoverBackgroundColor, openHoverBorderColor,
    openFocusBackgroundColor, openFocusBorderColor, openFocusOutlineColor,
    disabledBackgroundColor, disabledBorderColor, disabledTextColor, disabledPlaceholderColor,
    disabledLabelColor, disabledIconColor,
    errorBackgroundColor, errorBorderColor, errorTextColor, errorMessageColor, errorIconColor,
    errorHoverBackgroundColor, errorHoverBorderColor,
    errorFocusBackgroundColor, errorFocusBorderColor, errorFocusOutlineColor,
    labelColor, helperTextColor,
    dropdownBackgroundColor, dropdownBorderColor, dropdownShadowColor,
    optionTextColor, optionHoverBackgroundColor, optionHoverTextColor,
    optionSelectedBackgroundColor, optionSelectedTextColor,
    optionDisabledTextColor, optionDisabledBackgroundColor,
  },
  options, value, placeholder, isOpen, highlightedValue,
  disabled, isHovered, isFocused, hasError: error,
  size, label, helperText, errorMessage, required,
  ariaLabel, ariaDescribedby, ariaLabelledby,
  userStyles: style, customClass: className, showQualityWarnings,
});

$: if (selectOutput.qualityWarnings.length > 0) {
  selectOutput.qualityWarnings.forEach((w) => console.warn(`[Select] ${w.message}`, w.details));
}

$: displayHelperText = error && errorMessage ? errorMessage : helperText;

function handleClickOutside(event: MouseEvent) {
  if (containerRef && !containerRef.contains(event.target as Node)) {
    isOpen = false;
  }
}

onMount(() => {
  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }
});

onDestroy(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

$: if (isOpen) {
  document.addEventListener('mousedown', handleClickOutside);
} else {
  document.removeEventListener('mousedown', handleClickOutside);
}

function getOptionStyle(option: typeof options[0], isHighlighted: boolean) {
  const isSelected = option.value === value;
  let bgColor = 'transparent';
  let txtColor = selectOutput.styles.optionTextColor;

  if (option.disabled) {
    bgColor = selectOutput.styles.optionDisabledBackgroundColor;
    txtColor = selectOutput.styles.optionDisabledTextColor;
  } else if (isSelected) {
    bgColor = selectOutput.styles.optionSelectedBackgroundColor;
    txtColor = selectOutput.styles.optionSelectedTextColor;
  } else if (isHighlighted) {
    bgColor = selectOutput.styles.optionHoverBackgroundColor;
    txtColor = selectOutput.styles.optionHoverTextColor;
  }

  return `padding: ${selectOutput.styles.optionPaddingY}px ${selectOutput.styles.optionPaddingX}px; fontSize: ${selectOutput.styles.optionFontSize}px; color: ${txtColor}; backgroundColor: ${bgColor}; cursor: ${option.disabled ? selectOutput.styles.optionDisabledCursor : selectOutput.styles.optionCursor}; transition: ${selectOutput.styles.optionTransition}; opacity: ${option.disabled ? selectOutput.styles.optionDisabledOpacity : 1};`;
}
</script>

<div bind:this={containerRef} class={selectOutput.classNames} style="display: {selectOutput.styles.containerDisplay}; flex-direction: {selectOutput.styles.containerFlexDirection}; gap: {selectOutput.styles.containerGap}px;">
  {#if label}
    <label class="{CLASS_PREFIX}__label" style="display: {selectOutput.styles.labelDisplay}; font-size: {selectOutput.styles.labelFontSize}px; color: {selectOutput.styles.labelColor}; font-weight: {selectOutput.styles.labelFontWeight};">
      {label}{#if required} *{/if}
    </label>
  {/if}

  <div
    role={selectOutput.ariaAttrs.role}
    aria-expanded={selectOutput.ariaAttrs['aria-expanded']}
    aria-controls={selectOutput.ariaAttrs['aria-controls']}
    aria-activedescendant={selectOutput.ariaAttrs['aria-activedescendant']}
    aria-disabled={selectOutput.ariaAttrs['aria-disabled']}
    aria-required={selectOutput.ariaAttrs['aria-required']}
    aria-invalid={selectOutput.ariaAttrs['aria-invalid']}
    aria-label={selectOutput.ariaAttrs['aria-label']}
    aria-describedby={selectOutput.ariaAttrs['aria-describedby']}
    aria-labelledby={selectOutput.ariaAttrs['aria-labelledby']}
    tabindex={disabled ? -1 : 0}
    class="{CLASS_PREFIX}__field"
    data-testid={testId}
    style="position: {selectOutput.styles.fieldPosition}; display: {selectOutput.styles.fieldDisplay}; align-items: {selectOutput.styles.fieldAlignItems}; justify-content: {selectOutput.styles.fieldJustifyContent}; height: {selectOutput.styles.fieldHeight}px; padding: 0 {selectOutput.styles.fieldPaddingX}px; background-color: {selectOutput.styles.fieldBackgroundColor}; border: {selectOutput.styles.fieldBorderWidth}px {selectOutput.styles.fieldBorderStyle} {selectOutput.styles.fieldBorderColor}; border-radius: {selectOutput.styles.fieldBorderRadius}px; color: {selectOutput.styles.fieldTextColor}; font-size: {selectOutput.styles.fieldFontSize}px; cursor: {selectOutput.styles.fieldCursor}; transition: {selectOutput.styles.fieldTransition}; opacity: {selectOutput.styles.fieldOpacity}; outline: {selectOutput.styles.outlineColor ? `${selectOutput.styles.outlineWidth}px solid ${selectOutput.styles.outlineColor}` : 'none'}; outline-offset: {selectOutput.styles.outlineOffset}px;"
    on:click={() => { if (!disabled) isOpen = !isOpen; }}
    on:mouseenter={() => { if (!disabled) isHovered = true; }}
    on:mouseleave={() => isHovered = false}
    on:focus={() => { if (!disabled) isFocused = true; }}
    on:blur={() => isFocused = false}
  >
    <span class="{CLASS_PREFIX}__value" style="color: {selectOutput.selectedOption ? selectOutput.styles.fieldTextColor : selectOutput.styles.placeholderColor}; flex: 1;">
      {selectOutput.displayValue}
    </span>

    <svg class="{CLASS_PREFIX}__icon" style="width: {selectOutput.styles.iconSize}px; height: {selectOutput.styles.iconSize}px; color: {selectOutput.styles.iconColor}; transform: {selectOutput.styles.iconTransform}; transition: {selectOutput.styles.fieldTransition}; flex-shrink: 0;" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

    {#if isOpen && !disabled}
      <div id={selectOutput.ariaAttrs['aria-controls']} role="listbox" class="{CLASS_PREFIX}__dropdown" style="position: {selectOutput.styles.dropdownPosition}; top: {selectOutput.styles.dropdownTop}; left: {selectOutput.styles.dropdownLeft}; right: {selectOutput.styles.dropdownRight}; z-index: {selectOutput.styles.dropdownZIndex}; background-color: {selectOutput.styles.dropdownBackgroundColor}; border: {selectOutput.styles.dropdownBorderWidth}px {selectOutput.styles.dropdownBorderStyle} {selectOutput.styles.dropdownBorderColor}; border-radius: {selectOutput.styles.dropdownBorderRadius}px; box-shadow: {selectOutput.styles.dropdownBoxShadow}; max-height: {selectOutput.styles.dropdownMaxHeight}px; overflow-y: {selectOutput.styles.dropdownOverflowY};">
        {#each options as option (option.value)}
          <div
            id="momoto-select-option-{option.value}"
            role="option"
            aria-selected={option.value === value}
            aria-disabled={option.disabled}
            class="{CLASS_PREFIX}__option"
            style={getOptionStyle(option, highlightedValue === option.value)}
            on:click={() => { if (!disabled && !option.disabled) { value = option.value; dispatch('change', value); isOpen = false; } }}
            on:mouseenter={() => highlightedValue = option.value}
          >
            {option.label}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if displayHelperText}
    <span class="{CLASS_PREFIX}__helper" style="display: {selectOutput.styles.helperDisplay}; font-size: {selectOutput.styles.helperFontSize}px; color: {selectOutput.styles.helperColor};">
      {displayHelperText}
    </span>
  {/if}
</div>
