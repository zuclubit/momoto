# Momoto Design System - Integration Guide

## Framework Integration and Migration Documentation

**Version**: 1.0.0-rc1
**Date**: 2026-01-31
**Status**: Production Ready

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [React Integration](#react-integration)
3. [CSS Variables Adapter](#css-variables-adapter)
4. [Tailwind Integration](#tailwind-integration)
5. [WASM Direct Usage](#wasm-direct-usage)
6. [Migration from Other Systems](#migration-from-other-systems)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

---

## 1. Quick Start

### Installation

```bash
# Core package (includes WASM)
npm install @momoto-ui/core

# React bindings
npm install @momoto-ui/react

# CSS adapter
npm install @momoto-ui/css

# Tailwind plugin
npm install @momoto-ui/tailwind
```

### Basic Usage

```typescript
import { ColorOklch, validate_contrast } from '@momoto-ui/core';

// Create a color
const primary = ColorOklch.fromHex('#3B82F6');

// Derive state variants
const hover = primary.shift_lightness(0.05);
const active = primary.shift_lightness(-0.08);

// Validate accessibility
const result = validate_contrast(primary, ColorOklch.fromHex('#FFFFFF'));
console.log(`Contrast ratio: ${result.wcag_ratio()}`);
```

---

## 2. React Integration

### Provider Setup

Wrap your app with `MomotoProvider`:

```tsx
import { MomotoProvider } from '@momoto-ui/react';

function App() {
  return (
    <MomotoProvider
      theme={{
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#FFFFFF',
        surface: '#F3F4F6',
      }}
      darkMode={false}
    >
      <YourApp />
    </MomotoProvider>
  );
}
```

### Using Color Tokens

```tsx
import { useColorTokens } from '@momoto-ui/react';

function Button({ children }) {
  const tokens = useColorTokens('primary');

  return (
    <button
      style={{
        backgroundColor: tokens.idle,
        color: tokens.text,
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = tokens.hover}
      onMouseLeave={(e) => e.target.style.backgroundColor = tokens.idle}
    >
      {children}
    </button>
  );
}
```

### Using UIState

```tsx
import { useUIState } from '@momoto-ui/react';

function InteractiveButton({ disabled, loading, children }) {
  const {
    state,
    stateProps,      // Spread on element
    stateStyles,     // CSS styles for current state
  } = useUIState({ disabled, loading });

  return (
    <button
      {...stateProps}
      style={stateStyles}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

### Accessibility Hook

```tsx
import { useAccessibility } from '@momoto-ui/react';

function TextOnBackground({ text, background }) {
  const {
    contrast,
    wcagLevel,
    suggestions,
  } = useAccessibility(text, background);

  if (wcagLevel === 'Fail') {
    console.warn('Contrast too low!', suggestions);
  }

  return <Text color={text}>{children}</Text>;
}
```

---

## 3. CSS Variables Adapter

### Generate CSS Custom Properties

```typescript
import { CssVariablesAdapter } from '@momoto-ui/css';

const adapter = new CssVariablesAdapter({
  prefix: 'momoto',
  format: 'oklch', // or 'hex', 'rgb'
});

const css = adapter.generate({
  primary: '#3B82F6',
  secondary: '#10B981',
});

// Output:
// :root {
//   --momoto-primary-idle: oklch(0.592 0.157 254.1);
//   --momoto-primary-hover: oklch(0.642 0.177 254.1);
//   --momoto-primary-active: oklch(0.512 0.187 254.1);
//   ...
// }
```

### Dark Mode Support

```typescript
const css = adapter.generate({
  primary: '#3B82F6',
}, {
  darkMode: true,
  selector: '.dark',
});

// Output:
// :root { ... light tokens ... }
// .dark { ... dark tokens ... }
```

### Using in HTML/CSS

```html
<style>
  .button {
    background-color: var(--momoto-primary-idle);
    color: var(--momoto-primary-text);
  }

  .button:hover {
    background-color: var(--momoto-primary-hover);
  }

  .button:active {
    background-color: var(--momoto-primary-active);
  }

  .button:disabled {
    background-color: var(--momoto-primary-disabled);
    opacity: var(--momoto-primary-disabled-opacity);
  }
</style>
```

---

## 4. Tailwind Integration

### Plugin Setup

```javascript
// tailwind.config.js
const momoto = require('@momoto-ui/tailwind');

module.exports = {
  plugins: [
    momoto({
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
      },
      // Generate state variants automatically
      states: true,
      // Enable dark mode tokens
      darkMode: 'class',
    }),
  ],
};
```

### Using Classes

```html
<!-- Base color -->
<button class="bg-primary text-primary-contrast">
  Click me
</button>

<!-- State variants -->
<button class="bg-primary hover:bg-primary-hover active:bg-primary-active">
  Interactive
</button>

<!-- Semantic states -->
<button class="bg-primary disabled:bg-primary-disabled" disabled>
  Disabled
</button>

<!-- Dark mode -->
<button class="bg-primary dark:bg-primary-dark">
  Theme Aware
</button>
```

### Custom Utilities

```javascript
// tailwind.config.js
momoto({
  utilities: {
    // Generate glass effect utilities
    glass: true,
    // Generate elevation utilities
    elevation: true,
  },
});
```

```html
<!-- Glass effect -->
<div class="glass-regular backdrop-blur-md">
  Glassmorphism card
</div>

<!-- Elevation shadows -->
<div class="elevation-2">
  Elevated card
</div>
```

---

## 5. WASM Direct Usage

### Loading the Module

```typescript
import init, { ColorOklch, WCAGMetric } from '@momoto-ui/wasm';

// Initialize WASM (required once)
await init();

// Now use the APIs
const color = ColorOklch.fromHex('#FF5733');
```

### Batch Operations

For better performance with many colors:

```typescript
import { batch_validate_contrast, batch_derive_tokens } from '@momoto-ui/wasm';

// Prepare arrays
const foregrounds = colors.map(c => ColorOklch.fromHex(c.fg));
const backgrounds = colors.map(c => ColorOklch.fromHex(c.bg));

// Batch process (5-10x faster than individual calls)
const results = batch_validate_contrast(foregrounds, backgrounds);

// Process results
results.forEach((result, i) => {
  if (result.wcag_normal_level() < 1) {
    console.warn(`Color pair ${i} fails WCAG AA`);
  }
});
```

### Worker Thread Usage

For heavy computations, use a Web Worker:

```typescript
// worker.ts
import init, { TokenDerivationEngine } from '@momoto-ui/wasm';

await init();

const engine = new TokenDerivationEngine();

self.onmessage = (e) => {
  const { colors } = e.data;
  const tokens = colors.map(c => engine.derive_states(c.l, c.c, c.h));
  self.postMessage({ tokens });
};
```

```typescript
// main.ts
const worker = new Worker('./worker.ts', { type: 'module' });

worker.postMessage({ colors: myColors });
worker.onmessage = (e) => {
  console.log('Tokens:', e.data.tokens);
};
```

---

## 6. Migration from Other Systems

### From Material Design

```typescript
// Material Design uses HSL-based elevation
// Momoto uses perceptually uniform OKLCH

// Before (Material)
const surfaceColor = `hsl(${hue}, ${sat}%, ${lightness + elevation * 2}%)`;

// After (Momoto)
const base = ColorOklch.fromHex(surfaceHex);
const elevated = base.shift_lightness(elevation * 0.03);
```

### From Chakra UI

```typescript
// Chakra uses 50-900 color scales
// Momoto derives from a single base color

// Before (Chakra)
const colors = {
  blue: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    // ...
    900: '#1A365D',
  }
};

// After (Momoto)
import { generateScale } from '@momoto-ui/core';

const blueScale = generateScale('#3B82F6', {
  steps: 10,
  lightnessRange: [0.95, 0.20],
});
```

### From Tailwind Colors

```typescript
// Tailwind colors map directly
const tailwindToMomoto = {
  'blue-500': '#3B82F6',
  'green-500': '#10B981',
  // ...
};

// Use the Tailwind plugin for seamless integration
```

---

## 7. Performance Optimization

### Memoization

Token derivation is memoized internally:

```typescript
const engine = new TokenDerivationEngine();

// First call: computes tokens
const tokens1 = engine.derive_states(0.5, 0.15, 220);

// Second call with same params: returns cached result
const tokens2 = engine.derive_states(0.5, 0.15, 220);
// tokens1 === tokens2 (same reference)
```

### Lazy Loading

Load WASM only when needed:

```typescript
let wasmModule = null;

async function getColorUtils() {
  if (!wasmModule) {
    const { default: init, ColorOklch } = await import('@momoto-ui/wasm');
    await init();
    wasmModule = { ColorOklch };
  }
  return wasmModule;
}

// Use when needed
const { ColorOklch } = await getColorUtils();
```

### SSR Considerations

For server-side rendering, WASM must be loaded differently:

```typescript
// Next.js example
import dynamic from 'next/dynamic';

const ColorPicker = dynamic(
  () => import('./ColorPicker'),
  { ssr: false } // WASM only works client-side
);
```

Or use the pure-JS fallback:

```typescript
import { ColorOklchJS } from '@momoto-ui/core/fallback';

// Same API, but pure JavaScript (slower, SSR-compatible)
const color = ColorOklchJS.fromHex('#3B82F6');
```

---

## 8. Troubleshooting

### WASM Not Loading

**Error**: `WebAssembly.instantiate(): Out of bounds memory access`

**Solution**: Ensure you call `init()` before using any WASM functions:

```typescript
import init, { ColorOklch } from '@momoto-ui/wasm';

// WRONG
const color = ColorOklch.fromHex('#FF0000'); // Crashes!

// CORRECT
await init();
const color = ColorOklch.fromHex('#FF0000'); // Works
```

### Colors Look Different

**Issue**: Colors don't match expected values

**Check**:
1. Are you using the correct color space?
2. Is the browser in P3 color mode?

```typescript
// Force sRGB output for consistency
const hex = color.to_hex(); // Always sRGB
```

### Contrast Validation Fails Unexpectedly

**Issue**: WCAG validation gives different results than other tools

**Reason**: Momoto uses scientifically correct OKLCH→RGB conversion

```typescript
// Verify the colors are what you expect
console.log(color.to_hex());
console.log(`L: ${color.l}, C: ${color.c}, H: ${color.h}`);

// Check the relative luminance
const luminance = color.to_linear_rgb();
console.log('Linear RGB:', luminance);
```

### Build Errors

**Error**: `Cannot find module '@momoto-ui/wasm'`

**Solution**: Ensure your bundler supports WASM:

```javascript
// vite.config.js
export default {
  optimizeDeps: {
    exclude: ['@momoto-ui/wasm'],
  },
};
```

```javascript
// webpack.config.js
module.exports = {
  experiments: {
    asyncWebAssembly: true,
  },
};
```

### Memory Leaks

**Issue**: Memory grows over time

**Cause**: WASM objects not being freed

**Solution**: Use object pools for high-frequency operations:

```typescript
// Create once, reuse
const reusableColor = ColorOklch.new(0, 0, 0);

function processColors(hexCodes) {
  return hexCodes.map(hex => {
    // Don't create new objects in loops if possible
    const parsed = ColorOklch.fromHex(hex);
    const result = parsed.to_hex();
    // parsed is garbage collected when scope ends
    return result;
  });
}
```

---

## Appendix: API Quick Reference

### ColorOklch

| Method | Returns | Description |
|--------|---------|-------------|
| `new(l, c, h)` | `ColorOklch` | Create with validation |
| `fromHex(hex)` | `ColorOklch` | Parse hex string |
| `to_hex()` | `string` | Convert to hex |
| `shift_lightness(delta)` | `ColorOklch` | Adjust lightness |
| `shift_chroma(delta)` | `ColorOklch` | Adjust chroma |
| `rotate_hue(degrees)` | `ColorOklch` | Rotate hue |

### validate_contrast

```typescript
function validate_contrast(
  foreground: ColorOklch,
  background: ColorOklch
): ContrastResult;
```

### ContrastResult

| Property | Type | Description |
|----------|------|-------------|
| `wcag_ratio()` | `number` | WCAG 2.1 ratio |
| `apca_contrast()` | `number` | APCA Lc value |
| `wcag_normal_level()` | `0\|1\|2` | Fail/AA/AAA for normal text |
| `wcag_large_level()` | `0\|1\|2` | Fail/AA/AAA for large text |
| `apca_body_pass()` | `boolean` | Passes for body text |
| `apca_large_pass()` | `boolean` | Passes for large text |

---

*Generated by P6-DOC Documentation Phase*
*Momoto Design System - 2026-01-31*
