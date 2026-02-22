/**
 * @fileoverview Angular TextField Adapter
 *
 * FASE 15: Component Expansion
 *
 * Angular adapter for TextFieldCore.
 * This is a THIN wrapper that delegates all logic to TextFieldCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to TextFieldCore)
 * - ✅ 100% token-driven (via TextFieldCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/angular/textfield
 * @version 1.0.0
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextFieldCore, CLASS_PREFIX } from '../../core/textfield';
import type {
  TextFieldSize,
  TextFieldStyles,
  ResolvedTextFieldTokens,
  TextFieldState,
  SizeConfig,
  QualityWarning,
  ARIAAttributes,
} from '../../core/textfield/textFieldCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

@Component({
  selector: 'momoto-textfield',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldComponent implements OnChanges {
  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - CONTENT
  // ══════════════════════════════════════════════════════════════════════════

  @Input({ required: true }) value!: string;
  @Input() placeholder?: string;
  @Input() label?: string;
  @Input() helperText?: string;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (BASE)
  // ══════════════════════════════════════════════════════════════════════════

  @Input({ required: true }) backgroundColor!: EnrichedToken;
  @Input({ required: true }) textColor!: EnrichedToken;
  @Input() borderColor?: EnrichedToken | null;
  @Input() placeholderColor?: EnrichedToken | null;
  @Input() labelColor?: EnrichedToken | null;
  @Input() helperTextColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (HOVER)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() hoverBackgroundColor?: EnrichedToken;
  @Input() hoverBorderColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (FOCUS)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() focusBackgroundColor?: EnrichedToken;
  @Input() focusBorderColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (ERROR)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() errorBackgroundColor?: EnrichedToken;
  @Input() errorTextColor?: EnrichedToken;
  @Input() errorBorderColor?: EnrichedToken | null;
  @Input() errorLabelColor?: EnrichedToken | null;
  @Input() errorHelperTextColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (SUCCESS)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() successBackgroundColor?: EnrichedToken;
  @Input() successTextColor?: EnrichedToken;
  @Input() successBorderColor?: EnrichedToken | null;
  @Input() successLabelColor?: EnrichedToken | null;
  @Input() successHelperTextColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (DISABLED)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() disabledBackgroundColor?: EnrichedToken;
  @Input() disabledTextColor?: EnrichedToken;
  @Input() disabledBorderColor?: EnrichedToken | null;
  @Input() disabledLabelColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - BEHAVIOR
  // ══════════════════════════════════════════════════════════════════════════

  @Input() type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' = 'text';
  @Input() disabled = false;
  @Input() error = false;
  @Input() success = false;
  @Input() required = false;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - LAYOUT
  // ══════════════════════════════════════════════════════════════════════════

  @Input() size: TextFieldSize = 'md';
  @Input() fullWidth = false;
  @Input() multiline = false;
  @Input() rows = 3;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - STYLING
  // ══════════════════════════════════════════════════════════════════════════

  @Input() customClass?: string;
  @Input() customStyle?: Partial<TextFieldStyles>;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - ACCESSIBILITY
  // ══════════════════════════════════════════════════════════════════════════

  @Input() ariaLabel?: string;
  @Input() ariaDescribedby?: string;
  @Input() testId?: string;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - DEVELOPER EXPERIENCE
  // ══════════════════════════════════════════════════════════════════════════

  @Input() showQualityWarnings = true;

  // ══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ══════════════════════════════════════════════════════════════════════════

  @Output() valueChange = new EventEmitter<string>();
  @Output() textFieldFocus = new EventEmitter<FocusEvent>();
  @Output() textFieldBlur = new EventEmitter<FocusEvent>();

  // ══════════════════════════════════════════════════════════════════════════
  // STATE (Angular-specific)
  // ══════════════════════════════════════════════════════════════════════════

  protected isHovered = false;
  protected isFocused = false;

  // ══════════════════════════════════════════════════════════════════════════
  // TEXTFIELD CORE OUTPUT (computed)
  // ══════════════════════════════════════════════════════════════════════════

  protected currentState!: TextFieldState;
  protected resolvedTokens!: ResolvedTextFieldTokens;
  protected textFieldStyles!: TextFieldStyles;
  protected ariaAttrs!: ARIAAttributes;
  protected classNames!: string;
  protected sizeConfig!: SizeConfig;
  protected qualityWarnings: QualityWarning[] = [];

  // Class prefix for template
  protected readonly CLASS_PREFIX = CLASS_PREFIX;

  // ══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════

  ngOnChanges(changes: SimpleChanges): void {
    // Recompute text field output when inputs change
    this.updateTextFieldOutput();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEXTFIELD CORE INTEGRATION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Update text field output via TextFieldCore.
   *
   * This method delegates ALL logic to TextFieldCore.processTextField().
   * NO logic duplication - pure delegation.
   */
  private updateTextFieldOutput(): void {
    const output = TextFieldCore.processTextField({
      // Tokens
      tokens: {
        backgroundColor: this.backgroundColor,
        textColor: this.textColor,
        borderColor: this.borderColor,
        placeholderColor: this.placeholderColor,
        labelColor: this.labelColor,
        helperTextColor: this.helperTextColor,
        hoverBackgroundColor: this.hoverBackgroundColor,
        hoverBorderColor: this.hoverBorderColor,
        focusBackgroundColor: this.focusBackgroundColor,
        focusBorderColor: this.focusBorderColor,
        errorBackgroundColor: this.errorBackgroundColor,
        errorTextColor: this.errorTextColor,
        errorBorderColor: this.errorBorderColor,
        errorLabelColor: this.errorLabelColor,
        errorHelperTextColor: this.errorHelperTextColor,
        successBackgroundColor: this.successBackgroundColor,
        successTextColor: this.successTextColor,
        successBorderColor: this.successBorderColor,
        successLabelColor: this.successLabelColor,
        successHelperTextColor: this.successHelperTextColor,
        disabledBackgroundColor: this.disabledBackgroundColor,
        disabledTextColor: this.disabledTextColor,
        disabledBorderColor: this.disabledBorderColor,
        disabledLabelColor: this.disabledLabelColor,
      },

      // Interaction state
      disabled: this.disabled,
      error: this.error,
      success: this.success,
      isHovered: this.isHovered,
      isFocused: this.isFocused,

      // Layout
      size: this.size,
      fullWidth: this.fullWidth,
      multiline: this.multiline,

      // Content
      label: this.label,
      helperText: this.helperText,

      // ARIA
      required: this.required,
      ariaLabel: this.ariaLabel,
      ariaDescribedby: this.ariaDescribedby,

      // Styles
      userStyles: this.customStyle,

      // Dev mode
      showQualityWarnings: this.showQualityWarnings,
      customClass: this.customClass,
    });

    // Update component properties
    this.currentState = output.currentState;
    this.resolvedTokens = output.resolvedTokens;
    this.textFieldStyles = output.styles;
    this.ariaAttrs = output.ariaAttrs;
    this.classNames = output.classNames;
    this.sizeConfig = output.sizeConfig;
    this.qualityWarnings = output.qualityWarnings;

    // Log quality warnings
    if (this.qualityWarnings.length > 0) {
      this.qualityWarnings.forEach((warning) => {
        console.warn(`[TextField] ${warning.message}`, warning.details);
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS (Angular-specific)
  // ══════════════════════════════════════════════════════════════════════════

  protected onInput(event: Event): void {
    if (this.disabled) {
      return;
    }
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  protected onMouseEnter(): void {
    if (this.disabled) {
      return;
    }
    this.isHovered = true;
    this.updateTextFieldOutput();
  }

  protected onMouseLeave(): void {
    this.isHovered = false;
    this.updateTextFieldOutput();
  }

  protected onFocus(event: FocusEvent): void {
    if (this.disabled) {
      return;
    }
    this.isFocused = true;
    this.updateTextFieldOutput();
    this.textFieldFocus.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.updateTextFieldOutput();
    this.textFieldBlur.emit(event);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get container style object for [ngStyle].
   */
  protected getContainerStyle(): Record<string, string | number> {
    return {
      'width': this.textFieldStyles.containerWidth || 'auto',
      'display': this.textFieldStyles.containerDisplay || 'flex',
      'flex-direction': this.textFieldStyles.containerFlexDirection || 'column',
      'gap': `${this.textFieldStyles.containerGap}px`,
    };
  }

  /**
   * Get input style object for [ngStyle].
   */
  protected getInputStyle(): Record<string, string | number> {
    const styles: Record<string, string | number> = {
      'height': this.multiline ? 'auto' : `${this.textFieldStyles.inputHeight}px`,
      'padding-left': `${this.textFieldStyles.inputPaddingLeft}px`,
      'padding-right': `${this.textFieldStyles.inputPaddingRight}px`,
      'padding-top': `${this.textFieldStyles.inputPaddingTop}px`,
      'padding-bottom': `${this.textFieldStyles.inputPaddingBottom}px`,
      'font-size': `${this.textFieldStyles.inputFontSize}px`,
      'font-weight': this.textFieldStyles.inputFontWeight || 400,
      'line-height': this.textFieldStyles.inputLineHeight || 1.5,
      'font-family': this.textFieldStyles.inputFontFamily || 'inherit',
      'background-color': this.textFieldStyles.inputBackgroundColor || 'transparent',
      'color': this.textFieldStyles.inputColor || 'inherit',
      'border-radius': `${this.textFieldStyles.inputBorderRadius}px`,
      'outline': this.textFieldStyles.inputOutline || 'none',
      'cursor': this.textFieldStyles.inputCursor || 'text',
      'transition': this.textFieldStyles.inputTransition || 'none',
    };

    if (this.textFieldStyles.inputBorderWidth) {
      styles['border-width'] = `${this.textFieldStyles.inputBorderWidth}px`;
    }
    if (this.textFieldStyles.inputBorderStyle) {
      styles['border-style'] = this.textFieldStyles.inputBorderStyle;
    }
    if (this.textFieldStyles.inputBorderColor) {
      styles['border-color'] = this.textFieldStyles.inputBorderColor;
    }

    return styles;
  }

  /**
   * Get label style object for [ngStyle].
   */
  protected getLabelStyle(): Record<string, string | number> | null {
    if (!this.textFieldStyles.labelColor) {
      return null;
    }

    return {
      'font-size': `${this.textFieldStyles.labelFontSize}px`,
      'font-weight': this.textFieldStyles.labelFontWeight || 500,
      'color': this.textFieldStyles.labelColor,
      'margin-bottom': `${this.textFieldStyles.labelMarginBottom}px`,
    };
  }

  /**
   * Get helper text style object for [ngStyle].
   */
  protected getHelperStyle(): Record<string, string | number> | null {
    if (!this.textFieldStyles.helperColor) {
      return null;
    }

    return {
      'font-size': `${this.textFieldStyles.helperFontSize}px`,
      'color': this.textFieldStyles.helperColor,
      'margin-top': `${this.textFieldStyles.helperMarginTop}px`,
    };
  }
}

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Zero logic duplication
 *    - ALL logic delegated to TextFieldCore.processTextField()
 *    - Component is wrapper around TextFieldCore
 *    - Adapter is THIN
 *
 * ✅ 100% token-driven
 *    - All colors from EnrichedToken (via TextFieldCore)
 *    - NO local color calculations
 *
 * ✅ State management via framework
 *    - Uses Angular component properties for interaction state
 *    - TextFieldCore handles state determination
 *
 * ✅ Framework-specific concerns only
 *    - Template rendering (Angular-specific)
 *    - Event handling (Angular events → TextFieldCore)
 *    - Change detection (Angular OnChanges)
 *
 * ✅ Identical behavior to React/Vue/Svelte
 *    - Same TextFieldCore
 *    - Same tokens
 *    - Same output
 *
 * PATTERN: Exact copy of button.component.ts adapted for TextField
 */
