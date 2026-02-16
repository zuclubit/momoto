/**
 * Momoto Complete Feature Set
 *
 * Comprehensive examples showcasing ALL Momoto capabilities:
 * - Material system with proper context architecture
 * - LiquidGlass high-level API
 * - Contrast metrics (WCAG + APCA)
 * - Quality scoring
 * - Elevation system (Material Design 3)
 * - Batch processing
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Card } from './Card';

// ============================================================================
// WASM IMPORTS - COMPLETE API
// ============================================================================

// @ts-ignore - WASM module from public directory
import init, {
  // Materials
  GlassMaterial,
  LiquidGlass,

  // Contexts (Proper Architecture)
  MaterialContext,

  // Rendering
  CssBackend,
  RenderContext,

  // Color Spaces
  OKLCH,
  Color,

  // Metrics
  WCAGMetric,
  APCAMetric,

  // Quality
  QualityScorer,

  // Elevation
  ElevationPresets,
  calculateElevationShadow,

  // Batch Processing
  BatchEvaluator,
  BatchMaterialInput,
} from '../../public/wasm/momoto_wasm.js';

// ============================================================================
// WASM INITIALIZATION
// ============================================================================

let wasmInitialized = false;

async function ensureWasmInit() {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
}

// ============================================================================
// META
// ============================================================================

const meta = {
  title: 'Examples/Momoto Complete API',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Complete showcase of ALL Momoto capabilities using the correct architectural patterns. ' +
          'Demonstrates material contexts, LiquidGlass API, metrics, quality scoring, and elevation system.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// EXAMPLE 1: LIQUIDGLASS HIGH-LEVEL API
// ============================================================================

/**
 * LiquidGlass API - High-Level Material System
 *
 * Demonstrates the LiquidGlass API which provides:
 * - Glass variants (Regular, Clear)
 * - Automatic text color recommendations
 * - Effective color calculation
 */
export const LiquidGlassAPI: Story = {
  render: () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          const backgrounds = [
            { name: 'Light', color: Color.fromHex('#FFFFFF') },
            { name: 'Dark', color: Color.fromHex('#000000') },
            { name: 'Purple', color: Color.fromHex('#6B46C1') },
            { name: 'Blue', color: Color.fromHex('#2563EB') },
          ];

          const variants = [
            { name: 'Regular', variant: 0 }, // GlassVariant::Regular
            { name: 'Clear', variant: 1 },   // GlassVariant::Clear
          ];

          const allResults: any[] = [];

          for (const variant of variants) {
            for (const bg of backgrounds) {
              const glass = new LiquidGlass(variant.variant);
              const effectiveColor = glass.effectiveColor(bg.color);
              const textColor = glass.recommendTextColor(bg.color, false);

              allResults.push({
                variant: variant.name,
                background: bg.name,
                bgHex: bg.color.toHex(),
                effectiveHex: effectiveColor.toHex(),
                textHex: textColor.toHex(),
              });
            }
          }

          setResults(allResults);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>LiquidGlass High-Level API</h2>}>
          <p style={{ marginTop: 0 }}>
            Demonstrates the LiquidGlass API with automatic text color recommendations
            and effective color calculation over different backgrounds.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}>
            {results.map((result, idx) => (
              <Card key={idx} variant="elevated" padding="sm">
                <div style={{ marginBottom: '12px' }}>
                  <strong>{result.variant}</strong> on {result.background}
                </div>

                <div style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: result.bgHex,
                  borderRadius: '4px',
                  marginBottom: '8px',
                  border: '1px solid var(--crystal-border)',
                }} />

                <div style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: result.effectiveHex,
                  color: result.textHex,
                  borderRadius: '4px',
                  fontSize: '14px',
                  textAlign: 'center',
                }}>
                  Glass Effect
                </div>

                <div style={{ fontSize: '12px', marginTop: '8px', fontFamily: 'monospace' }}>
                  <div>Effective: {result.effectiveHex}</div>
                  <div>Text: {result.textHex}</div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 2: PROPER MATERIAL CONTEXT ARCHITECTURE
// ============================================================================

/**
 * Material Context Architecture
 *
 * Demonstrates the correct use of MaterialContext with preset scenarios.
 */
export const MaterialContextArchitecture: Story = {
  render: () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          const contexts = [
            { name: 'Studio', context: MaterialContext.studio() },
            { name: 'Outdoor', context: MaterialContext.outdoor() },
            { name: 'Dramatic', context: MaterialContext.dramatic() },
            { name: 'Neutral', context: MaterialContext.neutral() },
            { name: 'Showcase', context: MaterialContext.showcase() },
          ];

          const glass = GlassMaterial.regular();
          const backend = new CssBackend();
          const renderCtx = RenderContext.desktop();

          const contextResults = contexts.map(({ name, context }) => {
            const evaluated = glass.evaluate(context);
            const css = backend.render(evaluated, renderCtx);

            return {
              name,
              opacity: evaluated.opacity,
              scattering: evaluated.scatteringRadiusMm,
              fresnel: evaluated.fresnelF0,
              css: css.split('\n')[0],
            };
          });

          setResults(contextResults);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Material Context Architecture</h2>}>
          <p style={{ marginTop: 0 }}>
            Proper use of MaterialContext with preset lighting scenarios:
            Studio, Outdoor, Dramatic, Neutral, and Showcase.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}>
            {results.map((result) => (
              <Card key={result.name} variant="elevated">
                <h3 style={{ margin: '0 0 16px 0' }}>{result.name} Preset</h3>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Opacity:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.opacity.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Scattering:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.scattering.toFixed(2)} mm</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Fresnel F0:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.fresnel.toFixed(4)}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: 'var(--crystal-text-secondary)',
                  wordBreak: 'break-all',
                }}>
                  {result.css}
                </div>
              </Card>
            ))}
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--crystal-info-surface)',
            borderRadius: '8px',
            color: 'var(--crystal-info)',
            fontSize: '14px',
          }}>
            <strong>Correct Architecture:</strong> Material → MaterialContext → EvaluatedMaterial → Backend → CSS
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 3: CONTRAST METRICS (WCAG + APCA)
// ============================================================================

/**
 * Contrast Metrics - WCAG & APCA
 *
 * Demonstrates both WCAG 2.1 and APCA contrast calculations.
 */
export const ContrastMetrics: Story = {
  render: () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          const wcag = new WCAGMetric();
          const apca = new APCAMetric();

          const colorPairs = [
            { fg: '#000000', bg: '#FFFFFF', name: 'Black on White' },
            { fg: '#FFFFFF', bg: '#000000', name: 'White on Black' },
            { fg: '#6B46C1', bg: '#FFFFFF', name: 'Purple on White' },
            { fg: '#2563EB', bg: '#FFFFFF', name: 'Blue on White' },
            { fg: '#10B981', bg: '#FFFFFF', name: 'Green on White' },
            { fg: '#FFFFFF', bg: '#1F2937', name: 'White on Dark Gray' },
          ];

          const contrastResults = colorPairs.map(({ fg, bg, name }) => {
            const fgColor = Color.fromHex(fg);
            const bgColor = Color.fromHex(bg);

            const wcagResult = wcag.evaluate(fgColor, bgColor);
            const apcaResult = apca.evaluate(fgColor, bgColor);

            return {
              name,
              fg,
              bg,
              wcagRatio: wcagResult.value,
              wcagPasses: wcagResult.passes,
              apcaLc: apcaResult.value,
              apcaPolarity: apcaResult.polarity,
            };
          });

          setResults(contrastResults);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Contrast Metrics (WCAG + APCA)</h2>}>
          <p style={{ marginTop: 0 }}>
            Comprehensive contrast evaluation using both WCAG 2.1 and APCA algorithms.
          </p>

          <div style={{ overflowX: 'auto', marginTop: '24px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--crystal-border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Color Pair</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Preview</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>WCAG Ratio</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>WCAG Pass</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>APCA Lc</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Polarity</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--crystal-border)' }}>
                    <td style={{ padding: '12px' }}>{result.name}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: result.bg,
                        color: result.fg,
                        borderRadius: '4px',
                        fontSize: '12px',
                        border: '1px solid var(--crystal-border)',
                      }}>
                        Aa
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>
                      {result.wcagRatio.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: result.wcagPasses ? '#10B981' : '#EF4444',
                      }} />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>
                      {result.apcaLc.toFixed(1)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {result.apcaPolarity === 'Dark' ? '🌙' : '☀️'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--crystal-info-surface)',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            <div style={{ marginBottom: '8px' }}><strong>WCAG 2.1:</strong> Ratio-based (4.5:1 for normal text, 3:1 for large text)</div>
            <div><strong>APCA:</strong> Perceptually uniform Lc values (positive = dark on light, negative = light on dark)</div>
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 4: BATCH PROCESSING (CORRECT ARCHITECTURE)
// ============================================================================

/**
 * Batch Processing with MaterialContext
 *
 * Demonstrates proper batch evaluation using MaterialContext.
 */
export const BatchProcessing: Story = {
  render: () => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          const N = 500;
          const batchInput = new BatchMaterialInput();

          for (let i = 0; i < N; i++) {
            const roughness = (i / N) * 0.8 + 0.1;
            const ior = 1.45 + (i / N) * 0.2;
            const thickness = 2.0 + (i / N) * 8.0;
            const absorption = 0.05 + (i / N) * 0.15;
            batchInput.push(ior, roughness, thickness, absorption);
          }

          const context = MaterialContext.studio();
          const evaluator = BatchEvaluator.withContext(context);

          const start = performance.now();
          const batchResult = evaluator.evaluate(batchInput);
          const duration = performance.now() - start;

          const opacity = batchResult.getOpacity();
          const blur = batchResult.getBlur();
          const fresnel = batchResult.getFresnelNormal();

          setResult({
            count: batchResult.count,
            duration_ms: duration,
            per_material_us: (duration * 1000) / batchResult.count,
            samples: [
              { idx: 0, opacity: opacity[0], blur: blur[0], fresnel: fresnel[0] },
              { idx: Math.floor(N/2), opacity: opacity[Math.floor(N/2)], blur: blur[Math.floor(N/2)], fresnel: fresnel[Math.floor(N/2)] },
              { idx: N-1, opacity: opacity[N-1], blur: blur[N-1], fresnel: fresnel[N-1] },
            ],
          });

          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Running batch...</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Batch Processing (Correct Architecture)</h2>}>
          <p style={{ marginTop: 0 }}>
            Batch evaluation using MaterialContext - 7-10x faster than individual evaluations.
          </p>

          {result && (
            <>
              <div style={{ marginTop: '24px' }}>
                <h3>Performance Metrics</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                        <strong>Materials:</strong>
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                        {result.count}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                        <strong>Duration:</strong>
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                        {result.duration_ms.toFixed(2)} ms
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px' }}>
                        <strong>Per Material:</strong>
                      </td>
                      <td style={{ padding: '8px' }}>
                        {result.per_material_us.toFixed(2)} µs
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h3>Sample Results</h3>
                {result.samples.map((sample: any) => (
                  <div key={sample.idx} style={{
                    marginBottom: '8px',
                    padding: '8px',
                    background: 'var(--crystal-surface)',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                  }}>
                    Material {sample.idx}: opacity={sample.opacity.toFixed(4)},
                    blur={sample.blur.toFixed(2)}px,
                    fresnel={sample.fresnel.toFixed(4)}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 5: QUALITY SCORER
// ============================================================================

/**
 * Quality Scorer
 *
 * Demonstrates quality scoring for material/contrast combinations.
 */
export const QualityScoring: Story = {
  render: () => {
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          const scorer = new QualityScorer();

          const testCases = [
            { name: 'Optimal', fg: '#000000', bg: '#FFFFFF' },
            { name: 'Good', fg: '#1F2937', bg: '#F3F4F6' },
            { name: 'Fair', fg: '#6B7280', bg: '#FFFFFF' },
            { name: 'Poor', fg: '#9CA3AF', bg: '#FFFFFF' },
            { name: 'Bad', fg: '#D1D5DB', bg: '#FFFFFF' },
          ];

          const qualityResults = testCases.map(({ name, fg, bg }) => {
            const fgColor = Color.fromHex(fg);
            const bgColor = Color.fromHex(bg);
            const score = scorer.score(fgColor, bgColor);

            return {
              name,
              fg,
              bg,
              overall: score.overall,
              wcag: score.wcagScore,
              apca: score.apcaScore,
              perceptual: score.perceptualScore,
            };
          });

          setScores(qualityResults);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Quality Scorer</h2>}>
          <p style={{ marginTop: 0 }}>
            Comprehensive quality scoring: WCAG compliance, APCA contrast, and perceptual quality.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}>
            {scores.map((score) => (
              <Card key={score.name} variant="elevated" padding="sm">
                <div style={{
                  padding: '24px',
                  backgroundColor: score.bg,
                  color: score.fg,
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}>
                  {score.name}
                </div>

                <div style={{ fontSize: '14px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Overall:</strong> {score.overall.toFixed(1)}%
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--crystal-border)',
                      borderRadius: '4px',
                      marginTop: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${score.overall}%`,
                        height: '100%',
                        backgroundColor: score.overall > 70 ? '#10B981' : score.overall > 40 ? '#F59E0B' : '#EF4444',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--crystal-text-secondary)' }}>
                    <div>WCAG: {score.wcag.toFixed(1)}%</div>
                    <div>APCA: {score.apca.toFixed(1)}%</div>
                    <div>Perceptual: {score.perceptual.toFixed(1)}%</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 6: ELEVATION SYSTEM (MD3)
// ============================================================================

/**
 * Elevation System - Material Design 3
 *
 * Demonstrates the MD3 elevation system with shadow calculations.
 */
export const ElevationSystem: Story = {
  render: () => {
    const [elevations, setElevations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          const background = new OKLCH(0.95, 0.02, 280.0);
          const glassDepth = 3.0;

          const levels = [
            { name: 'Level 0', level: ElevationPresets.LEVEL_0, desc: 'Flush with surface' },
            { name: 'Level 1', level: ElevationPresets.LEVEL_1, desc: 'Buttons' },
            { name: 'Level 2', level: ElevationPresets.LEVEL_2, desc: 'Hover state' },
            { name: 'Level 3', level: ElevationPresets.LEVEL_3, desc: 'Floating cards' },
            { name: 'Level 4', level: ElevationPresets.LEVEL_4, desc: 'Modals, sheets' },
            { name: 'Level 5', level: ElevationPresets.LEVEL_5, desc: 'Dropdowns' },
          ];

          const elevationResults = levels.map(({ name, level, desc }) => {
            const shadow = calculateElevationShadow(level, background, glassDepth);
            return {
              name,
              desc,
              level: shadow.elevation,
              css: shadow.toCSS(),
            };
          });

          setElevations(elevationResults);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Elevation System (Material Design 3)</h2>}>
          <p style={{ marginTop: 0 }}>
            Material Design 3 elevation system with physically-accurate shadow calculations.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
            marginTop: '24px',
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
          }}>
            {elevations.map((elev) => (
              <div
                key={elev.name}
                style={{
                  padding: '24px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: elev.css,
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{elev.name}</h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6B7280' }}>
                  {elev.desc}
                </p>
                <div style={{
                  padding: '8px',
                  background: '#F3F4F6',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  color: '#1F2937',
                }}>
                  {elev.css}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--crystal-info-surface)',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            <strong>Material Design 3:</strong> Elevation system based on physical lighting and shadow calculations
          </div>
        </Card>
      </div>
    );
  },
};
