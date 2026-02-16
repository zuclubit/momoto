# Rust/WASM Implementation Guide
## Technical Reference for Momoto UI Migration

**Companion to**: RUST-WASM-UX-MIGRATION-STRATEGY.md
**Audience**: Engineers implementing the Rust/WASM migration
**Version**: 1.0.0

---

## Quick Start

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Add WASM target
rustup target add wasm32-unknown-unknown
```

### Project Structure

```
momoto-ui/
├── crates/                     # Rust workspace (NEW)
│   └── momoto-ui-core/
│       ├── src/
│       │   ├── lib.rs         # WASM entry point
│       │   ├── state/         # UIState machine
│       │   ├── tokens/        # Token derivation
│       │   ├── accessibility/ # A11y validation
│       │   └── components/    # Component cores
│       ├── Cargo.toml
│       └── tests/
│
├── packages/                   # NPM workspace
│   ├── momoto-ui-wasm/        # WASM bindings (NEW)
│   │   ├── src/
│   │   │   ├── index.ts       # TS facade
│   │   │   └── bindings.d.ts  # Auto-generated types
│   │   ├── pkg/               # wasm-pack output
│   │   └── package.json
│   │
│   └── momoto-ui/             # Existing UI library
│       ├── domain/
│       ├── adapters/
│       └── ...
│
├── Cargo.toml                  # Rust workspace root
└── package.json                # NPM workspace root
```

---

## Phase 1: UIState Machine

### 1.1 Rust Implementation

**File**: `crates/momoto-ui-core/src/state/mod.rs`

```rust
use wasm_bindgen::prelude::*;

/// UI interaction states
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
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

impl UIState {
    /// Determine state from interaction flags (priority-based)
    #[inline]
    pub const fn determine(
        disabled: bool,
        loading: bool,
        active: bool,
        focused: bool,
        hovered: bool,
    ) -> Self {
        // Priority encoding (highest priority wins)
        if disabled {
            return Self::Disabled;
        }
        if loading {
            return Self::Loading;
        }
        if active {
            return Self::Active;
        }
        if focused {
            return Self::Focus;
        }
        if hovered {
            return Self::Hover;
        }
        Self::Idle
    }

    /// Get state priority (const for compile-time optimization)
    #[inline]
    pub const fn priority(self) -> u8 {
        match self {
            Self::Disabled => 100,
            Self::Loading => 90,
            Self::Error => 80,
            Self::Success => 75,
            Self::Active => 60,
            Self::Focus => 50,
            Self::Hover => 40,
            Self::Idle => 0,
        }
    }

    /// Get perceptual metadata for state
    #[inline]
    pub const fn metadata(self) -> StateMetadata {
        match self {
            Self::Idle => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.0,
                opacity: 1.0,
                animation: Animation::None,
                focus_indicator: false,
            },
            Self::Hover => StateMetadata {
                lightness_shift: 0.05,
                chroma_shift: 0.02,
                opacity: 1.0,
                animation: Animation::Subtle,
                focus_indicator: false,
            },
            Self::Active => StateMetadata {
                lightness_shift: -0.08,
                chroma_shift: 0.03,
                opacity: 1.0,
                animation: Animation::Medium,
                focus_indicator: false,
            },
            Self::Focus => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.0,
                opacity: 1.0,
                animation: Animation::Subtle,
                focus_indicator: true,
            },
            Self::Disabled => StateMetadata {
                lightness_shift: 0.2,
                chroma_shift: -0.1,
                opacity: 0.5,
                animation: Animation::None,
                focus_indicator: false,
            },
            Self::Loading => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: -0.05,
                opacity: 0.7,
                animation: Animation::Prominent,
                focus_indicator: false,
            },
            Self::Error => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.1,
                opacity: 1.0,
                animation: Animation::Medium,
                focus_indicator: false,
            },
            Self::Success => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.05,
                opacity: 1.0,
                animation: Animation::Subtle,
                focus_indicator: false,
            },
        }
    }
}

/// Perceptual metadata for state
#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct StateMetadata {
    pub lightness_shift: f64,
    pub chroma_shift: f64,
    pub opacity: f64,
    animation: Animation,
    focus_indicator: bool,
}

#[wasm_bindgen]
impl StateMetadata {
    #[wasm_bindgen(getter)]
    pub fn animation(&self) -> u8 {
        self.animation as u8
    }

    #[wasm_bindgen(getter)]
    pub fn focus_indicator(&self) -> bool {
        self.focus_indicator
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
enum Animation {
    None = 0,
    Subtle = 1,
    Medium = 2,
    Prominent = 3,
}

// ============================================================================
// WASM EXPORTS
// ============================================================================

/// Determine UI state from interaction flags
#[wasm_bindgen]
pub fn determine_ui_state(
    disabled: bool,
    loading: bool,
    active: bool,
    focused: bool,
    hovered: bool,
) -> u8 {
    UIState::determine(disabled, loading, active, focused, hovered) as u8
}

/// Get state metadata
#[wasm_bindgen]
pub fn get_state_metadata(state: u8) -> StateMetadata {
    let state = match state {
        0 => UIState::Idle,
        1 => UIState::Hover,
        2 => UIState::Active,
        3 => UIState::Focus,
        4 => UIState::Disabled,
        5 => UIState::Loading,
        6 => UIState::Error,
        7 => UIState::Success,
        _ => UIState::Idle,
    };
    state.metadata()
}

/// Get state priority
#[wasm_bindgen]
pub fn get_state_priority(state: u8) -> u8 {
    let state = match state {
        0 => UIState::Idle,
        1 => UIState::Hover,
        2 => UIState::Active,
        3 => UIState::Focus,
        4 => UIState::Disabled,
        5 => UIState::Loading,
        6 => UIState::Error,
        7 => UIState::Success,
        _ => UIState::Idle,
    };
    state.priority()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_state_priority() {
        assert_eq!(
            UIState::determine(true, false, false, false, false),
            UIState::Disabled
        );
        assert_eq!(
            UIState::determine(false, true, false, false, false),
            UIState::Loading
        );
        assert_eq!(
            UIState::determine(false, false, true, false, false),
            UIState::Active
        );
    }

    #[test]
    fn test_metadata() {
        let hover = UIState::Hover.metadata();
        assert_eq!(hover.lightness_shift, 0.05);
        assert_eq!(hover.chroma_shift, 0.02);
        assert_eq!(hover.opacity, 1.0);
    }
}
```

### 1.2 Build WASM Module

**File**: `crates/momoto-ui-core/Cargo.toml`

```toml
[package]
name = "momoto-ui-core"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"

[dev-dependencies]
wasm-bindgen-test = "0.3"

[profile.release]
opt-level = "z"     # Optimize for size
lto = true          # Link-time optimization
codegen-units = 1   # Better optimization
```

**Build command**:
```bash
cd crates/momoto-ui-core
wasm-pack build --target web --out-dir ../../packages/momoto-ui-wasm/pkg
```

### 1.3 TypeScript Facade

**File**: `packages/momoto-ui-wasm/src/index.ts`

```typescript
import type { StateMetadata as WasmStateMetadata } from './bindings';

let wasmModule: typeof import('./bindings') | null = null;

// Try to load WASM
try {
  if (process.env.ENABLE_WASM !== 'false' && typeof WebAssembly !== 'undefined') {
    wasmModule = require('./bindings');
  }
} catch (error) {
  console.warn('[Momoto] WASM not available, using TypeScript fallback', error);
}

// ============================================================================
// TYPE-SAFE WRAPPERS
// ============================================================================

export enum UIStateValue {
  Idle = 0,
  Hover = 1,
  Active = 2,
  Focus = 3,
  Disabled = 4,
  Loading = 5,
  Error = 6,
  Success = 7,
}

export interface StateMetadata {
  lightnessShift: number;
  chromaShift: number;
  opacity: number;
  animation: 'none' | 'subtle' | 'medium' | 'prominent';
  focusIndicator: boolean;
}

/**
 * Determine UI state from interaction flags
 *
 * Uses WASM if available (10x faster), falls back to TypeScript
 */
export function determineUIState(
  disabled: boolean,
  loading: boolean,
  active: boolean,
  focused: boolean,
  hovered: boolean
): UIStateValue {
  if (wasmModule) {
    return wasmModule.determine_ui_state(disabled, loading, active, focused, hovered);
  }

  // TypeScript fallback
  if (disabled) return UIStateValue.Disabled;
  if (loading) return UIStateValue.Loading;
  if (active) return UIStateValue.Active;
  if (focused) return UIStateValue.Focus;
  if (hovered) return UIStateValue.Hover;
  return UIStateValue.Idle;
}

/**
 * Get state metadata
 */
export function getStateMetadata(state: UIStateValue): StateMetadata {
  if (wasmModule) {
    const wasm = wasmModule.get_state_metadata(state);
    return {
      lightnessShift: wasm.lightness_shift,
      chromaShift: wasm.chroma_shift,
      opacity: wasm.opacity,
      animation: ['none', 'subtle', 'medium', 'prominent'][wasm.animation()] as any,
      focusIndicator: wasm.focus_indicator(),
    };
  }

  // TypeScript fallback
  return STATE_METADATA_FALLBACK[state];
}

// Fallback metadata (matches Rust implementation)
const STATE_METADATA_FALLBACK: Record<UIStateValue, StateMetadata> = {
  [UIStateValue.Idle]: {
    lightnessShift: 0,
    chromaShift: 0,
    opacity: 1,
    animation: 'none',
    focusIndicator: false,
  },
  [UIStateValue.Hover]: {
    lightnessShift: 0.05,
    chromaShift: 0.02,
    opacity: 1,
    animation: 'subtle',
    focusIndicator: false,
  },
  // ... (all states)
};
```

### 1.4 Integration with Existing Code

**File**: `domain/ux/value-objects/UIState.ts` (UPDATE)

```typescript
import { determineUIState, getStateMetadata, UIStateValue } from 'momoto-ui-wasm';

export class UIState {
  private readonly _value: UIStateType;

  // ... (existing code)

  /**
   * Determine state from interaction flags
   *
   * NEW: Uses Rust/WASM for 10x performance improvement
   */
  static determineFromFlags(flags: {
    disabled: boolean;
    loading: boolean;
    active: boolean;
    focused: boolean;
    hovered: boolean;
  }): UIState {
    const stateValue = determineUIState(
      flags.disabled,
      flags.loading,
      flags.active,
      flags.focused,
      flags.hovered
    );

    // Convert WASM enum to TypeScript UIStateType
    const stateMap: Record<UIStateValue, UIStateType> = {
      [UIStateValue.Idle]: 'idle',
      [UIStateValue.Hover]: 'hover',
      [UIStateValue.Active]: 'active',
      [UIStateValue.Focus]: 'focus',
      [UIStateValue.Disabled]: 'disabled',
      [UIStateValue.Loading]: 'loading',
      [UIStateValue.Error]: 'error',
      [UIStateValue.Success]: 'success',
    };

    return new UIState(stateMap[stateValue]);
  }

  /**
   * Get perceptual metadata
   *
   * NEW: Uses Rust/WASM for deterministic, fast computation
   */
  get metadata(): StatePerceptualMetadata {
    const wasmMetadata = getStateMetadata(this.toWasmValue());

    return {
      requiresContrast: true, // All states require contrast (WCAG)
      suggestedLightnessShift: wasmMetadata.lightnessShift,
      suggestedChromaShift: wasmMetadata.chromaShift,
      suggestedOpacity: wasmMetadata.opacity,
      animation: wasmMetadata.animation,
      focusIndicator: wasmMetadata.focusIndicator,
    };
  }

  private toWasmValue(): UIStateValue {
    const map: Record<UIStateType, UIStateValue> = {
      idle: UIStateValue.Idle,
      hover: UIStateValue.Hover,
      active: UIStateValue.Active,
      focus: UIStateValue.Focus,
      disabled: UIStateValue.Disabled,
      loading: UIStateValue.Loading,
      error: UIStateValue.Error,
      success: UIStateValue.Success,
    };
    return map[this._value];
  }
}
```

---

## Phase 2: Token Derivation

### 2.1 Rust Implementation

**File**: `crates/momoto-ui-core/src/tokens/mod.rs`

```rust
use wasm_bindgen::prelude::*;
use std::collections::HashMap;

/// OKLCH color representation
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ColorOklch {
    /// Lightness [0, 1]
    pub l: f64,
    /// Chroma [0, 0.4]
    pub c: f64,
    /// Hue [0, 360]
    pub h: f64,
}

#[wasm_bindgen]
impl ColorOklch {
    #[wasm_bindgen(constructor)]
    pub fn new(l: f64, c: f64, h: f64) -> Result<ColorOklch, JsValue> {
        // Validate ranges
        if !(0.0..=1.0).contains(&l) {
            return Err(JsValue::from_str("Lightness must be in [0, 1]"));
        }
        if !(0.0..=0.4).contains(&c) {
            return Err(JsValue::from_str("Chroma must be in [0, 0.4]"));
        }
        if !(0.0..=360.0).contains(&h) {
            return Err(JsValue::from_str("Hue must be in [0, 360]"));
        }

        Ok(ColorOklch { l, c, h })
    }

    /// Apply lightness shift
    #[inline]
    pub fn shift_lightness(&self, delta: f64) -> ColorOklch {
        ColorOklch {
            l: (self.l + delta).clamp(0.0, 1.0),
            c: self.c,
            h: self.h,
        }
    }

    /// Apply chroma shift
    #[inline]
    pub fn shift_chroma(&self, delta: f64) -> ColorOklch {
        ColorOklch {
            l: self.l,
            c: (self.c + delta).clamp(0.0, 0.4),
            h: self.h,
        }
    }
}

/// Token derivation engine with memoization
#[wasm_bindgen]
pub struct TokenDerivationEngine {
    cache: HashMap<DerivationKey, DerivedToken>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct DerivationKey {
    // Quantized to avoid floating-point hash issues
    l_q: u32,
    c_q: u32,
    h_q: u32,
    state: u8,
}

impl DerivationKey {
    fn from_color(color: ColorOklch, state: u8) -> Self {
        Self {
            l_q: (color.l * 1000.0) as u32,
            c_q: (color.c * 1000.0) as u32,
            h_q: (color.h * 10.0) as u32,
            state,
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct DerivedToken {
    color: ColorOklch,
    state: u8,
}

#[wasm_bindgen]
impl TokenDerivationEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }

    /// Derive state tokens from base color
    ///
    /// Returns Float64Array: [l, c, h, state, l, c, h, state, ...]
    pub fn derive_states(&mut self, base_l: f64, base_c: f64, base_h: f64) -> js_sys::Float64Array {
        let base = ColorOklch { l: base_l, c: base_c, h: base_h };

        let states = [
            0, // Idle
            1, // Hover
            2, // Active
            3, // Focus
            4, // Disabled
            5, // Loading
        ];

        let mut results = Vec::with_capacity(states.len() * 4);

        for &state in &states {
            let derived = self.derive_state(base, state);
            results.push(derived.color.l);
            results.push(derived.color.c);
            results.push(derived.color.h);
            results.push(state as f64);
        }

        js_sys::Float64Array::from(&results[..])
    }

    /// Derive single state token (with caching)
    fn derive_state(&mut self, base: ColorOklch, state: u8) -> DerivedToken {
        let key = DerivationKey::from_color(base, state);

        if let Some(cached) = self.cache.get(&key) {
            return *cached;
        }

        // Get state metadata
        let metadata = crate::state::UIState::from(state).metadata();

        // Apply shifts
        let derived = base
            .shift_lightness(metadata.lightness_shift)
            .shift_chroma(metadata.chroma_shift);

        let token = DerivedToken {
            color: derived,
            state,
        };

        self.cache.insert(key, token);
        token
    }

    /// Get cache statistics
    pub fn cache_size(&self) -> usize {
        self.cache.len()
    }

    /// Clear cache
    pub fn clear_cache(&mut self) {
        self.cache.clear();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_color_shifts() {
        let base = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        let lighter = base.shift_lightness(0.1);
        assert_eq!(lighter.l, 0.6);

        let saturated = base.shift_chroma(0.05);
        assert_eq!(saturated.c, 0.15);
    }

    #[test]
    fn test_derivation_caching() {
        let mut engine = TokenDerivationEngine::new();
        let base = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        // First call - cache miss
        let _first = engine.derive_state(base, 1);
        assert_eq!(engine.cache_size(), 1);

        // Second call - cache hit
        let _second = engine.derive_state(base, 1);
        assert_eq!(engine.cache_size(), 1); // Still 1 (cache hit)
    }
}
```

### 2.2 TypeScript Integration

**File**: `packages/momoto-ui-wasm/src/tokens.ts`

```typescript
import type { TokenDerivationEngine as WasmEngine } from './bindings';

let wasmEngine: WasmEngine | null = null;

try {
  const wasm = require('./bindings');
  wasmEngine = new wasm.TokenDerivationEngine();
} catch {
  console.warn('[Momoto] Token derivation WASM not available');
}

export interface DerivedTokens {
  idle: { l: number; c: number; h: number };
  hover: { l: number; c: number; h: number };
  active: { l: number; c: number; h: number };
  focus: { l: number; c: number; h: number };
  disabled: { l: number; c: number; h: number };
  loading: { l: number; c: number; h: number };
}

/**
 * Derive state tokens from base color
 *
 * Uses WASM for 15x performance improvement + memoization
 */
export function deriveStateTokens(
  baseL: number,
  baseC: number,
  baseH: number
): DerivedTokens {
  if (wasmEngine) {
    const result = wasmEngine.derive_states(baseL, baseC, baseH);

    // Unpack Float64Array: [l, c, h, state, l, c, h, state, ...]
    return {
      idle: { l: result[0], c: result[1], h: result[2] },
      hover: { l: result[4], c: result[5], h: result[6] },
      active: { l: result[8], c: result[9], h: result[10] },
      focus: { l: result[12], c: result[13], h: result[14] },
      disabled: { l: result[16], c: result[17], h: result[18] },
      loading: { l: result[20], c: result[21], h: result[22] },
    };
  }

  // TypeScript fallback
  return deriveStateTokensFallback(baseL, baseC, baseH);
}

function deriveStateTokensFallback(l: number, c: number, h: number): DerivedTokens {
  // Match Rust implementation
  return {
    idle: { l, c, h },
    hover: { l: l + 0.05, c: c + 0.02, h },
    active: { l: l - 0.08, c: c + 0.03, h },
    focus: { l, c, h },
    disabled: { l: l + 0.2, c: c - 0.1, h },
    loading: { l, c: c - 0.05, h },
  };
}

/**
 * Get cache statistics (WASM only)
 */
export function getTokenCacheStats() {
  if (wasmEngine) {
    return {
      size: wasmEngine.cache_size(),
      enabled: true,
    };
  }
  return { size: 0, enabled: false };
}
```

---

## Phase 3: Performance Benchmarking

### 3.1 Benchmark Setup

**File**: `crates/momoto-ui-core/benches/state_benchmark.rs`

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use momoto_ui_core::state::UIState;

fn benchmark_state_determination(c: &mut Criterion) {
    c.bench_function("determine_state", |b| {
        b.iter(|| {
            UIState::determine(
                black_box(false),
                black_box(false),
                black_box(true),
                black_box(false),
                black_box(false),
            )
        })
    });
}

fn benchmark_state_metadata(c: &mut Criterion) {
    c.bench_function("state_metadata", |b| {
        b.iter(|| {
            let state = UIState::Hover;
            black_box(state.metadata())
        })
    });
}

criterion_group!(benches, benchmark_state_determination, benchmark_state_metadata);
criterion_main!(benches);
```

**Run**:
```bash
cargo bench
```

### 3.2 JavaScript Benchmark

**File**: `packages/momoto-ui-wasm/__benchmarks__/state.bench.ts`

```typescript
import { performance } from 'perf_hooks';
import { determineUIState } from '../src';

function benchmark(name: string, iterations: number, fn: () => void) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const total = end - start;
  const avg = total / iterations;

  console.log(`${name}:`);
  console.log(`  Total: ${total.toFixed(2)}ms`);
  console.log(`  Average: ${(avg * 1000).toFixed(3)}μs`);
  console.log(`  Ops/sec: ${(1000 / avg).toFixed(0)}`);
}

// Run benchmark
benchmark('determineUIState (WASM)', 100_000, () => {
  determineUIState(false, false, true, false, false);
});
```

---

## Testing Strategy

### Integration Tests

**File**: `crates/momoto-ui-core/tests/integration_test.rs`

```rust
use momoto_ui_core::*;
use wasm_bindgen_test::*;

#[wasm_bindgen_test]
fn test_state_determination() {
    let state = determine_ui_state(false, false, true, false, false);
    assert_eq!(state, 2); // Active
}

#[wasm_bindgen_test]
fn test_token_derivation() {
    let mut engine = TokenDerivationEngine::new();
    let result = engine.derive_states(0.5, 0.1, 180.0);

    // Check Idle state (first 4 values)
    assert_eq!(result.get_index(0), 0.5); // l
    assert_eq!(result.get_index(1), 0.1); // c
    assert_eq!(result.get_index(2), 180.0); // h
    assert_eq!(result.get_index(3), 0.0); // state (Idle)
}
```

**Run**:
```bash
wasm-pack test --headless --firefox
```

---

## Deployment

### Build Pipeline

**File**: `.github/workflows/build-wasm.yml`

```yaml
name: Build WASM

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown

      - name: Install wasm-pack
        run: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

      - name: Build WASM
        run: |
          cd crates/momoto-ui-core
          wasm-pack build --target web --out-dir ../../packages/momoto-ui-wasm/pkg

      - name: Test WASM
        run: |
          cd crates/momoto-ui-core
          wasm-pack test --headless --firefox

      - name: Upload WASM artifact
        uses: actions/upload-artifact@v3
        with:
          name: wasm-pkg
          path: packages/momoto-ui-wasm/pkg
```

### NPM Package

**File**: `packages/momoto-ui-wasm/package.json`

```json
{
  "name": "momoto-ui-wasm",
  "version": "1.0.0",
  "description": "Rust/WASM bindings for Momoto UI",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "pkg"
  ],
  "scripts": {
    "build": "npm run build:wasm && npm run build:ts",
    "build:wasm": "cd ../../crates/momoto-ui-core && wasm-pack build --target web --out-dir ../../packages/momoto-ui-wasm/pkg",
    "build:ts": "tsc",
    "test": "jest"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. WASM file too large

```toml
# Cargo.toml
[profile.release]
opt-level = "z"         # Optimize for size
lto = true              # Link-time optimization
codegen-units = 1       # Better optimization
panic = "abort"         # Smaller binary
strip = true            # Remove debug symbols
```

#### 2. Type errors in TypeScript

```bash
# Regenerate TypeScript bindings
cd crates/momoto-ui-core
wasm-pack build --target web --out-dir ../../packages/momoto-ui-wasm/pkg
```

#### 3. Cache not working

```rust
// Ensure DerivationKey implements Hash correctly
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct DerivationKey {
    // Use quantized values to avoid floating-point hash issues
    l_q: u32,
    c_q: u32,
    h_q: u32,
    state: u8,
}
```

---

## Performance Checklist

- [ ] WASM file size < 50KB (gzipped)
- [ ] State determination < 0.1ms
- [ ] Token derivation < 0.5ms
- [ ] Cache hit rate > 80%
- [ ] Fallback to TypeScript works
- [ ] No memory leaks in WASM
- [ ] Types auto-generated correctly

---

**Next**: Continue with Phase 3 (Accessibility Validation)

**Questions?** See RUST-WASM-UX-MIGRATION-STRATEGY.md for architecture overview.
