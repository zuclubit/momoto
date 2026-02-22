// ============================================================================
// Thin-Film Interference Compute Shader
// GPU-accelerated iridescent surface effects
// ============================================================================
//
// Implements thin-film interference for:
// - Soap bubbles
// - Oil slicks
// - Anti-reflective coatings
// - Iridescent materials
//
// Parity Target: ΔE2000 < 1.0 vs CPU reference

// ============================================================================
// DATA STRUCTURES
// ============================================================================

struct MaterialInput {
    ior: f32,           // Substrate IOR
    cos_theta: f32,     // Incident angle cosine
    absorption: f32,    // Absorption coefficient
    thickness: f32,     // Film thickness (nm)
    g: f32,             // Film IOR (stored in g for simplicity)
    roughness: f32,
    metallic: f32,
    k: f32,
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
    wavelength_r: f32,  // Red wavelength (nm)
    wavelength_g: f32,  // Green wavelength (nm)
    wavelength_b: f32,  // Blue wavelength (nm)
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

// Default wavelengths (nm)
const LAMBDA_R: f32 = 650.0;
const LAMBDA_G: f32 = 550.0;
const LAMBDA_B: f32 = 450.0;

// ============================================================================
// FRESNEL FUNCTIONS
// ============================================================================

fn fresnel_amplitude_s(cos_i: f32, cos_t: f32, n1: f32, n2: f32) -> f32 {
    return (n1 * cos_i - n2 * cos_t) / (n1 * cos_i + n2 * cos_t + EPSILON);
}

fn fresnel_amplitude_p(cos_i: f32, cos_t: f32, n1: f32, n2: f32) -> f32 {
    return (n2 * cos_i - n1 * cos_t) / (n2 * cos_i + n1 * cos_t + EPSILON);
}

// ============================================================================
// THIN-FILM INTERFERENCE
// ============================================================================

// Compute thin-film reflectance for a single wavelength
fn thin_film_reflectance(
    cos_theta: f32,
    film_ior: f32,
    substrate_ior: f32,
    thickness_nm: f32,
    wavelength_nm: f32
) -> f32 {
    // Air → Film interface
    let n0: f32 = 1.0;
    let n1 = film_ior;
    let n2 = substrate_ior;

    // Snell's law: n0 * sin(θ0) = n1 * sin(θ1) = n2 * sin(θ2)
    let sin_theta_0 = sqrt(1.0 - cos_theta * cos_theta);
    let sin_theta_1 = sin_theta_0 * n0 / n1;

    // Check for total internal reflection
    if (sin_theta_1 > 1.0) {
        return 1.0;
    }

    let cos_theta_1 = sqrt(1.0 - sin_theta_1 * sin_theta_1);
    let sin_theta_2 = sin_theta_0 * n0 / n2;
    let cos_theta_2 = select(sqrt(1.0 - sin_theta_2 * sin_theta_2), 0.0, sin_theta_2 > 1.0);

    // Fresnel amplitudes at each interface
    let r01_s = fresnel_amplitude_s(cos_theta, cos_theta_1, n0, n1);
    let r01_p = fresnel_amplitude_p(cos_theta, cos_theta_1, n0, n1);
    let r12_s = fresnel_amplitude_s(cos_theta_1, cos_theta_2, n1, n2);
    let r12_p = fresnel_amplitude_p(cos_theta_1, cos_theta_2, n1, n2);

    // Phase difference due to path length
    let optical_path = 2.0 * n1 * thickness_nm * cos_theta_1;
    let phase = 2.0 * PI * optical_path / wavelength_nm;

    // Interference (simplified - ignoring multiple reflections beyond first order)
    let cos_phase = cos(phase);
    let sin_phase = sin(phase);

    // Combined amplitude (s-polarization)
    let total_s_real = r01_s + r12_s * cos_phase;
    let total_s_imag = r12_s * sin_phase;
    let rs = total_s_real * total_s_real + total_s_imag * total_s_imag;

    // Combined amplitude (p-polarization)
    let total_p_real = r01_p + r12_p * cos_phase;
    let total_p_imag = r12_p * sin_phase;
    let rp = total_p_real * total_p_real + total_p_imag * total_p_imag;

    // Unpolarized reflectance
    return 0.5 * (rs + rp);
}

// ============================================================================
// THIN-FILM BSDF EVALUATION
// ============================================================================

fn evaluate_thin_film_material(mat: MaterialInput) -> BSDFResponse {
    var response: BSDFResponse;

    let cos_theta = abs(mat.cos_theta);
    let film_ior = max(mat.g, 1.01);  // Film IOR from g parameter
    let substrate_ior = mat.ior;
    let thickness = mat.thickness;  // Thickness in nm

    // Wavelengths (use params if available, otherwise defaults)
    let lambda_r = select(LAMBDA_R, params.wavelength_r, params.wavelength_r > 0.0);
    let lambda_g = select(LAMBDA_G, params.wavelength_g, params.wavelength_g > 0.0);
    let lambda_b = select(LAMBDA_B, params.wavelength_b, params.wavelength_b > 0.0);

    // Compute reflectance for each wavelength
    let r_red = thin_film_reflectance(cos_theta, film_ior, substrate_ior, thickness, lambda_r);
    let r_green = thin_film_reflectance(cos_theta, film_ior, substrate_ior, thickness, lambda_g);
    let r_blue = thin_film_reflectance(cos_theta, film_ior, substrate_ior, thickness, lambda_b);

    // Clamp reflectance
    response.reflectance_r = clamp(r_red, 0.0, 1.0);
    response.reflectance_g = clamp(r_green, 0.0, 1.0);
    response.reflectance_b = clamp(r_blue, 0.0, 1.0);

    // Transmittance (with absorption)
    if (mat.absorption > 0.0 && thickness > 0.0) {
        let path = thickness * 1e-6 / max(cos_theta, EPSILON);  // Convert nm to mm approximately
        let att = exp(-mat.absorption * path);
        response.transmittance_r = (1.0 - response.reflectance_r) * att;
        response.transmittance_g = (1.0 - response.reflectance_g) * att;
        response.transmittance_b = (1.0 - response.reflectance_b) * att;
    } else {
        response.transmittance_r = 1.0 - response.reflectance_r;
        response.transmittance_g = 1.0 - response.reflectance_g;
        response.transmittance_b = 1.0 - response.reflectance_b;
    }

    // Absorption (energy conservation)
    response.absorption_r = 1.0 - response.reflectance_r - response.transmittance_r;
    response.absorption_g = 1.0 - response.reflectance_g - response.transmittance_g;

    return response;
}

// ============================================================================
// COMPUTE KERNEL
// ============================================================================

@compute @workgroup_size(256, 1, 1)
fn evaluate_thin_film(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;

    if (idx >= params.count) {
        return;
    }

    responses[idx] = evaluate_thin_film_material(materials[idx]);
}
