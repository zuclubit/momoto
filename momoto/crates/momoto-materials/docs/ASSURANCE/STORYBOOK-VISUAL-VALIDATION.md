# Storybook Visual Validation Report

**Date:** 2026-01-11
**Author:** Claude Opus 4.5 Assurance System
**Status:** VALIDATION CHECKLIST PREPARED

---

## Important Note

This document provides a comprehensive visual validation checklist for Storybook at `http://localhost:6006/`.

**Action Required:** Screenshots must be captured manually and saved to:
```
docs/ASSURANCE/screenshots/
```

---

## 1. Pre-Validation Setup

### 1.1 Start Storybook

```bash
cd /Users/oscarvalois/Documents/Github/momoto-ui/momoto/apps/storybook
npm run storybook
# Or: pnpm storybook
```

### 1.2 Verify Access

Open browser: `http://localhost:6006/`

**Expected:** Storybook UI with sidebar navigation showing:
- Materials/
  - GlassPresets
  - GlassBuilder
- Advanced/
  - MetalMaterials
  - ThinFilmIridescence
  - AnisotropicMaterials
  - SubsurfaceMaterials
  - CrystalEmulation
  - Experimental
  - HighPerformance
- Context/
  - RenderContext
- Shadows/
  - ElevationShadows
- Examples/
  - GlassCard

---

## 2. Material Validation Checklist

### 2.1 Glass Presets (4 Screenshots)

Navigate to: **Materials → GlassPresets**

| Preset | Expected Appearance | Capture Filename |
|--------|---------------------|------------------|
| Clear | Minimal blur, sharp edges, subtle Fresnel | `glass_clear_preset.png` |
| Regular | Apple-style glass, moderate blur | `glass_regular_preset.png` |
| Thick | Heavy blur, strong refraction feel | `glass_thick_preset.png` |
| Frosted | Diffused, matte appearance | `glass_frosted_preset.png` |

**Verification Points:**
- [ ] Fresnel edge glow visible at panel edges
- [ ] Specular highlight positioned correctly
- [ ] Background shows through with blur
- [ ] Quality tier indicator displays "Desktop"

---

### 2.2 Metal Materials (6 Screenshots)

Navigate to: **Advanced → MetalMaterials**

| Metal | Expected Color | F0 Value | Capture Filename |
|-------|----------------|----------|------------------|
| Gold | Warm yellow/orange | ~91% | `metal_gold.png` |
| Silver | Bright neutral | ~97% | `metal_silver.png` |
| Copper | Reddish orange | ~80% | `metal_copper.png` |
| Aluminum | Cool silver | ~91% | `metal_aluminum.png` |
| Titanium | Gray-blue | ~54% | `metal_titanium.png` |
| Iron | Dark gray | ~56% | `metal_iron.png` |

**Verification Points:**
- [ ] F0 (reflectivity) bar shows correct percentage
- [ ] Certification level badge visible
- [ ] Color matches metal's expected appearance
- [ ] Neural toggle functions (if available)

---

### 2.3 Thin-Film Iridescence (3 Screenshots)

Navigate to: **Advanced → ThinFilmIridescence**

| Demo | Expected Effect | Capture Filename |
|------|-----------------|------------------|
| Soap Bubble | Rainbow colors, animated thickness | `thinfilm_soap_bubble.png` |
| Oil Slick | Gradient colors across surface | `thinfilm_oil_slick.png` |
| AR Coating | Subtle purple/green reflection | `thinfilm_ar_coating.png` |

**Verification Points:**
- [ ] Thickness slider changes colors
- [ ] Animation smooth (for soap bubble)
- [ ] Color matches thin-film interference physics
- [ ] Layer count affects AR coating

---

### 2.4 Anisotropic Materials (4 Screenshots)

Navigate to: **Advanced → AnisotropicMaterials**

| Material | Expected Pattern | Capture Filename |
|----------|------------------|------------------|
| Brushed Aluminum | Linear highlights | `aniso_brushed_aluminum.png` |
| Brushed Steel | Directional sheen | `aniso_brushed_steel.png` |
| Hair/Fiber | Strand-like reflections | `aniso_hair.png` |
| Silk/Satin | Soft anisotropic glow | `aniso_silk.png` |

**Verification Points:**
- [ ] Highlight direction follows brush angle
- [ ] Roughness X vs Y values displayed
- [ ] Anisotropy ratio shown
- [ ] Animation demonstrates directional reflection

---

### 2.5 Subsurface Materials (4 Screenshots)

Navigate to: **Advanced → SubsurfaceMaterials**

| Material | Expected Appearance | MFP | Capture Filename |
|----------|---------------------|-----|------------------|
| Skin | Warm translucency | 0.7-1.2mm | `sss_skin.png` |
| Marble | Cool, deep glow | 8.0mm | `sss_marble.png` |
| Wax | Yellow-warm glow | 3.0mm | `sss_wax.png` |
| Jade | Green translucency | 5.0mm | `sss_jade.png` |

**Verification Points:**
- [ ] Backlight intensity affects glow
- [ ] Mean Free Path value displayed
- [ ] Quality tier selector works
- [ ] Certification level badge shows

---

### 2.6 Quality Tiers (3 Screenshots)

Navigate to: **Context → RenderContext**

| Tier | Resolution | Expected Difference | Capture Filename |
|------|------------|---------------------|------------------|
| Mobile | 375×667 | Simpler blur, faster | `tier_mobile.png` |
| Desktop | 1920×1080 | Full quality | `tier_desktop.png` |
| 4K | 3840×2160 | Maximum detail | `tier_4k.png` |

**Verification Points:**
- [ ] Same material looks different per tier
- [ ] Mobile has reduced complexity
- [ ] 4K shows enhanced detail
- [ ] CSS output differs per tier

---

### 2.7 Elevation Shadows (1 Screenshot)

Navigate to: **Shadows → ElevationShadows**

| Elevation | Expected Shadow | Capture Filename |
|-----------|-----------------|------------------|
| Level 0-6 | Progressive shadow depth | `shadows_elevation_levels.png` |

**Verification Points:**
- [ ] Slider changes shadow depth
- [ ] Shadow color adapts to background
- [ ] 6 distinct elevation levels visible

---

### 2.8 Performance Demo (1 Screenshot)

Navigate to: **Advanced → HighPerformance → MassPanelBenchmark**

| Metric | Expected | Capture Filename |
|--------|----------|------------------|
| 500 panels | 60 FPS, <3ms eval | `performance_500_panels.png` |

**Verification Points:**
- [ ] FPS counter shows 60 FPS
- [ ] Evaluation time < 5ms
- [ ] Per-panel time displayed
- [ ] Animation smooth

---

## 3. Interactive Verification

### 3.1 Parameter Changes

For each material story, verify:

| Control | Expected Behavior |
|---------|-------------------|
| IOR slider | Visual refraction change |
| Roughness slider | Blur/sharpness change |
| Thickness slider | Transparency change |
| Color picker | Base color change |
| Quality tier | CSS output change |

### 3.2 Real-Time Updates

- [ ] Parameter changes update preview immediately
- [ ] No flickering or lag
- [ ] CSS code panel updates in sync

---

## 4. Screenshot Capture Instructions

### 4.1 Browser Settings

```
Resolution: 1920×1080 (or viewport size)
DevTools: Closed
Zoom: 100%
```

### 4.2 Capture Method

**macOS:**
```bash
# Full window
Cmd + Shift + 4, then Space, click window

# Selected area
Cmd + Shift + 4, drag selection
```

**Save to:**
```
/Users/oscarvalois/Documents/Github/momoto-ui/momoto/crates/momoto-materials/docs/ASSURANCE/screenshots/
```

### 4.3 Naming Convention

```
{category}_{material}_{feature}.png

Examples:
- glass_clear_preset.png
- metal_gold.png
- thinfilm_soap_bubble.png
- sss_skin.png
- tier_mobile.png
```

---

## 5. Required Screenshots Summary

### 5.1 Minimum Required (20 Screenshots)

| Category | Count | Files |
|----------|-------|-------|
| Glass Presets | 4 | clear, regular, thick, frosted |
| Metal Materials | 6 | gold, silver, copper, aluminum, titanium, iron |
| Thin-Film | 3 | soap, oil, ar_coating |
| Anisotropic | 4 | brushed_al, brushed_steel, hair, silk |
| Subsurface | 4 | skin, marble, wax, jade |
| Quality Tiers | 3 | mobile, desktop, 4k |
| Shadows | 1 | elevation_levels |
| Performance | 1 | 500_panels |
| **Total** | **26** | |

### 5.2 Optional Additional

| Category | Files |
|----------|-------|
| Experimental | breathing, audio, touch, generative |
| Crystal | quartz, prism, rainbow |
| Builder | custom configuration |

---

## 6. Validation Checklist

### 6.1 Pre-Capture

- [ ] Storybook running at localhost:6006
- [ ] All stories load without errors
- [ ] WASM module initialized (no console errors)
- [ ] Browser at 100% zoom

### 6.2 During Capture

- [ ] Preview panel fully visible
- [ ] Controls panel visible (where applicable)
- [ ] No loading spinners
- [ ] Material fully rendered

### 6.3 Post-Capture

- [ ] All 26 screenshots captured
- [ ] Files saved to screenshots/ directory
- [ ] Names follow convention
- [ ] Images are clear and legible

---

## 7. Visual Validation Criteria

### 7.1 Pass Criteria

| Criterion | Requirement |
|-----------|-------------|
| Fresnel edge glow | Visible on all glass materials |
| Specular highlights | Positioned, not clipped |
| Color accuracy | Matches expected for material |
| Blur quality | Smooth, no banding |
| Animation | 60 FPS, no stuttering |
| Controls | All sliders functional |

### 7.2 Fail Criteria

| Issue | Severity |
|-------|----------|
| WASM load failure | BLOCKER |
| Missing materials | CRITICAL |
| Broken animations | MAJOR |
| Wrong colors | MAJOR |
| UI glitches | MINOR |

---

## 8. Post-Validation Report

After capturing screenshots, update this section:

### 8.1 Capture Status

```
[ ] All 26 screenshots captured
[ ] Files saved to correct directory
[ ] Visual inspection passed
```

### 8.2 Issues Found

```
(Document any visual issues here)
```

### 8.3 Validation Verdict

```
[ ] PASS - All materials visually validated
[ ] PASS WITH CAVEATS - Minor issues noted
[ ] FAIL - Critical visual issues
```

---

## 9. Screenshot Directory Structure

```
docs/ASSURANCE/screenshots/
├── glass_clear_preset.png
├── glass_regular_preset.png
├── glass_thick_preset.png
├── glass_frosted_preset.png
├── metal_gold.png
├── metal_silver.png
├── metal_copper.png
├── metal_aluminum.png
├── metal_titanium.png
├── metal_iron.png
├── thinfilm_soap_bubble.png
├── thinfilm_oil_slick.png
├── thinfilm_ar_coating.png
├── aniso_brushed_aluminum.png
├── aniso_brushed_steel.png
├── aniso_hair.png
├── aniso_silk.png
├── sss_skin.png
├── sss_marble.png
├── sss_wax.png
├── sss_jade.png
├── tier_mobile.png
├── tier_desktop.png
├── tier_4k.png
├── shadows_elevation_levels.png
└── performance_500_panels.png
```

---

## 10. Conclusion

This document provides a complete visual validation checklist for the Momoto Materials Storybook.

**Next Steps:**
1. Start Storybook (`npm run storybook`)
2. Open `http://localhost:6006/`
3. Navigate to each story
4. Capture screenshots per checklist
5. Update Post-Validation Report section
6. Mark validation as PASS/FAIL

**Status:** CHECKLIST PREPARED - AWAITING SCREENSHOT CAPTURE

---

*End of Storybook Visual Validation Report*
