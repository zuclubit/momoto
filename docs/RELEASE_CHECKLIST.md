# Release Checklist - Momoto 1.0.0-rc1

## Pre-Release Verification

### Scientific Validation

- [x] OKLCH conversion accuracy < 1% (P4)
- [x] Roundtrip stability ±2/1000 iterations (P5-FT)
- [x] Gamma correction IEC 61966-2-1 compliant
- [x] Golden values match Björn Ottosson reference
- [x] Cross-runtime consistency verified

### Test Coverage

- [x] Unit tests passing (32)
- [x] Contract lock tests passing (23)
- [x] Stress tests passing (8)
- [x] Performance tests passing (4)
- [x] Doc tests passing (1)
- [x] **Total: 68 tests, 0 failures**

### Documentation

- [x] API_REFERENCE.md complete
- [x] SCIENTIFIC_FOUNDATIONS.md complete
- [x] INTEGRATION_GUIDE.md complete
- [x] CHANGELOG.md created
- [x] README.md updated

### API Stability

- [x] Tier 1 APIs identified and frozen
- [x] Contract tests guard all guarantees
- [x] Breaking change detection in place

---

## Version Updates

### Rust Crates

- [x] `momoto-ui-core/Cargo.toml` → workspace version
- [x] Workspace `Cargo.toml` → 1.0.0-rc1

### npm Package

- [x] `package.json` → 1.0.0-rc1

---

## Build Verification

### Rust Build

```bash
# Run in project root
cargo build --release
cargo test --all
```

- [ ] Build succeeds
- [ ] All tests pass
- [ ] No warnings

### WASM Build

```bash
# Build WASM package
cd crates/momoto-ui-core
wasm-pack build --target web --release
```

- [ ] WASM builds successfully
- [ ] Package size acceptable

### npm Build

```bash
npm run build
npm run typecheck
```

- [ ] TypeScript compiles
- [ ] No type errors
- [ ] Bundle size acceptable

---

## Quality Gates

### Performance

| Metric | Target | Status |
|--------|--------|--------|
| State determination | < 100ns | PASS (15ns) |
| WCAG contrast | < 1µs | PASS (<1µs) |
| APCA contrast | < 1µs | PASS (<1µs) |
| Token derivation | < 10µs | PASS |

### Accuracy

| Metric | Target | Status |
|--------|--------|--------|
| L error | < 1% | PASS (0.04%) |
| C error | < 2% | PASS (0.07%) |
| Roundtrip drift | ±2 | PASS |

### Accessibility

| Metric | Status |
|--------|--------|
| WCAG 2.1 compliance | PASS |
| APCA implementation | PASS |
| Contrast thresholds | LOCKED |

---

## Publication Checklist

### crates.io (Rust)

- [ ] Cargo.toml metadata complete
- [ ] License file present
- [ ] README.md present
- [ ] `cargo publish --dry-run` succeeds
- [ ] Version: 1.0.0-rc1

### npm (JavaScript/TypeScript)

- [ ] package.json metadata complete
- [ ] LICENSE file present
- [ ] README.md present
- [ ] `npm pack --dry-run` succeeds
- [ ] Version: 1.0.0-rc1

---

## Post-Release

### Monitoring

- [ ] Install from crates.io works
- [ ] Install from npm works
- [ ] Documentation accessible
- [ ] No critical issues reported

### Communication

- [ ] Release notes published
- [ ] Changelog updated
- [ ] Migration guide (if applicable)

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Scientific Validation | P3-P5 | 2026-01-31 | COMPLETE |
| Documentation | P6-DOC | 2026-01-31 | COMPLETE |
| Contract Lock | P7 | 2026-01-31 | COMPLETE |
| Release | P8 | 2026-01-31 | READY |

---

## Release Command Reference

### Rust (crates.io)

```bash
# Dry run first
cargo publish -p momoto-ui-core --dry-run

# Actual publish
cargo publish -p momoto-ui-core
```

### npm

```bash
# Dry run first
npm pack --dry-run

# Actual publish
npm publish --tag rc
```

---

**Status**: READY FOR RELEASE

**Version**: 1.0.0-rc1

**Date**: 2026-01-31
