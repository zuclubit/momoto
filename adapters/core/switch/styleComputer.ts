/**
 * @fileoverview SwitchCore Style Computer
 *
 * FASE 15.5: Component Expansion - Switch
 *
 * @module momoto-ui/adapters/core/switch/styleComputer
 * @version 1.0.0
 */

import type { SwitchStyles, ResolvedSwitchTokens, SizeConfig, SwitchState } from './switchCore.types';
import {
  TRACK_BORDER_WIDTH,
  TRACK_PADDING,
  THUMB_BORDER_RADIUS,
  TRACK_BORDER_RADIUS,
  OUTLINE_WIDTH,
  OUTLINE_OFFSET,
  TRANSITION,
  LABEL_FONT_WEIGHT,
  DISABLED_OPACITY,
  DISABLED_CURSOR,
} from './constants';

export function computeStyles(
  resolvedTokens: ResolvedSwitchTokens,
  sizeConfig: SizeConfig,
  state: SwitchState,
  isChecked: boolean,
  label: string | undefined,
  helperText: string | undefined,
  errorMessage: string | undefined
): SwitchStyles {
  const disabled = state === 'disabled' || state === 'checkedDisabled';
  const hasError = state.startsWith('error');
  const displayHelperText = hasError && errorMessage ? errorMessage : helperText;

  // Calculate thumb position (translateX)
  const thumbOffset = TRACK_PADDING;
  const thumbMaxTranslate = sizeConfig.trackWidth - sizeConfig.thumbSize - thumbOffset * 2;
  const thumbTransform = isChecked ? `translateX(${thumbMaxTranslate}px)` : 'translateX(0)';

  return {
    containerDisplay: 'flex',
    containerAlignItems: 'center',
    containerGap: label ? sizeConfig.labelGap : 0,

    trackPosition: 'relative',
    trackDisplay: 'inline-block',
    trackWidth: sizeConfig.trackWidth,
    trackHeight: sizeConfig.trackHeight,
    trackBackgroundColor: resolvedTokens.trackBackgroundColor.toCssValue(),
    trackBorderWidth: TRACK_BORDER_WIDTH,
    trackBorderStyle: 'solid',
    trackBorderColor: resolvedTokens.trackBorderColor.toCssValue(),
    trackBorderRadius: TRACK_BORDER_RADIUS,
    trackCursor: disabled ? DISABLED_CURSOR : 'pointer',
    trackTransition: TRANSITION,
    trackOpacity: disabled ? DISABLED_OPACITY : 1,

    outlineWidth: OUTLINE_WIDTH,
    outlineOffset: OUTLINE_OFFSET,
    outlineColor: resolvedTokens.outlineColor ? resolvedTokens.outlineColor.toCssValue() : null,

    thumbPosition: 'absolute',
    thumbDisplay: 'block',
    thumbWidth: sizeConfig.thumbSize,
    thumbHeight: sizeConfig.thumbSize,
    thumbBackgroundColor: resolvedTokens.thumbColor.toCssValue(),
    thumbBorderRadius: THUMB_BORDER_RADIUS,
    thumbTransition: TRANSITION,
    thumbTransform,

    labelDisplay: label ? 'block' : 'none',
    labelFontSize: sizeConfig.labelFontSize,
    labelColor: resolvedTokens.labelColor.toCssValue(),
    labelFontWeight: LABEL_FONT_WEIGHT,

    helperDisplay: displayHelperText ? 'block' : 'none',
    helperFontSize: sizeConfig.helperFontSize,
    helperColor: resolvedTokens.helperTextColor.toCssValue(),
  };
}

export function mergeStyles(
  computedStyles: SwitchStyles,
  userStyles?: Partial<SwitchStyles>
): SwitchStyles {
  if (!userStyles) {
    return computedStyles;
  }
  // Filter out undefined values from userStyles
  const filteredUserStyles = Object.fromEntries(
    Object.entries(userStyles).filter(([, value]) => value !== undefined)
  );
  return { ...computedStyles, ...filteredUserStyles } as SwitchStyles;
}
