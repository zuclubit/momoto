/**
 * @fileoverview Contract Verification Script
 *
 * FASE 14: Core Consolidation & Governance
 *
 * Automated contract enforcement for "Momoto decide, momoto-ui ejecuta".
 * Scans codebase for violations and blocks commits if found.
 *
 * @module momoto-ui/scripts/verify-contract
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// ============================================================================
// TYPES
// ============================================================================

interface Violation {
  file: string;
  line: number;
  code: string;
  message: string;
  severity: 'error' | 'warning';
  pattern: string;
}

interface ComponentResult {
  component: string;
  violations: Violation[];
  passed: boolean;
}

interface VerificationReport {
  passed: boolean;
  totalViolations: number;
  components: ComponentResult[];
  timestamp: string;
}

// ============================================================================
// PROHIBITED PATTERNS
// ============================================================================

const PROHIBITED_PATTERNS = {
  // Perceptual logic (FORBIDDEN)
  perceptualLogic: [
    {
      pattern: /\b(isDark|isLight|isWarm|isCool)\b/,
      message: 'Perceptual decision detected (isDark/isLight/isWarm/isCool)',
      code: 'PERCEPTUAL_LOGIC',
    },
    {
      pattern: /\b(getBrightness|getLuminance|getChroma)\b(?!\s*\(.*Momoto)/,
      message: 'Local perceptual calculation (must use Momoto)',
      code: 'LOCAL_CALCULATION',
    },
  ],

  // Color calculations (FORBIDDEN outside Momoto WASM)
  colorCalculations: [
    {
      pattern: /\b(lighten|darken|saturate|desaturate)\b(?!.*\.lighten|.*\.darken|.*\.saturate|.*\.desaturate)/,
      message: 'Color transformation outside Momoto WASM',
      code: 'COLOR_TRANSFORMATION',
    },
    {
      pattern: /\b(interpolate|mix|blend)\b(?!.*Momoto)/,
      message: 'Color mixing/interpolation (must use Momoto)',
      code: 'COLOR_MIXING',
    },
  ],

  // Contrast calculations (FORBIDDEN - must use token metadata)
  contrastCalculations: [
    {
      pattern: /\b(getContrastRatio|calculateContrast|checkContrast)\b/,
      message: 'Local contrast calculation (use token.accessibility metadata)',
      code: 'CONTRAST_CALCULATION',
    },
    {
      pattern: /\bWCAG\s*[A-Z]{2,3}\b(?!.*token\.accessibility)/,
      message: 'WCAG check without token metadata',
      code: 'WCAG_CHECK',
    },
  ],

  // Hardcoded colors (FORBIDDEN in components/core)
  hardcodedColors: [
    {
      pattern: /#[0-9A-Fa-f]{3,6}\b/,
      message: 'Hardcoded color value (must use EnrichedToken)',
      code: 'HARDCODED_COLOR',
    },
    {
      pattern: /rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/,
      message: 'Hardcoded RGB value (must use EnrichedToken)',
      code: 'HARDCODED_RGB',
    },
  ],

  // Magic numbers for perceptual thresholds (FORBIDDEN)
  magicNumbers: [
    {
      pattern: /contrast\s*[><=]+\s*\d+(\.\d+)?/,
      message: 'Magic number for contrast threshold',
      code: 'MAGIC_THRESHOLD',
    },
    {
      pattern: /brightness\s*[><=]+\s*\d+(\.\d+)?/,
      message: 'Magic number for brightness threshold',
      code: 'MAGIC_THRESHOLD',
    },
  ],
};

// ============================================================================
// EXCEPTIONS (ALLOWED)
// ============================================================================

const ALLOWED_PATTERNS = [
  // Momoto WASM operations are ALLOWED
  /PerceptualColor\.(lighten|darken|saturate|desaturate)/,
  /await\s+.*\.(lighten|darken|saturate|desaturate)/,

  // Token metadata access is ALLOWED
  /token\.accessibility\.(wcagRatio|passesAA|passesAAA)/,

  // Comments and documentation are ALLOWED
  /\/\//,
  /\/\*/,
  /\*\//,

  // Test files can have hardcoded values
  /\.test\.|\.spec\.|__tests__|__mocks__/,

  // Constants files for size/spacing are ALLOWED
  /constants\.ts.*SIZE_CONFIG/,
  /constants\.ts.*BORDER_RADIUS/,
];

// Files to skip
const SKIP_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/__tests__/**',
  '**/__mocks__/**',
  '**/docs/**',
  '**/scripts/**', // Don't scan this file!
];

// ============================================================================
// SCANNER
// ============================================================================

/**
 * Check if a line is allowed (exception).
 */
function isAllowedPattern(line: string, filePath: string): boolean {
  // Check file-level exceptions
  if (SKIP_PATTERNS.some(pattern => filePath.includes(pattern))) {
    return true;
  }

  // Check line-level exceptions
  return ALLOWED_PATTERNS.some(pattern => pattern.test(line));
}

/**
 * Scan a file for contract violations.
 */
function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Skip if line is allowed
    if (isAllowedPattern(line, filePath)) {
      return;
    }

    // Check all prohibited patterns
    Object.entries(PROHIBITED_PATTERNS).forEach(([category, patterns]) => {
      patterns.forEach(({ pattern, message, code }) => {
        if (pattern.test(line)) {
          violations.push({
            file: filePath,
            line: lineNumber,
            code,
            message,
            severity: 'error',
            pattern: pattern.toString(),
          });
        }
      });
    });
  });

  return violations;
}

/**
 * Scan a component directory.
 */
async function scanComponent(componentPath: string): Promise<ComponentResult> {
  const componentName = path.basename(componentPath);

  // Find all TypeScript/TSX files in component
  const files = await glob(`${componentPath}/**/*.{ts,tsx}`, {
    ignore: SKIP_PATTERNS,
  });

  const allViolations: Violation[] = [];

  files.forEach(file => {
    const violations = scanFile(file);
    allViolations.push(...violations);
  });

  return {
    component: componentName,
    violations: allViolations,
    passed: allViolations.length === 0,
  };
}

// ============================================================================
// REPORTER
// ============================================================================

/**
 * Format a violation for console output.
 */
function formatViolation(violation: Violation): string {
  const { file, line, code, message } = violation;
  const relPath = path.relative(process.cwd(), file);
  return `  ${relPath}:${line} - [${code}] ${message}`;
}

/**
 * Print verification report.
 */
function printReport(report: VerificationReport): void {
  console.log('\n='.repeat(80));
  console.log('CONTRACT VERIFICATION REPORT');
  console.log('='.repeat(80));
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Status: ${report.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Total Violations: ${report.totalViolations}`);
  console.log('='.repeat(80));

  report.components.forEach(comp => {
    const status = comp.passed ? '✅' : '❌';
    console.log(`\n${status} Component: ${comp.component}`);

    if (comp.violations.length > 0) {
      console.log(`   Violations: ${comp.violations.length}`);
      comp.violations.forEach(v => {
        console.log(formatViolation(v));
      });
    } else {
      console.log('   No violations detected');
    }
  });

  console.log('\n' + '='.repeat(80));

  if (report.passed) {
    console.log('✅ CONTRACT VERIFIED - All checks passed');
  } else {
    console.log('❌ CONTRACT VIOLATIONS DETECTED');
    console.log('   Fix violations before committing');
  }

  console.log('='.repeat(80) + '\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const componentFilter = args.find(arg => arg.startsWith('--component='))?.split('=')[1];

  console.log('🔍 Scanning codebase for contract violations...\n');

  // Find all component directories
  const componentDirs = [
    'adapters/core/*',
    'adapters/react/*',
    'adapters/vue/*',
    'adapters/svelte/*',
    'adapters/angular/*',
    'components/primitives/*',
    'domain/tokens/*',
  ];

  const allComponents: ComponentResult[] = [];

  for (const dir of componentDirs) {
    const paths = await glob(dir, { absolute: true });

    for (const compPath of paths) {
      const componentName = path.basename(compPath);

      // Filter by component if specified
      if (componentFilter && componentName !== componentFilter) {
        continue;
      }

      if (fs.statSync(compPath).isDirectory()) {
        const result = await scanComponent(compPath);
        allComponents.push(result);
      }
    }
  }

  const totalViolations = allComponents.reduce(
    (sum, comp) => sum + comp.violations.length,
    0
  );

  const report: VerificationReport = {
    passed: totalViolations === 0,
    totalViolations,
    components: allComponents,
    timestamp: new Date().toISOString(),
  };

  printReport(report);

  // Exit with error code if violations found
  process.exit(report.passed ? 0 : 1);
}

main().catch(error => {
  console.error('Error running contract verification:', error);
  process.exit(1);
});

/**
 * USAGE:
 *
 * # Scan all components
 * npm run verify:contract
 *
 * # Scan specific component
 * npm run verify:contract -- --component=button
 *
 * # In package.json
 * {
 *   "scripts": {
 *     "verify:contract": "ts-node scripts/verify-contract.ts",
 *     "precommit": "npm run verify:contract"
 *   }
 * }
 */
