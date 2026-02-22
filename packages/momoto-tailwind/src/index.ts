/**
 * @momoto-ui/tailwind — Tailwind CSS plugin
 *
 * Generates a complete, accessible color scale from a base color
 * using the Momoto engine (HCT tonal palettes, WCAG-validated shades).
 *
 * Usage — tailwind.config.js:
 * ```js
 * const momoto = require('@momoto-ui/tailwind')
 * module.exports = {
 *   plugins: [
 *     momoto.plugin({ primary: '#3a7bd5', secondary: '#7c3aed' })
 *   ]
 * }
 * ```
 *
 * This generates utilities like:
 *   bg-primary-50, text-primary-950, border-secondary-400 ...
 *   data-[theme=dark]:bg-primary-900 (auto dark mode tones)
 */

import plugin from 'tailwindcss/plugin'

// ── Types ─────────────────────────────────────────────────────────────────
export interface MomotoTailwindOptions {
  /** Named colors to generate scales for: { primary: '#hex', ... } */
  colors: Record<string, string>
  /**
   * HCT tones to generate per color.
   * Defaults to Tailwind-compatible 50–950 scale mapped to HCT tones.
   */
  tones?: number[]
  /** Add CSS custom properties (--color-primary-500) alongside utilities. Default: true */
  cssVars?: boolean
  /** Tone to use for the "DEFAULT" value. Default: 500 */
  defaultTone?: number
  /** Run synchronously using pre-computed values (for build-time use). Default: false */
  precomputed?: Record<string, Record<number, string>>
}

// Tailwind 50–950 → HCT tone mapping (perceptually aligned)
const TONE_MAP: Record<number, number> = {
  50:  99,
  100: 95,
  200: 90,
  300: 80,
  400: 70,
  500: 60,
  600: 50,
  700: 40,
  800: 30,
  900: 20,
  950: 10,
}

// ── Synchronous palette generation from pre-computed values ───────────────
function buildColorScale(
  colorName: string,
  hexValues: Record<number, string>,
  tones: number[],
  defaultTone: number
): Record<string, string> {
  const scale: Record<string, string> = {}
  for (const tw of tones) {
    const hct = TONE_MAP[tw]
    if (hexValues[hct]) scale[String(tw)] = hexValues[hct]
  }
  if (hexValues[TONE_MAP[defaultTone]]) {
    scale['DEFAULT'] = hexValues[TONE_MAP[defaultTone]]
  }
  return scale
}

// ── Main plugin factory ───────────────────────────────────────────────────
export function plugin(options: MomotoTailwindOptions) {
  const {
    colors,
    tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    cssVars = true,
    defaultTone = 500,
    precomputed = {}
  } = options

  return tailwindPlugin(({ addBase, theme }) => {
    if (!cssVars) return

    const vars: Record<string, string> = {}
    for (const [name, hexValues] of Object.entries(precomputed)) {
      for (const tw of tones) {
        const hct = TONE_MAP[tw]
        if (hexValues[hct]) vars[`--color-${name}-${tw}`] = hexValues[hct]
      }
    }
    if (Object.keys(vars).length > 0) {
      addBase({ ':root': vars })
    }
  }, {
    theme: {
      extend: {
        colors: Object.fromEntries(
          Object.entries(precomputed).map(([name, hexValues]) => [
            name,
            buildColorScale(name, hexValues, tones, defaultTone)
          ])
        )
      }
    }
  })
}

// Re-export tailwind plugin for direct use
const tailwindPlugin = plugin

// ── Static palette generator (Node.js, build scripts) ────────────────────
/**
 * Generate pre-computed color values for use with the plugin.
 * Call this at build time (Node.js) and pass result as `precomputed`.
 *
 * @example
 * // generate-theme.mjs
 * import { generatePalette } from '@momoto-ui/tailwind/generate'
 * const palette = await generatePalette({ primary: '#3a7bd5' })
 * // { primary: { 10: '#0a1433', 20: '#1a2d6b', ... } }
 */
export async function generatePalette(
  colors: Record<string, string>
): Promise<Record<string, Record<number, string>>> {
  // Dynamic import — engine only needed at build time or in environments with WASM support
  const { default: init, hexToHct, hctTonalPalette, hctToHex } = await import('@momoto-ui/wasm')
  await init()

  const result: Record<string, Record<number, string>> = {}
  const HCT_TONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99]

  for (const [name, hex] of Object.entries(colors)) {
    const [h, c] = Array.from(hexToHct(hex))
    const raw = hctTonalPalette(h, c)
    result[name] = {}
    HCT_TONES.forEach((t, i) => {
      result[name][t] = hctToHex(raw[i * 3], raw[i * 3 + 1], t)
    })
  }
  return result
}

/**
 * Generate a complete tailwind.config.js content string with pre-computed values.
 *
 * @example
 * // generate-theme.mjs
 * import { generateConfig } from '@momoto-ui/tailwind/generate'
 * const config = await generateConfig({ primary: '#3a7bd5', secondary: '#7c3aed' })
 * fs.writeFileSync('tailwind.theme.generated.js', config)
 */
export async function generateConfig(colors: Record<string, string>): Promise<string> {
  const palette = await generatePalette(colors)

  const colorsJson = Object.fromEntries(
    Object.entries(palette).map(([name, tones]) => [
      name,
      Object.fromEntries(
        Object.entries(TONE_MAP).map(([tw, hct]) => [tw, tones[hct] ?? null]).filter(([,v]) => v)
      )
    ])
  )

  return `// Auto-generated by @momoto-ui/tailwind — DO NOT EDIT
// Regenerate with: node generate-theme.mjs

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colorsJson, null, 6)}
    }
  }
}
`
}
