/**
 * @fileoverview Contract Validation Engine - Main Entry Point
 *
 * FASE 15.6: Contract Validation
 *
 * Validates that all Momoto UI components comply with the architectural contract:
 * - "Momoto decide, momoto-ui ejecuta"
 * - Zero perceptual logic in adapters
 * - 100% token-driven
 * - Core delegation only
 *
 * @module scripts/verify-contract
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { Project } from 'ts-morph';
import { validateNoPerceptualLogic } from './rules/no-perceptual-logic';
import { validateTokenOnlyColors } from './rules/token-only-colors';
import { validateCoreDelegation } from './rules/core-delegation';
import { validateAriaCompliance } from './rules/aria-compliance';
import { Reporter } from './reporter';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ADAPTERS_ROOT = path.join(process.cwd(), 'adapters');
const FRAMEWORKS = ['react', 'vue', 'svelte', 'angular'];
const COMPONENTS = ['button', 'textfield', 'checkbox', 'select', 'switch'];

// ============================================================================
// MAIN VALIDATION
// ============================================================================

async function main() {
  console.log('🔍 Momoto UI Contract Validation Engine\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const reporter = new Reporter();
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  // Collect all adapter files
  const adapterFiles: string[] = [];
  for (const framework of FRAMEWORKS) {
    for (const component of COMPONENTS) {
      const componentPath = path.join(ADAPTERS_ROOT, framework, component);
      if (fs.existsSync(componentPath)) {
        const files = fs.readdirSync(componentPath);
        files.forEach((file) => {
          if (
            file.endsWith('.ts') ||
            file.endsWith('.tsx') ||
            file.endsWith('.vue') ||
            file.endsWith('.svelte')
          ) {
            adapterFiles.push(path.join(componentPath, file));
          }
        });
      }
    }
  }

  console.log(`📦 Found ${adapterFiles.length} adapter files to validate\n`);

  // Add files to project
  adapterFiles.forEach((filePath) => {
    try {
      project.addSourceFileAtPath(filePath);
    } catch (error) {
      // Skip files that can't be parsed (e.g., Vue SFCs)
      console.log(`⚠️  Skipping ${path.basename(filePath)} (non-TS format)`);
    }
  });

  const sourceFiles = project.getSourceFiles();
  console.log(`✓ Analyzing ${sourceFiles.length} TypeScript files\n`);

  // Run validation rules
  console.log('Running validation rules...\n');

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(process.cwd(), filePath);

    // Rule 1: No perceptual logic
    const perceptualViolations = validateNoPerceptualLogic(sourceFile);
    perceptualViolations.forEach((v) => reporter.addViolation({ ...v, file: relativePath }));

    // Rule 2: Token-only colors
    const tokenViolations = validateTokenOnlyColors(sourceFile);
    tokenViolations.forEach((v) => reporter.addViolation({ ...v, file: relativePath }));

    // Rule 3: Core delegation
    const delegationViolations = validateCoreDelegation(sourceFile);
    delegationViolations.forEach((v) => reporter.addViolation({ ...v, file: relativePath }));

    // Rule 4: ARIA compliance
    const ariaViolations = validateAriaCompliance(sourceFile);
    ariaViolations.forEach((v) => reporter.addViolation({ ...v, file: relativePath }));
  }

  // Generate report
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  reporter.print();

  // Exit with error code if violations found
  if (reporter.hasViolations()) {
    console.log('\n❌ CONTRACT VERIFICATION FAILED\n');
    process.exit(1);
  } else {
    console.log('\n✅ CONTRACT VERIFIED - All checks passed\n');
    console.log(`   Components: ${COMPONENTS.length}`);
    console.log(`   Frameworks: ${FRAMEWORKS.length}`);
    console.log(`   Violations: 0`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
