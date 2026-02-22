/**
 * Momoto Engine — React: useMomoto Hook
 * Singleton WASM initialization with React Suspense support
 */
import { use, useCallback, useEffect, useRef, useState } from 'react';
import type { Color as ColorType } from 'momoto-wasm';

// ── Singleton promise (module-level, shared across all hook instances) ────
let _initPromise: Promise<typeof import('momoto-wasm')> | null = null;
let _wasm: typeof import('momoto-wasm') | null = null;

function getWasm() {
  if (!_initPromise) {
    _initPromise = import('momoto-wasm').then(async (mod) => {
      await mod.default(); // init()
      _wasm = mod;
      return mod;
    });
  }
  return _initPromise;
}

// ── Suspense-compatible resource ──────────────────────────────────────────
const wasmResource = {
  _promise: null as Promise<void> | null,
  _resolved: false,
  read() {
    if (this._resolved) return;
    if (!this._promise) { this._promise = getWasm().then(() => { this._resolved = true; }); }
    throw this._promise; // Suspense boundary catches this
  }
};

// ── Main hook ─────────────────────────────────────────────────────────────
export function useMomoto() {
  wasmResource.read(); // throws for Suspense if not ready
  return _wasm!;
}

// ── Async hook (no Suspense required) ─────────────────────────────────────
export function useMomotoAsync() {
  const [wasm, setWasm] = useState<typeof import('momoto-wasm') | null>(_wasm);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (_wasm) { setWasm(_wasm); return; }
    getWasm().then(setWasm).catch(setError);
  }, []);

  return { wasm, loading: !wasm && !error, error };
}

// ── Contrast hook ─────────────────────────────────────────────────────────
export interface ContrastResult {
  ratio: number;
  level: string;
  passesAA: boolean;
  passesAAA: boolean;
  apcaLc: number;
  passesBody: boolean;
  passesHeading: boolean;
}

export function useContrast(fg: string, bg: string): ContrastResult | null {
  const [result, setResult] = useState<ContrastResult | null>(null);
  const { wasm } = useMomotoAsync();

  useEffect(() => {
    if (!wasm) return;
    if (!/^#[0-9a-f]{6}$/i.test(fg) || !/^#[0-9a-f]{6}$/i.test(bg)) return;
    try {
      const fgC = wasm.Color.fromHex(fg);
      const bgC = wasm.Color.fromHex(bg);
      const ratio = wasm.wcagContrastRatio(fgC, bgC);
      const lc    = Math.abs(wasm.apcaContrast(fgC, bgC));
      setResult({
        ratio,
        level:         wasm.wcagLevel(ratio, false),
        passesAA:      wasm.wcagPasses(ratio, 0, false),
        passesAAA:     wasm.wcagPasses(ratio, 1, false),
        apcaLc:        lc,
        passesBody:    lc >= 75,
        passesHeading: lc >= 60,
      });
    } catch { /* invalid hex */ }
  }, [wasm, fg, bg]);

  return result;
}

// ── Tonal Palette hook ────────────────────────────────────────────────────
export function useTonalPalette(baseHex: string, tones = [10,20,30,40,50,60,70,80,90,95,99]) {
  const [palette, setPalette] = useState<Array<{ tone: number; hex: string }>>([]);
  const { wasm } = useMomotoAsync();

  useEffect(() => {
    if (!wasm || !/^#[0-9a-f]{6}$/i.test(baseHex)) return;
    const [h, c] = Array.from(wasm.hexToHct(baseHex));
    const raw = wasm.hctTonalPalette(h, c);
    setPalette(tones.map((t, i) => ({
      tone: t,
      hex: wasm.hctToHex(raw[i * 3], raw[i * 3 + 1], t)
    })));
  }, [wasm, baseHex, tones.join(',')]);

  return palette;
}

// ── Recommendation hook ───────────────────────────────────────────────────
export function useRecommendForeground(bgHex: string, context = 0, target = 0) {
  const [rec, setRec] = useState<Record<string, unknown> | null>(null);
  const { wasm } = useMomotoAsync();

  useEffect(() => {
    if (!wasm || !/^#[0-9a-f]{6}$/i.test(bgHex)) return;
    try {
      setRec(JSON.parse(wasm.agentRecommendForeground(bgHex, context, target)));
    } catch { /* ignore */ }
  }, [wasm, bgHex, context, target]);

  return rec;
}
