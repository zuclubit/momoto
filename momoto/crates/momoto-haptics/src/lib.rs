//! # Momoto Haptics
//!
//! Haptic / vibrotactile output domain for the Momoto Multimodal Perceptual
//! Physics Engine.
//!
//! ## Scope
//!
//! This crate provides the foundation for haptic feedback generation:
//!
//! - **Energy budget**: ensures haptic actuator power stays within safe limits.
//! - **Frequency→force mapping**: maps perceptual intensity (0–1) to
//!   vibration frequency (Hz) and force (N) for common actuator models.
//! - **Waveform generation**: generates simple haptic waveforms (sine, pulse,
//!   ramp) from perceptual parameters.
//!
//! ## Status: Scaffold
//!
//! This is Phase 5 implementation — the core contracts and data types are
//! present and tested. Full actuator models (LRA, ERM, piezo) and WASM
//! bindings are planned for a future sprint.
//!
//! ## Physical model
//!
//! Haptic energy budget:
//! ```text
//! ∫P(t)dt ≤ energy_capacity_joules
//! P(t) = F(t) · v(t)   [force × velocity]
//! ```
//! The `EnergyConserving` implementation reports:
//! - `input`    = available energy capacity
//! - `output`   = energy delivered to the user (perceptual work)
//! - `absorbed` = energy dissipated as heat in the actuator
//! - `scattered` = 0 (no acoustic radiation modelled at this stage)

#![warn(
    missing_docs,
    missing_debug_implementations,
    rust_2018_idioms,
    unreachable_pub
)]

pub mod domain;
pub mod energy;
pub mod mapping;
pub mod waveform;

pub use domain::HapticsDomain;
pub use energy::{EnergyBudget, EnergyBudgetError};
pub use mapping::{ActuatorModel, FrequencyForcePoint, VibrationSpec};
pub use waveform::{HapticWaveform, WaveformKind};
