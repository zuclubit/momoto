# Changelog

All notable changes to the Momoto Design System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] — Monorepo Migration — 2026-02-22

### Changed — Repository Architecture

- **True monorepo**: Rust engine (`zuclubit/momoto`) merged into this repo via `git subtree add --squash`
- **npm workspaces** configured: `packages/*` automatically linked
- **`@momoto-ui/wasm@7.0.0`** replaces old `momoto-wasm` (v5.0.0) as the canonical workspace package
- **`@momoto-ui/crystal`** dependency on `@momoto-ui/wasm` now resolves via npm workspace (no `file:` path)
- **Root `.gitignore`**: ignores `momoto/target/`, `momoto/crates/*/pkg/` (build artifacts) instead of `momoto/` entirely
- **Removed `@momoto/topocho-crm`** from the project (apps/topocho-crm eliminated)

### Added — Monorepo Scripts

| Script | Command |
|--------|---------|
| `build:wasm` | `wasm-pack build` → `packages/momoto-ui-wasm/` (bundler) |
| `build:wasm:web` | `wasm-pack build` → web target (ES modules) |
| `build:engine` | `cargo build --release` in `momoto/` |
| `test:engine` | `cargo test` in `momoto/` |
| `build:crystal` | Build `@momoto-ui/crystal` |
| `build:all` | `build:wasm` + `build` + `build:crystal` |

### Engine — Documentation Updated (v7.0.0)

- `README.md` fully rewritten: monorepo structure, all 9 WASM modules, installation, development workflow
- `docs/API.md` fully rewritten: complete WASM API reference (188 entries, 280+ methods)
- `docs/website/index.html`: interactive explorer with correct Sprint 3/4 physics presets
- `docs/api/llms.txt`: LLM context document with complete API, constants, CVD matrices

### Fixed — DynamicMieParams Preset Names

Corrected 8 dynamic presets (previously hallucinated names):
`stratocumulus`, `fog`, `smoke`, `milk`, `dust`, `iceCrystals`, `condensingFog`, `evaporatingMist`

---

## [1.0.0-rc1] - 2026-01-31

### Release Candidate 1

First release candidate of the Momoto Design System. This release includes:

- Scientifically validated OKLCH color conversion
- Perceptually uniform state token derivation
- WCAG 2.1 and APCA accessibility validation
- Comprehensive contract lock tests

### Added

#### Core Features
- `ColorOklch` - OKLCH color representation with perceptually uniform operations
- `UIState` - Type-safe UI state machine with priority resolution
- `ContrastResult` - Combined WCAG/APCA contrast validation
- `TokenDerivationEngine` - Memoized token generation for UI states

#### Scientific Implementation
- Björn Ottosson's exact transformation matrices for OKLCH
- IEC 61966-2-1 compliant sRGB gamma correction
- WCAG 2.1 relative luminance calculation
- APCA-W3 perceptual contrast algorithm

#### Accessibility
- `validate_contrast()` - Combined WCAG + APCA validation
- `passes_wcag_aa()` - Quick WCAG AA check
- `batch_validate_contrast()` - High-performance batch validation
- Constants: `WCAG_AA_NORMAL`, `WCAG_AA_LARGE`, `WCAG_AAA_NORMAL`, `WCAG_AAA_LARGE`
- Constants: `APCA_MIN_BODY`, `APCA_MIN_LARGE`

#### State Machine
- `determine_ui_state()` - O(1) state resolution from flags
- `get_state_metadata()` - Perceptual shifts for each state
- `get_state_priority()` - Priority values for state combination
- `combine_states()` - Resolve multiple states to highest priority

#### Documentation
- `docs/API_REFERENCE.md` - Complete API documentation
- `docs/SCIENTIFIC_FOUNDATIONS.md` - Mathematical specifications
- `docs/INTEGRATION_GUIDE.md` - Framework integration guides

### Scientific Validation

#### Accuracy Metrics (P4/P5-FT)
- Lightness error: < 0.1% (requirement: < 1%)
- Chroma error: < 0.1% (requirement: < 2%)
- Roundtrip stability: ±2 after 1000 iterations

#### Golden Values Verified
| Color | RGB | Computed L | Reference L | Error |
|-------|-----|------------|-------------|-------|
| Red | (255,0,0) | 0.6280 | 0.628 | 0.00% |
| Green | (0,255,0) | 0.8664 | 0.866 | 0.04% |
| Blue | (0,0,255) | 0.4520 | 0.452 | 0.00% |

### Test Coverage

| Category | Tests |
|----------|-------|
| Unit tests | 32 |
| Contract lock tests | 23 |
| Stress tests | 8 |
| Performance tests | 4 |
| Doc tests | 1 |
| **Total** | **68** |

### API Stability

#### Tier 1 (Frozen - SemVer Guaranteed)
- `ColorOklch`
- `UIState`
- `ContrastLevel`
- `ContrastResult`
- `validate_contrast()`
- `determine_ui_state()`
- `get_state_metadata()`
- `get_state_priority()`
- WCAG/APCA constants

#### Tier 2 (Stable)
- `TokenDerivationEngine`
- `batch_derive_tokens()`
- `batch_validate_contrast()`

#### Tier 3 (Internal)
- Transformation matrices
- Gamma correction functions

### Breaking Changes

None. This is the first release.

### Deprecated

None.

### Removed

None.

### Fixed

- OKLCH conversion accuracy (P4 remediation)
  - Previous: Up to 40.5% error for blue
  - After: < 0.1% error for all colors

### Security

No security issues.

---

## Unreleased

### Planned for 1.0.0

- Final validation of all edge cases
- Performance benchmarks publication
- Additional framework adapters

---

## Version History

- **1.0.0-rc1** (2026-01-31) - First release candidate
- **0.x.x** - Development versions (internal)

---

## References

- [OKLCH Color Space](https://bottosson.github.io/posts/oklab/) - Björn Ottosson
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) - W3C
- [APCA-W3](https://www.myndex.com/APCA/) - Accessible Perceptual Contrast Algorithm
- [IEC 61966-2-1](https://www.color.org/chardata/rgb/srgb.xalter) - sRGB Standard
