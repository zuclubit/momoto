# Momoto Public API Audit - Fase 1 (Pre-Beta)

**Date**: 2026-01-06
**Auditor**: Principal Engineering Team
**Scope**: `public-api.ts` (1232 LOC)
**Objective**: Identify ambiguities, missing exports, and APIs without explicit decisions before v5.0.0-beta release

---

## Executive Summary

**Overall Assessment**: **GOOD** with critical fixes required

The public API is well-structured with:
- ✅ Layered exports (Domain → Application → Infrastructure)
- ✅ Clear versioning (SemVer)
- ✅ Comprehensive type coverage
- ✅ Good separation of concerns

**Critical Issues Found**: 1
**High Priority Issues**: 3
**Medium Priority Issues**: 4

---

## Critical Issues (P0 - BLOCKING BETA)

### 1. WCAGContrast Not Exported ❌ CRITICAL

**Status**: **BLOCKING** - Must fix before v5.0.0-beta

**Location**: `public-api.ts` (lines 61-68)

**Problem**:
```typescript
// Lines 61-68
export { default as OKLCH } from './domain/value-objects/OKLCH';
export type { OKLCHValues, OKLabValues, RGBValues } from './domain/value-objects/OKLCH';

export { default as HCT } from './domain/value-objects/HCT';
export type { HCTValues } from './domain/value-objects/HCT';

export { default as APCAContrast, APCA_REQUIREMENTS } from './domain/value-objects/APCAContrast';
export type { APCALevel, APCAPolarity, APCARequirements } from './domain/value-objects/APCAContrast';

// ❌ WCAGContrast is MISSING
```

**Evidence**:
1. `WCAGContrast.ts` exists at `domain/value-objects/WCAGContrast.ts` (444 LOC)
2. Recently moved to domain layer (documented in AUDIT_REPORT.md)
3. Marked as **Stable** in STATUS.md
4. **APCAContrast is exported but has 33.3% accuracy** (documented in APCA_ACCURACY_ISSUE.md)
5. **WCAGContrast is the recommended fallback** for production

**Impact**:
- Users **cannot access stable WCAG 2.1 validation** through public API
- Forces users to rely on **inaccurate APCA** (33.3% pass rate)
- **Violates documented guarantee** in STATUS.md that WCAGContrast is stable
- **Breaks decision-first design**: Users have no stable option for regulated environments

**Recommendation**:
```typescript
// Add after line 68
export { default as WCAGContrast, WCAG_REQUIREMENTS } from './domain/value-objects/WCAGContrast';
export type {
  WCAGLevel,
  WCAGTextSize
} from './domain/value-objects/WCAGContrast';
export { isLargeText } from './domain/value-objects/WCAGContrast';
```

**Timeline**: Fix immediately (before beta release)

---

## High Priority Issues (P1 - Fix Before Final Release)

### 2. analyzeColor() Lacks Decision Model

**Location**: `public-api.ts` (lines 730-762)

**Issue**: Utility function that **aggregates data** without explicit decision

**Current Implementation**:
```typescript
export function analyzeColor(hex: string): {
  oklch: OKLCH | null;
  hct: HCT | null;
  contrastMode: ReturnType<typeof detectContrastMode>;
  optimalTextColor: string;  // ❌ What makes this "optimal"?
  wcag21ContrastOnWhite: number;
  wcag21ContrastOnBlack: number;
  apcaOnWhite: number;
  apcaOnBlack: number;
} {
  // ...
  return {
    // ...
    optimalTextColor: contrastMode.mode === 'light-content' ? '#0A0A0A' : '#FFFFFF',  // ❌ No decision reasoning
    // ...
  };
}
```

**Problems**:
1. `optimalTextColor` is determined by simple ternary, not a **decision model**
2. No `reasoning` or `confidence` score
3. No context consideration (font size, weight, environment)
4. **Violates decision-first design**: Color exists without explanation

**Decision-First Alternative**:
```typescript
export function analyzeColor(hex: string): {
  oklch: OKLCH | null;
  hct: HCT | null;
  contrastMode: ReturnType<typeof detectContrastMode>;
  textColorDecision: {  // ✅ Explicit decision
    color: string;
    reasoning: string[];
    confidence: ConfidenceScore;
    alternatives: Array<{ color: string; score: number }>;
  };
  metrics: {
    wcag21OnWhite: number;
    wcag21OnBlack: number;
    apcaOnWhite: number;
    apcaOnBlack: number;
  };
}
```

**Recommendation**:
- Deprecate `optimalTextColor` in v5.0.0
- Replace with `textColorDecision` in v5.1.0
- Use `ContrastDecisionEngine` internally

---

### 3. isAccessible() Contains Inline Decision Logic

**Location**: `public-api.ts` (lines 850-867)

**Issue**: Business logic **embedded in convenience function** instead of domain layer

**Current Implementation**:
```typescript
export function isAccessible(
  foreground: string,
  background: string,
  level: 'minimum' | 'AA' | 'AAA' = 'AA'
): boolean {
  const validation = validateColorPair(foreground, background);

  switch (level) {
    case 'minimum':
      return validation.apcaContrast.absoluteLc >= 30;  // ❌ Magic number
    case 'AA':
      return validation.passes.wcagAA || validation.passes.apcaLarge;  // ❌ OR logic
    case 'AAA':
      return validation.passes.wcagAAA || validation.passes.apcaBody;  // ❌ OR logic
    default:
      return false;
  }
}
```

**Problems**:
1. **Magic number**: `30` for "minimum" level (no documentation)
2. **OR logic**: `wcagAA || apcaLarge` combines two standards without explanation
3. **No decision trace**: User doesn't know *why* it passed/failed
4. **No confidence score**: Did it barely pass or exceed requirements?

**Decision-First Alternative**:
```typescript
export interface AccessibilityDecision {
  accessible: boolean;
  level: 'minimum' | 'AA' | 'AAA';
  standard: 'wcag21' | 'wcag3-apca' | 'both';
  reasoning: string[];
  confidence: ConfidenceScore;
  metrics: {
    wcag21Ratio: number;
    apcaLc: number;
  };
  warnings: string[];
}

export function evaluateAccessibility(
  foreground: string,
  background: string,
  level: 'minimum' | 'AA' | 'AAA' = 'AA'
): AccessibilityDecision {
  // Use ContrastDecisionEngine
  // Return full decision model
}

// Convenience wrapper (keeps API simple)
export function isAccessible(...args): boolean {
  return evaluateAccessibility(...args).accessible;
}
```

**Recommendation**:
- Keep `isAccessible()` for DX, but add `evaluateAccessibility()`
- Move threshold logic to domain constants
- Document why thresholds are chosen

---

### 4. getTextColor() Hardcoded Defaults

**Location**: `public-api.ts` (lines 873-896)

**Issue**: Function name implies **optimal decision** but uses hardcoded defaults

**Current Implementation**:
```typescript
export function getTextColor(
  background: string,
  options: {
    preferDark?: boolean;
    minContrast?: number;
  } = {}
): {
  color: string;
  contrast: number;
  isAccessible: boolean;
} {
  const { preferDark = true, minContrast = 60 } = options;  // ❌ Magic numbers

  const optimal = APCAContrast.findOptimalTextColor(background, {
    preferDark,
    minLc: minContrast,
  });

  return {
    color: optimal.color,
    contrast: optimal.contrast.absoluteLc,
    isAccessible: optimal.contrast.absoluteLc >= 60,  // ❌ Hardcoded threshold
  };
}
```

**Problems**:
1. **`minContrast = 60`**: Why 60? (Minimum for fluent text, but not documented)
2. **`preferDark = true`**: Opinionated default (might not match user's theme)
3. **Uses APCA exclusively**: Ignores WCAG 2.1 (which is stable)
4. **No decision explanation**: User doesn't know *why* this color was chosen

**Recommendation**:
- Rename to `suggestTextColor()` (less authoritative)
- Add `reasoning` field to return type
- Use `ContrastDecisionEngine` for multi-factor analysis
- Allow choosing between WCAG 2.1 and APCA

---

## Medium Priority Issues (P2 - Consider for v5.1.0)

### 5. generateBrandTheme() Opaque Decision Process

**Location**: `public-api.ts` (lines 768-808)

**Issue**: "Brand theme" is generated without explaining **what makes it a brand theme**

**Current Behavior**:
```typescript
export function generateBrandTheme(
  primaryColor: string,
  options: {
    accentColor?: string;
    mode?: 'light' | 'dark' | 'auto';
    format?: 'oklch' | 'hsl' | 'rgb' | 'hex';
  } = {}
): {
  css: string;
  analysis: ReturnType<typeof analyzeBrandColor>;
  variables: Record<string, string>;
}
```

**Missing**:
- **Decision trail**: Why these specific color variants?
- **Accessibility guarantees**: Are all generated colors accessible?
- **Brand constraints**: How does it ensure brand consistency?

**Recommendation**:
- Add `decisions` field with reasoning for each generated color
- Include accessibility validation results
- Allow passing `PerceptualPolicy` for brand compliance

---

### 6. Default Export Anti-Pattern

**Location**: `public-api.ts` (lines 1023-1077)

**Issue**: Default export bundles everything, **hurting tree-shaking**

**Current**:
```typescript
export default {
  VERSION,
  API_VERSION,
  getModuleInfo,
  OKLCH,
  HCT,
  APCAContrast,
  Gradient,
  // ... 50+ exports
};
```

**Problem**:
- Bundlers cannot tree-shake unused exports
- Users who only need `OKLCH` will bundle entire API
- Modern best practice: Named exports only

**Recommendation**:
- Mark default export as **deprecated** in v5.0.0
- Remove in v6.0.0
- Documentation should use named imports:
  ```typescript
  import { OKLCH, isAccessible } from 'momoto';
  ```

---

### 7. Missing CAM16 Export

**Location**: Domain value objects section (lines 61-68)

**Issue**: `CAM16` value object exists but is **not exported**

**Evidence**:
- File exists: `domain/value-objects/CAM16.ts` (690 LOC)
- Marked as **Beta** in STATUS.md
- Not available in public API

**Recommendation**:
- Export `CAM16` in `experimental-api.ts` (not public-api.ts)
- Stabilize and move to public-api.ts in v5.1.0

---

### 8. ContrastDecisionEngine Not Exported

**Location**: Application layer (lines 102-148)

**Issue**: Core decision engine is **not directly accessible**

**Current**:
- `detectContrastMode` exported (use case)
- `validateColorPair` exported (use case)
- `ContrastDecisionEngine` **NOT exported** (orchestrator)

**Problem**:
- Users cannot customize decision weights
- Users cannot extend with custom factors
- Forces use of opinionated convenience functions

**Recommendation**:
```typescript
// Add to Application Layer section
export {
  ContrastDecisionEngine,
  createDecisionEngine,
} from './application/ContrastDecisionEngine';
export type {
  DecisionEngineConfig,
  DecisionWeights,
} from './application/ContrastDecisionEngine';
```

---

## Low Priority Issues (P3 - Nice to Have)

### 9. Type Inconsistencies

**Issue**: Some exports use `type` prefix, others don't

**Examples**:
```typescript
// Consistent
export { default as OKLCH } from './domain/value-objects/OKLCH';
export type { OKLCHValues } from './domain/value-objects/OKLCH';

// Inconsistent (missing type prefix for some)
export type {
  ContrastDecision,
  WCAGLevel,  // Sometimes used as value (validation.passes.wcagAA)
}
```

**Recommendation**: Audit all type exports for const vs type usage

---

### 10. Missing JSDoc for Stability Markers

**Issue**: Exports lack `@stable`, `@beta`, `@experimental` JSDoc tags

**Current**:
```typescript
export { default as OKLCH } from './domain/value-objects/OKLCH';
```

**Better**:
```typescript
/**
 * OKLCH perceptually uniform color space
 * @stable
 * @since 4.0.0
 */
export { default as OKLCH } from './domain/value-objects/OKLCH';

/**
 * APCA contrast (WCAG 3.0)
 * @normative - Under calibration, see APCA_ACCURACY_ISSUE.md
 * @since 4.0.0
 */
export { default as APCAContrast } from './domain/value-objects/APCAContrast';
```

**Recommendation**: Add JSDoc tags to all exports (helps IDEs show stability)

---

## Summary of Required Changes

### Before v5.0.0-beta (IMMEDIATE)

| Issue | Priority | Action | Lines |
|-------|----------|--------|-------|
| WCAGContrast not exported | P0 | Add export after line 68 | 68-70 |

### Before v5.0.0 final (HIGH)

| Issue | Priority | Action | Lines |
|-------|----------|--------|-------|
| analyzeColor() lacks decision | P1 | Add textColorDecision field | 730-762 |
| isAccessible() inline logic | P1 | Extract to domain, add evaluateAccessibility() | 850-867 |
| getTextColor() hardcoded defaults | P1 | Document thresholds, add reasoning | 873-896 |

### v5.1.0 (MEDIUM)

| Issue | Priority | Action | Lines |
|-------|----------|--------|-------|
| generateBrandTheme() opaque | P2 | Add decision trail | 768-808 |
| Default export anti-pattern | P2 | Deprecate, remove in v6.0.0 | 1023-1077 |
| CAM16 missing | P2 | Export in experimental-api.ts | - |
| ContrastDecisionEngine not exported | P2 | Add export | - |

---

## Compliance with Momoto Principles

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **Decision-First Design** | ⚠️ 70% | Convenience functions lack decision models |
| **Hexagonal Architecture** | ✅ 100% | Clean layer separation |
| **Immutability** | ✅ 100% | All value objects immutable |
| **Framework Agnostic** | ✅ 100% | Pure TypeScript |
| **Explainability** | ⚠️ 65% | Missing in analyzeColor, isAccessible, getTextColor |
| **Accessibility by Construction** | ❌ 50% | Stable WCAG not exported, APCA inaccurate |

---

## Recommendations

### Immediate Actions (Week 1)

1. **Export WCAGContrast** (P0)
   - Add to public-api.ts line 68
   - Update default export line 1033
   - Add to documentation

2. **Document Magic Numbers** (P1)
   - Create `ACCESSIBILITY_THRESHOLDS.md`
   - Explain why `minContrast = 60`, `minimum = 30`
   - Reference in JSDoc

3. **Add Stability JSDoc Tags** (P3)
   - Tag all exports with `@stable`, `@beta`, `@experimental`
   - Helps IDEs show warnings for unstable APIs

### Short-Term (v5.0.0 final)

4. **Refactor Convenience Functions** (P1)
   - Extract decision logic to domain layer
   - Add `reasoning` and `confidence` fields
   - Keep simple wrappers for DX

5. **Export ContrastDecisionEngine** (P2)
   - Allow advanced users to customize
   - Document decision weights

### Long-Term (v5.1.0)

6. **Deprecate Default Export** (P2)
   - Add deprecation warning
   - Update all documentation to use named imports
   - Remove in v6.0.0

7. **Add evaluateAccessibility()** (P1)
   - Full decision model return type
   - Keep isAccessible() as convenience wrapper

---

## Conclusion

The public API is **well-architected** but has **one critical gap** (WCAGContrast export) and several **decision-first violations** in convenience functions.

**Overall Grade**: B+ (will be A after fixes)

**Blocker for Beta**: WCAGContrast export (5-minute fix)

**Blockers for Production**:
1. WCAGContrast export (P0)
2. APCA accuracy fix (P0, separate from API)
3. Decision model improvements (P1)

---

**Next Steps**:
1. Fix WCAGContrast export immediately
2. Create decision models for convenience functions
3. Document all thresholds and defaults
4. Add JSDoc stability markers

---

**Reviewed By**: Principal Engineering Team
**Sign-off Required**: Before v5.0.0-beta release
