//! # Analytical Gradient Computations
//!
//! Core gradient functions for all optical models.
//!
//! All gradients are derived analytically from physical equations.

use std::f64::consts::PI;

// ============================================================================
// FRESNEL GRADIENTS
// ============================================================================

/// Fresnel Schlick approximation with gradient.
///
/// Returns (F, ∂F/∂n) where F is the Fresnel reflectance.
///
/// # Derivation
/// ```text
/// F₀ = ((n-1)/(n+1))²
/// F(θ) = F₀ + (1 - F₀)(1 - cosθ)⁵
///
/// ∂F₀/∂n = 4(n-1)/(n+1)³
/// ∂F/∂n = ∂F₀/∂n × (1 - (1 - cosθ)⁵)
/// ```
pub fn fresnel_schlick_gradient(cos_theta: f64, n: f64) -> (f64, f64) {
    let cos_theta = cos_theta.abs().clamp(0.0, 1.0);

    // F₀ = ((n-1)/(n+1))²
    let r = (n - 1.0) / (n + 1.0);
    let f0 = r * r;

    // Schlick term
    let one_minus_cos = 1.0 - cos_theta;
    let schlick = one_minus_cos.powi(5);

    // F(θ) = F₀ + (1 - F₀) × schlick
    let fresnel = f0 + (1.0 - f0) * schlick;

    // ∂F₀/∂n = 4(n-1)/(n+1)³
    let df0_dn = 4.0 * (n - 1.0) / (n + 1.0).powi(3);

    // ∂F/∂n = ∂F₀/∂n × (1 - schlick)
    let df_dn = df0_dn * (1.0 - schlick);

    (fresnel, df_dn)
}

/// Fresnel for conductor with gradient.
///
/// Returns (F, ∂F/∂n, ∂F/∂k) for conductor Fresnel reflectance.
///
/// # Derivation
/// For a conductor with complex IOR η = n + ik:
/// ```text
/// F = |η cos θ - 1|² / |η cos θ + 1|²
///   = ((n·cosθ - 1)² + k²·cos²θ) / ((n·cosθ + 1)² + k²·cos²θ)
/// ```
pub fn fresnel_conductor_gradient(cos_theta: f64, n: f64, k: f64) -> (f64, f64, f64) {
    let cos_theta = cos_theta.abs().clamp(0.0, 1.0);
    let cos2 = cos_theta * cos_theta;

    // Numerator: (n·cosθ - 1)² + k²·cos²θ
    let n_cos = n * cos_theta;
    let a = n_cos - 1.0;
    let b = k * cos_theta;
    let num = a * a + b * b;

    // Denominator: (n·cosθ + 1)² + k²·cos²θ
    let c = n_cos + 1.0;
    let denom = c * c + b * b;

    // Fresnel reflectance
    let fresnel = num / denom;

    // ∂F/∂n = 2cosθ × (a/denom - c×F/denom)
    let df_dn = 2.0 * cos_theta * (a / denom - c * fresnel / denom);

    // ∂F/∂k = 2k×cos²θ × (1/denom - F/denom)
    let df_dk = 2.0 * k * cos2 * (1.0 / denom - fresnel / denom);

    (fresnel, df_dn, df_dk)
}

/// Fresnel gradient with respect to angle (for normal optimization).
///
/// Returns ∂F/∂cosθ.
pub fn fresnel_schlick_cos_gradient(cos_theta: f64, n: f64) -> f64 {
    let cos_theta = cos_theta.abs().clamp(0.0, 1.0);

    let r = (n - 1.0) / (n + 1.0);
    let f0 = r * r;

    // ∂F/∂cosθ = -5(1 - F₀)(1 - cosθ)⁴
    let one_minus_cos = 1.0 - cos_theta;
    -5.0 * (1.0 - f0) * one_minus_cos.powi(4)
}

// ============================================================================
// GGX DISTRIBUTION GRADIENTS
// ============================================================================

/// GGX normal distribution with gradient.
///
/// Returns (D, ∂D/∂α) where D is the GGX distribution.
///
/// # Derivation
/// ```text
/// D(h) = α² / (π × ((n·h)² × (α² - 1) + 1)²)
///
/// Let d = (n·h)² × (α² - 1) + 1
/// D = α² / (π × d²)
///
/// ∂d/∂α = 2α × (n·h)²
/// ∂D/∂α = (2α × d - α² × 2d × ∂d/∂α) / (π × d⁴)
///       = 2α × (d - α² × (n·h)²) / (π × d³)
///       = 2α × (1 - (n·h)² × α² + (n·h)² - (n·h)² × α²) / (π × d³)
///       = 2α × (1 - (n·h)²) / (π × d³)
/// ```
pub fn ggx_distribution_gradient(cos_theta_h: f64, alpha: f64) -> (f64, f64) {
    let cos_theta_h = cos_theta_h.abs().clamp(0.0, 1.0);
    let alpha = alpha.max(0.001); // Avoid division by zero

    let cos2 = cos_theta_h * cos_theta_h;
    let alpha2 = alpha * alpha;

    // d = cos²θ × (α² - 1) + 1
    let d = cos2 * (alpha2 - 1.0) + 1.0;
    let d2 = d * d;

    // D = α² / (π × d²)
    let distribution = alpha2 / (PI * d2);

    // ∂D/∂α = 2α × (1 - cos²θ) / (π × d³)
    // More precisely: ∂D/∂α = 2α × (d - 2α²×cos²θ) / (π × d³)
    let d3 = d * d2;
    let dd_dalpha = 2.0 * alpha * cos2;
    let numerator = 2.0 * alpha * d - alpha2 * 2.0 * dd_dalpha;
    let dd_dalpha_result = numerator / (PI * d3);

    (distribution, dd_dalpha_result)
}

/// GGX distribution gradient with respect to angle.
///
/// Returns ∂D/∂cosθ_h.
pub fn ggx_distribution_cos_gradient(cos_theta_h: f64, alpha: f64) -> f64 {
    let cos_theta_h = cos_theta_h.abs().clamp(0.0, 1.0);
    let alpha = alpha.max(0.001);

    let cos2 = cos_theta_h * cos_theta_h;
    let alpha2 = alpha * alpha;

    let d = cos2 * (alpha2 - 1.0) + 1.0;
    let d3 = d * d * d;

    // ∂D/∂cosθ_h = -4α² × cosθ_h × (α² - 1) / (π × d³)
    -4.0 * alpha2 * cos_theta_h * (alpha2 - 1.0) / (PI * d3)
}

// ============================================================================
// SMITH GEOMETRY GRADIENTS
// ============================================================================

/// Smith G1 term with gradient.
///
/// Returns (G1, ∂G1/∂α).
///
/// # Derivation
/// ```text
/// G1(v) = 2(n·v) / ((n·v) + √(α² + (1-α²)(n·v)²))
/// ```
pub fn smith_g1_gradient(cos_theta: f64, alpha: f64) -> (f64, f64) {
    let cos_theta = cos_theta.abs().clamp(0.001, 1.0);
    let alpha = alpha.max(0.001);

    let cos2 = cos_theta * cos_theta;
    let alpha2 = alpha * alpha;

    // sqrt term: √(α² + (1-α²)×cos²θ)
    let inner = alpha2 + (1.0 - alpha2) * cos2;
    let sqrt_inner = inner.sqrt();

    // G1 = 2cosθ / (cosθ + sqrt_inner)
    let denom = cos_theta + sqrt_inner;
    let g1 = 2.0 * cos_theta / denom;

    // ∂(sqrt_inner)/∂α = (2α - 2α×cos²θ) / (2×sqrt_inner)
    //                  = α(1 - cos²θ) / sqrt_inner
    let d_sqrt_dalpha = alpha * (1.0 - cos2) / sqrt_inner;

    // ∂G1/∂α = -2cosθ × d_sqrt_dalpha / denom²
    let dg1_dalpha = -2.0 * cos_theta * d_sqrt_dalpha / (denom * denom);

    (g1, dg1_dalpha)
}

/// Smith G term (product of G1 terms) with gradient.
///
/// Returns (G, ∂G/∂α).
pub fn smith_g_gradient(cos_theta_i: f64, cos_theta_o: f64, alpha: f64) -> (f64, f64) {
    let (g1_i, dg1_i_dalpha) = smith_g1_gradient(cos_theta_i, alpha);
    let (g1_o, dg1_o_dalpha) = smith_g1_gradient(cos_theta_o, alpha);

    let g = g1_i * g1_o;

    // Product rule: ∂G/∂α = G1_i × ∂G1_o/∂α + G1_o × ∂G1_i/∂α
    let dg_dalpha = g1_i * dg1_o_dalpha + g1_o * dg1_i_dalpha;

    (g, dg_dalpha)
}

// ============================================================================
// BEER-LAMBERT GRADIENTS
// ============================================================================

/// Beer-Lambert transmittance with gradients.
///
/// Returns (T, ∂T/∂α, ∂T/∂d) where T = exp(-α×d).
pub fn beer_lambert_gradient(absorption: f64, distance: f64) -> (f64, f64, f64) {
    let absorption = absorption.max(0.0);
    let distance = distance.max(0.0);

    let transmittance = (-absorption * distance).exp();

    // ∂T/∂α = -d × T
    let dt_dalpha = -distance * transmittance;

    // ∂T/∂d = -α × T
    let dt_dd = -absorption * transmittance;

    (transmittance, dt_dalpha, dt_dd)
}

// ============================================================================
// THIN-FILM GRADIENTS
// ============================================================================

/// Thin-film reflectance with gradients.
///
/// Returns (R, ∂R/∂thickness, ∂R/∂n_film).
///
/// # Derivation
/// Using Airy formula for thin-film interference:
/// ```text
/// δ = 4π × n_film × d × cosθ' / λ
/// r = (r₀₁² + r₁₂² + 2×r₀₁×r₁₂×cos δ) / (1 + r₀₁²×r₁₂² + 2×r₀₁×r₁₂×cos δ)
///
/// ∂δ/∂d = 4π × n_film × cosθ' / λ
/// ∂δ/∂n_film = 4π × d × cosθ' / λ + phase correction
/// ```
pub fn thin_film_gradient(
    wavelength_nm: f64,
    n_ambient: f64,
    n_film: f64,
    n_substrate: f64,
    thickness_nm: f64,
    cos_theta: f64,
) -> (f64, f64, f64) {
    let cos_theta = cos_theta.abs().clamp(0.0, 1.0);

    // Snell's law for angle in film
    let sin_theta = (1.0 - cos_theta * cos_theta).sqrt();
    let sin_theta_film = (n_ambient / n_film) * sin_theta;
    let sin_theta_film = sin_theta_film.clamp(-1.0, 1.0);
    let cos_theta_film = (1.0 - sin_theta_film * sin_theta_film).sqrt();

    // Fresnel coefficients at interfaces
    let r01 = (n_ambient * cos_theta - n_film * cos_theta_film)
        / (n_ambient * cos_theta + n_film * cos_theta_film);
    let r12 = (n_film * cos_theta_film - n_substrate * cos_theta)
        / (n_film * cos_theta_film + n_substrate * cos_theta);

    // Phase difference
    let delta = 4.0 * PI * n_film * thickness_nm * cos_theta_film / wavelength_nm;
    let cos_delta = delta.cos();
    let sin_delta = delta.sin();

    // Reflectance (Airy formula)
    let r01_sq = r01 * r01;
    let r12_sq = r12 * r12;
    let r01_r12 = r01 * r12;

    let numerator = r01_sq + r12_sq + 2.0 * r01_r12 * cos_delta;
    let denominator = 1.0 + r01_sq * r12_sq + 2.0 * r01_r12 * cos_delta;
    let reflectance = numerator / denominator;

    // ∂δ/∂thickness
    let d_delta_d_thickness = 4.0 * PI * n_film * cos_theta_film / wavelength_nm;

    // ∂R/∂δ (via cos_delta)
    let d_num_d_delta = -2.0 * r01_r12 * sin_delta;
    let d_denom_d_delta = -2.0 * r01_r12 * sin_delta;
    let d_r_d_delta = (d_num_d_delta * denominator - numerator * d_denom_d_delta)
        / (denominator * denominator);

    // ∂R/∂thickness = ∂R/∂δ × ∂δ/∂thickness
    let d_r_d_thickness = d_r_d_delta * d_delta_d_thickness;

    // ∂δ/∂n_film (includes path length change)
    let d_delta_d_n_film = 4.0 * PI * thickness_nm * cos_theta_film / wavelength_nm;

    // ∂R/∂n_film = ∂R/∂δ × ∂δ/∂n_film + (fresnel coefficient changes)
    // Simplified: ignoring fresnel coefficient derivatives for now
    let d_r_d_n_film = d_r_d_delta * d_delta_d_n_film;

    (reflectance, d_r_d_thickness, d_r_d_n_film)
}

// ============================================================================
// HENYEY-GREENSTEIN GRADIENT
// ============================================================================

/// Henyey-Greenstein phase function with gradient.
///
/// Returns (p, ∂p/∂g).
pub fn henyey_greenstein_gradient(cos_theta: f64, g: f64) -> (f64, f64) {
    let g = g.clamp(-0.99, 0.99);
    let g2 = g * g;

    // p(θ) = (1 - g²) / (4π × (1 + g² - 2g×cosθ)^(3/2))
    let denom_inner = 1.0 + g2 - 2.0 * g * cos_theta;
    let denom_pow = denom_inner.powf(1.5);

    let phase = (1.0 - g2) / (4.0 * PI * denom_pow);

    // ∂p/∂g = d[(1-g²)] × 1/denom + (1-g²) × d[1/denom]
    // d[(1-g²)]/dg = -2g
    // d[denom^(-3/2)]/dg = -3/2 × denom^(-5/2) × (2g - 2cosθ)
    //                    = -3(g - cosθ) / denom^(5/2)

    let d_num_dg = -2.0 * g;
    let denom_pow_5_2 = denom_inner.powf(2.5);
    let d_inv_denom_dg = -3.0 * (g - cos_theta) / (4.0 * PI * denom_pow_5_2);

    let dp_dg = d_num_dg / (4.0 * PI * denom_pow) + (1.0 - g2) * d_inv_denom_dg;

    (phase, dp_dg)
}

// ============================================================================
// COMBINED BSDF GRADIENT
// ============================================================================

/// Compute full BSDF gradient for microfacet model.
///
/// Combines Fresnel, GGX distribution, and Smith geometry gradients.
pub fn microfacet_bsdf_gradient(
    cos_theta_i: f64,
    cos_theta_o: f64,
    cos_theta_h: f64,
    n: f64,
    alpha: f64,
) -> MicrofacetGradient {
    // Forward values
    let (fresnel, df_dn) = fresnel_schlick_gradient(cos_theta_h, n);
    let (distribution, dd_dalpha) = ggx_distribution_gradient(cos_theta_h, alpha);
    let (geometry, dg_dalpha) = smith_g_gradient(cos_theta_i, cos_theta_o, alpha);

    // BSDF value: f = F × D × G / (4 × cosθ_i × cosθ_o)
    let denom = 4.0 * cos_theta_i.abs().max(0.001) * cos_theta_o.abs().max(0.001);
    let bsdf = fresnel * distribution * geometry / denom;

    // ∂f/∂n = ∂F/∂n × D × G / denom
    let df_bsdf_dn = df_dn * distribution * geometry / denom;

    // ∂f/∂α = F × (∂D/∂α × G + D × ∂G/∂α) / denom
    let df_bsdf_dalpha = fresnel * (dd_dalpha * geometry + distribution * dg_dalpha) / denom;

    MicrofacetGradient {
        value: bsdf,
        d_ior: df_bsdf_dn,
        d_roughness: df_bsdf_dalpha,
        fresnel,
        distribution,
        geometry,
    }
}

/// Result of microfacet BSDF gradient computation.
#[derive(Debug, Clone)]
pub struct MicrofacetGradient {
    /// BSDF value.
    pub value: f64,
    /// Gradient w.r.t. IOR.
    pub d_ior: f64,
    /// Gradient w.r.t. roughness.
    pub d_roughness: f64,
    /// Fresnel term.
    pub fresnel: f64,
    /// Distribution term.
    pub distribution: f64,
    /// Geometry term.
    pub geometry: f64,
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    const EPSILON: f64 = 1e-5;

    fn numerical_gradient<F: Fn(f64) -> f64>(f: F, x: f64, h: f64) -> f64 {
        (f(x + h) - f(x - h)) / (2.0 * h)
    }

    #[test]
    fn test_fresnel_schlick_gradient() {
        let cos_theta = 0.8;
        let n = 1.5;

        let (f, df_dn) = fresnel_schlick_gradient(cos_theta, n);

        // Verify value is reasonable
        assert!(f >= 0.0 && f <= 1.0);

        // Numerical gradient
        let numeric = numerical_gradient(
            |n_| fresnel_schlick_gradient(cos_theta, n_).0,
            n,
            EPSILON,
        );

        assert!(
            (df_dn - numeric).abs() < 1e-4,
            "Analytical: {}, Numerical: {}",
            df_dn,
            numeric
        );
    }

    #[test]
    fn test_fresnel_conductor_gradient() {
        let cos_theta = 0.8;
        let n = 0.5;
        let k = 2.0;

        let (f, df_dn, df_dk) = fresnel_conductor_gradient(cos_theta, n, k);

        assert!(f >= 0.0 && f <= 1.0);

        // Numerical gradient w.r.t. n
        let numeric_n = numerical_gradient(
            |n_| fresnel_conductor_gradient(cos_theta, n_, k).0,
            n,
            EPSILON,
        );

        assert!(
            (df_dn - numeric_n).abs() < 1e-4,
            "df/dn: Analytical {}, Numerical {}",
            df_dn,
            numeric_n
        );

        // Numerical gradient w.r.t. k
        let numeric_k = numerical_gradient(
            |k_| fresnel_conductor_gradient(cos_theta, n, k_).0,
            k,
            EPSILON,
        );

        assert!(
            (df_dk - numeric_k).abs() < 1e-4,
            "df/dk: Analytical {}, Numerical {}",
            df_dk,
            numeric_k
        );
    }

    #[test]
    fn test_ggx_distribution_gradient() {
        let cos_theta_h = 0.9;
        let alpha = 0.3;

        let (d, dd_dalpha) = ggx_distribution_gradient(cos_theta_h, alpha);

        assert!(d >= 0.0);

        let numeric = numerical_gradient(
            |a| ggx_distribution_gradient(cos_theta_h, a).0,
            alpha,
            EPSILON,
        );

        assert!(
            (dd_dalpha - numeric).abs() < 1e-3,
            "Analytical: {}, Numerical: {}",
            dd_dalpha,
            numeric
        );
    }

    #[test]
    fn test_smith_g1_gradient() {
        let cos_theta = 0.7;
        let alpha = 0.25;

        let (g1, dg1_dalpha) = smith_g1_gradient(cos_theta, alpha);

        assert!(g1 >= 0.0 && g1 <= 1.0);

        let numeric = numerical_gradient(
            |a| smith_g1_gradient(cos_theta, a).0,
            alpha,
            EPSILON,
        );

        assert!(
            (dg1_dalpha - numeric).abs() < 1e-4,
            "Analytical: {}, Numerical: {}",
            dg1_dalpha,
            numeric
        );
    }

    #[test]
    fn test_beer_lambert_gradient() {
        let absorption = 0.5;
        let distance = 2.0;

        let (t, dt_dalpha, dt_dd) = beer_lambert_gradient(absorption, distance);

        assert!(t >= 0.0 && t <= 1.0);

        // Numerical gradient w.r.t. absorption
        let numeric_alpha = numerical_gradient(
            |a| beer_lambert_gradient(a, distance).0,
            absorption,
            EPSILON,
        );

        assert!(
            (dt_dalpha - numeric_alpha).abs() < 1e-4,
            "dt/dα: Analytical {}, Numerical {}",
            dt_dalpha,
            numeric_alpha
        );

        // Numerical gradient w.r.t. distance
        let numeric_d = numerical_gradient(
            |d| beer_lambert_gradient(absorption, d).0,
            distance,
            EPSILON,
        );

        assert!(
            (dt_dd - numeric_d).abs() < 1e-4,
            "dt/dd: Analytical {}, Numerical {}",
            dt_dd,
            numeric_d
        );
    }

    #[test]
    fn test_thin_film_gradient() {
        let wavelength = 550.0;
        let n_ambient = 1.0;
        let n_film = 1.4;
        let n_substrate = 1.5;
        let thickness = 200.0;
        let cos_theta = 0.8;

        let (r, dr_dt, dr_dn) = thin_film_gradient(
            wavelength, n_ambient, n_film, n_substrate, thickness, cos_theta,
        );

        assert!(r >= 0.0 && r <= 1.0);

        // Numerical gradient w.r.t. thickness
        let numeric_t = numerical_gradient(
            |t| thin_film_gradient(wavelength, n_ambient, n_film, n_substrate, t, cos_theta).0,
            thickness,
            EPSILON,
        );

        assert!(
            (dr_dt - numeric_t).abs() < 1e-3,
            "dr/dt: Analytical {}, Numerical {}",
            dr_dt,
            numeric_t
        );
    }

    #[test]
    fn test_henyey_greenstein_gradient() {
        let cos_theta = 0.5;
        let g = 0.3;

        let (p, dp_dg) = henyey_greenstein_gradient(cos_theta, g);

        assert!(p >= 0.0);

        let numeric = numerical_gradient(
            |g_| henyey_greenstein_gradient(cos_theta, g_).0,
            g,
            EPSILON,
        );

        assert!(
            (dp_dg - numeric).abs() < 1e-4,
            "Analytical: {}, Numerical: {}",
            dp_dg,
            numeric
        );
    }

    #[test]
    fn test_microfacet_bsdf_gradient() {
        let cos_i = 0.8;
        let cos_o = 0.7;
        let cos_h = 0.9;
        let n = 1.5;
        let alpha = 0.2;

        let result = microfacet_bsdf_gradient(cos_i, cos_o, cos_h, n, alpha);

        assert!(result.value >= 0.0);
        assert!(result.fresnel >= 0.0 && result.fresnel <= 1.0);
        assert!(result.distribution >= 0.0);
        assert!(result.geometry >= 0.0 && result.geometry <= 1.0);

        // Numerical gradient w.r.t. IOR
        let numeric_n = numerical_gradient(
            |n_| microfacet_bsdf_gradient(cos_i, cos_o, cos_h, n_, alpha).value,
            n,
            EPSILON,
        );

        assert!(
            (result.d_ior - numeric_n).abs() < 1e-3,
            "d_ior: Analytical {}, Numerical {}",
            result.d_ior,
            numeric_n
        );
    }

    #[test]
    fn test_gradients_at_boundaries() {
        // Test at cos_theta = 0 (grazing angle)
        let (f, df) = fresnel_schlick_gradient(0.0, 1.5);
        assert!((f - 1.0).abs() < 1e-6); // Total reflection at grazing
        assert!(df.is_finite());

        // Test at cos_theta = 1 (normal incidence)
        let (f, df) = fresnel_schlick_gradient(1.0, 1.5);
        assert!(f >= 0.0 && f <= 1.0);
        assert!(df.is_finite());

        // Test with n = 1: F₀ = 0, but Schlick still produces small non-zero f
        // f = schlick term, df/dn = 0 because ∂F₀/∂n = 0 when n = 1
        let (f, df) = fresnel_schlick_gradient(0.5, 1.0);
        assert!(f < 0.1); // Small but non-zero due to Schlick approximation
        assert!(df.abs() < 1e-6); // Gradient w.r.t. n is 0 at n=1
    }
}
