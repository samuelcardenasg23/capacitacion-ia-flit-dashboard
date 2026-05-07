import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label and input correctly', () => {
    render(<FormField id="email" label="Email Address" type="email" />);

    expect(screen.getByText(/email address/i)).toBeInTheDocument();

    // Verify accessibility linkage
    const input = screen.getByRole('textbox', { name: /email address/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
  });

  it('renders error message when error prop is provided', () => {
    render(<FormField id="email" label="Email" type="email" error="Invalid email" />);

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    const input = screen.getByRole('textbox', { name: /email/i });
    expect(input).toHaveClass('border-red-500');
  });

  it('does not render error message when no error', () => {
    render(<FormField id="email" label="Email" type="email" />);

    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });
});
