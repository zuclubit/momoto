use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion, Throughput};
use momoto_core::color::Color;
use momoto_core::perception::ContrastMetric;
use momoto_metrics::apca::APCAMetric;
use momoto_metrics::wcag::WCAGMetric;

fn bench_wcag_single(c: &mut Criterion) {
    let metric = WCAGMetric;
    let black = Color::from_srgb8(0, 0, 0);
    let white = Color::from_srgb8(255, 255, 255);

    c.bench_function("wcag_single", |b| {
        b.iter(|| metric.evaluate(black_box(black), black_box(white)))
    });
}

fn bench_apca_single(c: &mut Criterion) {
    let metric = APCAMetric;
    let black = Color::from_srgb8(0, 0, 0);
    let white = Color::from_srgb8(255, 255, 255);

    c.bench_function("apca_single", |b| {
        b.iter(|| metric.evaluate(black_box(black), black_box(white)))
    });
}

fn bench_wcag_batch(c: &mut Criterion) {
    let metric = WCAGMetric;

    let mut group = c.benchmark_group("wcag_batch");

    for size in [10, 100, 1000, 10000] {
        group.throughput(Throughput::Elements(size as u64));

        let foregrounds: Vec<Color> = (0..size)
            .map(|i| Color::from_srgb8((i % 256) as u8, 128, 128))
            .collect();
        let backgrounds = vec![Color::from_srgb8(255, 255, 255); size];

        group.bench_with_input(BenchmarkId::from_parameter(size), &size, |b, _| {
            b.iter(|| metric.evaluate_batch(black_box(&foregrounds), black_box(&backgrounds)))
        });
    }

    group.finish();
}

fn bench_apca_batch(c: &mut Criterion) {
    let metric = APCAMetric;

    let mut group = c.benchmark_group("apca_batch");

    for size in [10, 100, 1000, 10000] {
        group.throughput(Throughput::Elements(size as u64));

        let foregrounds: Vec<Color> = (0..size)
            .map(|i| Color::from_srgb8((i % 256) as u8, 128, 128))
            .collect();
        let backgrounds = vec![Color::from_srgb8(255, 255, 255); size];

        group.bench_with_input(BenchmarkId::from_parameter(size), &size, |b, _| {
            b.iter(|| metric.evaluate_batch(black_box(&foregrounds), black_box(&backgrounds)))
        });
    }

    group.finish();
}

fn bench_comparison_single_vs_batch(c: &mut Criterion) {
    let metric = WCAGMetric;

    let mut group = c.benchmark_group("single_vs_batch");

    let size = 100;
    let foregrounds: Vec<Color> = (0..size)
        .map(|i| Color::from_srgb8((i % 256) as u8, 128, 128))
        .collect();
    let backgrounds = vec![Color::from_srgb8(255, 255, 255); size];

    // Naive loop
    group.bench_function("naive_loop_100", |b| {
        b.iter(|| {
            let mut results = Vec::with_capacity(size);
            for i in 0..size {
                results.push(metric.evaluate(black_box(foregrounds[i]), black_box(backgrounds[i])));
            }
            results
        })
    });

    // Optimized batch
    group.bench_function("batch_100", |b| {
        b.iter(|| metric.evaluate_batch(black_box(&foregrounds), black_box(&backgrounds)))
    });

    group.finish();
}

fn bench_oklch_operations(c: &mut Criterion) {
    use momoto_core::space::oklch::{HuePath, OKLCH};

    let mut group = c.benchmark_group("oklch");

    let color = Color::from_srgb8(59, 130, 246); // Blue

    group.bench_function("rgb_to_oklch", |b| {
        b.iter(|| OKLCH::from_color(black_box(&color)))
    });

    let oklch = OKLCH::new(0.5, 0.15, 180.0);

    group.bench_function("oklch_to_rgb", |b| b.iter(|| black_box(oklch).to_color()));

    group.bench_function("map_to_gamut", |b| {
        let out_of_gamut = OKLCH::new(0.5, 0.5, 180.0);
        b.iter(|| black_box(out_of_gamut).map_to_gamut())
    });

    let start = OKLCH::new(0.3, 0.1, 0.0);
    let end = OKLCH::new(0.7, 0.2, 180.0);

    group.bench_function("interpolate", |b| {
        b.iter(|| OKLCH::interpolate(black_box(&start), black_box(&end), 0.5, HuePath::Shorter))
    });

    group.finish();
}

criterion_group!(
    benches,
    bench_wcag_single,
    bench_apca_single,
    bench_wcag_batch,
    bench_apca_batch,
    bench_comparison_single_vs_batch,
    bench_oklch_operations
);

criterion_main!(benches);
