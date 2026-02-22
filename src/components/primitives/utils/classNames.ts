/**
 * @fileoverview classNames - CSS Class Merging Utility
 *
 * FASE 11: UI Primitives & Component Kit
 *
 * Pure utility for merging CSS class names. NO perceptual logic,
 * NO decisions, just string manipulation.
 *
 * @module momoto-ui/components/primitives/utils/classNames
 * @version 1.0.0
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Value types accepted by classNames.
 */
type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean | undefined | null }
  | ClassValue[];

// ============================================================================
// IMPLEMENTATION
// ============================================================================

/**
 * Merge CSS class names conditionally.
 *
 * PURE UTILITY - NO LOGIC, NO DECISIONS.
 * Just concatenates strings and handles conditionals.
 *
 * @param classes - Class values to merge
 * @returns Space-separated class string
 *
 * @example
 * ```typescript
 * // Simple merge
 * classNames('button', 'primary'); // 'button primary'
 *
 * // Conditional classes
 * classNames('button', { 'button--disabled': disabled }); // 'button button--disabled'
 *
 * // Arrays and mixed
 * classNames('button', ['primary', 'large'], { 'active': isActive });
 * // 'button primary large active'
 *
 * // Filters out falsy values
 * classNames('button', null, undefined, false, 'primary'); // 'button primary'
 * ```
 */
export function classNames(...classes: ClassValue[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;

    const itemType = typeof item;

    if (itemType === 'string' || itemType === 'number') {
      result.push(String(item));
    } else if (Array.isArray(item)) {
      const inner = classNames(...item);
      if (inner) result.push(inner);
    } else if (itemType === 'object') {
      for (const key in item as Record<string, boolean | undefined | null>) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const value = (item as Record<string, boolean | undefined | null>)[key];
          if (value) result.push(key);
        }
      }
    }
  }

  return result.join(' ');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default classNames;

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ NO perceptual logic
 * ✅ NO color calculations
 * ✅ NO decisions
 * ✅ Pure string manipulation
 * ✅ No side effects
 *
 * This utility exists solely for developer convenience in merging
 * CSS classes. It makes NO decisions and has NO intelligence.
 */
