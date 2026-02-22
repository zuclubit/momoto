/**
 * @momoto-ui/figma — Figma Plugin (main thread)
 *
 * Features:
 * - Audit selected layers for WCAG/APCA contrast
 * - Generate HCT tonal palettes from selection
 * - Simulate CVD on selected frames
 * - Apply accessible foreground colors
 * - Export design tokens as CSS custom properties
 *
 * Architecture: This file runs in Figma's main thread (no DOM access).
 * Heavy computation is offloaded to the UI iframe which loads the WASM.
 */

figma.showUI(__html__, { width: 420, height: 600, themeColors: true })

// ── Message handlers ──────────────────────────────────────────────────────
figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case 'audit-selection':    await auditSelection(); break
    case 'apply-foreground':   await applyForeground(msg.hex, msg.nodeId); break
    case 'apply-palette':      await applyPalette(msg.palette); break
    case 'export-tokens':      await exportTokens(); break
    case 'get-selection':      sendSelection(); break
    case 'close':              figma.closePlugin(); break
  }
}

// ── Audit selected layers ─────────────────────────────────────────────────
async function auditSelection() {
  const nodes = figma.currentPage.selection
  if (nodes.length === 0) {
    figma.ui.postMessage({ type: 'error', message: 'No layers selected. Select text or frames to audit.' })
    return
  }

  const pairs: ColorPair[] = []

  for (const node of nodes) {
    if ('fills' in node && 'parent' in node) {
      const fg = getNodeColor(node)
      const bg = getParentBackground(node)
      if (fg && bg) {
        pairs.push({ nodeId: node.id, name: node.name, fg, bg })
      }
    }
  }

  figma.ui.postMessage({ type: 'audit-pairs', pairs })
}

// ── Apply recommended foreground color ───────────────────────────────────
async function applyForeground(hex: string, nodeId: string) {
  const node = await figma.getNodeByIdAsync(nodeId) as TextNode | null
  if (!node || node.type !== 'TEXT') return

  const [r, g, b] = hexToRgb(hex)
  node.fills = [{ type: 'SOLID', color: { r, g, b } }]
  figma.notify(`Applied ${hex} to "${node.name}"`)
}

// ── Apply tonal palette as local styles ───────────────────────────────────
async function applyPalette(palette: Array<{ name: string; hex: string }>) {
  for (const { name, hex } of palette) {
    const [r, g, b] = hexToRgb(hex)
    let style = figma.getLocalPaintStyles().find(s => s.name === `Momoto/${name}`)
    if (!style) style = figma.createPaintStyle()
    style.name = `Momoto/${name}`
    style.paints = [{ type: 'SOLID', color: { r, g, b } }]
  }
  figma.notify(`Applied ${palette.length} color styles`)
}

// ── Export tokens as CSS ──────────────────────────────────────────────────
async function exportTokens() {
  const styles = figma.getLocalPaintStyles()
  let css = '/* Momoto Design Tokens — exported from Figma */\n:root {\n'
  for (const style of styles) {
    const paint = style.paints[0]
    if (paint?.type === 'SOLID') {
      const hex = rgbToHex(paint.color.r, paint.color.g, paint.color.b)
      const varName = '--color-' + style.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      css += `  ${varName}: ${hex};\n`
    }
  }
  css += '}'
  figma.ui.postMessage({ type: 'tokens-css', css })
}

// ── Send current selection to UI ──────────────────────────────────────────
function sendSelection() {
  const nodes = figma.currentPage.selection.map(n => ({
    id: n.id,
    name: n.name,
    type: n.type,
    fg: 'fills' in n ? getNodeColor(n as SceneNode & { fills: ReadonlyArray<Paint> }) : null,
    bg: getParentBackground(n),
  }))
  figma.ui.postMessage({ type: 'selection', nodes })
}

figma.on('selectionchange', sendSelection)

// ── Utilities ─────────────────────────────────────────────────────────────
function getNodeColor(node: SceneNode & { fills: ReadonlyArray<Paint> }): string | null {
  const fill = node.fills[0]
  if (fill?.type === 'SOLID') return rgbToHex(fill.color.r, fill.color.g, fill.color.b)
  return null
}

function getParentBackground(node: SceneNode): string | null {
  let current = node.parent
  while (current && current.type !== 'PAGE') {
    if ('fills' in current) {
      const fill = (current as FrameNode).fills[0]
      if (fill?.type === 'SOLID') return rgbToHex(fill.color.r, fill.color.g, fill.color.b)
    }
    current = current.parent
  }
  return '#ffffff' // default white background
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

// ── Message types ─────────────────────────────────────────────────────────
interface ColorPair  { nodeId: string; name: string; fg: string; bg: string }
interface PluginMessage {
  type: string
  hex?: string
  nodeId?: string
  palette?: Array<{ name: string; hex: string }>
}
