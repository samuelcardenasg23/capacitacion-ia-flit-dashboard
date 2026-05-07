import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input aria-label="username" placeholder="Enter username" />);
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it('allows user to type', async () => {
    render(<Input aria-label="username" />);
    const input = screen.getByRole('textbox', { name: /username/i });

    await userEvent.type(input, 'john_doe');
    expect(input).toHaveValue('john_doe');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input aria-label="username" disabled />);
    expect(screen.getByRole('textbox', { name: /username/i })).toBeDisabled();
  });
});
