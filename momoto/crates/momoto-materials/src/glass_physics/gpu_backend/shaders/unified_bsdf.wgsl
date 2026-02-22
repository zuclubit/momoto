// ============================================================================
// Unified BSDF Compute Shader
// GPU-accelerated Dielectric and Conductor BSDF evaluation
// ============================================================================
//
// This shader implements:
// - Fresnel equations (Schlick approximation + conductor)
// - Beer-Lambert transmittance
// - Energy conservation (R + T + A = 1)
// - GGX microfacet distribution
//
// Parity Target: ΔE2000 < 1.0 vs CPU reference

// ============================================================================
// DATA STRUCTURES
// ============================================================================

struct MaterialInput {
    ior: f32,           // Index of Refraction
    cos_theta: f32,     // Cosine of incident angle
    absorption: f32,    // Absorption coefficient
    thickness: f32,     // Material thickness (mm)
    g: f32,             // Scattering asymmetry (Henyey-Greenstein)
    roughness: f32,     // GGX roughness (alpha)
    metallic: f32,      // Metallic factor (0 = dielectric, 1 = conductor)
    k: f32,             // Extinction coefficient (for conductors)
}

struct BSDFResponse {
    reflectance_r: f32,
    reflectance_g: f32,
    reflectance_b: f32,
    transmittance_r: f32,
    transmittance_g: f32,
    transmittance_b: f32,
    absorption_r: f32,
    absorption_g: f32,
}

struct GlobalParams {
    count: u32,         // Number of materials to evaluate
    wavelength: f32,    // Wavelength (nm) for spectral effects
    padding0: f32,
    padding1: f32,
}

// ============================================================================
// BINDINGS
// ============================================================================

@group(0) @binding(0) var<storage, read> materials: array<MaterialInput>;
@group(0) @binding(1) var<storage, read_write> responses: array<BSDFResponse>;
@group(0) @binding(2) var<uniform> params: GlobalParams;

// ============================================================================
// CONSTANTS
// ============================================================================

const PI: f32 = 3.14159265359;
const EPSILON: f32 = 1e-7;

// ============================================================================
// FRESNEL FUNCTIONS
// ============================================================================

// Schlick's approximation for dielectrics
fn fresnel_schlick(cos_theta: f32, f0: f32) -> f32 {
    let cos_clamped = clamp(cos_theta, 0.0, 1.0);
    let one_minus_cos = 1.0 - cos_clamped;
    let one_minus_cos_5 = one_minus_cos * one_minus_cos * one_minus_cos * one_minus_cos * one_minus_cos;
    return f0 + (1.0 - f0) * one_minus_cos_5;
}

// F0 from IOR (Fresnel reflectance at normal incidence)
fn f0_from_ior(ior: f32) -> f32 {
    let ratio = (ior - 1.0) / (ior + 1.0);
    return ratio * ratio;
}

// Fresnel for conductors (with complex IOR)
fn fresnel_conductor(cos_theta: f32, n: f32, k: f32) -> f32 {
    let cos2 = cos_theta * cos_theta;
    let sin2 = 1.0 - cos2;

    let n2 = n * n;
    let k2 = k * k;

    let t0 = n2 - k2 - sin2;
    let a2_plus_b2 = sqrt(t0 * t0 + 4.0 * n2 * k2);
    let a = sqrt(0.5 * (a2_plus_b2 + t0));

    // Rs (s-polarized)
    let rs_num = a2_plus_b2 + cos2 - 2.0 * a * cos_theta;
    let rs_den = a2_plus_b2 + cos2 + 2.0 * a * cos_theta;
    let rs = rs_num / max(rs_den, EPSILON);

    // Rp (p-polarized)
    let rp_num = a2_plus_b2 * cos2 + sin2 * sin2 - 2.0 * a * cos_theta * sin2;
    let rp_den = a2_plus_b2 * cos2 + sin2 * sin2 + 2.0 * a * cos_theta * sin2;
    let rp = rs * rp_num / max(rp_den, EPSILON);

    // Unpolarized average
    return 0.5 * (rs + rp);
}

// ============================================================================
// TRANSMITTANCE FUNCTIONS
// ============================================================================

// Beer-Lambert law for volume absorption
fn beer_lambert(absorption: f32, thickness: f32, cos_theta: f32) -> f32 {
    // Path length through material
    let path = thickness / max(abs(cos_theta), EPSILON);
    return exp(-absorption * path);
}

// ============================================================================
// GGX MICROFACET FUNCTIONS
// ============================================================================

// GGX normal distribution function
fn ggx_d(ndoth: f32, roughness: f32) -> f32 {
    let a2 = roughness * roughness;
    let ndoth2 = ndoth * ndoth;
    let denom = ndoth2 * (a2 - 1.0) + 1.0;
    return a2 / (PI * denom * denom + EPSILON);
}

// Smith's G1 for GGX
fn ggx_g1(ndotv: f32, roughness: f32) -> f32 {
    let a2 = roughness * roughness;
    let ndotv2 = ndotv * ndotv;
    return 2.0 * ndotv / (ndotv + sqrt(a2 + (1.0 - a2) * ndotv2) + EPSILON);
}

// Smith's geometry function (separable)
fn ggx_g(ndotl: f32, ndotv: f32, roughness: f32) -> f32 {
    return ggx_g1(ndotl, roughness) * ggx_g1(ndotv, roughness);
}

// ============================================================================
// BSDF EVALUATION
// ============================================================================

fn evaluate_material(mat: MaterialInput) -> BSDFResponse {
    var response: BSDFResponse;

    let cos_theta = abs(mat.cos_theta);

    // Compute reflectance
    var reflectance: f32;
    if (mat.metallic > 0.5) {
        // Conductor (metal)
        reflectance = fresnel_conductor(cos_theta, mat.ior, mat.k);
    } else {
        // Dielectric (glass, water)
        let f0 = f0_from_ior(mat.ior);
        reflectance = fresnel_schlick(cos_theta, f0);
    }

    // Apply roughness via GGX masking (simplified)
    if (mat.roughness > 0.01) {
        let g = ggx_g1(cos_theta, mat.roughness);
        reflectance = reflectance * g;
    }

    // Compute transmittance (Beer-Lambert)
    var transmittance: f32 = 0.0;
    if (mat.metallic < 0.5 && mat.thickness > 0.0) {
        // Only dielectrics transmit
        let internal_t = beer_lambert(mat.absorption, mat.thickness, cos_theta);
        transmittance = (1.0 - reflectance) * internal_t;
    }

    // Energy conservation: R + T + A = 1
    // Absorption is what's left after reflection and transmission
    let absorption = 1.0 - reflectance - transmittance;

    // Clamp to valid range
    let r = clamp(reflectance, 0.0, 1.0);
    let t = clamp(transmittance, 0.0, 1.0);
    let a = clamp(absorption, 0.0, 1.0);

    // For now, assume achromatic (same across RGB)
    // Spectral effects can be added via wavelength-dependent IOR
    response.reflectance_r = r;
    response.reflectance_g = r;
    response.reflectance_b = r;
    response.transmittance_r = t;
    response.transmittance_g = t;
    response.transmittance_b = t;
    response.absorption_r = a;
    response.absorption_g = a;

    return response;
}

// ============================================================================
// COMPUTE KERNEL
// ============================================================================

@compute @workgroup_size(256, 1, 1)
fn evaluate_unified(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;

    // Bounds check
    if (idx >= params.count) {
        return;
    }

    // Evaluate BSDF
    responses[idx] = evaluate_material(materials[idx]);
}

@compute @workgroup_size(256, 1, 1)
fn evaluate_dielectric(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;

    if (idx >= params.count) {
        return;
    }

    // Force dielectric path
    var mat = materials[idx];
    mat.metallic = 0.0;
    mat.k = 0.0;

    responses[idx] = evaluate_material(mat);
}

@compute @workgroup_size(256, 1, 1)
fn evaluate_conductor(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;

    if (idx >= params.count) {
        return;
    }

    // Force conductor path
    var mat = materials[idx];
    mat.metallic = 1.0;

    responses[idx] = evaluate_material(mat);
}
