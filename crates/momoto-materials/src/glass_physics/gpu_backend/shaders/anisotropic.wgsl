// ============================================================================
// Anisotropic GGX Compute Shader
// GPU-accelerated anisotropic microfacet BRDF
// ============================================================================
//
// Implements anisotropic GGX distribution for:
// - Brushed metals
// - Hair fibers
// - Directionally textured surfaces
//
// Parity Target: ΔE2000 < 1.0 vs CPU reference

// ============================================================================
// DATA STRUCTURES
// ============================================================================

struct MaterialInput {
    ior: f32,
    cos_theta: f32,
    absorption: f32,
    thickness: f32,
    g: f32,
    roughness: f32,     // Base roughness (alpha)
    metallic: f32,
    k: f32,
}

struct AnisotropicParams {
    alpha_x: f32,       // Roughness along tangent
    alpha_y: f32,       // Roughness along bitangent
    cos_phi: f32,       // Azimuthal angle cosine
    sin_phi: f32,       // Azimuthal angle sine
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
    count: u32,
    anisotropy: f32,    // Anisotropy strength (-1 to 1)
    rotation: f32,      // Anisotropy rotation (radians)
    padding: f32,
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
// ANISOTROPIC GGX FUNCTIONS
// ============================================================================

// Convert roughness + anisotropy to directional alphas
fn compute_alphas(roughness: f32, anisotropy: f32) -> vec2<f32> {
    let a = roughness * roughness;
    let aspect = sqrt(1.0 - 0.9 * anisotropy);
    let alpha_x = a / aspect;
    let alpha_y = a * aspect;
    return vec2<f32>(alpha_x, alpha_y);
}

// Anisotropic GGX normal distribution
fn ggx_d_aniso(h: vec3<f32>, alpha_x: f32, alpha_y: f32) -> f32 {
    let hx2 = h.x * h.x;
    let hy2 = h.y * h.y;
    let hz2 = h.z * h.z;

    let ax2 = alpha_x * alpha_x;
    let ay2 = alpha_y * alpha_y;

    let denom = hx2 / ax2 + hy2 / ay2 + hz2;
    return 1.0 / (PI * alpha_x * alpha_y * denom * denom + EPSILON);
}

// Smith G1 for anisotropic GGX
fn ggx_g1_aniso(v: vec3<f32>, alpha_x: f32, alpha_y: f32) -> f32 {
    let ax2 = alpha_x * alpha_x;
    let ay2 = alpha_y * alpha_y;

    let vx2 = v.x * v.x;
    let vy2 = v.y * v.y;
    let vz2 = v.z * v.z;

    let lambda = sqrt(1.0 + (vx2 * ax2 + vy2 * ay2) / vz2);
    return 2.0 / (1.0 + lambda);
}

// Fresnel Schlick
fn fresnel_schlick(cos_theta: f32, f0: f32) -> f32 {
    let one_minus_cos = 1.0 - clamp(cos_theta, 0.0, 1.0);
    let pow5 = one_minus_cos * one_minus_cos * one_minus_cos * one_minus_cos * one_minus_cos;
    return f0 + (1.0 - f0) * pow5;
}

// Fresnel for conductors
fn fresnel_conductor(cos_theta: f32, n: f32, k: f32) -> f32 {
    let cos2 = cos_theta * cos_theta;
    let sin2 = 1.0 - cos2;
    let n2 = n * n;
    let k2 = k * k;

    let t0 = n2 - k2 - sin2;
    let a2_plus_b2 = sqrt(t0 * t0 + 4.0 * n2 * k2);
    let a = sqrt(0.5 * (a2_plus_b2 + t0));

    let rs_num = a2_plus_b2 + cos2 - 2.0 * a * cos_theta;
    let rs_den = a2_plus_b2 + cos2 + 2.0 * a * cos_theta;

    return rs_num / max(rs_den, EPSILON);
}

// ============================================================================
// ANISOTROPIC BRDF EVALUATION
// ============================================================================

fn evaluate_anisotropic_material(mat: MaterialInput, anisotropy: f32, rotation: f32) -> BSDFResponse {
    var response: BSDFResponse;

    let cos_theta = abs(mat.cos_theta);
    let sin_theta = sqrt(1.0 - cos_theta * cos_theta);

    // Compute anisotropic roughness
    let alphas = compute_alphas(max(mat.roughness, 0.01), anisotropy);

    // Build local frame vectors
    let cos_rot = cos(rotation);
    let sin_rot = sin(rotation);

    // View direction in local space
    let v = vec3<f32>(sin_theta * cos_rot, sin_theta * sin_rot, cos_theta);

    // Half vector (assuming normal incidence for simplified case)
    let h = vec3<f32>(0.0, 0.0, 1.0);

    // Evaluate anisotropic GGX
    let d = ggx_d_aniso(h, alphas.x, alphas.y);
    let g = ggx_g1_aniso(v, alphas.x, alphas.y);

    // Fresnel
    var f: f32;
    if (mat.metallic > 0.5) {
        f = fresnel_conductor(cos_theta, mat.ior, mat.k);
    } else {
        let f0 = ((mat.ior - 1.0) / (mat.ior + 1.0)) * ((mat.ior - 1.0) / (mat.ior + 1.0));
        f = fresnel_schlick(cos_theta, f0);
    }

    // Specular BRDF
    let specular = (d * g * f) / (4.0 * cos_theta + EPSILON);
    let reflectance = clamp(specular * cos_theta, 0.0, 1.0);

    // Transmittance (only for dielectrics)
    var transmittance = 0.0;
    if (mat.metallic < 0.5 && mat.thickness > 0.0) {
        let path = mat.thickness / max(cos_theta, EPSILON);
        let internal_t = exp(-mat.absorption * path);
        transmittance = clamp((1.0 - reflectance) * internal_t, 0.0, 1.0);
    }

    // Energy conservation
    let absorption = clamp(1.0 - reflectance - transmittance, 0.0, 1.0);

    // RGB output (achromatic for now)
    response.reflectance_r = reflectance;
    response.reflectance_g = reflectance;
    response.reflectance_b = reflectance;
    response.transmittance_r = transmittance;
    response.transmittance_g = transmittance;
    response.transmittance_b = transmittance;
    response.absorption_r = absorption;
    response.absorption_g = absorption;

    return response;
}

// ============================================================================
// COMPUTE KERNEL
// ============================================================================

@compute @workgroup_size(256, 1, 1)
fn evaluate_anisotropic(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;

    if (idx >= params.count) {
        return;
    }

    responses[idx] = evaluate_anisotropic_material(
        materials[idx],
        params.anisotropy,
        params.rotation
    );
}
