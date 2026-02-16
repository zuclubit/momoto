# Component Compliance Checklist

**FASE 14: Core Consolidation & Governance**

Use this checklist when creating new components to ensure contract compliance.

---

## Contract: "Momoto decide, momoto-ui ejecuta"

**PROHIBITED:**
- ❌ Perceptual logic in UI or core
- ❌ Local decisions
- ❌ Heuristics
- ❌ Token reinterpretation
- ❌ Contrast/color/accessibility calculations

**MANDATORY:**
- ✅ Delegate decisions to Momoto
- ✅ Reuse ComponentCore pattern
- ✅ Centralize shared behavior
- ✅ Automate contract verification

---

## 1. Core Implementation

### ComponentCore Class

- [ ] ComponentCore class created in `adapters/core/{component}/`
- [ ] All logic in ComponentCore (framework-agnostic)
- [ ] Pure functions with NO side effects
- [ ] NO framework dependencies in core
- [ ] NO perceptual logic

### Core Methods (REQUIRED)

- [ ] `determineState()` - State determination logic
- [ ] `resolveTokens()` - Token selection for current state
- [ ] `computeStyles()` - Style computation from tokens
- [ ] `generateARIA()` - ARIA attributes for accessibility
- [ ] `process{Component}()` - All-in-one processing method

### Core Types

- [ ] Types defined in `{component}Core.types.ts`
- [ ] Shared across all frameworks
- [ ] Framework-agnostic (no React/Vue/Svelte/Angular types)

---

## 2. Token Usage

### Token Requirements

- [ ] All colors from `EnrichedToken`
- [ ] NO color calculations (no lighten/darken/interpolate)
- [ ] NO hardcoded color values (#xxx, rgb())
- [ ] State colors via token selection (NOT computation)

### Token Metadata

- [ ] All tokens have Momoto metadata:
  - [ ] `qualityScore`
  - [ ] `confidence`
  - [ ] `reason`
  - [ ] `sourceDecisionId`
  - [ ] `accessibility` (if text color)

### Token Resolution

- [ ] Token resolution in ComponentCore
- [ ] Fallback to base tokens (NOT generation)
- [ ] NO color transformations in resolution

---

## 3. State Management

### State Determination

- [ ] State determination in ComponentCore
- [ ] State priority clearly defined
- [ ] NO perceptual state logic
- [ ] Framework adapters only manage interaction flags

### Token Selection

- [ ] Tokens selected based on state (NOT calculated)
- [ ] Switch statement in `resolveTokens()`
- [ ] Clear mapping: state → tokens

---

## 4. Accessibility

### ARIA Attributes

- [ ] ARIA generation in ComponentCore
- [ ] WCAG 2.2 AA compliance via token metadata
- [ ] NO local contrast calculations
- [ ] Semantic HTML elements

### Required ARIA

- [ ] `aria-label` or visible text
- [ ] `aria-disabled` for disabled state
- [ ] `aria-describedby` for descriptions (if applicable)
- [ ] Component-specific ARIA (e.g., `aria-checked` for checkbox)

### Token Accessibility

- [ ] Contrast ratios from `token.accessibility.wcagRatio`
- [ ] WCAG compliance from `token.accessibility.passesAA`
- [ ] NO local contrast calculations

---

## 5. Framework Adapters

### React Adapter

- [ ] Created in `adapters/react/{component}/`
- [ ] ~180 LOC (thin wrapper)
- [ ] Uses ComponentCore.process{Component}()
- [ ] useState for interaction state
- [ ] useMemo for ComponentCore call
- [ ] NO embedded logic

### Vue Adapter

- [ ] Created in `adapters/vue/{component}/`
- [ ] ~180 LOC (thin wrapper)
- [ ] Uses ComponentCore.process{Component}()
- [ ] ref() for interaction state
- [ ] computed() for ComponentCore call
- [ ] NO embedded logic

### Svelte Adapter

- [ ] Created in `adapters/svelte/{component}/`
- [ ] ~170 LOC (thin wrapper)
- [ ] Uses ComponentCore.process{Component}()
- [ ] let for interaction state
- [ ] $: reactive for ComponentCore call
- [ ] NO embedded logic

### Angular Adapter

- [ ] Created in `adapters/angular/{component}/`
- [ ] ~250 LOC (thin wrapper)
- [ ] Uses ComponentCore.process{Component}()
- [ ] Component properties for interaction state
- [ ] ngOnChanges for ComponentCore call
- [ ] NO embedded logic

### Common Adapter Requirements

- [ ] Adapters are thin (state + events + rendering only)
- [ ] NO logic duplication across frameworks
- [ ] Identical behavior (same ComponentCore output)
- [ ] Framework-specific concerns ONLY

---

## 6. Testing

### Core Tests

- [ ] ComponentCore unit tests
- [ ] State determination tests
- [ ] Token resolution tests
- [ ] Style computation tests
- [ ] ARIA generation tests

### Adapter Tests

- [ ] React adapter tests
- [ ] Vue adapter tests
- [ ] Svelte adapter tests
- [ ] Angular adapter tests

### Cross-Framework Tests

- [ ] Same input produces same output across frameworks
- [ ] Behavior identical in all frameworks
- [ ] No framework-specific bugs

### Accessibility Tests

- [ ] ARIA attributes correct
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] WCAG 2.2 AA compliance

---

## 7. Documentation

### ComponentCore API

- [ ] All methods documented with JSDoc
- [ ] Parameters explained
- [ ] Return types specified
- [ ] Examples provided

### Usage Examples

- [ ] React usage example
- [ ] Vue usage example
- [ ] Svelte usage example
- [ ] Angular usage example

### Token Requirements

- [ ] Required tokens documented
- [ ] Optional tokens documented
- [ ] State variants documented
- [ ] Token structure example provided

---

## 8. Contract Verification

### Automated Checks

- [ ] `npm run verify:contract` passes
- [ ] No perceptual logic detected
- [ ] No color calculations detected
- [ ] No hardcoded colors detected
- [ ] No magic numbers detected

### Manual Review

- [ ] Peer review completed
- [ ] Contract compliance verified
- [ ] No heuristics or local decisions
- [ ] Full delegation to Momoto

### Governance

- [ ] Pre-commit hook configured
- [ ] CI/CD includes contract checks
- [ ] Violations block merges

---

## 9. File Structure

### Required Files

```
adapters/
  core/
    {component}/
      ✅ {component}Core.ts           (main core class)
      ✅ {component}Core.types.ts     (shared types)
      ✅ tokenResolver.ts             (state & token resolution)
      ✅ styleComputer.ts             (style computation)
      ✅ ariaGenerator.ts             (ARIA attributes)
      ✅ constants.ts                 (size config, non-perceptual)
      ✅ index.ts                     (exports)

  react/
    {component}/
      ✅ {Component}.tsx              (~180 LOC)
      ✅ {Component}WithVariant.tsx   (~80 LOC)
      ✅ types.ts
      ✅ index.ts

  vue/
    {component}/
      ✅ {Component}.vue              (~180 LOC)
      ✅ {Component}WithVariant.vue   (~80 LOC)
      ✅ types.ts
      ✅ index.ts

  svelte/
    {component}/
      ✅ {Component}.svelte           (~170 LOC)
      ✅ {Component}WithVariant.svelte (~75 LOC)
      ✅ types.ts
      ✅ index.ts

  angular/
    {component}/
      ✅ {component}.component.ts     (~250 LOC)
      ✅ {component}.component.html   (~70 LOC)
      ✅ {component}.component.css    (~15 LOC)
      ✅ {component}-with-variant.component.ts (~130 LOC)
      ✅ types.ts
      ✅ {component}.module.ts
      ✅ index.ts
```

---

## 10. Success Metrics

### Code Quality

- [ ] ComponentCore: ~350 LOC
- [ ] React adapter: ~180 LOC (57% reduction from 420 LOC)
- [ ] Vue adapter: ~180 LOC
- [ ] Svelte adapter: ~170 LOC
- [ ] Angular adapter: ~250 LOC

### Contract Compliance

- [ ] Logic duplication: 0%
- [ ] Perceptual logic: 0 violations
- [ ] Token usage: 100%
- [ ] Core delegation: 100%

### Behavior Consistency

- [ ] Identical output across frameworks
- [ ] Same ComponentCore used by all adapters
- [ ] No framework-specific logic

---

## Example: Button Component ✅

### Core

- ✅ ButtonCore created (~350 LOC)
- ✅ determineState(), resolveTokens(), computeStyles(), generateARIA()
- ✅ processButton() all-in-one method
- ✅ NO perceptual logic, NO color calculations

### Adapters

- ✅ React: 180 LOC, uses ButtonCore
- ✅ Vue: 180 LOC, uses ButtonCore
- ✅ Svelte: 170 LOC, uses ButtonCore
- ✅ Angular: 250 LOC, uses ButtonCore

### Verification

- ✅ `npm run verify:contract` passes
- ✅ 0 violations detected
- ✅ Identical behavior across frameworks

---

## Red Flags (STOP IF YOU SEE THESE)

### 🚨 PERCEPTUAL LOGIC

```typescript
// ❌ FORBIDDEN
if (color.lightness > 0.5) {
  return 'light';
}

// ✅ CORRECT
return token; // Momoto already decided
```

### 🚨 COLOR CALCULATIONS

```typescript
// ❌ FORBIDDEN
const hoverColor = baseColor.lighten(0.1);

// ✅ CORRECT
const hoverColor = tokens.hoverBackgroundColor; // From token system
```

### 🚨 HARDCODED COLORS

```typescript
// ❌ FORBIDDEN
backgroundColor: '#3B82F6',

// ✅ CORRECT
backgroundColor: token.value.hex,
```

### 🚨 LOCAL CONTRAST CHECKS

```typescript
// ❌ FORBIDDEN
const ratio = getContrastRatio(text, bg);
if (ratio < 4.5) { /* ... */ }

// ✅ CORRECT
if (!token.accessibility.passesAA) { /* ... */ }
```

---

## Approval Checklist

Before submitting for review:

- [ ] All sections above are complete
- [ ] Contract verification passes
- [ ] Peer review requested
- [ ] No STOP conditions encountered
- [ ] Documentation complete
- [ ] Tests pass

---

**Last Updated:** 2026-01-08 (FASE 14)
**Engineer:** Principal Design System & Platform Engineer
