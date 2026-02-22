#!/usr/bin/env node
/**
 * Momoto Engine MCP Context Server
 *
 * A Model Context Protocol (MCP) server that gives AI assistants and tools
 * specialized, deep context about the Momoto WASM API.
 *
 * Tools exposed:
 *  - search_momoto_api    Search functions/classes by name or keyword
 *  - get_function_docs    Get complete documentation for a specific function
 *  - list_modules         List all modules with summary
 *  - get_examples         Get runnable code examples
 *  - get_physics_constants Get physical/algorithm constants
 *  - validate_usage       Check if a usage pattern is correct
 *
 * Resources exposed:
 *  - momoto://api/full    Complete API spec (momoto.json)
 *  - momoto://api/llms    LLM-optimised summary (llms.txt)
 *
 * Usage:
 *   npx ts-node docs/mcp/server.ts
 *   # or compile: npx tsc docs/mcp/server.ts && node docs/mcp/server.js
 *
 * Claude Desktop config (~/.claude/claude_desktop_config.json):
 * {
 *   "mcpServers": {
 *     "momoto": {
 *       "command": "node",
 *       "args": ["/path/to/momoto-ui/docs/mcp/server.js"]
 *     }
 *   }
 * }
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── MCP Protocol Types ─────────────────────────────────────────────────────

interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

// ── Load API spec ──────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_SPEC_PATH = join(__dirname, '../api/momoto.json');
const LLMS_TXT_PATH = join(__dirname, '../api/llms.txt');

let apiSpec: Record<string, unknown>;
try {
  apiSpec = JSON.parse(readFileSync(API_SPEC_PATH, 'utf-8'));
} catch {
  apiSpec = {};
  process.stderr.write('Warning: Could not load momoto.json\n');
}

let llmsTxt = '';
try {
  llmsTxt = readFileSync(LLMS_TXT_PATH, 'utf-8');
} catch {
  process.stderr.write('Warning: Could not load llms.txt\n');
}

// ── Flat function index for search ────────────────────────────────────────

interface FunctionEntry {
  module: string;
  name: string;
  type: 'function' | 'class' | 'method' | 'property';
  signature: string;
  description: string;
  params?: Record<string, string>;
  returns?: string;
  example?: string;
  standard?: string;
}

const FUNCTION_INDEX: FunctionEntry[] = buildIndex();

function buildIndex(): FunctionEntry[] {
  const entries: FunctionEntry[] = [];
  const modules = (apiSpec as any)?.modules ?? {};

  for (const [modKey, mod] of Object.entries(modules) as [string, any][]) {
    // Free functions
    for (const fn of mod.functions ?? []) {
      entries.push({
        module: modKey,
        name: fn.name,
        type: 'function',
        signature: fn.signature,
        description: fn.description ?? '',
        params: fn.params,
        returns: fn.returns,
        example: fn.example,
        standard: fn.standard,
      });
    }
    // Classes
    for (const [className, cls] of Object.entries(mod.classes ?? {}) as [string, any][]) {
      entries.push({
        module: modKey,
        name: className,
        type: 'class',
        signature: cls.constructors?.[0]?.signature ?? className,
        description: cls.description ?? '',
        example: cls.constructors?.[0]?.example,
      });
      // Methods
      for (const method of cls.methods ?? []) {
        entries.push({
          module: modKey,
          name: `${className}.${method.name}`,
          type: 'method',
          signature: method.signature,
          description: method.description ?? '',
          params: method.params,
          returns: method.returns,
          example: method.example,
        });
      }
      // Static methods
      for (const method of cls.staticMethods ?? []) {
        entries.push({
          module: modKey,
          name: `${className}.${method.name} (static)`,
          type: 'method',
          signature: method.signature,
          description: method.description ?? '',
          example: method.example,
        });
      }
    }
  }
  return entries;
}

// ── Tool Implementations ───────────────────────────────────────────────────

function searchMomotoApi(query: string, module?: string): string {
  const q = query.toLowerCase();
  let results = FUNCTION_INDEX.filter(e => {
    if (module && e.module !== module) return false;
    return (
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.signature.toLowerCase().includes(q)
    );
  });

  if (results.length === 0) {
    return `No results found for "${query}"${module ? ` in module "${module}"` : ''}.`;
  }

  const lines: string[] = [`Found ${results.length} result(s) for "${query}":\n`];
  for (const r of results.slice(0, 20)) {
    lines.push(`## [${r.module}] ${r.name} (${r.type})`);
    lines.push(`\`${r.signature}\``);
    lines.push(r.description);
    if (r.returns) lines.push(`**Returns:** ${r.returns}`);
    lines.push('');
  }
  if (results.length > 20) {
    lines.push(`... and ${results.length - 20} more. Narrow your search.`);
  }
  return lines.join('\n');
}

function getFunctionDocs(name: string): string {
  const entry = FUNCTION_INDEX.find(e =>
    e.name.toLowerCase() === name.toLowerCase() ||
    e.name.toLowerCase().includes(name.toLowerCase())
  );

  if (!entry) {
    return `Function "${name}" not found. Try searchMomotoApi to discover available functions.`;
  }

  const lines: string[] = [];
  lines.push(`# ${entry.name}`);
  lines.push(`**Module:** \`${entry.module}\` | **Type:** ${entry.type}\n`);
  lines.push(`## Signature`);
  lines.push(`\`\`\`typescript\n${entry.signature}\n\`\`\``);
  lines.push(`\n## Description`);
  lines.push(entry.description);
  if (entry.standard) {
    lines.push(`\n**Standard:** ${entry.standard}`);
  }
  if (entry.params && Object.keys(entry.params).length > 0) {
    lines.push(`\n## Parameters`);
    for (const [param, desc] of Object.entries(entry.params)) {
      lines.push(`- \`${param}\`: ${desc}`);
    }
  }
  if (entry.returns) {
    lines.push(`\n## Returns\n${entry.returns}`);
  }
  if (entry.example) {
    lines.push(`\n## Example`);
    lines.push(`\`\`\`javascript\n${entry.example}\n\`\`\``);
  }

  // Cross-reference related functions
  const related = FUNCTION_INDEX.filter(e =>
    e.module === entry.module &&
    e.name !== entry.name
  ).slice(0, 5);
  if (related.length > 0) {
    lines.push(`\n## Related (${entry.module} module)`);
    for (const r of related) {
      lines.push(`- \`${r.name}\`: ${r.description.slice(0, 80)}${r.description.length > 80 ? '…' : ''}`);
    }
  }

  return lines.join('\n');
}

function listModules(): string {
  const modules = (apiSpec as any)?.modules ?? {};
  const lines: string[] = ['# Momoto Engine Modules\n'];

  for (const [key, mod] of Object.entries(modules) as [string, any][]) {
    const fnCount = (mod.functions ?? []).length;
    const classCount = Object.keys(mod.classes ?? {}).length;
    lines.push(`## \`${key}\``);
    lines.push(mod.description ?? '');
    lines.push(`Functions: ${fnCount} | Classes: ${classCount}`);

    const topFns = [...(mod.functions ?? []).slice(0, 3), ...Object.keys(mod.classes ?? {}).slice(0, 2)];
    if (topFns.length > 0) {
      lines.push(`Key API: ${topFns.join(', ')}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function getExamples(topic?: string): string {
  const examples = (apiSpec as any)?.quickstartExamples ?? [];

  if (!topic) {
    return examples.map((ex: any) => [
      `## ${ex.title}`,
      ex.description,
      '```javascript',
      ex.code,
      '```',
    ].join('\n')).join('\n\n');
  }

  const q = topic.toLowerCase();
  const filtered = examples.filter((ex: any) =>
    ex.title.toLowerCase().includes(q) ||
    ex.description.toLowerCase().includes(q) ||
    ex.code.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    return `No examples found for "${topic}". Available topics: WCAG, HCT, BRDF, CVD, temporal, SIREN, soap bubble.`;
  }

  return filtered.map((ex: any) => [
    `## ${ex.title}`,
    ex.description,
    '```javascript',
    ex.code,
    '```',
  ].join('\n')).join('\n\n');
}

function getPhysicsConstants(domain?: string): string {
  const constants = (apiSpec as any)?.physicsConstants ?? {};

  if (domain) {
    const section = constants[domain.toLowerCase()];
    if (!section) {
      return `Domain "${domain}" not found. Available: ${Object.keys(constants).join(', ')}`;
    }
    return `# ${domain} Constants\n\n\`\`\`json\n${JSON.stringify(section, null, 2)}\n\`\`\``;
  }

  const lines = ['# Momoto Physics Constants\n'];
  for (const [key, val] of Object.entries(constants)) {
    lines.push(`## ${key}`);
    lines.push(`\`\`\`json\n${JSON.stringify(val, null, 2)}\n\`\`\``);
    lines.push('');
  }
  return lines.join('\n');
}

function validateUsage(code: string): string {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check for init() call
  if (code.includes('momoto-wasm') || code.includes('momoto_wasm')) {
    if (!code.includes('await init()') && !code.includes('init()')) {
      issues.push('Missing `await init()` — WASM must be initialized before use.');
    }
  }

  // Check for common API mistakes
  if (code.includes('wcagPasses(') && !code.match(/wcagPasses\([^,]+,\s*[01]\s*,/)) {
    warnings.push('wcagPasses: second argument should be 0 (AA) or 1 (AAA), not a string.');
  }

  if (code.includes('hctTonalPalette(') && !code.includes('[i*3]')) {
    warnings.push('hctTonalPalette returns a flat Float64Array of 39 values (13 HCT triples). Access via palette[i*3], palette[i*3+1], palette[i*3+2].');
  }

  if (code.includes('computeSirenCorrection(') && !code.includes('await init')) {
    warnings.push('Ensure `await init()` is called before computeSirenCorrection().');
  }

  if (code.includes('simulateCVD(') && !code.match(/simulateCVD\([^,]+,\s*'(protanopia|deuteranopia|tritanopia)'/)) {
    warnings.push('simulateCVD: cvdType must be "protanopia", "deuteranopia", or "tritanopia".');
  }

  if (code.includes('evalAtTime(') && !code.includes('[0]')) {
    warnings.push('evalAtTime returns Float64Array [reflectance, transmittance, absorption]. Access via result[0] etc.');
  }

  const result: string[] = [];
  if (issues.length > 0) {
    result.push('## ❌ Issues (must fix)');
    issues.forEach(i => result.push(`- ${i}`));
  }
  if (warnings.length > 0) {
    result.push('\n## ⚠️ Warnings');
    warnings.forEach(w => result.push(`- ${w}`));
  }
  if (issues.length === 0 && warnings.length === 0) {
    result.push('✅ No obvious issues found in the code pattern.');
  }

  return result.join('\n');
}

// ── MCP Server ─────────────────────────────────────────────────────────────

const SERVER_INFO = {
  name: 'momoto-context-server',
  version: '1.0.0',
  description: 'Specialized context server for the Momoto chromatic intelligence WASM engine',
};

const TOOLS = [
  {
    name: 'search_momoto_api',
    description: 'Search Momoto WASM API by function name, keyword, or description. Returns matching functions/classes with signatures and descriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (e.g. "contrast", "hct", "brdf", "thin film")' },
        module: { type: 'string', description: 'Optional: filter by module (hct|core|intelligence|materials|temporal|procedural|siren|events|agent)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_function_docs',
    description: 'Get complete documentation for a specific Momoto function or class, including signature, parameters, return type, example, and related functions.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Function or class name (e.g. "cookTorranceBRDF", "HCT", "hctTonalPalette")' },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_modules',
    description: 'List all Momoto WASM modules with descriptions, function counts, and key API surface.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_examples',
    description: 'Get runnable JavaScript/TypeScript code examples for Momoto. Optionally filter by topic.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Optional topic filter (e.g. "wcag", "hct", "brdf", "soap bubble", "siren")' },
      },
    },
  },
  {
    name: 'get_physics_constants',
    description: 'Get physics and algorithm constants used by Momoto (WCAG thresholds, APCA Lc values, metal IOR, color space ranges, SIREN architecture).',
    inputSchema: {
      type: 'object',
      properties: {
        domain: { type: 'string', description: 'Optional domain: wcag|apca|colorSpaces|thinFilm|conductors|siren' },
      },
    },
  },
  {
    name: 'validate_usage',
    description: 'Validate a Momoto API usage pattern for common mistakes (missing init(), wrong argument types, incorrect return value access).',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'JavaScript/TypeScript code snippet to validate' },
      },
      required: ['code'],
    },
  },
];

const RESOURCES = [
  {
    uri: 'momoto://api/full',
    name: 'Momoto Full API Specification',
    description: 'Complete machine-readable API spec (momoto.json): all modules, functions, parameters, return types, examples.',
    mimeType: 'application/json',
  },
  {
    uri: 'momoto://api/llms',
    name: 'Momoto LLM Context (llms.txt)',
    description: 'Concise LLM-optimised API summary following llms.txt standard.',
    mimeType: 'text/plain',
  },
];

// ── Request Handler ────────────────────────────────────────────────────────

function handleRequest(req: MCPRequest): MCPResponse {
  const respond = (result: unknown): MCPResponse => ({
    jsonrpc: '2.0',
    id: req.id,
    result,
  });

  const error = (code: number, message: string): MCPResponse => ({
    jsonrpc: '2.0',
    id: req.id,
    error: { code, message },
  });

  switch (req.method) {
    case 'initialize':
      return respond({
        protocolVersion: '2024-11-05',
        capabilities: { tools: {}, resources: { read: true } },
        serverInfo: SERVER_INFO,
      });

    case 'tools/list':
      return respond({ tools: TOOLS });

    case 'resources/list':
      return respond({ resources: RESOURCES });

    case 'resources/read': {
      const uri = (req.params as any)?.uri as string;
      if (uri === 'momoto://api/full') {
        return respond({
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(apiSpec, null, 2),
          }],
        });
      }
      if (uri === 'momoto://api/llms') {
        return respond({
          contents: [{ uri, mimeType: 'text/plain', text: llmsTxt }],
        });
      }
      return error(-32602, `Unknown resource: ${uri}`);
    }

    case 'tools/call': {
      const toolName = (req.params as any)?.name as string;
      const args = (req.params as any)?.arguments ?? {};

      let text: string;
      switch (toolName) {
        case 'search_momoto_api':
          text = searchMomotoApi(args.query as string, args.module as string | undefined);
          break;
        case 'get_function_docs':
          text = getFunctionDocs(args.name as string);
          break;
        case 'list_modules':
          text = listModules();
          break;
        case 'get_examples':
          text = getExamples(args.topic as string | undefined);
          break;
        case 'get_physics_constants':
          text = getPhysicsConstants(args.domain as string | undefined);
          break;
        case 'validate_usage':
          text = validateUsage(args.code as string);
          break;
        default:
          return error(-32602, `Unknown tool: ${toolName}`);
      }

      return respond({
        content: [{ type: 'text', text }],
        isError: false,
      });
    }

    case 'ping':
      return respond({});

    default:
      return error(-32601, `Method not found: ${req.method}`);
  }
}

// ── STDIO Transport ────────────────────────────────────────────────────────

process.stdin.setEncoding('utf-8');

let buffer = '';
process.stdin.on('data', (chunk: string) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop() ?? '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const req: MCPRequest = JSON.parse(trimmed);
      const response = handleRequest(req);
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (e) {
      const errorResponse: MCPResponse = {
        jsonrpc: '2.0',
        id: 0,
        error: { code: -32700, message: 'Parse error', data: String(e) },
      };
      process.stdout.write(JSON.stringify(errorResponse) + '\n');
    }
  }
});

process.stdin.on('end', () => process.exit(0));
process.stderr.write(`Momoto MCP Context Server v${SERVER_INFO.version} started\n`);
process.stderr.write(`Loaded ${FUNCTION_INDEX.length} API entries from ${Object.keys((apiSpec as any)?.modules ?? {}).length} modules\n`);
