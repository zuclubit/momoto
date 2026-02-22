/**
 * @fileoverview Angular Button Adapter - Exports
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Central export point for Angular Button components.
 *
 * @module momoto-ui/adapters/angular/button
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { ButtonComponent } from './button.component';
export { ButtonWithVariantComponent, TOKEN_THEME } from './button-with-variant.component';

// ============================================================================
// MODULE
// ============================================================================

export { MomotoButtonModule } from './button.module';

// ============================================================================
// TYPES
// ============================================================================

export type {
  ButtonInputs,
  ButtonWithVariantInputs,
} from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Standalone component with explicit tokens
 * ```ts
 * import { Component } from '@angular/core';
 * import { ButtonComponent } from '@momoto/ui-adapters/angular/button';
 *
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [ButtonComponent],
 *   template: `
 *     <momoto-button
 *       label="Submit"
 *       [backgroundColor]="primaryBg"
 *       [textColor]="primaryText"
 *       (buttonClick)="handleClick()"
 *     ></momoto-button>
 *   `
 * })
 * export class MyComponent {
 *   primaryBg = submitBackgroundToken;
 *   primaryText = submitTextToken;
 *
 *   handleClick() {
 *     console.log('Clicked!');
 *   }
 * }
 * ```
 *
 * # Example 2: ButtonWithVariant (preferred)
 * ```ts
 * import { Component } from '@angular/core';
 * import { ButtonWithVariantComponent, TOKEN_THEME } from '@momoto/ui-adapters/angular/button';
 *
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [ButtonWithVariantComponent],
 *   providers: [
 *     { provide: TOKEN_THEME, useValue: myGeneratedTheme }
 *   ],
 *   template: `
 *     <momoto-button-with-variant
 *       label="Submit"
 *       variant="primary"
 *       (buttonClick)="handleSubmit()"
 *     ></momoto-button-with-variant>
 *   `
 * })
 * export class MyComponent {
 *   handleSubmit() {
 *     console.log('Submitted!');
 *   }
 * }
 * ```
 *
 * # Example 3: With module (older Angular)
 * ```ts
 * import { NgModule } from '@angular/core';
 * import { MomotoButtonModule, TOKEN_THEME } from '@momoto/ui-adapters/angular/button';
 *
 * @NgModule({
 *   imports: [MomotoButtonModule],
 *   providers: [
 *     { provide: TOKEN_THEME, useValue: myGeneratedTheme }
 *   ]
 * })
 * export class AppModule {}
 * ```
 *
 * # Example 4: Loading state
 * ```ts
 * import { Component } from '@angular/core';
 * import { ButtonWithVariantComponent } from '@momoto/ui-adapters/angular/button';
 *
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [ButtonWithVariantComponent],
 *   template: `
 *     <momoto-button-with-variant
 *       label="Submit"
 *       variant="primary"
 *       [loading]="isLoading"
 *       (buttonClick)="handleSubmit()"
 *     ></momoto-button-with-variant>
 *   `
 * })
 * export class MyComponent {
 *   isLoading = false;
 *
 *   async handleSubmit() {
 *     this.isLoading = true;
 *     await this.submitForm();
 *     this.isLoading = false;
 *   }
 *
 *   async submitForm() {
 *     // Submit logic
 *   }
 * }
 * ```
 */
