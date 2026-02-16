/**
 * @fileoverview Rule: ARIA Compliance
 *
 * FASE 15.6: Contract Validation
 *
 * Ensures ARIA attributes come from Core:
 * - Must use Core.generateARIA()
 * - Must not define ARIA manually
 * - Must expose WCAG 2.2 AA attributes
 *
 * @module scripts/verify-contract/rules/aria-compliance
 * @version 1.0.0
 */

import { SourceFile, SyntaxKind } from 'ts-morph';
import type { Violation } from '../reporter';

const ARIA_ATTRIBUTES = [
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-checked',
  'aria-disabled',
  'aria-required',
  'aria-invalid',
  'aria-expanded',
  'aria-controls',
  'aria-activedescendant',
  'aria-selected',
];

export function validateAriaCompliance(sourceFile: SourceFile): Violation[] {
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

  // Check if file is an adapter
  const isAdapter =
    fileName.endsWith('.tsx') ||
    fileName.endsWith('.vue') ||
    fileName.endsWith('.svelte') ||
    fileName.includes('component.ts');

  if (!isAdapter) {
    return violations;
  }

  // Check for manual ARIA attribute definitions in string literals
  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  stringLiterals.forEach((literal) => {
    const text = literal.getText().slice(1, -1); // Remove quotes

    ARIA_ATTRIBUTES.forEach((attr) => {
      if (text === attr) {
        // Check if this is being set to a hardcoded value (not from ariaAttrs)
        const parent = literal.getParent();
        const parentText = parent?.getText() || '';

        // If it's a simple assignment like aria-label="Close", that's a violation
        if (!parentText.includes('ariaAttrs') && !parentText.includes('aria-')) {
          violations.push({
            rule: 'aria-compliance',
            severity: 'warning',
            message: `ARIA attribute "${attr}" might not be using Core.generateARIA()`,
            file: sourceFile.getFilePath(),
            line: literal.getStartLineNumber(),
            suggestion: 'Use ariaAttrs from Core.generateARIA() instead of hardcoded values',
          });
        }
      }
    });
  });

  // Check for ariaAttrs usage
  const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier);
  let usesAriaAttrs = false;

  identifiers.forEach((identifier) => {
    if (identifier.getText() === 'ariaAttrs') {
      usesAriaAttrs = true;
    }
  });

  // Check if Core.generateARIA is called
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  let callsGenerateARIA = false;

  callExpressions.forEach((call) => {
    const expression = call.getExpression();
    const text = expression.getText();

    if (text.includes('generateARIA') || text.includes('.ariaAttrs')) {
      callsGenerateARIA = true;
    }
  });

  if (!usesAriaAttrs && !callsGenerateARIA) {
    violations.push({
      rule: 'aria-compliance',
      severity: 'warning',
      message: 'Component should use ARIA attributes from Core.generateARIA()',
      file: sourceFile.getFilePath(),
      line: 1,
      suggestion: 'Access ariaAttrs from Core output to ensure WCAG 2.2 AA compliance',
    });
  }

  return violations;
}
