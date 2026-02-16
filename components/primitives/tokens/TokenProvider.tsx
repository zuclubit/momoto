/**
 * @fileoverview TokenProvider - React Context for Token Theme
 *
 * FASE 11: UI Primitives & Component Kit
 *
 * Provides token theme to component tree via React Context.
 * Components access tokens via `useToken()` or `useTokenTheme()` hooks.
 *
 * CONTRACT:
 * - Tokens are READ-ONLY
 * - Components CANNOT modify tokens
 * - Theme is provided at app root
 * - No default theme (explicit is better than implicit)
 *
 * @module momoto-ui/components/primitives/tokens/TokenProvider
 * @version 1.0.0
 */

import React, { createContext, useContext } from 'react';
import type { TokenTheme, TokenPath } from './TokenTheme.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// CONTEXT
// ============================================================================

/**
 * Token theme context.
 *
 * Provides access to the complete token theme for all components.
 */
const TokenContext = createContext<TokenTheme | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export interface TokenProviderProps {
  /** Complete token theme (ALL tokens required) */
  theme: TokenTheme;

  /** React children */
  children: React.ReactNode;
}

/**
 * TokenProvider - Provides token theme to component tree.
 *
 * MUST be placed at the root of your application.
 * Components will throw if used outside TokenProvider.
 *
 * @example
 * ```tsx
 * import { TokenProvider } from '@zuclubit/momoto-ui/components/primitives';
 * import { createTokenTheme } from './theme';
 *
 * function App() {
 *   const theme = createTokenTheme(); // Your theme generator
 *
 *   return (
 *     <TokenProvider theme={theme}>
 *       <YourApp />
 *     </TokenProvider>
 *   );
 * }
 * ```
 */
export function TokenProvider({
  theme,
  children,
}: TokenProviderProps): React.ReactElement {
  // Validate theme is provided
  if (!theme) {
    throw new Error(
      'TokenProvider requires a theme prop. ' +
      'Theme must be a complete TokenTheme object with all required tokens.'
    );
  }

  return (
    <TokenContext.Provider value={theme}>
      {children}
    </TokenContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * useTokenTheme - Access complete token theme.
 *
 * Returns the entire theme object. Use this when you need
 * to access multiple related tokens.
 *
 * @throws Error if used outside TokenProvider
 *
 * @example
 * ```tsx
 * function Button({ variant = 'primary' }: ButtonProps) {
 *   const theme = useTokenTheme();
 *   const tokens = theme.button[variant];
 *
 *   return (
 *     <button style={{
 *       backgroundColor: tokens.background.value.hex,
 *       color: tokens.text.value.hex,
 *     }}>
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function useTokenTheme(): TokenTheme {
  const theme = useContext(TokenContext);

  if (!theme) {
    throw new Error(
      'useTokenTheme must be used within TokenProvider. ' +
      'Wrap your app with <TokenProvider theme={...}>'
    );
  }

  return theme;
}

/**
 * useToken - Access a single token by path.
 *
 * Provides convenient access to nested tokens using dot notation.
 *
 * @param path - Token path (e.g., 'button.primary.background')
 * @returns Enriched token at the specified path
 *
 * @throws Error if path is invalid or token not found
 *
 * @example
 * ```tsx
 * function CustomButton() {
 *   const bg = useToken('button.primary.background');
 *   const text = useToken('button.primary.text');
 *
 *   return (
 *     <button style={{
 *       backgroundColor: bg.value.hex,
 *       color: text.value.hex,
 *     }}>
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function useToken(path: TokenPath): EnrichedToken {
  const theme = useTokenTheme();
  const token = getTokenByPath(theme, path);

  if (!token) {
    throw new Error(
      `Token not found at path: "${path}". ` +
      `Check that your token theme includes this path.`
    );
  }

  return token;
}

/**
 * useTokens - Access multiple tokens by paths.
 *
 * Convenience hook for accessing multiple tokens at once.
 *
 * @param paths - Array of token paths
 * @returns Array of enriched tokens in the same order
 *
 * @example
 * ```tsx
 * function CustomComponent() {
 *   const [bg, text, border] = useTokens([
 *     'button.primary.background',
 *     'button.primary.text',
 *     'button.primary.border',
 *   ]);
 *
 *   return <button style={{
 *     backgroundColor: bg.value.hex,
 *     color: text.value.hex,
 *     borderColor: border.value.hex,
 *   }} />;
 * }
 * ```
 */
export function useTokens(paths: TokenPath[]): EnrichedToken[] {
  const theme = useTokenTheme();
  return paths.map(path => {
    const token = getTokenByPath(theme, path);
    if (!token) {
      throw new Error(`Token not found at path: "${path}"`);
    }
    return token;
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get token by dot-notation path.
 *
 * Traverses theme object using path segments.
 *
 * @param theme - Token theme
 * @param path - Dot-separated path (e.g., 'button.primary.background')
 * @returns Token at path, or null if not found
 *
 * @internal
 */
function getTokenByPath(theme: TokenTheme, path: TokenPath): EnrichedToken | null {
  const segments = path.split('.');
  let current: any = theme;

  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return null;
    }
  }

  // Verify it's an EnrichedToken (has required properties)
  if (isEnrichedToken(current)) {
    return current as EnrichedToken;
  }

  return null;
}

/**
 * Type guard for EnrichedToken.
 *
 * Checks if object has required EnrichedToken properties.
 *
 * @param obj - Object to check
 * @returns true if obj is an EnrichedToken
 *
 * @internal
 */
function isEnrichedToken(obj: any): boolean {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'value' in obj &&
    'qualityScore' in obj &&
    'confidence' in obj &&
    'reason' in obj &&
    'sourceDecisionId' in obj
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default TokenProvider;
export { TokenContext };

/**
 * USAGE EXAMPLES:
 *
 * 1. Setup TokenProvider:
 * ```tsx
 * import { TokenProvider } from '@zuclubit/momoto-ui/components/primitives';
 * import { createTokenTheme } from './theme';
 *
 * function App() {
 *   const theme = createTokenTheme();
 *   return (
 *     <TokenProvider theme={theme}>
 *       <YourApp />
 *     </TokenProvider>
 *   );
 * }
 * ```
 *
 * 2. Use complete theme:
 * ```tsx
 * function Button({ variant = 'primary' }) {
 *   const theme = useTokenTheme();
 *   const tokens = theme.button[variant];
 *   // Access tokens.background, tokens.text, etc.
 * }
 * ```
 *
 * 3. Use single token:
 * ```tsx
 * function CustomComponent() {
 *   const bg = useToken('colors.primary');
 *   return <div style={{ backgroundColor: bg.value.hex }} />;
 * }
 * ```
 *
 * 4. Use multiple tokens:
 * ```tsx
 * function Card() {
 *   const [bg, text, border] = useTokens([
 *     'card.default.background',
 *     'card.default.text',
 *     'card.default.border',
 *   ]);
 * }
 * ```
 *
 * CONTRACT ENFORCEMENT:
 * - ✅ Theme is required (no defaults)
 * - ✅ Throws if used outside provider
 * - ✅ Throws if token path not found
 * - ✅ Returns READ-ONLY tokens
 * - ✅ No silent fallbacks
 */
