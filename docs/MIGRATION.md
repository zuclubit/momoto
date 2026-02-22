# Migration Guide: blur_px → scattering_radius_mm

**Version:** 5.0.0 → 6.0.0
**Timeline:** v5.0 (January 2026) → v6.0 (June 2026)
**Breaking Changes:** Yes (with backward compatibility in v5.x)

---

## Overview

Momoto v5.0 replaces **rendering-specific units** (pixels) with **physical units** (millimeters) to enable true backend-agnostic design.

**What Changed:**

| Old (Deprecated) | New (Recommended) | Unit |
|------------------|-------------------|------|
| `blur_px` | `scattering_radius_mm` | px → mm |
| `blur_amount()` | `scattering_radius_mm()` | px → mm |
| `has_blur()` | `has_scattering()` | boolean |

**Why?**

- ✅ **Backend-agnostic**: Same material works with CSS, WebGPU, Print, Native
- ✅ **Physics-based**: Millimeters have physical meaning (scattering distance)
- ✅ **Future-proof**: Print/Vector backends use mm natively (no conversion)

**See:** [ADR-004: Physical Units in EvaluatedMaterial](./architecture/ADR-004-physical-units-in-evaluated-material.md)

---

## Timeline

### v5.0 (January 2026) - Current

**Status:** Both APIs work, old API deprecated

```rust
let evaluated = glass.evaluate(&context);

// ✅ New API (recommended)
let scatter_mm = evaluated.scattering_radius_mm;

// ⚠️ Old API (deprecated, still works)
#[allow(deprecated)]
let blur_px = evaluated.blur_px;
```

**No action required** - Your code continues to work with deprecation warnings.

---

### v5.x (January - June 2026) - Transition Period

**Recommended Actions:**

1. Update to new API at your own pace
2. Test with both APIs to ensure correctness
3. Fix deprecation warnings before v6.0

**Deprecation Warnings:**

```bash
warning: use of deprecated field `momoto_core::evaluated::EvaluatedMaterial::blur_px`:
         Use `scattering_radius_mm` instead. Convert to pixels in your renderer.
```

---

### v6.0 (June 2026) - Breaking Change

**Status:** Old API removed, only new API works

**Action Required:** Migrate to `scattering_radius_mm` before upgrading to v6.0.

```rust
// ❌ This will NOT compile in v6.0
let blur_px = evaluated.blur_px;  // Field removed

// ✅ This works
let scatter_mm = evaluated.scattering_radius_mm;
```

---

## Migration Steps

### Step 1: Update Cargo.toml

```toml
[dependencies]
momoto-core = "5.0"  # Was: "4.x"
```

Run:

```bash
cargo update
cargo build
```

**Expected:** Deprecation warnings (this is normal).

---

### Step 2: Replace Field Access

#### Before (v4.x)

```rust
let evaluated = glass.evaluate(&context);
let blur_px = evaluated.blur_px;

// Apply to CSS
let css = format!("backdrop-filter: blur({}px);", blur_px);
```

#### After (v5.0+)

```rust
let evaluated = glass.evaluate(&context);
let scatter_mm = evaluated.scattering_radius_mm;

// Convert mm → px for CSS (96 DPI standard)
const MM_TO_PX: f64 = 3.779527559;  // 96 / 25.4
let blur_px = scatter_mm * MM_TO_PX;

// Apply to CSS
let css = format!("backdrop-filter: blur({}px);", blur_px);
```

**Or use the backend directly:**

```rust
use momoto_core::{backend::CssBackend, render::RenderBackend};

let backend = CssBackend;
let css = backend.render(&evaluated, &RenderContext::desktop())?;
// Already converted to pixels internally
```

---

### Step 3: Replace Method Calls

#### Before (v4.x)

```rust
let glass = GlassMaterial::frosted();
let blur = glass.blur_amount();  // Returns pixels

if glass.has_blur() {
    println!("Blur: {}px", blur);
}
```

#### After (v5.0+)

```rust
let glass = GlassMaterial::frosted();
let scatter = glass.scattering_radius_mm();  // Returns millimeters

if glass.has_scattering() {
    const MM_TO_PX: f64 = 3.779527559;
    let blur_px = scatter * MM_TO_PX;
    println!("Blur: {}px ({}mm)", blur_px, scatter);
}
```

---

### Step 4: Fix Deprecation Warnings

Run clippy to find all uses of deprecated APIs:

```bash
cargo clippy --all-features 2>&1 | grep deprecated
```

**Example Output:**

```
warning: use of deprecated field `blur_px`
  --> src/main.rs:42:30
   |
42 |     let blur = evaluated.blur_px;
   |                          ^^^^^^^
   |
   = note: Use `scattering_radius_mm` instead
```

**Fix:**

```rust
// OLD
let blur = evaluated.blur_px;

// NEW
let scatter = evaluated.scattering_radius_mm;
let blur = scatter * 3.779527559;  // Convert to px if needed
```

---

### Step 5: Update Tests

#### Before (v4.x)

```rust
#[test]
fn test_glass_blur() {
    let glass = GlassMaterial::frosted();
    let evaluated = glass.evaluate(&MaterialContext::default());

    assert_eq!(evaluated.blur_px, 23.0);
}
```

#### After (v5.0+)

```rust
#[test]
fn test_glass_scattering() {
    let glass = GlassMaterial::frosted();
    let evaluated = glass.evaluate(&MaterialContext::default());

    // Physical property in mm
    assert_eq!(evaluated.scattering_radius_mm, 6.2);

    // Convert to px for backend validation
    const MM_TO_PX: f64 = 3.779527559;
    let blur_px = evaluated.scattering_radius_mm * MM_TO_PX;
    assert!((blur_px - 23.4).abs() < 0.5);  // ~23px
}
```

---

## Side-by-Side Comparisons

### Rust API

#### EvaluatedMaterial Access

| Before (v4.x) | After (v5.0+) |
|---------------|---------------|
| `evaluated.blur_px` | `evaluated.scattering_radius_mm` |
| `evaluated.has_blur()` | `evaluated.has_scattering()` |

```rust
// Before
let blur_px = evaluated.blur_px;

// After
let scatter_mm = evaluated.scattering_radius_mm;
const MM_TO_PX: f64 = 3.779527559;
let blur_px = scatter_mm * MM_TO_PX;
```

---

#### GlassMaterial Methods

| Before (v4.x) | After (v5.0+) |
|---------------|---------------|
| `glass.blur_amount()` | `glass.scattering_radius_mm()` |

```rust
// Before
let blur = glass.blur_amount();  // Returns px

// After
let scatter = glass.scattering_radius_mm();  // Returns mm
let blur = scatter * 3.779527559;  // Convert if needed
```

---

### WASM/JavaScript API

#### EvaluatedMaterial Access

```javascript
// Before (v4.x)
const evaluated = glass.evaluate(context);
const blurPx = evaluated.blurPx;  // Deprecated
document.getElementById('panel').style.filter = `blur(${blurPx}px)`;

// After (v5.0+)
const evaluated = glass.evaluate(context);
const scatterMm = evaluated.scatteringRadiusMm;  // Recommended

const MM_TO_PX = 3.779527559;
const blurPx = scatterMm * MM_TO_PX;
document.getElementById('panel').style.filter = `blur(${blurPx}px)`;

// Or use backend directly
const backend = new CssBackend();
const css = backend.render(evaluated, RenderContext.desktop());
document.getElementById('panel').style.cssText = css;
```

---

#### GlassMaterial Methods

```javascript
// Before (v4.x)
const glass = GlassMaterial.frosted();
const blur = glass.blurAmount();  // Returns px

// After (v5.0+)
const glass = GlassMaterial.frosted();
const scatter = glass.scatteringRadiusMm();  // Returns mm

const MM_TO_PX = 3.779527559;
const blur = scatter * MM_TO_PX;
```

---

## Conversion Reference

### Typical Values

| Material Type | scattering_radius_mm | blur_px (96 DPI) |
|---------------|----------------------|------------------|
| Clear glass | 0.5 mm | ~2 px |
| Light frosted | 2.0 mm | ~8 px |
| Regular glass | 5.0 mm | ~19 px |
| Frosted glass | 6.2 mm | ~23 px |
| Heavy frosted | 10.0 mm | ~38 px |

### Conversion Formula

```
blur_px = scattering_radius_mm × (DPI / 25.4)

For 96 DPI (CSS standard):
blur_px = scattering_radius_mm × 3.779527559

For 72 DPI (legacy):
blur_px = scattering_radius_mm × 2.834645669

For 300 DPI (print):
blur_px = scattering_radius_mm × 11.81102362
```

### Custom DPI

```rust
fn mm_to_px(mm: f64, dpi: f64) -> f64 {
    mm * (dpi / 25.4)
}

let scatter_mm = 6.2;
let blur_96dpi = mm_to_px(scatter_mm, 96.0);   // 23.4px
let blur_220dpi = mm_to_px(scatter_mm, 220.0); // 53.7px
let blur_300dpi = mm_to_px(scatter_mm, 300.0); // 73.2px
```

---

## Complete Examples

### Example 1: Basic Migration (Rust)

#### Before (v4.x)

```rust
use momoto_core::{
    material::GlassMaterial,
    evaluated::Evaluable,
};

fn main() {
    let glass = GlassMaterial::frosted();
    let context = MaterialContext::default();
    let evaluated = glass.evaluate(&context);

    // Old API
    let blur_px = evaluated.blur_px;
    println!("Blur: {}px", blur_px);
}
```

#### After (v5.0+)

```rust
use momoto_core::{
    material::GlassMaterial,
    evaluated::{Evaluable, MaterialContext},
    backend::CssBackend,
    render::{RenderBackend, RenderContext},
};

fn main() {
    let glass = GlassMaterial::frosted();
    let context = MaterialContext::default();
    let evaluated = glass.evaluate(&context);

    // New API (physical units)
    let scatter_mm = evaluated.scattering_radius_mm;
    println!("Scattering: {}mm", scatter_mm);

    // Convert to pixels if needed
    const MM_TO_PX: f64 = 3.779527559;
    let blur_px = scatter_mm * MM_TO_PX;
    println!("Blur: {}px", blur_px);

    // Or use backend
    let backend = CssBackend;
    let css = backend.render(&evaluated, &RenderContext::desktop())
        .expect("Failed to render");
    println!("CSS: {}", css);
}
```

---

### Example 2: Component Library (JavaScript)

#### Before (v4.x)

```javascript
import init, { GlassMaterial, MaterialContext } from './momoto_wasm.js';

await init();

function createGlassPanel() {
  const glass = GlassMaterial.frosted();
  const context = MaterialContext.new();
  const evaluated = glass.evaluate(context);

  // Old API (deprecated)
  const blurPx = evaluated.blurPx;

  const panel = document.createElement('div');
  panel.style.backdropFilter = `blur(${blurPx}px)`;
  panel.style.background = `rgba(255, 255, 255, ${evaluated.opacity})`;

  return panel;
}
```

#### After (v5.0+)

```javascript
import init, {
  GlassMaterial,
  MaterialContext,
  RenderContext,
  CssBackend,
} from './momoto_wasm.js';

await init();

function createGlassPanel() {
  const glass = GlassMaterial.frosted();
  const evalCtx = MaterialContext.new();
  const evaluated = glass.evaluate(evalCtx);

  // New API (recommended)
  const backend = new CssBackend();
  const renderCtx = RenderContext.desktop();
  const css = backend.render(evaluated, renderCtx);

  const panel = document.createElement('div');
  panel.style.cssText = css;  // Applies both backdrop-filter and background

  return panel;
}

// Or manual conversion
function createGlassPanelManual() {
  const glass = GlassMaterial.frosted();
  const context = MaterialContext.new();
  const evaluated = glass.evaluate(context);

  // New API (physical units)
  const scatterMm = evaluated.scatteringRadiusMm;
  const MM_TO_PX = 3.779527559;
  const blurPx = scatterMm * MM_TO_PX;

  const panel = document.createElement('div');
  panel.style.backdropFilter = `blur(${blurPx}px)`;
  panel.style.background = `oklch(${evaluated.color.l} ${evaluated.color.c} ${evaluated.color.h} / ${evaluated.opacity})`;

  return panel;
}
```

---

### Example 3: React Component

#### Before (v4.x)

```tsx
import { useEffect, useState } from 'react';
import init, { GlassMaterial, MaterialContext } from 'momoto-wasm';

function GlassPanel() {
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    init().then(() => {
      const glass = GlassMaterial.frosted();
      const context = MaterialContext.new();
      const evaluated = glass.evaluate(context);

      setBlur(evaluated.blurPx);  // Deprecated
    });
  }, []);

  return (
    <div
      style={{
        backdropFilter: `blur(${blur}px)`,
        background: 'rgba(255, 255, 255, 0.7)',
      }}
    >
      Glass Panel
    </div>
  );
}
```

#### After (v5.0+)

```tsx
import { useEffect, useState } from 'react';
import init, {
  GlassMaterial,
  MaterialContext,
  RenderContext,
  CssBackend,
} from 'momoto-wasm';

function GlassPanel() {
  const [css, setCss] = useState('');

  useEffect(() => {
    init().then(() => {
      const glass = GlassMaterial.frosted();
      const evalCtx = MaterialContext.new();
      const evaluated = glass.evaluate(evalCtx);

      const backend = new CssBackend();
      const renderCtx = RenderContext.desktop();
      const cssString = backend.render(evaluated, renderCtx);

      setCss(cssString);
    });
  }, []);

  return (
    <div style={{ cssText: css }}>
      Glass Panel
    </div>
  );
}

// Or with manual conversion
function GlassPanelManual() {
  const [styles, setStyles] = useState({});

  useEffect(() => {
    init().then(() => {
      const glass = GlassMaterial.frosted();
      const context = MaterialContext.new();
      const evaluated = glass.evaluate(context);

      const scatterMm = evaluated.scatteringRadiusMm;
      const MM_TO_PX = 3.779527559;
      const blurPx = scatterMm * MM_TO_PX;

      setStyles({
        backdropFilter: `blur(${blurPx}px)`,
        background: `oklch(${evaluated.color.l} ${evaluated.color.c} ${evaluated.color.h} / ${evaluated.opacity})`,
      });
    });
  }, []);

  return (
    <div style={styles}>
      Glass Panel
    </div>
  );
}
```

---

## Troubleshooting

### Issue 1: Deprecation Warnings

**Symptom:**

```
warning: use of deprecated field `blur_px`
```

**Solution:**

This is expected in v5.x. Update to `scattering_radius_mm` when convenient.

**Suppress temporarily:**

```rust
#[allow(deprecated)]
let blur_px = evaluated.blur_px;
```

---

### Issue 2: Blur Looks Different

**Symptom:**

After migration, blur radius appears different (larger or smaller).

**Cause:**

Physical scattering in mm is more accurate than the old pixel-based approximation.

**Solution:**

This is expected. The new values are **physically correct**. If you need to match old visual appearance exactly:

```rust
// Old behavior (v4.x equivalent)
let old_blur_px = glass.blur_amount();  // Deprecated, returns px directly

// New behavior (v5.0+, physically accurate)
let scatter_mm = glass.scattering_radius_mm();
let new_blur_px = scatter_mm * 3.779527559;  // May differ slightly

// To match old appearance (not recommended)
let adjusted_mm = old_blur_px / 3.779527559;
```

**Recommendation:** Use the new physically accurate values. Update designs if needed.

---

### Issue 3: TypeScript Errors

**Symptom:**

```
Property 'blurPx' does not exist on type 'EvaluatedMaterial'
```

**Cause:**

TypeScript definitions removed `blurPx` in v6.0.

**Solution:**

Update to `scatteringRadiusMm`:

```typescript
// Before
const blur: number = evaluated.blurPx;

// After
const scatter: number = evaluated.scatteringRadiusMm;
const blur: number = scatter * 3.779527559;
```

---

### Issue 4: Backend Already Converts

**Symptom:**

```rust
let backend = CssBackend;
let css = backend.render(&evaluated, &ctx)?;
// CSS has blur in px, but I converted mm→px manually - now it's double!
```

**Cause:**

Backend already converts mm→px internally.

**Solution:**

Don't convert manually when using backends:

```rust
// ❌ Wrong (double conversion)
let blur_px = evaluated.scattering_radius_mm * 3.779527559;
let css = format!("backdrop-filter: blur({}px);", blur_px);
// This is redundant - backend does this

// ✅ Correct (let backend handle it)
let backend = CssBackend;
let css = backend.render(&evaluated, &RenderContext::desktop())?;
// Backend converts mm→px automatically
```

---

### Issue 5: Non-CSS Backends

**Symptom:**

I'm using WebGPU/Print backend. Do I still need to convert?

**Answer:**

No! That's the whole point of physical units.

```rust
// Print backend (no conversion needed)
let print_backend = PrintBackend;
let pdf = print_backend.render(&evaluated, &RenderContext::print_300dpi())?;
// Uses scattering_radius_mm directly (mm is native for PDF)

// WebGPU backend (viewport-relative conversion)
let webgpu_backend = WebGpuBackend::new(device);
let commands = webgpu_backend.render(&evaluated, &render_ctx)?;
// Converts mm→px based on viewport DPI (not hardcoded 96 DPI)
```

---

## FAQ

### Q: Why not keep both `blur_px` and `scattering_radius_mm`?

**A:** Maintaining two parallel APIs leads to confusion and bugs. Physical units (mm) are the canonical representation. Backends convert to pixels when needed.

---

### Q: What if I only use CSS? Do I care about mm?

**A:** Even if you only use CSS today, physical units enable:
- Consistent rendering across devices (retina, 4K, etc.)
- Future migration to WebGPU or other backends
- Sharing materials across web and print

**Plus**, CssBackend handles conversion automatically — you don't need to think about mm vs px.

---

### Q: Can I still access pixel values?

**A:** Yes, convert manually or use the backend:

```rust
// Manual
let blur_px = evaluated.scattering_radius_mm * 3.779527559;

// Or let backend do it
let backend = CssBackend;
let css = backend.render(&evaluated, &ctx)?;
// CSS contains blur in pixels
```

---

### Q: What about backward compatibility?

**A:** v5.x maintains full backward compatibility via deprecated wrappers:

```rust
// v5.x - Both work
let old = evaluated.blur_px;  // Deprecated, warns
let new = evaluated.scattering_radius_mm;  // Recommended

// v6.0+ - Only new API
let new = evaluated.scattering_radius_mm;  // Only this works
```

Migrate anytime before v6.0 (June 2026).

---

### Q: How do I know I've migrated everything?

**A:** Run clippy with warnings-as-errors:

```bash
cargo clippy --all-features -- -D warnings
```

If it compiles without warnings, you're done.

---

## Checklist

Use this checklist to track your migration:

- [ ] Updated `Cargo.toml` to v5.0
- [ ] Replaced `evaluated.blur_px` with `evaluated.scattering_radius_mm`
- [ ] Replaced `glass.blur_amount()` with `glass.scattering_radius_mm()`
- [ ] Replaced `has_blur()` with `has_scattering()`
- [ ] Updated all tests to use physical units
- [ ] Ran `cargo clippy` and fixed all deprecation warnings
- [ ] Tested visual output (blur looks correct)
- [ ] Updated TypeScript definitions (if using WASM)
- [ ] Updated documentation/comments
- [ ] Communicated changes to team

---

## Getting Help

**Stuck?**

1. **Check examples** - See complete examples above
2. **Search issues** - [GitHub Issues](https://github.com/momoto/momoto/issues)
3. **Ask questions** - [Discussions](https://github.com/momoto/momoto/discussions)

**Found a bug?**

Report at: https://github.com/momoto/momoto/issues

---

## Further Reading

- [CONCEPTS.md](./CONCEPTS.md) - Understand Materials, Context, Evaluation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and backends
- [ADR-004](./architecture/ADR-004-physical-units-in-evaluated-material.md) - Why physical units
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance implications

---

**Migration Guide** — From pixels to physics. From CSS-locked to backend-agnostic.
