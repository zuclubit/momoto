# Contributing to Momoto

Thank you for your interest in contributing to Momoto.

Momoto is **infrastructure**, not an application. Contributions are held to
the standards of scientific software and critical infrastructure.

---

## Governance Documents (Read First)

1. [STRATEGIC_EVOLUTION_FRAMEWORK.md](./STRATEGIC_EVOLUTION_FRAMEWORK.md) - Governing principles
2. [STABILITY.md](./STABILITY.md) - Module stability contracts
3. [API_STABILITY.md](./API_STABILITY.md) - API stability levels
4. [rfcs/RFC-PROCESS.md](./rfcs/RFC-PROCESS.md) - Change process for significant changes
5. [SECURITY.md](./SECURITY.md) - Security policy
4. [STABILITY.md](./STABILITY.md) - Module stability contracts

---

## Philosophy

Momoto prioritizes:

1. **Correctness** over convenience
2. **Stability** over features
3. **Transparency** over speed
4. **Science** over opinion

If your contribution optimizes for something else, it may not be accepted.

---

## Types of Contributions

### Always Welcome (No RFC Required)

- Bug fixes (with tests)
- Documentation improvements
- Test coverage improvements
- Performance improvements (without API changes)
- Typo fixes
- Error message improvements

### Requires Discussion First

Open an issue before starting work:

- New public APIs
- Behavior changes
- New dependencies
- CI/CD changes

### Requires RFC

See [rfcs/RFC-PROCESS.md](./rfcs/RFC-PROCESS.md):

- New public API (function, type, trait)
- Removal or deprecation of existing API
- Changes to algorithm behavior
- New crate in workspace
- Breaking changes (any)

---

## Development Setup

### Prerequisites

- Rust 1.70+ (stable)
- wasm-pack (for WASM development)
- clippy and rustfmt (included with rustup)

### Clone and Build

```bash
git clone https://github.com/momoto/momoto.git
cd momoto

# Build all crates
cargo build --workspace

# Run tests
cargo test --workspace

# Check for issues
cargo clippy --workspace -- -D warnings
cargo fmt --all -- --check
```

### Useful Commands

```bash
# Run specific crate tests
cargo test -p momoto-core
cargo test -p momoto-materials

# Run with all features
cargo test --workspace --all-features

# Generate documentation
cargo doc --workspace --no-deps --open

# Build WASM package
cd crates/momoto-wasm
wasm-pack build --target web
```

---

## Code Requirements

All contributions must meet these requirements:

### Tests

- [ ] All existing tests pass
- [ ] New functionality has tests
- [ ] Edge cases are covered
- [ ] Property-based tests for invariants (where applicable)

### Quality

- [ ] No clippy warnings: `cargo clippy --workspace -- -D warnings`
- [ ] Code is formatted: `cargo fmt --all`
- [ ] Documentation for public items
- [ ] Examples compile and run

### SemVer Compliance

- [ ] Patch: Bug fixes only, no API changes
- [ ] Minor: New features, no breaking changes
- [ ] Major: Breaking changes (requires RFC)

---

## Commit Guidelines

### Format

```
type(scope): short description

Longer description if needed.

Fixes: #123
Implements: RFC-XXXX (if applicable)
```

### Types

- `fix` - Bug fixes
- `feat` - New features
- `docs` - Documentation
- `test` - Tests
- `refactor` - Refactoring
- `perf` - Performance
- `ci` - CI/CD changes

### Scopes

- `core` - momoto-core
- `metrics` - momoto-metrics
- `intelligence` - momoto-intelligence
- `materials` - momoto-materials
- `wasm` - momoto-wasm
- `cli` - momoto-cli (when created)

### Examples

```
fix(core): handle edge case in OKLCH gamut mapping

The previous implementation could produce NaN for extreme
lightness values. Added clamping before sqrt.

Fixes: #123
```

```
feat(materials): add sapphire material preset

Implements: RFC-0042
```

---

## Pull Request Process

### Before Submitting

1. Fork and create a branch: `git checkout -b fix/issue-123`
2. Make changes following guidelines above
3. Ensure all checks pass
4. Update documentation if needed
5. Reference related issues/RFCs

### PR Checklist

- [ ] Tests pass: `cargo test --workspace`
- [ ] No warnings: `cargo clippy --workspace -- -D warnings`
- [ ] Formatted: `cargo fmt --all`
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for features/fixes)
- [ ] RFC referenced (if required)

### Review Process

1. Automated checks must pass
2. At least 1 maintainer review
3. Address feedback
4. Maintainer approval required

### What Blocks Merge

- Failing tests
- Clippy warnings
- Missing documentation for public items
- Breaking changes without RFC
- RFC-required changes without RFC

---

## What NOT to Contribute

Per [STRATEGIC_EVOLUTION_FRAMEWORK.md](./STRATEGIC_EVOLUTION_FRAMEWORK.md):

**Do not submit:**

- Generative AI features
- Design token generation
- CSS framework integrations
- "Convenience" wrappers that hide correctness
- Features without clear use cases
- Dependencies without justification

**These will be rejected without discussion.**

---

## Areas Seeking Contributions

### High Priority

- Documentation improvements
- Test coverage for edge cases
- Accessibility validation testing
- Error message improvements

### Medium Priority

- Performance benchmarks
- Integration examples
- Tutorial content

### Long-Term

- Formal verification exploration
- Academic collaborations
- Standards body engagement

---

## Code of Conduct

### Expected Behavior

- Be respectful and professional
- Provide constructive feedback
- Focus on correctness, not aesthetics
- Show empathy toward other contributors

### Unacceptable Behavior

- Harassment or discrimination
- Personal attacks
- Submitting code known to be incorrect
- Gaming metrics (coverage, etc.)

---

## Getting Help

- **Issues**: For bugs and feature discussions
- **Discussions**: For questions and ideas
- **RFCs**: For significant changes

---

## License

By contributing, you agree that your contributions will be licensed
under the MIT License.

---

## Recognition

All contributors are recognized in CHANGELOG.md for their contributions.

Thank you for helping make Momoto better.
