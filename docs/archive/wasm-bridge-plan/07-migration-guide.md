# Migration Guide: TypeScript → WASM Bridge

## Overview

This guide identifies every TypeScript file that reimplements Rust logic and provides the exact replacement using the new WASM bridge.

**Goal:** After migration, TypeScript contains ZERO algorithmic reimplementations. All physics, contrast, color science, and evaluation runs in Rust via WASM.

---

## Phase 0: Prerequisites

### Build the new WASM module

```bash
cd momoto-ui/momoto

# 1. Update Cargo.toml — add new modules to momoto-wasm
# See: crates/momoto-wasm/src/lib.rs additions

# 2. Build WASM
wasm-pack build crates/momoto-wasm --target web --out-dir pkg

# 3. Copy to packages
cp -r crates/momoto-wasm/pkg/ ../../packages/momoto-wasm/pkg/

# 4. Verify .d.ts has all new exports
grep -c "export" packages/momoto-wasm/pkg/momoto_wasm.d.ts
# Expected: 400+ exports (was ~120)
```

### Update momoto-wasm/Cargo.toml

```toml
[dependencies]
momoto-core = { path = "../momoto-core" }
momoto-metrics = { path = "../momoto-metrics" }
momoto-intelligence = { path = "../momoto-intelligence" }
momoto-materials = { path = "../momoto-materials" }
momoto-agent = { path = "../momoto-agent" }        # NEW
momoto-events = { path = "../momoto-events" }      # NEW
wasm-bindgen = { workspace = true }
js-sys = "0.3"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
serde-wasm-bindgen = "0.6"
console_error_panic_hook = { version = "0.1", optional = true }
```

### Update momoto-wasm/src/lib.rs

```rust
// Add new module declarations
mod intelligence;  // NEW: 02-wasm-bindings-intelligence.rs
mod agent;         // NEW: 03-wasm-bindings-agent.rs
mod events;        // NEW: 04-wasm-bindings-events.rs
mod core_ext;      // NEW: 05-wasm-bindings-core-metrics.rs

// Re-export all new bindings
pub use intelligence::*;
pub use agent::*;
pub use events::*;
pub use core_ext::*;
```

---

## Phase 1: Replace APCA/WCAG Math (HIGHEST PRIORITY)

### Files to Remove/Replace

#### `ventazo-web/src/components/layout/hooks/pipeline/phase4-metrics.ts`

**Current:** TypeScript reimplements APCA contrast calculation (~200 LOC).

**Replace with:**
```typescript
import { MomotoBridge, UsageContext, ComplianceTarget } from '@/lib/momoto-bridge';

// BEFORE (TypeScript math):
function calculateApcaContrast(fg: RGB, bg: RGB): number {
  // 50+ lines of APCA algorithm...
}

// AFTER (1 line, Rust-computed):
function calculateApcaContrast(fgHex: string, bgHex: string): number {
  const fg = MomotoBridge.color.fromHex(fgHex);
  const bg = MomotoBridge.color.fromHex(bgHex);
  const result = MomotoBridge.contrast.apca(fg, bg);
  const lc = result.value;
  fg.free(); bg.free(); result.free();
  return lc;
}
```

**Batch optimization:**
```typescript
// BEFORE: 17 pairs evaluated one-by-one in TypeScript
const results = pairs.map(([fg, bg]) => calculateApcaContrast(fg, bg));

// AFTER: Single WASM call for all 17 pairs
const pairData = new Uint8Array(pairs.length * 6);
pairs.forEach(([fg, bg], i) => {
  const offset = i * 6;
  pairData.set(hexToRgb(fg), offset);
  pairData.set(hexToRgb(bg), offset + 3);
});
const ratios = MomotoBridge.contrast.wcagRatioBatch(pairData);
```

#### `ventazo-web/src/components/layout/hooks/pipeline/phase1-intelligence.ts`

**Current:** Uses `AccessibilityService.evaluate()` from momoto-ui TypeScript domain (which reimplements WCAG/APCA in TS).

**Replace:**
```typescript
// BEFORE:
import { AccessibilityService } from '@/lib/momoto-bridge';
const evaluation = AccessibilityService.evaluate(fgColor, bgColor);

// AFTER:
const fg = MomotoBridge.color.fromHex(fgHex);
const bg = MomotoBridge.color.fromHex(bgHex);
const wcagResult = MomotoBridge.contrast.wcag(fg, bg);
const apcaResult = MomotoBridge.contrast.apca(fg, bg);
```

**TS files affected:**
- `phase1-intelligence.ts` — brand analysis contrast checks
- `phase4-metrics.ts` — full metrics validation
- `phase6-loop.ts` — re-validation after corrections

---

## Phase 2: Replace Color Derivation

### Files to Remove/Replace

#### `ventazo-web/src/components/layout/hooks/pipeline/phase2-oklch.ts`

**Current:** ~400 LOC of OKLCH color derivation using `PerceptualColor.fromOklch()` from TS domain.

**Replace key operations:**
```typescript
// BEFORE (TS):
const color = PerceptualColor.fromOklch(l, c, h);
const hex = color.toHex();

// AFTER (WASM):
const oklch = MomotoBridge.oklch.create(l, c, h);
const color = MomotoBridge.oklch.toColor(oklch);
const hex = MomotoBridge.color.toHex(color);
oklch.free(); color.free();
```

**For scale generation (TokenDerivationService):**
```typescript
// BEFORE (TS reimplements scale derivation):
const scale = TokenDerivationService.deriveScale(baseColor, steps);

// AFTER (Rust computes, TS only maps):
// Note: TokenDerivationService.deriveScale exists in momoto-ui TS domain
// but delegates to PerceptualColor operations which should use WASM.
// Replace the underlying PerceptualColor operations.
```

---

## Phase 3: Replace SIREN Neural Network

### Files to Remove/Replace

#### `ventazo-web/src/components/layout/hooks/pipeline/phase5-siren.ts`

**Current:** ~300 LOC TypeScript implementation of 3-layer MLP with sin activations, hardcoded weights (483 params).

**Strategy:** Move SIREN to Rust and expose via WASM. Create new Rust module:

```rust
// crates/momoto-wasm/src/siren.rs
#[wasm_bindgen]
pub struct SirenCorrector {
    weights: SirenWeights, // 483 params, same seed 42/1337
}

#[wasm_bindgen]
impl SirenCorrector {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self { /* Mulberry32 PRNG init */ }

    /// Correct a failing color pair.
    /// Returns [deltaL, deltaC, deltaH].
    pub fn correct(
        &self,
        bg_l: f64, bg_c: f64, bg_h: f64,
        fg_l: f64, fg_c: f64, fg_h: f64,
        apca_lc: f64, wcag_ratio: f64, quality: f64,
    ) -> Box<[f64]> { /* 3-layer forward pass */ }

    /// Batch correct multiple pairs.
    pub fn correct_batch(&self, inputs: &[f64]) -> Box<[f64]> { /* ... */ }
}
```

**Replace in pipeline:**
```typescript
// BEFORE (phase5-siren.ts):
function sirenCorrect(input: SirenInput): SirenOutput {
  // 200+ lines of matrix multiply + sin activation
}

// AFTER:
const corrector = new wasm.SirenCorrector();
const [deltaL, deltaC, deltaH] = corrector.correct(
  bg.l, bg.c, bg.h, fg.l, fg.c, fg.h,
  apcaLc, wcagRatio, quality,
);
corrector.free();
```

---

## Phase 4: Replace Material Approximations

### Files to Remove/Replace

#### `ventazo-web/src/components/layout/hooks/pipeline/phase3-materials.ts`

**Current:** ~350 LOC of CSS-native material approximations (Fresnel, Blinn-Phong, shadows).

**Replace with WASM glass physics:**
```typescript
// BEFORE (TS approximation):
function generateGlassGradient(isLight: boolean, opacity: number): string {
  const f0 = isLight ? 0.04 : 0.08;
  // Manual Schlick approximation...
  return `linear-gradient(...)`;
}

// AFTER (Rust physics → CSS):
const material = MomotoBridge.glass.regular();
const context = wasm.EvalMaterialContext.default();
const evaluated = material.evaluate(context);
const backend = new wasm.CssBackend();
const renderCtx = wasm.RenderContext.desktop();
const css = backend.render(evaluated, renderCtx);
// css contains physically-correct glass CSS
```

**For enhanced rendering:**
```typescript
// BEFORE: Manual multi-layer CSS string construction
const fresnelGradient = `linear-gradient(180deg, rgba(255,255,255,${0.08})...)`

// AFTER: Rust-computed enhanced CSS
const css = wasm.renderEnhancedGlassCss(material, renderCtx, options);
```

---

## Phase 5: Replace Convergence Detection

### Files to Remove/Replace

#### `ventazo-web/src/components/layout/hooks/pipeline/phase6-loop.ts`

**Current:** TypeScript convergence loop with hardcoded thresholds.

**Replace with Rust ConvergenceDetector:**
```typescript
// BEFORE:
const TARGET_SCORE = 96;
const MAX_ITERATIONS = 5;
let score = calculateScore(colors);
while (score < TARGET_SCORE && iteration <= MAX_ITERATIONS) {
  // manual iteration...
}

// AFTER:
const detector = MomotoBridge.convergence.create('neural');
let iteration = 0;
while (true) {
  const score = calculateScore(colors); // Still calls WASM metrics
  const status = detector.update(score);
  if (status.type === 'Converged' || status.shouldStop) break;
  // Apply WASM SIREN correction...
  iteration++;
}
```

---

## Phase 6: Replace Temporal Validation

#### `ventazo-web/src/components/layout/hooks/pipeline/phase8-temporal.ts`

**Current:** ~200 LOC TypeScript frame comparison with deltaE threshold.

**Replace with Rust FlickerValidator (from momoto-materials spectral_coherence):**
```typescript
// BEFORE:
const deltaE = Math.sqrt(
  (a.l - b.l) ** 2 + (a.c - b.c) ** 2 + (a.h - b.h) ** 2
);
if (deltaE > 0.02) flickerRisks.push(token);

// AFTER:
// deltaE is computed in Rust via OKLCH
const a = MomotoBridge.oklch.create(aL, aC, aH);
const b = MomotoBridge.oklch.create(bL, bC, bH);
const deltaE = MomotoBridge.oklch.deltaE(a, b);
a.free(); b.free();
```

---

## Phase 7: Replace Agent/Experience in ventazo-web

#### `ventazo-web/src/components/layout/hooks/pipeline/phase7-export.ts`

**Current:** TypeScript builds CSS variable strings manually.

**Partial replacement** — CSS variable generation can stay in TS as it's just string formatting, not algorithmic. However, the token values feeding it should come from WASM.

---

## Migration Checklist

### Files to DELETE after migration:

| File | Reason | Replacement |
|------|--------|-------------|
| `momoto-ui/domain/perceptual/services/AccessibilityService.ts` | Reimplements WCAG/APCA | `MomotoBridge.contrast.*` |
| `momoto-ui/domain/perceptual/services/TextColorDecisionService.ts` | Delegates to WASM anyway | `MomotoBridge.recommend.foreground()` |
| `ventazo-web/.../phase5-siren.ts` (algorithm part) | TS neural network | `wasm.SirenCorrector` |

### Files to REFACTOR (replace internals, keep API):

| File | Current | After |
|------|---------|-------|
| `phase1-intelligence.ts` | TS contrast analysis | WASM contrast + quality scoring |
| `phase2-oklch.ts` | TS OKLCH derivation | WASM OKLCH operations |
| `phase3-materials.ts` | CSS approximations | WASM glass physics → CSS |
| `phase4-metrics.ts` | TS APCA/WCAG math | WASM batch contrast |
| `phase6-loop.ts` | TS convergence loop | WASM ConvergenceDetector + SIREN |
| `phase8-temporal.ts` | TS deltaE comparison | WASM OKLCH.deltaE |
| `useSidebarMomotoEngine.ts` | Wraps TS pipeline | Wraps WASM pipeline |

### Files to KEEP (TS orchestration, no algorithms):

| File | Reason |
|------|--------|
| `phase7-export.ts` | CSS var formatting (string ops, not math) |
| `pipeline/index.ts` | React hook orchestration |
| `pipeline/types.ts` | Type definitions |
| `pipeline/theme-modes.ts` | Static config (thresholds) |
| `useSidebarMomotoEngine.ts` | API adapter (backward compat) |

---

## Build & Integration Steps

### 1. Rust Module Structure

```
momoto-ui/momoto/crates/momoto-wasm/src/
├── lib.rs                          # Main + existing bindings (~8000 lines)
├── intelligence.rs                 # NEW: from 02-wasm-bindings-intelligence.rs
├── agent.rs                        # NEW: from 03-wasm-bindings-agent.rs
├── events.rs                       # NEW: from 04-wasm-bindings-events.rs
├── core_ext.rs                     # NEW: from 05-wasm-bindings-core-metrics.rs
└── siren.rs                        # NEW: SIREN neural network (port from TS)
```

### 2. Build Commands

```bash
# Build WASM (release, optimized)
cd momoto-ui/momoto
wasm-pack build crates/momoto-wasm \
  --target web \
  --out-dir pkg \
  --release

# Verify TypeScript definitions
ls -la crates/momoto-wasm/pkg/momoto_wasm.d.ts

# Copy to npm package
cp -r crates/momoto-wasm/pkg/* ../../packages/momoto-wasm/pkg/

# Update MomotoBridge.ts
cp ../../WASM_BRIDGE_PLAN/06-MomotoBridge.ts \
   ../../infrastructure/MomotoBridge.ts
```

### 3. Vite/Webpack Configuration

```typescript
// vite.config.ts
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm()],
  optimizeDeps: {
    exclude: ['momoto-wasm'],
  },
});
```

### 4. Integration Test

```typescript
import { MomotoBridge, UsageContext, ComplianceTarget } from './MomotoBridge';

async function smokeTest() {
  await MomotoBridge.init();

  // Color operations
  const color = MomotoBridge.color.fromHex('#336699');
  const oklch = MomotoBridge.oklch.fromColor(color);
  console.assert(oklch.l > 0 && oklch.l < 1);

  // Contrast
  const white = MomotoBridge.color.fromHex('#FFFFFF');
  const ratio = MomotoBridge.contrast.wcagRatio(color, white);
  console.assert(ratio > 1 && ratio < 21);

  // WCAG helpers
  console.assert(MomotoBridge.contrast.isLargeText(24, 400) === true);
  console.assert(MomotoBridge.contrast.isLargeText(14, 400) === false);

  // Quality scoring
  const score = MomotoBridge.quality.score(
    color, white, UsageContext.BodyText, ComplianceTarget.WCAG_AA,
  );
  console.assert(score.overall > 0);

  // Recommendation
  const rec = MomotoBridge.recommend.foreground(
    white, UsageContext.BodyText, ComplianceTarget.WCAG_AA,
  );
  console.assert(rec.passes);

  // Agent
  const metrics = JSON.parse(MomotoBridge.agent.getMetrics('#336699'));
  console.assert(metrics.lightness > 0);

  // Convergence
  const detector = MomotoBridge.convergence.create('neural');
  detector.update(50);
  detector.update(70);
  const status = detector.update(90);
  console.assert(status.type === 'Converging' || status.type === 'Converged');

  console.log('All smoke tests passed');
}
```

---

## Performance Expectations

| Operation | TypeScript (current) | WASM (after) | Speedup |
|-----------|---------------------|--------------|---------|
| APCA contrast (single) | ~5μs | ~0.5μs | 10x |
| APCA contrast (17 pairs) | ~85μs | ~3μs (batch) | 28x |
| WCAG ratio (single) | ~3μs | ~0.3μs | 10x |
| OKLCH→hex | ~2μs | ~0.2μs | 10x |
| SIREN forward pass | ~50μs | ~2μs | 25x |
| Phase 4 full validation | ~200μs | ~10μs (batch) | 20x |
| Phase 6 convergence loop (5 iter) | ~1ms | ~50μs | 20x |
| Glass CSS generation | ~100μs | ~15μs | 7x |

**Total pipeline improvement estimate: 15-25x faster.**

---

## Success Criteria

After complete migration:

- [ ] `grep -r "calculateApcaContrast\|calculateWcagContrast" ventazo-web/src/` → 0 results
- [ ] `grep -r "srgb_to_linear\|linearToSrgb" ventazo-web/src/` → 0 results (except imports)
- [ ] `grep -r "function.*sirenCorrect\|class.*SIREN" ventazo-web/src/` → 0 results
- [ ] `grep -r "fresnelSchlick\|blinnPhong" ventazo-web/src/` → 0 results (except CSS var names)
- [ ] All 17 contrast pairs in Phase 4 computed via single `wcagContrastRatioBatch()` call
- [ ] Phase 5 SIREN runs in Rust via `SirenCorrector.correct_batch()`
- [ ] Phase 6 convergence uses `ConvergenceDetector` from Rust
- [ ] `MomotoBridge.isReady()` returns `true` before pipeline runs
- [ ] Numeric parity: `|WASM_result - TS_result| < 1e-10` for all contrast calculations
- [ ] Benchmark: Pipeline execution time < 2ms (was ~20ms)
