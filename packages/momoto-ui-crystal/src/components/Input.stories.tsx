/**
 * Input Component Stories
 *
 * Interactive documentation and examples for Crystal Input
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

// ============================================================================
// META
// ============================================================================

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Crystal Input component with glass effects. ' +
          'Supports various input types, validation states, and icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'number', 'tel', 'url'],
      description: 'Input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width input',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

/**
 * Default input
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'name@example.com',
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helperText: 'Choose a unique username',
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    label: 'Email',
    type: 'email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};

/**
 * Success state
 */
export const Success: Story = {
  args: {
    label: 'Username',
    value: 'johndoe',
    success: 'Username is available',
  },
};

/**
 * Password input
 */
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    showPasswordToggle: true,
  },
};

/**
 * Search input
 */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    iconLeft: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle
          cx="8"
          cy="8"
          r="5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 12L16 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

/**
 * Medium size (default)
 */
export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input',
  },
};

/**
 * Large size
 */
export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'Cannot edit',
    disabled: true,
  },
};

/**
 * Full width
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'Enter text...',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * With left icon
 */
export const WithIconLeft: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'name@example.com',
    iconLeft: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="4"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M2 6L9 11L16 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

/**
 * With right icon
 */
export const WithIconRight: Story = {
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    iconRight: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M14 4L4 14M14 4H8M14 4V10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

/**
 * Form example
 */
export const FormExample: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input
        label="Full Name"
        placeholder="John Doe"
        fullWidth
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        fullWidth
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        showPasswordToggle
        fullWidth
      />
      <Input
        label="Phone"
        type="tel"
        placeholder="+1 (555) 123-4567"
        fullWidth
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All sizes showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input
        label="Default"
        placeholder="Default state"
      />
      <Input
        label="Error"
        value="invalid"
        error="This field has an error"
      />
      <Input
        label="Success"
        value="valid"
        success="Looks good!"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
