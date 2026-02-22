/**
 * Momoto Engine — Vanilla JS: Materials & Physics Examples
 * Thin Film, TMM, Mie Scattering, SpectralPipeline, PBR
 */
import init, {
  ThinFilm, TransferMatrixFilm, FilmLayer,
  MieParams, DynamicMieParams,
  henyeyGreenstein, rayleighIntensityRgb,
  SpectralPipeline, SpectralSignal, EvaluationContext,
  GlassMaterial, GlassMaterialBuilder, CssRenderConfig,
  cookTorranceBRDF, orenNayarBRDF,
  ComplexIOR, SpectralComplexIOR, DrudeParams,
  AmbientShadowParams, calculateAmbientShadow
} from 'momoto-wasm';

await init();

// ── 1. Thin-Film Optics ────────────────────────────────────────────────────
{
  console.log('=== Thin Film Optics ===');

  const bubble = ThinFilm.soapBubbleMedium();
  const [r, g, b] = bubble.reflectanceRgb(1.0, 0.0); // nSub=1.0, normal incidence
  console.log(`Soap bubble RGB reflectance: [${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}]`);
  console.log('CSS:', bubble.toCssSoapBubble(80));
  console.log('Oil slick:', bubble.toCssOilSlick());

  // Wavelength-specific
  const refl550 = bubble.reflectance(550, 1.0, 0.0); // λ=550nm (green)
  const refl450 = bubble.reflectance(450, 1.0, 0.0); // λ=450nm (blue)
  console.log(`Reflectance at 550nm: ${refl550.toFixed(3)}, at 450nm: ${refl450.toFixed(3)}`);
}

// ── 2. Multilayer Transfer Matrix (structural color) ─────────────────────
{
  console.log('\n=== Multilayer TMM ===');

  const presets = ['morphoButterfly', 'beetleShell', 'nacre', 'braggMirror', 'opticalDisc'];
  for (const name of presets) {
    const film = TransferMatrixFilm[name]();
    const css0  = film.toCssStructuralColor(0);
    const css45 = film.toCssStructuralColor(45);
    console.log(`${name}:`);
    console.log(`  0°:  ${css0.slice(0, 60)}...`);
    console.log(`  45°: ${css45.slice(0, 60)}...`);
  }

  // Custom 5-layer stack (dichroic filter)
  const custom = new TransferMatrixFilm(1.0, 1.52); // air → glass
  custom.addLayer(2.35, 95);   // TiO₂ (high-n)
  custom.addLayer(1.46, 135);  // SiO₂ (low-n)
  custom.addLayer(2.35, 95);
  custom.addLayer(1.46, 135);
  custom.addLayer(2.35, 95);
  const [r, g, b] = custom.reflectanceRgb(0, 2); // 0° average polarization
  console.log(`Custom 5-layer: RGB [${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}]`);
}

// ── 3. Complex IOR — Metals ───────────────────────────────────────────────
{
  console.log('\n=== Metal IOR ===');

  const metals = ['gold', 'silver', 'copper', 'aluminum', 'titanium'];
  for (const metal of metals) {
    const ior = ComplexIOR[metal]();
    const f0  = ior.f0();
    const refl = ior.reflectanceAt(1.0); // normal incidence
    console.log(`${metal}: F0=${f0.toFixed(3)}, reflectance=${refl.toFixed(3)}`);
  }

  // Temperature-dependent (Drude model)
  const drude = DrudeParams.gold();
  const ior300K = drude.complexIor(550, 300);  // 550nm, room temp
  const ior800K = drude.complexIor(550, 800);  // 550nm, hot
  console.log(`Gold at 300K: n=${ior300K.n.toFixed(3)}, k=${ior300K.k.toFixed(3)}`);
  console.log(`Gold at 800K: n=${ior800K.n.toFixed(3)}, k=${ior800K.k.toFixed(3)}`);
}

// ── 4. Mie Scattering ─────────────────────────────────────────────────────
{
  console.log('\n=== Mie Scattering ===');

  const fog = MieParams.fogSmall();
  console.log(`Fog (2µm): asymmetry g=${fog.asymmetryFactor().toFixed(3)}`);
  console.log(`Forward peak HG: ${henyeyGreenstein(1.0, 0.85).toFixed(4)}`);
  console.log(`Back scatter HG: ${henyeyGreenstein(-1.0, 0.85).toFixed(4)}`);

  const [r, g, b] = rayleighIntensityRgb(0.0); // 90° scattering → deep blue
  console.log(`Rayleigh 90° sky: [${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}]`);

  // Dynamic animation
  const condensing = DynamicMieParams.condensingFog();
  for (const t of [0, 1, 2, 3, 4]) {
    const [r, g, b] = condensing.scatteringColorAtTime(t, 550);
    console.log(`t=${t}s fog: [${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}]`);
  }
  console.log('Fog CSS:', condensing.toCssFog());
}

// ── 5. SpectralPipeline ───────────────────────────────────────────────────
{
  console.log('\n=== SpectralPipeline ===');

  const pipeline = new SpectralPipeline();
  pipeline.addThinFilm(ThinFilm.arCoating());
  pipeline.addMieScattering(MieParams.cloud());
  pipeline.addGold();

  const ctx = new EvaluationContext()
    .withAngle(30.0)
    .withTemperature(293.0);

  const result = pipeline.evaluate(SpectralSignal.d65Illuminant(), ctx);
  const [r, g, b] = result.toRgb();
  const [X, Y, Z] = result.toXyz();

  console.log(`Pipeline (${pipeline.stageCount()} stages):`);
  console.log(`  sRGB: [${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}]`);
  console.log(`  XYZ:  [${X.toFixed(3)}, ${Y.toFixed(3)}, ${Z.toFixed(3)}]`);

  const ec = pipeline.verifyEnergyConservation();
  console.log(`  Energy conserved: ${ec.passes} (max violation: ${ec.maxViolation?.toFixed(6)})`);
}

// ── 6. Glass Surface & CSS ────────────────────────────────────────────────
{
  console.log('\n=== Glass Surface ===');

  const frosted = GlassMaterial.frosted();
  console.log('Frosted glass on dark:', frosted.css('#07070e'));

  const custom = new GlassMaterialBuilder()
    .ior(1.45)
    .roughness(0.15)
    .tintRgba(0.8, 0.9, 1.0, 0.08)
    .build();
  const css = custom.renderPremiumCss(CssRenderConfig.premium());
  console.log('Premium glass:', css);
}

// ── 7. PBR BRDFs ──────────────────────────────────────────────────────────
{
  console.log('\n=== PBR BRDFs ===');

  const normal = [0, 1, 0];
  const view   = [0, 1, 0];
  const light  = [0.7, 0.7, 0];

  for (const roughness of [0.1, 0.3, 0.6, 0.9]) {
    const ct = cookTorranceBRDF(normal, view, light, roughness, 1.5, 0.9);
    const on = orenNayarBRDF(roughness, normal, view, light);
    console.log(`roughness=${roughness}: Cook-Torrance=${ct.toFixed(4)}, Oren-Nayar=${on.toFixed(4)}`);
  }
}

// ── 8. Ambient Shadow (Material Design) ──────────────────────────────────
{
  console.log('\n=== Ambient Shadows ===');

  const params = AmbientShadowParams.elevated();
  const shadow = calculateAmbientShadow(params, '#07070e');
  console.log('Elevated shadow:', shadow);
}
