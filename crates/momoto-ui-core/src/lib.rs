//! Momoto UI Core - Rust/WASM computation engine
//!
//! This crate provides the core computation logic for Momoto UI components.
//! It's compiled to WebAssembly for use in TypeScript/JavaScript environments.
//!
//! # Modules
//!
//! - `state` - UIState machine with priority resolution
//! - `color` - OKLCH color representation and manipulation
//! - `tokens` - Token derivation engine with memoization
//!
//! # Architecture
//!
//! Momoto follows a hybrid architecture:
//! - **Rust/WASM**: Handles computation (state resolution, token derivation, a11y validation)
//! - **TypeScript**: Handles presentation (rendering, DOM, framework integration)
//!
//! This provides:
//! - 10-15x performance improvements
//! - Compile-time correctness guarantees
//! - Deterministic behavior across platforms
//! - Zero breaking changes (WASM is internal optimization)
//!
//! # Example
//!
//! ```rust,no_run
//! use momoto_ui_core::state::UIState;
//! use momoto_ui_core::color::ColorOklch;
//! use momoto_ui_core::tokens::TokenDerivationEngine;
//!
//! // Determine state from interaction flags
//! let state = UIState::determine(
//!     false, // disabled
//!     false, // loading
//!     true,  // active
//!     false, // focused
//!     false, // hovered
//! );
//!
//! assert_eq!(state, UIState::Active);
//!
//! // Derive tokens for a color
//! let mut engine = TokenDerivationEngine::new();
//! let base = ColorOklch::new(0.5, 0.1, 180.0).unwrap();
//! let tokens = engine.derive_states(base.l, base.c, base.h).unwrap();
//! ```

pub mod state;
pub mod color;
pub mod tokens;
pub mod a11y;

// Re-export commonly used types
pub use state::{
    UIState,
    StateMetadata,
    determine_ui_state,
    get_state_metadata,
    get_state_priority,
    combine_states,
};

pub use color::ColorOklch;

pub use tokens::{
    TokenDerivationEngine,
    derive_token_for_state,
    batch_derive_tokens,
};

pub use a11y::{
    ContrastLevel,
    ContrastResult,
    validate_contrast,
    batch_validate_contrast,
    passes_wcag_aa,
    WCAG_AA_NORMAL,
    WCAG_AA_LARGE,
    WCAG_AAA_NORMAL,
    WCAG_AAA_LARGE,
    APCA_MIN_BODY,
    APCA_MIN_LARGE,
};
