/**
 * @fileoverview Angular Select Component
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Angular adapter for SelectCore.
 * This is a THIN wrapper that delegates all logic to SelectCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to SelectCore)
 * - ✅ 100% token-driven (via SelectCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/angular/select
 * @version 1.0.0
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectCore, CLASS_PREFIX } from '../../core/select';
import type {
  SelectCoreOutput,
  SelectSize,
  SelectStyles,
  SelectOption,
} from '../../core/select';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

@Component({
  selector: 'momoto-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent<T = string> implements OnChanges {
  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - OPTIONS & VALUE
  // ──────────────────────────────────────────────────────────────────────────

  @Input({ required: true }) options!: SelectOption<T>[];
  @Input({ required: true }) value!: T | null;
  @Input() placeholder?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - TOKENS FIELD BASE
  // ──────────────────────────────────────────────────────────────────────────

  @Input({ required: true }) backgroundColor!: EnrichedToken;
  @Input({ required: true }) borderColor!: EnrichedToken;
  @Input({ required: true }) textColor!: EnrichedToken;
  @Input() placeholderColor?: EnrichedToken;
  @Input() iconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - TOKENS FIELD HOVER/FOCUS/OPEN
  // ──────────────────────────────────────────────────────────────────────────

  @Input() hoverBackgroundColor?: EnrichedToken;
  @Input() hoverBorderColor?: EnrichedToken;
  @Input() hoverTextColor?: EnrichedToken;
  @Input() hoverIconColor?: EnrichedToken;
  @Input() focusBackgroundColor?: EnrichedToken;
  @Input() focusBorderColor?: EnrichedToken;
  @Input() focusTextColor?: EnrichedToken;
  @Input() focusOutlineColor?: EnrichedToken;
  @Input() focusIconColor?: EnrichedToken;
  @Input() openBackgroundColor?: EnrichedToken;
  @Input() openBorderColor?: EnrichedToken;
  @Input() openTextColor?: EnrichedToken;
  @Input() openOutlineColor?: EnrichedToken;
  @Input() openIconColor?: EnrichedToken;
  @Input() openHoverBackgroundColor?: EnrichedToken;
  @Input() openHoverBorderColor?: EnrichedToken;
  @Input() openFocusBackgroundColor?: EnrichedToken;
  @Input() openFocusBorderColor?: EnrichedToken;
  @Input() openFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - TOKENS DISABLED/ERROR
  // ──────────────────────────────────────────────────────────────────────────

  @Input() disabledBackgroundColor?: EnrichedToken;
  @Input() disabledBorderColor?: EnrichedToken;
  @Input() disabledTextColor?: EnrichedToken;
  @Input() disabledPlaceholderColor?: EnrichedToken;
  @Input() disabledLabelColor?: EnrichedToken;
  @Input() disabledIconColor?: EnrichedToken;
  @Input() errorBackgroundColor?: EnrichedToken;
  @Input() errorBorderColor?: EnrichedToken;
  @Input() errorTextColor?: EnrichedToken;
  @Input() errorMessageColor?: EnrichedToken;
  @Input() errorIconColor?: EnrichedToken;
  @Input() errorHoverBackgroundColor?: EnrichedToken;
  @Input() errorHoverBorderColor?: EnrichedToken;
  @Input() errorFocusBackgroundColor?: EnrichedToken;
  @Input() errorFocusBorderColor?: EnrichedToken;
  @Input() errorFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - TOKENS LABEL/HELPER
  // ──────────────────────────────────────────────────────────────────────────

  @Input() labelColor?: EnrichedToken;
  @Input() helperTextColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - TOKENS DROPDOWN
  // ──────────────────────────────────────────────────────────────────────────

  @Input({ required: true }) dropdownBackgroundColor!: EnrichedToken;
  @Input() dropdownBorderColor?: EnrichedToken;
  @Input() dropdownShadowColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - TOKENS OPTIONS
  // ──────────────────────────────────────────────────────────────────────────

  @Input({ required: true }) optionTextColor!: EnrichedToken;
  @Input() optionHoverBackgroundColor?: EnrichedToken;
  @Input() optionHoverTextColor?: EnrichedToken;
  @Input() optionSelectedBackgroundColor?: EnrichedToken;
  @Input() optionSelectedTextColor?: EnrichedToken;
  @Input() optionDisabledTextColor?: EnrichedToken;
  @Input() optionDisabledBackgroundColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - BEHAVIOR
  // ──────────────────────────────────────────────────────────────────────────

  @Input() disabled = false;
  @Input() required = false;
  @Input() error = false;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  @Input() size: SelectSize = 'md';

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  @Input() label?: string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - STYLING
  // ──────────────────────────────────────────────────────────────────────────

  @Input() customClass?: string;
  @Input() customStyle?: Partial<SelectStyles>;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - ACCESSIBILITY
  // ──────────────────────────────────────────────────────────────────────────

  @Input() ariaLabel?: string;
  @Input() ariaDescribedby?: string;
  @Input() ariaLabelledby?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - TESTING
  // ──────────────────────────────────────────────────────────────────────────

  @Input() testId?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // INPUTS - DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  @Input() showQualityWarnings = true;

  // ──────────────────────────────────────────────────────────────────────────
  // OUTPUTS
  // ──────────────────────────────────────────────────────────────────────────

  @Output() valueChange = new EventEmitter<T | null>();

  // ──────────────────────────────────────────────────────────────────────────
  // STATE (Angular-specific)
  // ──────────────────────────────────────────────────────────────────────────

  isOpen = false;
  isHovered = false;
  isFocused = false;
  highlightedValue: T | null = null;

  // ──────────────────────────────────────────────────────────────────────────
  // SELECT CORE OUTPUT
  // ──────────────────────────────────────────────────────────────────────────

  selectOutput!: SelectCoreOutput<T>;

  // ──────────────────────────────────────────────────────────────────────────
  // CONSTANTS
  // ──────────────────────────────────────────────────────────────────────────

  CLASS_PREFIX = CLASS_PREFIX;

  // ──────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ──────────────────────────────────────────────────────────────────────────

  constructor(private elementRef: ElementRef) {}

  // ──────────────────────────────────────────────────────────────────────────
  // LIFECYCLE - ON CHANGES
  // ──────────────────────────────────────────────────────────────────────────

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectOutput();

    if (this.selectOutput.qualityWarnings.length > 0) {
      this.selectOutput.qualityWarnings.forEach((warning) => {
        console.warn(`[Select] ${warning.message}`, warning.details);
      });
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CLOSE ON OUTSIDE CLICK
  // ──────────────────────────────────────────────────────────────────────────

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.updateSelectOutput();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // UPDATE SELECT OUTPUT
  // ──────────────────────────────────────────────────────────────────────────

  private updateSelectOutput(): void {
    this.selectOutput = SelectCore.processSelect<T>({
      tokens: {
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        textColor: this.textColor,
        placeholderColor: this.placeholderColor,
        iconColor: this.iconColor,
        hoverBackgroundColor: this.hoverBackgroundColor,
        hoverBorderColor: this.hoverBorderColor,
        hoverTextColor: this.hoverTextColor,
        hoverIconColor: this.hoverIconColor,
        focusBackgroundColor: this.focusBackgroundColor,
        focusBorderColor: this.focusBorderColor,
        focusTextColor: this.focusTextColor,
        focusOutlineColor: this.focusOutlineColor,
        focusIconColor: this.focusIconColor,
        openBackgroundColor: this.openBackgroundColor,
        openBorderColor: this.openBorderColor,
        openTextColor: this.openTextColor,
        openOutlineColor: this.openOutlineColor,
        openIconColor: this.openIconColor,
        openHoverBackgroundColor: this.openHoverBackgroundColor,
        openHoverBorderColor: this.openHoverBorderColor,
        openFocusBackgroundColor: this.openFocusBackgroundColor,
        openFocusBorderColor: this.openFocusBorderColor,
        openFocusOutlineColor: this.openFocusOutlineColor,
        disabledBackgroundColor: this.disabledBackgroundColor,
        disabledBorderColor: this.disabledBorderColor,
        disabledTextColor: this.disabledTextColor,
        disabledPlaceholderColor: this.disabledPlaceholderColor,
        disabledLabelColor: this.disabledLabelColor,
        disabledIconColor: this.disabledIconColor,
        errorBackgroundColor: this.errorBackgroundColor,
        errorBorderColor: this.errorBorderColor,
        errorTextColor: this.errorTextColor,
        errorMessageColor: this.errorMessageColor,
        errorIconColor: this.errorIconColor,
        errorHoverBackgroundColor: this.errorHoverBackgroundColor,
        errorHoverBorderColor: this.errorHoverBorderColor,
        errorFocusBackgroundColor: this.errorFocusBackgroundColor,
        errorFocusBorderColor: this.errorFocusBorderColor,
        errorFocusOutlineColor: this.errorFocusOutlineColor,
        labelColor: this.labelColor,
        helperTextColor: this.helperTextColor,
        dropdownBackgroundColor: this.dropdownBackgroundColor,
        dropdownBorderColor: this.dropdownBorderColor,
        dropdownShadowColor: this.dropdownShadowColor,
        optionTextColor: this.optionTextColor,
        optionHoverBackgroundColor: this.optionHoverBackgroundColor,
        optionHoverTextColor: this.optionHoverTextColor,
        optionSelectedBackgroundColor: this.optionSelectedBackgroundColor,
        optionSelectedTextColor: this.optionSelectedTextColor,
        optionDisabledTextColor: this.optionDisabledTextColor,
        optionDisabledBackgroundColor: this.optionDisabledBackgroundColor,
      },
      options: this.options,
      value: this.value,
      placeholder: this.placeholder,
      isOpen: this.isOpen,
      highlightedValue: this.highlightedValue,
      disabled: this.disabled,
      isHovered: this.isHovered,
      isFocused: this.isFocused,
      hasError: this.error,
      size: this.size,
      label: this.label,
      helperText: this.helperText,
      errorMessage: this.errorMessage,
      required: this.required,
      ariaLabel: this.ariaLabel,
      ariaDescribedby: this.ariaDescribedby,
      ariaLabelledby: this.ariaLabelledby,
      userStyles: this.customStyle,
      customClass: this.customClass,
      showQualityWarnings: this.showQualityWarnings,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STYLE GETTERS
  // ──────────────────────────────────────────────────────────────────────────

  getContainerStyle(): Record<string, string> {
    return {
      display: this.selectOutput.styles.containerDisplay,
      flexDirection: this.selectOutput.styles.containerFlexDirection,
      gap: `${this.selectOutput.styles.containerGap}px`,
    };
  }

  getFieldStyle(): Record<string, string> {
    return {
      position: this.selectOutput.styles.fieldPosition,
      display: this.selectOutput.styles.fieldDisplay,
      alignItems: this.selectOutput.styles.fieldAlignItems,
      justifyContent: this.selectOutput.styles.fieldJustifyContent,
      height: `${this.selectOutput.styles.fieldHeight}px`,
      padding: `0 ${this.selectOutput.styles.fieldPaddingX}px`,
      backgroundColor: this.selectOutput.styles.fieldBackgroundColor,
      borderWidth: `${this.selectOutput.styles.fieldBorderWidth}px`,
      borderStyle: this.selectOutput.styles.fieldBorderStyle,
      borderColor: this.selectOutput.styles.fieldBorderColor,
      borderRadius: `${this.selectOutput.styles.fieldBorderRadius}px`,
      color: this.selectOutput.styles.fieldTextColor,
      fontSize: `${this.selectOutput.styles.fieldFontSize}px`,
      cursor: this.selectOutput.styles.fieldCursor,
      transition: this.selectOutput.styles.fieldTransition,
      opacity: this.selectOutput.styles.fieldOpacity.toString(),
      outline: this.selectOutput.styles.outlineColor
        ? `${this.selectOutput.styles.outlineWidth}px solid ${this.selectOutput.styles.outlineColor}`
        : 'none',
      outlineOffset: `${this.selectOutput.styles.outlineOffset}px`,
    };
  }

  getIconStyle(): Record<string, string> {
    return {
      width: `${this.selectOutput.styles.iconSize}px`,
      height: `${this.selectOutput.styles.iconSize}px`,
      color: this.selectOutput.styles.iconColor,
      transform: this.selectOutput.styles.iconTransform,
      transition: this.selectOutput.styles.fieldTransition,
      flexShrink: '0',
    };
  }

  getLabelStyle(): Record<string, string> {
    return {
      display: this.selectOutput.styles.labelDisplay,
      fontSize: `${this.selectOutput.styles.labelFontSize}px`,
      color: this.selectOutput.styles.labelColor,
      fontWeight: this.selectOutput.styles.labelFontWeight.toString(),
    };
  }

  getHelperStyle(): Record<string, string> {
    return {
      display: this.selectOutput.styles.helperDisplay,
      fontSize: `${this.selectOutput.styles.helperFontSize}px`,
      color: this.selectOutput.styles.helperColor,
    };
  }

  getDropdownStyle(): Record<string, string> {
    return {
      position: this.selectOutput.styles.dropdownPosition,
      top: this.selectOutput.styles.dropdownTop,
      left: this.selectOutput.styles.dropdownLeft,
      right: this.selectOutput.styles.dropdownRight,
      zIndex: this.selectOutput.styles.dropdownZIndex.toString(),
      backgroundColor: this.selectOutput.styles.dropdownBackgroundColor,
      borderWidth: `${this.selectOutput.styles.dropdownBorderWidth}px`,
      borderStyle: this.selectOutput.styles.dropdownBorderStyle,
      borderColor: this.selectOutput.styles.dropdownBorderColor,
      borderRadius: `${this.selectOutput.styles.dropdownBorderRadius}px`,
      boxShadow: this.selectOutput.styles.dropdownBoxShadow,
      maxHeight: `${this.selectOutput.styles.dropdownMaxHeight}px`,
      overflowY: this.selectOutput.styles.dropdownOverflowY,
    };
  }

  getOptionStyle(option: SelectOption<T>): Record<string, string> {
    const isSelected = option.value === this.value;
    const isHighlighted = this.highlightedValue === option.value;
    let bgColor = 'transparent';
    let txtColor = this.selectOutput.styles.optionTextColor;

    if (option.disabled) {
      bgColor = this.selectOutput.styles.optionDisabledBackgroundColor;
      txtColor = this.selectOutput.styles.optionDisabledTextColor;
    } else if (isSelected) {
      bgColor = this.selectOutput.styles.optionSelectedBackgroundColor;
      txtColor = this.selectOutput.styles.optionSelectedTextColor;
    } else if (isHighlighted) {
      bgColor = this.selectOutput.styles.optionHoverBackgroundColor;
      txtColor = this.selectOutput.styles.optionHoverTextColor;
    }

    return {
      padding: `${this.selectOutput.styles.optionPaddingY}px ${this.selectOutput.styles.optionPaddingX}px`,
      fontSize: `${this.selectOutput.styles.optionFontSize}px`,
      color: txtColor,
      backgroundColor: bgColor,
      cursor: option.disabled
        ? this.selectOutput.styles.optionDisabledCursor
        : this.selectOutput.styles.optionCursor,
      transition: this.selectOutput.styles.optionTransition,
      opacity: option.disabled
        ? this.selectOutput.styles.optionDisabledOpacity.toString()
        : '1',
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ──────────────────────────────────────────────────────────────────────────

  onFieldClick(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    this.updateSelectOutput();
  }

  onOptionClick(optionValue: T, optionDisabled?: boolean): void {
    if (this.disabled || optionDisabled) return;
    this.valueChange.emit(optionValue);
    this.isOpen = false;
    this.updateSelectOutput();
  }

  onMouseEnter(): void {
    if (this.disabled) return;
    this.isHovered = true;
    this.updateSelectOutput();
  }

  onMouseLeave(): void {
    this.isHovered = false;
    this.updateSelectOutput();
  }

  onFocus(): void {
    if (this.disabled) return;
    this.isFocused = true;
    this.updateSelectOutput();
  }

  onBlur(): void {
    this.isFocused = false;
    this.updateSelectOutput();
  }

  onOptionMouseEnter(optionValue: T): void {
    this.highlightedValue = optionValue;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────────────────────────────────

  get displayHelperText(): string | undefined {
    return this.error && this.errorMessage ? this.errorMessage : this.helperText;
  }

  get classNames(): string {
    return this.selectOutput.classNames;
  }

  get ariaAttrs() {
    return this.selectOutput.ariaAttrs;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TRACK BY
  // ──────────────────────────────────────────────────────────────────────────

  trackByValue(index: number, option: SelectOption<T>): T {
    return option.value;
  }
}
