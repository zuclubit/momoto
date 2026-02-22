/**
 * @fileoverview React Button Adapter - Exports
 *
 * FASE 14: Core Consolidation
 *
 * Central export point for React Button components (refactored to use ButtonCore).
 *
 * @module momoto-ui/adapters/react/button
 * @version 2.0.0 (FASE 14)
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { Button, default } from './Button';
export { ButtonWithVariant } from './ButtonWithVariant';

// ============================================================================
// TYPES
// ============================================================================

export type {
  ButtonProps,
  ButtonVariantProps,
} from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Button with explicit tokens
 * ```tsx
 * import { Button } from '@momoto/ui-adapters/react/button';
 *
 * function MyComponent() {
 *   const primaryBg = submitBackgroundToken;
 *   const primaryText = submitTextToken;
 *
 *   const handleClick = () => {
 *     console.log('Clicked!');
 *   };
 *
 *   return (
 *     <Button
 *       label="Submit"
 *       backgroundColor={primaryBg}
 *       textColor={primaryText}
 *       onClick={handleClick}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 2: ButtonWithVariant (preferred)
 * ```tsx
 * import { ButtonWithVariant } from '@momoto/ui-adapters/react/button';
 *
 * function MyComponent() {
 *   const handleClick = () => {
 *     console.log('Clicked!');
 *   };
 *
 *   return (
 *     <ButtonWithVariant
 *       label="Submit"
 *       variant="primary"
 *       onClick={handleClick}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 3: With icon
 * ```tsx
 * import { ButtonWithVariant } from '@momoto/ui-adapters/react/button';
 * import { IconCheck } from './icons';
 *
 * function MyComponent() {
 *   return (
 *     <ButtonWithVariant
 *       label="Save"
 *       variant="primary"
 *       icon={<IconCheck />}
 *       iconPosition="left"
 *       onClick={handleSave}
 *     />
 *   );
 * }
 * ```
 *
 * # Example 4: Loading state
 * ```tsx
 * import { ButtonWithVariant } from '@momoto/ui-adapters/react/button';
 * import { useState } from 'react';
 *
 * function MyComponent() {
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   const handleSubmit = async () => {
 *     setIsLoading(true);
 *     await submitForm();
 *     setIsLoading(false);
 *   };
 *
 *   return (
 *     <ButtonWithVariant
 *       label="Submit"
 *       variant="primary"
 *       loading={isLoading}
 *       onClick={handleSubmit}
 *     />
 *   );
 * }
 * ```
 *
 * MIGRATION FROM FASE 11:
 * ```tsx
 * // Old import (FASE 11)
 * import { Button, ButtonWithVariant } from '@zuclubit/momoto-ui/components/primitives/Button';
 *
 * // New import (FASE 14)
 * import { Button, ButtonWithVariant } from '@momoto/ui-adapters/react/button';
 *
 * // Usage is IDENTICAL - no breaking changes
 * <ButtonWithVariant label="Submit" variant="primary" onClick={handleClick} />
 * ```
 */
