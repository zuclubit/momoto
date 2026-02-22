/**
 * Momoto Engine — React: ColorValidator Component
 * Real-time WCAG + APCA validation with WASM engine
 */
import { useState, useEffect, useCallback } from 'react';
import init, {
  Color, wcagContrastRatio, wcagPasses, wcagLevel, apcaContrast,
  simulateCVD, cvdDeltaE
} from 'momoto-wasm';

// ── Types ─────────────────────────────────────────────────────────────────
interface ValidationResult {
  wcag: { ratio: number; level: string; passesAA: boolean; passesAAA: boolean };
  apca: { lc: number; passesBody: boolean; passesHeading: boolean };
  cvd: Array<{ type: string; simulated: string; deltaE: number; severity: string }>;
}

// ── WASM singleton init ───────────────────────────────────────────────────
let wasmReady = false;
const wasmInit = init().then(() => { wasmReady = true; });

function validate(fg: string, bg: string): ValidationResult | null {
  if (!wasmReady || !/^#[0-9a-f]{6}$/i.test(fg) || !/^#[0-9a-f]{6}$/i.test(bg)) return null;
  const fgC = Color.fromHex(fg);
  const bgC = Color.fromHex(bg);
  const ratio = wcagContrastRatio(fgC, bgC);
  const lc    = Math.abs(apcaContrast(fgC, bgC));
  const cvd   = (['protanopia', 'deuteranopia', 'tritanopia'] as const).map(type => {
    const sim = simulateCVD(fg, type);
    const de  = cvdDeltaE(fg, type);
    return { type, simulated: sim, deltaE: de, severity: de < 20 ? 'mild' : de < 60 ? 'moderate' : 'severe' };
  });
  return {
    wcag: { ratio, level: wcagLevel(ratio, false), passesAA: wcagPasses(ratio, 0, false), passesAAA: wcagPasses(ratio, 1, false) },
    apca: { lc, passesBody: lc >= 75, passesHeading: lc >= 60 },
    cvd
  };
}

// ── Component ─────────────────────────────────────────────────────────────
export function ColorValidator() {
  const [fg, setFg] = useState('#c8d4ff');
  const [bg, setBg] = useState('#07070e');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    wasmInit.then(() => {
      setReady(true);
      setResult(validate(fg, bg));
    });
  }, []);

  const handleChange = useCallback((newFg: string, newBg: string) => {
    setFg(newFg); setBg(newBg);
    setResult(validate(newFg, newBg));
  }, []);

  if (!ready) return <div style={styles.loading}>Loading WASM engine…</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Color Validator</h2>

      {/* Color pickers */}
      <div style={styles.row}>
        <label style={styles.label}>
          Foreground
          <div style={styles.pickerRow}>
            <input type="color" value={fg} onChange={e => handleChange(e.target.value, bg)} />
            <input type="text"  value={fg} onChange={e => handleChange(e.target.value, bg)}
                   style={styles.hexInput} maxLength={7} />
          </div>
        </label>
        <label style={styles.label}>
          Background
          <div style={styles.pickerRow}>
            <input type="color" value={bg} onChange={e => handleChange(fg, e.target.value)} />
            <input type="text"  value={bg} onChange={e => handleChange(fg, e.target.value)}
                   style={styles.hexInput} maxLength={7} />
          </div>
        </label>
        {/* Preview */}
        <div style={{ ...styles.preview, background: bg, color: fg }}>
          Aa — Sample Text
        </div>
      </div>

      {result && (
        <>
          {/* WCAG */}
          <section style={styles.section}>
            <h3>WCAG 2.1 — {result.wcag.ratio.toFixed(2)}:1</h3>
            <Badge ok={result.wcag.passesAA}  label="AA (4.5:1)" />
            <Badge ok={result.wcag.passesAAA} label="AAA (7:1)" />
            <span style={styles.levelBadge}>{result.wcag.level}</span>
          </section>

          {/* APCA */}
          <section style={styles.section}>
            <h3>APCA-W3 — {result.apca.lc.toFixed(1)} Lc</h3>
            <Badge ok={result.apca.passesBody}    label="Body text (≥75 Lc)" />
            <Badge ok={result.apca.passesHeading} label="Heading (≥60 Lc)" />
          </section>

          {/* CVD */}
          <section style={styles.section}>
            <h3>CVD Simulation (Viénot 1999)</h3>
            <div style={styles.cvdRow}>
              <Swatch color={fg} label="Original" />
              {result.cvd.map(({ type, simulated, severity }) => (
                <Swatch key={type} color={simulated}
                  label={`${type.replace('anopia','')}: ${severity}`} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{ ...styles.badge, background: ok ? '#166534' : '#7f1d1d',
                   color: ok ? '#4ade80' : '#f87171' }}>
      {ok ? '✓' : '✗'} {label}
    </span>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div style={styles.swatch}>
      <div style={{ background: color, width: 48, height: 48, borderRadius: 8 }} />
      <span style={styles.swatchLabel}>{color}</span>
      <span style={styles.swatchLabel}>{label}</span>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const styles = {
  container:   { fontFamily: 'system-ui', maxWidth: 600, margin: '0 auto', padding: 24, background: '#0f0f1a', color: '#e8eaf6', borderRadius: 16 },
  title:       { fontSize: 20, fontWeight: 700, color: '#a78bfa', marginBottom: 20 },
  row:         { display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' as const },
  label:       { display: 'flex', flexDirection: 'column' as const, gap: 8, fontSize: 13, color: '#94a3b8' },
  pickerRow:   { display: 'flex', gap: 8, alignItems: 'center' },
  hexInput:    { width: 80, background: '#1e1e2e', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', color: '#e8eaf6', fontFamily: 'monospace', fontSize: 13 },
  preview:     { padding: '12px 24px', borderRadius: 10, fontSize: 18, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' },
  section:     { marginBottom: 20, borderTop: '1px solid #1e293b', paddingTop: 16 },
  badge:       { display: 'inline-block', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, marginRight: 8 },
  levelBadge:  { fontSize: 13, color: '#94a3b8' },
  cvdRow:      { display: 'flex', gap: 16, flexWrap: 'wrap' as const },
  swatch:      { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4 },
  swatchLabel: { fontSize: 11, color: '#94a3b8' },
  loading:     { padding: 24, color: '#94a3b8' },
} as const;
