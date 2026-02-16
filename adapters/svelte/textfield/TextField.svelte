<script lang="ts">
/**
 * @fileoverview Svelte TextField Adapter
 *
 * FASE 15: Component Expansion
 *
 * Svelte adapter for TextFieldCore.
 * This is a THIN wrapper that delegates all logic to TextFieldCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to TextFieldCore)
 * - ✅ 100% token-driven (via TextFieldCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/svelte/textfield
 * @version 1.0.0
 */

import { createEventDispatcher } from 'svelte';
import { TextFieldCore, CLASS_PREFIX } from '../../core/textfield';
import type { TextFieldProps } from './types';

// ============================================================================
// PROPS
// ============================================================================

// Content
export let value: TextFieldProps['value'];
export let placeholder: TextFieldProps['placeholder'] = undefined;
export let label: TextFieldProps['label'] = undefined;
export let helperText: TextFieldProps['helperText'] = undefined;

// Tokens - Base
export let backgroundColor: TextFieldProps['backgroundColor'];
export let textColor: TextFieldProps['textColor'];
export let borderColor: TextFieldProps['borderColor'] = undefined;
export let placeholderColor: TextFieldProps['placeholderColor'] = undefined;
export let labelColor: TextFieldProps['labelColor'] = undefined;
export let helperTextColor: TextFieldProps['helperTextColor'] = undefined;

// Tokens - Hover
export let hoverBackgroundColor: TextFieldProps['hoverBackgroundColor'] = undefined;
export let hoverBorderColor: TextFieldProps['hoverBorderColor'] = undefined;

// Tokens - Focus
export let focusBackgroundColor: TextFieldProps['focusBackgroundColor'] = undefined;
export let focusBorderColor: TextFieldProps['focusBorderColor'] = undefined;

// Tokens - Error
export let errorBackgroundColor: TextFieldProps['errorBackgroundColor'] = undefined;
export let errorTextColor: TextFieldProps['errorTextColor'] = undefined;
export let errorBorderColor: TextFieldProps['errorBorderColor'] = undefined;
export let errorLabelColor: TextFieldProps['errorLabelColor'] = undefined;
export let errorHelperTextColor: TextFieldProps['errorHelperTextColor'] = undefined;

// Tokens - Success
export let successBackgroundColor: TextFieldProps['successBackgroundColor'] = undefined;
export let successTextColor: TextFieldProps['successTextColor'] = undefined;
export let successBorderColor: TextFieldProps['successBorderColor'] = undefined;
export let successLabelColor: TextFieldProps['successLabelColor'] = undefined;
export let successHelperTextColor: TextFieldProps['successHelperTextColor'] = undefined;

// Tokens - Disabled
export let disabledBackgroundColor: TextFieldProps['disabledBackgroundColor'] = undefined;
export let disabledTextColor: TextFieldProps['disabledTextColor'] = undefined;
export let disabledBorderColor: TextFieldProps['disabledBorderColor'] = undefined;
export let disabledLabelColor: TextFieldProps['disabledLabelColor'] = undefined;

// Behavior
export let type: TextFieldProps['type'] = 'text';
export let disabled: TextFieldProps['disabled'] = false;
export let error: TextFieldProps['error'] = false;
export let success: TextFieldProps['success'] = false;
export let required: TextFieldProps['required'] = false;

// Layout
export let size: TextFieldProps['size'] = 'md';
export let fullWidth: TextFieldProps['fullWidth'] = false;
export let multiline: TextFieldProps['multiline'] = false;
export let rows: TextFieldProps['rows'] = 3;

// Styling
let className: TextFieldProps['class'] = undefined;
export { className as class };
export let style: TextFieldProps['style'] = undefined;

// Accessibility
export let ariaLabel: TextFieldProps['ariaLabel'] = undefined;
export let ariaDescribedby: TextFieldProps['ariaDescribedby'] = undefined;
export let testId: TextFieldProps['testId'] = undefined;

// Developer experience
export let showQualityWarnings: TextFieldProps['showQualityWarnings'] = true;

// ============================================================================
// STATE (Svelte-specific)
// ============================================================================

let isHovered = false;
let isFocused = false;

// ============================================================================
// TEXTFIELD CORE INTEGRATION
// ============================================================================

/**
 * Process text field logic via TextFieldCore.
 *
 * This reactive statement delegates ALL logic to TextFieldCore.processTextField().
 * NO logic duplication - pure delegation.
 */
$: textFieldOutput = TextFieldCore.processTextField({
  // Tokens
  tokens: {
    backgroundColor,
    textColor,
    borderColor,
    placeholderColor,
    labelColor,
    helperTextColor,
    hoverBackgroundColor,
    hoverBorderColor,
    focusBackgroundColor,
    focusBorderColor,
    errorBackgroundColor,
    errorTextColor,
    errorBorderColor,
    errorLabelColor,
    errorHelperTextColor,
    successBackgroundColor,
    successTextColor,
    successBorderColor,
    successLabelColor,
    successHelperTextColor,
    disabledBackgroundColor,
    disabledTextColor,
    disabledBorderColor,
    disabledLabelColor,
  },

  // Interaction state
  disabled,
  error,
  success,
  isHovered,
  isFocused,

  // Layout
  size,
  fullWidth,
  multiline,

  // Content
  label,
  helperText,

  // ARIA
  required,
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
$: if (textFieldOutput.qualityWarnings.length > 0) {
  textFieldOutput.qualityWarnings.forEach((warning) => {
    console.warn(`[TextField] ${warning.message}`, warning.details);
  });
}

// ============================================================================
// COMPUTED STYLES
// ============================================================================

$: containerStyles = [
  `width: ${textFieldOutput.styles.containerWidth}`,
  `display: ${textFieldOutput.styles.containerDisplay}`,
  `flex-direction: ${textFieldOutput.styles.containerFlexDirection}`,
  `gap: ${textFieldOutput.styles.containerGap}px`,
].join('; ');

$: inputStyles = [
  multiline ? 'height: auto' : `height: ${textFieldOutput.styles.inputHeight}px`,
  `padding-left: ${textFieldOutput.styles.inputPaddingLeft}px`,
  `padding-right: ${textFieldOutput.styles.inputPaddingRight}px`,
  `padding-top: ${textFieldOutput.styles.inputPaddingTop}px`,
  `padding-bottom: ${textFieldOutput.styles.inputPaddingBottom}px`,
  `font-size: ${textFieldOutput.styles.inputFontSize}px`,
  `font-weight: ${textFieldOutput.styles.inputFontWeight}`,
  `line-height: ${textFieldOutput.styles.inputLineHeight}`,
  `font-family: ${textFieldOutput.styles.inputFontFamily}`,
  `background-color: ${textFieldOutput.styles.inputBackgroundColor}`,
  `color: ${textFieldOutput.styles.inputColor}`,
  `border-radius: ${textFieldOutput.styles.inputBorderRadius}px`,
  `outline: ${textFieldOutput.styles.inputOutline}`,
  `cursor: ${textFieldOutput.styles.inputCursor}`,
  `transition: ${textFieldOutput.styles.inputTransition}`,
  textFieldOutput.styles.inputBorderWidth ? `border-width: ${textFieldOutput.styles.inputBorderWidth}px` : '',
  textFieldOutput.styles.inputBorderStyle ? `border-style: ${textFieldOutput.styles.inputBorderStyle}` : '',
  textFieldOutput.styles.inputBorderColor ? `border-color: ${textFieldOutput.styles.inputBorderColor}` : '',
].filter(Boolean).join('; ');

$: labelStyles = textFieldOutput.styles.labelColor ? [
  `font-size: ${textFieldOutput.styles.labelFontSize}px`,
  `font-weight: ${textFieldOutput.styles.labelFontWeight}`,
  `color: ${textFieldOutput.styles.labelColor}`,
  `margin-bottom: ${textFieldOutput.styles.labelMarginBottom}px`,
].join('; ') : '';

$: helperStyles = textFieldOutput.styles.helperColor ? [
  `font-size: ${textFieldOutput.styles.helperFontSize}px`,
  `color: ${textFieldOutput.styles.helperColor}`,
  `margin-top: ${textFieldOutput.styles.helperMarginTop}px`,
].join('; ') : '';

// ============================================================================
// EVENT HANDLERS (Svelte-specific)
// ============================================================================

const dispatch = createEventDispatcher<{
  input: string;
  focus: FocusEvent;
  blur: FocusEvent;
}>();

function handleInput(event: Event) {
  if (disabled) {
    return;
  }
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  value = target.value;
  dispatch('input', value);
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

<div style={containerStyles} class={textFieldOutput.classNames}>
  <!-- Label (optional) -->
  {#if label}
    <label
      class="{CLASS_PREFIX}__label"
      style={labelStyles}
    >
      {label}
      {#if required}<span aria-label="required"> *</span>{/if}
    </label>
  {/if}

  <!-- Input (single-line) -->
  {#if !multiline}
    <input
      {type}
      {value}
      {placeholder}
      {disabled}
      {required}
      class="{CLASS_PREFIX}__input"
      style={inputStyles}
      aria-label={textFieldOutput.ariaAttrs['aria-label']}
      aria-describedby={textFieldOutput.ariaAttrs['aria-describedby']}
      aria-disabled={textFieldOutput.ariaAttrs['aria-disabled']}
      aria-invalid={textFieldOutput.ariaAttrs['aria-invalid']}
      aria-required={textFieldOutput.ariaAttrs['aria-required']}
      data-momoto-bg-quality={showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.qualityScore : undefined}
      data-momoto-bg-decision={showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined}
      data-momoto-text-quality={showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.qualityScore : undefined}
      data-momoto-wcag-ratio={showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.accessibility?.wcagRatio : undefined}
      data-testid={testId}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
    />
  {:else}
    <!-- Textarea (multiline) -->
    <textarea
      {value}
      {placeholder}
      {disabled}
      {required}
      {rows}
      class="{CLASS_PREFIX}__input {CLASS_PREFIX}__input--multiline"
      style={inputStyles}
      aria-label={textFieldOutput.ariaAttrs['aria-label']}
      aria-describedby={textFieldOutput.ariaAttrs['aria-describedby']}
      aria-disabled={textFieldOutput.ariaAttrs['aria-disabled']}
      aria-invalid={textFieldOutput.ariaAttrs['aria-invalid']}
      aria-required={textFieldOutput.ariaAttrs['aria-required']}
      data-momoto-bg-quality={showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.qualityScore : undefined}
      data-momoto-bg-decision={showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined}
      data-momoto-text-quality={showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.qualityScore : undefined}
      data-momoto-wcag-ratio={showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.accessibility?.wcagRatio : undefined}
      data-testid={testId}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
    />
  {/if}

  <!-- Helper text (optional) -->
  {#if helperText}
    <div
      class="{CLASS_PREFIX}__helper"
      style={helperStyles}
    >
      {helperText}
    </div>
  {/if}
</div>

<!--
CONTRACT COMPLIANCE:

✅ Zero logic duplication
   - ALL logic delegated to TextFieldCore.processTextField()
   - Adapter is THIN wrapper

✅ 100% token-driven
   - All colors from EnrichedToken (via TextFieldCore)
   - NO local color calculations

✅ State management via framework
   - Uses Svelte's reactive let for interaction state
   - TextFieldCore handles state determination

✅ Framework-specific concerns only
   - Template rendering (Svelte-specific)
   - Event handling (Svelte events → TextFieldCore)
   - Reactivity (Svelte $: reactive statements)

✅ Identical behavior to React/Vue
   - Same TextFieldCore
   - Same tokens
   - Same output

PATTERN: Exact copy of Button.svelte adapted for TextField

USAGE EXAMPLE:

```svelte
<script>
  import { TextField } from '@momoto/ui-adapters/svelte/textfield';

  let email = '';
  let inputBg = inputBackgroundToken;
  let inputText = inputTextToken;

  function handleInput(event) {
    console.log('Value:', event.detail);
  }
</script>

<TextField
  label="Email"
  bind:value={email}
  backgroundColor={inputBg}
  textColor={inputText}
  placeholder="Enter your email"
  type="email"
  on:input={handleInput}
/>
```
-->
