//! # Temporal Evaluation Context
//!
//! Extends BSDFContext with time-awareness for temporal material evolution.

use super::super::unified_bsdf::{BSDFContext, BSDFResponse};

// ============================================================================
// TEMPORAL CONTEXT
// ============================================================================

/// Temporal evaluation context extending BSDFContext.
///
/// Adds time as a first-class physical parameter while maintaining
/// full backward compatibility with Phase 11 static evaluation.
#[derive(Debug, Clone)]
pub struct TemporalContext {
    /// Base BSDF context (geometry, wavelength).
    pub base: BSDFContext,

    /// Current simulation time in seconds.
    pub time: f64,

    /// Time delta since last frame in seconds.
    pub delta_time: f64,

    /// Frame index for deterministic sampling.
    pub frame_index: u64,

    /// Previous frame's response for drift detection.
    pub previous_response: Option<BSDFResponse>,

    /// Temperature in Kelvin (for temperature-dependent effects).
    pub temperature: f64,

    /// Rate of temperature change (K/s).
    pub temperature_rate: f64,
}

impl Default for TemporalContext {
    fn default() -> Self {
        Self {
            base: BSDFContext::default(),
            time: 0.0,
            delta_time: 0.0,
            frame_index: 0,
            previous_response: None,
            temperature: 293.15, // 20°C
            temperature_rate: 0.0,
        }
    }
}

impl TemporalContext {
    /// Create a new temporal context from base context.
    pub fn from_base(base: BSDFContext) -> Self {
        Self {
            base,
            ..Default::default()
        }
    }

    /// Create a new temporal context at a specific time.
    pub fn at_time(time: f64) -> Self {
        Self {
            time,
            ..Default::default()
        }
    }

    /// Builder pattern: set time.
    pub fn with_time(mut self, time: f64) -> Self {
        self.time = time;
        self
    }

    /// Builder pattern: set delta time.
    pub fn with_delta(mut self, delta_time: f64) -> Self {
        self.delta_time = delta_time;
        self
    }

    /// Builder pattern: set frame index.
    pub fn with_frame(mut self, frame_index: u64) -> Self {
        self.frame_index = frame_index;
        self
    }

    /// Builder pattern: set temperature.
    pub fn with_temperature(mut self, temperature_k: f64) -> Self {
        self.temperature = temperature_k;
        self
    }

    /// Builder pattern: set temperature rate.
    pub fn with_temperature_rate(mut self, rate: f64) -> Self {
        self.temperature_rate = rate;
        self
    }

    /// Builder pattern: set previous response.
    pub fn with_previous(mut self, response: BSDFResponse) -> Self {
        self.previous_response = Some(response);
        self
    }

    /// Builder pattern: set base context.
    pub fn with_base(mut self, base: BSDFContext) -> Self {
        self.base = base;
        self
    }

    /// Advance to next frame.
    pub fn advance(&mut self, delta_time: f64, response: BSDFResponse) {
        self.previous_response = Some(response);
        self.time += delta_time;
        self.delta_time = delta_time;
        self.frame_index += 1;

        // Update temperature based on rate
        self.temperature += self.temperature_rate * delta_time;
    }

    /// Get the cosine of incident angle from base context.
    pub fn cos_theta_i(&self) -> f64 {
        self.base.wi.dot(&self.base.normal).abs()
    }

    /// Get wavelength from base context.
    pub fn wavelength(&self) -> f64 {
        self.base.wavelength
    }

    /// Check if we have previous frame data.
    pub fn has_previous(&self) -> bool {
        self.previous_response.is_some()
    }

    /// Get normalized time (useful for periodic effects).
    pub fn time_normalized(&self, period: f64) -> f64 {
        if period <= 0.0 {
            0.0
        } else {
            (self.time % period) / period
        }
    }

    /// Get phase for oscillating effects.
    pub fn phase(&self, frequency: f64) -> f64 {
        use std::f64::consts::TAU;
        (self.time * frequency * TAU) % TAU
    }
}

// ============================================================================
// TEMPORAL CONTEXT BUILDER
// ============================================================================

/// Builder for constructing TemporalContext with validation.
#[derive(Debug, Clone, Default)]
pub struct TemporalContextBuilder {
    base: Option<BSDFContext>,
    time: f64,
    delta_time: f64,
    frame_index: u64,
    temperature: f64,
}

impl TemporalContextBuilder {
    /// Create new builder.
    pub fn new() -> Self {
        Self {
            temperature: 293.15,
            ..Default::default()
        }
    }

    /// Set base context.
    pub fn base(mut self, base: BSDFContext) -> Self {
        self.base = Some(base);
        self
    }

    /// Set time.
    pub fn time(mut self, time: f64) -> Self {
        self.time = time.max(0.0);
        self
    }

    /// Set delta time.
    pub fn delta_time(mut self, dt: f64) -> Self {
        self.delta_time = dt.max(0.0);
        self
    }

    /// Set frame index.
    pub fn frame(mut self, index: u64) -> Self {
        self.frame_index = index;
        self
    }

    /// Set temperature in Kelvin.
    pub fn temperature(mut self, temp_k: f64) -> Self {
        self.temperature = temp_k.max(0.0);
        self
    }

    /// Build the temporal context.
    pub fn build(self) -> TemporalContext {
        TemporalContext {
            base: self.base.unwrap_or_default(),
            time: self.time,
            delta_time: self.delta_time,
            frame_index: self.frame_index,
            previous_response: None,
            temperature: self.temperature,
            temperature_rate: 0.0,
        }
    }
}

// ============================================================================
// DRIFT TRACKING
// ============================================================================

/// Configuration for drift detection.
#[derive(Debug, Clone)]
pub struct DriftConfig {
    /// Maximum allowed energy drift (0.01 = 1%).
    pub max_drift: f64,

    /// Number of frames to track.
    pub history_length: usize,

    /// Whether to clamp values to prevent drift.
    pub auto_clamp: bool,
}

impl Default for DriftConfig {
    fn default() -> Self {
        Self {
            max_drift: 0.01, // 1% maximum drift
            history_length: 100,
            auto_clamp: true,
        }
    }
}

/// Status of drift tracking.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum DriftStatus {
    /// No drift detected.
    Stable,
    /// Minor drift within tolerance.
    Minor,
    /// Significant drift, approaching limit.
    Warning,
    /// Drift exceeds maximum allowed.
    Exceeded,
}

/// Tracks energy drift over multiple frames.
#[derive(Debug, Clone)]
pub struct DriftTracker {
    /// Initial total energy (R + T).
    initial_energy: f64,

    /// Current total energy.
    current_energy: f64,

    /// Number of frames tracked.
    frame_count: u64,

    /// Configuration.
    config: DriftConfig,

    /// History of energy values.
    history: Vec<f64>,

    /// Running sum for average computation.
    running_sum: f64,
}

impl Default for DriftTracker {
    fn default() -> Self {
        Self::new(DriftConfig::default())
    }
}

impl DriftTracker {
    /// Create new drift tracker.
    pub fn new(config: DriftConfig) -> Self {
        Self {
            initial_energy: 0.0,
            current_energy: 0.0,
            frame_count: 0,
            config,
            history: Vec::new(),
            running_sum: 0.0,
        }
    }

    /// Initialize with first frame's response.
    pub fn initialize(&mut self, response: &BSDFResponse) {
        let energy = response.reflectance + response.transmittance;
        self.initial_energy = energy;
        self.current_energy = energy;
        self.frame_count = 1;
        self.history.clear();
        self.history.push(energy);
        self.running_sum = energy;
    }

    /// Update with new frame's response.
    pub fn update(&mut self, response: &BSDFResponse) {
        let energy = response.reflectance + response.transmittance;
        self.current_energy = energy;
        self.frame_count += 1;

        // Update history (ring buffer)
        if self.history.len() >= self.config.history_length {
            let removed = self.history.remove(0);
            self.running_sum -= removed;
        }
        self.history.push(energy);
        self.running_sum += energy;
    }

    /// Get current drift ratio.
    pub fn drift_ratio(&self) -> f64 {
        if self.initial_energy <= 0.0 {
            return 0.0;
        }
        (self.current_energy - self.initial_energy).abs() / self.initial_energy
    }

    /// Get average energy over history.
    pub fn average_energy(&self) -> f64 {
        if self.history.is_empty() {
            0.0
        } else {
            self.running_sum / self.history.len() as f64
        }
    }

    /// Get drift status.
    pub fn status(&self) -> DriftStatus {
        let drift = self.drift_ratio();
        if drift > self.config.max_drift {
            DriftStatus::Exceeded
        } else if drift > self.config.max_drift * 0.75 {
            DriftStatus::Warning
        } else if drift > self.config.max_drift * 0.25 {
            DriftStatus::Minor
        } else {
            DriftStatus::Stable
        }
    }

    /// Check if drift exceeds maximum.
    pub fn is_exceeded(&self) -> bool {
        self.drift_ratio() > self.config.max_drift
    }

    /// Get frame count.
    pub fn frame_count(&self) -> u64 {
        self.frame_count
    }

    /// Clamp response to maintain energy conservation.
    pub fn clamp_if_needed(&self, response: &mut BSDFResponse) {
        if !self.config.auto_clamp {
            return;
        }

        // Ensure energy conservation
        let total = response.reflectance + response.transmittance;
        if total > 1.0 {
            let scale = 1.0 / total;
            response.reflectance *= scale;
            response.transmittance *= scale;
        }
        response.absorption = (1.0 - response.reflectance - response.transmittance).max(0.0);
    }

    /// Reset tracker.
    pub fn reset(&mut self) {
        self.initial_energy = 0.0;
        self.current_energy = 0.0;
        self.frame_count = 0;
        self.history.clear();
        self.running_sum = 0.0;
    }
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_temporal_context_default() {
        let ctx = TemporalContext::default();
        assert_eq!(ctx.time, 0.0);
        assert_eq!(ctx.delta_time, 0.0);
        assert_eq!(ctx.frame_index, 0);
        assert!(!ctx.has_previous());
    }

    #[test]
    fn test_temporal_context_builder() {
        let ctx = TemporalContext::at_time(1.5)
            .with_delta(0.016)
            .with_frame(100)
            .with_temperature(350.0);

        assert!((ctx.time - 1.5).abs() < 1e-6);
        assert!((ctx.delta_time - 0.016).abs() < 1e-6);
        assert_eq!(ctx.frame_index, 100);
        assert!((ctx.temperature - 350.0).abs() < 1e-6);
    }

    #[test]
    fn test_temporal_context_advance() {
        let mut ctx = TemporalContext::default();
        let response = BSDFResponse::new(0.5, 0.3, 0.2);

        ctx.advance(0.016, response);

        assert!((ctx.time - 0.016).abs() < 1e-6);
        assert_eq!(ctx.frame_index, 1);
        assert!(ctx.has_previous());
    }

    #[test]
    fn test_time_normalized() {
        let ctx = TemporalContext::at_time(2.5);
        let norm = ctx.time_normalized(1.0);
        assert!((norm - 0.5).abs() < 1e-6);
    }

    #[test]
    fn test_phase() {
        let ctx = TemporalContext::at_time(0.25);
        let phase = ctx.phase(1.0); // 1 Hz
        assert!(phase > 0.0);
    }

    #[test]
    fn test_drift_tracker_initialization() {
        let mut tracker = DriftTracker::default();
        let response = BSDFResponse::new(0.5, 0.3, 0.2);

        tracker.initialize(&response);

        assert_eq!(tracker.frame_count(), 1);
        assert!((tracker.drift_ratio() - 0.0).abs() < 1e-6);
        assert_eq!(tracker.status(), DriftStatus::Stable);
    }

    #[test]
    fn test_drift_tracker_update() {
        let mut tracker = DriftTracker::default();
        let response1 = BSDFResponse::new(0.5, 0.3, 0.2);
        let response2 = BSDFResponse::new(0.51, 0.31, 0.18);

        tracker.initialize(&response1);
        tracker.update(&response2);

        assert_eq!(tracker.frame_count(), 2);
        assert!(tracker.drift_ratio() > 0.0);
    }

    #[test]
    fn test_drift_tracker_exceeded() {
        let config = DriftConfig {
            max_drift: 0.01,
            ..Default::default()
        };
        let mut tracker = DriftTracker::new(config);

        let response1 = BSDFResponse::new(0.5, 0.3, 0.2);
        let response2 = BSDFResponse::new(0.6, 0.4, 0.0); // Big drift

        tracker.initialize(&response1);
        tracker.update(&response2);

        assert!(tracker.is_exceeded());
        assert_eq!(tracker.status(), DriftStatus::Exceeded);
    }

    #[test]
    fn test_drift_tracker_clamp() {
        let tracker = DriftTracker::default();
        let mut response = BSDFResponse::new(0.7, 0.5, 0.0); // Total > 1

        tracker.clamp_if_needed(&mut response);

        let total = response.reflectance + response.transmittance + response.absorption;
        assert!((total - 1.0).abs() < 1e-6);
    }

    #[test]
    fn test_context_builder() {
        let ctx = TemporalContextBuilder::new()
            .time(2.0)
            .delta_time(0.033)
            .frame(60)
            .temperature(400.0)
            .build();

        assert!((ctx.time - 2.0).abs() < 1e-6);
        assert!((ctx.delta_time - 0.033).abs() < 1e-6);
        assert_eq!(ctx.frame_index, 60);
        assert!((ctx.temperature - 400.0).abs() < 1e-6);
    }
}
