<script lang="ts">
/**
 * @fileoverview Svelte Checkbox Adapter
 *
 * FASE 15: Component Expansion
 *
 * Svelte adapter for CheckboxCore.
 * This is a THIN wrapper that delegates all logic to CheckboxCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to CheckboxCore)
 * - ✅ 100% token-driven (via CheckboxCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/svelte/checkbox
 * @version 1.0.0
 */

import { onMount } from 'svelte';
import { CheckboxCore, CLASS_PREFIX } from '../../core/checkbox';
import type { CheckboxProps } from './types';

// ============================================================================
// PROPS
// ============================================================================

// Check state
export let checked: CheckboxProps['checked'] = false;
export let indeterminate: CheckboxProps['indeterminate'] = false;
export let label: CheckboxProps['label'] = undefined;

// Tokens - Base
export let backgroundColor: CheckboxProps['backgroundColor'];
export let borderColor: CheckboxProps['borderColor'];
export let checkColor: CheckboxProps['checkColor'];
export let labelColor: CheckboxProps['labelColor'] = undefined;

// Tokens - Hover
export let hoverBackgroundColor: CheckboxProps['hoverBackgroundColor'] = undefined;
export let hoverBorderColor: CheckboxProps['hoverBorderColor'] = undefined;

// Tokens - Focus
export let focusBackgroundColor: CheckboxProps['focusBackgroundColor'] = undefined;
export let focusBorderColor: CheckboxProps['focusBorderColor'] = undefined;
export let focusOutlineColor: CheckboxProps['focusOutlineColor'] = undefined;

// Tokens - Checked
export let checkedBackgroundColor: CheckboxProps['checkedBackgroundColor'] = undefined;
export let checkedBorderColor: CheckboxProps['checkedBorderColor'] = undefined;
export let checkedCheckColor: CheckboxProps['checkedCheckColor'] = undefined;

export let checkedHoverBackgroundColor: CheckboxProps['checkedHoverBackgroundColor'] = undefined;
export let checkedHoverBorderColor: CheckboxProps['checkedHoverBorderColor'] = undefined;
export let checkedHoverCheckColor: CheckboxProps['checkedHoverCheckColor'] = undefined;

export let checkedFocusBackgroundColor: CheckboxProps['checkedFocusBackgroundColor'] = undefined;
export let checkedFocusBorderColor: CheckboxProps['checkedFocusBorderColor'] = undefined;
export let checkedFocusCheckColor: CheckboxProps['checkedFocusCheckColor'] = undefined;
export let checkedFocusOutlineColor: CheckboxProps['checkedFocusOutlineColor'] = undefined;

// Tokens - Indeterminate
export let indeterminateBackgroundColor: CheckboxProps['indeterminateBackgroundColor'] = undefined;
export let indeterminateBorderColor: CheckboxProps['indeterminateBorderColor'] = undefined;
export let indeterminateCheckColor: CheckboxProps['indeterminateCheckColor'] = undefined;

export let indeterminateHoverBackgroundColor: CheckboxProps['indeterminateHoverBackgroundColor'] = undefined;
export let indeterminateHoverBorderColor: CheckboxProps['indeterminateHoverBorderColor'] = undefined;
export let indeterminateHoverCheckColor: CheckboxProps['indeterminateHoverCheckColor'] = undefined;

export let indeterminateFocusBackgroundColor: CheckboxProps['indeterminateFocusBackgroundColor'] = undefined;
export let indeterminateFocusBorderColor: CheckboxProps['indeterminateFocusBorderColor'] = undefined;
export let indeterminateFocusCheckColor: CheckboxProps['indeterminateFocusCheckColor'] = undefined;
export let indeterminateFocusOutlineColor: CheckboxProps['indeterminateFocusOutlineColor'] = undefined;

// Tokens - Disabled
export let disabledBackgroundColor: CheckboxProps['disabledBackgroundColor'] = undefined;
export let disabledBorderColor: CheckboxProps['disabledBorderColor'] = undefined;
export let disabledCheckColor: CheckboxProps['disabledCheckColor'] = undefined;
export let disabledLabelColor: CheckboxProps['disabledLabelColor'] = undefined;

export let checkedDisabledBackgroundColor: CheckboxProps['checkedDisabledBackgroundColor'] = undefined;
export let checkedDisabledBorderColor: CheckboxProps['checkedDisabledBorderColor'] = undefined;
export let checkedDisabledCheckColor: CheckboxProps['checkedDisabledCheckColor'] = undefined;

export let indeterminateDisabledBackgroundColor: CheckboxProps['indeterminateDisabledBackgroundColor'] = undefined;
export let indeterminateDisabledBorderColor: CheckboxProps['indeterminateDisabledBorderColor'] = undefined;
export let indeterminateDisabledCheckColor: CheckboxProps['indeterminateDisabledCheckColor'] = undefined;

// Behavior
export let disabled: CheckboxProps['disabled'] = false;
export let required: CheckboxProps['required'] = false;
export let invalid: CheckboxProps['invalid'] = false;

// Layout
export let size: CheckboxProps['size'] = 'md';

// Styling
let className: CheckboxProps['class'] = undefined;
export { className as class };
export let style: CheckboxProps['style'] = undefined;

// Accessibility
export let ariaLabel: CheckboxProps['ariaLabel'] = undefined;
export let ariaDescribedby: CheckboxProps['ariaDescribedby'] = undefined;
export let testId: CheckboxProps['testId'] = undefined;

// Developer experience
export let showQualityWarnings: CheckboxProps['showQualityWarnings'] = true;

// ============================================================================
// STATE (Svelte-specific)
// ============================================================================

let isHovered = false;
let isFocused = false;
let inputRef: HTMLInputElement | null = null;

// ============================================================================
// INDETERMINATE STATE SYNC
// ============================================================================

// Sync indeterminate state with native checkbox property
$: if (inputRef) {
  inputRef.indeterminate = indeterminate;
}

onMount(() => {
  if (inputRef) {
    inputRef.indeterminate = indeterminate;
  }
});

// ============================================================================
// CHECKBOX CORE INTEGRATION
// ============================================================================

/**
 * Process checkbox logic via CheckboxCore.
 *
 * This reactive statement delegates ALL logic to CheckboxCore.processCheckbox().
 * NO logic duplication - pure delegation.
 */
$: checkboxOutput = CheckboxCore.processCheckbox({
  // Tokens
  tokens: {
    backgroundColor,
    borderColor,
    checkColor,
    labelColor,
    hoverBackgroundColor,
    hoverBorderColor,
    focusBackgroundColor,
    focusBorderColor,
    focusOutlineColor,
    checkedBackgroundColor,
    checkedBorderColor,
    checkedCheckColor,
    checkedHoverBackgroundColor,
    checkedHoverBorderColor,
    checkedHoverCheckColor,
    checkedFocusBackgroundColor,
    checkedFocusBorderColor,
    checkedFocusCheckColor,
    checkedFocusOutlineColor,
    indeterminateBackgroundColor,
    indeterminateBorderColor,
    indeterminateCheckColor,
    indeterminateHoverBackgroundColor,
    indeterminateHoverBorderColor,
    indeterminateHoverCheckColor,
    indeterminateFocusBackgroundColor,
    indeterminateFocusBorderColor,
    indeterminateFocusCheckColor,
    indeterminateFocusOutlineColor,
    disabledBackgroundColor,
    disabledBorderColor,
    disabledCheckColor,
    disabledLabelColor,
    checkedDisabledBackgroundColor,
    checkedDisabledBorderColor,
    checkedDisabledCheckColor,
    indeterminateDisabledBackgroundColor,
    indeterminateDisabledBorderColor,
    indeterminateDisabledCheckColor,
  },

  // Check state
  isChecked: checked,
  isIndeterminate: indeterminate,

  // Interaction state
  disabled,
  isHovered,
  isFocused,

  // Layout
  size,

  // Content
  label,

  // ARIA
  required,
  invalid,
  ariaLabel,
  ariaDescribedby,

  // Styles
  userStyles: style,

  // Dev mode
  showQualityWarnings,
  customClass: className,
});

// ============================================================================
// QUALITY WARNINGS (DEV MODE)
// ============================================================================

// Log quality warnings
$: if (checkboxOutput.qualityWarnings.length > 0) {
  checkboxOutput.qualityWarnings.forEach((warning) => {
    console.warn(`[Checkbox] ${warning.message}`, warning.details);
  });
}

// ============================================================================
// COMPUTED STYLES
// ============================================================================

$: containerStyles = [
  `display: ${checkboxOutput.styles.containerDisplay}`,
  `align-items: ${checkboxOutput.styles.containerAlignItems}`,
  `gap: ${checkboxOutput.styles.containerGap}px`,
  `cursor: ${checkboxOutput.styles.containerCursor}`,
  `opacity: ${checkboxOutput.styles.containerOpacity}`,
].join('; ');

$: boxStyles = [
  'position: relative',
  `width: ${checkboxOutput.styles.boxWidth}px`,
  `height: ${checkboxOutput.styles.boxHeight}px`,
  `background-color: ${checkboxOutput.styles.boxBackgroundColor}`,
  `border-width: ${checkboxOutput.styles.boxBorderWidth}px`,
  `border-style: ${checkboxOutput.styles.boxBorderStyle}`,
  `border-color: ${checkboxOutput.styles.boxBorderColor}`,
  `border-radius: ${checkboxOutput.styles.boxBorderRadius}px`,
  `display: ${checkboxOutput.styles.boxDisplay}`,
  `align-items: ${checkboxOutput.styles.boxAlignItems}`,
  `justify-content: ${checkboxOutput.styles.boxJustifyContent}`,
  `transition: ${checkboxOutput.styles.boxTransition}`,
  checkboxOutput.styles.outlineColor ? `outline: ${checkboxOutput.styles.outlineWidth}px solid ${checkboxOutput.styles.outlineColor}` : '',
  checkboxOutput.styles.outlineColor ? `outline-offset: ${checkboxOutput.styles.outlineOffset}px` : '',
].filter(Boolean).join('; ');

$: iconStyles = [
  `width: ${checkboxOutput.styles.iconSize}px`,
  `height: ${checkboxOutput.styles.iconSize}px`,
  `color: ${checkboxOutput.styles.iconColor}`,
  `display: ${checkboxOutput.styles.iconDisplay}`,
].join('; ');

$: labelStyles = checkboxOutput.styles.labelColor ? [
  `font-size: ${checkboxOutput.styles.labelFontSize}px`,
  `color: ${checkboxOutput.styles.labelColor}`,
].join('; ') : '';

$: showIcon = checked || indeterminate;

// ============================================================================
// EVENT HANDLERS (Svelte-specific)
// ============================================================================

import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher<{
  change: boolean;
  focus: FocusEvent;
  blur: FocusEvent;
}>();

function handleChange(event: Event) {
  if (disabled) {
    return;
  }
  const target = event.target as HTMLInputElement;
  checked = target.checked;
  dispatch('change', checked);
}

function handleMouseEnter() {
  if (disabled) {
    return;
  }
  isHovered = true;
}

function handleMouseLeave() {
  isHovered = false;
}

function handleFocus(event: FocusEvent) {
  if (disabled) {
    return;
  }
  isFocused = true;
  dispatch('focus', event);
}

function handleBlur(event: FocusEvent) {
  isFocused = false;
  dispatch('blur', event);
}
</script>

<label
  style={containerStyles}
  class={checkboxOutput.classNames}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <!-- Hidden native checkbox (for accessibility and form submission) -->
  <input
    bind:this={inputRef}
    type="checkbox"
    {checked}
    on:change={handleChange}
    on:focus={handleFocus}
    on:blur={handleBlur}
    {disabled}
    {required}
    style="position: absolute; opacity: 0; width: 1px; height: 1px; margin: -1px;"
    aria-checked={checkboxOutput.ariaAttrs['aria-checked']}
    aria-disabled={checkboxOutput.ariaAttrs['aria-disabled']}
    aria-label={checkboxOutput.ariaAttrs['aria-label']}
    aria-describedby={checkboxOutput.ariaAttrs['aria-describedby']}
    aria-required={checkboxOutput.ariaAttrs['aria-required']}
    aria-invalid={checkboxOutput.ariaAttrs['aria-invalid']}
    data-momoto-bg-quality={showQualityWarnings ? checkboxOutput.resolvedTokens.backgroundColor.qualityScore : undefined}
    data-momoto-bg-decision={showQualityWarnings ? checkboxOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined}
    data-momoto-check-quality={showQualityWarnings ? checkboxOutput.resolvedTokens.checkColor.qualityScore : undefined}
    data-testid={testId}
  />

  <!-- Visual checkbox box -->
  <span
    class="{CLASS_PREFIX}__box"
    style={boxStyles}
  >
    <!-- Checkmark or dash icon -->
    {#if showIcon}
      <svg
        class="{CLASS_PREFIX}__icon"
        style={iconStyles}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {#if indeterminate}
          <!-- Dash icon for indeterminate state -->
          <path
            d="M4 8h8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        {:else}
          <!-- Checkmark icon for checked state -->
          <path
            d="M3 8l3 3 7-7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        {/if}
      </svg>
    {/if}
  </span>

  <!-- Label (optional) -->
  {#if label}
    <span
      class="{CLASS_PREFIX}__label"
      style={labelStyles}
    >
      {label}
    </span>
  {/if}
</label>

<!--
CONTRACT COMPLIANCE:

✅ Zero logic duplication
   - ALL logic delegated to CheckboxCore.processCheckbox()
   - Adapter is THIN wrapper

✅ 100% token-driven
   - All colors from EnrichedToken (via CheckboxCore)
   - NO local color calculations

✅ State management via framework
   - Uses Svelte's reactive let for interaction state
   - CheckboxCore handles state determination

✅ Framework-specific concerns only
   - Template rendering (Svelte-specific)
   - Event handling (Svelte events → CheckboxCore)
   - Reactivity (Svelte $: reactive statements)
   - Indeterminate state sync (Svelte $: + onMount)

✅ Identical behavior to React/Vue
   - Same CheckboxCore
   - Same tokens
   - Same output

✅ Tri-state support
   - Unchecked, checked, indeterminate
   - Proper ARIA compliance

PATTERN: Exact copy of TextField.svelte adapted for Checkbox
-->
