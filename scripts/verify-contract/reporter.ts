/**
 * @fileoverview Contract Validation Reporter
 *
 * FASE 15.6: Contract Validation
 *
 * Reports contract violations in a structured format.
 *
 * @module scripts/verify-contract/reporter
 * @version 1.0.0
 */

export interface Violation {
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  file: string;
  line?: number;
  suggestion?: string;
}

export class Reporter {
  private violations: Violation[] = [];

  addViolation(violation: Violation): void {
    this.violations.push(violation);
  }

  hasViolations(): boolean {
    return this.violations.length > 0;
  }

  getViolations(): Violation[] {
    return this.violations;
  }

  print(): void {
    if (this.violations.length === 0) {
      return;
    }

    console.log('📋 CONTRACT VIOLATIONS DETECTED:\n');

    // Group by file
    const byFile = new Map<string, Violation[]>();
    this.violations.forEach((v) => {
      if (!byFile.has(v.file)) {
        byFile.set(v.file, []);
      }
      byFile.get(v.file)!.push(v);
    });

    // Print grouped violations
    byFile.forEach((violations, file) => {
      console.log(`\n📄 ${file}`);
      violations.forEach((v) => {
        const icon = v.severity === 'error' ? '❌' : '⚠️ ';
        const location = v.line ? `:${v.line}` : '';
        console.log(`   ${icon} [${v.rule}] ${v.message}${location}`);
        if (v.suggestion) {
          console.log(`      💡 ${v.suggestion}`);
        }
      });
    });

    // Summary
    const errors = this.violations.filter((v) => v.severity === 'error').length;
    const warnings = this.violations.filter((v) => v.severity === 'warning').length;

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Summary: ${errors} error(s), ${warnings} warning(s)\n`);
  }
}
