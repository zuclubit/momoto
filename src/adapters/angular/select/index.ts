/**
 * @fileoverview Angular Select Adapter - Exports
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Central export point for Angular Select component.
 *
 * @module momoto-ui/adapters/angular/select
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { SelectComponent } from './select.component';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic Select
 * ```typescript
 * import { Component } from '@angular/core';
 * import { SelectComponent } from '@momoto/ui-adapters/angular/select';
 *
 * @Component({
 *   selector: 'app-form',
 *   standalone: true,
 *   imports: [SelectComponent],
 *   template: `
 *     <momoto-select
 *       [options]="countryOptions"
 *       [value]="selectedCountry"
 *       (valueChange)="onCountryChange($event)"
 *       placeholder="Select a country"
 *       label="Country"
 *       [backgroundColor]="fieldBg"
 *       [borderColor]="fieldBorder"
 *       [textColor]="fieldText"
 *       [dropdownBackgroundColor]="dropdownBg"
 *       [optionTextColor]="optionText"
 *     />
 *   `
 * })
 * export class FormComponent {
 *   selectedCountry: string | null = null;
 *
 *   countryOptions = [
 *     { label: 'United States', value: 'us' },
 *     { label: 'Canada', value: 'ca' },
 *     { label: 'Mexico', value: 'mx' },
 *   ];
 *
 *   onCountryChange(value: string | null) {
 *     this.selectedCountry = value;
 *     console.log('Selected:', value);
 *   }
 * }
 * ```
 *
 * # Example 2: Select with Error State
 * ```typescript
 * import { Component } from '@angular/core';
 * import { SelectComponent } from '@momoto/ui-adapters/angular/select';
 *
 * @Component({
 *   selector: 'app-validated-form',
 *   standalone: true,
 *   imports: [SelectComponent],
 *   template: `
 *     <momoto-select
 *       [options]="roleOptions"
 *       [value]="selectedRole"
 *       (valueChange)="onRoleChange($event)"
 *       placeholder="Select a role"
 *       label="Role"
 *       [required]="true"
 *       [error]="hasError"
 *       errorMessage="Please select a role"
 *       [backgroundColor]="fieldBg"
 *       [borderColor]="fieldBorder"
 *       [textColor]="fieldText"
 *       [errorBorderColor]="errorBorder"
 *       [errorMessageColor]="errorText"
 *       [dropdownBackgroundColor]="dropdownBg"
 *       [optionTextColor]="optionText"
 *     />
 *   `
 * })
 * export class ValidatedFormComponent {
 *   selectedRole: string | null = null;
 *   touched = false;
 *
 *   roleOptions = [
 *     { label: 'Admin', value: 'admin' },
 *     { label: 'User', value: 'user' },
 *     { label: 'Guest', value: 'guest' },
 *   ];
 *
 *   get hasError(): boolean {
 *     return this.touched && !this.selectedRole;
 *   }
 *
 *   onRoleChange(value: string | null) {
 *     this.selectedRole = value;
 *     this.touched = true;
 *   }
 * }
 * ```
 *
 * # Example 3: Select with Disabled Options
 * ```typescript
 * import { Component } from '@angular/core';
 * import { SelectComponent } from '@momoto/ui-adapters/angular/select';
 *
 * @Component({
 *   selector: 'app-priority-select',
 *   standalone: true,
 *   imports: [SelectComponent],
 *   template: `
 *     <momoto-select
 *       [options]="priorityOptions"
 *       [value]="selectedPriority"
 *       (valueChange)="onPriorityChange($event)"
 *       placeholder="Select priority"
 *       label="Priority"
 *       helperText="Critical priority requires manager approval"
 *       [backgroundColor]="fieldBg"
 *       [borderColor]="fieldBorder"
 *       [textColor]="fieldText"
 *       [dropdownBackgroundColor]="dropdownBg"
 *       [optionTextColor]="optionText"
 *       [optionDisabledTextColor]="disabledText"
 *     />
 *   `
 * })
 * export class PrioritySelectComponent {
 *   selectedPriority: string | null = null;
 *
 *   priorityOptions = [
 *     { label: 'Low', value: 'low' },
 *     { label: 'Medium', value: 'medium' },
 *     { label: 'High', value: 'high' },
 *     { label: 'Critical (requires approval)', value: 'critical', disabled: true },
 *   ];
 *
 *   onPriorityChange(value: string | null) {
 *     this.selectedPriority = value;
 *   }
 * }
 * ```
 */
