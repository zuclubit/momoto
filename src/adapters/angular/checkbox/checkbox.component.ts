/**
 * @fileoverview Angular Checkbox Adapter
 *
 * FASE 15: Component Expansion
 *
 * Angular adapter for CheckboxCore.
 * This is a THIN wrapper that delegates all logic to CheckboxCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to CheckboxCore)
 * - ✅ 100% token-driven (via CheckboxCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/angular/checkbox
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
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxCore, CLASS_PREFIX } from '../../core/checkbox';
import type {
  CheckboxSize,
  CheckboxStyles,
  ResolvedCheckboxTokens,
  CheckboxState,
  SizeConfig,
  QualityWarning,
  ARIAAttributes,
} from '../../core/checkbox/checkboxCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

@Component({
  selector: 'momoto-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements OnChanges, AfterViewInit {
  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - CHECK STATE
  // ══════════════════════════════════════════════════════════════════════════

  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() label?: string;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (BASE)
  // ══════════════════════════════════════════════════════════════════════════

  @Input({ required: true }) backgroundColor!: EnrichedToken;
  @Input({ required: true }) borderColor!: EnrichedToken;
  @Input({ required: true }) checkColor!: EnrichedToken;
  @Input() labelColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (HOVER)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() hoverBackgroundColor?: EnrichedToken;
  @Input() hoverBorderColor?: EnrichedToken;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (FOCUS)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() focusBackgroundColor?: EnrichedToken;
  @Input() focusBorderColor?: EnrichedToken;
  @Input() focusOutlineColor?: EnrichedToken;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (CHECKED)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() checkedBackgroundColor?: EnrichedToken;
  @Input() checkedBorderColor?: EnrichedToken;
  @Input() checkedCheckColor?: EnrichedToken;

  @Input() checkedHoverBackgroundColor?: EnrichedToken;
  @Input() checkedHoverBorderColor?: EnrichedToken;
  @Input() checkedHoverCheckColor?: EnrichedToken;

  @Input() checkedFocusBackgroundColor?: EnrichedToken;
  @Input() checkedFocusBorderColor?: EnrichedToken;
  @Input() checkedFocusCheckColor?: EnrichedToken;
  @Input() checkedFocusOutlineColor?: EnrichedToken;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (INDETERMINATE)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() indeterminateBackgroundColor?: EnrichedToken;
  @Input() indeterminateBorderColor?: EnrichedToken;
  @Input() indeterminateCheckColor?: EnrichedToken;

  @Input() indeterminateHoverBackgroundColor?: EnrichedToken;
  @Input() indeterminateHoverBorderColor?: EnrichedToken;
  @Input() indeterminateHoverCheckColor?: EnrichedToken;

  @Input() indeterminateFocusBackgroundColor?: EnrichedToken;
  @Input() indeterminateFocusBorderColor?: EnrichedToken;
  @Input() indeterminateFocusCheckColor?: EnrichedToken;
  @Input() indeterminateFocusOutlineColor?: EnrichedToken;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (DISABLED)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() disabledBackgroundColor?: EnrichedToken;
  @Input() disabledBorderColor?: EnrichedToken;
  @Input() disabledCheckColor?: EnrichedToken;
  @Input() disabledLabelColor?: EnrichedToken;

  @Input() checkedDisabledBackgroundColor?: EnrichedToken;
  @Input() checkedDisabledBorderColor?: EnrichedToken;
  @Input() checkedDisabledCheckColor?: EnrichedToken;

  @Input() indeterminateDisabledBackgroundColor?: EnrichedToken;
  @Input() indeterminateDisabledBorderColor?: EnrichedToken;
  @Input() indeterminateDisabledCheckColor?: EnrichedToken;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - BEHAVIOR
  // ══════════════════════════════════════════════════════════════════════════

  @Input() disabled = false;
  @Input() required = false;
  @Input() invalid = false;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - LAYOUT
  // ══════════════════════════════════════════════════════════════════════════

  @Input() size: CheckboxSize = 'md';

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - STYLING
  // ══════════════════════════════════════════════════════════════════════════

  @Input() customClass?: string;
  @Input() customStyle?: Partial<CheckboxStyles>;

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

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() checkboxFocus = new EventEmitter<FocusEvent>();
  @Output() checkboxBlur = new EventEmitter<FocusEvent>();

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW CHILD (for indeterminate state sync)
  // ══════════════════════════════════════════════════════════════════════════

  @ViewChild('inputRef', { static: false }) inputRef?: ElementRef<HTMLInputElement>;

  // ══════════════════════════════════════════════════════════════════════════
  // STATE (Angular-specific)
  // ══════════════════════════════════════════════════════════════════════════

  protected isHovered = false;
  protected isFocused = false;

  // ══════════════════════════════════════════════════════════════════════════
  // CHECKBOX CORE OUTPUT (computed)
  // ══════════════════════════════════════════════════════════════════════════

  protected currentState!: CheckboxState;
  protected resolvedTokens!: ResolvedCheckboxTokens;
  protected checkboxStyles!: CheckboxStyles;
  protected ariaAttrs!: ARIAAttributes;
  protected classNames!: string;
  protected sizeConfig!: SizeConfig;
  protected qualityWarnings: QualityWarning[] = [];

  // Class prefix for template
  protected readonly CLASS_PREFIX = CLASS_PREFIX;

  // ══════════════════════════════════════════════════════════════════════════
  // COMPUTED PROPERTIES
  // ══════════════════════════════════════════════════════════════════════════

  protected get showIcon(): boolean {
    return this.checked || this.indeterminate;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════

  ngOnChanges(changes: SimpleChanges): void {
    // Recompute checkbox output when inputs change
    this.updateCheckboxOutput();

    // Sync indeterminate state with native checkbox
    if (changes['indeterminate'] && this.inputRef) {
      this.inputRef.nativeElement.indeterminate = this.indeterminate;
    }
  }

  ngAfterViewInit(): void {
    // Initial sync of indeterminate state
    if (this.inputRef) {
      this.inputRef.nativeElement.indeterminate = this.indeterminate;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECKBOX CORE INTEGRATION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Update checkbox output via CheckboxCore.
   *
   * This method delegates ALL logic to CheckboxCore.processCheckbox().
   * NO logic duplication - pure delegation.
   */
  private updateCheckboxOutput(): void {
    const output = CheckboxCore.processCheckbox({
      // Tokens
      tokens: {
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        checkColor: this.checkColor,
        labelColor: this.labelColor,
        hoverBackgroundColor: this.hoverBackgroundColor,
        hoverBorderColor: this.hoverBorderColor,
        focusBackgroundColor: this.focusBackgroundColor,
        focusBorderColor: this.focusBorderColor,
        focusOutlineColor: this.focusOutlineColor,
        checkedBackgroundColor: this.checkedBackgroundColor,
        checkedBorderColor: this.checkedBorderColor,
        checkedCheckColor: this.checkedCheckColor,
        checkedHoverBackgroundColor: this.checkedHoverBackgroundColor,
        checkedHoverBorderColor: this.checkedHoverBorderColor,
        checkedHoverCheckColor: this.checkedHoverCheckColor,
        checkedFocusBackgroundColor: this.checkedFocusBackgroundColor,
        checkedFocusBorderColor: this.checkedFocusBorderColor,
        checkedFocusCheckColor: this.checkedFocusCheckColor,
        checkedFocusOutlineColor: this.checkedFocusOutlineColor,
        indeterminateBackgroundColor: this.indeterminateBackgroundColor,
        indeterminateBorderColor: this.indeterminateBorderColor,
        indeterminateCheckColor: this.indeterminateCheckColor,
        indeterminateHoverBackgroundColor: this.indeterminateHoverBackgroundColor,
        indeterminateHoverBorderColor: this.indeterminateHoverBorderColor,
        indeterminateHoverCheckColor: this.indeterminateHoverCheckColor,
        indeterminateFocusBackgroundColor: this.indeterminateFocusBackgroundColor,
        indeterminateFocusBorderColor: this.indeterminateFocusBorderColor,
        indeterminateFocusCheckColor: this.indeterminateFocusCheckColor,
        indeterminateFocusOutlineColor: this.indeterminateFocusOutlineColor,
        disabledBackgroundColor: this.disabledBackgroundColor,
        disabledBorderColor: this.disabledBorderColor,
        disabledCheckColor: this.disabledCheckColor,
        disabledLabelColor: this.disabledLabelColor,
        checkedDisabledBackgroundColor: this.checkedDisabledBackgroundColor,
        checkedDisabledBorderColor: this.checkedDisabledBorderColor,
        checkedDisabledCheckColor: this.checkedDisabledCheckColor,
        indeterminateDisabledBackgroundColor: this.indeterminateDisabledBackgroundColor,
        indeterminateDisabledBorderColor: this.indeterminateDisabledBorderColor,
        indeterminateDisabledCheckColor: this.indeterminateDisabledCheckColor,
      },

      // Check state
      isChecked: this.checked,
      isIndeterminate: this.indeterminate,

      // Interaction state
      disabled: this.disabled,
      isHovered: this.isHovered,
      isFocused: this.isFocused,

      // Layout
      size: this.size,

      // Content
      label: this.label,

      // ARIA
      required: this.required,
      invalid: this.invalid,
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
    this.checkboxStyles = output.styles;
    this.ariaAttrs = output.ariaAttrs;
    this.classNames = output.classNames;
    this.sizeConfig = output.sizeConfig;
    this.qualityWarnings = output.qualityWarnings;

    // Log quality warnings
    if (this.qualityWarnings.length > 0) {
      this.qualityWarnings.forEach((warning) => {
        console.warn(`[Checkbox] ${warning.message}`, warning.details);
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS (Angular-specific)
  // ══════════════════════════════════════════════════════════════════════════

  protected onChange(event: Event): void {
    if (this.disabled) {
      return;
    }
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(this.checked);
  }

  protected onMouseEnter(): void {
    if (this.disabled) {
      return;
    }
    this.isHovered = true;
    this.updateCheckboxOutput();
  }

  protected onMouseLeave(): void {
    this.isHovered = false;
    this.updateCheckboxOutput();
  }

  protected onFocus(event: FocusEvent): void {
    if (this.disabled) {
      return;
    }
    this.isFocused = true;
    this.updateCheckboxOutput();
    this.checkboxFocus.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.updateCheckboxOutput();
    this.checkboxBlur.emit(event);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get container style object for [ngStyle].
   */
  protected getContainerStyle(): Record<string, string | number> {
    return {
      'display': this.checkboxStyles.containerDisplay || 'inline-flex',
      'align-items': this.checkboxStyles.containerAlignItems || 'center',
      'gap': `${this.checkboxStyles.containerGap}px`,
      'cursor': this.checkboxStyles.containerCursor || 'pointer',
      'opacity': this.checkboxStyles.containerOpacity ?? 1,
    };
  }

  /**
   * Get box style object for [ngStyle].
   */
  protected getBoxStyle(): Record<string, string | number> {
    const styles: Record<string, string | number> = {
      'position': 'relative',
      'width': `${this.checkboxStyles.boxWidth}px`,
      'height': `${this.checkboxStyles.boxHeight}px`,
      'background-color': this.checkboxStyles.boxBackgroundColor,
      'border-width': `${this.checkboxStyles.boxBorderWidth}px`,
      'border-style': this.checkboxStyles.boxBorderStyle,
      'border-color': this.checkboxStyles.boxBorderColor,
      'border-radius': `${this.checkboxStyles.boxBorderRadius}px`,
      'display': this.checkboxStyles.boxDisplay || 'inline-flex',
      'align-items': this.checkboxStyles.boxAlignItems || 'center',
      'justify-content': this.checkboxStyles.boxJustifyContent || 'center',
      'transition': this.checkboxStyles.boxTransition || 'none',
    };

    if (this.checkboxStyles.outlineColor) {
      styles['outline'] = `${this.checkboxStyles.outlineWidth}px solid ${this.checkboxStyles.outlineColor}`;
      styles['outline-offset'] = `${this.checkboxStyles.outlineOffset}px`;
    }

    return styles;
  }

  /**
   * Get icon style object for [ngStyle].
   */
  protected getIconStyle(): Record<string, string | number> {
    return {
      'width': `${this.checkboxStyles.iconSize}px`,
      'height': `${this.checkboxStyles.iconSize}px`,
      'color': this.checkboxStyles.iconColor,
      'display': this.checkboxStyles.iconDisplay || 'block',
    };
  }

  /**
   * Get label style object for [ngStyle].
   */
  protected getLabelStyle(): Record<string, string | number> | null {
    if (!this.checkboxStyles.labelColor) {
      return null;
    }

    return {
      'font-size': `${this.checkboxStyles.labelFontSize}px`,
      'color': this.checkboxStyles.labelColor,
    };
  }
}

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Zero logic duplication
 *    - ALL logic delegated to CheckboxCore.processCheckbox()
 *    - Component is wrapper around CheckboxCore
 *    - Adapter is THIN
 *
 * ✅ 100% token-driven
 *    - All colors from EnrichedToken (via CheckboxCore)
 *    - NO local color calculations
 *
 * ✅ State management via framework
 *    - Uses Angular component properties for interaction state
 *    - CheckboxCore handles state determination
 *
 * ✅ Framework-specific concerns only
 *    - Template rendering (Angular-specific)
 *    - Event handling (Angular events → CheckboxCore)
 *    - Change detection (Angular OnChanges)
 *    - Indeterminate sync (Angular AfterViewInit + ViewChild)
 *
 * ✅ Identical behavior to React/Vue/Svelte
 *    - Same CheckboxCore
 *    - Same tokens
 *    - Same output
 *
 * ✅ Tri-state support
 *    - Unchecked, checked, indeterminate
 *    - Proper ARIA compliance
 *
 * PATTERN: Exact copy of textfield.component.ts adapted for Checkbox
 */
