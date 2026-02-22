/**
 * @fileoverview Button Module - Angular Module for Button Components
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Angular module that exports Button and ButtonWithVariant components.
 *
 * @module momoto-ui/adapters/angular/button/module
 * @version 1.0.0
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { ButtonWithVariantComponent } from './button-with-variant.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonComponent,
    ButtonWithVariantComponent,
  ],
  exports: [
    ButtonComponent,
    ButtonWithVariantComponent,
  ],
})
export class MomotoButtonModule {}

/**
 * USAGE:
 *
 * # Option 1: Import standalone components (recommended for Angular 14+)
 * ```ts
 * import { ButtonComponent, ButtonWithVariantComponent } from '@momoto/ui-adapters/angular/button';
 *
 * @Component({
 *   imports: [ButtonComponent, ButtonWithVariantComponent],
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
 *     console.log('Clicked!');
 *   }
 * }
 * ```
 *
 * # Option 2: Import module (for older Angular versions)
 * ```ts
 * import { MomotoButtonModule } from '@momoto/ui-adapters/angular/button';
 *
 * @NgModule({
 *   imports: [MomotoButtonModule],
 * })
 * export class MyModule {}
 * ```
 */
