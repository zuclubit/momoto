# Momoto Engine — Implementation Examples

Complete, working examples for every supported environment.

## JavaScript / TypeScript

| Directory | Runtime | Key APIs |
|-----------|---------|----------|
| [`vanilla-js/`](./vanilla-js/) | Browser (ES Modules) | All WASM APIs via esm.sh |
| [`node/`](./node/) | Node.js 18+ | Server-side audit, HTTP endpoint |
| [`react/`](./react/) | React 18 | Hooks, Suspense, HCT palette component |
| [`vue/`](./vue/) | Vue 3 Composition API | Composables, reactive contrast |
| [`angular/`](./angular/) | Angular 17+ Standalone | Injectable service, signals |
| [`svelte/`](./svelte/) | Svelte 4 / SvelteKit | Stores, onMount WASM init |

## Native / Mobile

| Directory | Runtime | Integration |
|-----------|---------|-------------|
| [`flutter/`](./flutter/) | Flutter 3.x / Dart | `momoto_flutter` package (flutter_rust_bridge FFI + WASM web) |
| [`swift/`](./swift/) | iOS 16+ / macOS 13+ | WKWebView bridge → WASM (Phase 1); UniFFI planned (Phase 2) |

## Plugins

| Package | System | What it does |
|---------|--------|--------------|
| [`@momoto-ui/tailwind`](../packages/momoto-tailwind/) | Tailwind CSS | HCT tonal scales, accessible color utilities |
| [`@momoto-ui/vite`](../packages/momoto-vite/) | Vite | Dev-time audit, `virtual:momoto-theme`, HMR |
| [`@momoto-ui/webpack`](../packages/momoto-webpack/) | Webpack 5 | WASM asset rules, build-time audit, CSS injection |
| [`@momoto-ui/figma`](../packages/momoto-figma/) | Figma Plugin | Audit, HCT palettes, CVD preview, token export |

---

## Quick Start — JavaScript

```bash
# From npm (published)
npm install momoto-wasm

# From monorepo (dev)
npm install  # workspaces resolve @momoto-ui/wasm automatically
```

All JS/TS examples follow the same initialization pattern:

```js
import init, { Color, wcagContrastRatio, apcaContrast } from 'momoto-wasm'
await init()  // load WASM binary once per session

const fg = Color.fromHex('#6188d8')
const bg = Color.fromHex('#07070e')
const ratio = wcagContrastRatio(fg, bg)    // → 6.82 (WCAG ratio)
const lc    = Math.abs(apcaContrast(fg, bg)) // → ~82 Lc (APCA)
```

## Quick Start — Flutter

```yaml
# pubspec.yaml
dependencies:
  momoto_flutter:
    path: ../../packages/momoto-flutter
```

```dart
import 'package:momoto_flutter/momoto_flutter.dart';

final engine = await MomotoEngine.instance;
final result = await engine.validateContrast('#6188d8', '#07070e');
print('${result.wcagRatio.toStringAsFixed(2)}:1 — ${result.wcagLevel}');

// HCT tonal palette for Material Design 3
final palette = await engine.generatePalette('#3a7bd5');
final theme = MomotoTheme.fromPalette(palette, brightness: Brightness.dark);
MaterialApp(theme: theme, ...)
```

## Quick Start — Swift / iOS

```swift
// MomotoEngine uses WKWebView + momoto-wasm WASM under the hood
let engine = MomotoEngine.shared
let ratio  = try await engine.wcagContrastRatio(fg: "#6188d8", bg: "#07070e")
let rec    = try await engine.recommendForeground(bg: "#07070e")
print("Ratio: \(ratio), Recommended FG: \(rec)")
```

## Quick Start — Tailwind Plugin

```js
// tailwind.config.js
const { momotoTailwind } = require('@momoto-ui/tailwind')

module.exports = {
  plugins: [
    momotoTailwind({
      colors: { primary: '#3a7bd5', brand: '#e05555' }
    })
  ]
}
// → Generates: text-primary-500, bg-brand-200, etc. with HCT tonal scales
```

## Quick Start — Vite Plugin

```ts
// vite.config.ts
import { momotoPlugin } from '@momoto-ui/vite'

export default defineConfig({
  plugins: [
    momotoPlugin({
      themeBaseColor: '#3a7bd5',
      tokens: { body: ['#e8eaf6', '#07070e'] },
      validateAccessibility: true,
    })
  ]
})
// In your CSS: import 'virtual:momoto-theme'
```

## Quick Start — Webpack Plugin

```js
// webpack.config.js
const { MomotoWebpackPlugin } = require('@momoto-ui/webpack')

module.exports = {
  plugins: [
    new MomotoWebpackPlugin({
      themeBaseColor: '#3a7bd5',
      tokens:         { body: ['#e8eaf6', '#07070e'] },
      injectCssVars:  true,
    })
  ]
}
```

## Quick Start — Figma Plugin

1. In Figma: **Plugins → Development → Import plugin from manifest**
2. Select `packages/momoto-figma/manifest.json`
3. Build first: `cd packages/momoto-figma && npm run build`
4. Features: Audit layers, generate HCT palettes, CVD simulation, export tokens

---

## Key Physics Constants (engine reference)

| Constant | Value | Where used |
|----------|-------|-----------|
| D65 white | (0.9505, 1.0, 1.089) XYZ | HCT, CAM16, CVD |
| WCAG threshold AA | 4.5:1 | wcagPasses() |
| APCA threshold body | 75 Lc | apcaContrast() |
| Visible light | 380–780 nm | SpectralPipeline |

All engines — WASM, Flutter FFI, Swift bridge — expose the same logical API.
