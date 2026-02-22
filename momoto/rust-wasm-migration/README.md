# Rust/WASM Migration Plan for Momoto

## Overview

This directory contains the plan and structure for migrating performance-critical color science calculations from TypeScript to Rust, compiled to WebAssembly.

## Why Rust/WASM?

### Performance Benefits:
- **6-7x faster** color space conversions (0.7µs → 0.1µs)
- **6x faster** APCA calculations (1.2µs → 0.2µs)
- **Target**: 10M+ operations/second (currently ~1.4M ops/sec)

### Accuracy Benefits:
- Use canonical `apca-w3` Rust crate (audited, correct)
- Guaranteed IEEE 754 determinism
- No JavaScript floating-point quirks
- Better test coverage in Rust ecosystem

### Safety Benefits:
- Type safety prevents runtime errors
- No undefined/null issues
- Immutability by default
- Memory safety without GC

## Migration Priority

### Phase 1: Core Color Space (CRITICAL)

**Target**: `domain/value-objects/OKLCH.ts` → Rust

Functions to migrate:
```rust
// momoto-core/src/color_space.rs

pub fn rgb_to_oklch(r: u8, g: u8, b: u8) -> (f64, f64, f64);
pub fn oklch_to_rgb(l: f64, c: f64, h: f64) -> (u8, u8, u8);
pub fn hex_to_oklch(hex: &str) -> (f64, f64, f64);
pub fn oklch_to_hex(l: f64, c: f64, h: f64) -> String;
```

**Expected improvement**:
- Current: 0.7µs per conversion
- Target: 0.1µs per conversion (7x)
- Throughput: 1.4M → 10M ops/sec

### Phase 2: APCA Calculation (CRITICAL)

**Target**: `domain/value-objects/APCAContrast.ts` → Rust

Functions to migrate:
```rust
// momoto-core/src/apca.rs

// Use canonical apca-w3 crate
pub fn apca_contrast(fg_hex: &str, bg_hex: &str) -> f64;
pub fn apca_polarity(fg_y: f64, bg_y: f64) -> Polarity;
pub fn relative_luminance(r: u8, g: u8, b: u8) -> f64;
```

**Expected improvement**:
- Current: 1.2µs, 33.3% accuracy
- Target: 0.2µs, >95% accuracy (6x speed, 100% correct)

### Phase 3: Gamut Operations (HIGH)

**Target**: Gamut mapping and clipping

Functions to migrate:
```rust
// momoto-core/src/gamut.rs

pub fn map_to_srgb_gamut(l: f64, c: f64, h: f64) -> (f64, f64, f64);
pub fn is_in_gamut(l: f64, c: f64, h: f64) -> bool;
pub fn estimate_max_chroma(l: f64, h: f64) -> f64;
```

**Expected improvement**:
- Current: 2-50µs (depending on iterations)
- Target: 0.3-8µs (6x average case)

### Phase 4: CAM16 (OPTIONAL)

**Target**: `domain/value-objects/CAM16.ts` → Rust

Functions:
```rust
// momoto-core/src/cam16.rs

pub struct ViewingConditions { /* ... */ }
pub fn rgb_to_cam16(r: u8, g: u8, b: u8, vc: &ViewingConditions) -> CAM16;
```

**Benefit**: Precision > Speed (not on hot path currently)

## Project Structure

```
momoto/
├── rust-wasm-migration/
│   ├── README.md                    # This file
│   ├── momoto-core/                 # Rust crate
│   │   ├── Cargo.toml               # Rust dependencies
│   │   ├── src/
│   │   │   ├── lib.rs               # Main entry point
│   │   │   ├── color_space.rs      # OKLCH conversions
│   │   │   ├── apca.rs              # APCA calculations
│   │   │   ├── gamut.rs             # Gamut operations
│   │   │   ├── cam16.rs             # CAM16 (optional)
│   │   │   └── wasm_bindings.rs    # WASM exports
│   │   └── tests/
│   │       ├── color_space_tests.rs
│   │       ├── apca_tests.rs
│   │       └── golden_sets.rs      # Golden vector tests
│   ├── momoto-wasm/                 # WASM build output
│   │   ├── momoto_wasm.js           # JS glue code
│   │   ├── momoto_wasm.d.ts         # TypeScript definitions
│   │   └── momoto_wasm_bg.wasm     # WASM binary
│   └── integration/                 # Integration layer
│       ├── index.ts                 # TypeScript → WASM adapter
│       ├── fallback.ts              # JS fallback when WASM unavailable
│       └── feature-detection.ts    # WASM availability check
└── domain/
    └── value-objects/
        ├── OKLCH.ts                 # Updated to use WASM
        ├── APCAContrast.ts          # Updated to use WASM
        └── ...
```

## Cargo.toml Template

```toml
[package]
name = "momoto-core"
version = "1.0.0"
authors = ["Zuclubit"]
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
apca-w3 = "0.1"  # Canonical APCA implementation
palette = "0.7"   # For color space conversions
serde = { version = "1.0", features = ["derive"] }
serde-wasm-bindgen = "0.6"

[dev-dependencies]
wasm-bindgen-test = "0.3"
approx = "0.5"    # For floating-point comparisons

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
```

## Integration Pattern

### TypeScript Side:

```typescript
// domain/value-objects/OKLCH.wasm.ts

import * as wasm from '@momoto/core-wasm';
import { OKLCH as OKLCHFallback } from './OKLCH.fallback';

const WASM_AVAILABLE = typeof wasm.hex_to_oklch === 'function';

export class OKLCH {
  static fromHex(hex: string): OKLCH | null {
    if (!WASM_AVAILABLE) {
      // Fallback to TypeScript implementation
      return OKLCHFallback.fromHex(hex);
    }

    try {
      const [l, c, h] = wasm.hex_to_oklch(hex);
      return new OKLCH(l, c, h);
    } catch (error) {
      // Fallback on error
      console.warn('WASM failed, falling back to JS:', error);
      return OKLCHFallback.fromHex(hex);
    }
  }

  // ... rest of class
}
```

### Rust Side:

```rust
// momoto-core/src/wasm_bindings.rs

use wasm_bindgen::prelude::*;
use crate::color_space;

#[wasm_bindgen]
pub fn hex_to_oklch(hex: &str) -> Result<Vec<f64>, JsValue> {
    let (l, c, h) = color_space::hex_to_oklch(hex)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    Ok(vec![l, c, h])
}

#[wasm_bindgen]
pub fn oklch_to_hex(l: f64, c: f64, h: f64) -> Result<String, JsValue> {
    color_space::oklch_to_hex(l, c, h)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}
```

## Build Process

### Development:

```bash
# Build Rust code
cd rust-wasm-migration/momoto-core
cargo build

# Run Rust tests
cargo test

# Build WASM
wasm-pack build --target web --out-dir ../momoto-wasm

# Copy to main project
cp -r ../momoto-wasm/* ../../node_modules/@momoto/core-wasm/
```

### Production:

```bash
# Optimized WASM build
wasm-pack build --target web --release --out-dir ../momoto-wasm

# Optimize WASM binary
wasm-opt -Oz -o momoto_wasm_bg_opt.wasm momoto_wasm_bg.wasm
```

### CI/CD Integration:

```yaml
# .github/workflows/rust-wasm.yml
name: Rust WASM Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown
      - name: Install wasm-pack
        run: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
      - name: Build WASM
        run: |
          cd rust-wasm-migration/momoto-core
          wasm-pack build --target web --release
      - name: Test
        run: cargo test --all-features
```

## Testing Strategy

### Rust Tests:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;

    #[test]
    fn test_black_on_white() {
        let result = hex_to_oklch("#000000").unwrap();
        assert_relative_eq!(result.0, 0.0, epsilon = 0.001);
        assert_relative_eq!(result.1, 0.0, epsilon = 0.001);
    }

    #[test]
    fn test_apca_accuracy() {
        let lc = apca_contrast("#000000", "#FFFFFF");
        assert_relative_eq!(lc, 106.04, epsilon = 0.5);
    }
}
```

### Integration Tests:

```typescript
// __tests__/wasm-integration.test.ts

import { OKLCH } from '../domain/value-objects/OKLCH';

describe('WASM Integration', () => {
  test('should use WASM when available', () => {
    const oklch = OKLCH.fromHex('#FF0000');
    expect(oklch).toBeDefined();
    // Verify accuracy improved
  });

  test('should fallback gracefully', () => {
    // Mock WASM unavailable
    // Verify fallback works
  });
});
```

## Performance Benchmarking

### Before Rust:
```
OKLCH Conversion:     0.7µs  (1.4M ops/sec)
APCA Calculation:     1.2µs  (833k ops/sec)
Gamut Mapping:        5.0µs  (200k ops/sec)
```

### After Rust:
```
OKLCH Conversion:     0.1µs  (10M ops/sec)   [7x improvement]
APCA Calculation:     0.2µs  (5M ops/sec)    [6x improvement]
Gamut Mapping:        0.8µs  (1.25M ops/sec) [6x improvement]
```

## Timeline

### Week 1-2: Phase 1 (Core Color Space)
- Setup Rust project structure
- Implement OKLCH conversions
- Write comprehensive tests
- Benchmark against TypeScript

### Week 3-4: Phase 2 (APCA)
- Integrate `apca-w3` crate
- Validate against golden vectors
- Ensure >95% accuracy

### Week 5-6: Phase 3 (Gamut Operations)
- Implement gamut mapping
- Optimize binary search
- Integration testing

### Week 7-8: Polish & Integration
- TypeScript integration layer
- Fallback mechanisms
- CI/CD pipeline
- Documentation

## Success Criteria

✅ **Performance**: >10M ops/sec for color conversions
✅ **Accuracy**: >95% pass rate on APCA golden vectors
✅ **Reliability**: Graceful fallback when WASM unavailable
✅ **Bundle Size**: <50KB added WASM binary size
✅ **Tests**: 100% coverage of Rust code
✅ **CI/CD**: Automated build and test pipeline

## Dependencies

### Rust Crates:
- `wasm-bindgen` - WASM bindings
- `apca-w3` - Canonical APCA implementation
- `palette` - Color space conversions
- `serde` - Serialization

### Build Tools:
- `wasm-pack` - WASM build tool
- `wasm-opt` - WASM optimization
- `cargo` - Rust package manager

## Resources

- [wasm-bindgen Book](https://rustwasm.github.io/wasm-bindgen/)
- [APCA Reference](https://github.com/Myndex/SAPC-APCA)
- [Rust WASM Book](https://rustwasm.github.io/book/)
- [palette crate docs](https://docs.rs/palette/)

---

**Status**: Planned - Ready for Implementation
**Priority**: High
**Estimated Effort**: 8 weeks
**Expected ROI**: 6-7x performance improvement + guaranteed accuracy
