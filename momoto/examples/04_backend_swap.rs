//! # Backend Swap Demo
//!
//! Demonstrates switching between rendering backends at runtime.
//! Shows that the same EvaluatedMaterial can be rendered to different targets.
//!
//! Run with: `cargo run --example 04_backend_swap --features webgpu`

use momoto_core::{
    backend::CssBackend,
    evaluated::{Evaluable, MaterialContext},
    material::GlassMaterial,
    render::{BackendCapabilities, RenderBackend, RenderContext},
    space::oklch::OKLCH,
};

#[cfg(feature = "webgpu")]
use momoto_core::backend::WebGpuBackend;

fn main() {
    println!("=== Backend Swap Demo ===\n");

    // Create material
    let glass = GlassMaterial {
        roughness: 0.2,
        ior: 1.5,
        thickness: 3.0,
        noise_scale: 0.5,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let context = MaterialContext::default();
    let evaluated = glass.evaluate(&context);

    println!("Material evaluated with:");
    println!("  Opacity:      {:.4}", evaluated.opacity);
    println!("  Scattering:   {:.2} mm", evaluated.scattering_radius_mm);
    println!();

    // CSS Backend
    println!("=== CSS Backend ===");
    let css_backend = CssBackend::new();
    let capabilities = css_backend.capabilities();
    print_capabilities(&capabilities);

    let render_ctx = RenderContext::desktop();
    match css_backend.render(&evaluated, &render_ctx) {
        Ok(css) => {
            println!("CSS Output:");
            println!("{}", css);
        }
        Err(e) => {
            eprintln!("CSS render failed: {:?}", e);
        }
    }
    println!();

    // WebGPU Backend (if available)
    #[cfg(feature = "webgpu")]
    {
        println!("=== WebGPU Backend ===");
        let webgpu_backend = WebGpuBackend::new();
        let capabilities = webgpu_backend.capabilities();
        print_capabilities(&capabilities);

        match webgpu_backend.render(&evaluated, &render_ctx) {
            Ok(output) => {
                println!("WebGPU Output: {:?}", output);
            }
            Err(e) => {
                eprintln!("WebGPU render failed: {:?}", e);
            }
        }
        println!();
    }

    #[cfg(not(feature = "webgpu"))]
    {
        println!("=== WebGPU Backend ===");
        println!("(WebGPU feature not enabled)");
        println!("Run with: cargo run --example 04_backend_swap --features webgpu");
        println!();
    }

    println!("✓ Backend swap demo completed");
}

fn print_capabilities(cap: &BackendCapabilities) {
    println!("Capabilities:");
    println!("  Name:    {}", cap.name);
    println!("  Formats: {:?}", cap.output_formats);
    println!("  Features:");
    for (key, value) in &cap.features {
        println!("    {}: {}", key, value);
    }
}
