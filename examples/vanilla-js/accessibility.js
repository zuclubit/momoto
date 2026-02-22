/**
 * Momoto Engine — Vanilla JS: Accessibility Examples
 * Covers WCAG 2.1, APCA-W3, batch operations, CVD
 */
import init, {
  Color,
  wcagContrastRatio, wcagPasses, wcagLevel, apcaContrast,
  wcagContrastRatioBatch, relativeLuminanceBatch,
  simulateCVD, cvdDeltaE,
  agentValidatePair, agentGetMetrics,
  selfCertify
} from 'momoto-wasm';

await init();

// ── 1. Single pair validation ──────────────────────────────────────────────
{
  const fg = Color.fromHex('#c8d4ff');
  const bg = Color.fromHex('#07070e');

  const ratio  = wcagContrastRatio(fg, bg);
  const level  = wcagLevel(ratio, false);          // "AAA" | "AA" | "AA-Large" | "fail"
  const apca   = apcaContrast(fg, bg);             // Lc value
  const passAA = wcagPasses(ratio, 0, false);      // level: 0=AA, 1=AAA
  const passAAA = wcagPasses(ratio, 1, false);

  console.log(`WCAG: ${ratio.toFixed(2)}:1 (${level}) — AA: ${passAA}, AAA: ${passAAA}`);
  console.log(`APCA: ${apca.toFixed(1)} Lc (body text needs ≥75, heading ≥60)`);
}

// ── 2. Batch WCAG (high-performance, zero GC) ──────────────────────────────
{
  // Input: Uint8Array of [fg_r,fg_g,fg_b, bg_r,bg_g,bg_b, ...] triples
  const pairs = new Uint8Array([
    0,   0,   0,   255, 255, 255,  // black on white → 21.0:1
    200, 200, 200,  50,  50,  50,  // light gray on dark → 5.74:1
    255,  0,   0,  255, 255, 255,  // red on white → 3.99:1
    100, 149, 237,  10,  10,  10,  // cornflower blue on near-black
  ]);
  const ratios = wcagContrastRatioBatch(pairs);
  ratios.forEach((r, i) => console.log(`Pair ${i+1}: ${r.toFixed(2)}:1`));
  // Float64Array [21.0, 5.74, 3.99, ~7.2]
}

// ── 3. APCA levels ──────────────────────────────────────────────────────────
{
  const combos = [
    { fg: '#000000', bg: '#ffffff', use: 'body text' },
    { fg: '#444444', bg: '#ffffff', use: 'heading'   },
    { fg: '#767676', bg: '#ffffff', use: 'placeholder'},
  ];
  for (const { fg, bg, use } of combos) {
    const lc = Math.abs(apcaContrast(Color.fromHex(fg), Color.fromHex(bg)));
    const ok = lc >= 75 ? '✅ body' : lc >= 60 ? '⚠️ heading only' : '❌ insufficient';
    console.log(`${fg} / ${bg} (${use}): ${lc.toFixed(1)} Lc — ${ok}`);
  }
}

// ── 4. CVD accessibility audit ──────────────────────────────────────────────
{
  const colors = ['#3a7bd5', '#e63946', '#2dc653', '#ffd700'];

  for (const hex of colors) {
    console.log(`\n${hex}:`);
    for (const type of ['protanopia', 'deuteranopia', 'tritanopia']) {
      const simulated = simulateCVD(hex, type);
      const deltaE    = cvdDeltaE(hex, type);
      const risk = deltaE < 20 ? 'LOW' : deltaE < 60 ? 'MEDIUM' : 'HIGH';
      console.log(`  ${type}: ${simulated} — ΔE ${deltaE.toFixed(1)} (${risk} confusion risk)`);
    }
  }
}

// ── 5. Agent JSON API ──────────────────────────────────────────────────────
{
  const result = JSON.parse(agentValidatePair('#6188d8', '#07070e', 'wcag', 'aa'));
  console.log('Agent validation:', result);
  // { passes: true, ratio: 8.34, level: "AAA", fg: "#6188d8", bg: "#07070e" }

  const metrics = JSON.parse(agentGetMetrics('#3a7bd5'));
  console.log('Color metrics:', metrics);
  // { hex, oklch: {l,c,h}, hct: {hue,chroma,tone}, luminance: 0.13 }
}

// ── 6. Self-certification (golden vector validation) ─────────────────────
{
  const cert = JSON.parse(selfCertify());
  console.log(`Self-certify: ${cert.passed ? 'PASSED' : 'FAILED'} — ${cert.tests} tests`);
}
