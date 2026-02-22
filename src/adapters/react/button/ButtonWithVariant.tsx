/**
 * @fileoverview ButtonWithVariant - React Adapter with Theme Variant
 *
 * FASE 14: Core Consolidation
 *
 * React Button that resolves tokens from theme based on variant.
 * This is the preferred API for most use cases.
 *
 * @module momoto-ui/adapters/react/button/ButtonWithVariant
 * @version 2.0.0 (FASE 14)
 */

import React from 'react';
import { Button } from './Button';
import { useTokenTheme } from '../../../components/primitives/tokens/TokenProvider';
import type { ButtonVariantProps } from './types';

/**
 * ButtonWithVariant - Button that gets tokens from theme.
 *
 * Preferred API for most use cases. Automatically resolves
 * tokens from theme based on variant.
 *
 * FASE 14: Now uses refactored Button component (which uses ButtonCore).
 *
 * @example
 * ```tsx
 * <ButtonWithVariant
 *   label="Submit"
 *   variant="primary"
 *   onClick={handleSubmit}
 * />
 * ```
 */
export function ButtonWithVariant({
  variant = 'primary',
  ...props
}: ButtonVariantProps): React.ReactElement {
  const theme = useTokenTheme();
  const tokens = theme.button[variant];

  return (
    <Button
      backgroundColor={tokens.background}
      textColor={tokens.text}
      borderColor={tokens.border}
      hoverBackgroundColor={tokens.hover.background}
      hoverTextColor={tokens.hover.text}
      hoverBorderColor={tokens.hover.border}
      focusBackgroundColor={tokens.focus.background}
      focusTextColor={tokens.focus.text}
      focusBorderColor={tokens.focus.border}
      focusOutlineColor={tokens.focus.outline}
      activeBackgroundColor={tokens.active.background}
      activeTextColor={tokens.active.text}
      activeBorderColor={tokens.active.border}
      disabledBackgroundColor={tokens.disabled.background}
      disabledTextColor={tokens.disabled.text}
      disabledBorderColor={tokens.disabled.border}
      {...props}
    />
  );
}

export default ButtonWithVariant;

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Token resolution from theme
 *    - Accesses theme.button[variant]
 *    - Passes resolved tokens to Button
 *
 * ✅ Zero logic duplication
 *    - Delegates to Button component
 *    - Button delegates to ButtonCore
 *
 * ✅ Framework-specific theme access
 *    - Uses React's useTokenTheme() hook
 *    - Same contract as Vue/Svelte/Angular theme access
 */
