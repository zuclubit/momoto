/**
 * @fileoverview Enriched Tokens Usage Examples
 *
 * Examples demonstrating how to use EnrichedTokens with full Momoto metadata
 * in momoto-ui applications.
 *
 * FASE 5: Component Integration
 *
 * @module momoto-ui/examples/enriched-tokens
 * @version 1.0.0
 */

import { PerceptualColor } from '../domain/perceptual';
import { EnrichedToken } from '../domain/tokens/value-objects/EnrichedToken';
import { TokenEnrichmentService } from '../domain/tokens/services/TokenEnrichmentService';
import { GenerateEnrichedComponentTokens } from '../application/use-cases/GenerateEnrichedComponentTokens';

// ============================================================================
// EXAMPLE 1: Create Single Enriched Token
// ============================================================================

async function example1_CreateEnrichedToken() {
  console.log('━━━ EXAMPLE 1: Create Single Enriched Token ━━━\n');

  // 1. Create color
  const color = await PerceptualColor.fromHex('#3B82F6');

  // 2. Create decision with Momoto metadata
  const decision = await TokenEnrichmentService.createColorDecision({
    color,
    role: 'accent',
    context: {
      component: 'button',
      intent: 'action',
    },
    description: 'Primary brand color for action buttons',
  });

  // 3. Create enriched token
  const token = EnrichedToken.fromMomotoDecision('button.primary.background', decision);

  // 4. Access metadata
  console.log('Token:', token.name);
  console.log('Value:', token.toCssValue());
  console.log('\nMetadata:');
  console.log('  Quality Score:', token.qualityScore.toFixed(2));
  console.log('  Confidence:', token.confidence.toFixed(2));
  console.log('  Reason:', token.reason);
  console.log('  Source ID:', token.sourceDecisionId);

  // 5. Quality checks
  console.log('\nQuality Assessment:');
  console.log('  Is high quality?', token.isHighQuality ? '✅ YES' : '❌ NO');
  console.log('  Is high confidence?', token.isHighConfidence ? '✅ YES' : '❌ NO');
  console.log('  Is Momoto decision?', token.isMomotoDecision ? '✅ YES' : '❌ NO');

  // 6. Export
  console.log('\nCSS Variable:');
  console.log(' ', token.toCssVariable());

  console.log('\nW3C with Metadata (excerpt):');
  const w3c = token.toW3CWithMetadata();
  console.log(JSON.stringify(w3c, null, 2).substring(0, 500) + '...\n');
}

// ============================================================================
// EXAMPLE 2: Create Token with Accessibility Validation
// ============================================================================

async function example2_TokenWithAccessibility() {
  console.log('━━━ EXAMPLE 2: Token with Accessibility Validation ━━━\n');

  // Background and text colors
  const bgColor = await PerceptualColor.fromHex('#3B82F6');
  const textColor = await PerceptualColor.fromHex('#FFFFFF');

  // Create decision with accessibility evaluation
  const decision = await TokenEnrichmentService.createColorDecision({
    color: textColor,
    role: 'text-primary',
    background: bgColor, // ← Triggers WCAG evaluation
    context: { component: 'button' },
    description: 'Button text color',
  });

  const token = EnrichedToken.fromMomotoDecision('button.primary.text', decision);

  console.log('Token:', token.name);
  console.log('Value:', token.toCssValue());
  console.log('\nAccessibility:');
  console.log('  WCAG Ratio:', token.accessibility?.wcagRatio.toFixed(2));
  console.log('  Passes AA?', token.passesWCAG_AA ? '✅ YES' : '❌ NO');
  console.log('  Passes AAA?', token.passesWCAG_AAA ? '✅ YES' : '❌ NO');
  console.log('\nQuality:', token.qualityScore.toFixed(2));
  console.log('Reason:', token.reason);
  console.log();
}

// ============================================================================
// EXAMPLE 3: Generate Component Token System
// ============================================================================

async function example3_GenerateComponentTokens() {
  console.log('━━━ EXAMPLE 3: Generate Component Token System ━━━\n');

  const useCase = new GenerateEnrichedComponentTokens();

  const result = await useCase.execute({
    componentName: 'button',
    brandColorHex: '#3B82F6',
    intent: 'action',
    role: 'accent',
    states: ['idle', 'hover', 'active', 'disabled'],
    namespace: 'my-app',
  });

  if (!result.success) {
    console.error('Error:', result.error.message);
    return;
  }

  const { enrichedTokens, stats, css } = result.value;

  // Statistics
  console.log('Generation Statistics:');
  console.log('  Total tokens:', stats.totalTokens);
  console.log('  High quality:', `${stats.highQualityTokens} (${(stats.highQualityTokens / stats.totalTokens * 100).toFixed(0)}%)`);
  console.log('  Medium quality:', stats.mediumQualityTokens);
  console.log('  Low quality:', stats.lowQualityTokens);
  console.log('  Avg quality score:', stats.avgQualityScore.toFixed(2));
  console.log('  Avg confidence:', stats.avgConfidence.toFixed(2));

  // Token details
  console.log('\nGenerated Tokens:');
  enrichedTokens.forEach(token => {
    const qualityBadge = token.isHighQuality ? '🟢' : token.isMediumQuality ? '🟡' : '🔴';
    console.log(`  ${qualityBadge} ${token.name}`);
    console.log(`     Value: ${token.toCssValue()}`);
    console.log(`     Quality: ${token.qualityScore.toFixed(2)}, Confidence: ${token.confidence.toFixed(2)}`);
    console.log(`     ${token.reason.substring(0, 80)}...`);
  });

  // CSS output
  console.log('\nGenerated CSS:');
  console.log(css.substring(0, 400) + '...\n');
}

// ============================================================================
// EXAMPLE 4: Batch Token Creation
// ============================================================================

async function example4_BatchTokenCreation() {
  console.log('━━━ EXAMPLE 4: Batch Token Creation ━━━\n');

  const colors = [
    { hex: '#3B82F6', role: 'accent', name: 'primary' },
    { hex: '#EF4444', role: 'accent', name: 'danger' },
    { hex: '#10B981', role: 'accent', name: 'success' },
    { hex: '#F59E0B', role: 'accent', name: 'warning' },
  ];

  // Create all decisions in parallel
  const decisions = await TokenEnrichmentService.createColorDecisionsBatch(
    await Promise.all(
      colors.map(async ({ hex, role, name }) => ({
        color: await PerceptualColor.fromHex(hex),
        role: role as any,
        context: { component: 'button', variant: name },
        description: `${name} variant color`,
      }))
    )
  );

  // Create enriched tokens
  const tokens = decisions.map((decision, i) =>
    EnrichedToken.fromMomotoDecision(`button.${colors[i].name}.bg`, decision)
  );

  console.log('Created', tokens.length, 'tokens in batch:\n');
  tokens.forEach(token => {
    console.log(`${token.name}:`);
    console.log(`  Quality: ${token.qualityScore.toFixed(2)}`);
    console.log(`  ${token.reason.substring(0, 100)}...`);
  });
  console.log();
}

// ============================================================================
// EXAMPLE 5: Quality Filtering and Validation
// ============================================================================

async function example5_QualityFiltering() {
  console.log('━━━ EXAMPLE 5: Quality Filtering and Validation ━━━\n');

  const useCase = new GenerateEnrichedComponentTokens();

  const result = await useCase.execute({
    componentName: 'card',
    brandColorHex: '#8B5CF6',
    intent: 'neutral',
    role: 'surface',
    states: ['idle', 'hover', 'active'],
  });

  if (!result.success) return;

  const { enrichedTokens } = result.value;

  // Filter by quality
  const highQuality = enrichedTokens.filter(t => t.isHighQuality);
  const mediumQuality = enrichedTokens.filter(t => t.isMediumQuality);
  const lowQuality = enrichedTokens.filter(t => t.isLowQuality);

  console.log('Quality Distribution:');
  console.log('  🟢 High quality:', highQuality.length);
  console.log('  🟡 Medium quality:', mediumQuality.length);
  console.log('  🔴 Low quality:', lowQuality.length);

  // Warn about low quality
  if (lowQuality.length > 0) {
    console.log('\n⚠️  Low Quality Tokens:');
    lowQuality.forEach(token => {
      console.log(`  ${token.name}`);
      console.log(`    Quality: ${token.qualityScore.toFixed(2)}`);
      console.log(`    Reason: ${token.reason}`);
    });
  }

  // Filter by confidence
  const lowConfidence = enrichedTokens.filter(t => t.isLowConfidence);
  if (lowConfidence.length > 0) {
    console.log('\n⚠️  Low Confidence Tokens:');
    lowConfidence.forEach(token => {
      console.log(`  ${token.name}: confidence = ${token.confidence.toFixed(2)}`);
    });
  }

  console.log();
}

// ============================================================================
// EXAMPLE 6: Debug Output
// ============================================================================

async function example6_DebugOutput() {
  console.log('━━━ EXAMPLE 6: Debug Output ━━━\n');

  const color = await PerceptualColor.fromHex('#EC4899');
  const decision = await TokenEnrichmentService.createColorDecision({
    color,
    role: 'accent',
    context: { component: 'badge', intent: 'highlight' },
  });

  const token = EnrichedToken.fromMomotoDecision('badge.highlight.bg', decision);

  // Detailed debug output
  console.log(token.toDebugString());
  console.log('\nJSON Output:');
  console.log(JSON.stringify(token.toJSON(), null, 2));
  console.log();
}

// ============================================================================
// EXAMPLE 7: Theme System Integration
// ============================================================================

async function example7_ThemeSystemIntegration() {
  console.log('━━━ EXAMPLE 7: Theme System Integration ━━━\n');

  // Generate tokens for multiple components
  const components = ['button', 'card', 'input', 'badge'];
  const brandColor = '#3B82F6';

  console.log('Generating theme tokens for components:', components.join(', '));
  console.log();

  const allTokens: EnrichedToken[] = [];
  const useCase = new GenerateEnrichedComponentTokens();

  for (const component of components) {
    const result = await useCase.execute({
      componentName: component,
      brandColorHex: brandColor,
      intent: 'action',
      role: 'accent',
      states: ['idle', 'hover'],
    });

    if (result.success) {
      allTokens.push(...result.value.enrichedTokens);
    }
  }

  console.log(`Generated ${allTokens.length} tokens total\n`);

  // Quality report
  const totalQuality = allTokens.reduce((sum, t) => sum + t.qualityScore, 0);
  const avgQuality = totalQuality / allTokens.length;
  const highQuality = allTokens.filter(t => t.isHighQuality).length;

  console.log('Theme Quality Report:');
  console.log('  Average quality:', avgQuality.toFixed(2));
  console.log('  High quality tokens:', `${highQuality}/${allTokens.length} (${(highQuality / allTokens.length * 100).toFixed(0)}%)`);

  // Export all tokens to CSS
  const cssVariables = allTokens.map(t => `  ${t.toCssVariable()}`).join('\n');
  console.log('\nTheme CSS Variables (excerpt):');
  console.log(`:root {\n${cssVariables.substring(0, 400)}\n  ...\n}`);
  console.log();
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  try {
    await example1_CreateEnrichedToken();
    await example2_TokenWithAccessibility();
    await example3_GenerateComponentTokens();
    await example4_BatchTokenCreation();
    await example5_QualityFiltering();
    await example6_DebugOutput();
    await example7_ThemeSystemIntegration();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All examples completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runAllExamples();
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  example1_CreateEnrichedToken,
  example2_TokenWithAccessibility,
  example3_GenerateComponentTokens,
  example4_BatchTokenCreation,
  example5_QualityFiltering,
  example6_DebugOutput,
  example7_ThemeSystemIntegration,
  runAllExamples,
};
