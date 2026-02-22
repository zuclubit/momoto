//! # Momoto Engine
//!
//! Orchestrator for the Momoto Multimodal Perceptual Physics Engine.
//!
//! `MomotoEngine` composes sensory domains (Color, Audio, Haptics) via
//! **enum dispatch** rather than `Box<dyn Domain>` vtables, so the compiler
//! can inline all domain evaluation paths. A shared, pre-allocated scratch
//! buffer is passed into each domain to avoid per-call heap allocation.
//!
//! ## Architecture
//!
//! ```text
//! MomotoEngine
//! ├─ domains: Vec<DomainVariant>     (registered at construction time)
//! ├─ scratch: Box<[f32]>             (shared 16 KiB work buffer)
//! └─ DomainVariant {                 (enum dispatch — no vtable)
//!       Color(ColorDomain)           always present
//!       Audio(AudioDomain)           [cfg(feature = "audio")]
//!       Haptics(HapticsDomain)       [cfg(feature = "haptics")]
//!    }
//! ```
//!
//! ## Adding a new domain (future)
//!
//! 1. Create `momoto-{domain}` crate implementing `Domain` + `EnergyConserving`.
//! 2. Add it as an optional dep in `momoto-engine/Cargo.toml`:
//!    `momoto-audio = { path = "../momoto-audio", optional = true }`.
//! 3. Add `Audio(momoto_audio::AudioDomain)` to `DomainVariant` behind
//!    `#[cfg(feature = "audio")]`.
//! 4. Add the matching arm to `DomainVariant::id()` / `DomainVariant::name()`.

#![warn(
    missing_docs,
    missing_debug_implementations,
    rust_2018_idioms,
    unreachable_pub
)]

pub mod engine;

pub use engine::{ColorDomain, DomainVariant, MomotoEngine, SystemEnergyReport};
