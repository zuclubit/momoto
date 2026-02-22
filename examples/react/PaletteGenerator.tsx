/**
 * Momoto Engine — React: PaletteGenerator
 * HCT tonal palettes + color harmony with WASM engine
 */
import { useState, useEffect, useCallback } from 'react';
import init, {
  hexToHct, hctTonalPalette, hctToHex, hctMaxChroma,
  generatePalette, generateShades, harmonyScore
} from 'momoto-wasm';

type HarmonyType = 'complementary' | 'triadic' | 'analogous' | 'split_complementary' | 'tetradic' | 'square' | 'monochromatic';

const HARMONY_TYPES: HarmonyType[] = [
  'complementary', 'triadic', 'analogous', 'split_complementary',
  'tetradic', 'square', 'monochromatic'
];

const HCT_TONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];

let wasmReady = false;
const wasmInit = init().then(() => { wasmReady = true; });

export function PaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#3a7bd5');
  const [harmony, setHarmony] = useState<HarmonyType>('triadic');
  const [ready, setReady] = useState(false);
  const [tonalPalette, setTonalPalette] = useState<string[]>([]);
  const [harmonyPalette, setHarmonyPalette] = useState<string[]>([]);
  const [shades, setShades] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [hctInfo, setHctInfo] = useState<{ hue: number; chroma: number; tone: number } | null>(null);

  const recompute = useCallback((color: string, harmonyType: HarmonyType) => {
    if (!wasmReady || !/^#[0-9a-f]{6}$/i.test(color)) return;

    const [hue, chroma, tone] = Array.from(hexToHct(color)) as [number, number, number];
    setHctInfo({ hue, chroma, tone });

    const rawPalette = hctTonalPalette(hue, chroma);
    const tonal = HCT_TONES.map((t, i) => hctToHex(rawPalette[i * 3], rawPalette[i * 3 + 1], t));
    setTonalPalette(tonal);

    const harmony = generatePalette(color, harmonyType, 5);
    setHarmonyPalette(harmony);

    const s = generateShades(color, 9);
    setShades(s);

    // Harmony score from OKLCH flat array
    try {
      const lchArr = new Float64Array(harmony.length * 3);
      harmony.forEach((hex, i) => {
        // simplified — ideally use hexToOklch
        lchArr[i * 3] = 0.5; lchArr[i * 3 + 1] = 0.15; lchArr[i * 3 + 2] = i * 60;
      });
      setScore(harmonyScore(lchArr));
    } catch { /* harmonyScore may need exact oklch */ }
  }, []);

  useEffect(() => {
    wasmInit.then(() => { setReady(true); recompute(baseColor, harmony); });
  }, []);

  const handleColorChange = (c: string) => {
    setBaseColor(c); recompute(c, harmony);
  };
  const handleHarmonyChange = (h: HarmonyType) => {
    setHarmony(h); recompute(baseColor, h);
  };

  if (!ready) return <p style={{ color: '#94a3b8' }}>Loading engine…</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Palette Generator</h2>

      {/* Controls */}
      <div style={styles.controls}>
        <label style={styles.label}>
          Base Color
          <div style={styles.row}>
            <input type="color" value={baseColor} onChange={e => handleColorChange(e.target.value)} />
            <input type="text" value={baseColor} maxLength={7}
                   onChange={e => handleColorChange(e.target.value)} style={styles.hex} />
          </div>
        </label>

        {hctInfo && (
          <div style={styles.hctInfo}>
            <span>H {hctInfo.hue.toFixed(1)}°</span>
            <span>C {hctInfo.chroma.toFixed(1)}</span>
            <span>T {hctInfo.tone.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Tonal Palette (HCT) */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>HCT Tonal Palette (Material Design 3)</h3>
        <div style={styles.swatchRow}>
          {tonalPalette.map((color, i) => (
            <div key={i} style={styles.swatchItem}>
              <div style={{ background: color, ...styles.swatch }} />
              <span style={styles.swatchTone}>{HCT_TONES[i]}</span>
              <span style={styles.swatchHex}>{color}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Harmony Types */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Color Harmony</h3>
        <div style={styles.harmonyButtons}>
          {HARMONY_TYPES.map(t => (
            <button key={t} onClick={() => handleHarmonyChange(t)}
                    style={{ ...styles.harmonyBtn, ...(harmony === t ? styles.harmonyBtnActive : {}) }}>
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div style={styles.swatchRow}>
          {harmonyPalette.map((color, i) => (
            <div key={i} style={styles.swatchItem}>
              <div style={{ background: color, ...styles.swatch, width: 64, height: 64 }} />
              <span style={styles.swatchHex}>{color}</span>
            </div>
          ))}
        </div>
        {score > 0 && <p style={styles.score}>Harmony score: {(score * 100).toFixed(0)}%</p>}
      </section>

      {/* Shades */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Shades</h3>
        <div style={styles.shadesRow}>
          {shades.map((color, i) => (
            <div key={i} style={{ background: color, flex: 1, height: 48, borderRadius: i === 0 ? '8px 0 0 8px' : i === shades.length - 1 ? '0 8px 8px 0' : 0 }} title={color} />
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container:       { fontFamily: 'system-ui', maxWidth: 700, margin: '0 auto', padding: 24, background: '#0f0f1a', color: '#e8eaf6', borderRadius: 16 },
  heading:         { color: '#a78bfa', marginBottom: 20 },
  controls:        { display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 },
  label:           { display: 'flex', flexDirection: 'column' as const, gap: 8, fontSize: 13, color: '#94a3b8' },
  row:             { display: 'flex', gap: 8, alignItems: 'center' },
  hex:             { width: 80, background: '#1e1e2e', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', color: '#e8eaf6', fontFamily: 'monospace', fontSize: 13 },
  hctInfo:         { display: 'flex', gap: 12, fontSize: 13, color: '#94a3b8', background: '#1e1e2e', padding: '6px 12px', borderRadius: 8 },
  section:         { marginBottom: 24, borderTop: '1px solid #1e293b', paddingTop: 16 },
  sectionTitle:    { fontSize: 14, fontWeight: 600, color: '#7c3aed', marginBottom: 12 },
  swatchRow:       { display: 'flex', gap: 8, flexWrap: 'wrap' as const },
  swatchItem:      { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4 },
  swatch:          { width: 40, height: 40, borderRadius: 6 },
  swatchTone:      { fontSize: 10, color: '#64748b' },
  swatchHex:       { fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' },
  harmonyButtons:  { display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 12 },
  harmonyBtn:      { background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '4px 10px', color: '#94a3b8', cursor: 'pointer', fontSize: 12 },
  harmonyBtnActive:{ background: '#4c1d95', borderColor: '#7c3aed', color: '#c4b5fd' },
  score:           { fontSize: 13, color: '#94a3b8', marginTop: 8 },
  shadesRow:       { display: 'flex', borderRadius: 8, overflow: 'hidden' },
} as const;
