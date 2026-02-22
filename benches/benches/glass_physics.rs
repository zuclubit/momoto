//! # Glass Physics Benchmarks
//!
//! Performance benchmarks for glass physics evaluation system.
//!
//! ## Target Performance
//!
//! - LUT lookups: 5x faster than direct calculation
//! - Batch evaluation: 7-10x faster than individual evaluations
//! - Total: <1ms for 100 materials

use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion, Throughput};
use momoto_materials::glass_physics::{
    // Batch API
    batch::{evaluate_batch, BatchEvaluator, BatchMaterialInput},
    // Direct calculation functions
    fresnel::fresnel_schlick,
    // LUT-accelerated functions
    lut::{beer_lambert_fast, fresnel_fast, BeerLambertLUT, FresnelLUT},
};

// ============================================================================
// FRESNEL BENCHMARKS - LUT vs Direct
// ============================================================================

fn bench_fresnel_direct(c: &mut Criterion) {
    let mut group = c.benchmark_group("fresnel_direct");

    // Benchmark single Fresnel calculation
    group.bench_function("single", |b| {
        b.iter(|| {
            let ior = black_box(1.5);
            let cos_theta = black_box(0.7);
            fresnel_schlick(1.0, ior, cos_theta)
        });
    });

    // Benchmark 100 Fresnel calculations
    group.throughput(Throughput::Elements(100));
    group.bench_function("100_materials", |b| {
        let materials: Vec<(f64, f64)> = (0..100)
            .map(|i| {
                let ior = 1.3 + (i as f64 * 0.01);
                let cos_theta = (i as f64) / 100.0;
                (ior, cos_theta)
            })
            .collect();

        b.iter(|| {
            for (ior, cos_theta) in &materials {
                black_box(fresnel_schlick(1.0, *ior, *cos_theta));
            }
        });
    });

    group.finish();
}

fn bench_fresnel_lut(c: &mut Criterion) {
    let mut group = c.benchmark_group("fresnel_lut");

    // Benchmark single LUT lookup
    group.bench_function("single", |b| {
        b.iter(|| {
            let ior = black_box(1.5);
            let cos_theta = black_box(0.7);
            fresnel_fast(ior, cos_theta)
        });
    });

    // Benchmark 100 LUT lookups
    group.throughput(Throughput::Elements(100));
    group.bench_function("100_materials", |b| {
        let materials: Vec<(f64, f64)> = (0..100)
            .map(|i| {
                let ior = 1.3 + (i as f64 * 0.01);
                let cos_theta = (i as f64) / 100.0;
                (ior, cos_theta)
            })
            .collect();

        b.iter(|| {
            for (ior, cos_theta) in &materials {
                black_box(fresnel_fast(*ior, *cos_theta));
            }
        });
    });

    group.finish();
}

// ============================================================================
// BEER-LAMBERT BENCHMARKS - LUT vs Direct
// ============================================================================

fn bench_beer_lambert_direct(c: &mut Criterion) {
    let mut group = c.benchmark_group("beer_lambert_direct");

    group.bench_function("single", |b| {
        b.iter(|| {
            let absorption = black_box(0.1_f64);
            let distance = black_box(5.0_f64);
            (-absorption * distance).exp()
        });
    });

    group.throughput(Throughput::Elements(100));
    group.bench_function("100_materials", |b| {
        let materials: Vec<(f64, f64)> = (0..100)
            .map(|i| {
                let absorption = 0.05 + (i as f64 * 0.005);
                let distance = 1.0 + (i as f64 * 0.05);
                (absorption, distance)
            })
            .collect();

        b.iter(|| {
            for (absorption, distance) in &materials {
                black_box(((-absorption) * distance).exp());
            }
        });
    });

    group.finish();
}

fn bench_beer_lambert_lut(c: &mut Criterion) {
    let mut group = c.benchmark_group("beer_lambert_lut");

    group.bench_function("single", |b| {
        b.iter(|| {
            let absorption = black_box(0.1);
            let distance = black_box(5.0);
            beer_lambert_fast(absorption, distance)
        });
    });

    group.throughput(Throughput::Elements(100));
    group.bench_function("100_materials", |b| {
        let materials: Vec<(f64, f64)> = (0..100)
            .map(|i| {
                let absorption = 0.05 + (i as f64 * 0.005);
                let distance = 1.0 + (i as f64 * 0.05);
                (absorption, distance)
            })
            .collect();

        b.iter(|| {
            for (absorption, distance) in &materials {
                black_box(beer_lambert_fast(*absorption, *distance));
            }
        });
    });

    group.finish();
}

// ============================================================================
// BATCH EVALUATION BENCHMARKS
// ============================================================================

fn bench_batch_vs_individual(c: &mut Criterion) {
    let mut group = c.benchmark_group("batch_vs_individual");

    // Test with different batch sizes
    for size in [10, 50, 100, 500].iter() {
        // Individual evaluation
        group.throughput(Throughput::Elements(*size as u64));
        group.bench_with_input(BenchmarkId::new("individual", size), size, |b, &size| {
            let materials: Vec<(f64, f64, f64, f64)> = (0..size)
                .map(|i| {
                    let ior = 1.3 + (i as f64 * 0.01);
                    let roughness = 0.1 + (i as f64 * 0.005);
                    let thickness = 1.0 + (i as f64 * 0.02);
                    let absorption = 0.05 + (i as f64 * 0.002);
                    (ior, roughness, thickness, absorption)
                })
                .collect();

            b.iter(|| {
                for (ior, roughness, thickness, absorption) in &materials {
                    // Simulate individual evaluation
                    let fresnel_n = black_box(fresnel_fast(*ior, 1.0));
                    let fresnel_g = black_box(fresnel_fast(*ior, 0.0));
                    let transmittance = black_box(beer_lambert_fast(*absorption, *thickness));
                    let opacity = black_box(1.0 - (transmittance * 0.8));
                    let blur = black_box(*roughness * 50.0);

                    // Consume results
                    black_box((fresnel_n, fresnel_g, opacity, blur));
                }
            });
        });

        // Batch evaluation
        group.bench_with_input(BenchmarkId::new("batch", size), size, |b, &size| {
            let mut input = BatchMaterialInput::with_capacity(size);
            for i in 0..size {
                let ior = 1.3 + (i as f64 * 0.01);
                let roughness = 0.1 + (i as f64 * 0.005);
                let thickness = 1.0 + (i as f64 * 0.02);
                let absorption = 0.05 + (i as f64 * 0.002);
                input.push(ior, roughness, thickness, absorption);
            }

            b.iter(|| {
                let results = black_box(evaluate_batch(&input).unwrap());
                black_box(results);
            });
        });
    }

    group.finish();
}

// ============================================================================
// MEMORY OVERHEAD BENCHMARKS
// ============================================================================

fn bench_lut_initialization(c: &mut Criterion) {
    let mut group = c.benchmark_group("lut_initialization");

    group.bench_function("fresnel_lut_build", |b| {
        b.iter(|| {
            // Force rebuild by getting fresh reference
            let lut = FresnelLUT::global();
            black_box(lut);
        });
    });

    group.bench_function("beer_lambert_lut_build", |b| {
        b.iter(|| {
            let lut = BeerLambertLUT::global();
            black_box(lut);
        });
    });

    group.finish();
}

// ============================================================================
// FULL MATERIAL EVALUATION PIPELINE
// ============================================================================

fn bench_full_material_evaluation(c: &mut Criterion) {
    let mut group = c.benchmark_group("full_material_evaluation");

    // Benchmark complete material evaluation for different batch sizes
    for size in [1, 10, 50, 100].iter() {
        group.throughput(Throughput::Elements(*size as u64));
        group.bench_with_input(BenchmarkId::from_parameter(size), size, |b, &size| {
            let mut input = BatchMaterialInput::with_capacity(size);
            for i in 0..size {
                // Vary materials to test different regions of LUT
                let ior = 1.3 + ((i % 20) as f64 * 0.06);
                let roughness = ((i % 10) as f64) / 10.0;
                let thickness = 1.0 + ((i % 15) as f64 * 0.5);
                let absorption = 0.05 + ((i % 8) as f64 * 0.1);
                input.push(ior, roughness, thickness, absorption);
            }

            let evaluator = BatchEvaluator::new();

            b.iter(|| {
                let results = black_box(evaluator.evaluate(&input).unwrap());
                // Simulate CSS generation overhead
                for i in 0..results.count {
                    black_box((
                        results.opacity[i],
                        results.blur[i],
                        results.fresnel_normal[i],
                        results.transmittance[i],
                    ));
                }
            });
        });
    }

    group.finish();
}

// ============================================================================
// ACCURACY BENCHMARKS
// ============================================================================

fn bench_lut_accuracy(c: &mut Criterion) {
    let mut group = c.benchmark_group("lut_accuracy");

    // Measure error introduced by LUT interpolation
    group.bench_function("fresnel_error_sampling", |b| {
        b.iter(|| {
            let mut total_error = 0.0;
            let samples = 100;

            for i in 0..samples {
                let ior = 1.0 + (i as f64 * 0.015); // 1.0 to 2.5
                let cos_theta = (i as f64) / samples as f64;

                let direct = fresnel_schlick(1.0, ior, cos_theta);
                let lut = fresnel_fast(ior, cos_theta);

                total_error += (direct - lut).abs();
            }

            black_box(total_error / samples as f64)
        });
    });

    group.finish();
}

// ============================================================================
// CRITERION SETUP
// ============================================================================

criterion_group!(
    benches,
    bench_fresnel_direct,
    bench_fresnel_lut,
    bench_beer_lambert_direct,
    bench_beer_lambert_lut,
    bench_batch_vs_individual,
    bench_lut_initialization,
    bench_full_material_evaluation,
    bench_lut_accuracy,
);

criterion_main!(benches);
