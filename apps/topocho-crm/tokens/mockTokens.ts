/**
 * @fileoverview Mock Tokens for Topocho CRM
 *
 * FASE 16: Topocho CRM Demo
 *
 * Mock EnrichedToken instances for demonstration purposes.
 * In a real application, these would come from Momoto WASM decisions.
 *
 * @module apps/topocho-crm/tokens/mockTokens
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// MOCK TOKEN FACTORY
// ============================================================================

function createMockToken(
  name: string,
  hex: string,
  qualityScore: number = 0.95
): EnrichedToken {
  // Parse hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return {
    id: `mock-${name}`,
    name,
    value: {
      hex,
      rgb: { r, g, b },
      oklch: { l: 0.65, c: 0.15, h: 240 }, // Simplified
    },
    qualityScore,
    confidence: 0.92,
    reason: `Mock token for ${name} (demo purposes)`,
    sourceDecisionId: `demo-decision-${name}`,
    accessibility: {
      wcagLevel: 'AA' as const,
      contrastRatio: 4.5,
      apcaScore: 75,
    },
  };
}

// ============================================================================
// PRIMARY COLORS
// ============================================================================

export const primaryBg = createMockToken('primary-bg', '#3B82F6');
export const primaryText = createMockToken('primary-text', '#FFFFFF');
export const primaryHoverBg = createMockToken('primary-hover-bg', '#2563EB');
export const primaryFocusBg = createMockToken('primary-focus-bg', '#1D4ED8');

// ============================================================================
// NEUTRAL COLORS
// ============================================================================

export const neutralBg = createMockToken('neutral-bg', '#F3F4F6');
export const neutralText = createMockToken('neutral-text', '#111827');
export const neutralBorder = createMockToken('neutral-border', '#D1D5DB');
export const neutralHoverBg = createMockToken('neutral-hover-bg', '#E5E7EB');

// ============================================================================
// SUCCESS COLORS
// ============================================================================

export const successBg = createMockToken('success-bg', '#10B981');
export const successText = createMockToken('success-text', '#FFFFFF');
export const successHoverBg = createMockToken('success-hover-bg', '#059669');

// ============================================================================
// ERROR COLORS
// ============================================================================

export const errorBg = createMockToken('error-bg', '#EF4444');
export const errorText = createMockToken('error-text', '#FFFFFF');
export const errorHoverBg = createMockToken('error-hover-bg', '#DC2626');
export const errorBorder = createMockToken('error-border', '#F87171');
export const errorMessage = createMockToken('error-message', '#DC2626');

// ============================================================================
// WARNING COLORS
// ============================================================================

export const warningBg = createMockToken('warning-bg', '#F59E0B');
export const warningText = createMockToken('warning-text', '#FFFFFF');
export const warningHoverBg = createMockToken('warning-hover-bg', '#D97706');

// ============================================================================
// FIELD COLORS
// ============================================================================

export const fieldBg = createMockToken('field-bg', '#FFFFFF');
export const fieldText = createMockToken('field-text', '#111827');
export const fieldBorder = createMockToken('field-border', '#D1D5DB');
export const fieldPlaceholder = createMockToken('field-placeholder', '#9CA3AF');
export const fieldHoverBorder = createMockToken('field-hover-border', '#9CA3AF');
export const fieldFocusBorder = createMockToken('field-focus-border', '#3B82F6');
export const fieldFocusOutline = createMockToken('field-focus-outline', '#93C5FD');

// ============================================================================
// LABEL & HELPER COLORS
// ============================================================================

export const labelText = createMockToken('label-text', '#374151');
export const helperText = createMockToken('helper-text', '#6B7280');

// ============================================================================
// CHECKBOX COLORS
// ============================================================================

export const checkboxBg = createMockToken('checkbox-bg', '#FFFFFF');
export const checkboxBorder = createMockToken('checkbox-border', '#D1D5DB');
export const checkboxCheck = createMockToken('checkbox-check', '#3B82F6');
export const checkboxCheckedBg = createMockToken('checkbox-checked-bg', '#3B82F6');
export const checkboxCheckedCheck = createMockToken('checkbox-checked-check', '#FFFFFF');

// ============================================================================
// SWITCH COLORS
// ============================================================================

export const switchTrackBg = createMockToken('switch-track-bg', '#D1D5DB');
export const switchTrackBorder = createMockToken('switch-track-border', '#9CA3AF');
export const switchThumb = createMockToken('switch-thumb', '#FFFFFF');
export const switchCheckedTrackBg = createMockToken('switch-checked-track-bg', '#3B82F6');

// ============================================================================
// SELECT/DROPDOWN COLORS
// ============================================================================

export const dropdownBg = createMockToken('dropdown-bg', '#FFFFFF');
export const dropdownBorder = createMockToken('dropdown-border', '#D1D5DB');
export const dropdownShadow = createMockToken('dropdown-shadow', '#00000026');
export const optionText = createMockToken('option-text', '#111827');
export const optionHoverBg = createMockToken('option-hover-bg', '#F3F4F6');
export const optionSelectedBg = createMockToken('option-selected-bg', '#EFF6FF');

// ============================================================================
// DISABLED COLORS
// ============================================================================

export const disabledBg = createMockToken('disabled-bg', '#F9FAFB');
export const disabledText = createMockToken('disabled-text', '#9CA3AF');
export const disabledBorder = createMockToken('disabled-border', '#E5E7EB');

// ============================================================================
// LAYOUT COLORS
// ============================================================================

export const sidebarBg = createMockToken('sidebar-bg', '#1F2937');
export const sidebarText = createMockToken('sidebar-text', '#F9FAFB');
export const sidebarHoverBg = createMockToken('sidebar-hover-bg', '#374151');
export const headerBg = createMockToken('header-bg', '#FFFFFF');
export const headerBorder = createMockToken('header-border', '#E5E7EB');
export const contentBg = createMockToken('content-bg', '#F9FAFB');
