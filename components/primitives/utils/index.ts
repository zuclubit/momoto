/**
 * @fileoverview Utility Exports
 *
 * FASE 11: UI Primitives & Component Kit
 *
 * Pure utilities for component development.
 * NO perceptual logic, NO decisions, just helpers.
 *
 * @module momoto-ui/components/primitives/utils
 * @version 1.0.0
 */

export { classNames, classNames as default } from './classNames';
export type { AriaProps, AriaRole } from './aria';
export {
  generateAriaId,
  filterAriaProps,
  mergeAriaDescribedBy,
  createAriaLiveRegion,
  createFormFieldAria,
  createButtonAria,
} from './aria';
