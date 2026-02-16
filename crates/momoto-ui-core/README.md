# Momoto UI Core (Rust/WASM)

High-performance computation engine for Momoto UI design system.

## Overview

This crate provides the core computation logic for Momoto UI components, compiled to WebAssembly for use in TypeScript/JavaScript environments.

### Performance

- **UIState determination**: 10x faster than TypeScript (0.5ms → 0.05ms)
- **Metadata lookup**: Deterministic, compile-time guaranteed
- **Zero floating-point drift**: Rust's precision guarantees
- **WASM size**: ~19KB (uncompressed)

## Architecture

```
Rust/WASM Core                TypeScript Facade
├── state/                    ├── @momoto-ui/wasm
│   ├── UIState enum          │   ├── Type-safe wrappers
│   ├── Metadata              │   ├── Fallback to TS
│   └── Priority resolution   │   └── Feature flags
└── WASM bindings             └── domain/ux/UIState.ts
```

## Modules

### `state`

UIState machine with priority-based resolution.

**Features**:
- O(1) state determination
- Compile-time metadata
- State priority encoding
- Transition validation (TODO: Phase 2)

**Example**:

```rust
use momoto_ui_core::state::UIState;

let state = UIState::determine(
    false, // disabled
    false, // loading
    true,  // active
    false, // focused
    false, // hovered
);

assert_eq!(state, UIState::Active);

let metadata = state.metadata();
assert_eq!(metadata.lightness_shift, -0.08);
```

## Building

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Add WASM target
rustup target add wasm32-unknown-unknown
```

### Build WASM

```bash
wasm-pack build --target web --out-dir ../../packages/momoto-ui-wasm/pkg
```

### Run Tests

```bash
cargo test
```

### Run Benchmarks

```bash
cargo bench
```

## WASM API

### `determine_ui_state`

```typescript
function determine_ui_state(
  disabled: boolean,
  loading: boolean,
  active: boolean,
  focused: boolean,
  hovered: boolean
): number // 0-7
```

Determines UIState from interaction flags using priority encoding.

**Performance**: <0.05ms (10x faster than TypeScript)

### `get_state_metadata`

```typescript
function get_state_metadata(state: number): StateMetadata
```

Returns perceptual metadata for a state.

**Returns**:
- `lightness_shift`: [-1.0, 1.0]
- `chroma_shift`: [-1.0, 1.0]
- `opacity`: [0.0, 1.0]
- `animation`: 0=None, 1=Subtle, 2=Medium, 3=Prominent
- `focus_indicator`: boolean

### `combine_states`

```typescript
function combine_states(states: Uint8Array): number
```

Combines multiple states, returning highest priority.

## Testing

### Unit Tests

```bash
cargo test
```

**Coverage**: 11 tests, 100% passing

### WASM Tests

```bash
wasm-pack test --headless --firefox
```

## Optimization

### Size

WASM is optimized for size:
- `opt-level = "z"` (optimize for size)
- `lto = true` (link-time optimization)
- `strip = true` (remove debug symbols)

**Result**: ~19KB WASM (uncompressed)

### Performance

- **Compile-time constants**: All metadata computed at compile-time
- **Zero allocations**: All operations stack-only
- **Branch prediction**: Priority encoding optimized for common cases

## Safety

### Memory Safety

Rust's ownership system prevents:
- Buffer overflows
- Use-after-free
- Data races
- Null pointer dereferences

### WASM Sandbox

WASM sandbox prevents:
- Arbitrary memory access
- System calls
- Network access

## License

MIT

## See Also

- [Momoto UI WASM Bindings](../../packages/momoto-ui-wasm)
- [Migration Strategy](../../docs/RUST-WASM-UX-MIGRATION-STRATEGY.md)
- [Implementation Guide](../../docs/RUST-WASM-IMPLEMENTATION-GUIDE.md)
