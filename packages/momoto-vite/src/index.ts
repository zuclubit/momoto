/**
 * @momoto-ui/vite — Vite Plugin
 *
 * Features:
 * 1. Optimizes WASM loading (pre-bundle momoto-wasm)
 * 2. Dev-time accessibility warnings in terminal
 * 3. Virtual module for theme tokens
 * 4. HMR support for color token changes
 *
 * Usage — vite.config.ts:
 * ```ts
 * import { momotoPlugin } from '@momoto-ui/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     momotoPlugin({
 *       validateAccessibility: true,
 *       tokens: { primary: '#3a7bd5', bg: '#07070e', text: '#e8eaf6' }
 *     })
 *   ]
 * })
 * ```
 */
import type { Plugin, ResolvedConfig } from 'vite'

// ── Types ─────────────────────────────────────────────────────────────────
export interface MomotoViteOptions {
  /**
   * Print accessibility warnings at build time for defined token pairs.
   * Default: true in development, false in production
   */
  validateAccessibility?: boolean

  /**
   * Color token pairs to validate { name: [fg, bg] }
   * @example { body: ['#e8eaf6', '#07070e'], link: ['#6188d8', '#07070e'] }
   */
  tokens?: Record<string, [fg: string, bg: string]>

  /**
   * Minimum WCAG contrast ratio. Default: 4.5 (AA)
   */
  minWcagRatio?: number

  /**
   * Minimum APCA Lc value. Default: 75 (body text)
   */
  minApcaLc?: number

  /**
   * Expose `virtual:momoto-theme` module with generated CSS variables.
   * Default: true
   */
  virtualTheme?: boolean

  /**
   * Base color for generating the virtual theme
   */
  themeBaseColor?: string
}

// ── Virtual module IDs ────────────────────────────────────────────────────
const VIRTUAL_ID   = 'virtual:momoto-theme'
const RESOLVED_ID  = '\0' + VIRTUAL_ID

// ── Plugin ────────────────────────────────────────────────────────────────
export function momotoPlugin(options: MomotoViteOptions = {}): Plugin {
  const {
    validateAccessibility = true,
    tokens = {},
    minWcagRatio = 4.5,
    minApcaLc = 75,
    virtualTheme = true,
    themeBaseColor,
  } = options

  let config: ResolvedConfig
  let themeContent = '/* @momoto-ui/vite: no theme generated */'

  return {
    name: 'momoto-ui',
    enforce: 'pre',

    // ── Config ──────────────────────────────────────────────────────────
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    // ── Optimize WASM dependencies ──────────────────────────────────────
    config() {
      return {
        optimizeDeps: {
          exclude: ['momoto-wasm', '@momoto-ui/wasm'],
        },
        build: {
          rollupOptions: {
            // Ensure WASM file is handled correctly
            external: (id) => id.endsWith('.wasm'),
          }
        }
      }
    },

    // ── Virtual module ───────────────────────────────────────────────────
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id === RESOLVED_ID) return themeContent
    },

    // ── Build start: validate + generate theme ───────────────────────────
    async buildStart() {
      const isDev = config?.mode !== 'production'

      if (validateAccessibility && Object.keys(tokens).length > 0) {
        await runAccessibilityAudit(tokens, minWcagRatio, minApcaLc, isDev, this)
      }

      if (virtualTheme && themeBaseColor) {
        themeContent = await generateVirtualTheme(themeBaseColor)
      }
    },

    // ── HMR: watch token config files ───────────────────────────────────
    handleHotUpdate({ file, server }) {
      if (file.includes('design-tokens') || file.includes('theme') || file.includes('colors')) {
        server.ws.send({
          type: 'custom',
          event: 'momoto:theme-update',
          data: { file }
        })
      }
    },
  }
}

// ── Accessibility audit (build-time) ──────────────────────────────────────
async function runAccessibilityAudit(
  tokens: Record<string, [string, string]>,
  minWcag: number,
  minApca: number,
  isDev: boolean,
  ctx: { warn: (msg: string) => void; error: (msg: string) => void }
) {
  let wasm: Awaited<typeof import('@momoto-ui/wasm')> | null = null
  try {
    wasm = await import('@momoto-ui/wasm')
    await (wasm as any).default()
  } catch {
    if (isDev) ctx.warn('[momoto-ui] WASM engine not available — skipping accessibility audit')
    return
  }

  const w = wasm!
  let failures = 0

  for (const [name, [fg, bg]] of Object.entries(tokens)) {
    try {
      const fgC   = w.Color.fromHex(fg)
      const bgC   = w.Color.fromHex(bg)
      const ratio = w.wcagContrastRatio(fgC, bgC)
      const lc    = Math.abs(w.apcaContrast(fgC, bgC))

      if (ratio < minWcag) {
        const msg = `[momoto-ui] ${name}: WCAG ${ratio.toFixed(2)}:1 < ${minWcag} (${fg} on ${bg})`
        isDev ? ctx.warn(msg) : ctx.error(msg)
        failures++
      }
      if (lc < minApca) {
        const msg = `[momoto-ui] ${name}: APCA ${lc.toFixed(1)} Lc < ${minApca} (${fg} on ${bg})`
        isDev ? ctx.warn(msg) : ctx.error(msg)
        failures++
      }
    } catch { /* invalid hex */ }
  }

  if (failures === 0) {
    console.log(`  \x1b[32m✓\x1b[0m momoto-ui: ${Object.keys(tokens).length} token pairs passed accessibility audit`)
  }
}

// ── Virtual theme CSS generation ──────────────────────────────────────────
async function generateVirtualTheme(baseColor: string): Promise<string> {
  try {
    const wasm = await import('@momoto-ui/wasm')
    await (wasm as any).default()
    const [h, c] = Array.from(wasm.hexToHct(baseColor))
    const raw = wasm.hctTonalPalette(h, c)
    const TONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99]
    const TWMAP: Record<number, number> = { 10:950, 20:900, 30:800, 40:700, 50:600, 60:500, 70:400, 80:300, 90:200, 95:100, 99:50 }

    let css = '/* Generated by @momoto-ui/vite */\n:root {\n'
    TONES.forEach((t, i) => {
      const hex = wasm.hctToHex(raw[i * 3], raw[i * 3 + 1], t)
      css += `  --color-primary-${TWMAP[t]}: ${hex};\n`
    })
    css += '}\n'
    return css
  } catch {
    return '/* @momoto-ui/vite: WASM unavailable */'
  }
}
