//! # Virtual Measurement Instruments
//!
//! Simulates physical measurement devices with realistic noise models,
//! resolution limits, and calibration effects.
//!
//! ## Available Instruments
//!
//! - [`VirtualGonioreflectometer`] - Angular-resolved BRDF measurements
//! - [`VirtualSpectrophotometer`] - Spectral reflectance/transmittance
//! - [`VirtualEllipsometer`] - Thin-film optical characterization
//!
//! ## Design Principles
//!
//! 1. **Realistic Noise Models**: Each instrument includes configurable noise
//!    (Gaussian, shot, signal-dependent) that matches real-world behavior.
//!
//! 2. **Resolution Limits**: Angular, spectral, and dynamic range constraints
//!    reflect actual instrument capabilities.
//!
//! 3. **Calibration Traceability**: Measurements link to calibration references
//!    for metrological accountability.
//!
//! 4. **Reproducibility**: Seeded random number generators ensure deterministic
//!    results for validation and testing.
//!
//! ## Example Usage
//!
//! ```ignore
//! use glass_physics::instruments::*;
//!
//! // Create a research-grade spectrophotometer
//! let mut spectro = VirtualSpectrophotometer::research_uv_vis();
//!
//! // Measure reflectance spectrum
//! let result = spectro.measure_reflectance(|wl| {
//!     // Your material's reflectance function
//!     0.5 + 0.1 * (wl / 100.0).sin()
//! });
//!
//! // Analyze results
//! println!("Mean reflectance: {:.4}", result.mean_value());
//! if let Some((wl, peak)) = result.peak() {
//!     println!("Peak: {:.4} at {} nm", peak, wl);
//! }
//! ```

pub mod common;
pub mod ellipsometer;
pub mod gonioreflectometer;
pub mod spectrophotometer;

// Re-exports for convenient access
pub use common::{
    BiasModel, DetectorGeometry, EnvironmentConditions, InstrumentConfig, LightSource,
    LightSourceType, NoiseModel, Polarization, Resolution, SimpleRng,
};

pub use gonioreflectometer::{
    fresnel_brdf, lambertian_brdf, phong_brdf, GoniometerResult, VirtualGonioreflectometer,
};

pub use spectrophotometer::{
    constant_reflectance, gaussian_absorption, linear_reflectance, SpectroGeometry,
    SpectroMeasurementType, SpectroResult, VirtualSpectrophotometer,
};

pub use ellipsometer::{
    cauchy_dispersion, constant_optical_constants, glass_optical_constants,
    silicon_optical_constants, EllipsometerType, EllipsometryPoint, EllipsometryResult,
    ThinFilmResult, VirtualEllipsometer,
};

// ============================================================================
// MEMORY ESTIMATION
// ============================================================================

/// Estimate memory footprint of instruments module types.
pub fn estimate_memory_footprint() -> InstrumentsMemoryEstimate {
    InstrumentsMemoryEstimate {
        instrument_config_bytes: std::mem::size_of::<InstrumentConfig>(),
        gonioreflectometer_bytes: std::mem::size_of::<VirtualGonioreflectometer>(),
        spectrophotometer_bytes: std::mem::size_of::<VirtualSpectrophotometer>(),
        ellipsometer_bytes: std::mem::size_of::<VirtualEllipsometer>(),
        goniometer_result_base_bytes: std::mem::size_of::<GoniometerResult>(),
        spectro_result_base_bytes: std::mem::size_of::<SpectroResult>(),
        ellipsometry_result_base_bytes: std::mem::size_of::<EllipsometryResult>(),
    }
}

/// Memory footprint estimates for instrument types.
#[derive(Debug, Clone)]
pub struct InstrumentsMemoryEstimate {
    /// Size of InstrumentConfig.
    pub instrument_config_bytes: usize,
    /// Size of VirtualGonioreflectometer.
    pub gonioreflectometer_bytes: usize,
    /// Size of VirtualSpectrophotometer.
    pub spectrophotometer_bytes: usize,
    /// Size of VirtualEllipsometer.
    pub ellipsometer_bytes: usize,
    /// Base size of GoniometerResult (without data).
    pub goniometer_result_base_bytes: usize,
    /// Base size of SpectroResult (without data).
    pub spectro_result_base_bytes: usize,
    /// Base size of EllipsometryResult (without data).
    pub ellipsometry_result_base_bytes: usize,
}

impl InstrumentsMemoryEstimate {
    /// Total base memory for all instruments.
    pub fn total_instruments(&self) -> usize {
        self.gonioreflectometer_bytes + self.spectrophotometer_bytes + self.ellipsometer_bytes
    }

    /// Estimate for typical measurement session.
    pub fn typical_session(&self) -> usize {
        // Assume:
        // - 1 of each instrument
        // - 1 goniometer result with 20 angles
        // - 1 spectro result with 100 wavelengths
        // - 1 ellipsometry result with 100 wavelengths

        self.total_instruments()
            + self.goniometer_result_base_bytes
            + 20 * 16 // 20 angle points
            + self.spectro_result_base_bytes
            + 100 * 16 // 100 wavelength points
            + self.ellipsometry_result_base_bytes
            + 100 * 64 // 100 ellipsometry points (larger)
    }

    /// Generate memory report.
    pub fn report(&self) -> String {
        format!(
            "Instruments Memory Footprint:\n\
             ├── InstrumentConfig:        {:4} bytes\n\
             ├── VirtualGonioreflectometer: {:4} bytes\n\
             ├── VirtualSpectrophotometer:  {:4} bytes\n\
             ├── VirtualEllipsometer:       {:4} bytes\n\
             ├── GoniometerResult:        {:4} bytes (base)\n\
             ├── SpectroResult:           {:4} bytes (base)\n\
             ├── EllipsometryResult:      {:4} bytes (base)\n\
             ├── Total Instruments:       {:4} bytes\n\
             └── Typical Session:         {:4} bytes (~{:.1} KB)",
            self.instrument_config_bytes,
            self.gonioreflectometer_bytes,
            self.spectrophotometer_bytes,
            self.ellipsometer_bytes,
            self.goniometer_result_base_bytes,
            self.spectro_result_base_bytes,
            self.ellipsometry_result_base_bytes,
            self.total_instruments(),
            self.typical_session(),
            self.typical_session() as f64 / 1024.0
        )
    }
}

// ============================================================================
// MODULE VALIDATION
// ============================================================================

/// Validate instruments module configuration.
pub fn validate_module() -> InstrumentsValidation {
    let mut issues = Vec::new();

    // Check instrument sizes are reasonable
    let gonio_size = std::mem::size_of::<VirtualGonioreflectometer>();
    if gonio_size > 1024 {
        issues.push(format!(
            "VirtualGonioreflectometer size {} bytes exceeds 1KB limit",
            gonio_size
        ));
    }

    // Verify noise model works
    let noise = NoiseModel::gaussian(0.01);
    let std = noise.noise_std(1.0);
    if (std - 0.01).abs() > 1e-10 {
        issues.push("Noise model not returning correct std dev".to_string());
    }

    // Verify bias model is invertible
    let bias = BiasModel::simple(0.1, 1.05);
    let original = 1.0;
    let biased = bias.apply(original);
    let recovered = bias.remove(biased);
    if (original - recovered).abs() > 1e-10 {
        issues.push("Bias model not properly invertible".to_string());
    }

    InstrumentsValidation {
        valid: issues.is_empty(),
        issues,
        memory_estimate: estimate_memory_footprint(),
    }
}

/// Result of instruments module validation.
#[derive(Debug)]
pub struct InstrumentsValidation {
    /// Whether validation passed.
    pub valid: bool,
    /// List of issues found.
    pub issues: Vec<String>,
    /// Memory footprint estimate.
    pub memory_estimate: InstrumentsMemoryEstimate,
}

// ============================================================================
// INSTRUMENT FACTORY
// ============================================================================

/// Factory for creating pre-configured instruments.
pub struct InstrumentFactory;

impl InstrumentFactory {
    /// Create ideal instruments for testing (no noise, no bias).
    pub fn ideal_suite() -> InstrumentSuite {
        InstrumentSuite {
            gonioreflectometer: VirtualGonioreflectometer::ideal(),
            spectrophotometer: VirtualSpectrophotometer::ideal(),
            ellipsometer: VirtualEllipsometer::ideal(),
        }
    }

    /// Create research-grade instruments.
    pub fn research_suite() -> InstrumentSuite {
        InstrumentSuite {
            gonioreflectometer: VirtualGonioreflectometer::research_grade(),
            spectrophotometer: VirtualSpectrophotometer::research_uv_vis(),
            ellipsometer: VirtualEllipsometer::research_grade(),
        }
    }

    /// Create industrial-grade instruments.
    pub fn industrial_suite() -> InstrumentSuite {
        InstrumentSuite {
            gonioreflectometer: VirtualGonioreflectometer::industrial_grade(),
            spectrophotometer: VirtualSpectrophotometer::color_measurement(),
            ellipsometer: VirtualEllipsometer::industrial(),
        }
    }
}

/// Suite of virtual instruments.
#[derive(Debug, Clone)]
pub struct InstrumentSuite {
    /// Gonioreflectometer for angular measurements.
    pub gonioreflectometer: VirtualGonioreflectometer,
    /// Spectrophotometer for spectral measurements.
    pub spectrophotometer: VirtualSpectrophotometer,
    /// Ellipsometer for thin-film measurements.
    pub ellipsometer: VirtualEllipsometer,
}

impl InstrumentSuite {
    /// Set random seed for all instruments.
    pub fn with_seed(mut self, seed: u64) -> Self {
        self.gonioreflectometer = self.gonioreflectometer.with_seed(seed);
        self.spectrophotometer = self.spectrophotometer.with_seed(seed);
        self.ellipsometer = self.ellipsometer.with_seed(seed);
        self
    }
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_module_exports() {
        // Verify all public types are accessible
        let _ = NoiseModel::gaussian(0.01);
        let _ = Resolution::standard();
        let _ = BiasModel::unbiased();
        let _ = InstrumentConfig::default();
        let _ = VirtualGonioreflectometer::ideal();
        let _ = VirtualSpectrophotometer::ideal();
        let _ = VirtualEllipsometer::ideal();
    }

    #[test]
    fn test_memory_estimate() {
        let estimate = estimate_memory_footprint();

        // Sanity checks
        assert!(estimate.gonioreflectometer_bytes > 0);
        assert!(estimate.spectrophotometer_bytes > 0);
        assert!(estimate.ellipsometer_bytes > 0);
        assert!(estimate.typical_session() > estimate.total_instruments());

        let report = estimate.report();
        assert!(report.contains("Gonioreflectometer"));
        assert!(report.contains("bytes"));
    }

    #[test]
    fn test_module_validation() {
        let validation = validate_module();
        assert!(
            validation.valid,
            "Validation failed: {:?}",
            validation.issues
        );
    }

    #[test]
    fn test_memory_budget() {
        let estimate = estimate_memory_footprint();

        // Phase 15 instruments should use < 20KB typical
        assert!(
            estimate.typical_session() < 20_000,
            "Typical session {} exceeds 20KB budget",
            estimate.typical_session()
        );
    }

    #[test]
    fn test_ideal_suite() {
        let suite = InstrumentFactory::ideal_suite();

        // All instruments should have no noise
        assert!(matches!(
            suite.gonioreflectometer.config.noise_model,
            NoiseModel::None
        ));
        assert!(matches!(
            suite.spectrophotometer.config.noise_model,
            NoiseModel::None
        ));
        assert!(matches!(
            suite.ellipsometer.config.noise_model,
            NoiseModel::None
        ));
    }

    #[test]
    fn test_research_suite() {
        let suite = InstrumentFactory::research_suite();

        // Research instruments should have low noise (< 2% at signal=1.0)
        let gonio_noise = suite.gonioreflectometer.config.noise_model.noise_std(1.0);
        assert!(gonio_noise < 0.02, "gonio_noise = {}", gonio_noise);
    }

    #[test]
    fn test_suite_seed() {
        let suite = InstrumentFactory::ideal_suite().with_seed(12345);

        // Create two measurements with same seed
        let mut s1 = suite.clone();
        let mut s2 = suite.clone();

        let r1 = s1.spectrophotometer.measure_reflectance(|_| 0.5);
        let r2 = s2.spectrophotometer.measure_reflectance(|_| 0.5);

        // Should be identical
        assert_eq!(r1.measurements.values.len(), r2.measurements.values.len());
    }

    #[test]
    fn test_brdf_models() {
        let lambertian = lambertian_brdf(0.5);
        let value = lambertian(0.0, 0.0, 550.0);
        let expected = 0.5 / std::f64::consts::PI;
        assert!((value - expected).abs() < 1e-6);

        let phong = phong_brdf(0.3, 0.7, 10.0);
        let specular = phong(0.5, 0.5, 550.0);
        let off_specular = phong(0.5, 1.0, 550.0);
        assert!(specular > off_specular);
    }

    #[test]
    fn test_spectral_models() {
        let constant = constant_reflectance(0.7);
        assert!((constant(550.0) - 0.7).abs() < 1e-10);

        let linear = linear_reflectance(0.2, 0.8, 400.0, 700.0);
        assert!((linear(400.0) - 0.2).abs() < 1e-10);
        assert!((linear(700.0) - 0.8).abs() < 1e-10);
        assert!((linear(550.0) - 0.5).abs() < 0.01);
    }

    #[test]
    fn test_optical_constant_models() {
        let glass = glass_optical_constants();
        let (n, k) = glass(550.0);
        assert!(n > 1.4 && n < 1.6);
        assert!(k.abs() < 0.01);

        let si = silicon_optical_constants();
        let (n_si, k_si) = si(500.0);
        assert!(n_si > 3.0);
        assert!(k_si > 0.0);
    }

    #[test]
    fn test_complete_workflow() {
        // Test complete measurement workflow
        let mut suite = InstrumentFactory::ideal_suite().with_seed(42);

        // Goniometer measurement
        let brdf = lambertian_brdf(0.5);
        let gonio_result = suite.gonioreflectometer.measure_angular(brdf, 30.0, 550.0);
        assert!(gonio_result.mean_brdf() > 0.0);

        // Spectrophotometer measurement
        let reflectance = constant_reflectance(0.6);
        let spectro_result = suite.spectrophotometer.measure_reflectance(reflectance);
        assert!((spectro_result.mean_value() - 0.6).abs() < 0.01);

        // Ellipsometer measurement
        let constants = constant_optical_constants(1.5, 0.0);
        let ellip_result = suite.ellipsometer.measure_spectrum(constants);
        assert!(!ellip_result.points.is_empty());
    }
}
