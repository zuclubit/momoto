/**
 * Momoto Engine — Node.js: Accessibility Audit Server
 * Uses the WASM engine server-side to audit design tokens.
 *
 * Usage: node server-audit.mjs
 * Requires: npm install momoto-wasm
 */
import { createServer } from 'node:http';
import init, {
  Color, wcagContrastRatio, wcagPasses, wcagLevel, apcaContrast,
  agentValidatePairsBatch, generateReport,
  selfCertify
} from 'momoto-wasm';

// Initialize once at startup
await init();
console.log('Momoto WASM engine loaded');

const cert = JSON.parse(selfCertify());
console.log(`Engine certified: ${cert.passed ? '✅' : '❌'} (${cert.tests} tests)`);

// ── Audit a set of design tokens ──────────────────────────────────────────
function auditTokens(tokens) {
  const results = [];
  for (const { name, fg, bg, usage } of tokens) {
    const fgC = Color.fromHex(fg);
    const bgC = Color.fromHex(bg);
    const ratio = wcagContrastRatio(fgC, bgC);
    const apca  = Math.abs(apcaContrast(fgC, bgC));
    const level = wcagLevel(ratio, false);
    const passesAA = wcagPasses(ratio, 0, false);
    const passesAAA = wcagPasses(ratio, 1, false);
    const passesApca = apca >= (usage === 'body' ? 75 : usage === 'heading' ? 60 : 45);

    results.push({
      name, fg, bg, usage,
      wcag: { ratio: +ratio.toFixed(2), level, passesAA, passesAAA },
      apca: { lc: +apca.toFixed(1), passes: passesApca },
      compliant: passesAA && passesApca
    });
  }
  return results;
}

// ── HTTP Server ────────────────────────────────────────────────────────────
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // GET /health
  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', engine: 'momoto-wasm@7.0.0', certified: cert.passed }));
    return;
  }

  // POST /audit  — { tokens: [{name, fg, bg, usage}] }
  if (req.method === 'POST' && url.pathname === '/audit') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { tokens } = JSON.parse(body);
        const results = auditTokens(tokens);
        const summary = {
          total: results.length,
          compliant: results.filter(r => r.compliant).length,
          failures: results.filter(r => !r.compliant).map(r => r.name)
        };
        res.writeHead(200);
        res.end(JSON.stringify({ summary, results }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // POST /report  — { colors: ["#hex",...], type: "wcag"|"apca"|"cvd"|"full" }
  if (req.method === 'POST' && url.pathname === '/report') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { colors, type = 'full' } = JSON.parse(body);
        const report = JSON.parse(generateReport(JSON.stringify(colors), type));
        res.writeHead(200);
        res.end(JSON.stringify(report));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3737, () => {
  console.log('Momoto audit server listening on http://localhost:3737');
  console.log('  POST /audit  — audit design token pairs');
  console.log('  POST /report — generate accessibility report');
  console.log('  GET  /health — engine health check');
});

// ── Example usage (inline test) ───────────────────────────────────────────
const testTokens = [
  { name: 'text-primary',    fg: '#e8eaf6', bg: '#07070e', usage: 'body'    },
  { name: 'text-secondary',  fg: '#a0aec0', bg: '#07070e', usage: 'heading' },
  { name: 'text-disabled',   fg: '#4a5568', bg: '#07070e', usage: 'label'   },
  { name: 'link-default',    fg: '#6188d8', bg: '#ffffff', usage: 'body'    },
  { name: 'badge-warning',   fg: '#fbbf24', bg: '#ffffff', usage: 'label'   }, // likely fails
];

console.log('\n=== Token Audit ===');
const results = auditTokens(testTokens);
for (const r of results) {
  const icon = r.compliant ? '✅' : '❌';
  console.log(`${icon} ${r.name}: WCAG ${r.wcag.ratio}:1 (${r.wcag.level}), APCA ${r.apca.lc} Lc`);
}
