<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { SwitchCore, CLASS_PREFIX } from '../../core/switch';
import type { SwitchTokens } from '../../core/switch/switchCore.types';
import type { SwitchProps } from './types';

export let checked: SwitchProps['checked'];
export let label: SwitchProps['label'] = undefined;
export let trackBackgroundColor: SwitchProps['trackBackgroundColor'];
export let trackBorderColor: SwitchProps['trackBorderColor'];
export let thumbColor: SwitchProps['thumbColor'];
export let checkedTrackBackgroundColor: SwitchProps['checkedTrackBackgroundColor'];
export let disabled: SwitchProps['disabled'] = false;
export let required: SwitchProps['required'] = false;
export let error: SwitchProps['error'] = false;
export let size: SwitchProps['size'] = 'md';
export let helperText: SwitchProps['helperText'] = undefined;
export let errorMessage: SwitchProps['errorMessage'] = undefined;
let className: SwitchProps['class'] = undefined;
export { className as class };
export let showQualityWarnings: SwitchProps['showQualityWarnings'] = true;

let isHovered = false;
let isFocused = false;

const dispatch = createEventDispatcher<{ change: boolean }>();

$: switchOutput = SwitchCore.processSwitch({
  tokens: { trackBackgroundColor, trackBorderColor, thumbColor, checkedTrackBackgroundColor } as SwitchTokens,
  isChecked: checked,
  disabled,
  isHovered,
  isFocused,
  hasError: error,
  size,
  label,
  helperText,
  errorMessage,
  required,
  customClass: className,
  showQualityWarnings,
});

$: if (switchOutput.qualityWarnings.length > 0) {
  switchOutput.qualityWarnings.forEach((w) => console.warn(`[Switch] ${w.message}`, w.details));
}

$: displayHelperText = error && errorMessage ? errorMessage : helperText;
</script>

<div class={switchOutput.classNames} style="display: {switchOutput.styles.containerDisplay}; align-items: {switchOutput.styles.containerAlignItems}; gap: {switchOutput.styles.containerGap}px;">
  <div
    role={switchOutput.ariaAttrs.role}
    aria-checked={switchOutput.ariaAttrs['aria-checked']}
    tabindex={disabled ? -1 : 0}
    class="{CLASS_PREFIX}__track"
    style="position: {switchOutput.styles.trackPosition}; display: {switchOutput.styles.trackDisplay}; width: {switchOutput.styles.trackWidth}px; height: {switchOutput.styles.trackHeight}px; background-color: {switchOutput.styles.trackBackgroundColor}; border: {switchOutput.styles.trackBorderWidth}px {switchOutput.styles.trackBorderStyle} {switchOutput.styles.trackBorderColor}; border-radius: {switchOutput.styles.trackBorderRadius}px; cursor: {switchOutput.styles.trackCursor}; transition: {switchOutput.styles.trackTransition}; opacity: {switchOutput.styles.trackOpacity}; outline: {switchOutput.styles.outlineColor ? `${switchOutput.styles.outlineWidth}px solid ${switchOutput.styles.outlineColor}` : 'none'}; outline-offset: {switchOutput.styles.outlineOffset}px;"
    on:click={() => { if (!disabled) { checked = !checked; dispatch('change', checked); } }}
    on:mouseenter={() => !disabled && (isHovered = true)}
    on:mouseleave={() => isHovered = false}
    on:focus={() => !disabled && (isFocused = true)}
    on:blur={() => isFocused = false}
  >
    <span
      class="{CLASS_PREFIX}__thumb"
      style="position: {switchOutput.styles.thumbPosition}; display: {switchOutput.styles.thumbDisplay}; top: 50%; left: {switchOutput.styles.trackBorderWidth + 2}px; width: {switchOutput.styles.thumbWidth}px; height: {switchOutput.styles.thumbHeight}px; background-color: {switchOutput.styles.thumbBackgroundColor}; border-radius: {switchOutput.styles.thumbBorderRadius}px; transition: {switchOutput.styles.thumbTransition}; transform: translateY(-50%) {switchOutput.styles.thumbTransform};"
    />
  </div>

  {#if label}
    <label class="{CLASS_PREFIX}__label" style="display: {switchOutput.styles.labelDisplay}; font-size: {switchOutput.styles.labelFontSize}px; color: {switchOutput.styles.labelColor}; font-weight: {switchOutput.styles.labelFontWeight};">
      {label}{#if required} *{/if}
    </label>
  {/if}

  {#if displayHelperText}
    <span class="{CLASS_PREFIX}__helper" style="display: {switchOutput.styles.helperDisplay}; font-size: {switchOutput.styles.helperFontSize}px; color: {switchOutput.styles.helperColor};">
      {displayHelperText}
    </span>
  {/if}
</div>
