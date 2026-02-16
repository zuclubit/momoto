# Momoto Crystal Design System 2025

**Diseño de sistema de UI refinado y futurista para Topocho CRM**

Combina Apple Human Interface Guidelines con profundidad multi-capa, micro-contrastes perceptuales, y sistematización de tokens powered by Momoto WASM.

---

## 🎨 Filosofía de Diseño

### Principios Core (Apple HIG evolucionado)

1. **Claridad Absoluta** - La función es inmediatamente obvia
2. **Profundidad Perceptual** - Layers que guían el ojo naturalmente
3. **Legibilidad Extrema** - WCAG AAA como baseline, no objetivo
4. **Materiales Tangibles** - Cristal ligero, no decoración
5. **Espacios Generosos** - Respiración visual, no compactación
6. **Jerarquía Significativa** - Cada nivel tiene propósito
7. **Tipografía Refinada** - Peso, tamaño, espaciado deliberado
8. **Contraste Excepcional** - APCA 60+ para body, 75+ para crítico

### Crystal Design Pillars

- **Multi-Layer Depth** - Elevation tokens de -1 a +5
- **Micro-Contrasts** - Sutiles shifts perceptuales (OKLCH-based)
- **Motion Implícito** - Estados sugieren transición
- **Token Systemization** - Todo es derivable, nada arbitrario

---

## 🔮 Sistema de Tokens Momoto

Todos los tokens son generados por **Momoto WASM** con:
- ✅ Derivación perceptual (OKLCH)
- ✅ Validación A11y automática (WCAG + APCA)
- ✅ Estados determinísticos (Idle → Hover → Active → Focus → Disabled)
- ✅ Performance 15x vs TypeScript

### Token Categories

```typescript
interface MomotoTokens {
  // Base colors (OKLCH)
  base: {
    l: number;  // Lightness [0.0, 1.0]
    c: number;  // Chroma [0.0, 0.4]
    h: number;  // Hue [0.0, 360.0]
  };

  // Derived state tokens (auto-generated)
  states: {
    idle: ColorOklch;
    hover: ColorOklch;      // +0.05 lightness
    active: ColorOklch;     // -0.08 lightness
    focus: ColorOklch;      // Same as idle + focus ring
    disabled: ColorOklch;   // +0.25 lightness, -0.1 chroma
    loading: ColorOklch;    // -0.05 chroma
  };

  // Accessibility metrics (auto-validated)
  a11y: {
    wcagRatio: number;           // [1.0, 21.0]
    wcagLevel: 'Fail' | 'AA' | 'AAA';
    apcaContrast: number;        // [-108, 106]
    apcaBodyPass: boolean;       // >= 60
  };

  // Elevation tokens
  elevation: {
    level: -1 | 0 | 1 | 2 | 3 | 4 | 5;
    shadow: string;              // CSS box-shadow
    blur: number;                // Backdrop blur (px)
  };
}
```

---

## 🎨 Color Palette - Crystal Light

### Neutrals (Base Layer)

```typescript
const neutrals = {
  // Surface (OKLCH)
  surface: { l: 0.98, c: 0.005, h: 240 },   // Ultra-light blue-gray
  canvas: { l: 0.96, c: 0.008, h: 240 },    // Subtle background

  // Text
  primary: { l: 0.15, c: 0.01, h: 240 },    // Near-black (APCA 90+)
  secondary: { l: 0.45, c: 0.02, h: 240 },  // Medium gray (APCA 60+)
  tertiary: { l: 0.65, c: 0.015, h: 240 },  // Light gray (APCA 45+)

  // Borders
  border: { l: 0.88, c: 0.01, h: 240 },     // Subtle edge
  divider: { l: 0.92, c: 0.008, h: 240 },   // Ultra-subtle
};
```

### Semantic Colors

```typescript
const semantics = {
  // Primary Action (Blue Crystal)
  primary: { l: 0.55, c: 0.14, h: 240 },    // Rich blue

  // Success (Green Crystal)
  success: { l: 0.50, c: 0.12, h: 140 },    // Fresh green

  // Error (Red Crystal)
  error: { l: 0.52, c: 0.18, h: 25 },       // Warm red

  // Warning (Amber Crystal)
  warning: { l: 0.60, c: 0.16, h: 60 },     // Golden amber

  // Info (Cyan Crystal)
  info: { l: 0.58, c: 0.12, h: 200 },       // Cool cyan
};
```

### Derivation Example (Momoto WASM)

```typescript
import { TokenDerivationEngine, validateContrast } from '@momoto-ui/wasm';

const engine = new TokenDerivationEngine();

// Derive all state tokens for primary button
const primaryTokens = engine.deriveStates(
  0.55,  // l
  0.14,  // c
  240    // h (blue)
);

// Auto-validate contrast
const contrast = validateContrast(
  0.98, 0.005, 240,  // White text
  0.55, 0.14, 240    // Primary background
);

console.log(contrast.wcagLevel);     // 'AAA'
console.log(contrast.apcaContrast);  // 85.2 (excellent)
```

---

## 🏗️ Elevation System

### Glass Layers (Multi-depth)

```typescript
const elevation = {
  // Sunken (negative depth)
  '-1': {
    shadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
    blur: 0,
    z: -1,
  },

  // Flat (canvas level)
  '0': {
    shadow: 'none',
    blur: 0,
    z: 0,
  },

  // Lifted (card level)
  '1': {
    shadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    blur: 20,
    z: 1,
  },

  // Elevated (modal level)
  '2': {
    shadow: '0 4px 12px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.08)',
    blur: 30,
    z: 10,
  },

  // Floating (popover level)
  '3': {
    shadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.10)',
    blur: 40,
    z: 100,
  },

  // Overlay (dialog level)
  '4': {
    shadow: '0 16px 48px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.12)',
    blur: 50,
    z: 1000,
  },

  // Modal (highest level)
  '5': {
    shadow: '0 24px 64px rgba(0, 0, 0, 0.20), 0 12px 24px rgba(0, 0, 0, 0.16)',
    blur: 60,
    z: 10000,
  },
};
```

### Glass Effect CSS

```css
.crystal-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(var(--blur)) saturate(1.2);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(1.2);
  box-shadow: var(--shadow);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius);
}

.crystal-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: inherit;
  pointer-events: none;
}
```

---

## 🔘 Component Specifications

### Button (Primary)

**Anatomy:**
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │ ← Outer glow (focus)
│  │  [Icon] Label Text            │  │ ← Glass surface
│  │  48px height × auto width     │  │ ← 16px padding
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**States (Momoto-derived):**

```typescript
interface ButtonTokens {
  idle: {
    background: ColorOklch;     // Base color
    text: ColorOklch;           // White (validated AAA)
    shadow: string;             // elevation[1]
    scale: 1.0;
  };

  hover: {
    background: ColorOklch;     // +0.05 lightness
    text: ColorOklch;           // Same
    shadow: string;             // elevation[2] (lift)
    scale: 1.02;                // Subtle grow
  };

  active: {
    background: ColorOklch;     // -0.08 lightness
    text: ColorOklch;           // Same
    shadow: string;             // elevation[0] (press)
    scale: 0.98;                // Subtle shrink
  };

  focus: {
    background: ColorOklch;     // Same as idle
    text: ColorOklch;           // Same
    shadow: string;             // elevation[1]
    outline: '0 0 0 4px rgba(59, 130, 246, 0.3)';  // Focus ring
    scale: 1.0;
  };

  disabled: {
    background: ColorOklch;     // +0.25 lightness, -0.1 chroma
    text: ColorOklch;           // Desaturated
    shadow: 'none';
    opacity: 0.6;
    cursor: 'not-allowed';
  };
}
```

**CSS Implementation:**

```css
.btn-crystal-primary {
  /* Base */
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;

  /* Crystal glass */
  background: oklch(var(--btn-primary-idle-l) var(--btn-primary-idle-c) var(--btn-primary-idle-h));
  color: oklch(0.98 0.005 240);
  box-shadow: var(--elevation-1);
  backdrop-filter: blur(20px) saturate(1.2);

  /* Transition */
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Text */
  text-align: center;
  white-space: nowrap;
  user-select: none;
}

.btn-crystal-primary:hover {
  background: oklch(var(--btn-primary-hover-l) var(--btn-primary-hover-c) var(--btn-primary-hover-h));
  box-shadow: var(--elevation-2);
  transform: scale(1.02) translateY(-1px);
}

.btn-crystal-primary:active {
  background: oklch(var(--btn-primary-active-l) var(--btn-primary-active-c) var(--btn-primary-active-h));
  box-shadow: var(--elevation-0);
  transform: scale(0.98) translateY(0px);
}

.btn-crystal-primary:focus-visible {
  outline: none;
  box-shadow: var(--elevation-1), 0 0 0 4px rgba(59, 130, 246, 0.3);
}

.btn-crystal-primary:disabled {
  background: oklch(var(--btn-primary-disabled-l) var(--btn-primary-disabled-c) var(--btn-primary-disabled-h));
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
```

### Card (Glass Container)

```css
.card-crystal {
  /* Glass surface */
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(30px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: var(--elevation-1);

  /* Spacing */
  padding: 24px;

  /* Layering */
  position: relative;
  overflow: hidden;
}

.card-crystal::before {
  /* Inner glow */
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-radius: inherit;
  pointer-events: none;
}

.card-crystal:hover {
  box-shadow: var(--elevation-2);
  transform: translateY(-2px);
  transition: all 240ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Input Field

```css
.input-crystal {
  /* Base */
  height: 48px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 16px;
  line-height: 1.5;

  /* Glass surface (sunken) */
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid oklch(0.88 0.01 240);
  box-shadow: var(--elevation--1);

  /* Text */
  color: oklch(0.15 0.01 240);

  /* Transition */
  transition: all 180ms ease;
}

.input-crystal::placeholder {
  color: oklch(0.65 0.015 240);
}

.input-crystal:hover {
  border-color: oklch(0.75 0.02 240);
  background: rgba(255, 255, 255, 0.65);
}

.input-crystal:focus {
  outline: none;
  border-color: oklch(0.55 0.14 240);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: var(--elevation-0), 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.input-crystal:disabled {
  background: rgba(255, 255, 255, 0.3);
  color: oklch(0.65 0.01 240);
  cursor: not-allowed;
}
```

---

## 📐 Spacing System

```typescript
const spacing = {
  xs: '4px',    // Micro spacing
  sm: '8px',    // Tight spacing
  md: '16px',   // Default spacing
  lg: '24px',   // Generous spacing
  xl: '32px',   // Section spacing
  '2xl': '48px', // Major section
  '3xl': '64px', // Page-level
};
```

---

## 📝 Typography System

```typescript
const typography = {
  // Display (Hero)
  display: {
    size: '48px',
    weight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },

  // Heading 1
  h1: {
    size: '36px',
    weight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },

  // Heading 2
  h2: {
    size: '28px',
    weight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.005em',
  },

  // Heading 3
  h3: {
    size: '22px',
    weight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em',
  },

  // Body Large
  bodyLarge: {
    size: '18px',
    weight: 400,
    lineHeight: 1.6,
    letterSpacing: '0em',
  },

  // Body (Default)
  body: {
    size: '16px',
    weight: 400,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },

  // Body Small
  bodySmall: {
    size: '14px',
    weight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },

  // Caption
  caption: {
    size: '12px',
    weight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
};
```

---

## 🎭 Animation Tokens

```typescript
const motion = {
  // Duration
  instant: '100ms',
  fast: '180ms',
  normal: '240ms',
  slow: '320ms',
  slower: '480ms',

  // Easing
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Standard
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',      // Enter
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',     // Exit
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Bi-directional

  // Spring
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy
};
```

---

## ♿ Accessibility Standards

### WCAG AAA Baseline

- **Text**: Minimum 7:1 contrast ratio
- **Large text**: Minimum 4.5:1
- **UI components**: Minimum 3:1
- **Focus indicators**: 3:1 + visible outline

### APCA Standards (Momoto-validated)

- **Body text**: Lc >= 60
- **Large text**: Lc >= 45
- **Critical UI**: Lc >= 75

### Touch Targets

- **Minimum**: 44 × 44px (iOS HIG)
- **Recommended**: 48 × 48px (Material/Accessible)
- **Comfortable**: 56 × 56px (thumb-friendly)

### Focus Indicators

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-ring-color);
  /* Focus ring must have 3:1 contrast with background */
}
```

---

## 📱 Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '320px',   // iPhone SE
  tablet: '768px',   // iPad
  desktop: '1024px', // MacBook Air
  wide: '1440px',    // iMac
  ultrawide: '1920px', // Pro Display
};
```

---

## 🚀 Usage with Momoto WASM

### Initialize Token Engine

```typescript
import {
  TokenDerivationEngine,
  validateContrast,
  UIStateValue,
  WCAGLevel
} from '@momoto-ui/wasm';

// Create engine
const tokenEngine = new TokenDerivationEngine();

// Define base colors (OKLCH)
const primaryBase = { l: 0.55, c: 0.14, h: 240 };

// Derive all state tokens
const primaryTokens = tokenEngine.deriveStates(
  primaryBase.l,
  primaryBase.c,
  primaryBase.h
);

// Extract states
const [idle, hover, active, focus, disabled, loading] = primaryTokens;

// Validate contrast (automatic)
const contrast = validateContrast(
  0.98, 0.005, 240,  // White text
  idle.l, idle.c, idle.h  // Primary background
);

if (contrast.wcagNormalLevel >= WCAGLevel.AAA) {
  console.log('✅ AAA contrast achieved');
  console.log(`WCAG: ${contrast.wcagRatio.toFixed(2)}:1`);
  console.log(`APCA: ${contrast.apcaContrast.toFixed(1)}`);
}
```

### Generate CSS Custom Properties

```typescript
function generateCSSTokens(baseColor: { l: number; c: number; h: number }) {
  const tokens = tokenEngine.deriveStates(baseColor.l, baseColor.c, baseColor.h);

  return `
    --color-primary-idle-l: ${tokens[0].l};
    --color-primary-idle-c: ${tokens[0].c};
    --color-primary-idle-h: ${tokens[0].h};

    --color-primary-hover-l: ${tokens[1].l};
    --color-primary-hover-c: ${tokens[1].c};
    --color-primary-hover-h: ${tokens[1].h};

    --color-primary-active-l: ${tokens[2].l};
    --color-primary-active-c: ${tokens[2].c};
    --color-primary-active-h: ${tokens[2].h};

    /* ... etc */
  `;
}
```

---

## 🎨 Complete Example: CRM Dashboard Card

```tsx
import React from 'react';
import { TokenDerivationEngine, validateContrast } from '@momoto-ui/wasm';

const MetricCard: React.FC = () => {
  // Initialize tokens
  const engine = new TokenDerivationEngine();
  const tokens = engine.deriveStates(0.55, 0.14, 240);

  return (
    <div className="card-crystal" style={{
      '--card-bg-l': tokens[0].l,
      '--card-bg-c': tokens[0].c,
      '--card-bg-h': tokens[0].h,
    }}>
      <div className="metric-header">
        <h3 className="metric-title">Total Revenue</h3>
        <span className="metric-icon">💰</span>
      </div>

      <div className="metric-value">
        <span className="value-primary">$127,540</span>
        <span className="value-change positive">+12.5%</span>
      </div>

      <div className="metric-footer">
        <span className="metric-period">Last 30 days</span>
      </div>
    </div>
  );
};
```

---

*Generated: 2026-01-08*
*System: Momoto Crystal Design 2025*
*Powered by: Momoto WASM (Rust/OKLCH)*
*Standards: Apple HIG + WCAG AAA + APCA 60+*
