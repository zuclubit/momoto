/**
 * @fileoverview Angular Button Adapter - FASE 13 Multi-Framework
 *
 * Angular adapter for ButtonCore.
 * This is a THIN wrapper that delegates all logic to ButtonCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to ButtonCore)
 * - ✅ 100% token-driven (via ButtonCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/angular/button
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
import { ButtonCore, CLASS_PREFIX } from '../../core/button';
import type {
  ButtonSize,
  IconPosition,
  ButtonStyles,
  ResolvedButtonTokens,
  ButtonState,
  SizeConfig,
  QualityWarning,
  ARIAAttributes,
} from '../../core/button/buttonCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

@Component({
  selector: 'momoto-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnChanges {
  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - CONTENT
  // ══════════════════════════════════════════════════════════════════════════

  @Input({ required: true }) label!: string;
  @Input() icon?: any;
  @Input() iconPosition: IconPosition = 'left';

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (BASE)
  // ══════════════════════════════════════════════════════════════════════════

  @Input({ required: true }) backgroundColor!: EnrichedToken;
  @Input({ required: true }) textColor!: EnrichedToken;
  @Input() borderColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (HOVER)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() hoverBackgroundColor?: EnrichedToken;
  @Input() hoverTextColor?: EnrichedToken;
  @Input() hoverBorderColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (FOCUS)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() focusBackgroundColor?: EnrichedToken;
  @Input() focusTextColor?: EnrichedToken;
  @Input() focusBorderColor?: EnrichedToken | null;
  @Input() focusOutlineColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (ACTIVE)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() activeBackgroundColor?: EnrichedToken;
  @Input() activeTextColor?: EnrichedToken;
  @Input() activeBorderColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - TOKENS (DISABLED)
  // ══════════════════════════════════════════════════════════════════════════

  @Input() disabledBackgroundColor?: EnrichedToken;
  @Input() disabledTextColor?: EnrichedToken;
  @Input() disabledBorderColor?: EnrichedToken | null;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - BEHAVIOR
  // ══════════════════════════════════════════════════════════════════════════

  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - LAYOUT
  // ══════════════════════════════════════════════════════════════════════════

  @Input() size: ButtonSize = 'md';
  @Input() fullWidth = false;

  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS - STYLING
  // ══════════════════════════════════════════════════════════════════════════

  @Input() customClass?: string;
  @Input() customStyle?: Partial<ButtonStyles>;

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

  @Output() buttonClick = new EventEmitter<void>();

  // ══════════════════════════════════════════════════════════════════════════
  // STATE (Angular-specific)
  // ══════════════════════════════════════════════════════════════════════════

  protected isHovered = false;
  protected isFocused = false;
  protected isActive = false;

  // ══════════════════════════════════════════════════════════════════════════
  // BUTTON CORE OUTPUT (computed)
  // ══════════════════════════════════════════════════════════════════════════

  protected currentState!: ButtonState;
  protected resolvedTokens!: ResolvedButtonTokens;
  protected buttonStyles!: ButtonStyles;
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
    // Recompute button output when inputs change
    this.updateButtonOutput();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // BUTTON CORE INTEGRATION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Update button output via ButtonCore.
   *
   * This method delegates ALL logic to ButtonCore.processButton().
   * NO logic duplication - pure delegation.
   */
  private updateButtonOutput(): void {
    const output = ButtonCore.processButton({
      // Tokens
      tokens: {
        backgroundColor: this.backgroundColor,
        textColor: this.textColor,
        borderColor: this.borderColor,
        hoverBackgroundColor: this.hoverBackgroundColor,
        hoverTextColor: this.hoverTextColor,
        hoverBorderColor: this.hoverBorderColor,
        focusBackgroundColor: this.focusBackgroundColor,
        focusTextColor: this.focusTextColor,
        focusBorderColor: this.focusBorderColor,
        focusOutlineColor: this.focusOutlineColor,
        activeBackgroundColor: this.activeBackgroundColor,
        activeTextColor: this.activeTextColor,
        activeBorderColor: this.activeBorderColor,
        disabledBackgroundColor: this.disabledBackgroundColor,
        disabledTextColor: this.disabledTextColor,
        disabledBorderColor: this.disabledBorderColor,
      },

      // Interaction state
      disabled: this.disabled,
      loading: this.loading,
      isHovered: this.isHovered,
      isFocused: this.isFocused,
      isActive: this.isActive,

      // Layout
      size: this.size,
      fullWidth: this.fullWidth,
      hasIcon: !!this.icon,

      // Content
      label: this.label,

      // ARIA
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
    this.buttonStyles = output.styles;
    this.ariaAttrs = output.ariaAttrs;
    this.classNames = output.classNames;
    this.sizeConfig = output.sizeConfig;
    this.qualityWarnings = output.qualityWarnings;

    // Log quality warnings
    if (this.qualityWarnings.length > 0) {
      this.qualityWarnings.forEach((warning) => {
        console.warn(`[Button] ${warning.message}`, warning.details);
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS (Angular-specific)
  // ══════════════════════════════════════════════════════════════════════════

  protected onClick(): void {
    if (this.disabled || this.loading) {
      return;
    }
    this.buttonClick.emit();
  }

  protected onMouseEnter(): void {
    if (this.disabled || this.loading) {
      return;
    }
    this.isHovered = true;
    this.updateButtonOutput();
  }

  protected onMouseLeave(): void {
    this.isHovered = false;
    this.isActive = false;
    this.updateButtonOutput();
  }

  protected onFocus(): void {
    if (this.disabled || this.loading) {
      return;
    }
    this.isFocused = true;
    this.updateButtonOutput();
  }

  protected onBlur(): void {
    this.isFocused = false;
    this.updateButtonOutput();
  }

  protected onMouseDown(): void {
    if (this.disabled || this.loading) {
      return;
    }
    this.isActive = true;
    this.updateButtonOutput();
  }

  protected onMouseUp(): void {
    this.isActive = false;
    this.updateButtonOutput();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLATE UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Convert ButtonStyles to Angular [ngStyle] format.
   */
  protected getStyleObject(): Record<string, string | number> {
    const styles: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(this.buttonStyles)) {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

      // Add 'px' suffix for numeric values (except unitless properties)
      const unitlessProps = ['fontWeight', 'lineHeight', 'gap'];
      const cssValue = typeof value === 'number' && !unitlessProps.includes(key)
        ? `${value}px`
        : value;

      styles[cssKey] = cssValue;
    }

    return styles;
  }
}

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Zero logic duplication
 *    - ALL logic delegated to ButtonCore.processButton()
 *    - Component is wrapper around ButtonCore
 *    - Adapter is THIN
 *
 * ✅ 100% token-driven
 *    - All colors from EnrichedToken (via ButtonCore)
 *    - NO local color calculations
 *
 * ✅ State management via framework
 *    - Uses Angular component properties for interaction state
 *    - ButtonCore handles state determination
 *
 * ✅ Framework-specific concerns only
 *    - Template rendering (Angular-specific)
 *    - Event handling (Angular events → ButtonCore)
 *    - Change detection (Angular OnChanges)
 *
 * ✅ Identical behavior to React/Vue/Svelte
 *    - Same ButtonCore
 *    - Same tokens
 *    - Same output
 */
