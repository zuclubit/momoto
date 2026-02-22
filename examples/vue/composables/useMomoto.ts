/**
 * Momoto Engine — Vue 3: Composables
 * useWasm, useContrast, useTonalPalette, useHarmony
 */
import { ref, computed, watch, onMounted, Ref } from 'vue'

// ── Singleton ─────────────────────────────────────────────────────────────
let _mod: Awaited<typeof import('momoto-wasm')> | null = null
let _promise: Promise<Awaited<typeof import('momoto-wasm')>> | null = null

async function loadWasm() {
  if (_mod) return _mod
  if (!_promise) {
    _promise = import('momoto-wasm').then(async m => { await m.default(); _mod = m; return m })
  }
  return _promise
}

// ── useWasm ───────────────────────────────────────────────────────────────
export function useWasm() {
  const wasm = ref(_mod)
  const loading = ref(!_mod)
  const error = ref<Error | null>(null)

  onMounted(() => {
    if (_mod) { loading.value = false; return }
    loadWasm()
      .then(m => { wasm.value = m as any; loading.value = false })
      .catch(e => { error.value = e; loading.value = false })
  })

  return { wasm: wasm as Ref<Awaited<typeof import('momoto-wasm')> | null>, loading, error }
}

// ── useContrast ───────────────────────────────────────────────────────────
export function useContrast(fg: Ref<string>, bg: Ref<string>) {
  const { wasm, loading } = useWasm()
  const validHex = (h: string) => /^#[0-9a-f]{6}$/i.test(h)

  const result = computed(() => {
    const w = wasm.value
    if (!w || !validHex(fg.value) || !validHex(bg.value)) return null
    const fgC   = w.Color.fromHex(fg.value)
    const bgC   = w.Color.fromHex(bg.value)
    const ratio = w.wcagContrastRatio(fgC, bgC)
    const lc    = Math.abs(w.apcaContrast(fgC, bgC))
    return {
      ratio,
      level:         w.wcagLevel(ratio, false),
      passesAA:      w.wcagPasses(ratio, 0, false),
      passesAAA:     w.wcagPasses(ratio, 1, false),
      apcaLc:        lc,
      passesBody:    lc >= 75,
      passesHeading: lc >= 60,
    }
  })

  return { result, loading }
}

// ── useTonalPalette ───────────────────────────────────────────────────────
const DEFAULT_TONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99]

export function useTonalPalette(baseHex: Ref<string>, tones = DEFAULT_TONES) {
  const { wasm } = useWasm()
  const palette = ref<Array<{ tone: number; hex: string }>>([])

  watch([wasm, baseHex], () => {
    const w = wasm.value
    if (!w || !/^#[0-9a-f]{6}$/i.test(baseHex.value)) return
    const [h, c] = Array.from(w.hexToHct(baseHex.value))
    const raw = w.hctTonalPalette(h, c)
    palette.value = tones.map((t, i) => ({
      tone: t,
      hex: w.hctToHex(raw[i * 3], raw[i * 3 + 1], t)
    }))
  }, { immediate: true })

  return palette
}

// ── useHarmony ────────────────────────────────────────────────────────────
export type HarmonyType = 'complementary' | 'triadic' | 'analogous' |
  'split_complementary' | 'tetradic' | 'square' | 'monochromatic'

export function useHarmony(baseHex: Ref<string>, type: Ref<HarmonyType>, count = ref(5)) {
  const { wasm } = useWasm()
  const colors = ref<string[]>([])

  watch([wasm, baseHex, type, count], () => {
    const w = wasm.value
    if (!w || !/^#[0-9a-f]{6}$/i.test(baseHex.value)) return
    colors.value = w.generatePalette(baseHex.value, type.value, count.value)
  }, { immediate: true })

  return colors
}

// ── useCvdSimulation ──────────────────────────────────────────────────────
export function useCvdSimulation(hex: Ref<string>) {
  const { wasm } = useWasm()
  const simulations = ref<Array<{ type: string; color: string; deltaE: number; severity: string }>>([])

  watch([wasm, hex], () => {
    const w = wasm.value
    if (!w || !/^#[0-9a-f]{6}$/i.test(hex.value)) return
    simulations.value = (['protanopia', 'deuteranopia', 'tritanopia'] as const).map(type => {
      const color   = w.simulateCVD(hex.value, type)
      const deltaE  = w.cvdDeltaE(hex.value, type)
      const severity = deltaE < 20 ? 'mild' : deltaE < 60 ? 'moderate' : 'severe'
      return { type, color, deltaE, severity }
    })
  }, { immediate: true })

  return simulations
}
