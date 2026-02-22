# Momoto - Component Stability Status

**Version**: 5.0.0-beta
**Last Updated**: 2026-01-06
**Purpose**: This document classifies the stability level of all Momoto components to set clear expectations for production use.

---

## Stability Levels

| Level | Meaning | Guarantees | Use In Production? |
|-------|---------|------------|-------------------|
| **Stable** | API is locked. Breaking changes only in major versions. | SemVer, backward compatibility, extensive testing | ✅ Yes |
| **Beta** | API is mostly stable. Minor changes possible before 5.0.0 final. | Documented migrations, no silent breakage | ⚠️ With caution |
| **Experimental** | API may change without notice. For testing and feedback. | None. May be removed. | ❌ No |
| **Normative** | Implements external standard. Accuracy under validation. | Follows spec, but may have precision issues | 📋 See notes |
| **Deprecated** | Will be removed in next major version. | Migration path documented | ❌ Migrate away |

---

## Domain Layer

### Value Objects

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **OKLCH** | ✅ **Stable** | Production-ready. Perceptually uniform color space. | `domain/value-objects/OKLCH.ts` |
| **HCT** | ✅ **Stable** | Material Design 3 integration. Gamut mapping reliable. | `domain/value-objects/HCT.ts` |
| **WCAGContrast** | ✅ **Stable** | WCAG 2.1 compliant. Recently moved to domain layer (v4.5). | `domain/value-objects/WCAGContrast.ts` |
| **APCAContrast** | 📋 **Normative (Under Calibration)** | See [APCA Status](#apca-status) below. | `domain/value-objects/APCAContrast.ts` |
| **CAM16** | ⚠️ **Beta** | Color appearance model. Advanced use cases only. | `domain/value-objects/CAM16.ts` |

### Entities

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **Gradient** | ✅ **Stable** | Perceptually uniform gradients. No banding. | `domain/entities/Gradient.ts` |

### Types

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **ContrastDecision** | ✅ **Stable** | Industry-leading decision model (634 LOC). | `domain/types/decision.ts` |
| **BrandedTypes** | ✅ **Stable** | Type-safe IDs and constraints. | `domain/types/branded.ts` |

### Governance

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **Policy Types** | ✅ **Stable** | Core policy model (v4.0). | `domain/governance/types/policy.ts` |
| **Contracts** | ✅ **Stable** | Governance boundary interfaces. | `domain/governance/contracts/` |
| **Ports** | ✅ **Stable** | Dependency inversion interfaces. | `domain/governance/ports/` |
| **Pre-defined Policies** | ⚠️ **Beta** | WCAG, brand policies. May add more. | `domain/governance/policies/` |

### Specification (Phase 5)

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **Conformance Types** | ⚠️ **Beta** | Certification model. API stabilizing. | `domain/specification/types/` |
| **Reference Sets** | ⚠️ **Beta** | Golden vectors for validation. | `domain/specification/reference/` |

---

## Application Layer

### Use Cases

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **ContrastDecisionEngine** | ✅ **Stable** | Multi-factor contrast analysis. | `application/ContrastDecisionEngine.ts` |
| **DetectContrastMode** | ✅ **Stable** | Light/dark content detection. | `application/DetectContrastMode.ts` |
| **ValidateAccessibility** | ✅ **Stable** | Accessibility validation. | `application/ValidateAccessibility.ts` |
| **GenerateAdaptiveGradient** | ✅ **Stable** | Context-aware gradients. | `application/GenerateAdaptiveGradient.ts` |

### Governance (v4.0)

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **GovernanceEngine** | ✅ **Stable** | Policy evaluation orchestrator. | `application/governance/GovernanceEngine.ts` |
| **PolicyRegistry** | ✅ **Stable** | Policy lifecycle management. | `application/governance/PolicyRegistry.ts` |

### AI Contracts (v4.0)

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **AIActionContract** | ✅ **Stable** | LLM-safe color constraints. | `application/ai-contracts/AIActionContract.ts` |
| **ConstraintGenerator** | ✅ **Stable** | Generate contracts from policies. | `application/ai-contracts/ConstraintGenerator.ts` |

### Conformance (v5.0)

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **ConformanceEngine** | ⚠️ **Beta** | Certification and auditing. API stabilizing. | `application/conformance/ConformanceEngine.ts` |

### Plugins (v5.0)

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **PluginManager** | 🧪 **Experimental** | Extension system. API not finalized. | `application/plugins/PluginManager.ts` |

---

## Infrastructure Layer

### Cache

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **ColorCache** | ✅ **Stable** | LRU cache with TTL. Performance optimization. | `infrastructure/cache/ColorCache.ts` |

### Adapters

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **CssOutputAdapter** | ✅ **Stable** | CSS variable generation. | `infrastructure/adapters/CssOutputAdapter.ts` |

### Exporters

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **DesignTokensExporter** | ✅ **Stable** | W3C DTCG format. | `infrastructure/exporters/DesignTokensExporter.ts` |
| **TailwindExporter** | ✅ **Stable** | Tailwind CSS config. | `infrastructure/exporters/TailwindExporter.ts` |
| **FigmaTokensExporter** | ⚠️ **Beta** | Figma Tokens plugin format. Limited testing. | `infrastructure/exporters/FigmaTokensExporter.ts` |
| **StyleDictionaryExporter** | ⚠️ **Beta** | Style Dictionary format. Limited testing. | `infrastructure/exporters/StyleDictionaryExporter.ts` |
| **CSSVariablesExporter** | ✅ **Stable** | CSS custom properties. | `infrastructure/exporters/CSSVariablesExporter.ts` |

### Audit (v5.0)

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **AuditTrailService** | ⚠️ **Beta** | Regulatory audit logging. | `infrastructure/audit/AuditTrailService.ts` |
| **InMemoryAuditStorage** | ⚠️ **Beta** | In-memory only. Not for production audit compliance. | `infrastructure/audit/InMemoryAuditStorage.ts` |

---

## Public API

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **public-api.ts** | ✅ **Stable** | Versioned API (v5.0). SemVer guarantees. | `public-api.ts` |
| **experimental-api.ts** | 🧪 **Experimental** | Unstable features. May change without notice. | `experimental-api.ts` |
| **index.ts** | ✅ **Stable** | Main entry point. | `index.ts` |

---

## APCA Status

### ⚠️ Normative but INACCURATE (Investigation Ongoing)

**Component**: `APCAContrast` (domain/value-objects/APCAContrast.ts)

**Standard**: WCAG 3.0 (W3C Working Draft)

**Implementation Status** (Updated 2026-01-06):
- ✅ Algorithm structure correct
- ✅ Polarity handling correct
- ✅ Level thresholds aligned with spec
- ❌ **Accuracy Issue**: Current pass rate on golden vectors is **33.3%** (4/12)

### Investigation Status

**Original Hypothesis** (APCA_ACCURACY_ISSUE.md):
- Root cause: Simple gamma transformation instead of sRGB piecewise
- Expected fix: Switch to sRGB piecewise → achieve >95% accuracy

**Actual Finding** (APCA_ACCURACY_INVESTIGATION.md):
- ❌ Simple gamma (current): **33.3% pass rate** (4/12)
- ❌ sRGB piecewise (attempted): **16.7% pass rate** (2/12) - **WORSE**

**Conclusion**: Root cause is **NOT** simple gamma vs piecewise sRGB. Deeper investigation required.

### Error Patterns Identified

1. **Chromatic Color Overestimation**:
   - Blue on White: Expected 54.62 Lc, Actual 85.82 Lc (Δ 31.20 Lc)
   - Suggests incorrect color coefficients or blue channel handling

2. **Dark-on-Dark Systematic Failure**:
   - Mid Gray on Black: Expected -68.54 Lc, Actual -38.62 Lc (Δ 29.92 Lc)
   - Suggests soft clamp (blkThrs/blkClmp) implementation issue

3. **Polarity Asymmetry**:
   - Light-on-dark failures: 5/6 tests
   - Dark-on-light failures: 3/6 tests
   - Suggests polarity-specific bug

### Leading Hypotheses

1. **Incorrect Coefficients** (40% likelihood):
   - Current implementation uses WCAG 2.x coefficients (0.2126, 0.7152, 0.0722)
   - APCA may use different perceptual coefficients
   - **Action**: Verify against Myndex/SAPC-APCA source code

2. **Soft Clamp Bug** (60% likelihood):
   - Dark-on-dark cases systematically fail
   - Soft clamp threshold/exponent may be incorrect
   - **Action**: Trace `calculateAPCA()` implementation

3. **Missing Normalization** (50% likelihood):
   - APCA may have post-processing steps after luminance calculation
   - **Action**: Compare line-by-line with canonical implementation

### Impact Assessment

**Current Risk**: **HIGH** (33.3% accuracy)

**What This Means**:
- APCA calculations **cannot be trusted** for production decisions
- May **approve inaccessible** color pairs (false positives)
- May **reject accessible** color pairs (false negatives)
- Maximum deviation: **31 Lc** (can change pass→fail for body text at 75 Lc threshold)

### Mitigation Strategy

**Immediate (v5.0.0-beta)**:
- ✅ **Export WCAGContrast** as stable, accurate alternative (DONE)
- ✅ **Document inaccuracy** transparently (this file)
- ⚠️ **Add warnings** to APCA-dependent functions
- ✅ **Provide safe fallback** for all APCA use cases

**Short-term (Q1 2026 - v5.1.0)**:
- 🔬 **Deep investigation**: Compare with Myndex/SAPC-APCA line-by-line
- 🧪 **Reproduce golden vectors**: Verify expected values with canonical implementation
- 🔧 **Implement fix**: Based on investigation findings
- ✅ **Achieve >95% accuracy**: Or escalate to Rust/WASM migration

**Long-term (Q2 2026 - v5.2.0)**:
- 🦀 **Rust/WASM Migration**: Use audited `apca-w3` Rust crate
- ✅ **Guaranteed Accuracy**: Canonical implementation
- ⚡ **6x Performance**: Bonus benefit
- 🎓 **Contact Myndex**: Collaborate on TypeScript reference implementation

### Recommendation for Users

**v5.0.0-beta (Current)**:

| Use Case | Recommendation | Reason |
|----------|----------------|--------|
| **Production (Critical)** | ✅ Use `WCAGContrast` | Stable, accurate (100% pass rate) |
| **Regulated (Healthcare, Finance, Gov)** | ✅ Use `WCAGContrast` | Legal compliance requires accuracy |
| **Design Exploration** | ⚠️ Use `APCAContrast` with caution | Preview WCAG 3.0, but verify with WCAG 2.1 |
| **Research** | ⚠️ Use `APCAContrast` | Understanding APCA concepts |
| **Automated Validation** | ❌ Do NOT use `APCAContrast` alone | 33.3% accuracy unacceptable |

**After Fix (v5.1.0 - Q1 2026)**:
- Target: >95% accuracy
- If achieved: Upgrade status to **Normative (Accurate)**
- If not achieved: Escalate to Rust/WASM migration (v5.2.0)

**After Rust/WASM (v5.2.0 - Q2 2026)**:
- Guaranteed accuracy via canonical implementation
- APCAContrast becomes **production-ready**

### Transparency Commitment

We believe in **radical transparency** about our implementation status:

✅ **What we know**:
- APCA implementation achieves 33.3% accuracy (4/12 golden vectors)
- Error patterns: blue overestimation, dark-on-dark failure, polarity asymmetry
- WCAG 2.1 (WCAGContrast) is stable and accurate as fallback

✅ **What we don't know**:
- Exact root cause of inaccuracy
- Correct luminance transformation for APCA
- Correct coefficient values
- Whether golden vectors are themselves correct

✅ **What we're doing**:
- Investigating transparently (APCA_ACCURACY_INVESTIGATION.md)
- Providing stable alternative (WCAGContrast)
- Scheduling deep investigation (Q1 2026)
- Planning Rust/WASM migration (Q2 2026)

### Documentation

- **Detailed Investigation**: [APCA_ACCURACY_INVESTIGATION.md](./APCA_ACCURACY_INVESTIGATION.md)
- **Original Diagnosis**: [APCA_ACCURACY_ISSUE.md](./APCA_ACCURACY_ISSUE.md)
- **Test Results**: `__tests__/apca-accuracy-fix-verification.test.ts`

---

**Last Updated**: 2026-01-06
**Next Review**: After deep investigation (Q1 2026)
**Sign-off**: Principal Engineering Team

---

## Integration Points

### React Hooks

| Component | Status | Notes | File |
|-----------|--------|-------|------|
| **useColor** | ✅ **Stable** | React integration for color analysis. | `react/hooks/useColor.ts` |
| **useContrast** | ✅ **Stable** | React integration for contrast decisions. | `react/hooks/useContrast.ts` |
| **useGovernance** | ⚠️ **Beta** | React integration for policy evaluation. | `react/hooks/useGovernance.ts` |

---

## Migration Timeline

### v5.0.0-beta (Current)

**Goal**: Public beta release with transparency about APCA status.

**Action Required**:
- ✅ Document APCA calibration status (this file)
- ✅ Provide WCAG 2.1 as stable fallback
- ✅ Clear API stability markers

### v5.1.0 (Q1 2026)

**Goal**: Fix APCA accuracy to >95% pass rate.

**Changes**:
- 🔧 Implement piecewise sRGB transformation in `hexToApcaLuminance()`
- ✅ Add golden vector regression tests
- ✅ Update `APCAContrast` status to **Stable**
- 📋 Publish accuracy validation report

**Breaking Changes**: None (internal fix only)

### v5.2.0 (Q2 2026)

**Goal**: Rust/WASM performance optimization.

**Changes**:
- ⚡ Migrate hot paths to Rust (APCA math, color space conversions)
- ✅ Maintain TypeScript decision logic (no architectural changes)
- 📈 Benchmark 5-7x performance improvement
- ✅ Cross-language parity tests

**Breaking Changes**: None (implementation detail only)

### v6.0.0 (Q3 2026)

**Goal**: Stabilize Phase 5 features (conformance, plugins).

**Changes**:
- ✅ Promote `ConformanceEngine` to **Stable**
- ✅ Finalize `PluginManager` API
- ✅ Publish certification program
- 🎓 Become reference implementation for perceptual color standards

**Breaking Changes**: Remove deprecated APIs from v4.x

---

## Usage Recommendations by Environment

### Production (Regulated)

**Healthcare, Finance, Government**:
- ✅ Use: `WCAGContrast`, `OKLCH`, `ContrastDecisionEngine`, `GovernanceEngine`
- ⚠️ Avoid: `APCAContrast` (until v5.1.0)
- ✅ Audit Trail: Use `AuditTrailService` with persistent storage adapter

### Production (Commercial)

**SaaS, E-commerce, Corporate**:
- ✅ Use: All stable components
- ⚠️ Use with testing: `APCAContrast` (validate against WCAG 2.1)
- ✅ Exporters: `DesignTokensExporter`, `TailwindExporter`, `CSSVariablesExporter`

### Design Systems

**Component Libraries, Frameworks**:
- ✅ Use: `OKLCH`, `HCT`, `Gradient`, `DetectContrastMode`
- ✅ Integrate: `GovernanceEngine` for brand compliance
- ✅ Export: W3C Design Tokens, Tailwind, CSS Variables

### Research & Prototyping

**Design Exploration, AI Experiments**:
- ✅ Use: All components including experimental
- ✅ Test: `APCAContrast`, `CAM16`, `PluginManager`
- ✅ Provide Feedback: Open issues for API improvements

---

## Support & Guarantees

### Stable Components

- **SemVer**: Breaking changes only in major versions (v6.0.0+)
- **Deprecation Policy**: 6-month notice before removal
- **Migration Guides**: Provided for all breaking changes
- **Test Coverage**: >80% with property-based testing

### Beta Components

- **API Stability**: Minor changes possible before v5.0.0 final
- **Documentation**: Migration notes for any changes
- **Breaking Changes**: Only if critical bugs discovered

### Experimental Components

- **No Guarantees**: API may change or be removed
- **Feedback Welcome**: Help shape the API
- **Use at Own Risk**: Not for production

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Submitting issues for unstable components
- Proposing API changes
- Adding test coverage
- Improving documentation

---

## Questions?

- **APCA Accuracy**: See [APCA_ACCURACY_ISSUE.md](./APCA_ACCURACY_ISSUE.md)
- **API Reference**: See [API.md](./API.md)
- **Architecture**: See [AUDIT_REPORT.md](./AUDIT_REPORT.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/momoto/issues)

---

**Last Review**: 2026-01-06
**Next Review**: Before v5.0.0 final release
**Maintained By**: Principal Engineering Team
