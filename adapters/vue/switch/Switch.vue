<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { SwitchCore, CLASS_PREFIX } from '../../core/switch';
import type { SwitchTokens } from '../../core/switch/switchCore.types';
import type { SwitchProps } from './types';

const props = withDefaults(defineProps<SwitchProps>(), { disabled: false, required: false, error: false, size: 'md', showQualityWarnings: true });
const emit = defineEmits<{ 'update:checked': [value: boolean] }>();

const isHovered = ref(false);
const isFocused = ref(false);

const switchOutput = computed(() =>
  SwitchCore.processSwitch({
    tokens: props as unknown as SwitchTokens,
    isChecked: props.checked,
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

watch(() => switchOutput.value.qualityWarnings, (warnings) => {
  if (warnings.length > 0) warnings.forEach((w) => console.warn(`[Switch] ${w.message}`, w.details));
});

const displayHelperText = computed(() => props.error && props.errorMessage ? props.errorMessage : props.helperText);
</script>

<template>
  <div :class="switchOutput.classNames" :style="{ display: switchOutput.styles.containerDisplay, alignItems: switchOutput.styles.containerAlignItems, gap: `${switchOutput.styles.containerGap}px` }">
    <div
      :role="switchOutput.ariaAttrs.role"
      :aria-checked="switchOutput.ariaAttrs['aria-checked']"
      :aria-disabled="switchOutput.ariaAttrs['aria-disabled']"
      :aria-required="switchOutput.ariaAttrs['aria-required']"
      :aria-invalid="switchOutput.ariaAttrs['aria-invalid']"
      :aria-label="switchOutput.ariaAttrs['aria-label']"
      :aria-describedby="switchOutput.ariaAttrs['aria-describedby']"
      :aria-labelledby="switchOutput.ariaAttrs['aria-labelledby']"
      :tabindex="disabled ? -1 : 0"
      :class="`${CLASS_PREFIX}__track`"
      :data-testid="testId"
      :style="{
        position: switchOutput.styles.trackPosition,
        display: switchOutput.styles.trackDisplay,
        width: `${switchOutput.styles.trackWidth}px`,
        height: `${switchOutput.styles.trackHeight}px`,
        backgroundColor: switchOutput.styles.trackBackgroundColor,
        borderWidth: `${switchOutput.styles.trackBorderWidth}px`,
        borderStyle: switchOutput.styles.trackBorderStyle,
        borderColor: switchOutput.styles.trackBorderColor,
        borderRadius: `${switchOutput.styles.trackBorderRadius}px`,
        cursor: switchOutput.styles.trackCursor,
        transition: switchOutput.styles.trackTransition,
        opacity: switchOutput.styles.trackOpacity,
        outline: switchOutput.styles.outlineColor ? `${switchOutput.styles.outlineWidth}px solid ${switchOutput.styles.outlineColor}` : 'none',
        outlineOffset: `${switchOutput.styles.outlineOffset}px`,
      }"
      @click="!disabled && emit('update:checked', !checked)"
      @mouseenter="!disabled && (isHovered = true)"
      @mouseleave="isHovered = false"
      @focus="!disabled && (isFocused = true)"
      @blur="isFocused = false"
    >
      <span
        :class="`${CLASS_PREFIX}__thumb`"
        :style="{
          position: switchOutput.styles.thumbPosition,
          display: switchOutput.styles.thumbDisplay,
          top: '50%',
          left: `${switchOutput.styles.trackBorderWidth + 2}px`,
          width: `${switchOutput.styles.thumbWidth}px`,
          height: `${switchOutput.styles.thumbHeight}px`,
          backgroundColor: switchOutput.styles.thumbBackgroundColor,
          borderRadius: `${switchOutput.styles.thumbBorderRadius}px`,
          transition: switchOutput.styles.thumbTransition,
          transform: `translateY(-50%) ${switchOutput.styles.thumbTransform}`,
        }"
      />
    </div>

    <label v-if="label" :class="`${CLASS_PREFIX}__label`" :style="{ display: switchOutput.styles.labelDisplay, fontSize: `${switchOutput.styles.labelFontSize}px`, color: switchOutput.styles.labelColor, fontWeight: switchOutput.styles.labelFontWeight }">
      {{ label }}<template v-if="required"> *</template>
    </label>

    <span v-if="displayHelperText" :class="`${CLASS_PREFIX}__helper`" :style="{ display: switchOutput.styles.helperDisplay, fontSize: `${switchOutput.styles.helperFontSize}px`, color: switchOutput.styles.helperColor }">
      {{ displayHelperText }}
    </span>
  </div>
</template>
