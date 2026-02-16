/**
 * Card Component Stories
 *
 * Interactive documentation and examples for Crystal Card
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card, MetricCard } from './Card';

// ============================================================================
// META - CARD
// ============================================================================

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Crystal Card component with glass effects. ' +
          'Flexible container for various content types with multiple variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'metric', 'action', 'elevated'],
      description: 'Visual variant of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size',
    },
    hoverable: {
      control: 'boolean',
      description: 'Enable hover effect',
    },
    interactive: {
      control: 'boolean',
      description: 'Make card interactive',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES - BASIC CARD
// ============================================================================

/**
 * Default card
 */
export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Card Title</h3>
        <p style={{ margin: 0, color: 'var(--crystal-text-secondary)' }}>
          This is a basic card with default styling.
        </p>
      </div>
    ),
  },
};

/**
 * Card with header
 */
export const WithHeader: Story = {
  args: {
    header: <h3 style={{ margin: 0 }}>Card Header</h3>,
    children: (
      <p style={{ margin: 0 }}>
        Card content goes here. This card has a dedicated header section.
      </p>
    ),
  },
};

/**
 * Card with footer
 */
export const WithFooter: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Feature Card</h3>
        <p style={{ margin: 0 }}>
          This card includes footer actions.
        </p>
      </div>
    ),
    footer: (
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ padding: '8px 16px' }}>Learn More</button>
        <button style={{ padding: '8px 16px' }}>Try Now</button>
      </div>
    ),
  },
};

/**
 * Elevated card
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Elevated Card</h3>
        <p style={{ margin: 0 }}>
          This card has higher elevation for emphasis.
        </p>
      </div>
    ),
  },
};

/**
 * Hoverable card
 */
export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Hover Me</h3>
        <p style={{ margin: 0 }}>
          This card lifts on hover.
        </p>
      </div>
    ),
  },
};

/**
 * Interactive/clickable card
 */
export const Interactive: Story = {
  args: {
    variant: 'action',
    interactive: true,
    onClick: () => alert('Card clicked!'),
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Click Me</h3>
        <p style={{ margin: 0 }}>
          This card is interactive and can be clicked.
        </p>
      </div>
    ),
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Loading Card</h3>
        <p style={{ margin: 0 }}>
          Content is loading...
        </p>
      </div>
    ),
  },
};

/**
 * No padding
 */
export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <div style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Custom Padding</h3>
        <p style={{ margin: 0 }}>
          This card has no default padding, allowing custom content layout.
        </p>
      </div>
    ),
  },
};

/**
 * Small padding
 */
export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Small Padding</h3>
        <p style={{ margin: 0 }}>Compact card with small padding.</p>
      </div>
    ),
  },
};

/**
 * Large padding
 */
export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Large Padding</h3>
        <p style={{ margin: 0 }}>Spacious card with large padding.</p>
      </div>
    ),
  },
};

// ============================================================================
// STORIES - METRIC CARD
// ============================================================================

/**
 * Basic metric card
 */
export const MetricBasic: Story = {
  render: () => (
    <MetricCard
      title="Total Revenue"
      value="$127,540"
      change="+12.5%"
      changeType="positive"
    />
  ),
};

/**
 * Metric card with negative change
 */
export const MetricNegative: Story = {
  render: () => (
    <MetricCard
      title="Bounce Rate"
      value="42.3%"
      change="-5.2%"
      changeType="negative"
    />
  ),
};

/**
 * Metric card with neutral change
 */
export const MetricNeutral: Story = {
  render: () => (
    <MetricCard
      title="Active Users"
      value="1,234"
      change="0.0%"
      changeType="neutral"
    />
  ),
};

/**
 * Metric card with icon
 */
export const MetricWithIcon: Story = {
  render: () => (
    <MetricCard
      title="New Customers"
      value="248"
      change="+18.2%"
      changeType="positive"
      icon={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
    />
  ),
};

/**
 * Metric dashboard example
 */
export const MetricDashboard: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        width: '600px',
      }}
    >
      <MetricCard
        title="Total Revenue"
        value="$127,540"
        change="+12.5%"
        changeType="positive"
      />
      <MetricCard
        title="New Customers"
        value="248"
        change="+18.2%"
        changeType="positive"
      />
      <MetricCard
        title="Bounce Rate"
        value="42.3%"
        change="-5.2%"
        changeType="negative"
      />
      <MetricCard
        title="Active Users"
        value="1,234"
        change="0.0%"
        changeType="neutral"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Card grid example
 */
export const CardGrid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        width: '900px',
      }}
    >
      <Card variant="elevated" hoverable>
        <h3 style={{ margin: '0 0 8px 0' }}>Feature 1</h3>
        <p style={{ margin: 0 }}>Description of feature one.</p>
      </Card>
      <Card variant="elevated" hoverable>
        <h3 style={{ margin: '0 0 8px 0' }}>Feature 2</h3>
        <p style={{ margin: 0 }}>Description of feature two.</p>
      </Card>
      <Card variant="elevated" hoverable>
        <h3 style={{ margin: '0 0 8px 0' }}>Feature 3</h3>
        <p style={{ margin: 0 }}>Description of feature three.</p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
