import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders the logo text correctly', () => {
    render(<Logo />);
    expect(screen.getByText(/flit analytics/i)).toBeInTheDocument();
  });
});
