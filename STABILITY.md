# Momoto Module Stability Contracts

**Version:** 6.0.0
**Effective:** 2026-02-01
**Authority:** STRATEGIC_EVOLUTION_FRAMEWORK.md
**Governance:** rfcs/RFC-PROCESS.md

---

## Purpose

This document defines stability contracts for Momoto modules at the crate level.
While `API_STABILITY.md` covers individual API stability levels, this document
governs **which modules can change and how**.

Every module falls into one of three categories:
- **Frozen** — Cannot change without extraordinary process
- **Conserved** — Can evolve with RFC approval
- **Experimental** — Can change freely within boundaries

---

## Module Classification

### FROZEN Modules (Tier 0)

These modules represent foundational infrastructure. Changes require:
- RFC with explicit justification
- 2+ major version deprecation cycle
- Zero alternatives exist

| Module | Frozen Since | Rationale |
|--------|--------------|-----------|
| `momoto-core::color` | v1.0 | Color representation is foundational |
| `momoto-core::oklch` | v1.0 | OKLCH is the perceptual anchor |
| `momoto-core::oklab` | v1.0 | OKLab is the computational anchor |
| `momoto-core::gamma` | v1.0 | Gamma utilities are industry standard |
| `momoto-metrics::wcag` | v1.0 | WCAG compliance is standards-bound |
| `momoto-metrics::apca` | v1.0 | APCA algorithm is externally defined |
| `momoto-metrics::contrast` | v1.0 | Contrast trait is the extensibility contract |

**Frozen Module Rules:**
1. No public API changes
2. No behavior changes
3. Internal refactoring allowed only if tests pass
4. Bug fixes must not change observable behavior (within tolerance)
5. Performance improvements allowed if mathematically equivalent

### CONSERVED Modules (Tier 1)

These modules are stable but may evolve. Changes require:
- RFC for any public API change
- Deprecation before removal
- Migration documentation

| Module | Conserved Since | Evolution Scope |
|--------|-----------------|-----------------|
| `momoto-core::material` | v2.0 | New material types allowed |
| `momoto-core::evaluated` | v3.0 | New evaluation outputs allowed |
| `momoto-core::backend` | v3.0 | New backends allowed |
| `momoto-intelligence::recommendation` | v4.0 | New recommendation strategies allowed |
| `momoto-intelligence::quality` | v4.0 | New quality metrics allowed |
| `momoto-materials::fresnel` | v5.0 | Precision improvements allowed |
| `momoto-materials::bsdf` | v5.0 | New BSDF types allowed |
| `momoto-materials::thin_film` | v5.0 | Algorithm improvements allowed |
| `momoto-materials::lut` | v5.0 | New LUT strategies allowed |
| `momoto-materials::presets` | v5.0 | New presets allowed |
| `momoto-wasm` (public bindings) | v5.0 | Mirrors Rust API changes |

**Conserved Module Rules:**
1. Additions require RFC
2. Modifications require RFC + deprecation
3. Removals require RFC + 1 major version deprecation
4. Behavior changes require RFC + migration guide
5. Breaking changes require RFC + major version bump

### EXPERIMENTAL Modules (Tier 2)

These modules are research-grade. Changes are allowed with:
- Documentation of change
- Test coverage for new behavior
- No stability guarantees

| Module | Status | Notes |
|--------|--------|-------|
| `momoto-materials::differentiable` | EXPERIMENTAL | Gradient computation research |
| `momoto-materials::metrology` | EXPERIMENTAL | Scientific measurement |
| `momoto-materials::validation` | EXPERIMENTAL | Ground truth comparison |
| `momoto-materials::plugin` | EXPERIMENTAL | Renderer plugins |
| `momoto-materials::neural` | EXPERIMENTAL | Neural network correction |
| `momoto-materials::glass_physics` | EXPERIMENTAL | Advanced glass models |

**Experimental Module Rules:**
1. May change without RFC
2. May be removed without deprecation
3. Must be feature-gated
4. Must not affect non-experimental modules
5. Users opt-in explicitly

---

## Protected APIs

These specific APIs have additional protection beyond their module classification.
They are **immutable contracts** that external systems depend on.

### Mathematical Constants

```rust
// PROTECTED: These values are physics/standards constants
// Changes require scientific justification + RFC

pub const SRGB_GAMMA: f32 = 2.4;
pub const SRGB_LINEAR_THRESHOLD: f32 = 0.04045;
pub const OKLCH_WHITE_POINT: [f32; 3] = [0.95047, 1.0, 1.08883]; // D65
pub const WCAG_CONTRAST_THRESHOLD_AA: f32 = 4.5;
pub const WCAG_CONTRAST_THRESHOLD_AAA: f32 = 7.0;
pub const WCAG_LARGE_TEXT_THRESHOLD_AA: f32 = 3.0;
pub const WCAG_LARGE_TEXT_THRESHOLD_AAA: f32 = 4.5;
```

### Trait Definitions

```rust
// PROTECTED: These traits define extensibility contracts
// Adding methods is breaking; requires major version

pub trait ContrastMetric {
    fn evaluate(&self, fg: &Color, bg: &Color) -> PerceptualResult;
    fn passes(&self, fg: &Color, bg: &Color, level: WCAGLevel) -> bool;
}

pub trait ColorBackend {
    fn name(&self) -> &'static str;
    fn evaluate(&self, material: &GlassMaterial, ctx: &MaterialContext) -> EvaluatedMaterial;
}

pub trait RenderBackend {
    fn name(&self) -> &'static str;
    fn render(&self, ctx: &RenderContext) -> RenderOutput;
}

pub trait BSDF {
    fn evaluate(&self, ctx: &BSDFContext) -> BSDFResponse;
}
```

### Type Signatures

```rust
// PROTECTED: These types are serialization boundaries
// Field changes require migration support

pub struct Color { /* field layout frozen */ }
pub struct OKLCH { /* field layout frozen */ }
pub struct OKLab { /* field layout frozen */ }
pub struct GlassMaterial { /* field layout frozen */ }
pub struct WCAGMetric { /* field layout frozen */ }
pub struct APCAMetric { /* field layout frozen */ }
```

---

## Change Authority Matrix

| Change Type | Frozen | Conserved | Experimental |
|-------------|--------|-----------|--------------|
| Bug fix (no behavior change) | Allowed | Allowed | Allowed |
| Performance improvement | Allowed* | Allowed | Allowed |
| Add public API | FORBIDDEN | RFC required | Allowed |
| Modify public API | FORBIDDEN | RFC + deprecation | Allowed |
| Remove public API | FORBIDDEN | RFC + major version | Allowed |
| Change behavior | FORBIDDEN | RFC + migration | Allowed |
| Add dependency | FORBIDDEN | RFC required | Allowed** |

\* Must be mathematically equivalent
\** Must not leak to stable modules

---

## Cross-Module Dependencies

### Dependency Direction (Enforced)

```
momoto-wasm
    ↓
momoto-intelligence
    ↓
momoto-materials
    ↓
momoto-metrics
    ↓
momoto-core
```

**Rules:**
1. Lower modules MUST NOT depend on higher modules
2. Experimental modules MUST NOT be depended on by stable modules
3. Cross-crate dependencies require explicit justification

### Feature Flag Boundaries

```
[STABLE features]
  ↓ may enable
[BETA features]
  ↓ may enable
[EXPERIMENTAL features]
```

**Rules:**
1. Stable features MUST NOT require experimental features
2. Beta features MAY require stable features
3. Experimental features MAY require any features

---

## Compliance Verification

### CI/CD Quality Gates

The following checks enforce stability contracts:

1. **API Diff Check**: Detects public API changes
   - Frozen modules: Fail on any change
   - Conserved modules: Require RFC reference
   - Experimental modules: Document change

2. **Dependency Check**: Validates dependency direction
   - Circular dependencies: Fail build
   - Upward dependencies: Fail build
   - Experimental in stable: Fail build

3. **Behavior Regression**: Mathematical precision tests
   - Frozen algorithms: ±0 tolerance
   - Conserved algorithms: ±1e-10 tolerance
   - Experimental: Per-test tolerance

4. **Documentation Check**: Ensures stability annotations
   - All public items have stability marker
   - Deprecations have migration notes
   - RFCs are linked in code

---

## Versioning Implications

| Module Tier | Patch (x.x.Y) | Minor (x.Y.0) | Major (Y.0.0) |
|-------------|---------------|---------------|---------------|
| Frozen | Bug fixes only | Bug fixes only | RFC changes |
| Conserved | Bug fixes | Additions | Any change |
| Experimental | Any | Any | Any |

**SemVer Commitment:**
- Momoto follows strict SemVer for Frozen and Conserved modules
- Experimental modules are explicitly excluded from SemVer guarantees

---

## Exception Process

In extraordinary circumstances, a Frozen module may require changes:

### Requirements

1. **RFC required** with explicit justification
2. **Security** or **scientific correctness** rationale
3. **No alternatives** have been identified
4. **Migration path** is fully documented
5. **2+ major version** deprecation cycle

### Recent Exceptions

| Date | Module | RFC | Reason |
|------|--------|-----|--------|
| None | — | — | No exceptions granted since v6.0.0 |

---

## Monitoring

### Stability Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Frozen modules with changes | 0 | 0 |
| Conserved APIs without RFC | 0 | 0 |
| Undocumented experimental APIs | < 10% | 0% |
| Protected API violations | 0 | 0 |

### Annual Review

Stability contracts are reviewed annually to:
1. Promote experimental modules to conserved (if mature)
2. Promote conserved modules to frozen (if stable)
3. Archive unmaintained experimental modules
4. Update metrics and targets

---

## References

- [API_STABILITY.md](./API_STABILITY.md) — Individual API stability levels
- [STRATEGIC_EVOLUTION_FRAMEWORK.md](./STRATEGIC_EVOLUTION_FRAMEWORK.md) — Governing principles
- [rfcs/RFC-PROCESS.md](./rfcs/RFC-PROCESS.md) — RFC process specification
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guidelines

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-01 | Initial stability contracts for v6.0.0 |

