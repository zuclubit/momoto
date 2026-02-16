/**
 * @fileoverview Rule: Token-Only Colors
 *
 * FASE 15.6: Contract Validation
 *
 * Ensures all colors come from EnrichedToken:
 * - No hardcoded hex values (#RRGGBB)
 * - No rgb/rgba/hsl/hsla values
 * - No CSS variables (--custom-color)
 * - Colors must come from token.value.hex
 *
 * @module scripts/verify-contract/rules/token-only-colors
 * @version 1.0.0
 */

import { SourceFile, SyntaxKind } from 'ts-morph';
import type { Violation } from '../reporter';

const HEX_COLOR_REGEX = /#[0-9A-Fa-f]{3,8}/g;
const RGB_COLOR_REGEX = /rgba?\([^)]+\)/g;
const HSL_COLOR_REGEX = /hsla?\([^)]+\)/g;
const CSS_VAR_REGEX = /var\(--[^)]+\)/g;

export function validateTokenOnlyColors(sourceFile: SourceFile): Violation[] {
  const violations: Violation[] = [];
  const fileName = sourceFile.getBaseName();

  // Skip core files and type definition files
  if (
    fileName.includes('Core') ||
    fileName.includes('core') ||
    fileName.includes('types')
  ) {
    return violations;
  }

  // Check string literals for hardcoded colors
  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  stringLiterals.forEach((literal) => {
    const text = literal.getText().slice(1, -1); // Remove quotes

    // Check for hex colors
    const hexMatches = text.match(HEX_COLOR_REGEX);
    if (hexMatches) {
      violations.push({
        rule: 'token-only-colors',
        severity: 'error',
        message: `Hardcoded hex color detected: ${hexMatches[0]}`,
        file: sourceFile.getFilePath(),
        line: literal.getStartLineNumber(),
        suggestion: 'Use EnrichedToken.value.hex instead',
      });
    }

    // Check for rgb/rgba colors
    const rgbMatches = text.match(RGB_COLOR_REGEX);
    if (rgbMatches) {
      violations.push({
        rule: 'token-only-colors',
        severity: 'error',
        message: `Hardcoded RGB color detected: ${rgbMatches[0]}`,
        file: sourceFile.getFilePath(),
        line: literal.getStartLineNumber(),
        suggestion: 'Use EnrichedToken.value.hex instead',
      });
    }

    // Check for hsl/hsla colors
    const hslMatches = text.match(HSL_COLOR_REGEX);
    if (hslMatches) {
      violations.push({
        rule: 'token-only-colors',
        severity: 'error',
        message: `Hardcoded HSL color detected: ${hslMatches[0]}`,
        file: sourceFile.getFilePath(),
        line: literal.getStartLineNumber(),
        suggestion: 'Use EnrichedToken.value.hex instead',
      });
    }

    // Check for CSS variables
    const cssVarMatches = text.match(CSS_VAR_REGEX);
    if (cssVarMatches) {
      violations.push({
        rule: 'token-only-colors',
        severity: 'error',
        message: `CSS variable detected: ${cssVarMatches[0]}`,
        file: sourceFile.getFilePath(),
        line: literal.getStartLineNumber(),
        suggestion: 'Use EnrichedToken.value.hex instead of CSS variables',
      });
    }
  });

  // Check template literals
  const templateLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.TemplateExpression);
  templateLiterals.forEach((template) => {
    const text = template.getText();

    if (
      text.match(HEX_COLOR_REGEX) ||
      text.match(RGB_COLOR_REGEX) ||
      text.match(HSL_COLOR_REGEX) ||
      text.match(CSS_VAR_REGEX)
    ) {
      violations.push({
        rule: 'token-only-colors',
        severity: 'error',
        message: 'Hardcoded color in template literal',
        file: sourceFile.getFilePath(),
        line: template.getStartLineNumber(),
        suggestion: 'Use EnrichedToken.value.hex instead',
      });
    }
  });

  return violations;
}
