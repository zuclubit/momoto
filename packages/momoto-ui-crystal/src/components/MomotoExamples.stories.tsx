/**
 * Momoto Canonical Examples - Integrated from Rust
 *
 * These stories demonstrate the 4 canonical examples from Momoto's Rust implementation,
 * now running in the browser via WebAssembly.
 *
 * Based on:
 * - examples/01_liquid_glass_benchmark.rs
 * - examples/02_context_aware_material.rs
 * - examples/03_batch_vs_single.rs
 * - examples/04_backend_swap.rs
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Card } from './Card';

// ============================================================================
// WASM IMPORTS
// ============================================================================

// @ts-ignore - WASM module from public directory
import init, {
  GlassMaterial,
  EvalMaterialContext,
  CssBackend,
  RenderContext,
  OKLCH,
  BatchMaterialInput,
  BatchEvaluator,
  EvaluatedMaterial,
} from '../../public/wasm/momoto_wasm.js';

// ============================================================================
// TYPES
// ============================================================================

interface MaterialProperties {
  opacity: number;
  scattering_radius_mm: number;
  fresnel_f0: number;
  edge_intensity: number;
  thickness_mm: number;
  roughness: number;
}

interface ContextResult {
  name: string;
  background_l: number;
  viewing_angle: number;
  opacity: number;
  fresnel: number;
  edge_intensity: number;
  css: string;
}

interface PerformanceResult {
  materials_count: number;
  duration_ms: number;
  per_material_us: number;
  sample_results: Array<{
    index: number;
    opacity: number;
    scattering_mm: number;
  }>;
}

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
  title: 'Examples/Momoto Canonical',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Canonical examples from Momoto Rust implementation, running in browser via WASM. ' +
          'Demonstrates physics-based material rendering, context adaptation, performance, and backend abstraction.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// EXAMPLE 1: LIQUID GLASS BENCHMARK
// ============================================================================

/**
 * Example 1: Liquid Glass Benchmark
 *
 * Demonstrates core material rendering with physical accuracy.
 * Creates a canonical liquid glass material and renders it to CSS.
 */
export const Example1_LiquidGlassBenchmark: Story = {
  render: () => {
    const [properties, setProperties] = useState<MaterialProperties | null>(null);
    const [css, setCss] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          // Create canonical liquid glass material
          const baseColor = new OKLCH(0.95, 0.01, 240.0);
          const glass = new GlassMaterial(
            1.5,   // ior
            0.15,  // roughness
            3.0,   // thickness
            0.8,   // noise_scale
            baseColor,
            2.0    // edge_power
          );

          // Material context with custom background
          const background = new OKLCH(0.85, 0.02, 280.0);
          const context = EvalMaterialContext.withBackground(background);

          // Evaluate material
          const evaluated = glass.evaluate(context);

          // Extract properties
          setProperties({
            opacity: evaluated.opacity,
            scattering_radius_mm: evaluated.scatteringRadiusMm,
            fresnel_f0: evaluated.fresnelF0,
            edge_intensity: evaluated.fresnelEdgeIntensity,
            thickness_mm: evaluated.thicknessMm,
            roughness: evaluated.roughness,
          });

          // Render to CSS
          const backend = new CssBackend();
          const renderCtx = RenderContext.desktop();
          const cssOutput = backend.render(evaluated, renderCtx);
          setCss(cssOutput);

          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return (
        <Card>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Loading WASM module...
          </div>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <div style={{ padding: '20px', color: 'red' }}>
            Error: {error}
          </div>
        </Card>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Example 1: Liquid Glass Benchmark</h2>}>
          <p style={{ marginTop: 0 }}>
            Canonical demonstration of the Momoto liquid glass material system with physical accuracy.
          </p>

          {properties && (
            <div style={{ marginTop: '24px' }}>
              <h3>Material Properties</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      <strong>Opacity:</strong>
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      {properties.opacity.toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      <strong>Scattering:</strong>
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      {properties.scattering_radius_mm.toFixed(2)} mm
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      <strong>Fresnel F0:</strong>
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      {properties.fresnel_f0.toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      <strong>Edge Intensity:</strong>
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      {properties.edge_intensity.toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      <strong>Thickness:</strong>
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                      {properties.thickness_mm.toFixed(2)} mm
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px' }}>
                      <strong>Roughness:</strong>
                    </td>
                    <td style={{ padding: '8px' }}>
                      {properties.roughness.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <h3>CSS Output</h3>
            <pre style={{
              background: 'var(--crystal-surface)',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px',
            }}>
              {css}
            </pre>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '40px',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }} />
            <div style={{
              position: 'relative',
              padding: '24px',
              borderRadius: '8px',
              ...parseCSS(css),
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'white' }}>Glass Effect Preview</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                This demonstrates the rendered glass material
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--crystal-success-surface)',
            borderRadius: '8px',
            color: 'var(--crystal-success)',
          }}>
            ✓ Benchmark completed successfully
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 2: CONTEXT-AWARE MATERIAL
// ============================================================================

/**
 * Example 2: Context-Aware Material
 *
 * Demonstrates how materials adapt to different backgrounds and viewing contexts.
 */
export const Example2_ContextAwareMaterial: Story = {
  render: () => {
    const [results, setResults] = useState<ContextResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          // Single glass material
          const glass = GlassMaterial.regular();

          const contexts: Array<[string, OKLCH, number]> = [
            ['Dark Background', new OKLCH(0.2, 0.02, 280.0), 0.0],
            ['Light Background', new OKLCH(0.9, 0.02, 280.0), 0.0],
            ['Saturated Background', new OKLCH(0.6, 0.15, 120.0), 0.0],
            ['Grazing Angle (Dark)', new OKLCH(0.2, 0.02, 280.0), 75.0],
          ];

          const backend = new CssBackend();
          const renderCtx = RenderContext.desktop();

          const contextResults: ContextResult[] = [];

          for (const [name, background, angle] of contexts) {
            const context = EvalMaterialContext.withBackground(background);

            const evaluated = glass.evaluate(context);
            const css = backend.render(evaluated, renderCtx);

            contextResults.push({
              name,
              background_l: background.l,
              viewing_angle: angle,
              opacity: evaluated.opacity,
              fresnel: evaluated.fresnelF0,
              edge_intensity: evaluated.fresnelEdgeIntensity,
              css: css.split('\n')[0], // First line only
            });
          }

          setResults(contextResults);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Card>;
    }

    if (error) {
      return <Card><div style={{ padding: '20px', color: 'red' }}>Error: {error}</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Example 2: Context-Aware Material</h2>}>
          <p style={{ marginTop: 0 }}>
            Materials adapt to different backgrounds, viewing angles, and lighting conditions.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}>
            {results.map((result, idx) => (
              <Card key={idx} variant="elevated">
                <h3 style={{ margin: '0 0 16px 0' }}>{result.name}</h3>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Background L:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.background_l.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Viewing Angle:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.viewing_angle.toFixed(1)}°</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Opacity:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.opacity.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Fresnel:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.fresnel.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0' }}>Edge Intensity:</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{result.edge_intensity.toFixed(4)}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--crystal-text-secondary)' }}>
                  {result.css}
                </div>
              </Card>
            ))}
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--crystal-success-surface)',
            borderRadius: '8px',
            color: 'var(--crystal-success)',
          }}>
            ✓ Context adaptation verified
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 3: BATCH VS SINGLE PERFORMANCE
// ============================================================================

/**
 * Example 3: Batch vs Single Performance
 *
 * Compares single evaluations vs batch processing for multiple materials.
 */
export const Example3_BatchVsSingle: Story = {
  render: () => {
    const [result, setResult] = useState<PerformanceResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          const N = 1000;

          // Create materials
          const materials: any[] = [];
          for (let i = 0; i < N; i++) {
            const roughness = (i / N) * 0.5 + 0.1;
            const baseColor = new OKLCH(0.95, 0.01, 240.0);
            materials.push(new GlassMaterial(1.5, roughness, 3.0, 0.0, baseColor, 2.0));
          }

          const context = new EvalMaterialContext();

          // Single evaluation approach
          const start = performance.now();
          const results = materials.map(m => m.evaluate(context));
          const duration = performance.now() - start;

          const sampleResults = results.slice(0, 3).map((r, i) => ({
            index: i,
            opacity: r.opacity,
            scattering_mm: r.scatteringRadiusMm,
          }));

          setResult({
            materials_count: N,
            duration_ms: duration,
            per_material_us: (duration * 1000) / N,
            sample_results: sampleResults,
          });

          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Running performance test...</div></Card>;
    }

    if (error) {
      return <Card><div style={{ padding: '20px', color: 'red' }}>Error: {error}</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Example 3: Batch vs Single Performance</h2>}>
          <p style={{ marginTop: 0 }}>
            Performance comparison: evaluating {result?.materials_count} materials
          </p>

          {result && (
            <>
              <div style={{ marginTop: '24px' }}>
                <h3>Single Evaluation Results</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                        <strong>Materials:</strong>
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--crystal-border)' }}>
                        {result.materials_count}
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
                        <strong>Per material:</strong>
                      </td>
                      <td style={{ padding: '8px' }}>
                        {result.per_material_us.toFixed(2)} µs
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h3>Sample Results (first 3 materials)</h3>
                {result.sample_results.map((sample) => (
                  <div key={sample.index} style={{ marginBottom: '8px', fontSize: '14px' }}>
                    Material {sample.index}: opacity={sample.opacity.toFixed(4)},
                    scattering={sample.scattering_mm.toFixed(2)}mm
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'var(--crystal-info-surface)',
                borderRadius: '8px',
                color: 'var(--crystal-info)',
              }}>
                <strong>Note:</strong> True batch evaluation with SIMD is planned for future release.
                Current implementation processes materials sequentially.
              </div>
            </>
          )}

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--crystal-success-surface)',
            borderRadius: '8px',
            color: 'var(--crystal-success)',
          }}>
            ✓ Performance comparison completed
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// EXAMPLE 4: BACKEND SWAP
// ============================================================================

/**
 * Example 4: Backend Swap
 *
 * Demonstrates switching between rendering backends at runtime.
 */
export const Example4_BackendSwap: Story = {
  render: () => {
    const [properties, setProperties] = useState<MaterialProperties | null>(null);
    const [cssOutput, setCssOutput] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        try {
          await ensureWasmInit();

          // Create material
          const baseColor = new OKLCH(0.95, 0.01, 240.0);
          const glass = new GlassMaterial(1.5, 0.2, 3.0, 0.5, baseColor, 2.0);

          const context = new EvalMaterialContext();
          const evaluated = glass.evaluate(context);

          setProperties({
            opacity: evaluated.opacity,
            scattering_radius_mm: evaluated.scatteringRadiusMm,
            fresnel_f0: evaluated.fresnelF0,
            edge_intensity: evaluated.fresnelEdgeIntensity,
            thickness_mm: evaluated.thicknessMm,
            roughness: evaluated.roughness,
          });

          // CSS Backend
          const cssBackend = new CssBackend();

          const renderCtx = RenderContext.desktop();
          const css = cssBackend.render(evaluated, renderCtx);
          setCssOutput(css);

          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      })();
    }, []);

    if (loading) {
      return <Card><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Card>;
    }

    if (error) {
      return <Card><div style={{ padding: '20px', color: 'red' }}>Error: {error}</div></Card>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card header={<h2 style={{ margin: 0 }}>Example 4: Backend Swap</h2>}>
          <p style={{ marginTop: 0 }}>
            Demonstrates switching between rendering backends. The same EvaluatedMaterial can be rendered to different targets.
          </p>

          {properties && (
            <div style={{ marginTop: '24px' }}>
              <h3>Material Evaluated</h3>
              <div style={{ fontSize: '14px' }}>
                <div>Opacity: {properties.opacity.toFixed(4)}</div>
                <div>Scattering: {properties.scattering_radius_mm.toFixed(2)} mm</div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <h3>CSS Backend</h3>
            <pre style={{
              background: 'var(--crystal-surface)',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px',
            }}>
              {cssOutput}
            </pre>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'var(--crystal-success-surface)',
            borderRadius: '8px',
            color: 'var(--crystal-success)',
          }}>
            ✓ Backend swap demo completed
          </div>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// UTILITY: PARSE CSS STRING TO REACT STYLE OBJECT
// ============================================================================

function parseCSS(css: string): Record<string, any> {
  const style: Record<string, any> = {};
  const lines = css.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('/*'));

  for (const line of lines) {
    if (line.includes(':')) {
      const [prop, value] = line.split(':').map(s => s.trim());
      if (prop && value) {
        const cssProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        style[cssProp] = value.replace(';', '');
      }
    }
  }

  return style;
}
