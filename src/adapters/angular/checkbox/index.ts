/**
 * @fileoverview Angular Checkbox Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for Angular Checkbox component.
 *
 * @module momoto-ui/adapters/angular/checkbox
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { CheckboxComponent } from './checkbox.component';

// ============================================================================
// TYPES
// ============================================================================

// Angular uses the component's @Input() properties directly
// No separate types file needed like React/Vue/Svelte

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic Checkbox with two-way binding
 * ```typescript
 * import { Component } from '@angular/core';
 * import { CheckboxComponent } from '@momoto/ui-adapters/angular/checkbox';
 *
 * @Component({
 *   selector: 'app-example',
 *   standalone: true,
 *   imports: [CheckboxComponent],
 *   template: `
 *     <momoto-checkbox
 *       label="Accept terms and conditions"
 *       [(checked)]="accepted"
 *       [backgroundColor]="checkboxBg"
 *       [borderColor]="checkboxBorder"
 *       [checkColor]="checkmark"
 *       (checkedChange)="onAcceptChange($event)"
 *     />
 *   `
 * })
 * export class ExampleComponent {
 *   accepted = false;
 *
 *   onAcceptChange(checked: boolean) {
 *     console.log('Accepted:', checked);
 *   }
 * }
 * ```
 *
 * # Example 2: Tri-state Checkbox (indeterminate)
 * ```typescript
 * import { Component } from '@angular/core';
 * import { CheckboxComponent } from '@momoto/ui-adapters/angular/checkbox';
 *
 * @Component({
 *   selector: 'app-select-all',
 *   standalone: true,
 *   imports: [CheckboxComponent],
 *   template: `
 *     <momoto-checkbox
 *       label="Select all"
 *       [checked]="allChecked"
 *       [indeterminate]="indeterminate"
 *       [backgroundColor]="checkboxBg"
 *       [borderColor]="checkboxBorder"
 *       [checkColor]="checkmark"
 *       (checkedChange)="handleSelectAll($event)"
 *     />
 *   `
 * })
 * export class SelectAllComponent {
 *   items = [
 *     { id: 1, checked: false },
 *     { id: 2, checked: false },
 *     { id: 3, checked: false },
 *   ];
 *
 *   get allChecked() {
 *     return this.items.every(item => item.checked);
 *   }
 *
 *   get someChecked() {
 *     return this.items.some(item => item.checked);
 *   }
 *
 *   get indeterminate() {
 *     return this.someChecked && !this.allChecked;
 *   }
 *
 *   handleSelectAll(checked: boolean) {
 *     this.items = this.items.map(item => ({ ...item, checked }));
 *   }
 * }
 * ```
 *
 * # Example 3: Disabled Checkbox
 * ```typescript
 * import { Component } from '@angular/core';
 * import { CheckboxComponent } from '@momoto/ui-adapters/angular/checkbox';
 *
 * @Component({
 *   selector: 'app-settings',
 *   standalone: true,
 *   imports: [CheckboxComponent],
 *   template: `
 *     <momoto-checkbox
 *       label="Enable notifications"
 *       [checked]="notificationsEnabled"
 *       [disabled]="!canChangeSettings"
 *       [backgroundColor]="checkboxBg"
 *       [borderColor]="checkboxBorder"
 *       [checkColor]="checkmark"
 *       [disabledBackgroundColor]="disabledBg"
 *       [disabledBorderColor]="disabledBorder"
 *       (checkedChange)="onNotificationsChange($event)"
 *     />
 *   `
 * })
 * export class SettingsComponent {
 *   notificationsEnabled = false;
 *   canChangeSettings = true;
 *
 *   onNotificationsChange(checked: boolean) {
 *     console.log('Notifications:', checked);
 *   }
 * }
 * ```
 */
