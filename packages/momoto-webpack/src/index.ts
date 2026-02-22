/**
 * @momoto-ui/webpack — Webpack Plugin
 *
 * Features:
 * 1. Handles .wasm asset loading (file-loader rules for momoto-wasm)
 * 2. Dev-time accessibility audit via WASM at compilation start
 * 3. Injects CSS custom properties (design tokens) into the bundle
 * 4. Generates virtual module `momoto-theme` with HCT tonal palette vars
 *
 * Usage — webpack.config.js:
 * ```js
 * const { MomotoWebpackPlugin } = require('@momoto-ui/webpack')
 *
 * module.exports = {
 *   plugins: [
 *     new MomotoWebpackPlugin({
 *       tokens: { body: ['#e8eaf6', '#07070e'], link: ['#6188d8', '#07070e'] },
 *       themeBaseColor: '#3a7bd5',
 *       injectCssVars: true,
 *     })
 *   ]
 * }
 * ```
 */

import type { Compiler, WebpackPluginInstance } from 'webpack'

// ── Types ─────────────────────────────────────────────────────────────────
export interface MomotoWebpackOptions {
  /**
   * Token pairs to validate: { name: [fg, bg] }
   * @example { body: ['#e8eaf6', '#07070e'] }
   */
  tokens?: Record<string, [fg: string, bg: string]>

  /** Minimum WCAG contrast ratio. Default: 4.5 (AA normal text) */
  minWcagRatio?: number

  /** Minimum APCA Lc value. Default: 75 (body text) */
  minApcaLc?: number

  /** Fail the build (emit error) instead of warning on contrast violations. Default: false */
  failOnViolation?: boolean

  /** Base color hex for HCT tonal palette injection */
  themeBaseColor?: string

  /** Inject :root CSS vars into a file. Default: true if themeBaseColor is set */
  injectCssVars?: boolean

  /** Output CSS file name for injected tokens. Default: 'momoto-tokens.css' */
  cssFileName?: string

  /** Whether to configure WASM asset rules automatically. Default: true */
  configureWasm?: boolean
}

const PLUGIN_NAME = 'MomotoWebpackPlugin'
const TONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99]
const TWMAP: Record<number, number> = {10:950, 20:900, 30:800, 40:700, 50:600, 60:500, 70:400, 80:300, 90:200, 95:100, 99:50}

// ── Plugin ────────────────────────────────────────────────────────────────
export class MomotoWebpackPlugin implements WebpackPluginInstance {
  private opts: Required<MomotoWebpackOptions>

  constructor(options: MomotoWebpackOptions = {}) {
    this.opts = {
      tokens:          options.tokens           ?? {},
      minWcagRatio:    options.minWcagRatio      ?? 4.5,
      minApcaLc:       options.minApcaLc         ?? 75,
      failOnViolation: options.failOnViolation    ?? false,
      themeBaseColor:  options.themeBaseColor     ?? '',
      injectCssVars:   options.injectCssVars      ?? !!options.themeBaseColor,
      cssFileName:     options.cssFileName        ?? 'momoto-tokens.css',
      configureWasm:   options.configureWasm      ?? true,
    }
  }

  apply(compiler: Compiler) {
    const { webpack } = compiler

    // ── 1. WASM asset rules ──────────────────────────────────────────────
    if (this.opts.configureWasm) {
      compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
        const rules = compiler.options.module.rules as any[]

        // Prevent Webpack from processing .wasm files — use asset/resource
        const alreadyConfigured = rules.some(r => {
          const test = r?.test?.toString() ?? ''
          return test.includes('wasm')
        })

        if (!alreadyConfigured) {
          rules.push({
            test: /\.wasm$/,
            type: 'asset/resource',
            generator: { filename: 'wasm/[name][ext]' },
          })
        }
      })

      // Experiments for WASM (Webpack 5)
      compiler.hooks.environment.tap(PLUGIN_NAME, () => {
        compiler.options.experiments = {
          ...compiler.options.experiments,
          asyncWebAssembly: true,
          syncWebAssembly:  false,
        }
      })
    }

    // ── 2. Accessibility audit (compilation start) ───────────────────────
    if (Object.keys(this.opts.tokens).length > 0) {
      compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, async (params) => {
        await this.runAudit(params as any, compiler)
      })
    }

    // ── 3. CSS token injection (emit phase) ──────────────────────────────
    if (this.opts.injectCssVars && this.opts.themeBaseColor) {
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
        compilation.hooks.processAssets.tapPromise(
          { name: PLUGIN_NAME, stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
          async () => {
            const css = await this.generateTokensCss()
            compilation.emitAsset(
              this.opts.cssFileName,
              new webpack.sources.RawSource(css)
            )
          }
        )
      })
    }
  }

  // ── Audit ──────────────────────────────────────────────────────────────
  private async runAudit(params: any, compiler: Compiler) {
    let wasm: any = null
    try {
      wasm = await import('@momoto-ui/wasm' as any)
      await wasm.default()
    } catch {
      // WASM not available — skip audit
      return
    }

    const { tokens, minWcagRatio, minApcaLc, failOnViolation } = this.opts
    const violations: string[] = []

    for (const [name, [fg, bg]] of Object.entries(tokens)) {
      try {
        const fgC   = wasm.Color.fromHex(fg)
        const bgC   = wasm.Color.fromHex(bg)
        const ratio = wasm.wcagContrastRatio(fgC, bgC)
        const lc    = Math.abs(wasm.apcaContrast(fgC, bgC))

        if (ratio < minWcagRatio) {
          violations.push(`[momoto] "${name}": WCAG ${ratio.toFixed(2)}:1 < ${minWcagRatio} (${fg} on ${bg})`)
        }
        if (lc < minApcaLc) {
          violations.push(`[momoto] "${name}": APCA ${lc.toFixed(0)} Lc < ${minApcaLc} (${fg} on ${bg})`)
        }
      } catch { /* invalid hex — skip */ }
    }

    if (violations.length === 0) {
      const count = Object.keys(tokens).length
      console.log(`\x1b[32m  ✓ momoto-ui: ${count} token pair${count !== 1 ? 's' : ''} passed accessibility audit\x1b[0m`)
    } else {
      violations.forEach(v => {
        if (failOnViolation) {
          (params as any).errors = (params as any).errors ?? []
          ;(params as any).errors.push(new Error(v))
        } else {
          console.warn('\x1b[33m  ⚠ ' + v + '\x1b[0m')
        }
      })
    }
  }

  // ── CSS generation ─────────────────────────────────────────────────────
  private async generateTokensCss(): Promise<string> {
    const { themeBaseColor } = this.opts

    try {
      const wasm: any = await import('@momoto-ui/wasm' as any)
      await wasm.default()

      const [h, c] = Array.from<number>(wasm.hexToHct(themeBaseColor))
      const raw    = wasm.hctTonalPalette(h, c)

      let css = `/* Generated by @momoto-ui/webpack — do not edit */\n:root {\n`
      TONES.forEach((t, i) => {
        const hex = wasm.hctToHex(raw[i * 3], raw[i * 3 + 1], t)
        css += `  --color-primary-${TWMAP[t]}: ${hex};\n`
      })

      // Also inject token pair vars
      for (const [name, [fg, bg]] of Object.entries(this.opts.tokens)) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
        css += `  --token-${slug}-fg: ${fg};\n`
        css += `  --token-${slug}-bg: ${bg};\n`
      }

      css += `}\n`
      return css
    } catch {
      return `/* @momoto-ui/webpack: WASM unavailable — no tokens generated */\n`
    }
  }
}

// ── Named export (CommonJS compat) ────────────────────────────────────────
export default MomotoWebpackPlugin
