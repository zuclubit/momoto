# Getting Started with Momoto

Momoto is a scientific-grade perceptual color infrastructure for Rust. It provides physically-accurate color transformations, accessibility metrics, and material rendering.

## Installation

Add Momoto to your `Cargo.toml`:

```toml
[dependencies]
momoto-core = "6.0"
momoto-metrics = "6.0"         # For accessibility metrics
momoto-intelligence = "6.0"    # For color recommendations
momoto-materials = "6.0"       # For glass physics
```

## Quick Start

### 1. Basic Color Operations

```rust
use momoto_core::color::Color;
use momoto_core::space::oklch::OKLCH;

// Create colors
let blue = Color::from_srgb8(59, 130, 246);
let red = Color::from_hex("#EF4444").unwrap();

// Convert to OKLCH (perceptually uniform)
let oklch = blue.to_oklch();
println!("Lightness: {:.2}", oklch.l);
println!("Chroma: {:.2}", oklch.c);
println!("Hue: {:.2}°", oklch.h);

// Modify colors perceptually
let lighter = oklch.lighten(0.1).to_color();
let more_saturated = oklch.saturate(0.2).to_color();
let shifted_hue = oklch.rotate_hue(30.0).to_color();

// Interpolate between colors
let midpoint = OKLCH::interpolate(&blue.to_oklch(), &red.to_oklch(), 0.5);
```

### 2. Accessibility Metrics

```rust
use momoto_core::color::Color;
use momoto_metrics::{WCAGMetric, APCAMetric, WCAGLevel, TextSize};

let foreground = Color::from_hex("#FFFFFF").unwrap();
let background = Color::from_hex("#3B82F6").unwrap();

// WCAG 2.1 Contrast
let wcag = WCAGMetric::new();
let result = wcag.evaluate(foreground, background);
println!("WCAG Ratio: {:.2}:1", result.contrast);
println!("Passes AA: {}", wcag.passes(result.contrast, WCAGLevel::AA, TextSize::Normal));
println!("Passes AAA: {}", wcag.passes(result.contrast, WCAGLevel::AAA, TextSize::Normal));

// APCA (Advanced Perceptual Contrast)
let apca = APCAMetric::new();
let result = apca.evaluate(foreground, background);
println!("APCA Lc: {:.1}", result.contrast);
```

### 3. Color Recommendations

```rust
use momoto_core::color::Color;
use momoto_intelligence::{
    RecommendationEngine, RecommendationContext, UsageContext, ComplianceTarget
};

let background = Color::from_hex("#1E3A5F").unwrap();
let engine = RecommendationEngine::new();

// Get recommended text color
let context = RecommendationContext::new(UsageContext::BodyText, ComplianceTarget::WCAG_AA);
let recommendation = engine.recommend_foreground(background, context);

println!("Recommended color: {:?}", recommendation.color.to_srgb8());
println!("Confidence: {:.0}%", recommendation.confidence * 100.0);
println!("Reason: {}", recommendation.reason);

// Improve an existing color
let poor_text = Color::from_hex("#6B7280").unwrap();
let improved = engine.improve_foreground(poor_text, background, context);
println!("Improved color: {:?}", improved.color.to_srgb8());
```

### 4. Glass Materials

```rust
use momoto_core::material::GlassMaterial;
use momoto_core::evaluated::MaterialContext;

// Use presets
let clear = GlassMaterial::clear();
let frosted = GlassMaterial::frosted();

// Create custom material
let custom = GlassMaterial::builder()
    .ior(1.52)           // Index of refraction
    .roughness(0.15)     // Surface roughness
    .thickness(2.0)      // mm
    .build();

// Evaluate material
let context = MaterialContext::default();
let evaluated = custom.evaluate(&context);

println!("Opacity: {:.2}", evaluated.opacity);
println!("Has scattering: {}", evaluated.has_scattering());
```

### 5. Advanced Physics (momoto-materials)

```rust
use momoto_materials::{
    fresnel_schlick, blinn_phong_specular,
    ThinFilm, thin_film_to_rgb,
    crown_glass, diamond,
};

// Fresnel reflectance
let cos_theta = 0.7; // Viewing angle cosine
let ior = 1.5;       // Index of refraction
let f0 = fresnel_schlick(cos_theta, ior);
println!("Fresnel reflectance: {:.2}%", f0 * 100.0);

// Specular highlight
let shininess = 64.0;
let light_angle = 45.0_f64.to_radians();
let specular = blinn_phong_specular(light_angle, shininess);
println!("Specular intensity: {:.2}", specular);

// Thin-film interference (soap bubbles, oil slicks)
let film = ThinFilm::new(350.0, 1.33); // 350nm film, n=1.33
let rgb = thin_film_to_rgb(&film, 0.0); // Normal incidence
println!("Thin-film color: RGB({:.0}, {:.0}, {:.0})",
    rgb[0] * 255.0, rgb[1] * 255.0, rgb[2] * 255.0);

// Material presets
let glass = crown_glass();
let gem = diamond();
```

## WebAssembly Usage

### Setup

```bash
wasm-pack build --target web
```

### JavaScript

```javascript
import init, {
  Color, OKLCH, WCAGMetric, APCAMetric,
  GlassMaterial, GlassMaterialBuilder
} from 'momoto-wasm';

await init();

// Color operations
const blue = Color.fromSrgb8(59, 130, 246);
const oklch = blue.toOklch();
console.log(`Lightness: ${oklch.l.toFixed(2)}`);

// Accessibility
const wcag = new WCAGMetric();
const fg = Color.fromHex('#FFFFFF');
const bg = Color.fromHex('#3B82F6');
const result = wcag.evaluate(fg, bg);
console.log(`WCAG Ratio: ${result.contrast.toFixed(2)}:1`);

// Glass materials
const glass = GlassMaterial.frosted();
const scatterMm = glass.scatteringRadiusMm();
const blurPx = scatterMm * (window.devicePixelRatio * 96 / 25.4);
console.log(`Blur: ${blurPx.toFixed(1)}px`);
```

### TypeScript

```typescript
import init, { Color, OKLCH, WCAGMetric } from 'momoto-wasm';
import type { ContrastResult, EvaluatedMaterial } from 'momoto-wasm';

async function main() {
  await init();

  const color: Color = Color.fromHex('#3B82F6');
  const oklch: OKLCH = color.toOklch();

  const metric: WCAGMetric = new WCAGMetric();
  const result: ContrastResult = metric.evaluate(
    Color.fromHex('#FFFFFF'),
    color
  );

  console.log(`Contrast: ${result.contrast}`);
}
```

## Feature Flags

Enable additional capabilities:

```toml
[dependencies]
momoto-materials = { version = "6.0", features = ["physics-full"] }
```

| Feature | Description |
|---------|-------------|
| `physics-full` | All physics modules (thin-film, dispersion, metals, mie, spectral) |
| `gpu` | GPU acceleration via wgpu |
| `research` | Research-grade APIs (differentiable, metrology) |
| `production` | Optimized for production (physics-full + gpu) |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    momoto-wasm                          │
│               (WebAssembly bindings)                    │
├─────────────────────────────────────────────────────────┤
│  momoto-materials  │  momoto-intelligence               │
│  (Glass physics)   │  (Recommendations)                 │
├────────────────────┼────────────────────────────────────┤
│                    │     momoto-metrics                 │
│                    │     (WCAG, APCA)                   │
├────────────────────┴────────────────────────────────────┤
│                     momoto-core                         │
│        (Color, OKLCH, Materials, Backends)              │
└─────────────────────────────────────────────────────────┘
```

## Next Steps

- [API Reference](./api/) - Complete API documentation
- [API Stability Guide](../API_STABILITY.md) - Stability levels for all APIs
- [Migration Guide](./MIGRATION.md) - Upgrading from previous versions
- [Examples](./examples/) - Real-world usage examples

## Support

- GitHub: https://github.com/momoto/momoto
- Issues: https://github.com/momoto/momoto/issues
