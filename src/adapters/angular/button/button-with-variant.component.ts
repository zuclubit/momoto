/**
 * @fileoverview ButtonWithVariant - Angular Adapter with Theme Variant
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Angular Button that resolves tokens from theme based on variant.
 * This is the preferred API for most use cases.
 *
 * @module momoto-ui/adapters/angular/button/ButtonWithVariant
 * @version 1.0.0
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  Optional,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import type { ButtonVariant } from '../../core/button/buttonCore.types';
import type { TokenTheme } from '../../../components/primitives/tokens/TokenTheme.types';

/**
 * Injection token for TokenTheme.
 *
 * Usage:
 * ```ts
 * // In app module or component:
 * providers: [
 *   { provide: TOKEN_THEME, useValue: myTheme }
 * ]
 * ```
 */
export const TOKEN_THEME = 'MOMOTO_TOKEN_THEME';

@Component({
  selector: 'momoto-button-with-variant',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <momoto-button
      [label]="label"
      [icon]="icon"
      [iconPosition]="iconPosition"
      [type]="type"
      [disabled]="disabled"
      [loading]="loading"
      [size]="size"
      [fullWidth]="fullWidth"
      [customClass]="customClass"
      [customStyle]="customStyle"
      [ariaLabel]="ariaLabel"
      [ariaDescribedby]="ariaDescribedby"
      [testId]="testId"
      [showQualityWarnings]="showQualityWarnings"
      [backgroundColor]="tokens.background"
      [textColor]="tokens.text"
      [borderColor]="tokens.border"
      [hoverBackgroundColor]="tokens.hover.background"
      [hoverTextColor]="tokens.hover.text"
      [hoverBorderColor]="tokens.hover.border"
      [focusBackgroundColor]="tokens.focus.background"
      [focusTextColor]="tokens.focus.text"
      [focusBorderColor]="tokens.focus.border"
      [focusOutlineColor]="tokens.focus.outline"
      [activeBackgroundColor]="tokens.active.background"
      [activeTextColor]="tokens.active.text"
      [activeBorderColor]="tokens.active.border"
      [disabledBackgroundColor]="tokens.disabled.background"
      [disabledTextColor]="tokens.disabled.text"
      [disabledBorderColor]="tokens.disabled.border"
      (buttonClick)="buttonClick.emit()"
    >
      <!-- Forward content projection -->
      <ng-content select="[iconLeft]" iconLeft></ng-content>
      <ng-content select="[iconRight]" iconRight></ng-content>
    </momoto-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonWithVariantComponent {
  // ══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ══════════════════════════════════════════════════════════════════════════

  @Input() variant: ButtonVariant = 'primary';

  // Content
  @Input({ required: true }) label!: string;
  @Input() icon?: any;
  @Input() iconPosition: 'left' | 'right' = 'left';

  // Behavior
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;

  // Layout
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;

  // Styling
  @Input() customClass?: string;
  @Input() customStyle?: any;

  // Accessibility
  @Input() ariaLabel?: string;
  @Input() ariaDescribedby?: string;
  @Input() testId?: string;

  // Developer experience
  @Input() showQualityWarnings = true;

  // ══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ══════════════════════════════════════════════════════════════════════════

  @Output() buttonClick = new EventEmitter<void>();

  // ══════════════════════════════════════════════════════════════════════════
  // THEME INJECTION
  // ══════════════════════════════════════════════════════════════════════════

  private readonly theme: TokenTheme;

  constructor(
    @Optional() @Inject(TOKEN_THEME) theme: TokenTheme | null
  ) {
    if (!theme) {
      throw new Error(
        '[ButtonWithVariant] No theme found. Provide TOKEN_THEME in your module/component.'
      );
    }
    this.theme = theme;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TOKEN RESOLUTION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Resolve tokens from theme based on variant.
   */
  protected get tokens() {
    const variantTokens = this.theme.button[this.variant];

    if (!variantTokens) {
      throw new Error(`[ButtonWithVariant] Invalid variant: ${this.variant}`);
    }

    return variantTokens;
  }
}

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Token resolution from theme
 *    - Accesses theme.button[variant]
 *    - Passes resolved tokens to Button
 *
 * ✅ Zero logic duplication
 *    - Delegates to ButtonComponent
 *    - ButtonComponent delegates to ButtonCore
 *
 * ✅ Framework-specific theme access
 *    - Uses Angular DI with @Inject
 *    - Same contract as React's useTokenTheme()
 *
 * USAGE EXAMPLE:
 *
 * ```ts
 * // In app.module.ts or component:
 * import { TOKEN_THEME } from '@momoto/ui-adapters/angular/button';
 *
 * @NgModule({
 *   providers: [
 *     { provide: TOKEN_THEME, useValue: myGeneratedTheme }
 *   ]
 * })
 *
 * // In template:
 * <momoto-button-with-variant
 *   label="Submit"
 *   variant="primary"
 *   (buttonClick)="handleSubmit()"
 * ></momoto-button-with-variant>
 * ```
 */
