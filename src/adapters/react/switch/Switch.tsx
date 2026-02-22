/**
 * @fileoverview React Switch Adapter
 * FASE 15.5: Component Expansion - Switch
 */

import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { SwitchCore, CLASS_PREFIX } from '../../core/switch';
import type { SwitchTokens } from '../../core/switch/switchCore.types';
import type { SwitchProps } from './types';

export function Switch(props: SwitchProps) {
  const { checked, onChange, disabled = false, required = false, error = false, size = 'md', label, helperText, errorMessage, className, style, ariaLabel, ariaDescribedby, ariaLabelledby, testId, showQualityWarnings = true, ...tokenProps } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const switchOutput = useMemo(
    () =>
      SwitchCore.processSwitch({
        tokens: tokenProps as SwitchTokens,
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
        ariaLabel,
        ariaDescribedby,
        ariaLabelledby,
        userStyles: style as any,
        customClass: className,
        showQualityWarnings,
      }),
    [checked, disabled, isHovered, isFocused, error, size, label, helperText, errorMessage, required, ariaLabel, ariaDescribedby, ariaLabelledby, style, className, showQualityWarnings, tokenProps]
  );

  useEffect(() => {
    if (switchOutput.qualityWarnings.length > 0) {
      switchOutput.qualityWarnings.forEach((w) => console.warn(`[Switch] ${w.message}`, w.details));
    }
  }, [switchOutput.qualityWarnings]);

  const displayHelperText = error && errorMessage ? errorMessage : helperText;

  return (
    <div style={{ display: switchOutput.styles.containerDisplay, alignItems: switchOutput.styles.containerAlignItems, gap: `${switchOutput.styles.containerGap}px` }} className={switchOutput.classNames}>
      <div
        role={switchOutput.ariaAttrs.role}
        aria-checked={switchOutput.ariaAttrs['aria-checked']}
        aria-disabled={switchOutput.ariaAttrs['aria-disabled']}
        aria-required={switchOutput.ariaAttrs['aria-required']}
        aria-invalid={switchOutput.ariaAttrs['aria-invalid']}
        aria-label={switchOutput.ariaAttrs['aria-label']}
        aria-describedby={switchOutput.ariaAttrs['aria-describedby']}
        aria-labelledby={switchOutput.ariaAttrs['aria-labelledby']}
        tabIndex={disabled ? -1 : 0}
        style={{
          position: switchOutput.styles.trackPosition as React.CSSProperties['position'],
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
        }}
        className={`${CLASS_PREFIX}__track`}
        onClick={() => !disabled && onChange(!checked)}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-testid={testId}
      >
        <span
          style={{
            position: switchOutput.styles.thumbPosition as React.CSSProperties['position'],
            display: switchOutput.styles.thumbDisplay,
            top: '50%',
            left: `${switchOutput.styles.trackBorderWidth + 2}px`,
            width: `${switchOutput.styles.thumbWidth}px`,
            height: `${switchOutput.styles.thumbHeight}px`,
            backgroundColor: switchOutput.styles.thumbBackgroundColor,
            borderRadius: `${switchOutput.styles.thumbBorderRadius}px`,
            transition: switchOutput.styles.thumbTransition,
            transform: `translateY(-50%) ${switchOutput.styles.thumbTransform}`,
          }}
          className={`${CLASS_PREFIX}__thumb`}
        />
      </div>

      {label && (
        <label style={{ display: switchOutput.styles.labelDisplay, fontSize: `${switchOutput.styles.labelFontSize}px`, color: switchOutput.styles.labelColor, fontWeight: switchOutput.styles.labelFontWeight }} className={`${CLASS_PREFIX}__label`}>
          {label}{required && ' *'}
        </label>
      )}

      {displayHelperText && (
        <span style={{ display: switchOutput.styles.helperDisplay, fontSize: `${switchOutput.styles.helperFontSize}px`, color: switchOutput.styles.helperColor }} className={`${CLASS_PREFIX}__helper`}>
          {displayHelperText}
        </span>
      )}
    </div>
  );
}
