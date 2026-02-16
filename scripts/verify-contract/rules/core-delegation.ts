/**
 * @fileoverview Rule: Core Delegation
 *
 * FASE 15.6: Contract Validation
 *
 * Ensures adapters properly delegate to Core:
 * - Must import and use Core classes
 * - Must call Core.process*() methods
 * - Must not duplicate Core logic
 *
 * @module scripts/verify-contract/rules/core-delegation
 * @version 1.0.0
 */

import { SourceFile, SyntaxKind } from 'ts-morph';
import type { Violation } from '../reporter';

const CORE_CLASSES = ['ButtonCore', 'TextFieldCore', 'CheckboxCore', 'SelectCore', 'SwitchCore'];
const REQUIRED_METHODS = ['process', 'determineState', 'resolveTokens', 'computeStyles', 'generateARIA'];

export function validateCoreDelegation(sourceFile: SourceFile): Violation[] {
  const violations: Violation[] = [];
  const fileName = sourceFile.getBaseName();

  // Skip core files, type files, and index files
  if (
    fileName.includes('Core') ||
    fileName.includes('core') ||
    fileName.includes('types') ||
    fileName === 'index.ts'
  ) {
    return violations;
  }

  // Check if file is an adapter (React/Vue/Svelte/Angular component)
  const isAdapter =
    fileName.endsWith('.tsx') ||
    fileName.endsWith('.vue') ||
    fileName.endsWith('.svelte') ||
    fileName.includes('component.ts');

  if (!isAdapter) {
    return violations;
  }

  // Check for Core import
  const importDeclarations = sourceFile.getImportDeclarations();
  let hasCoreImport = false;
  let importedCore: string | null = null;

  importDeclarations.forEach((importDecl) => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    if (moduleSpecifier.includes('/core/')) {
      const namedImports = importDecl.getNamedImports();
      namedImports.forEach((namedImport) => {
        const importName = namedImport.getName();
        if (CORE_CLASSES.includes(importName)) {
          hasCoreImport = true;
          importedCore = importName;
        }
      });
    }
  });

  if (!hasCoreImport) {
    violations.push({
      rule: 'core-delegation',
      severity: 'error',
      message: 'Adapter must import corresponding Core class',
      file: sourceFile.getFilePath(),
      line: 1,
      suggestion: `Import ${CORE_CLASSES.find((c) => fileName.toLowerCase().includes(c.toLowerCase().replace('core', '')))} from '../../core/...'`,
    });
    return violations; // No point checking further
  }

  // Check for Core method calls
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  let hasCoreMethodCall = false;

  callExpressions.forEach((call) => {
    const expression = call.getExpression();
    const text = expression.getText();

    if (importedCore && text.startsWith(importedCore + '.')) {
      const methodName = text.split('.')[1];
      if (REQUIRED_METHODS.some((m) => methodName?.startsWith(m))) {
        hasCoreMethodCall = true;
      }
    }
  });

  if (!hasCoreMethodCall) {
    violations.push({
      rule: 'core-delegation',
      severity: 'error',
      message: `Adapter must call ${importedCore}.process*() method`,
      file: sourceFile.getFilePath(),
      line: 1,
      suggestion: `Call ${importedCore}.process*() to compute component state and styles`,
    });
  }

  // Check for duplicated Core logic (looking for manual state determination)
  const variableStatements = sourceFile.getVariableStatements();
  variableStatements.forEach((varStmt) => {
    const declarations = varStmt.getDeclarations();
    declarations.forEach((decl) => {
      const initializer = decl.getInitializer();
      if (initializer) {
        const text = initializer.getText();

        // Check for manual state determination patterns
        if (
          text.includes('disabled') &&
          text.includes('?') &&
          (text.includes('color') || text.includes('style'))
        ) {
          violations.push({
            rule: 'core-delegation',
            severity: 'warning',
            message: 'Possible manual state determination detected',
            file: sourceFile.getFilePath(),
            line: decl.getStartLineNumber(),
            suggestion: 'Use Core.determineState() instead of manual conditionals',
          });
        }
      }
    });
  });

  return violations;
}
