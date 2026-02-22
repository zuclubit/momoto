/**
 * @fileoverview React TextField Adapter - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for React TextField components.
 *
 * @module momoto-ui/adapters/react/textfield
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { TextField, default } from './TextField';

// ============================================================================
// TYPES
// ============================================================================

export type { TextFieldProps } from './types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Basic TextField
 * ```tsx
 * import { TextField } from '@momoto/ui-adapters/react/textfield';
 * import { useState } from 'react';
 *
 * function MyComponent() {
 *   const [email, setEmail] = useState('');
 *
 *   return (
 *     <TextField
 *       label="Email"
 *       value={email}
 *       onChange={setEmail}
 *       backgroundColor={inputBgToken}
 *       textColor={inputTextToken}
 *       placeholder="Enter your email"
 *       type="email"
 *     />
 *   );
 * }
 * ```
 *
 * # Example 2: TextField with validation states
 * ```tsx
 * import { TextField } from '@momoto/ui-adapters/react/textfield';
 * import { useState } from 'react';
 *
 * function MyComponent() {
 *   const [password, setPassword] = useState('');
 *   const [error, setError] = useState(false);
 *
 *   const handleChange = (value: string) => {
 *     setPassword(value);
 *     setError(value.length < 8);
 *   };
 *
 *   return (
 *     <TextField
 *       label="Password"
 *       value={password}
 *       onChange={handleChange}
 *       backgroundColor={inputBgToken}
 *       textColor={inputTextToken}
 *       error={error}
 *       errorBorderColor={errorBorderToken}
 *       helperText={error ? 'Password must be at least 8 characters' : undefined}
 *       type="password"
 *       required
 *     />
 *   );
 * }
 * ```
 *
 * # Example 3: Multiline TextField (textarea)
 * ```tsx
 * import { TextField } from '@momoto/ui-adapters/react/textfield';
 * import { useState } from 'react';
 *
 * function MyComponent() {
 *   const [message, setMessage] = useState('');
 *
 *   return (
 *     <TextField
 *       label="Message"
 *       value={message}
 *       onChange={setMessage}
 *       backgroundColor={inputBgToken}
 *       textColor={inputTextToken}
 *       placeholder="Enter your message"
 *       multiline
 *       rows={5}
 *       fullWidth
 *     />
 *   );
 * }
 * ```
 *
 * # Example 4: TextField with all states
 * ```tsx
 * import { TextField } from '@momoto/ui-adapters/react/textfield';
 * import { useState } from 'react';
 *
 * function MyComponent() {
 *   const [value, setValue] = useState('');
 *   const [isValid, setIsValid] = useState(false);
 *
 *   return (
 *     <TextField
 *       label="Username"
 *       value={value}
 *       onChange={setValue}
 *       backgroundColor={inputBgToken}
 *       textColor={inputTextToken}
 *       borderColor={inputBorderToken}
 *       hoverBorderColor={hoverBorderToken}
 *       focusBorderColor={focusBorderToken}
 *       successBorderColor={successBorderToken}
 *       errorBorderColor={errorBorderToken}
 *       success={isValid}
 *       helperText={isValid ? 'Username is available' : 'Enter a username'}
 *       required
 *       size="md"
 *     />
 *   );
 * }
 * ```
 */
