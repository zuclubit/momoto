<script lang="ts">
  /**
   * Momoto Engine — Svelte 4: ColorValidator
   * Reactive WASM integration with Svelte stores
   */
  import { onMount } from 'svelte'
  import { writable, derived } from 'svelte/store'

  // ── State stores ──────────────────────────────────────────────────────
  const wasmMod  = writable<Awaited<typeof import('momoto-wasm')> | null>(null)
  const fgStore  = writable('#c8d4ff')
  const bgStore  = writable('#07070e')

  let fg = '#c8d4ff'
  let bg = '#07070e'

  // ── WASM init ──────────────────────────────────────────────────────────
  onMount(async () => {
    const mod = await import('momoto-wasm')
    await mod.default()
    wasmMod.set(mod)
  })

  // ── Derived result ────────────────────────────────────────────────────
  const result = derived([wasmMod, fgStore, bgStore], ([$w, $fg, $bg]) => {
    if (!$w || !/^#[0-9a-f]{6}$/i.test($fg) || !/^#[0-9a-f]{6}$/i.test($bg)) return null
    try {
      const fgC   = $w.Color.fromHex($fg)
      const bgC   = $w.Color.fromHex($bg)
      const ratio = $w.wcagContrastRatio(fgC, bgC)
      const lc    = Math.abs($w.apcaContrast(fgC, bgC))
      const cvd   = (['protanopia', 'deuteranopia', 'tritanopia'] as const).map(type => ({
        type,
        sim:    $w.simulateCVD($fg, type),
        deltaE: $w.cvdDeltaE($fg, type).toFixed(1),
      }))
      return {
        ratio: ratio.toFixed(2),
        level: $w.wcagLevel(ratio, false),
        passesAA:  $w.wcagPasses(ratio, 0, false),
        passesAAA: $w.wcagPasses(ratio, 1, false),
        lc:        lc.toFixed(1),
        body:      lc >= 75,
        heading:   lc >= 60,
        cvd,
      }
    } catch { return null }
  })

  function update() {
    fgStore.set(fg)
    bgStore.set(bg)
  }
</script>

<div class="validator">
  <h2>Color Validator</h2>

  {#if !$wasmMod}
    <p class="loading">Loading WASM engine…</p>
  {:else}
    <!-- Controls -->
    <div class="controls">
      <label>
        Foreground
        <div class="row">
          <input type="color" bind:value={fg} on:input={update} />
          <input type="text"  bind:value={fg} on:input={update} maxlength="7" />
        </div>
      </label>
      <label>
        Background
        <div class="row">
          <input type="color" bind:value={bg} on:input={update} />
          <input type="text"  bind:value={bg} on:input={update} maxlength="7" />
        </div>
      </label>
      <div class="preview" style:background={bg} style:color={fg}>Aa — Preview</div>
    </div>

    {#if $result}
      <!-- WCAG -->
      <section>
        <h3>WCAG 2.1 — {$result.ratio}:1</h3>
        <span class="badge" class:pass={$result.passesAA}  class:fail={!$result.passesAA}>
          {$result.passesAA ? '✓' : '✗'} AA
        </span>
        <span class="badge" class:pass={$result.passesAAA} class:fail={!$result.passesAAA}>
          {$result.passesAAA ? '✓' : '✗'} AAA
        </span>
        <span class="level">{$result.level}</span>
      </section>

      <!-- APCA -->
      <section>
        <h3>APCA-W3 — {$result.lc} Lc</h3>
        <span class="badge" class:pass={$result.body}    class:fail={!$result.body}>
          {$result.body ? '✓' : '✗'} Body (≥75 Lc)
        </span>
        <span class="badge" class:pass={$result.heading} class:fail={!$result.heading}>
          {$result.heading ? '✓' : '✗'} Heading (≥60 Lc)
        </span>
      </section>

      <!-- CVD -->
      <section>
        <h3>CVD Simulation</h3>
        <div class="cvd-row">
          <div class="swatch-item">
            <div class="swatch" style:background={fg}></div>
            <span>Original</span>
          </div>
          {#each $result.cvd as { type, sim, deltaE }}
            <div class="swatch-item">
              <div class="swatch" style:background={sim}></div>
              <span>{type}</span>
              <span class="de">ΔE {deltaE}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  {/if}
</div>

<style>
  .validator  { font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 24px;
                background: #0f0f1a; color: #e8eaf6; border-radius: 16px; }
  h2          { color: #a78bfa; }
  .loading    { color: #94a3b8; }
  .controls   { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
  label       { display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #94a3b8; }
  .row        { display: flex; gap: 8px; align-items: center; }
  input[type="text"] { width: 80px; background: #1e1e2e; border: 1px solid #334155;
                       border-radius: 6px; padding: 4px 8px; color: #e8eaf6; font-family: monospace; }
  .preview    { padding: 12px 20px; border-radius: 10px; font-size: 18px; font-weight: 600; }
  section     { margin-bottom: 20px; border-top: 1px solid #1e293b; padding-top: 16px; }
  h3          { font-size: 14px; font-weight: 600; color: #c4b5fd; margin-bottom: 10px; }
  .badge      { display: inline-block; border-radius: 6px; padding: 4px 10px; font-size: 12px; margin-right: 8px; }
  .pass       { background: #166534; color: #4ade80; }
  .fail       { background: #7f1d1d; color: #f87171; }
  .level      { font-size: 13px; color: #94a3b8; }
  .cvd-row    { display: flex; gap: 16px; flex-wrap: wrap; }
  .swatch-item{ display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 11px; color: #94a3b8; }
  .swatch     { width: 48px; height: 48px; border-radius: 8px; }
  .de         { color: #64748b; }
</style>
