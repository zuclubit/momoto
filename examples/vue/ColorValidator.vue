<script setup lang="ts">
/**
 * Momoto Engine — Vue 3: ColorValidator Component
 * Composition API + WASM engine integration
 */
import { ref, computed, onMounted, watchEffect } from 'vue'

// ── WASM lazy init ────────────────────────────────────────────────────────
let wasmMod: Awaited<typeof import('momoto-wasm')> | null = null
const wasmReady = ref(false)

async function ensureWasm() {
  if (wasmMod) return
  const mod = await import('momoto-wasm')
  await mod.default()
  wasmMod = mod
  wasmReady.value = true
}

// ── State ─────────────────────────────────────────────────────────────────
const fg = ref('#c8d4ff')
const bg = ref('#07070e')
const validHex = (h: string) => /^#[0-9a-f]{6}$/i.test(h)

// ── Computed validation ───────────────────────────────────────────────────
const result = computed(() => {
  if (!wasmReady.value || !wasmMod) return null
  if (!validHex(fg.value) || !validHex(bg.value)) return null
  const w = wasmMod
  const fgC = w.Color.fromHex(fg.value)
  const bgC = w.Color.fromHex(bg.value)
  const ratio = w.wcagContrastRatio(fgC, bgC)
  const lc    = Math.abs(w.apcaContrast(fgC, bgC))
  return {
    ratio:         ratio.toFixed(2),
    level:         w.wcagLevel(ratio, false),
    passesAA:      w.wcagPasses(ratio, 0, false),
    passesAAA:     w.wcagPasses(ratio, 1, false),
    apcaLc:        lc.toFixed(1),
    passesBody:    lc >= 75,
    passesHeading: lc >= 60,
    cvd: (['protanopia', 'deuteranopia', 'tritanopia'] as const).map(type => ({
      type,
      simulated: w.simulateCVD(fg.value, type),
      deltaE:    w.cvdDeltaE(fg.value, type).toFixed(1),
    })),
  }
})

const previewStyle = computed(() => ({
  background: bg.value,
  color: fg.value,
  padding: '12px 20px',
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '18px',
  border: '1px solid rgba(255,255,255,0.1)',
}))

onMounted(ensureWasm)
</script>

<template>
  <div class="validator">
    <h2 class="heading">Color Validator</h2>

    <!-- Loading -->
    <p v-if="!wasmReady" class="loading">Loading WASM engine…</p>

    <template v-else>
      <!-- Controls -->
      <div class="controls">
        <label class="field">
          Foreground
          <div class="picker-row">
            <input type="color" v-model="fg" />
            <input type="text" v-model="fg" maxlength="7" class="hex-input" />
          </div>
        </label>
        <label class="field">
          Background
          <div class="picker-row">
            <input type="color" v-model="bg" />
            <input type="text" v-model="bg" maxlength="7" class="hex-input" />
          </div>
        </label>
        <div :style="previewStyle">Aa — Preview</div>
      </div>

      <!-- Results -->
      <template v-if="result">
        <!-- WCAG -->
        <section class="section">
          <h3>WCAG 2.1 — {{ result.ratio }}:1</h3>
          <span :class="['badge', result.passesAA ? 'pass' : 'fail']">
            {{ result.passesAA ? '✓' : '✗' }} AA (4.5:1)
          </span>
          <span :class="['badge', result.passesAAA ? 'pass' : 'fail']">
            {{ result.passesAAA ? '✓' : '✗' }} AAA (7:1)
          </span>
          <span class="level-tag">{{ result.level }}</span>
        </section>

        <!-- APCA -->
        <section class="section">
          <h3>APCA-W3 — {{ result.apcaLc }} Lc</h3>
          <span :class="['badge', result.passesBody ? 'pass' : 'fail']">
            {{ result.passesBody ? '✓' : '✗' }} Body (≥75 Lc)
          </span>
          <span :class="['badge', result.passesHeading ? 'pass' : 'fail']">
            {{ result.passesHeading ? '✓' : '✗' }} Heading (≥60 Lc)
          </span>
        </section>

        <!-- CVD -->
        <section class="section">
          <h3>CVD Simulation</h3>
          <div class="cvd-row">
            <div class="swatch-item">
              <div class="swatch" :style="{ background: fg }" />
              <span class="swatch-label">Original</span>
            </div>
            <div v-for="item in result.cvd" :key="item.type" class="swatch-item">
              <div class="swatch" :style="{ background: item.simulated }" />
              <span class="swatch-label">{{ item.type }}</span>
              <span class="swatch-de">ΔE {{ item.deltaE }}</span>
            </div>
          </div>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped>
.validator { font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 24px;
             background: #0f0f1a; color: #e8eaf6; border-radius: 16px; }
.heading   { color: #a78bfa; margin-bottom: 20px; }
.loading   { color: #94a3b8; }
.controls  { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
.field     { display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #94a3b8; }
.picker-row{ display: flex; gap: 8px; align-items: center; }
.hex-input { width: 80px; background: #1e1e2e; border: 1px solid #334155; border-radius: 6px;
             padding: 4px 8px; color: #e8eaf6; font-family: monospace; font-size: 13px; }
.section   { margin-bottom: 20px; border-top: 1px solid #1e293b; padding-top: 16px; }
.section h3{ font-size: 14px; font-weight: 600; color: #c4b5fd; margin-bottom: 10px; }
.badge     { display: inline-block; border-radius: 6px; padding: 4px 10px;
             font-size: 12px; font-weight: 600; margin-right: 8px; }
.pass      { background: #166534; color: #4ade80; }
.fail      { background: #7f1d1d; color: #f87171; }
.level-tag { font-size: 13px; color: #94a3b8; }
.cvd-row   { display: flex; gap: 16px; flex-wrap: wrap; }
.swatch-item{ display: flex; flex-direction: column; align-items: center; gap: 4px; }
.swatch    { width: 48px; height: 48px; border-radius: 8px; }
.swatch-label{ font-size: 11px; color: #94a3b8; }
.swatch-de { font-size: 11px; color: #64748b; }
</style>
