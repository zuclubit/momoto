/**
 * Momoto Crystal Design System 2025
 *
 * Glass/Crystal UI component library powered by Momoto WASM
 * for perceptually accurate color token derivation
 *
 * @module @momoto-ui/crystal
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { Button, Input, Card } from '@momoto-ui/crystal';
 * import '@momoto-ui/crystal/styles';
 *
 * function App() {
 *   return (
 *     <Card variant="elevated">
 *       <h2>Welcome to Crystal Design</h2>
 *       <Input
 *         label="Email"
 *         type="email"
 *         placeholder="Enter your email"
 *       />
 *       <Button variant="primary">
 *         Submit
 *       </Button>
 *     </Card>
 *   );
 * }
 * ```
 */

// Import core styles
import './styles/crystal.css';

// Export all components
export * from './components';

// Export utilities
export {
  TokenDerivationEngine,
  type ColorOklch
} from './utils/token-engine';

export {
  LiquidGlass,
  Vibrancy,
  Surface,
  GlassPresets,
  GlassVariant,
  VibrancyLevel,
  Elevation,
  type GlassConfig,
} from './utils/liquid-glass';
