# Momoto Design System - API Reference

## Version: 1.0.0-rc1
## Date: 2026-01-31
## Status: Production Ready (P6-DOC)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Tiers](#api-tiers)
3. [momoto-ui-core](#momoto-ui-core)
4. [momoto-core](#momoto-core)
5. [momoto-materials](#momoto-materials)
6. [momoto-metrics](#momoto-metrics)
7. [momoto-wasm](#momoto-wasm)
8. [Stability Guarantees](#stability-guarantees)

---

## Architecture Overview

Momoto follows a hybrid Rust/TypeScript architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                     TypeScript Layer                             │
│  (React Components, CSS Adapters, Framework Integration)        │
└───────────────────────────────┬─────────────────────────────────┘
                                │ WASM Bridge
┌───────────────────────────────▼─────────────────────────────────┐
│                      Rust/WASM Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ momoto-ui-core  │  │  momoto-core    │  │ momoto-materials │  │
│  │ (State, Tokens) │  │ (Color, Space)  │  │ (Glass, Physics) │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ momoto-metrics  │  │  momoto-wasm    │                       │
│  │ (WCAG, APCA)    │  │ (JS Bindings)   │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Tiers

### Tier 1: Public Stable

**Stability**: SemVer guaranteed. Breaking changes require major version bump.

| API | Crate | Description |
|-----|-------|-------------|
| `ColorOklch` | momoto-ui-core | OKLCH color representation |
| `UIState` | momoto-ui-core | Interaction state machine |
| `ContrastLevel` | momoto-ui-core | WCAG conformance levels |
| `validate_contrast()` | momoto-ui-core | Accessibility validation |
| `Color` | momoto-core | RGB/sRGB color type |
| `OKLCH` | momoto-core | OKLCH color space |
| `WCAGMetric` | momoto-metrics | WCAG 2.1 contrast |
| `APCAMetric` | momoto-metrics | APCA-W3 contrast |

### Tier 2: Advanced/Expert

**Stability**: SemVer for signatures. Internal behavior may improve.

| API | Crate | Description |
|-----|-------|-------------|
| `TokenDerivationEngine` | momoto-ui-core | Token generation engine |
| `LiquidGlass` | momoto-materials | Glass material system |
| `GlassPhysics` | momoto-materials | Physical light simulation |
| `TransferMatrixFilm` | momoto-materials | Multilayer thin-film |
| `SpectralPipeline` | momoto-materials | Unified spectral processing |
| `MieLUT` | momoto-materials | Mie scattering tables |

### Tier 3: Internal

**Stability**: No guarantees. Use at own risk.

| API | Crate | Description |
|-----|-------|-------------|
| Transformation matrices | momoto-ui-core | RGB_TO_LMS, LMS_TO_LAB |
| `srgb_to_linear()` | momoto-ui-core | Gamma correction internals |
| `CpuBackend` | momoto-core | Backend implementation |
| Perlin noise generators | momoto-materials | Procedural effects |

---

## momoto-ui-core

Primary WASM-compiled crate for UI component logic.

### ColorOklch

```rust
#[wasm_bindgen]
pub struct ColorOklch {
    pub l: f64,  // Lightness [0.0, 1.0]
    pub c: f64,  // Chroma [0.0, 0.4]
    pub h: f64,  // Hue [0.0, 360.0]
}
```

#### Constructor

```typescript
// TypeScript (via WASM)
const color = new ColorOklch(0.5, 0.15, 220.0);
```

```rust
// Rust
let color = ColorOklch::new(0.5, 0.15, 220.0)?;
```

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `new` | `(l, c, h) -> Result<Self>` | Create with validation |
| `from_hex` | `(hex: &str) -> Result<Self>` | Parse hex string |
| `to_hex` | `() -> String` | Convert to hex |
| `shift_lightness` | `(delta: f64) -> Self` | Adjust L (clamped) |
| `shift_chroma` | `(delta: f64) -> Self` | Adjust C (clamped) |
| `rotate_hue` | `(degrees: f64) -> Self` | Rotate H (wrapped) |
| `to_linear_rgb` | `() -> (f64, f64, f64)` | Get linear RGB |

#### Scientific Guarantees

- **Conversion accuracy**: < 0.1% error (validated P4/P5-FT)
- **Roundtrip stability**: ±2 after 1000 iterations
- **Algorithm**: Björn Ottosson (https://bottosson.github.io/posts/oklab/)

---

### UIState

```rust
#[wasm_bindgen]
#[repr(u8)]
pub enum UIState {
    Idle = 0,
    Hover = 1,
    Active = 2,
    Focus = 3,
    Disabled = 4,
    Loading = 5,
    Error = 6,
    Success = 7,
}
```

#### Priority Resolution

| State | Priority | Lightness Shift | Chroma Shift |
|-------|----------|-----------------|--------------|
| Disabled | 100 | +0.20 | -0.10 |
| Loading | 90 | 0.00 | -0.05 |
| Error | 80 | 0.00 | +0.10 |
| Success | 75 | 0.00 | +0.05 |
| Active | 60 | -0.08 | +0.03 |
| Focus | 50 | 0.00 | 0.00 |
| Hover | 40 | +0.05 | +0.02 |
| Idle | 0 | 0.00 | 0.00 |

#### Functions

```typescript
// Determine state from flags
const state = determine_ui_state(disabled, loading, active, focused, hovered);

// Get perceptual metadata
const meta = get_state_metadata(state);
```

---

### Accessibility (a11y)

#### Constants

```rust
pub const WCAG_AA_NORMAL: f64 = 4.5;
pub const WCAG_AA_LARGE: f64 = 3.0;
pub const WCAG_AAA_NORMAL: f64 = 7.0;
pub const WCAG_AAA_LARGE: f64 = 4.5;
pub const APCA_MIN_BODY: f64 = 60.0;
pub const APCA_MIN_LARGE: f64 = 45.0;
```

#### Functions

```typescript
// Validate contrast between colors
const result: ContrastResult = validate_contrast(foreground, background);

// Check specific WCAG level
const passes: boolean = passes_wcag_aa(foreground, background, isLargeText);

// Batch validation
const results: ContrastResult[] = batch_validate_contrast(pairs);
```

#### ContrastResult

```typescript
interface ContrastResult {
    wcag_ratio(): number;        // WCAG 2.1 ratio
    apca_contrast(): number;     // APCA Lc value
    wcag_normal_level(): number; // 0=Fail, 1=AA, 2=AAA
    wcag_large_level(): number;  // 0=Fail, 1=AA, 2=AAA
    apca_body_pass(): boolean;   // Passes APCA for body text
    apca_large_pass(): boolean;  // Passes APCA for large text
}
```

---

## momoto-core

Foundational color science library.

### Color

```rust
pub struct Color {
    pub r: f64,  // Red [0.0, 1.0]
    pub g: f64,  // Green [0.0, 1.0]
    pub b: f64,  // Blue [0.0, 1.0]
    pub a: f64,  // Alpha [0.0, 1.0]
}
```

#### Factory Methods

```rust
Color::from_srgb8(255, 128, 0)     // From 8-bit sRGB
Color::from_linear(0.5, 0.2, 0.0)  // From linear RGB
Color::from_hex("#FF8000")         // From hex string
```

### OKLCH

```rust
pub struct OKLCH {
    pub l: f64,  // Lightness [0.0, 1.0]
    pub c: f64,  // Chroma [0.0, ~0.4]
    pub h: f64,  // Hue [0.0, 360.0)
}
```

#### Conversion

```rust
let color = Color::from_srgb8(255, 0, 0);
let oklch = OKLCH::from_color(&color);
let back = oklch.to_color();
```

---

## momoto-materials

Advanced material and glass effects.

### LiquidGlass

```rust
pub struct LiquidGlass {
    variant: GlassVariant,
    properties: GlassProperties,
}

pub enum GlassVariant {
    Regular,      // Standard translucent
    Frosted,      // Diffuse scattering
    Tinted,       // Color-tinted
    Premium,      // Multi-layer
}
```

#### Usage

```rust
use momoto_materials::glass::{LiquidGlass, GlassVariant};

let glass = LiquidGlass::new(GlassVariant::Regular);
let text_color = glass.recommend_text_color(background, is_dark_mode);
```

### Glass Physics (Expert API)

```rust
use momoto_materials::glass_physics::{
    transmittance::{OpticalProperties, calculate_multi_layer_transmittance},
    light_model::{LightingEnvironment, derive_gradient},
};

// Physical transmittance
let optical = OpticalProperties::default();
let layers = calculate_multi_layer_transmittance(&optical, thickness);

// Physics-based gradients
let env = LightingEnvironment::default();
let gradient = derive_gradient(&env, altitude, elevation, steps);
```

### Thin-Film Interference

```rust
use momoto_materials::glass_physics::thin_film::{
    ThinFilm, thin_film_to_rgb, to_css_soap_bubble,
};

// Calculate iridescent color
let film = ThinFilm::soap_bubble(350.0);  // 350nm thickness
let rgb = thin_film_to_rgb(&film, viewing_angle);
let css = to_css_soap_bubble(&film);
```

---

## momoto-metrics

Contrast metric implementations.

### WCAGMetric

```rust
use momoto_metrics::{WCAGMetric, WCAGLevel, TextSize};

let metric = WCAGMetric::new();
let result = metric.evaluate(foreground, background);

// Check conformance
let passes = result.passes(WCAGLevel::AA, TextSize::Normal);
```

### APCAMetric

```rust
use momoto_metrics::APCAMetric;

let metric = APCAMetric::new();
let lc = metric.evaluate(text_color, background);

// APCA thresholds
// Lc >= 60: Body text
// Lc >= 45: Large text (18px+)
// Lc >= 30: Non-essential text
```

---

## momoto-wasm

JavaScript/TypeScript bindings for browser use.

### Initialization

```typescript
import init, { ColorOklch, WCAGMetric, APCAMetric } from '@momoto-ui/wasm';

await init();  // Load WASM module
```

### Batch Operations

```typescript
// Batch evaluation is 5-10x faster for multiple colors
const foregrounds = colors.map(c => ColorOklch.fromHex(c.fg));
const backgrounds = colors.map(c => ColorOklch.fromHex(c.bg));

const metric = new WCAGMetric();
const results = metric.evaluate_batch(foregrounds, backgrounds);
```

---

## Stability Guarantees

### Semantic Versioning

Momoto follows strict SemVer:

- **MAJOR**: Breaking API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, performance improvements

### Deprecation Policy

1. Deprecated APIs remain functional for 2 minor versions
2. Deprecation warnings in documentation and compiler
3. Migration guide provided before removal

### Scientific Contracts

The following guarantees are **locked** and tested:

| Contract | Guarantee | Test |
|----------|-----------|------|
| OKLCH L error | < 1% | `test_lightness_error_tolerance` |
| Roundtrip stability | ±2/1000 iter | `stress_roundtrip_1000_iterations` |
| Gamma correction | IEC 61966-2-1 | `test_gamma_correction` |
| WCAG luminance | W3C spec | `test_wcag_black_white` |
| State priority | O(1) | `test_state_priority` |

---

## Quick Reference

### Import Patterns

```typescript
// TypeScript (React)
import { useColorTokens, useUIState } from '@momoto-ui/react';

// TypeScript (Direct WASM)
import { ColorOklch, validate_contrast } from '@momoto-ui/wasm';

// Rust
use momoto_ui_core::{ColorOklch, UIState, validate_contrast};
use momoto_core::{Color, OKLCH};
use momoto_metrics::{WCAGMetric, APCAMetric};
```

### Common Patterns

```typescript
// Token derivation
const base = ColorOklch.fromHex('#3B82F6');
const hover = base.shift_lightness(0.05).shift_chroma(0.02);
const active = base.shift_lightness(-0.08).shift_chroma(0.03);

// Accessibility check
const result = validate_contrast(text, background);
if (result.wcag_normal_level() < 1) {
    console.warn('Contrast too low for normal text');
}

// State resolution
const state = determine_ui_state(disabled, loading, active, focused, hovered);
const meta = get_state_metadata(state);
const adjusted = base.shift_lightness(meta.lightness_shift);
```

---

*Generated by P6-DOC Documentation Phase*
*Momoto Design System - 2026-01-31*
