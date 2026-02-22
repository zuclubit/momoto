/**
 * Momoto Engine — Angular: MomotoService
 * Injectable singleton that wraps the WASM engine
 */
import { Injectable, signal, computed } from '@angular/core'
import { from, Observable, of, shareReplay, switchMap } from 'rxjs'

type WasmModule = Awaited<typeof import('momoto-wasm')>

@Injectable({ providedIn: 'root' })
export class MomotoService {
  private _wasm: WasmModule | null = null
  private _ready = signal(false)

  readonly ready = this._ready.asReadonly()

  // Observable that resolves when WASM is loaded (replayed to late subscribers)
  readonly wasm$: Observable<WasmModule> = from(
    import('momoto-wasm').then(async (mod) => {
      await mod.default()
      this._wasm = mod
      this._ready.set(true)
      return mod
    })
  ).pipe(shareReplay(1))

  // ── Accessibility ───────────────────────────────────────────────────────
  validatePair(fg: string, bg: string): { ratio: number; level: string; passesAA: boolean; passesAAA: boolean; apcaLc: number } | null {
    if (!this._wasm) return null
    const w = this._wasm
    try {
      const fgC   = w.Color.fromHex(fg)
      const bgC   = w.Color.fromHex(bg)
      const ratio = w.wcagContrastRatio(fgC, bgC)
      const lc    = Math.abs(w.apcaContrast(fgC, bgC))
      return {
        ratio,
        level:    w.wcagLevel(ratio, false),
        passesAA: w.wcagPasses(ratio, 0, false),
        passesAAA:w.wcagPasses(ratio, 1, false),
        apcaLc:   lc,
      }
    } catch { return null }
  }

  // ── HCT Tonal Palette ───────────────────────────────────────────────────
  tonalPalette(baseHex: string, tones = [10,20,30,40,50,60,70,80,90,95,99]): Array<{ tone: number; hex: string }> {
    if (!this._wasm) return []
    const w = this._wasm
    const [h, c] = Array.from(w.hexToHct(baseHex))
    const raw = w.hctTonalPalette(h, c)
    return tones.map((t, i) => ({ tone: t, hex: w.hctToHex(raw[i * 3], raw[i * 3 + 1], t) }))
  }

  // ── Harmony ─────────────────────────────────────────────────────────────
  harmony(baseHex: string, type: string, count = 5): string[] {
    return this._wasm ? this._wasm.generatePalette(baseHex, type, count) : []
  }

  // ── CVD ─────────────────────────────────────────────────────────────────
  cvdSimulate(hex: string): Array<{ type: string; color: string; deltaE: number }> {
    if (!this._wasm) return []
    const w = this._wasm
    return (['protanopia', 'deuteranopia', 'tritanopia'] as const).map(type => ({
      type,
      color:  w.simulateCVD(hex, type),
      deltaE: w.cvdDeltaE(hex, type),
    }))
  }

  // ── Recommendation ──────────────────────────────────────────────────────
  recommendForeground(bg: string, context = 0, target = 0): Record<string, unknown> | null {
    if (!this._wasm) return null
    try { return JSON.parse(this._wasm.agentRecommendForeground(bg, context, target)) }
    catch { return null }
  }

  // ── Materials ───────────────────────────────────────────────────────────
  glassCss(bgHex: string, variant: 'frosted' | 'window' | 'tinted' = 'frosted'): string {
    if (!this._wasm) return ''
    const mat = this._wasm.GlassMaterial[variant]()
    return mat.css(bgHex)
  }

  soapBubbleCss(size = 80): string {
    if (!this._wasm) return ''
    return this._wasm.ThinFilm.soapBubbleMedium().toCssSoapBubble(size)
  }

  structuralColorCss(preset: string, angleDeg = 0): string {
    if (!this._wasm) return ''
    const film = (this._wasm.TransferMatrixFilm as any)[preset]?.()
    return film ? film.toCssStructuralColor(angleDeg) : ''
  }
}
