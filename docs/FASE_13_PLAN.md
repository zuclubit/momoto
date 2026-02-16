# FASE 13: Multi-Framework Adapters - Architecture Plan

**Status:** 🏗️ IN PROGRESS
**Engineer:** Principal Frontend Platform Engineer
**Date:** 2026-01-08
**Contract:** "Momoto decide, momoto-ui ejecuta" — **IMMUTABLE**

---

## Mission Statement

Convert Momoto UI into a **multi-framework component kit** where:
- **Identical behavior** across all frameworks
- **Zero logic duplication** (shared core)
- **Zero local intelligence** (all decisions from tokens)
- **Single source of truth** (tokens + Momoto)

---

## Current State Assessment

### ✅ What Previous Phases Established

**FASE 11:**
- React Button component (canonical implementation)
- Token-driven architecture
- Complete state management via token selection

**FASE 12:**
- Automated token generation (TokenThemeGenerator)
- Strict validation (TokenValidator)
- Three-layer token architecture

**Current React Button:**
- 420 LOC implementation
- 100% token-driven
- Zero perceptual logic
- Complete ARIA support
- All states from tokens

### ❌ What's Missing (FASE 13 Scope)

**Portability:**
- ❌ No Vue support
- ❌ No Svelte support
- ❌ No Angular support
- ❌ Logic is React-specific

**Architecture:**
- ❌ No shared core
- ❌ No adapter pattern
- ❌ Would require full reimplementation per framework

---

## Adapter Architecture

FASE 13 introduces a **shared core + framework adapter** pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│  CORE (Framework-Agnostic)                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                  │
│  - Token resolution (state → tokens)                            │
│  - Style computation (tokens → CSS)                             │
│  - ARIA generation (props → ARIA attributes)                    │
│  - Size/layout constants                                        │
│  - Event handler logic                                          │
│                                                                  │
│  NO FRAMEWORK DEPENDENCIES                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Shared Core API
                             │
        ┌────────────────────┼────────────────────┬───────────────────┐
        │                    │                    │                   │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐  ┌─────▼────────┐
│  React Adapter │  │  Vue Adapter    │  │ Svelte Adapter │  │ Angular      │
│  ━━━━━━━━━━━━  │  │  ━━━━━━━━━━━━   │  │ ━━━━━━━━━━━━━  │  │ Adapter      │
│                │  │                 │  │                │  │ ━━━━━━━━━━━  │
│  - JSX render  │  │  - Template     │  │  - Template    │  │  - Template  │
│  - React hooks │  │  - Composition  │  │  - Reactive    │  │  - RxJS      │
│  - Events      │  │    API          │  │    statements  │  │  - Decorators│
│                │  │  - Events       │  │  - Events      │  │  - Events    │
└────────────────┘  └─────────────────┘  └────────────────┘  └──────────────┘
```

### Shared Core Responsibilities

**What the core handles:**

1. **Token Resolution**
   ```typescript
   resolveTokens(
     baseTokens: ButtonTokenSet,
     state: ButtonState
   ): ResolvedButtonTokens {
     // Select tokens based on current state
     // NO calculations, just selection
   }
   ```

2. **Style Computation**
   ```typescript
   computeStyles(
     tokens: ResolvedButtonTokens,
     size: ButtonSize,
     fullWidth: boolean
   ): CSSProperties {
     // Generate CSS from tokens
     // Uses token.value.hex for colors
   }
   ```

3. **ARIA Generation**
   ```typescript
   generateARIA(
     props: ButtonProps
   ): ARIAAttributes {
     // Generate ARIA attributes
     // Uses createButtonAria utility
   }
   ```

4. **Event Logic**
   ```typescript
   createEventHandlers(
     props: ButtonProps,
     setHovered: (value: boolean) => void,
     setFocused: (value: boolean) => void,
     setActive: (value: boolean) => void
   ): EventHandlers {
     // Create event handler functions
     // Framework-agnostic logic
   }
   ```

### Framework Adapter Responsibilities

**What adapters handle:**

1. **Rendering**
   - Framework-specific template/JSX
   - Apply styles from core
   - Bind events from core

2. **State Management**
   - React: `useState`
   - Vue: `ref`
   - Svelte: reactive statements
   - Angular: class properties

3. **Events**
   - Wire framework events to core handlers
   - Handle framework-specific event objects

**What adapters MUST NOT do:**
- ❌ Calculate colors
- ❌ Make perceptual decisions
- ❌ Reinterpret tokens
- ❌ Implement accessibility logic
- ❌ Duplicate core logic

---

## Core API Design

### Core Module Structure

```typescript
// adapters/core/button/
├── buttonCore.ts           # Main core logic
├── buttonCore.types.ts     # Shared types
├── tokenResolver.ts        # Token resolution
├── styleComputer.ts        # Style computation
├── ariaGenerator.ts        # ARIA generation
└── constants.ts            # Size config, etc.
```

### Core API

```typescript
/**
 * ButtonCore - Framework-agnostic button logic.
 *
 * CONTRACT:
 * - NO framework dependencies
 * - NO perceptual logic
 * - Token-driven ONLY
 */
export class ButtonCore {
  /**
   * Resolve tokens for current state.
   */
  static resolveTokens(
    tokens: ButtonTokenSet,
    state: ButtonState
  ): ResolvedButtonTokens {
    switch (state) {
      case 'disabled':
        return {
          backgroundColor: tokens.disabled.background,
          textColor: tokens.disabled.text,
          borderColor: tokens.disabled.border,
          outlineColor: null,
        };
      case 'active':
        return {
          backgroundColor: tokens.active.background,
          textColor: tokens.active.text,
          borderColor: tokens.active.border,
          outlineColor: null,
        };
      case 'focus':
        return {
          backgroundColor: tokens.focus.background,
          textColor: tokens.focus.text,
          borderColor: tokens.focus.border,
          outlineColor: tokens.focus.outline,
        };
      case 'hover':
        return {
          backgroundColor: tokens.hover.background,
          textColor: tokens.hover.text,
          borderColor: tokens.hover.border,
          outlineColor: null,
        };
      case 'base':
      default:
        return {
          backgroundColor: tokens.background,
          textColor: tokens.text,
          borderColor: tokens.border,
          outlineColor: null,
        };
    }
  }

  /**
   * Compute styles from resolved tokens.
   */
  static computeStyles(
    tokens: ResolvedButtonTokens,
    size: ButtonSize,
    fullWidth: boolean,
    state: ButtonState
  ): CSSProperties {
    const sizeConfig = SIZE_CONFIG[size];

    return {
      // Layout
      height: `${sizeConfig.height}px`,
      paddingLeft: `${sizeConfig.paddingX}px`,
      paddingRight: `${sizeConfig.paddingX}px`,
      paddingTop: `${sizeConfig.paddingY}px`,
      paddingBottom: `${sizeConfig.paddingY}px`,
      width: fullWidth ? '100%' : 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',

      // Typography
      fontSize: `${sizeConfig.fontSize}px`,
      fontWeight: '500',
      lineHeight: '1.5',
      fontFamily: 'inherit',

      // Colors from tokens (NO calculations)
      backgroundColor: tokens.backgroundColor.value.hex,
      color: tokens.textColor.value.hex,
      ...(tokens.borderColor && {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: tokens.borderColor.value.hex,
      }),

      // Focus outline (from token)
      ...(state === 'focus' && tokens.outlineColor && {
        outline: `2px solid ${tokens.outlineColor.value.hex}`,
        outlineOffset: '2px',
      }),

      // Visual polish (non-color)
      borderRadius: '8px',
      cursor: state === 'disabled' ? 'not-allowed' : 'pointer',
      transition: 'all 150ms ease-in-out',
      userSelect: 'none',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    };
  }

  /**
   * Generate ARIA attributes.
   */
  static generateARIA(
    label: string,
    disabled: boolean,
    loading: boolean,
    ariaLabel?: string,
    ariaDescribedby?: string
  ): ARIAAttributes {
    return createButtonAria({
      label: ariaLabel || label,
      describedby: ariaDescribedby,
      disabled: disabled || loading,
    });
  }

  /**
   * Determine current state from flags.
   */
  static determineState(
    disabled: boolean,
    loading: boolean,
    isActive: boolean,
    isFocused: boolean,
    isHovered: boolean
  ): ButtonState {
    if (disabled || loading) return 'disabled';
    if (isActive) return 'active';
    if (isFocused) return 'focus';
    if (isHovered) return 'hover';
    return 'base';
  }

  /**
   * Create event handlers (framework-agnostic logic).
   */
  static createEventHandlers(
    onClick: (() => void) | undefined,
    disabled: boolean,
    loading: boolean,
    setHovered: (value: boolean) => void,
    setFocused: (value: boolean) => void,
    setActive: (value: boolean) => void
  ): EventHandlers {
    return {
      handleClick: (event: any) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        onClick?.();
      },
      handleMouseEnter: () => setHovered(true),
      handleMouseLeave: () => {
        setHovered(false);
        setActive(false);
      },
      handleFocus: () => setFocused(true),
      handleBlur: () => setFocused(false),
      handleMouseDown: () => setActive(true),
      handleMouseUp: () => setActive(false),
    };
  }
}
```

---

## Framework Adapters

### React Adapter (Reference)

**File:** `adapters/react/Button/Button.tsx`

Already implemented in FASE 11. Will be refactored to use core.

```typescript
import { ButtonCore } from '../../core/button';

export function Button(props: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Use core for state determination
  const state = ButtonCore.determineState(
    props.disabled || false,
    props.loading || false,
    isActive,
    isFocused,
    isHovered
  );

  // Use core for token resolution
  const tokens = ButtonCore.resolveTokens(themeTokens, state);

  // Use core for styles
  const styles = ButtonCore.computeStyles(
    tokens,
    props.size || 'md',
    props.fullWidth || false,
    state
  );

  // Use core for ARIA
  const aria = ButtonCore.generateARIA(
    props.label,
    props.disabled || false,
    props.loading || false,
    props['aria-label'],
    props['aria-describedby']
  );

  // Use core for event handlers
  const handlers = ButtonCore.createEventHandlers(
    props.onClick,
    props.disabled || false,
    props.loading || false,
    setIsHovered,
    setIsFocused,
    setActive
  );

  return (
    <button
      style={styles}
      onClick={handlers.handleClick}
      onMouseEnter={handlers.handleMouseEnter}
      onMouseLeave={handlers.handleMouseLeave}
      onFocus={handlers.handleFocus}
      onBlur={handlers.handleBlur}
      onMouseDown={handlers.handleMouseDown}
      onMouseUp={handlers.handleMouseUp}
      {...aria}
    >
      {props.label}
    </button>
  );
}
```

### Vue 3 Adapter

**File:** `adapters/vue/Button/Button.vue`

```vue
<template>
  <button
    :style="styles"
    @click="handlers.handleClick"
    @mouseenter="handlers.handleMouseEnter"
    @mouseleave="handlers.handleMouseLeave"
    @focus="handlers.handleFocus"
    @blur="handlers.handleBlur"
    @mousedown="handlers.handleMouseDown"
    @mouseup="handlers.handleMouseUp"
    v-bind="aria"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ButtonCore } from '../../core/button';
import type { ButtonProps } from './Button.types';

const props = defineProps<ButtonProps>();
const emit = defineEmits<{ click: [] }>();

// State management (Vue refs)
const isHovered = ref(false);
const isFocused = ref(false);
const isActive = ref(false);

// Use core for state determination
const state = computed(() =>
  ButtonCore.determineState(
    props.disabled || false,
    props.loading || false,
    isActive.value,
    isFocused.value,
    isHovered.value
  )
);

// Use core for token resolution
const tokens = computed(() =>
  ButtonCore.resolveTokens(themeTokens, state.value)
);

// Use core for styles
const styles = computed(() =>
  ButtonCore.computeStyles(
    tokens.value,
    props.size || 'md',
    props.fullWidth || false,
    state.value
  )
);

// Use core for ARIA
const aria = computed(() =>
  ButtonCore.generateARIA(
    props.label,
    props.disabled || false,
    props.loading || false,
    props.ariaLabel,
    props.ariaDescribedby
  )
);

// Use core for event handlers
const handlers = ButtonCore.createEventHandlers(
  () => emit('click'),
  props.disabled || false,
  props.loading || false,
  (v) => (isHovered.value = v),
  (v) => (isFocused.value = v),
  (v) => (isActive.value = v)
);
</script>
```

### Svelte Adapter

**File:** `adapters/svelte/Button/Button.svelte`

```svelte
<script lang="ts">
  import { ButtonCore } from '../../core/button';
  import type { ButtonProps } from './Button.types';

  export let label: string;
  export let disabled = false;
  export let loading = false;
  export let size: ButtonSize = 'md';
  export let fullWidth = false;
  export let onClick: (() => void) | undefined = undefined;

  // State management (Svelte reactive)
  let isHovered = false;
  let isFocused = false;
  let isActive = false;

  // Use core for state determination (reactive)
  $: state = ButtonCore.determineState(
    disabled,
    loading,
    isActive,
    isFocused,
    isHovered
  );

  // Use core for token resolution (reactive)
  $: tokens = ButtonCore.resolveTokens(themeTokens, state);

  // Use core for styles (reactive)
  $: styles = ButtonCore.computeStyles(tokens, size, fullWidth, state);

  // Use core for ARIA (reactive)
  $: aria = ButtonCore.generateARIA(label, disabled, loading);

  // Use core for event handlers
  $: handlers = ButtonCore.createEventHandlers(
    onClick,
    disabled,
    loading,
    (v) => (isHovered = v),
    (v) => (isFocused = v),
    (v) => (isActive = v)
  );
</script>

<button
  style={Object.entries(styles)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ')}
  on:click={handlers.handleClick}
  on:mouseenter={handlers.handleMouseEnter}
  on:mouseleave={handlers.handleMouseLeave}
  on:focus={handlers.handleFocus}
  on:blur={handlers.handleBlur}
  on:mousedown={handlers.handleMouseDown}
  on:mouseup={handlers.handleMouseUp}
  {...aria}
>
  {label}
</button>
```

### Angular Adapter

**File:** `adapters/angular/button/button.component.ts`

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonCore } from '../../core/button';
import type { ButtonProps, ButtonState } from './button.types';

@Component({
  selector: 'momoto-button',
  template: `
    <button
      [ngStyle]="styles"
      [attr.aria-label]="aria['aria-label']"
      [attr.aria-disabled]="aria['aria-disabled']"
      (click)="handlers.handleClick($event)"
      (mouseenter)="handlers.handleMouseEnter()"
      (mouseleave)="handlers.handleMouseLeave()"
      (focus)="handlers.handleFocus()"
      (blur)="handlers.handleBlur()"
      (mousedown)="handlers.handleMouseDown()"
      (mouseup)="handlers.handleMouseUp()"
    >
      {{ label }}
    </button>
  `,
  standalone: true,
})
export class ButtonComponent {
  @Input() label!: string;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() size: ButtonSize = 'md';
  @Input() fullWidth = false;
  @Output() clickEvent = new EventEmitter<void>();

  // State management (Angular properties)
  isHovered = false;
  isFocused = false;
  isActive = false;

  // Computed state
  get state(): ButtonState {
    return ButtonCore.determineState(
      this.disabled,
      this.loading,
      this.isActive,
      this.isFocused,
      this.isHovered
    );
  }

  // Computed tokens
  get tokens() {
    return ButtonCore.resolveTokens(themeTokens, this.state);
  }

  // Computed styles
  get styles() {
    return ButtonCore.computeStyles(
      this.tokens,
      this.size,
      this.fullWidth,
      this.state
    );
  }

  // Computed ARIA
  get aria() {
    return ButtonCore.generateARIA(
      this.label,
      this.disabled,
      this.loading
    );
  }

  // Event handlers
  get handlers() {
    return ButtonCore.createEventHandlers(
      () => this.clickEvent.emit(),
      this.disabled,
      this.loading,
      (v) => (this.isHovered = v),
      (v) => (this.isFocused = v),
      (v) => (this.isActive = v)
    );
  }
}
```

---

## Contract Verification

### Verification Checklist

For each framework adapter:

**Token Consumption:**
- [ ] Uses tokens from TokenTheme
- [ ] NO token reinterpretation
- [ ] NO color calculations
- [ ] Colors from `token.value.hex` only

**State Management:**
- [ ] States resolved via core (token selection)
- [ ] NO state calculation (lighten, darken, etc.)
- [ ] Hover/focus/active/disabled from tokens

**Accessibility:**
- [ ] ARIA from core generator
- [ ] WCAG ratios from token metadata
- [ ] NO local contrast calculations

**Behavior:**
- [ ] Event handlers from core
- [ ] Identical behavior across frameworks
- [ ] NO framework-specific logic

### Automated Scans

```bash
# For each adapter directory:

# No color calculations
grep -r "lighten\|darken\|saturate" adapters/{framework}/
# Expected: 0 matches

# No contrast calculations
grep -r "getContrastRatio\|calculateContrast" adapters/{framework}/
# Expected: 0 matches

# No hardcoded colors
grep -r "#[0-9A-Fa-f]\{3,6\}" adapters/{framework}/
# Expected: 0 matches

# No perceptual decisions
grep -r "isDark\|isLight\|isWarm" adapters/{framework}/
# Expected: 0 matches
```

---

## Known Framework Limitations

### React
- ✅ Full support
- ✅ Hooks for state management
- ✅ JSX for rendering

### Vue 3
- ✅ Full support
- ✅ Composition API for state
- ✅ Template syntax
- ⚠️ Style binding syntax different (but functionally identical)

### Svelte
- ✅ Full support
- ✅ Reactive statements for state
- ✅ Template syntax
- ⚠️ Style binding requires string conversion (but functionally identical)

### Angular
- ✅ Full support
- ✅ Class properties for state
- ✅ Template syntax
- ⚠️ Getter-based computed properties (but functionally identical)

**None of these differences require breaking the contract.**

---

## Implementation Plan

### Phase 1: Core Extraction (Week 1)

**Tasks:**
1. Extract core logic from React Button
2. Create `ButtonCore` class
3. Create shared types
4. Test core in isolation

**Files to Create:**
```
adapters/core/button/
├── buttonCore.ts
├── buttonCore.types.ts
├── tokenResolver.ts
├── styleComputer.ts
├── ariaGenerator.ts
└── constants.ts
```

### Phase 2: Framework Adapters (Week 2-3)

**Tasks:**
1. Refactor React Button to use core
2. Implement Vue Button
3. Implement Svelte Button
4. Implement Angular Button

**Files to Create:**
```
adapters/
├── react/Button/Button.tsx
├── vue/Button/Button.vue
├── svelte/Button/Button.svelte
└── angular/button/button.component.ts
```

### Phase 3: Verification (Week 4)

**Tasks:**
1. Test behavioral consistency
2. Run automated scans
3. Document differences
4. Create compliance report

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Frameworks supported** | 4 | React, Vue, Svelte, Angular |
| **Components ported** | 1 (Button) | 100% |
| **Shared core LOC** | ~300 | Core logic extracted |
| **Adapter LOC** | <100 each | Thin wrappers |
| **Logic duplication** | 0% | All in core |
| **Perceptual logic in adapters** | 0 | Code audit |
| **Behavioral differences** | 0 | Test suite |
| **Contract violations** | 0 | Automated scans |

---

## Future Phases

### FASE 14: Governance & Enterprise

**Adapter architecture must support:**
- Quality gates per framework
- Framework-specific linting
- Cross-framework testing

### FASE 15: DevTools & CLI

**Adapter architecture must support:**
- DevTools for all frameworks
- Component inspection
- Token visualization

---

## Conclusion

FASE 13 establishes **multi-framework support** with these guarantees:

✅ **Identical behavior** — All frameworks use same core
✅ **Zero duplication** — Logic shared in core
✅ **Zero intelligence** — All decisions from tokens
✅ **Contract preserved** — No violations

**The architecture scales. The contract remains intact.**

---

**Status:** 📋 PLAN COMPLETE — Ready for implementation
**Next:** Extract core logic from React Button
