# FASE 11: UI Primitives & Component Kit - Architecture Plan

**Status:** 🏗️ IN PROGRESS
**Engineer:** Principal Frontend & Design Systems Engineer
**Date:** 2026-01-08
**Contract:** "Momoto decide, momoto-ui ejecuta" — **IMMUTABLE**

---

## Mission Statement

Design and implement `@momoto/ui-components` — a **zero-intelligence component library** where:
- **100% of decisions** come from Momoto WASM via `EnrichedToken`
- **0% perceptual logic** in component code
- **Accessibility by construction** (WCAG 2.2 AA minimum)
- **Cross-framework ready** (React first, adaptable to Vue/Svelte/Angular)

---

## Architectural Principles

### 1. Token-First Design

**Components MUST:**
- ✅ Accept `EnrichedToken` as primary prop for semantic colors
- ✅ Consume token metadata (qualityScore, confidence, reason)
- ✅ Use token accessibility info (WCAG ratios, AA/AAA pass)

**Components MUST NOT:**
- ❌ Calculate colors, contrasts, or accessibility metrics
- ❌ Make perceptual decisions (light/dark, warm/cool, etc.)
- ❌ Hardcode color values, even for states (hover, focus, disabled)

### 2. State Derivation from Tokens

**All visual states MUST be derived from tokens:**

```typescript
// ✅ CORRECT - States come from token system
interface ButtonProps {
  label: string;
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor?: EnrichedToken;

  // State tokens (derived by token system, not component)
  hoverBackgroundColor?: EnrichedToken;
  focusBackgroundColor?: EnrichedToken;
  disabledBackgroundColor?: EnrichedToken;
}

// ❌ INCORRECT - Component calculates states
interface ButtonProps {
  label: string;
  color: string; // ❌ Raw color, no metadata
  // Component would calculate hover, focus, disabled internally ❌
}
```

### 3. Accessibility by Construction

**Components MUST:**
- ✅ Use WCAG ratios from `EnrichedToken.accessibility.wcagRatio`
- ✅ Respect AA/AAA pass flags from token metadata
- ✅ Include ARIA attributes based on semantic roles
- ✅ Support keyboard navigation
- ✅ Provide focus indicators

**Components MUST NOT:**
- ❌ Calculate contrast ratios locally
- ❌ Assume text colors (always derive from tokens)
- ❌ Guess accessibility compliance

### 4. Zero Magic Numbers

**All visual properties MUST be:**
- ✅ Configurable via design tokens
- ✅ Derived from Momoto decisions
- ✅ Documented and traceable

**Prohibited:**
- ❌ Hardcoded spacing (use design token)
- ❌ Hardcoded border radius (use design token)
- ❌ Hardcoded opacity values (use design token)
- ❌ Magic color transformations (lighten by 10%, etc.)

---

## Package Structure

```
@momoto/ui-components/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                    # Public API exports
│   │
│   ├── primitives/                 # Atomic components (FASE 11)
│   │   ├── Button/
│   │   │   ├── Button.tsx          # Main component
│   │   │   ├── Button.types.ts     # TypeScript types
│   │   │   ├── Button.test.tsx     # Unit tests
│   │   │   └── index.ts            # Export
│   │   │
│   │   ├── TextField/
│   │   │   ├── TextField.tsx
│   │   │   ├── TextField.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── Select/
│   │   ├── Checkbox/
│   │   ├── Switch/
│   │   ├── Badge/
│   │   ├── Alert/
│   │   ├── Card/
│   │   └── Tooltip/
│   │
│   ├── composed/                   # Composed components (FASE 12)
│   │   └── (future)
│   │
│   ├── tokens/                     # Token consumption utilities
│   │   ├── TokenProvider.tsx       # React Context for tokens
│   │   ├── useToken.ts             # Hook to access tokens
│   │   └── TokenTheme.types.ts     # Theme contract
│   │
│   └── utils/                      # Pure utilities (NO perceptual logic)
│       ├── classNames.ts           # CSS class merging
│       └── aria.ts                 # ARIA helpers (no decisions)
│
├── docs/
│   ├── ARCHITECTURE.md             # This document
│   ├── COMPONENT_CONTRACT.md       # Component authoring rules
│   └── INTEGRATION.md              # How to use in apps
│
└── examples/
    └── basic-usage.tsx             # Example usage
```

---

## Component Contract

Every component in `@momoto/ui-components` MUST follow this contract:

### 1. Props Interface

```typescript
import type { EnrichedToken } from '@zuclubit/momoto-ui/domain/tokens';

interface ComponentProps {
  // Required semantic props
  [semanticRole: string]: EnrichedToken;

  // Optional states (ALL from tokens, not computed)
  [stateVariant: string]?: EnrichedToken;

  // Non-color props (layout, content, behavior)
  [otherProp: string]: any;

  // Standard React props
  className?: string;
  style?: React.CSSProperties;

  // Accessibility overrides (optional)
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### 2. Implementation Rules

```typescript
export function Component({
  backgroundColor,
  textColor,
  borderColor,
  // ... other props
}: ComponentProps) {
  // ✅ ALLOWED: Read token values
  const bgHex = backgroundColor.value.hex;
  const textHex = textColor.value.hex;

  // ✅ ALLOWED: Use token metadata for debugging/logging
  if (backgroundColor.isLowQuality) {
    console.warn(`Low quality token: ${backgroundColor.name}`, {
      score: backgroundColor.qualityScore,
      reason: backgroundColor.reason
    });
  }

  // ✅ ALLOWED: Use accessibility metadata
  const wcagRatio = textColor.accessibility?.wcagRatio;
  const passesAA = textColor.accessibility?.passesAA;

  // ❌ FORBIDDEN: Calculate colors
  const hoverColor = lighten(bgHex, 0.1); // ❌ NO!

  // ❌ FORBIDDEN: Make perceptual decisions
  const isDark = backgroundColor.value.oklch.l < 0.5; // ❌ NO!

  // ❌ FORBIDDEN: Calculate contrast
  const contrast = calculateContrast(bgHex, textHex); // ❌ NO!

  return (
    <div
      style={{
        backgroundColor: bgHex,
        color: textHex,
        borderColor: borderColor?.value.hex,
      }}
      // ✅ ALLOWED: ARIA attributes
      role="button"
      aria-label="..."
      // ✅ ALLOWED: Expose quality metadata for debugging
      data-momoto-quality={backgroundColor.qualityScore}
      data-momoto-decision={backgroundColor.sourceDecisionId}
    >
      {/* content */}
    </div>
  );
}
```

### 3. State Handling

**ALL states MUST be provided as tokens:**

```typescript
interface ButtonProps {
  // Base state
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;

  // Interactive states (ALL from tokens)
  hoverBackgroundColor?: EnrichedToken;
  hoverTextColor?: EnrichedToken;

  focusBackgroundColor?: EnrichedToken;
  focusTextColor?: EnrichedToken;

  activeBackgroundColor?: EnrichedToken;
  activeTextColor?: EnrichedToken;

  disabledBackgroundColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;
}
```

**Implementation:**

```typescript
export function Button({
  backgroundColor,
  textColor,
  hoverBackgroundColor,
  hoverTextColor,
  // ...
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ✅ CORRECT: Select token based on state
  const currentBg = isHovered && hoverBackgroundColor
    ? hoverBackgroundColor
    : backgroundColor;

  const currentText = isHovered && hoverTextColor
    ? hoverTextColor
    : textColor;

  return (
    <button
      style={{
        backgroundColor: currentBg.value.hex,
        color: currentText.value.hex,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* ... */}
    </button>
  );
}
```

---

## Token Theme System

Components need a way to access tokens without prop drilling. We'll use React Context:

```typescript
// tokens/TokenTheme.types.ts
export interface TokenTheme {
  // Primitive tokens
  colors: {
    primary: EnrichedToken;
    secondary: EnrichedToken;
    accent: EnrichedToken;
    background: EnrichedToken;
    surface: EnrichedToken;
    border: EnrichedToken;
    text: {
      primary: EnrichedToken;
      secondary: EnrichedToken;
      disabled: EnrichedToken;
    };
  };

  // Semantic tokens (for components)
  button: {
    primary: {
      background: EnrichedToken;
      text: EnrichedToken;
      border: EnrichedToken;
      hover: {
        background: EnrichedToken;
        text: EnrichedToken;
      };
      focus: {
        background: EnrichedToken;
        text: EnrichedToken;
      };
      disabled: {
        background: EnrichedToken;
        text: EnrichedToken;
      };
    };
    secondary: { /* ... */ };
    danger: { /* ... */ };
  };

  // ... more component tokens
}

// tokens/TokenProvider.tsx
export function TokenProvider({
  theme,
  children
}: {
  theme: TokenTheme;
  children: React.ReactNode;
}) {
  return (
    <TokenContext.Provider value={theme}>
      {children}
    </TokenContext.Provider>
  );
}

// tokens/useToken.ts
export function useToken(path: string): EnrichedToken {
  const theme = useContext(TokenContext);
  return getTokenByPath(theme, path);
}
```

**Usage:**

```typescript
function Button({ variant = 'primary', ...props }: ButtonProps) {
  // ✅ Get tokens from theme
  const backgroundColor = useToken(`button.${variant}.background`);
  const textColor = useToken(`button.${variant}.text`);
  const hoverBg = useToken(`button.${variant}.hover.background`);

  return (
    <button
      style={{
        backgroundColor: backgroundColor.value.hex,
        color: textColor.value.hex,
      }}
      // ...
    >
      {props.label}
    </button>
  );
}
```

---

## FASE 11 Component Specifications

### 1. Button (Canonical Implementation)

**Required Props:**
```typescript
interface ButtonProps {
  // Content
  label: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';

  // Tokens (ALL states)
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor?: EnrichedToken;
  hoverBackgroundColor?: EnrichedToken;
  hoverTextColor?: EnrichedToken;
  focusBackgroundColor?: EnrichedToken;
  focusTextColor?: EnrichedToken;
  disabledBackgroundColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;

  // Behavior
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';

  // Layout
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;

  // Standard
  className?: string;
  style?: React.CSSProperties;
}
```

**Accessibility Requirements:**
- ✅ WCAG 2.2 AA minimum contrast (from tokens)
- ✅ Keyboard navigation (Enter, Space)
- ✅ Focus indicators (from tokens)
- ✅ Disabled state (from tokens)
- ✅ ARIA labels

**Implementation Notes:**
- NO color calculations
- ALL states from tokens
- Quality warnings in dev mode if token quality is low

### 2. TextField

**Required Props:**
```typescript
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;

  // Tokens
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor: EnrichedToken;
  focusBorderColor?: EnrichedToken;
  errorBorderColor?: EnrichedToken;
  labelColor?: EnrichedToken;

  // Validation
  error?: string;
  required?: boolean;

  // Type
  type?: 'text' | 'email' | 'password' | 'number';

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### 3. Select

**Required Props:**
```typescript
interface SelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;

  // Tokens
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor: EnrichedToken;
  focusBorderColor?: EnrichedToken;
  optionBackgroundColor?: EnrichedToken;
  optionHoverBackgroundColor?: EnrichedToken;
}
```

### 4. Checkbox

**Required Props:**
```typescript
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;

  // Tokens
  boxBackgroundColor: EnrichedToken;
  boxBorderColor: EnrichedToken;
  checkedBackgroundColor: EnrichedToken;
  checkmarkColor: EnrichedToken;
  labelColor: EnrichedToken;
}
```

### 5. Switch

**Required Props:**
```typescript
interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;

  // Tokens
  trackBackgroundColor: EnrichedToken;
  trackCheckedBackgroundColor: EnrichedToken;
  thumbColor: EnrichedToken;
  labelColor?: EnrichedToken;
}
```

### 6. Badge

**Required Props:**
```typescript
interface BadgeProps {
  label: string;

  // Tokens
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor?: EnrichedToken;

  // Size
  size?: 'sm' | 'md' | 'lg';
}
```

### 7. Alert

**Required Props:**
```typescript
interface AlertProps {
  title: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';

  // Tokens (per variant)
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor?: EnrichedToken;
  iconColor?: EnrichedToken;

  // Behavior
  onClose?: () => void;
  dismissible?: boolean;
}
```

### 8. Card

**Required Props:**
```typescript
interface CardProps {
  children: React.ReactNode;

  // Tokens
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  borderColor?: EnrichedToken;

  // Layout
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean; // shadow
}
```

### 9. Tooltip

**Required Props:**
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactElement;

  // Tokens
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;

  // Placement
  placement?: 'top' | 'bottom' | 'left' | 'right';
}
```

---

## Validation Checklist

Before a component is considered complete, it MUST pass:

### Contract Compliance
- [ ] ✅ NO perceptual logic in component code
- [ ] ✅ NO color calculations (lighten, darken, saturate, etc.)
- [ ] ✅ NO contrast calculations
- [ ] ✅ NO hardcoded color values
- [ ] ✅ ALL colors from `EnrichedToken`
- [ ] ✅ ALL states from tokens (hover, focus, disabled)
- [ ] ✅ Uses token accessibility metadata

### Accessibility
- [ ] ✅ WCAG 2.2 AA minimum (verified via token metadata)
- [ ] ✅ Keyboard navigation
- [ ] ✅ ARIA attributes
- [ ] ✅ Focus indicators
- [ ] ✅ Screen reader support

### Code Quality
- [ ] ✅ TypeScript strict mode
- [ ] ✅ Proper prop types
- [ ] ✅ JSDoc documentation
- [ ] ✅ Unit tests
- [ ] ✅ No ESLint warnings

### Traceability
- [ ] ✅ Exposes Momoto metadata in data attributes (dev mode)
- [ ] ✅ Logs quality warnings for low-quality tokens
- [ ] ✅ Includes sourceDecisionId in debug info

---

## Metrics & Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Heuristics in components | 0 | Code audit |
| Hardcoded color values | 0 | Code audit |
| Local contrast calculations | 0 | Code audit |
| Momoto-governed components | 100% | Code audit |
| WCAG 2.2 AA compliance | 100% | Via token metadata |
| Contract violations | 0 | Automated tests |
| TypeScript strict errors | 0 | `tsc --noEmit` |
| Components implemented | 9 minimum | Manual count |

---

## Risks & Mitigation

### Risk 1: Token Prop Drilling
**Problem:** Passing many token props becomes verbose.
**Mitigation:** Use `TokenProvider` + `useToken` hook for semantic token access.

### Risk 2: State Token Management
**Problem:** Components need tokens for all states (hover, focus, disabled).
**Mitigation:** Token system generates state variants automatically (FASE 12).

### Risk 3: Performance
**Problem:** Multiple `EnrichedToken` instances might impact performance.
**Mitigation:** Tokens are immutable value objects, can be memoized.

### Risk 4: Learning Curve
**Problem:** Developers need to understand token-first approach.
**Mitigation:** Comprehensive examples, documentation, and developer tools.

---

## Future Phases (NOT FASE 11)

### FASE 12: @momoto/tokens
- Token generation utilities
- State variant generators (hover, focus, disabled)
- Token themes (light/dark)
- W3C token export

### FASE 13: Framework Adapters
- Vue adapter
- Svelte adapter
- Angular adapter
- Web Components adapter

### FASE 14: Enterprise Governance
- Token linting
- Quality gates
- Automated audits
- Compliance reports

### FASE 15: CLI & DevTools
- Token generation CLI
- Component scaffolding
- Visual token editor
- Browser DevTools extension

---

## Implementation Order

1. **FASE 11.1:** ✅ Architecture planning (this document)
2. **FASE 11.2:** Define token contracts and utilities
3. **FASE 11.3:** Implement Button (canonical reference)
4. **FASE 11.4:** Implement remaining 8 components
5. **FASE 11.5:** Contract compliance validation
6. **FASE 11.6:** Documentation and examples
7. **FASE 11.7:** Compliance report

---

## Conclusion

FASE 11 establishes the **component layer** of the Momoto design system with these guarantees:

✅ **100% Momoto-governed** — All decisions from WASM
✅ **0% component intelligence** — Pure execution layer
✅ **Accessible by construction** — WCAG 2.2 AA minimum
✅ **Traceable and explainable** — Every decision has metadata
✅ **Production-ready** — Type-safe, tested, documented

**The contract is preserved. The architecture is pure.**

---

**Status:** 📋 PLAN COMPLETE — Ready for implementation
**Next:** FASE 11.2 — Define component token contracts
