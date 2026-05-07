import { render, screen } from '@testing-library/react';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders correct HTML element based on variant', () => {
    const { container } = render(<Typography variant="h1">Heading</Typography>);
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /heading/i })).toBeInTheDocument();
  });

  it('renders paragraph by default if no variant is passed or variant is body', () => {
    render(<Typography>Body text</Typography>);
    expect(screen.getByText(/body text/i).tagName).toBe('P');
  });

  it('applies custom className', () => {
    render(<Typography className="text-red-500">Red text</Typography>);
    expect(screen.getByText(/red text/i)).toHaveClass('text-red-500');
  });
});
