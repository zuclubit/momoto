# Momoto MCP Context Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that gives AI assistants deep, specialized context about the Momoto chromatic intelligence WASM engine.

## Tools

| Tool | Description |
|------|-------------|
| `search_momoto_api` | Search functions/classes by name or keyword |
| `get_function_docs` | Complete docs for a specific function/class |
| `list_modules` | All modules with summary and function counts |
| `get_examples` | Runnable code examples (optionally filtered) |
| `get_physics_constants` | WCAG, APCA, metal IOR, SIREN architecture constants |
| `validate_usage` | Check code for common Momoto API mistakes |

## Resources

| URI | Description |
|-----|-------------|
| `momoto://api/full` | Complete JSON API spec (momoto.json) |
| `momoto://api/llms` | LLM-optimised summary (llms.txt) |

## Setup

### Build

```bash
cd docs/mcp
npm install
npm run build
```

### Claude Desktop

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "momoto": {
      "command": "node",
      "args": ["/absolute/path/to/momoto-ui/docs/mcp/server.js"]
    }
  }
}
```

### Direct (stdio)

```bash
npx ts-node docs/mcp/server.ts
```

## Example Interactions

**User → Claude with momoto MCP:**

> "How do I generate a Material Design 3 tonal palette from a brand color?"

Claude calls `get_function_docs("hctTonalPalette")` and `get_examples("hct")` to provide accurate, working code.

> "Is my WCAG contrast check code correct? `wcagPasses(ratio, 'AA', false)`"

Claude calls `validate_usage(code)` → returns warning: second arg must be `0` (AA) or `1` (AAA), not a string.

> "What is the SIREN neural network architecture?"

Claude calls `get_physics_constants("siren")` → returns layers [9,16,16,3], 483 params, ω₀=30, etc.
