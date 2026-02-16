/**
 * @fileoverview Angular TextField Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for Angular TextField components.
 *
 * @module momoto-ui/adapters/angular/textfield
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { TextFieldComponent } from './textfield.component';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic TextField in Angular component
 * ```typescript
 * import { Component } from '@angular/core';
 * import { TextFieldComponent } from '@momoto/ui-adapters/angular/textfield';
 *
 * @Component({
 *   selector: 'app-my-form',
 *   standalone: true,
 *   imports: [TextFieldComponent],
 *   template: `
 *     <momoto-textfield
 *       [value]="email"
 *       (valueChange)="email = $event"
 *       [backgroundColor]="inputBgToken"
 *       [textColor]="inputTextToken"
 *       label="Email"
 *       placeholder="Enter your email"
 *       type="email"
 *     />
 *   `,
 * })
 * export class MyFormComponent {
 *   email = '';
 *   inputBgToken: EnrichedToken; // token from theme
 *   inputTextToken: EnrichedToken; // token from theme
 * }
 * ```
 *
 * # Example 2: TextField with validation
 * ```typescript
 * import { Component } from '@angular/core';
 * import { TextFieldComponent } from '@momoto/ui-adapters/angular/textfield';
 *
 * @Component({
 *   selector: 'app-password-form',
 *   standalone: true,
 *   imports: [TextFieldComponent],
 *   template: `
 *     <momoto-textfield
 *       [value]="password"
 *       (valueChange)="password = $event"
 *       [backgroundColor]="inputBgToken"
 *       [textColor]="inputTextToken"
 *       [error]="hasError"
 *       [errorBorderColor]="errorBorderToken"
 *       [helperText]="hasError ? 'Password must be at least 8 characters' : undefined"
 *       label="Password"
 *       type="password"
 *       [required]="true"
 *     />
 *   `,
 * })
 * export class PasswordFormComponent {
 *   password = '';
 *
 *   get hasError(): boolean {
 *     return this.password.length > 0 && this.password.length < 8;
 *   }
 *
 *   inputBgToken: EnrichedToken; // token from theme
 *   inputTextToken: EnrichedToken; // token from theme
 *   errorBorderToken: EnrichedToken; // token from theme
 * }
 * ```
 *
 * # Example 3: Multiline TextField
 * ```typescript
 * import { Component } from '@angular/core';
 * import { TextFieldComponent } from '@momoto/ui-adapters/angular/textfield';
 *
 * @Component({
 *   selector: 'app-message-form',
 *   standalone: true,
 *   imports: [TextFieldComponent],
 *   template: `
 *     <momoto-textfield
 *       [value]="message"
 *       (valueChange)="message = $event"
 *       [backgroundColor]="inputBgToken"
 *       [textColor]="inputTextToken"
 *       label="Message"
 *       placeholder="Enter your message"
 *       [multiline]="true"
 *       [rows]="5"
 *       [fullWidth]="true"
 *     />
 *   `,
 * })
 * export class MessageFormComponent {
 *   message = '';
 *   inputBgToken: EnrichedToken; // token from theme
 *   inputTextToken: EnrichedToken; // token from theme
 * }
 * ```
 */
