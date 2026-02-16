// =============================================================================
// momoto-wasm: Materials Extended Bindings
// File: crates/momoto-wasm/src/materials_ext.rs
//
// Exposes missing items from momoto-materials NOT already in lib.rs.
// Existing lib.rs covers: GlassMaterial, Fresnel, ThinFilm, MieParams,
//   DynamicMieParams, ComplexIOR, SpectralComplexIOR, DrudeParams,
//   BlinnPhong specular, dispersion, scattering, EvaluatedMaterial, CSS output.
//
// This module adds: Refraction, Lighting, Ambient Shadows, Interactive Shadows,
//   Elevation, Spectral Coherence, Temporal, Neural Constraints,
//   PBR/BSDF API, Easing functions, Batch evaluation.
// =============================================================================

use wasm_bindgen::prelude::*;
use serde_wasm_bindgen;

// =============================================================================
// REFRACTION SYSTEM
// =============================================================================

use momoto_materials::glass_physics::refraction::{
    RefractionParams as CoreRefractionParams,
    RefractionResult as CoreRefractionResult,
    RefractionPresets as CoreRefractionPresets,
    calculate_refraction as core_calculate_refraction,
    apply_refraction_to_color as core_apply_refraction_to_color,
    generate_distortion_map as core_generate_distortion_map,
};

/// Refraction parameters for glass-like materials.
///
/// Models how light bends when entering a denser medium.
/// IOR (Index of Refraction) determines bend strength:
///   Air = 1.0, Water = 1.33, Glass = 1.5, Diamond = 2.42
#[wasm_bindgen]
pub struct RefractionParams {
    inner: CoreRefractionParams,
}

#[wasm_bindgen]
impl RefractionParams {
    /// Create refraction params from IOR and distortion controls.
    #[wasm_bindgen(constructor)]
    pub fn new(
        ior: f64,
        distortion: f64,
        chromatic_aberration: f64,
        edge_intensity: f64,
    ) -> Self {
        Self {
            inner: CoreRefractionParams {
                ior,
                distortion,
                chromatic_aberration,
                edge_intensity,
            },
        }
    }

    // --- Presets ---

    /// Clear glass (IOR 1.5, low distortion).
    pub fn clear() -> Self {
        Self { inner: CoreRefractionPresets::clear() }
    }

    /// Frosted glass (IOR 1.5, high distortion).
    pub fn frosted() -> Self {
        Self { inner: CoreRefractionPresets::frosted() }
    }

    /// Thick glass (IOR 1.6, medium distortion).
    pub fn thick() -> Self {
        Self { inner: CoreRefractionPresets::thick() }
    }

    /// Subtle glass (IOR 1.1, minimal distortion).
    pub fn subtle() -> Self {
        Self { inner: CoreRefractionPresets::subtle() }
    }

    /// High-index glass (IOR 1.8, strong chromatic aberration).
    #[wasm_bindgen(js_name = "highIndex")]
    pub fn high_index() -> Self {
        Self { inner: CoreRefractionPresets::high_index() }
    }

    // --- Getters ---

    #[wasm_bindgen(getter)]
    pub fn ior(&self) -> f64 { self.inner.ior }

    #[wasm_bindgen(getter)]
    pub fn distortion(&self) -> f64 { self.inner.distortion }

    #[wasm_bindgen(getter, js_name = "chromaticAberration")]
    pub fn chromatic_aberration(&self) -> f64 { self.inner.chromatic_aberration }

    #[wasm_bindgen(getter, js_name = "edgeIntensity")]
    pub fn edge_intensity(&self) -> f64 { self.inner.edge_intensity }
}

/// Calculate refraction at a position within a glass panel.
///
/// # Arguments
/// * `params` - Refraction parameters
/// * `x`, `y` - Position (0.0 to 1.0, normalized within panel)
///
/// # Returns
/// Object { offsetX, offsetY, hueShift, brightness }
#[wasm_bindgen(js_name = "calculateRefraction")]
pub fn calculate_refraction(
    params: &RefractionParams,
    x: f64,
    y: f64,
) -> Result<JsValue, JsValue> {
    let result = core_calculate_refraction(&params.inner, x, y);
    serde_wasm_bindgen::to_value(&result)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Apply refraction correction to OKLCH color values.
///
/// Returns corrected { l, c, h } values after refraction.
#[wasm_bindgen(js_name = "applyRefractionToColor")]
pub fn apply_refraction_to_color(
    params: &RefractionParams,
    l: f64,
    c: f64,
    h: f64,
    x: f64,
    y: f64,
) -> Result<JsValue, JsValue> {
    let result = core_apply_refraction_to_color(&params.inner, l, c, h, x, y);
    serde_wasm_bindgen::to_value(&result)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Generate a distortion map for a grid of positions.
///
/// # Arguments
/// * `params` - Refraction parameters
/// * `grid_size` - Number of samples per axis (e.g. 8 → 8×8 = 64 samples)
///
/// # Returns
/// Float64Array of [offset_x, offset_y, hue_shift, brightness, ...] (4 values per sample)
#[wasm_bindgen(js_name = "generateDistortionMap")]
pub fn generate_distortion_map(
    params: &RefractionParams,
    grid_size: usize,
) -> Result<Box<[f64]>, JsValue> {
    let map = core_generate_distortion_map(&params.inner, grid_size);
    let mut flat = Vec::with_capacity(map.len() * 4);
    for result in &map {
        flat.push(result.offset_x);
        flat.push(result.offset_y);
        flat.push(result.hue_shift);
        flat.push(result.brightness);
    }
    Ok(flat.into_boxed_slice())
}

// =============================================================================
// LIGHTING MODEL
// =============================================================================

use momoto_materials::glass_physics::light_model::{
    LightSource as CoreLightSource,
    LightingEnvironment as CoreLightingEnvironment,
    LightingResult as CoreLightingResult,
    Vec3 as CoreVec3,
    calculate_lighting as core_calculate_lighting,
    derive_gradient as core_derive_gradient,
    gradient_to_css as core_gradient_to_css,
};

/// A directional light source.
#[wasm_bindgen]
pub struct LightSource {
    inner: CoreLightSource,
}

#[wasm_bindgen]
impl LightSource {
    /// Create a light source.
    ///
    /// # Arguments
    /// * `dir_x/y/z` - Direction vector (will be normalized)
    /// * `intensity` - Light intensity (0.0 to 1.0+)
    /// * `color_r/g/b` - Light color (linear RGB, 0.0 to 1.0)
    #[wasm_bindgen(constructor)]
    pub fn new(
        dir_x: f64, dir_y: f64, dir_z: f64,
        intensity: f64,
        color_r: f64, color_g: f64, color_b: f64,
    ) -> Self {
        Self {
            inner: CoreLightSource {
                direction: CoreVec3::new(dir_x, dir_y, dir_z),
                intensity,
                color: CoreVec3::new(color_r, color_g, color_b),
            },
        }
    }
}

/// A complete lighting environment (key, fill, ambient, background).
#[wasm_bindgen]
pub struct LightingEnvironment {
    inner: CoreLightingEnvironment,
}

#[wasm_bindgen]
impl LightingEnvironment {
    /// Create default studio-like lighting environment.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { inner: CoreLightingEnvironment::default() }
    }

    /// Standard studio lighting preset.
    pub fn studio() -> Self {
        Self { inner: CoreLightingEnvironment::studio() }
    }

    /// Dramatic single-key lighting.
    pub fn dramatic() -> Self {
        Self { inner: CoreLightingEnvironment::dramatic() }
    }

    /// Soft ambient-dominant lighting.
    pub fn ambient() -> Self {
        Self { inner: CoreLightingEnvironment::ambient() }
    }
}

/// Calculate lighting for a surface.
///
/// # Arguments
/// * `env` - Lighting environment
/// * `normal_x/y/z` - Surface normal
/// * `roughness` - Surface roughness (0.0 = mirror, 1.0 = diffuse)
///
/// # Returns
/// Object { diffuse: [r,g,b], specular: [r,g,b], total: [r,g,b], lightColor: [r,g,b] }
#[wasm_bindgen(js_name = "calculateLighting")]
pub fn calculate_lighting(
    env: &LightingEnvironment,
    normal_x: f64,
    normal_y: f64,
    normal_z: f64,
    roughness: f64,
) -> Result<JsValue, JsValue> {
    let normal = CoreVec3::new(normal_x, normal_y, normal_z);
    let result = core_calculate_lighting(&env.inner, &normal, roughness);
    serde_wasm_bindgen::to_value(&result)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Derive a physics-based gradient from lighting environment.
///
/// # Arguments
/// * `env` - Lighting environment
/// * `samples` - Number of gradient samples (4-64 recommended)
/// * `roughness` - Surface roughness
///
/// # Returns
/// Array of { position, color: [r,g,b] } gradient stops
#[wasm_bindgen(js_name = "deriveGradient")]
pub fn derive_gradient(
    env: &LightingEnvironment,
    samples: usize,
    roughness: f64,
) -> Result<JsValue, JsValue> {
    let gradient = core_derive_gradient(&env.inner, samples, roughness);
    serde_wasm_bindgen::to_value(&gradient)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Convert gradient to CSS linear-gradient string.
#[wasm_bindgen(js_name = "gradientToCss")]
pub fn gradient_to_css(
    env: &LightingEnvironment,
    samples: usize,
    roughness: f64,
    angle_deg: f64,
) -> String {
    let gradient = core_derive_gradient(&env.inner, samples, roughness);
    core_gradient_to_css(&gradient, angle_deg)
}

// =============================================================================
// AMBIENT SHADOWS
// =============================================================================

use momoto_materials::shadow_engine::{
    AmbientShadowParams as CoreAmbientShadowParams,
    AmbientShadow as CoreAmbientShadow,
    AmbientShadowPresets as CoreAmbientShadowPresets,
    calculate_ambient_shadow as core_calculate_ambient_shadow,
    calculate_multi_scale_ambient as core_multi_scale_ambient,
    ElevationTransition as CoreElevationTransition,
    InteractiveState as CoreInteractiveState,
    calculate_interactive_shadow as core_interactive_shadow,
};

/// Ambient shadow parameters.
#[wasm_bindgen]
pub struct AmbientShadowParams {
    inner: CoreAmbientShadowParams,
}

#[wasm_bindgen]
impl AmbientShadowParams {
    #[wasm_bindgen(constructor)]
    pub fn new(
        opacity: f64,
        blur: f64,
        offset_y: f64,
        spread: f64,
        tint_r: f64,
        tint_g: f64,
        tint_b: f64,
    ) -> Self {
        Self {
            inner: CoreAmbientShadowParams {
                opacity,
                blur,
                offset_y,
                spread,
                tint: [tint_r, tint_g, tint_b],
            },
        }
    }

    // --- Presets ---

    pub fn standard() -> Self {
        Self { inner: CoreAmbientShadowPresets::standard() }
    }

    pub fn elevated() -> Self {
        Self { inner: CoreAmbientShadowPresets::elevated() }
    }

    pub fn subtle() -> Self {
        Self { inner: CoreAmbientShadowPresets::subtle() }
    }

    pub fn dramatic() -> Self {
        Self { inner: CoreAmbientShadowPresets::dramatic() }
    }

    pub fn colored() -> Self {
        Self { inner: CoreAmbientShadowPresets::colored() }
    }
}

/// Calculate a single ambient shadow.
///
/// Returns CSS box-shadow string.
#[wasm_bindgen(js_name = "calculateAmbientShadow")]
pub fn calculate_ambient_shadow(
    params: &AmbientShadowParams,
    elevation: f64,
) -> String {
    let shadow = core_calculate_ambient_shadow(&params.inner, elevation);
    shadow.to_css()
}

/// Calculate multi-scale ambient shadows (3 layers).
///
/// Returns CSS box-shadow string with comma-separated layers.
#[wasm_bindgen(js_name = "calculateMultiScaleAmbient")]
pub fn calculate_multi_scale_ambient(
    params: &AmbientShadowParams,
    elevation: f64,
) -> String {
    let shadows = core_multi_scale_ambient(&params.inner, elevation);
    shadows.iter()
        .map(|s| s.to_css())
        .collect::<Vec<_>>()
        .join(", ")
}

// =============================================================================
// INTERACTIVE SHADOWS
// =============================================================================

/// Elevation transitions for interactive UI elements.
#[wasm_bindgen]
pub struct ElevationTransition {
    inner: CoreElevationTransition,
}

#[wasm_bindgen]
impl ElevationTransition {
    /// Create transition with elevations for each interaction state.
    ///
    /// # Arguments
    /// * `rest` - Rest state elevation (dp)
    /// * `hover` - Hover elevation
    /// * `active` - Active/pressed elevation
    /// * `focus` - Focus elevation
    #[wasm_bindgen(constructor)]
    pub fn new(rest: f64, hover: f64, active: f64, focus: f64) -> Self {
        Self {
            inner: CoreElevationTransition {
                rest,
                hover,
                active,
                focus,
            },
        }
    }

    /// Material Design card transitions (1dp → 8dp → 2dp → 6dp).
    pub fn card() -> Self {
        Self {
            inner: CoreElevationTransition {
                rest: 1.0,
                hover: 8.0,
                active: 2.0,
                focus: 6.0,
            },
        }
    }

    /// FAB transitions (6dp → 12dp → 6dp → 12dp).
    pub fn fab() -> Self {
        Self {
            inner: CoreElevationTransition {
                rest: 6.0,
                hover: 12.0,
                active: 6.0,
                focus: 12.0,
            },
        }
    }

    /// Flat transitions (0dp → 4dp → 0dp → 2dp).
    pub fn flat() -> Self {
        Self {
            inner: CoreElevationTransition {
                rest: 0.0,
                hover: 4.0,
                active: 0.0,
                focus: 2.0,
            },
        }
    }
}

/// Calculate interactive shadow for a given interaction state.
///
/// # Arguments
/// * `transition` - Elevation transition definition
/// * `state` - Interaction state: 0=Rest, 1=Hover, 2=Active, 3=Focus
/// * `shadow_params` - Shadow visual parameters
///
/// # Returns
/// CSS box-shadow string for the current state
#[wasm_bindgen(js_name = "calculateInteractiveShadow")]
pub fn calculate_interactive_shadow(
    transition: &ElevationTransition,
    state: u8,
    shadow_params: &AmbientShadowParams,
) -> String {
    let interaction_state = match state {
        0 => CoreInteractiveState::Rest,
        1 => CoreInteractiveState::Hover,
        2 => CoreInteractiveState::Active,
        _ => CoreInteractiveState::Focus,
    };
    let shadow = core_interactive_shadow(
        &transition.inner,
        interaction_state,
        &shadow_params.inner,
    );
    shadow.to_css()
}

// =============================================================================
// ELEVATION (Material Design)
// =============================================================================

use momoto_materials::elevation::{
    Elevation as CoreElevation,
    MaterialSurface as CoreMaterialSurface,
};

/// Get Material Design elevation value in dp.
///
/// Levels: 0=0dp, 1=1dp, 2=3dp, 3=6dp, 4=8dp, 5=12dp
#[wasm_bindgen(js_name = "elevationDp")]
pub fn elevation_dp(level: u8) -> f64 {
    let elev = match level {
        0 => CoreElevation::Level0,
        1 => CoreElevation::Level1,
        2 => CoreElevation::Level2,
        3 => CoreElevation::Level3,
        4 => CoreElevation::Level4,
        _ => CoreElevation::Level5,
    };
    elev.dp()
}

/// Get elevation surface tint opacity.
///
/// Returns opacity for surface tint color overlay.
#[wasm_bindgen(js_name = "elevationTintOpacity")]
pub fn elevation_tint_opacity(level: u8) -> f64 {
    let elev = match level {
        0 => CoreElevation::Level0,
        1 => CoreElevation::Level1,
        2 => CoreElevation::Level2,
        3 => CoreElevation::Level3,
        4 => CoreElevation::Level4,
        _ => CoreElevation::Level5,
    };
    elev.tint_opacity()
}

// =============================================================================
// SPECTRAL COHERENCE
// =============================================================================

use momoto_materials::glass_physics::spectral_coherence::{
    FlickerValidator as CoreFlickerValidator,
    FlickerConfig as CoreFlickerConfig,
    FlickerReport as CoreFlickerReport,
    FlickerStatus as CoreFlickerStatus,
    SpectralInterpolator as CoreSpectralInterpolator,
};

/// Flicker detection validator for animation sequences.
///
/// Compares consecutive frames to detect perceptually objectionable flicker.
#[wasm_bindgen]
pub struct FlickerValidator {
    inner: CoreFlickerValidator,
}

#[wasm_bindgen]
impl FlickerValidator {
    /// Create with default thresholds.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { inner: CoreFlickerValidator::new(CoreFlickerConfig::default()) }
    }

    /// Create with custom delta-E threshold.
    #[wasm_bindgen(js_name = "withThreshold")]
    pub fn with_threshold(max_delta_e: f64) -> Self {
        Self {
            inner: CoreFlickerValidator::new(CoreFlickerConfig {
                max_delta_e,
                ..CoreFlickerConfig::default()
            }),
        }
    }

    /// Validate a pair of consecutive frames.
    ///
    /// # Arguments
    /// * `prev_rgb` - Previous frame RGB as Uint8Array [r, g, b, r, g, b, ...]
    /// * `curr_rgb` - Current frame RGB as Uint8Array [r, g, b, r, g, b, ...]
    ///
    /// # Returns
    /// JSON: { status: "Pass"|"Warning"|"Fail", maxDeltaE, avgDeltaE, flickerPixels }
    #[wasm_bindgen]
    pub fn validate(
        &self,
        prev_rgb: &[u8],
        curr_rgb: &[u8],
    ) -> Result<JsValue, JsValue> {
        let report = self.inner.validate_frames(prev_rgb, curr_rgb)
            .map_err(|e| JsValue::from_str(&format!("Flicker validation error: {:?}", e)))?;
        serde_wasm_bindgen::to_value(&report)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Spectral interpolation between two colors.
///
/// # Arguments
/// * `from_r/g/b` - Start color (sRGB 0-255)
/// * `to_r/g/b` - End color (sRGB 0-255)
/// * `t` - Interpolation parameter (0.0 to 1.0)
/// * `coherent` - Use spectrally coherent interpolation (true = no hue shift artifacts)
///
/// # Returns
/// Array [r, g, b] interpolated color
#[wasm_bindgen(js_name = "spectralInterpolate")]
pub fn spectral_interpolate(
    from_r: u8, from_g: u8, from_b: u8,
    to_r: u8, to_g: u8, to_b: u8,
    t: f64,
    coherent: bool,
) -> Box<[u8]> {
    let interpolator = CoreSpectralInterpolator::new(coherent);
    let result = interpolator.interpolate(
        [from_r, from_g, from_b],
        [to_r, to_g, to_b],
        t,
    );
    Box::new(result)
}

/// Generate spectrally coherent gradient.
///
/// # Arguments
/// * `from_rgb` / `to_rgb` - Start/end colors (3 bytes each)
/// * `steps` - Number of gradient steps
///
/// # Returns
/// Uint8Array of [r, g, b, r, g, b, ...] for each step
#[wasm_bindgen(js_name = "spectralGradient")]
pub fn spectral_gradient(
    from_r: u8, from_g: u8, from_b: u8,
    to_r: u8, to_g: u8, to_b: u8,
    steps: usize,
) -> Box<[u8]> {
    let interpolator = CoreSpectralInterpolator::new(true);
    let mut result = Vec::with_capacity(steps * 3);
    for i in 0..steps {
        let t = if steps > 1 { i as f64 / (steps - 1) as f64 } else { 0.0 };
        let [r, g, b] = interpolator.interpolate(
            [from_r, from_g, from_b],
            [to_r, to_g, to_b],
            t,
        );
        result.push(r);
        result.push(g);
        result.push(b);
    }
    result.into_boxed_slice()
}

// =============================================================================
// TEMPORAL INTERPOLATION
// =============================================================================

use momoto_materials::glass_physics::temporal::interpolation::{
    Interpolation as CoreInterpolation,
    InterpolationMode as CoreInterpolationMode,
    RateLimiter as CoreRateLimiter,
    RateLimitConfig as CoreRateLimitConfig,
    ExponentialMovingAverage as CoreEMA,
};

/// Temporal interpolation for smooth animations.
#[wasm_bindgen]
pub struct Interpolation {
    inner: CoreInterpolation,
}

#[wasm_bindgen]
impl Interpolation {
    /// Create linear interpolation.
    pub fn linear() -> Self {
        Self { inner: CoreInterpolation::new(CoreInterpolationMode::Linear) }
    }

    /// Create smooth (cubic Hermite) interpolation.
    pub fn smooth() -> Self {
        Self { inner: CoreInterpolation::new(CoreInterpolationMode::Smooth) }
    }

    /// Create spring-like interpolation.
    pub fn spring() -> Self {
        Self { inner: CoreInterpolation::new(CoreInterpolationMode::Spring) }
    }

    /// Evaluate interpolation at time t (0.0 to 1.0).
    pub fn evaluate(&self, t: f64) -> f64 {
        self.inner.evaluate(t)
    }
}

/// Rate limiter for temporal smoothing of color values.
#[wasm_bindgen]
pub struct RateLimiter {
    inner: CoreRateLimiter,
}

#[wasm_bindgen]
impl RateLimiter {
    /// Create with maximum change per second.
    #[wasm_bindgen(constructor)]
    pub fn new(max_change_per_sec: f64) -> Self {
        Self {
            inner: CoreRateLimiter::new(CoreRateLimitConfig {
                max_change_per_sec,
                ..CoreRateLimitConfig::default()
            }),
        }
    }

    /// Apply rate limiting to a value transition.
    ///
    /// # Arguments
    /// * `current` - Current value
    /// * `target` - Target value
    /// * `dt_sec` - Time delta in seconds
    ///
    /// # Returns
    /// Rate-limited value
    pub fn apply(&mut self, current: f64, target: f64, dt_sec: f64) -> f64 {
        self.inner.apply(current, target, dt_sec)
    }
}

/// Exponential moving average for smooth temporal transitions.
#[wasm_bindgen]
pub struct ExponentialMovingAverage {
    inner: CoreEMA,
}

#[wasm_bindgen]
impl ExponentialMovingAverage {
    /// Create with smoothing factor alpha (0.0 = no change, 1.0 = instant).
    #[wasm_bindgen(constructor)]
    pub fn new(alpha: f64) -> Self {
        Self { inner: CoreEMA::new(alpha) }
    }

    /// Update with a new sample and return smoothed value.
    pub fn update(&mut self, value: f64) -> f64 {
        self.inner.update(value)
    }

    /// Get current smoothed value.
    #[wasm_bindgen(getter)]
    pub fn value(&self) -> f64 {
        self.inner.value()
    }

    /// Reset to a specific value.
    pub fn reset(&mut self, value: f64) {
        self.inner.reset(value);
    }
}

// =============================================================================
// TEMPORAL BSDF (Time-Varying Materials)
// =============================================================================

use momoto_materials::glass_physics::temporal::materials::{
    TemporalDielectric as CoreTemporalDielectric,
    TemporalThinFilm as CoreTemporalThinFilm,
    TemporalConductor as CoreTemporalConductor,
};

/// Time-varying dielectric material.
///
/// Models glass whose properties evolve over time (e.g. heating, cooling).
#[wasm_bindgen]
pub struct TemporalDielectric {
    inner: CoreTemporalDielectric,
}

#[wasm_bindgen]
impl TemporalDielectric {
    /// Create from base IOR and roughness with evolution rates.
    #[wasm_bindgen(constructor)]
    pub fn new(
        base_ior: f64,
        base_roughness: f64,
        ior_rate: f64,
        roughness_rate: f64,
    ) -> Self {
        Self {
            inner: CoreTemporalDielectric::new(
                base_ior,
                base_roughness,
                ior_rate,
                roughness_rate,
            ),
        }
    }

    /// Get IOR at time t (seconds).
    #[wasm_bindgen(js_name = "iorAt")]
    pub fn ior_at(&self, t: f64) -> f64 {
        self.inner.ior_at(t)
    }

    /// Get roughness at time t.
    #[wasm_bindgen(js_name = "roughnessAt")]
    pub fn roughness_at(&self, t: f64) -> f64 {
        self.inner.roughness_at(t)
    }
}

/// Time-varying thin film (e.g. soap bubble with varying thickness).
#[wasm_bindgen]
pub struct TemporalThinFilm {
    inner: CoreTemporalThinFilm,
}

#[wasm_bindgen]
impl TemporalThinFilm {
    /// Create with base thickness and oscillation parameters.
    #[wasm_bindgen(constructor)]
    pub fn new(
        base_thickness_nm: f64,
        oscillation_amplitude: f64,
        oscillation_frequency: f64,
    ) -> Self {
        Self {
            inner: CoreTemporalThinFilm::new(
                base_thickness_nm,
                oscillation_amplitude,
                oscillation_frequency,
            ),
        }
    }

    /// Get film thickness at time t.
    #[wasm_bindgen(js_name = "thicknessAt")]
    pub fn thickness_at(&self, t: f64) -> f64 {
        self.inner.thickness_at(t)
    }
}

/// Time-varying conductor (temperature-dependent metal properties).
#[wasm_bindgen]
pub struct TemporalConductor {
    inner: CoreTemporalConductor,
}

#[wasm_bindgen]
impl TemporalConductor {
    /// Create with base temperature and heating rate.
    #[wasm_bindgen(constructor)]
    pub fn new(base_temp_k: f64, heating_rate_k_per_sec: f64) -> Self {
        Self {
            inner: CoreTemporalConductor::new(
                base_temp_k,
                heating_rate_k_per_sec,
            ),
        }
    }

    /// Get temperature at time t.
    #[wasm_bindgen(js_name = "temperatureAt")]
    pub fn temperature_at(&self, t: f64) -> f64 {
        self.inner.temperature_at(t)
    }
}

// =============================================================================
// NEURAL CONSTRAINTS (Physics Enforcement)
// =============================================================================

use momoto_materials::glass_physics::neural_constraints::{
    ConstraintValidator as CoreConstraintValidator,
    ConstraintConfig as CoreConstraintConfig,
    ConstraintType as CoreConstraintType,
    RegularizationTerms as CoreRegularizationTerms,
};

/// Physics constraint validator for neural network outputs.
///
/// Ensures energy conservation, Fresnel reciprocity, spectral smoothness,
/// physical range validity, and Fresnel monotonicity.
#[wasm_bindgen]
pub struct ConstraintValidator {
    inner: CoreConstraintValidator,
}

#[wasm_bindgen]
impl ConstraintValidator {
    /// Create with default tolerance.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { inner: CoreConstraintValidator::new(CoreConstraintConfig::default()) }
    }

    /// Create with custom tolerance.
    #[wasm_bindgen(js_name = "withTolerance")]
    pub fn with_tolerance(tolerance: f64) -> Self {
        Self {
            inner: CoreConstraintValidator::new(CoreConstraintConfig {
                tolerance,
                ..CoreConstraintConfig::default()
            }),
        }
    }

    /// Validate a BSDF response and return regularization penalties.
    ///
    /// # Arguments
    /// * `reflectance` - Reflectance value (0.0 to 1.0)
    /// * `transmittance` - Transmittance value (0.0 to 1.0)
    /// * `absorption` - Absorption value (0.0 to 1.0)
    ///
    /// # Returns
    /// JSON: { energyPenalty, reciprocityPenalty, smoothnessPenalty,
    ///         rangePenalty, fresnelPenalty, totalPenalty }
    #[wasm_bindgen]
    pub fn validate(
        &self,
        reflectance: f64,
        transmittance: f64,
        absorption: f64,
    ) -> Result<JsValue, JsValue> {
        let terms = self.inner.validate(reflectance, transmittance, absorption);
        serde_wasm_bindgen::to_value(&terms)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Validate and clamp outputs to physical validity.
    ///
    /// Ensures R + T + A = 1.0 (energy conservation).
    ///
    /// # Returns
    /// Float64Array [corrected_reflectance, corrected_transmittance, corrected_absorption]
    #[wasm_bindgen(js_name = "validateAndClamp")]
    pub fn validate_and_clamp(
        &self,
        reflectance: f64,
        transmittance: f64,
        absorption: f64,
    ) -> Box<[f64]> {
        let (r, t, a) = self.inner.validate_and_clamp(reflectance, transmittance, absorption);
        Box::new([r, t, a])
    }
}

// =============================================================================
// PBR API v1.0 — Unified BSDF
// =============================================================================

use momoto_materials::glass_physics::unified_bsdf::{
    BSDFContext as CoreBSDFContext,
    BSDFResponse as CoreBSDFResponse,
    EnergyValidation as CoreEnergyValidation,
    DielectricBSDF as CoreDielectricBSDF,
    ConductorBSDF as CoreConductorBSDF,
    ThinFilmBSDF as CoreThinFilmBSDF,
    LambertianBSDF as CoreLambertianBSDF,
    LayeredBSDF as CoreLayeredBSDF,
    Vector3,
    BSDF,
};

/// Dielectric BSDF (glass, water, plastics).
///
/// Models transparent materials with refraction and reflection.
#[wasm_bindgen]
pub struct DielectricBSDF {
    inner: CoreDielectricBSDF,
}

#[wasm_bindgen]
impl DielectricBSDF {
    /// Create from IOR and roughness.
    ///
    /// # Arguments
    /// * `ior` - Index of refraction (1.0 = air, 1.5 = glass)
    /// * `roughness` - Surface roughness (0.0 = perfect mirror, 1.0 = diffuse)
    #[wasm_bindgen(constructor)]
    pub fn new(ior: f64, roughness: f64) -> Self {
        Self { inner: CoreDielectricBSDF::new(ior, roughness) }
    }

    /// Glass preset (IOR 1.5, roughness 0.05).
    pub fn glass() -> Self {
        Self { inner: CoreDielectricBSDF::glass() }
    }

    /// Water preset (IOR 1.33, roughness 0.01).
    pub fn water() -> Self {
        Self { inner: CoreDielectricBSDF::water() }
    }

    /// Diamond preset (IOR 2.42, roughness 0.0).
    pub fn diamond() -> Self {
        Self { inner: CoreDielectricBSDF::diamond() }
    }

    /// Evaluate BSDF for given incident and outgoing directions.
    ///
    /// # Arguments
    /// * `wi_x/y/z` - Incident direction (towards surface)
    /// * `wo_x/y/z` - Outgoing direction (away from surface)
    ///
    /// # Returns
    /// Object { reflectance, transmittance, absorption, colorRgb: [r,g,b] }
    pub fn evaluate(
        &self,
        wi_x: f64, wi_y: f64, wi_z: f64,
        wo_x: f64, wo_y: f64, wo_z: f64,
    ) -> Result<JsValue, JsValue> {
        let ctx = CoreBSDFContext {
            wi: Vector3::new(wi_x, wi_y, wi_z),
            wo: Vector3::new(wo_x, wo_y, wo_z),
            normal: Vector3::unit_z(),
            tangent: Vector3::unit_x(),
            bitangent: Vector3::unit_y(),
            wavelength: 550.0,
            wavelengths: None,
        };
        let response = self.inner.evaluate(&ctx);
        serde_wasm_bindgen::to_value(&response)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Validate energy conservation.
    ///
    /// # Returns
    /// Object { conserved: bool, totalEnergy, error, maxError }
    #[wasm_bindgen(js_name = "validateEnergy")]
    pub fn validate_energy(&self) -> Result<JsValue, JsValue> {
        let validation = self.inner.validate_energy();
        serde_wasm_bindgen::to_value(&validation)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Conductor BSDF (metals).
///
/// Models opaque metallic materials with complex IOR.
#[wasm_bindgen]
pub struct ConductorBSDF {
    inner: CoreConductorBSDF,
}

#[wasm_bindgen]
impl ConductorBSDF {
    /// Create from complex IOR (n + ik) and roughness.
    #[wasm_bindgen(constructor)]
    pub fn new(n: f64, k: f64, roughness: f64) -> Self {
        Self { inner: CoreConductorBSDF::new(n, k, roughness) }
    }

    /// Gold preset.
    pub fn gold() -> Self {
        Self { inner: CoreConductorBSDF::gold() }
    }

    /// Silver preset.
    pub fn silver() -> Self {
        Self { inner: CoreConductorBSDF::silver() }
    }

    /// Copper preset.
    pub fn copper() -> Self {
        Self { inner: CoreConductorBSDF::copper() }
    }

    /// Evaluate BSDF.
    pub fn evaluate(
        &self,
        wi_x: f64, wi_y: f64, wi_z: f64,
        wo_x: f64, wo_y: f64, wo_z: f64,
    ) -> Result<JsValue, JsValue> {
        let ctx = CoreBSDFContext {
            wi: Vector3::new(wi_x, wi_y, wi_z),
            wo: Vector3::new(wo_x, wo_y, wo_z),
            normal: Vector3::unit_z(),
            tangent: Vector3::unit_x(),
            bitangent: Vector3::unit_y(),
            wavelength: 550.0,
            wavelengths: None,
        };
        let response = self.inner.evaluate(&ctx);
        serde_wasm_bindgen::to_value(&response)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Validate energy conservation.
    #[wasm_bindgen(js_name = "validateEnergy")]
    pub fn validate_energy(&self) -> Result<JsValue, JsValue> {
        let validation = self.inner.validate_energy();
        serde_wasm_bindgen::to_value(&validation)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Thin-film BSDF (soap bubbles, oil slicks, coatings).
#[wasm_bindgen]
pub struct ThinFilmBSDF {
    inner: CoreThinFilmBSDF,
}

#[wasm_bindgen]
impl ThinFilmBSDF {
    /// Create from film thickness and IOR.
    ///
    /// # Arguments
    /// * `thickness_nm` - Film thickness in nanometers (100-1000 typical)
    /// * `film_ior` - Film index of refraction
    /// * `substrate_ior` - Substrate IOR
    #[wasm_bindgen(constructor)]
    pub fn new(thickness_nm: f64, film_ior: f64, substrate_ior: f64) -> Self {
        Self { inner: CoreThinFilmBSDF::new(thickness_nm, film_ior, substrate_ior) }
    }

    /// Soap bubble preset.
    #[wasm_bindgen(js_name = "soapBubble")]
    pub fn soap_bubble() -> Self {
        Self { inner: CoreThinFilmBSDF::soap_bubble() }
    }

    /// Oil slick preset.
    #[wasm_bindgen(js_name = "oilSlick")]
    pub fn oil_slick() -> Self {
        Self { inner: CoreThinFilmBSDF::oil_slick() }
    }

    /// AR coating preset.
    #[wasm_bindgen(js_name = "arCoating")]
    pub fn ar_coating() -> Self {
        Self { inner: CoreThinFilmBSDF::ar_coating() }
    }

    /// Evaluate BSDF.
    pub fn evaluate(
        &self,
        wi_x: f64, wi_y: f64, wi_z: f64,
        wo_x: f64, wo_y: f64, wo_z: f64,
    ) -> Result<JsValue, JsValue> {
        let ctx = CoreBSDFContext {
            wi: Vector3::new(wi_x, wi_y, wi_z),
            wo: Vector3::new(wo_x, wo_y, wo_z),
            normal: Vector3::unit_z(),
            tangent: Vector3::unit_x(),
            bitangent: Vector3::unit_y(),
            wavelength: 550.0,
            wavelengths: None,
        };
        let response = self.inner.evaluate(&ctx);
        serde_wasm_bindgen::to_value(&response)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Lambertian (diffuse) BSDF.
#[wasm_bindgen]
pub struct LambertianBSDF {
    inner: CoreLambertianBSDF,
}

#[wasm_bindgen]
impl LambertianBSDF {
    /// Create with albedo color.
    #[wasm_bindgen(constructor)]
    pub fn new(albedo_r: f64, albedo_g: f64, albedo_b: f64) -> Self {
        Self { inner: CoreLambertianBSDF::new([albedo_r, albedo_g, albedo_b]) }
    }

    /// White diffuse.
    pub fn white() -> Self {
        Self { inner: CoreLambertianBSDF::white() }
    }

    /// Evaluate BSDF.
    pub fn evaluate(
        &self,
        wi_x: f64, wi_y: f64, wi_z: f64,
        wo_x: f64, wo_y: f64, wo_z: f64,
    ) -> Result<JsValue, JsValue> {
        let ctx = CoreBSDFContext {
            wi: Vector3::new(wi_x, wi_y, wi_z),
            wo: Vector3::new(wo_x, wo_y, wo_z),
            normal: Vector3::unit_z(),
            tangent: Vector3::unit_x(),
            bitangent: Vector3::unit_y(),
            wavelength: 550.0,
            wavelengths: None,
        };
        let response = self.inner.evaluate(&ctx);
        serde_wasm_bindgen::to_value(&response)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Layered BSDF (multi-material stack).
///
/// Combines multiple BSDF layers: e.g. thin-film over dielectric over conductor.
#[wasm_bindgen]
pub struct LayeredBSDF {
    inner: CoreLayeredBSDF,
}

#[wasm_bindgen]
impl LayeredBSDF {
    /// Create empty layered material.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { inner: CoreLayeredBSDF::new() }
    }

    /// Add dielectric layer.
    #[wasm_bindgen(js_name = "addDielectric")]
    pub fn add_dielectric(&mut self, ior: f64, roughness: f64) {
        self.inner.add_dielectric(ior, roughness);
    }

    /// Add conductor layer.
    #[wasm_bindgen(js_name = "addConductor")]
    pub fn add_conductor(&mut self, n: f64, k: f64, roughness: f64) {
        self.inner.add_conductor(n, k, roughness);
    }

    /// Add thin-film layer.
    #[wasm_bindgen(js_name = "addThinFilm")]
    pub fn add_thin_film(&mut self, thickness_nm: f64, film_ior: f64) {
        self.inner.add_thin_film(thickness_nm, film_ior);
    }

    /// Add Lambertian (diffuse) layer.
    #[wasm_bindgen(js_name = "addLambertian")]
    pub fn add_lambertian(&mut self, albedo_r: f64, albedo_g: f64, albedo_b: f64) {
        self.inner.add_lambertian([albedo_r, albedo_g, albedo_b]);
    }

    /// Get number of layers.
    #[wasm_bindgen(js_name = "layerCount")]
    pub fn layer_count(&self) -> usize {
        self.inner.layer_count()
    }

    /// Evaluate the full layered material.
    pub fn evaluate(
        &self,
        wi_x: f64, wi_y: f64, wi_z: f64,
        wo_x: f64, wo_y: f64, wo_z: f64,
    ) -> Result<JsValue, JsValue> {
        let ctx = CoreBSDFContext {
            wi: Vector3::new(wi_x, wi_y, wi_z),
            wo: Vector3::new(wo_x, wo_y, wo_z),
            normal: Vector3::unit_z(),
            tangent: Vector3::unit_x(),
            bitangent: Vector3::unit_y(),
            wavelength: 550.0,
            wavelengths: None,
        };
        let response = self.inner.evaluate(&ctx);
        serde_wasm_bindgen::to_value(&response)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Validate energy conservation for all layers.
    #[wasm_bindgen(js_name = "validateEnergy")]
    pub fn validate_energy(&self) -> Result<JsValue, JsValue> {
        let validation = self.inner.validate_energy();
        serde_wasm_bindgen::to_value(&validation)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

// =============================================================================
// PBR MATERIAL (High-Level API)
// =============================================================================

use momoto_materials::glass_physics::pbr_api::v1::{
    Material as CorePBRMaterial,
    MaterialBuilder as CoreMaterialBuilder,
    MaterialPreset as CoreMaterialPreset,
};

/// High-level PBR material (wraps the BSDF stack).
#[wasm_bindgen]
pub struct PBRMaterial {
    inner: CorePBRMaterial,
}

#[wasm_bindgen]
impl PBRMaterial {
    /// Create from preset.
    ///
    /// Presets: "glass", "water", "diamond", "gold", "silver", "copper",
    ///          "aluminum", "plastic", "rubber"
    #[wasm_bindgen(js_name = "fromPreset")]
    pub fn from_preset(preset: &str) -> Result<PBRMaterial, JsValue> {
        let p = match preset {
            "glass" => CoreMaterialPreset::Glass,
            "water" => CoreMaterialPreset::Water,
            "diamond" => CoreMaterialPreset::Diamond,
            "gold" => CoreMaterialPreset::Gold,
            "silver" => CoreMaterialPreset::Silver,
            "copper" => CoreMaterialPreset::Copper,
            "aluminum" => CoreMaterialPreset::Aluminum,
            "plastic" => CoreMaterialPreset::Plastic,
            "rubber" => CoreMaterialPreset::Rubber,
            _ => return Err(JsValue::from_str(&format!("Unknown preset: {}", preset))),
        };
        Ok(PBRMaterial { inner: CorePBRMaterial::from_preset(p) })
    }

    /// Create material builder for custom composition.
    pub fn builder() -> PBRMaterialBuilder {
        PBRMaterialBuilder { inner: CoreMaterialBuilder::new() }
    }

    /// Evaluate the material at normal incidence.
    ///
    /// Returns JSON with reflectance, transmittance, absorption, color.
    #[wasm_bindgen(js_name = "evaluateNormal")]
    pub fn evaluate_normal(&self) -> Result<JsValue, JsValue> {
        let response = self.inner.evaluate_normal();
        serde_wasm_bindgen::to_value(&response)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Evaluate at specific angle.
    ///
    /// # Arguments
    /// * `cos_theta` - Cosine of incident angle (1.0 = normal, 0.0 = grazing)
    #[wasm_bindgen(js_name = "evaluateAtAngle")]
    pub fn evaluate_at_angle(&self, cos_theta: f64) -> Result<JsValue, JsValue> {
        let response = self.inner.evaluate_at_angle(cos_theta);
        serde_wasm_bindgen::to_value(&response)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    /// Get material descriptor as JSON.
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<JsValue, JsValue> {
        serde_wasm_bindgen::to_value(&self.inner.descriptor())
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

/// Builder for custom PBR materials.
#[wasm_bindgen]
pub struct PBRMaterialBuilder {
    inner: CoreMaterialBuilder,
}

#[wasm_bindgen]
impl PBRMaterialBuilder {
    #[wasm_bindgen(js_name = "addDielectric")]
    pub fn add_dielectric(mut self, ior: f64, roughness: f64) -> PBRMaterialBuilder {
        self.inner = self.inner.dielectric(ior, roughness);
        self
    }

    #[wasm_bindgen(js_name = "addConductor")]
    pub fn add_conductor(mut self, n: f64, k: f64, roughness: f64) -> PBRMaterialBuilder {
        self.inner = self.inner.conductor(n, k, roughness);
        self
    }

    #[wasm_bindgen(js_name = "addThinFilm")]
    pub fn add_thin_film(mut self, thickness_nm: f64, film_ior: f64) -> PBRMaterialBuilder {
        self.inner = self.inner.thin_film(thickness_nm, film_ior);
        self
    }

    #[wasm_bindgen(js_name = "addLambertian")]
    pub fn add_lambertian(mut self, r: f64, g: f64, b: f64) -> PBRMaterialBuilder {
        self.inner = self.inner.lambertian([r, g, b]);
        self
    }

    pub fn build(self) -> PBRMaterial {
        PBRMaterial { inner: self.inner.build() }
    }
}

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

use momoto_materials::glass_physics::temporal::interpolation::{
    smoothstep as core_smoothstep,
    smootherstep as core_smootherstep,
    ease_in_out as core_ease_in_out,
    remap as core_remap,
};

/// Hermite smoothstep (3t² - 2t³).
#[wasm_bindgen]
pub fn smoothstep(t: f64) -> f64 {
    core_smoothstep(t)
}

/// Perlin smootherstep (6t⁵ - 15t⁴ + 10t³).
#[wasm_bindgen]
pub fn smootherstep(t: f64) -> f64 {
    core_smootherstep(t)
}

/// Cubic ease-in-out.
#[wasm_bindgen(js_name = "easeInOut")]
pub fn ease_in_out(t: f64) -> f64 {
    core_ease_in_out(t)
}

/// Remap value from one range to another.
///
/// Maps `value` from [in_min, in_max] to [out_min, out_max].
#[wasm_bindgen]
pub fn remap(value: f64, in_min: f64, in_max: f64, out_min: f64, out_max: f64) -> f64 {
    core_remap(value, in_min, in_max, out_min, out_max)
}

// =============================================================================
// BATCH EVALUATION
// =============================================================================

use momoto_materials::glass_physics::batch::{
    BatchEvaluator as CoreBatchEvaluator,
    BatchMaterialInput as CoreBatchMaterialInput,
};

/// Evaluate multiple materials in a single batch call.
///
/// # Arguments
/// * `iors` - Float64Array of IOR values (one per material)
/// * `roughnesses` - Float64Array of roughness values
/// * `opacities` - Float64Array of opacity values
///
/// # Returns
/// JSON array of evaluated material results
#[wasm_bindgen(js_name = "evaluateMaterialBatch")]
pub fn evaluate_material_batch(
    iors: &[f64],
    roughnesses: &[f64],
    opacities: &[f64],
) -> Result<JsValue, JsValue> {
    if iors.len() != roughnesses.len() || iors.len() != opacities.len() {
        return Err(JsValue::from_str("All arrays must have the same length"));
    }

    let inputs: Vec<CoreBatchMaterialInput> = iors.iter()
        .zip(roughnesses.iter())
        .zip(opacities.iter())
        .map(|((&ior, &roughness), &opacity)| CoreBatchMaterialInput {
            ior,
            roughness,
            opacity,
        })
        .collect();

    let evaluator = CoreBatchEvaluator::new();
    let results = evaluator.evaluate(&inputs);

    serde_wasm_bindgen::to_value(&results)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

// =============================================================================
// PERCEPTUAL LOSS FUNCTIONS (DeltaE)
// =============================================================================

use momoto_materials::glass_physics::perceptual_loss::{
    delta_e_76 as core_delta_e_76,
    delta_e_94 as core_delta_e_94,
    delta_e_2000 as core_delta_e_2000,
    rgb_to_lab as core_rgb_to_lab,
    lab_to_rgb as core_lab_to_rgb,
};

/// CIE ΔE76 color difference.
///
/// Simple Euclidean distance in CIELAB space.
/// JND (Just Noticeable Difference) ≈ 2.3
#[wasm_bindgen(js_name = "deltaE76")]
pub fn delta_e_76(
    l1: f64, a1: f64, b1: f64,
    l2: f64, a2: f64, b2: f64,
) -> f64 {
    core_delta_e_76([l1, a1, b1], [l2, a2, b2])
}

/// CIE ΔE94 color difference (improved weighting).
#[wasm_bindgen(js_name = "deltaE94")]
pub fn delta_e_94(
    l1: f64, a1: f64, b1: f64,
    l2: f64, a2: f64, b2: f64,
) -> f64 {
    core_delta_e_94([l1, a1, b1], [l2, a2, b2])
}

/// CIEDE2000 color difference (state-of-the-art).
///
/// Most accurate perceptual difference metric.
/// Accounts for lightness, chroma, and hue weighting.
#[wasm_bindgen(js_name = "deltaE2000")]
pub fn delta_e_2000(
    l1: f64, a1: f64, b1: f64,
    l2: f64, a2: f64, b2: f64,
) -> f64 {
    core_delta_e_2000([l1, a1, b1], [l2, a2, b2])
}

/// Convert sRGB to CIELAB.
///
/// Returns [L, a, b] under D65 illuminant.
#[wasm_bindgen(js_name = "rgbToLab")]
pub fn rgb_to_lab(r: u8, g: u8, b: u8) -> Box<[f64]> {
    let lab = core_rgb_to_lab([r, g, b]);
    Box::new(lab)
}

/// Convert CIELAB to sRGB.
///
/// Returns [r, g, b] clamped to 0-255.
#[wasm_bindgen(js_name = "labToRgb")]
pub fn lab_to_rgb(l: f64, a: f64, b: f64) -> Box<[u8]> {
    let rgb = core_lab_to_rgb([l, a, b]);
    Box::new(rgb)
}

/// Batch: CIEDE2000 for multiple color pairs.
///
/// Input: Float64Array of [L1, a1, b1, L2, a2, b2, ...] (6 values per pair)
/// Output: Float64Array of ΔE2000 values
#[wasm_bindgen(js_name = "deltaE2000Batch")]
pub fn delta_e_2000_batch(lab_pairs: &[f64]) -> Result<Box<[f64]>, JsValue> {
    if lab_pairs.len() % 6 != 0 {
        return Err(JsValue::from_str(
            "Input must be multiple of 6: [L1, a1, b1, L2, a2, b2, ...]"
        ));
    }
    let count = lab_pairs.len() / 6;
    let mut results = Vec::with_capacity(count);
    for i in 0..count {
        let base = i * 6;
        results.push(core_delta_e_2000(
            [lab_pairs[base], lab_pairs[base + 1], lab_pairs[base + 2]],
            [lab_pairs[base + 3], lab_pairs[base + 4], lab_pairs[base + 5]],
        ));
    }
    Ok(results.into_boxed_slice())
}

// =============================================================================
// ENHANCED CSS BACKEND
// =============================================================================

use momoto_materials::css_enhanced::{
    render_enhanced_css as core_render_enhanced_css,
    render_premium_css as core_render_premium_css,
};

/// Render enhanced CSS for a glass material with all effects.
///
/// Includes: blur, shadow, specular highlights, Fresnel border,
///           thin-film iridescence, refraction distortion.
#[wasm_bindgen(js_name = "renderEnhancedCss")]
pub fn render_enhanced_css(
    material: &super::EvaluatedMaterial,
    context: &super::RenderContext,
) -> Result<String, JsValue> {
    core_render_enhanced_css(&material.to_core(), &context.to_core())
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Render premium CSS with all available effects.
///
/// Same as enhanced but includes animation keyframes and transition properties.
#[wasm_bindgen(js_name = "renderPremiumCss")]
pub fn render_premium_css(
    material: &super::EvaluatedMaterial,
    context: &super::RenderContext,
) -> Result<String, JsValue> {
    core_render_premium_css(&material.to_core(), &context.to_core())
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

// =============================================================================
// MATERIAL PRESETS (Enhanced Glass)
// =============================================================================

use momoto_materials::glass_physics::enhanced_presets;

/// Get all enhanced glass material presets as JSON.
///
/// Returns array of { name, ior, roughness, opacity, dispersion, description }
#[wasm_bindgen(js_name = "getEnhancedGlassPresets")]
pub fn get_enhanced_glass_presets() -> Result<JsValue, JsValue> {
    let presets = enhanced_presets::all_presets();
    serde_wasm_bindgen::to_value(&presets)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Get presets organized by quality tier.
///
/// Returns { low: [...], medium: [...], high: [...], ultra: [...] }
#[wasm_bindgen(js_name = "getPresetsByQuality")]
pub fn get_presets_by_quality() -> Result<JsValue, JsValue> {
    let tiers = enhanced_presets::presets_by_quality();
    serde_wasm_bindgen::to_value(&tiers)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}
