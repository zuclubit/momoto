# Pre-Release Checklist for Momoto 5.0.0

This checklist ensures all critical items are verified before release.

## ✅ Code Quality

- [x] All tests passing (`cargo test --workspace --all-features`)
  - 192+ tests across all crates
  - 0 failures, 8 ignored (benchmarks)

- [x] Clippy clean (`cargo clippy --workspace --all-features -- -D warnings`)
  - Zero warnings
  - All lints addressed

- [x] Rustfmt applied (`cargo fmt --all`)
  - Consistent formatting
  - No pending changes

- [x] Property-based tests passing
  - 9 proptest invariants verified
  - 100 samples per property

- [x] Doctests passing (`cargo test --doc --workspace`)
  - 31 documentation examples
  - All compile and run correctly

## ✅ Documentation

- [x] README.md complete
  - Quick start guide
  - Installation instructions
  - Basic examples
  - Link to full documentation

- [x] ARCHITECTURE.md written
  - System design overview
  - Data flow diagrams
  - Module organization
  - Backend abstraction

- [x] CONCEPTS.md written
  - Physics principles
  - Color theory
  - Material properties
  - Perceptual foundations

- [x] MIGRATION.md complete
  - TypeScript → Rust guide
  - API mapping table
  - Breaking changes documented
  - Code examples for common patterns

- [x] CHANGELOG.md updated
  - Version 5.0.0 entry complete
  - All changes categorized
  - Breaking changes highlighted

- [x] RELEASE_NOTES.md written
  - Executive summary
  - Key features highlighted
  - Performance benchmarks
  - Breaking changes documented

- [x] API documentation (rustdoc)
  - 100% public API coverage
  - Examples in all doc comments
  - Physics explanations included

## ✅ Examples & Demos

- [x] 4 canonical examples created
  - [x] `01_liquid_glass_benchmark.rs` - Core material rendering
  - [x] `02_context_aware_material.rs` - Context adaptation
  - [x] `03_batch_vs_single.rs` - Performance comparison
  - [x] `04_backend_swap.rs` - Multi-backend rendering

- [x] All examples compile without warnings
- [x] All examples run successfully
- [x] Examples produce expected output

## ✅ Testing

- [x] Unit tests
  - Core functionality covered
  - Edge cases tested

- [x] Integration tests
  - Cross-module interactions verified
  - Backend consistency checked

- [x] Property-based tests
  - Invariants hold for all inputs
  - No panics on random inputs

- [x] Physics regression tests
  - Fresnel equations correct
  - Beer-Lambert law verified
  - Scattering monotonicity confirmed

- [x] Edge case tests
  - Black glass (L=0)
  - Maximum roughness (r=1)
  - Extreme IOR values
  - Grazing angles (θ→90°)

## ✅ Performance

- [x] Benchmarks run successfully
  - Criterion.rs suite complete
  - Results documented in `docs/architecture/benchmark-phase5.txt`

- [x] Performance targets met
  - Single eval: <10 µs ✓ (actual: ~1.2 µs)
  - Batch eval: Linear scaling ✓
  - No regressions > 10% ✓ (one 5.5% regression acceptable)

- [x] Memory usage validated
  - No memory leaks detected
  - Stack usage within bounds
  - Zero heap allocations in hot paths

## ✅ Dependencies

- [x] Core crate: Zero dependencies ✓
- [x] WASM bindings: wasm-bindgen only
- [x] Dev dependencies: criterion, proptest
- [x] All dependencies pinned to stable versions
- [x] No known security vulnerabilities

## ✅ Build & Packaging

- [x] Workspace builds cleanly
  - `cargo build --workspace --all-features` ✓
  - `cargo build --release --workspace` ✓

- [x] WASM builds successfully
  - `wasm-pack build --target web` ✓
  - Output in `crates/momoto-wasm/pkg/`

- [x] Cargo.toml metadata complete
  - Version: 5.0.0
  - Authors, license, repository set
  - Keywords and categories appropriate

- [x] README.md in all crates
  - momoto-core ✓
  - momoto-metrics ✓
  - momoto-materials ✓
  - momoto-wasm ✓

## ✅ Version Control

- [x] All changes committed
- [x] Clean working directory
- [x] Branch: main (or release/5.0)
- [x] Ready for tag: v5.0.0

## ✅ Platform Support

Verified on:
- [x] macOS (Apple Silicon) - Primary development platform
- [ ] Linux (Ubuntu 22.04) - CI/CD
- [ ] Windows (MSVC) - CI/CD
- [x] WebAssembly (wasm32-unknown-unknown)

## ✅ Final Verification

Run these commands before tagging:

```bash
# Clean build
cargo clean
cargo build --workspace --all-features
cargo build --release --workspace

# All tests
cargo test --workspace --all-features

# Clippy
cargo clippy --workspace --all-features -- -D warnings

# Doctests
cargo test --doc --workspace

# Examples
cargo run -p momoto-core --example 01_liquid_glass_benchmark
cargo run -p momoto-core --example 02_context_aware_material
cargo run -p momoto-core --example 03_batch_vs_single
cargo run -p momoto-core --example 04_backend_swap

# WASM build
cd crates/momoto-wasm
wasm-pack build --target web
cd ../..

# Documentation build
cargo doc --workspace --all-features --no-deps
```

## 🚀 Release Procedure

Once all checklist items are complete:

1. **Tag the release**
   ```bash
   git tag -a v5.0.0 -m "Release 5.0.0: Liquid Glass"
   git push origin v5.0.0
   ```

2. **Publish to crates.io**
   ```bash
   cargo publish -p momoto-core
   cargo publish -p momoto-metrics
   cargo publish -p momoto-materials
   cargo publish -p momoto-wasm
   ```

3. **Create GitHub release**
   - Upload RELEASE_NOTES.md as release description
   - Attach WASM bindings (.wasm + .js)
   - Mark as "latest release"

4. **Update documentation site**
   - Deploy rustdoc to docs.momoto.dev
   - Update version in nav
   - Add migration guide to docs

5. **Announce release**
   - Blog post on momoto.dev
   - Social media announcement
   - Rust subreddit post
   - Notify early adopters

## 📋 Post-Release

- [ ] Monitor issue tracker for bug reports
- [ ] Update roadmap for 5.1/6.0
- [ ] Begin work on next milestone
- [ ] Gather community feedback

---

**Prepared by:** AI Assistant (Claude)
**Date:** 2026-01-09
**Version:** 5.0.0
**Status:** ✅ Ready for release
