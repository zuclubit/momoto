//! Audio compliance validation against broadcast and streaming standards.
//!
//! | Module | Standard |
//! |--------|---------|
//! | [`ebur128`] | EBU R128 — broadcast (-23 LUFS) and streaming (-14 LUFS) |

pub mod ebur128;

pub use ebur128::{EbuR128Limits, EbuR128Measurement};
