/**
 * Crystal Card Component
 *
 * Apple HIG-inspired cards with glass/crystal effects
 * Multiple variants for different use cases
 *
 * Features:
 * - Multiple variants (default, metric, action, elevated)
 * - Optional hover effects
 * - Header and footer sections
 * - Full keyboard accessibility
 *
 * @module @momoto-ui/crystal/components/Card
 */

import React from 'react';
import { clsx } from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

export type CardVariant = 'default' | 'metric' | 'action' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant determining visual style
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Padding size
   * @default 'md'
   */
  padding?: CardPadding;

  /**
   * Enable hover effect (lift on hover)
   * @default false
   */
  hoverable?: boolean;

  /**
   * Make card clickable/interactive
   * @default false
   */
  interactive?: boolean;

  /**
   * Header content
   */
  header?: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Main card content
   */
  children: React.ReactNode;

  /**
   * Click handler (makes card interactive automatically)
   */
  onClick?: () => void;

  /**
   * Card is in loading state
   * @default false
   */
  loading?: boolean;
}

// ============================================================================
// CARD COMPONENT
// ============================================================================

/**
 * Crystal Card - Glass effect card container
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * // Metric card with header
 * <Card
 *   variant="metric"
 *   header={<h3>Total Revenue</h3>}
 * >
 *   <p className="metric-value">$127,540</p>
 *   <p className="metric-change">+12.5%</p>
 * </Card>
 *
 * // Interactive card
 * <Card
 *   variant="action"
 *   hoverable
 *   interactive
 *   onClick={() => handleCardClick()}
 * >
 *   <h3>Click me</h3>
 *   <p>This card is interactive</p>
 * </Card>
 *
 * // Elevated card with footer
 * <Card
 *   variant="elevated"
 *   footer={<button>Learn More</button>}
 * >
 *   <h3>Feature Title</h3>
 *   <p>Feature description</p>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      interactive = false,
      header,
      footer,
      children,
      onClick,
      loading = false,
      className,
      ...restProps
    },
    ref
  ) => {
    // ──────────────────────────────────────────────────────────────────────
    // DERIVED STATE
    // ──────────────────────────────────────────────────────────────────────

    const isInteractive = interactive || !!onClick;
    const isHoverable = hoverable || isInteractive;

    // ──────────────────────────────────────────────────────────────────────
    // CLASS NAMES
    // ──────────────────────────────────────────────────────────────────────

    const cardClasses = clsx(
      'crystal-card-base',
      `crystal-card-${variant}`,
      `crystal-card-padding-${padding}`,
      {
        'crystal-card-hoverable': isHoverable,
        'crystal-card-interactive': isInteractive,
        'crystal-card-loading': loading,
      },
      className
    );

    // ──────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ──────────────────────────────────────────────────────────────────────

    const handleClick = () => {
      if (onClick && !loading) {
        onClick();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && !loading && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleClick();
      }
    };

    // ──────────────────────────────────────────────────────────────────────
    // RENDER
    // ──────────────────────────────────────────────────────────────────────

    const CardElement = isInteractive ? 'div' : 'div';

    return (
      <CardElement
        ref={ref}
        className={cardClasses}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-busy={loading}
        {...restProps}
      >
        {loading && (
          <div className="crystal-card-loading-overlay">
            <LoadingSpinner />
          </div>
        )}

        {header && (
          <div className="crystal-card-header">
            {header}
          </div>
        )}

        <div className="crystal-card-content">
          {children}
        </div>

        {footer && (
          <div className="crystal-card-footer">
            {footer}
          </div>
        )}
      </CardElement>
    );
  }
);

Card.displayName = 'CrystalCard';

// ============================================================================
// METRIC CARD (Specialized variant)
// ============================================================================

export interface MetricCardProps extends Omit<CardProps, 'variant' | 'children'> {
  /**
   * Metric title
   */
  title: string;

  /**
   * Metric value (primary display)
   */
  value: string | number;

  /**
   * Optional change indicator (e.g., "+12.5%")
   */
  change?: string;

  /**
   * Change direction
   */
  changeType?: 'positive' | 'negative' | 'neutral';

  /**
   * Optional icon
   */
  icon?: React.ReactNode;

  /**
   * Optional trend chart/sparkline
   */
  trend?: React.ReactNode;
}

/**
 * MetricCard - Specialized card for displaying metrics/KPIs
 *
 * @example
 * ```tsx
 * <MetricCard
 *   title="Total Revenue"
 *   value="$127,540"
 *   change="+12.5%"
 *   changeType="positive"
 *   icon={<DollarIcon />}
 * />
 * ```
 */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      value,
      change,
      changeType = 'neutral',
      icon,
      trend,
      className,
      ...restProps
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        variant="metric"
        className={clsx('crystal-metric-card', className)}
        {...restProps}
      >
        <div className="crystal-metric-header">
          {icon && <div className="crystal-metric-icon">{icon}</div>}
          <h3 className="crystal-metric-title">{title}</h3>
        </div>

        <div className="crystal-metric-body">
          <p className="crystal-metric-value">{value}</p>

          {change && (
            <p className={clsx('crystal-metric-change', `crystal-metric-change-${changeType}`)}>
              {change}
            </p>
          )}
        </div>

        {trend && (
          <div className="crystal-metric-trend">
            {trend}
          </div>
        )}
      </Card>
    );
  }
);

MetricCard.displayName = 'CrystalMetricCard';

// ============================================================================
// LOADING SPINNER
// ============================================================================

const LoadingSpinner: React.FC = () => (
  <svg
    className="crystal-card-spinner"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16"
      cy="16"
      r="12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="75.4 75.4"
      strokeDashoffset="75.4"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 16 16"
        to="360 16 16"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

// ============================================================================
// EXPORTS
// ============================================================================

export default Card;
