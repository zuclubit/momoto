/**
 * @fileoverview React Switch Types
 * FASE 15.5: Component Expansion - Switch
 */

import type { SwitchSize, SwitchStyles } from '../../core/switch/switchCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;

  trackBackgroundColor: EnrichedToken;
  trackBorderColor: EnrichedToken;
  thumbColor: EnrichedToken;

  hoverTrackBackgroundColor?: EnrichedToken;
  hoverTrackBorderColor?: EnrichedToken;
  hoverThumbColor?: EnrichedToken;

  focusTrackBackgroundColor?: EnrichedToken;
  focusTrackBorderColor?: EnrichedToken;
  focusThumbColor?: EnrichedToken;
  focusOutlineColor?: EnrichedToken;

  checkedTrackBackgroundColor: EnrichedToken;
  checkedTrackBorderColor?: EnrichedToken;
  checkedThumbColor?: EnrichedToken;

  checkedHoverTrackBackgroundColor?: EnrichedToken;
  checkedHoverTrackBorderColor?: EnrichedToken;
  checkedHoverThumbColor?: EnrichedToken;

  checkedFocusTrackBackgroundColor?: EnrichedToken;
  checkedFocusTrackBorderColor?: EnrichedToken;
  checkedFocusThumbColor?: EnrichedToken;
  checkedFocusOutlineColor?: EnrichedToken;

  disabledTrackBackgroundColor?: EnrichedToken;
  disabledTrackBorderColor?: EnrichedToken;
  disabledThumbColor?: EnrichedToken;
  disabledLabelColor?: EnrichedToken;

  checkedDisabledTrackBackgroundColor?: EnrichedToken;
  checkedDisabledTrackBorderColor?: EnrichedToken;
  checkedDisabledThumbColor?: EnrichedToken;

  errorTrackBackgroundColor?: EnrichedToken;
  errorTrackBorderColor?: EnrichedToken;
  errorThumbColor?: EnrichedToken;
  errorMessageColor?: EnrichedToken;

  errorHoverTrackBackgroundColor?: EnrichedToken;
  errorHoverTrackBorderColor?: EnrichedToken;
  errorHoverThumbColor?: EnrichedToken;

  errorFocusTrackBackgroundColor?: EnrichedToken;
  errorFocusTrackBorderColor?: EnrichedToken;
  errorFocusThumbColor?: EnrichedToken;
  errorFocusOutlineColor?: EnrichedToken;

  labelColor?: EnrichedToken;
  helperTextColor?: EnrichedToken;

  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  size?: SwitchSize;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  style?: Partial<SwitchStyles>;
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaLabelledby?: string;
  testId?: string;
  showQualityWarnings?: boolean;
}
