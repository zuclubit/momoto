/**
 * @fileoverview Angular Switch Component
 * FASE 15.5: Component Expansion - Switch
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchCore, CLASS_PREFIX } from '../../core/switch';
import type { SwitchCoreOutput, SwitchSize, SwitchStyles } from '../../core/switch';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

@Component({
  selector: 'momoto-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
})
export class SwitchComponent implements OnChanges {
  @Input({ required: true }) checked!: boolean;
  @Input() label?: string;
  @Input({ required: true }) trackBackgroundColor!: EnrichedToken;
  @Input({ required: true }) trackBorderColor!: EnrichedToken;
  @Input({ required: true }) thumbColor!: EnrichedToken;
  @Input({ required: true }) checkedTrackBackgroundColor!: EnrichedToken;
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = false;
  @Input() size: SwitchSize = 'md';
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() customClass?: string;
  @Input() customStyle?: Partial<SwitchStyles>;
  @Input() showQualityWarnings = true;

  @Output() checkedChange = new EventEmitter<boolean>();

  isHovered = false;
  isFocused = false;
  switchOutput!: SwitchCoreOutput;
  CLASS_PREFIX = CLASS_PREFIX;

  ngOnChanges(): void {
    this.updateSwitchOutput();
    if (this.switchOutput.qualityWarnings.length > 0) {
      this.switchOutput.qualityWarnings.forEach((w) =>
        console.warn(`[Switch] ${w.message}`, w.details)
      );
    }
  }

  private updateSwitchOutput(): void {
    this.switchOutput = SwitchCore.processSwitch({
      tokens: {
        trackBackgroundColor: this.trackBackgroundColor,
        trackBorderColor: this.trackBorderColor,
        thumbColor: this.thumbColor,
        checkedTrackBackgroundColor: this.checkedTrackBackgroundColor,
      },
      isChecked: this.checked,
      disabled: this.disabled,
      isHovered: this.isHovered,
      isFocused: this.isFocused,
      hasError: this.error,
      size: this.size,
      label: this.label,
      helperText: this.helperText,
      errorMessage: this.errorMessage,
      required: this.required,
      userStyles: this.customStyle,
      customClass: this.customClass,
      showQualityWarnings: this.showQualityWarnings,
    });
  }

  getTrackStyle(): Record<string, string> {
    return {
      position: this.switchOutput.styles.trackPosition,
      display: this.switchOutput.styles.trackDisplay,
      width: `${this.switchOutput.styles.trackWidth}px`,
      height: `${this.switchOutput.styles.trackHeight}px`,
      backgroundColor: this.switchOutput.styles.trackBackgroundColor,
      borderWidth: `${this.switchOutput.styles.trackBorderWidth}px`,
      borderStyle: this.switchOutput.styles.trackBorderStyle,
      borderColor: this.switchOutput.styles.trackBorderColor,
      borderRadius: `${this.switchOutput.styles.trackBorderRadius}px`,
      cursor: this.switchOutput.styles.trackCursor,
      transition: this.switchOutput.styles.trackTransition,
      opacity: this.switchOutput.styles.trackOpacity.toString(),
      outline: this.switchOutput.styles.outlineColor
        ? `${this.switchOutput.styles.outlineWidth}px solid ${this.switchOutput.styles.outlineColor}`
        : 'none',
      outlineOffset: `${this.switchOutput.styles.outlineOffset}px`,
    };
  }

  getThumbStyle(): Record<string, string> {
    return {
      position: this.switchOutput.styles.thumbPosition,
      display: this.switchOutput.styles.thumbDisplay,
      top: '50%',
      left: `${this.switchOutput.styles.trackBorderWidth + 2}px`,
      width: `${this.switchOutput.styles.thumbWidth}px`,
      height: `${this.switchOutput.styles.thumbHeight}px`,
      backgroundColor: this.switchOutput.styles.thumbBackgroundColor,
      borderRadius: `${this.switchOutput.styles.thumbBorderRadius}px`,
      transition: this.switchOutput.styles.thumbTransition,
      transform: `translateY(-50%) ${this.switchOutput.styles.thumbTransform}`,
    };
  }

  onClick(): void {
    if (!this.disabled) {
      this.checkedChange.emit(!this.checked);
    }
  }

  onMouseEnter(): void {
    if (!this.disabled) {
      this.isHovered = true;
      this.updateSwitchOutput();
    }
  }

  onMouseLeave(): void {
    this.isHovered = false;
    this.updateSwitchOutput();
  }

  onFocus(): void {
    if (!this.disabled) {
      this.isFocused = true;
      this.updateSwitchOutput();
    }
  }

  onBlur(): void {
    this.isFocused = false;
    this.updateSwitchOutput();
  }

  get displayHelperText(): string | undefined {
    return this.error && this.errorMessage ? this.errorMessage : this.helperText;
  }
}
