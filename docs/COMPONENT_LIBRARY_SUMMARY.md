# 📚 Momoto UI Component Library - Technical Summary

## Overview

Momoto UI is a **token-driven, framework-agnostic component library** built on the architectural principle:

> **"Momoto decide, momoto-ui ejecuta."**

All perceptual decisions (color, contrast, accessibility) come from the Momoto WASM engine. UI components are pure execution layers with zero visual logic.

---

## 🏗 Architecture

### Core Pattern

Every component follows the **ComponentCore pattern**:

```
ComponentCore (framework-agnostic)
    ↓
Thin Adapters (React, Vue, Svelte, Angular)
```

**Core Responsibilities:**
- State determination (`determineState()`)
- Token resolution (`resolveTokens()`)
- Style computation (`computeStyles()`)
- ARIA generation (`generateARIA()`)
- Quality checks (`checkQuality()`)

**Adapter Responsibilities:**
- Framework binding (useState, computed, $:, @Input)
- Event handling (onClick, @change, on:click)
- Render logic (JSX, template, {#if})

**Prohibited in Adapters:**
- ❌ Color calculations
- ❌ State logic
- ❌ Style computation
- ❌ ARIA definitions
- ❌ Perceptual heuristics

---

## 📦 Components

### 1. Button

**States:** 6 (base, hover, focus, active, disabled, loading)

**Core API:**
```typescript
ButtonCore.processButton({
  tokens: ButtonTokens,
  disabled: boolean,
  isHovered: boolean,
  isFocused: boolean,
  isActive: boolean,
  size: 'sm' | 'md' | 'lg',
  label: string,
  ...
}) → ButtonCoreOutput
```

**Adapters:**
- `@momoto/ui/adapters/react/button`
- `@momoto/ui/adapters/vue/button`
- `@momoto/ui/adapters/svelte/button`
- `@momoto/ui/adapters/angular/button`

---

### 2. TextField

**States:** 8 (base, hover, focus, filled, disabled, error, errorHover, errorFocus)

**Core API:**
```typescript
TextFieldCore.processTextField({
  tokens: TextFieldTokens,
  value: string,
  disabled: boolean,
  isHovered: boolean,
  isFocused: boolean,
  hasError: boolean,
  size: 'sm' | 'md' | 'lg',
  label?: string,
  helperText?: string,
  errorMessage?: string,
  ...
}) → TextFieldCoreOutput
```

**Adapters:**
- `@momoto/ui/adapters/react/textfield`
- `@momoto/ui/adapters/vue/textfield`
- `@momoto/ui/adapters/svelte/textfield`
- `@momoto/ui/adapters/angular/textfield`

---

### 3. Checkbox

**States:** 12 (base, hover, focus, checked, checkedHover, checkedFocus, indeterminate, indeterminateHover, indeterminateFocus, disabled, checkedDisabled, indeterminateDisabled)

**Core API:**
```typescript
CheckboxCore.processCheckbox({
  tokens: CheckboxTokens,
  isChecked: boolean,
  isIndeterminate: boolean,
  disabled: boolean,
  isHovered: boolean,
  isFocused: boolean,
  size: 'sm' | 'md' | 'lg',
  label?: string,
  ...
}) → CheckboxCoreOutput
```

**Adapters:**
- `@momoto/ui/adapters/react/checkbox`
- `@momoto/ui/adapters/vue/checkbox`
- `@momoto/ui/adapters/svelte/checkbox`
- `@momoto/ui/adapters/angular/checkbox`

---

### 4. Select

**States:** 10 (base, hover, focus, open, openHover, openFocus, disabled, error, errorHover, errorFocus)

**Core API:**
```typescript
SelectCore.processSelect({
  tokens: SelectTokens,
  options: SelectOption[],
  value: T | null,
  isOpen: boolean,
  disabled: boolean,
  isHovered: boolean,
  isFocused: boolean,
  hasError: boolean,
  size: 'sm' | 'md' | 'lg',
  label?: string,
  ...
}) → SelectCoreOutput
```

**Adapters:**
- `@momoto/ui/adapters/react/select`
- `@momoto/ui/adapters/vue/select`
- `@momoto/ui/adapters/svelte/select`
- `@momoto/ui/adapters/angular/select`

---

### 5. Switch

**States:** 11 (base, hover, focus, checked, checkedHover, checkedFocus, disabled, checkedDisabled, error, errorHover, errorFocus)

**Core API:**
```typescript
SwitchCore.processSwitch({
  tokens: SwitchTokens,
  isChecked: boolean,
  disabled: boolean,
  isHovered: boolean,
  isFocused: boolean,
  hasError: boolean,
  size: 'sm' | 'md' | 'lg',
  label?: string,
  ...
}) → SwitchCoreOutput
```

**Adapters:**
- `@momoto/ui/adapters/react/switch`
- `@momoto/ui/adapters/vue/switch`
- `@momoto/ui/adapters/svelte/switch`
- `@momoto/ui/adapters/angular/switch`

---

## 🎨 Token System

### EnrichedToken Structure

```typescript
interface EnrichedToken {
  id: string;
  name: string;
  value: {
    hex: string;
    rgb: { r: number; g: number; b: number };
    oklch: { l: number; c: number; h: number };
  };
  qualityScore: number;          // 0-1 (Momoto confidence)
  confidence: number;             // 0-1 (decision confidence)
  reason: string;                 // Human-readable rationale
  sourceDecisionId: string;       // Traceability
  accessibility: {
    wcagLevel: 'AA' | 'AAA';
    contrastRatio: number;
    apcaScore: number;
  };
}
```

### Token Requirements per Component

**Button:**
- `backgroundColor` (required)
- `textColor` (required)
- `borderColor` (optional)
- `hoverBackgroundColor`, `focusBackgroundColor`, etc. (optional)

**TextField:**
- `backgroundColor` (required)
- `borderColor` (required)
- `textColor` (required)
- `placeholderColor` (optional)
- State variants (hover, focus, error)

**Checkbox:**
- `backgroundColor` (required)
- `borderColor` (required)
- `checkColor` (required)
- State variants (hover, focus, checked, indeterminate, disabled)

**Select:**
- Field tokens (backgroundColor, borderColor, textColor)
- Dropdown tokens (dropdownBackgroundColor, optionTextColor)
- State variants (hover, focus, open, error)

**Switch:**
- `trackBackgroundColor` (required)
- `trackBorderColor` (required)
- `thumbColor` (required)
- `checkedTrackBackgroundColor` (required)
- State variants (hover, focus, checked, disabled, error)

---

## ♿ Accessibility

### WCAG 2.2 AA Compliance

All components generate ARIA attributes via `Core.generateARIA()`:

**Button:**
```typescript
{
  role: 'button',
  'aria-label': string,
  'aria-disabled': boolean,
  'aria-busy': boolean, // for loading state
}
```

**TextField:**
```typescript
{
  'aria-label': string,
  'aria-describedby': string,
  'aria-required': boolean,
  'aria-invalid': boolean,
}
```

**Checkbox:**
```typescript
{
  role: 'checkbox',
  'aria-checked': boolean | 'mixed', // for indeterminate
  'aria-disabled': boolean,
  'aria-required': boolean,
  'aria-invalid': boolean,
}
```

**Select:**
```typescript
{
  role: 'combobox',
  'aria-expanded': boolean,
  'aria-controls': string,
  'aria-activedescendant': string,
  'aria-disabled': boolean,
  'aria-required': boolean,
  'aria-invalid': boolean,
}
```

**Switch:**
```typescript
{
  role: 'switch',
  'aria-checked': boolean,
  'aria-disabled': boolean,
  'aria-required': boolean,
  'aria-invalid': boolean,
}
```

### Keyboard Navigation

All components support standard keyboard interactions:
- **Tab** - Focus navigation
- **Enter/Space** - Activation
- **Escape** - Close dropdown (Select)
- **Arrow keys** - Navigate options (Select)

---

## 📊 Metrics

### Implementation Stats

**Total Files:** ~95 files
- Core files: 35 (5 components × 7 files each)
- Adapter files: 60+ (5 components × 4 frameworks × ~3 files)

**Total LOC:** ~15,000 lines
- Core: ~10,000 LOC
- Adapters: ~5,000 LOC

**Code Reuse:** ~66%
- Core logic shared across all 4 frameworks
- Each adapter: ~125-200 LOC (thin wrappers)

**State Coverage:**
- Button: 6 states
- TextField: 8 states
- Checkbox: 12 states
- Select: 10 states
- Switch: 11 states
- **Total: 47 unique states**

---

## 🔧 Usage Examples

### React

```tsx
import { Button } from '@momoto/ui/adapters/react/button';

function App() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      label="Click me"
      backgroundColor={primaryBgToken}
      textColor={primaryTextToken}
      hoverBackgroundColor={primaryHoverToken}
      onClick={() => console.log('clicked')}
      size="md"
    />
  );
}
```

### Vue

```vue
<script setup>
import { Button } from '@momoto/ui/adapters/vue/button';

const handleClick = () => console.log('clicked');
</script>

<template>
  <Button
    label="Click me"
    :background-color="primaryBgToken"
    :text-color="primaryTextToken"
    :hover-background-color="primaryHoverToken"
    @click="handleClick"
    size="md"
  />
</template>
```

### Svelte

```svelte
<script>
import { Button } from '@momoto/ui/adapters/svelte/button';

function handleClick() {
  console.log('clicked');
}
</script>

<Button
  label="Click me"
  backgroundColor={primaryBgToken}
  textColor={primaryTextToken}
  hoverBackgroundColor={primaryHoverToken}
  on:click={handleClick}
  size="md"
/>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from '@momoto/ui/adapters/angular/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <momoto-button
      label="Click me"
      [backgroundColor]="primaryBgToken"
      [textColor]="primaryTextToken"
      [hoverBackgroundColor]="primaryHoverToken"
      (click)="handleClick()"
      size="md"
    />
  `
})
export class AppComponent {
  handleClick() {
    console.log('clicked');
  }
}
```

---

## ✅ Contract Compliance Checklist

Use this checklist when creating or reviewing components:

### Core Implementation

- [ ] All logic in `*Core.ts`
- [ ] `determineState()` with priority-based selection
- [ ] `resolveTokens()` with switch statement (no conditionals)
- [ ] `computeStyles()` using only resolved tokens
- [ ] `generateARIA()` for WCAG 2.2 AA
- [ ] `processComponent()` as all-in-one method
- [ ] Quality checks with `checkQuality()`
- [ ] Comprehensive types in `*Core.types.ts`
- [ ] Constants in `constants.ts` (no magic numbers)
- [ ] Exports in `index.ts`

### Adapter Implementation

- [ ] Import Core class
- [ ] Call `Core.process*()` in useMemo/computed/$:/OnChanges
- [ ] Zero perceptual logic
- [ ] Zero color calculations
- [ ] Zero manual ARIA definitions
- [ ] Zero hardcoded colors
- [ ] Only framework-specific concerns (binding, events, render)
- [ ] Thin wrapper (<200 LOC)
- [ ] Consistent with other adapters

### Validation

- [ ] Pass `npm run verify:contract`
- [ ] No violations in any rule
- [ ] Types export properly
- [ ] Documentation complete

---

## 🚀 Contract Enforcement

The contract is **automatically enforced** via:

```bash
npm run verify:contract
```

This command uses AST analysis to detect:
- ❌ Perceptual logic (`isDark`, `lighten`, etc.)
- ❌ Hardcoded colors (hex, rgb, css variables)
- ❌ Missing Core delegation
- ❌ Manual ARIA definitions

**Any violation fails the build.**

---

## 🎯 Design Principles

1. **Token-First**: All visual properties from EnrichedToken
2. **Core Decides**: All logic in framework-agnostic Core
3. **Adapters Execute**: Thin wrappers with zero logic
4. **State Selection**: Switch statements, not conditionals
5. **WCAG by Default**: Accessibility built-in, not added
6. **Framework Parity**: Identical behavior across frameworks
7. **Traceability**: Every color decision has a source ID
8. **Contract Enforced**: Automated validation, not guidelines

---

## 📈 Future Components

Planned for future phases:
- Radio
- Toggle
- Slider
- DatePicker
- Modal
- Tooltip
- Dropdown Menu
- Table
- Tabs
- Accordion

All will follow the exact same ComponentCore pattern.

---

## 🔗 References

- **Contract Validation:** `scripts/verify-contract/README.md`
- **Architecture:** Follow Button/TextField/Checkbox/Select/Switch patterns
- **Token System:** All tokens from Momoto WASM decisions
- **WCAG 2.2 AA:** All components compliant by design

---

**Momoto UI: Where perceptual intelligence meets architectural purity.**
