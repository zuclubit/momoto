# FASE 14: Core Consolidation, Governance & Component Expansion — Implementation Plan

**Status:** 🚧 IN PROGRESS
**Date:** 2026-01-08
**Engineer:** Principal Design System & Platform Engineer
**Objective:** Consolidate core, eliminate divergences, expand component kit with governance

---

## Executive Summary

FASE 14 consolidates the multi-framework architecture by:
1. **Refactoring React Button** to use ButtonCore (eliminate known debt)
2. **Expanding component kit** with TextField and Checkbox (2+ new components)
3. **Introducing governance automation** for contract enforcement
4. **Documenting the ComponentCore pattern** for future scalability

**Contract:** "Momoto decide, momoto-ui ejecuta" — **PRESERVED & ENFORCED**

---

## Mission Critical Requirements

### Contract Enforcement (Non-Negotiable)

**PROHIBITED:**
- ❌ Perceptual logic in UI or core
- ❌ Local decisions
- ❌ Heuristics
- ❌ Token reinterpretation
- ❌ Contrast/color/accessibility calculations

**MANDATORY:**
- ✅ Delegate decisions to Momoto
- ✅ Reuse ButtonCore as canonical pattern
- ✅ Centralize shared behavior
- ✅ Automate contract verification

---

## Phase 1: React Button Refactor (BLOCKER)

### Current State (FASE 11)

**File:** `components/primitives/Button/Button.tsx`
**LOC:** ~420
**Status:** ⚠️ Works correctly but doesn't use ButtonCore
**Problem:** Logic embedded in component (not shared with other frameworks)

**Current Implementation:**
```typescript
// React Button.tsx (FASE 11)
export function Button(props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // ❌ State determination logic embedded
  const currentState = useMemo(() => {
    if (disabled || loading) return 'disabled';
    if (isActive) return 'active';
    if (isFocused) return 'focus';
    if (isHovered) return 'hover';
    return 'base';
  }, [disabled, loading, isActive, isFocused, isHovered]);

  // ❌ Token resolution logic embedded
  const resolvedTokens = useMemo(() => {
    switch (currentState) {
      case 'disabled': return { ... };
      // ...
    }
  }, [currentState, ...tokens]);

  // ❌ Style computation logic embedded
  const buttonStyle = {
    backgroundColor: resolvedTokens.backgroundColor.value.hex,
    color: resolvedTokens.textColor.value.hex,
    // ...
  };

  // ❌ ARIA generation embedded
  const ariaProps = createButtonAria({ ... });

  return <button style={buttonStyle} {...ariaProps}>...</button>;
}
```

### Target State (FASE 14)

**File:** `adapters/react/button/Button.tsx`
**LOC:** ~180 (57% reduction)
**Status:** ✅ Uses ButtonCore like Vue/Svelte/Angular

**Target Implementation:**
```typescript
// React Button.tsx (FASE 14)
export function Button(props: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // ✅ Delegate EVERYTHING to ButtonCore
  const buttonOutput = useMemo(() => {
    return ButtonCore.processButton({
      tokens: {
        backgroundColor: props.backgroundColor,
        textColor: props.textColor,
        // ... all tokens
      },
      disabled: props.disabled,
      loading: props.loading,
      isHovered,
      isFocused,
      isActive,
      size: props.size,
      fullWidth: props.fullWidth,
      hasIcon: !!props.icon,
      label: props.label,
      // ...
    });
  }, [props, isHovered, isFocused, isActive]);

  // ✅ All logic from ButtonCore
  return (
    <button
      className={buttonOutput.classNames}
      style={buttonOutput.styles}
      {...buttonOutput.ariaAttrs}
      onClick={handleClick}
      // ...
    >
      {/* ... */}
    </button>
  );
}
```

### Refactor Checklist

- [ ] Move React Button to `adapters/react/button/`
- [ ] Import ButtonCore
- [ ] Replace embedded logic with ButtonCore.processButton()
- [ ] Reduce LOC from ~420 to ~180
- [ ] Ensure identical behavior (no regressions)
- [ ] Update exports
- [ ] Verify ButtonWithVariant still works

### Success Metrics

| Metric | Before | After | Target | Status |
|--------|--------|-------|--------|--------|
| **LOC** | 420 | 180 | ~180 | - |
| **Uses ButtonCore** | No | Yes | Yes | - |
| **Logic duplication** | Yes | No | No | - |
| **Identical behavior** | N/A | Yes | Yes | - |

---

## Phase 2: TextField Component (NEW)

### ComponentCore Pattern

**Directory Structure:**
```
adapters/
  core/
    textfield/
      textFieldCore.ts           (main core class)
      textFieldCore.types.ts     (shared types)
      tokenResolver.ts           (state & token resolution)
      styleComputer.ts           (style computation)
      ariaGenerator.ts           (ARIA attributes)
      constants.ts               (size config)
      index.ts                   (exports)
  react/
    textfield/
      TextField.tsx              (~180 LOC)
      TextFieldWithVariant.tsx   (~80 LOC)
      types.ts
      index.ts
  vue/
    textfield/
      TextField.vue              (~180 LOC)
      TextFieldWithVariant.vue   (~80 LOC)
      types.ts
      index.ts
  svelte/
    textfield/
      TextField.svelte           (~170 LOC)
      TextFieldWithVariant.svelte (~75 LOC)
      types.ts
      index.ts
  angular/
    textfield/
      textfield.component.ts     (~250 LOC)
      textfield.component.html   (~70 LOC)
      textfield-with-variant.component.ts (~130 LOC)
      types.ts
      textfield.module.ts
      index.ts
```

### TextField States

```typescript
type TextFieldState =
  | 'base'      // default
  | 'hover'     // mouse over
  | 'focus'     // keyboard focus (CRITICAL for input)
  | 'active'    // typing
  | 'disabled'  // blocked
  | 'error'     // validation error
  | 'success';  // validation success
```

### TextField Tokens

```typescript
interface TextFieldTokens {
  // Background
  backgroundColor: EnrichedToken;
  hoverBackgroundColor?: EnrichedToken;
  focusBackgroundColor?: EnrichedToken;
  errorBackgroundColor?: EnrichedToken;
  successBackgroundColor?: EnrichedToken;
  disabledBackgroundColor?: EnrichedToken;

  // Text
  textColor: EnrichedToken;
  placeholderColor?: EnrichedToken;
  errorTextColor?: EnrichedToken;
  successTextColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;

  // Border
  borderColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken;
  errorBorderColor?: EnrichedToken;
  successBorderColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken;

  // Label
  labelColor?: EnrichedToken;
  errorLabelColor?: EnrichedToken;
  successLabelColor?: EnrichedToken;
}
```

### TextFieldCore Methods

```typescript
export class TextFieldCore {
  // State determination
  static determineState(input: DetermineStateInput): TextFieldState;

  // Token resolution
  static resolveTokens(input: ResolveTokensInput): ResolvedTextFieldTokens;

  // Style computation
  static computeStyles(input: ComputeStylesInput): TextFieldStyles;

  // ARIA generation (CRITICAL for inputs)
  static generateARIA(input: GenerateARIAInput): ARIAAttributes;

  // Validation state
  static getValidationState(value: string, rules?: ValidationRules): ValidationState;

  // All-in-one processing
  static processTextField(params): CompleteTextFieldOutput;
}
```

### CONTRACT COMPLIANCE

**TextField-Specific Rules:**
- ✅ NO local validation logic (validation comes from props or external validator)
- ✅ NO placeholder color calculations (from tokens)
- ✅ NO error color decisions (from tokens)
- ✅ Label/helper text colors from tokens
- ✅ Focus state from token selection (NOT calculation)

---

## Phase 3: Checkbox Component (NEW)

### ComponentCore Pattern

**Directory Structure:**
```
adapters/
  core/
    checkbox/
      checkboxCore.ts
      checkboxCore.types.ts
      tokenResolver.ts
      styleComputer.ts
      ariaGenerator.ts
      constants.ts
      index.ts
  react/ vue/ svelte/ angular/
    checkbox/
      [same pattern as TextField]
```

### Checkbox States

```typescript
type CheckboxState =
  | 'unchecked'         // not checked
  | 'checked'           // checked
  | 'indeterminate'     // partial (for tree structures)
  | 'unchecked-hover'   // hover over unchecked
  | 'checked-hover'     // hover over checked
  | 'unchecked-focus'   // focus on unchecked
  | 'checked-focus'     // focus on checked
  | 'disabled';         // blocked
```

### Checkbox Tokens

```typescript
interface CheckboxTokens {
  // Box (unchecked)
  boxBackgroundColor: EnrichedToken;
  boxBorderColor: EnrichedToken;
  hoverBoxBackgroundColor?: EnrichedToken;
  hoverBoxBorderColor?: EnrichedToken;
  focusBoxBorderColor?: EnrichedToken;
  disabledBoxBackgroundColor?: EnrichedToken;
  disabledBoxBorderColor?: EnrichedToken;

  // Check mark (checked)
  checkmarkColor: EnrichedToken;
  checkedBoxBackgroundColor?: EnrichedToken;
  checkedBoxBorderColor?: EnrichedToken;
  hoverCheckedBoxBackgroundColor?: EnrichedToken;
  disabledCheckmarkColor?: EnrichedToken;

  // Label
  labelColor: EnrichedToken;
  disabledLabelColor?: EnrichedToken;
}
```

### CheckboxCore Methods

```typescript
export class CheckboxCore {
  // State determination
  static determineState(input: DetermineStateInput): CheckboxState;

  // Token resolution
  static resolveTokens(input: ResolveTokensInput): ResolvedCheckboxTokens;

  // Style computation (box + checkmark)
  static computeStyles(input: ComputeStylesInput): CheckboxStyles;

  // ARIA generation (CRITICAL for accessibility)
  static generateARIA(input: GenerateARIAInput): ARIAAttributes;

  // All-in-one processing
  static processCheckbox(params): CompleteCheckboxOutput;
}
```

### CONTRACT COMPLIANCE

**Checkbox-Specific Rules:**
- ✅ NO checkmark color calculations (from tokens)
- ✅ Checked/unchecked states via token selection (NOT generation)
- ✅ Indeterminate state from tokens
- ✅ NO visual indicator logic (checkmark comes from token or SVG)

---

## Phase 4: Contract Governance & Automation

### 4.1 Contract Verification Script

**File:** `scripts/verify-contract.ts`

**Purpose:** Automated scan for contract violations

**Checks:**
1. **No perceptual logic**
   - Scan for: `isDark`, `isLight`, `isWarm`, `isCool`
   - Scan for: `lighten`, `darken`, `saturate`, `desaturate` (outside Momoto WASM)
   - Scan for: `interpolate`, `mix`, `blend`

2. **No local decisions**
   - Scan for: `getContrastRatio`, `calculateContrast`
   - Scan for: hardcoded color values in components
   - Scan for: magic numbers for perceptual thresholds

3. **Token usage**
   - Verify all colors come from EnrichedToken
   - Verify all tokens have Momoto metadata

4. **Core delegation**
   - Verify adapters use ComponentCore
   - Verify no logic duplication

**Usage:**
```bash
npm run verify:contract
# or
npm run verify:contract -- --component=button
```

**Output:**
```
Contract Verification Report
============================
Component: button
Status: ✅ PASS

Checks:
✅ No perceptual logic (0 violations)
✅ No local decisions (0 violations)
✅ Token usage verified (100%)
✅ Core delegation verified (100%)

Component: textfield
Status: ✅ PASS

Checks:
✅ No perceptual logic (0 violations)
✅ No local decisions (0 violations)
✅ Token usage verified (100%)
✅ Core delegation verified (100%)

OVERALL: ✅ PASS (0 violations)
```

### 4.2 Pre-Commit Hook

**File:** `.husky/pre-commit`

**Purpose:** Block commits with contract violations

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run contract verification
npm run verify:contract

# Block commit if violations found
if [ $? -ne 0 ]; then
  echo "❌ Contract violations detected. Commit blocked."
  exit 1
fi

echo "✅ Contract verified. Proceeding with commit."
```

### 4.3 Component Compliance Checklist

**File:** `docs/COMPONENT_COMPLIANCE_CHECKLIST.md`

**Checklist for new components:**

```markdown
## Component Compliance Checklist

Use this checklist when creating new components.

### 1. Core Implementation
- [ ] ComponentCore class created
- [ ] All logic in ComponentCore (framework-agnostic)
- [ ] Pure functions with NO side effects
- [ ] NO framework dependencies in core
- [ ] Types defined in core (shared across frameworks)

### 2. Token Usage
- [ ] All colors from EnrichedToken
- [ ] NO color calculations
- [ ] NO hardcoded color values
- [ ] State colors via token selection (NOT computation)
- [ ] All tokens have Momoto metadata

### 3. State Management
- [ ] State determination in ComponentCore
- [ ] Token resolution in ComponentCore
- [ ] NO perceptual state logic

### 4. Accessibility
- [ ] ARIA generation in ComponentCore
- [ ] WCAG 2.2 AA compliance via token metadata
- [ ] NO local contrast calculations
- [ ] Semantic HTML

### 5. Framework Adapters
- [ ] React adapter (~180 LOC, uses ComponentCore)
- [ ] Vue adapter (~180 LOC, uses ComponentCore)
- [ ] Svelte adapter (~170 LOC, uses ComponentCore)
- [ ] Angular adapter (~250 LOC, uses ComponentCore)
- [ ] Adapters are thin (state + events + rendering only)
- [ ] NO logic duplication

### 6. Testing
- [ ] Core unit tests
- [ ] Framework adapter tests
- [ ] Cross-framework behavior tests
- [ ] Accessibility tests

### 7. Documentation
- [ ] ComponentCore API documented
- [ ] Usage examples per framework
- [ ] Token requirements documented

### 8. Contract Verification
- [ ] `npm run verify:contract` passes
- [ ] No violations in scan
- [ ] Peer review approved
```

---

## Phase 5: Documentation & Patterns

### 5.1 ComponentCore Pattern Guide

**File:** `docs/COMPONENTCORE_PATTERN.md`

**Content:**
- When to use ComponentCore pattern
- How to extract logic from existing components
- Step-by-step guide to create new component
- Common pitfalls and solutions
- Examples from Button/TextField/Checkbox

### 5.2 Architecture Decision Records (ADRs)

**Files:**
- `docs/adr/001-componentcore-pattern.md`
- `docs/adr/002-framework-agnostic-core.md`
- `docs/adr/003-token-driven-design.md`

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **React Button uses ButtonCore** | 100% | LOC + code review |
| **New components with Core** | ≥ 2 | TextField + Checkbox |
| **Logic duplication** | 0% | Code scan |
| **Contract violations** | 0 | Automated scan |
| **Automated contract checks** | Yes | Script exists + runs |
| **Pattern documentation** | Complete | Docs written |
| **Adapter LOC reduction** | ~60% | Measure React refactor |

---

## Implementation Order

### Week 1: Core Consolidation
1. ✅ Create FASE_14_PLAN.md (this document)
2. 🚧 Refactor React Button to use ButtonCore
3. ✅ Verify identical behavior across 4 frameworks
4. ✅ Measure LOC reduction

### Week 2: TextField Component
1. Create TextFieldCore
2. Create React adapter
3. Create Vue adapter
4. Create Svelte adapter
5. Create Angular adapter
6. Verify contract compliance

### Week 3: Checkbox Component
1. Create CheckboxCore
2. Create React adapter
3. Create Vue adapter
4. Create Svelte adapter
5. Create Angular adapter
6. Verify contract compliance

### Week 4: Governance & Documentation
1. Create contract verification script
2. Create pre-commit hook
3. Create compliance checklist
4. Write ComponentCore pattern guide
5. Write ADRs
6. Create FASE_14_CONTRACT_CHECK.md
7. Create FASE_14_SUMMARY.md

---

## Risk Mitigation

### Risk 1: React Button Refactor Breaks Behavior

**Mitigation:**
- Keep original Button.tsx as Button.BACKUP.tsx
- Create comprehensive test suite
- Visual regression testing
- Gradual rollout

### Risk 2: TextField/Checkbox Require Perceptual Logic

**Mitigation:**
- Design token structure FIRST
- Identify perceptual needs BEFORE implementation
- If perceptual logic needed → STOP, document as BLOCKER
- DO NOT improvise heuristics

### Risk 3: Contract Violations Slip Through

**Mitigation:**
- Automated scanning
- Pre-commit hooks
- Peer review with checklist
- Continuous monitoring

---

## Definition of Done

FASE 14 is complete when:

1. ✅ React Button uses ButtonCore (identical behavior to Vue/Svelte/Angular)
2. ✅ TextField component exists (Core + 4 adapters)
3. ✅ Checkbox component exists (Core + 4 adapters)
4. ✅ Contract verification tooling exists and runs
5. ✅ Documentation is complete (pattern guide, checklist, ADRs)
6. ✅ All contract checks pass
7. ✅ Zero logic duplication across frameworks
8. ✅ Zero perceptual logic in UI or core

---

## Next Phase Preview: FASE 15

**Focus:** Remaining components + advanced patterns

**Components:**
- Select (dropdown)
- Switch (toggle)
- Badge (label)
- Alert (notification)
- Card (container)
- Tooltip (overlay)

**Advanced Patterns:**
- Composite components
- Form validation integration
- Animation handling
- Portal/overlay management

---

**Status:** 🚧 IN PROGRESS
**Contract:** "Momoto decide, momoto-ui ejecuta" — **PRESERVED**
**Engineer:** Principal Design System & Platform Engineer
**Date:** 2026-01-08
