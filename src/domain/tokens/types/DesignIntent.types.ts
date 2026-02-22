/**
 * @fileoverview Design Intent Types - Layer 1 (Semantic Definitions)
 *
 * FASE 12: Token System Enhancement
 *
 * Design Intent represents what designers specify - semantic color definitions
 * that will be transformed into EnrichedTokens via Momoto intelligence.
 *
 * CONTRACT:
 * - This is INPUT to token generation
 * - NO Momoto metadata yet (that comes from generation)
 * - Simple, human-readable definitions
 *
 * @module momoto-ui/domain/tokens/types/DesignIntent
 * @version 1.0.0
 */

import type { UIRole } from '../../types';

// ============================================================================
// DESIGN INTENT TOKEN
// ============================================================================

/**
 * Design Intent Token - Semantic definition before Momoto enrichment.
 *
 * This represents a designer's intent for a color token.
 * The generator will transform this into an EnrichedToken.
 */
export interface DesignIntentToken {
  /** Semantic name (e.g., 'primary', 'danger', 'surface') */
  name: string;

  /** Base color value (hex format) */
  value: string;

  /** UI role for Momoto decision context */
  role: UIRole;

  /** Optional context for Momoto quality evaluation */
  context?: {
    component?: string;
    intent?: string;
    usage?: string;
  };

  /** Optional description for documentation */
  description?: string;
}

// ============================================================================
// COMPONENT TOKEN DEFINITIONS
// ============================================================================

/**
 * Component token definition (before generation).
 *
 * Specifies base colors for a component state.
 * Generator will create complete token set with all states.
 */
export interface ComponentTokenDefinition {
  /** Background color (hex or reference to color token) */
  background: string;

  /** Text color (hex or reference to color token) */
  text: string;

  /** Border color (hex or reference to color token) */
  border?: string;
}

// ============================================================================
// DESIGN INTENT (COMPLETE DEFINITION)
// ============================================================================

/**
 * Complete design intent for a token theme.
 *
 * This is the INPUT to TokenThemeGenerator.
 * Represents semantic definitions that will be transformed
 * into complete TokenTheme with Momoto metadata.
 *
 * @example
 * ```typescript
 * const intent: DesignIntent = {
 *   version: '1.0.0',
 *   colors: {
 *     primary: {
 *       name: 'primary',
 *       value: '#3B82F6',
 *       role: 'accent',
 *       description: 'Primary brand color',
 *     },
 *     // ... more colors
 *   },
 *   semantics: {
 *     button: {
 *       primary: {
 *         background: 'primary',  // References colors.primary
 *         text: '#FFFFFF',
 *         border: 'primary',
 *       },
 *       // ... more button variants
 *     },
 *     // ... more components
 *   },
 * };
 * ```
 */
export interface DesignIntent {
  /** Design system version (semantic versioning) */
  version: string;

  /** Optional metadata */
  metadata?: {
    name?: string;
    description?: string;
    author?: string;
    createdAt?: string;
  };

  /** Primitive color tokens */
  colors: {
    primary: DesignIntentToken;
    secondary: DesignIntentToken;
    accent: DesignIntentToken;
    success: DesignIntentToken;
    warning: DesignIntentToken;
    error: DesignIntentToken;
    info: DesignIntentToken;

    background: {
      primary: DesignIntentToken;
      secondary: DesignIntentToken;
      tertiary: DesignIntentToken;
    };

    surface: {
      primary: DesignIntentToken;
      secondary: DesignIntentToken;
      elevated: DesignIntentToken;
    };

    border: {
      primary: DesignIntentToken;
      secondary: DesignIntentToken;
      focus: DesignIntentToken;
    };

    text: {
      primary: DesignIntentToken;
      secondary: DesignIntentToken;
      tertiary: DesignIntentToken;
      disabled: DesignIntentToken;
      inverse: DesignIntentToken;
    };
  };

  /** Component semantic tokens (base definitions) */
  semantics: {
    button: {
      primary: ComponentTokenDefinition;
      secondary: ComponentTokenDefinition;
      tertiary: ComponentTokenDefinition;
      danger: ComponentTokenDefinition;
    };

    textField: {
      default: ComponentTokenDefinition;
      error: ComponentTokenDefinition;
    };

    select: {
      default: ComponentTokenDefinition;
    };

    checkbox: {
      default: ComponentTokenDefinition;
    };

    switch: {
      default: ComponentTokenDefinition;
    };

    badge: {
      default: ComponentTokenDefinition;
      success: ComponentTokenDefinition;
      warning: ComponentTokenDefinition;
      error: ComponentTokenDefinition;
      info: ComponentTokenDefinition;
    };

    alert: {
      info: ComponentTokenDefinition;
      success: ComponentTokenDefinition;
      warning: ComponentTokenDefinition;
      error: ComponentTokenDefinition;
    };

    card: {
      default: ComponentTokenDefinition;
      elevated: ComponentTokenDefinition;
    };

    tooltip: {
      default: ComponentTokenDefinition;
    };
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Partial design intent for updates/overrides.
 */
export type PartialDesignIntent = Partial<DesignIntent>;

/**
 * Color reference - either hex value or reference to another token.
 *
 * Examples:
 * - '#3B82F6' (direct hex)
 * - 'primary' (reference to colors.primary)
 * - 'colors.primary' (explicit path)
 */
export type ColorReference = string;

// ============================================================================
// EXPORTS
// ============================================================================

export default DesignIntent;

/**
 * LAYER 1 CONTRACT:
 *
 * Design Intent represents WHAT designers want, not HOW to achieve it.
 *
 * ✅ CONTAINS:
 * - Semantic names
 * - Color values (hex)
 * - UI roles (for Momoto context)
 * - Descriptions
 *
 * ❌ DOES NOT CONTAIN:
 * - EnrichedToken instances
 * - Momoto metadata (qualityScore, confidence, etc.)
 * - State variants (hover, focus, disabled)
 * - Accessibility metrics
 *
 * These will be GENERATED by TokenThemeGenerator using Momoto intelligence.
 */
