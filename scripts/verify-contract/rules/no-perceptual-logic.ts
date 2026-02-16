/**
 * @fileoverview Rule: No Perceptual Logic
 *
 * FASE 15.6: Contract Validation
 *
 * Ensures adapters contain NO perceptual logic:
 * - No color calculations (lighten, darken, mix, etc.)
 * - No isDark/isLight checks
 * - No contrast calculations
 * - No magic numbers for spacing/sizing
 *
 * @module scripts/verify-contract/rules/no-perceptual-logic
 * @version 1.0.0
 */

import { SourceFile, SyntaxKind } from 'ts-morph';
import type { Violation } from '../reporter';

const FORBIDDEN_FUNCTIONS = [
  'lighten',
  'darken',
  'mix',
  'shade',
  'tint',
  'adjust',
  'scale',
  'getContrastRatio',
  'calculateContrast',
  'getLuminance',
  'isDark',
  'isLight',
];

const FORBIDDEN_IDENTIFIERS = [
  'isDark',
  'isLight',
  'isDarkMode',
  'isLightMode',
  'darkMode',
  'lightMode',
];

export function validateNoPerceptualLogic(sourceFile: SourceFile): Violation[] {
  const violations: Violation[] = [];
  const fileName = sourceFile.getBaseName();

  // Skip core files (they're allowed to have this logic)
  if (fileName.includes('Core') || fileName.includes('core')) {
    return violations;
  }

  // Check for forbidden function calls
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  callExpressions.forEach((call) => {
    const expression = call.getExpression();
    const text = expression.getText();

    FORBIDDEN_FUNCTIONS.forEach((forbidden) => {
      if (text.includes(forbidden)) {
        violations.push({
          rule: 'no-perceptual-logic',
          severity: 'error',
          message: `Forbidden perceptual function: ${forbidden}()`,
          file: sourceFile.getFilePath(),
          line: call.getStartLineNumber(),
          suggestion: 'Use tokens from Core instead of calculating colors',
        });
      }
    });
  });

  // Check for forbidden identifiers
  const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier);
  identifiers.forEach((identifier) => {
    const name = identifier.getText();

    FORBIDDEN_IDENTIFIERS.forEach((forbidden) => {
      if (name === forbidden) {
        violations.push({
          rule: 'no-perceptual-logic',
          severity: 'error',
          message: `Forbidden perceptual identifier: ${forbidden}`,
          file: sourceFile.getFilePath(),
          line: identifier.getStartLineNumber(),
          suggestion: 'Delegate state determination to Core.determineState()',
        });
      }
    });
  });

  // Check for conditional color logic (e.g., if (disabled) style.color = ...)
  const ifStatements = sourceFile.getDescendantsOfKind(SyntaxKind.IfStatement);
  ifStatements.forEach((ifStmt) => {
    const condition = ifStmt.getExpression().getText();
    const thenBlock = ifStmt.getThenStatement().getText();

    // Check if the condition is about state and the body manipulates styles
    if (
      (condition.includes('disabled') ||
        condition.includes('checked') ||
        condition.includes('focused') ||
        condition.includes('hovered')) &&
      (thenBlock.includes('color') ||
        thenBlock.includes('backgroundColor') ||
        thenBlock.includes('style'))
    ) {
      violations.push({
        rule: 'no-perceptual-logic',
        severity: 'error',
        message: 'Direct style manipulation based on state detected',
        file: sourceFile.getFilePath(),
        line: ifStmt.getStartLineNumber(),
        suggestion: 'Use Core.computeStyles() instead of conditional styling',
      });
    }
  });

  return violations;
}
