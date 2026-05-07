import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NavItem } from './NavItem';
import { Home } from 'lucide-react';

describe('NavItem', () => {
  it('renders correctly with label', () => {
    render(
      <BrowserRouter>
        <NavItem to="/dashboard" icon={<Home />} label="Dashboard" />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('hides label when collapsed', () => {
    render(
      <BrowserRouter>
        <NavItem to="/dashboard" icon={<Home />} label="Dashboard" collapsed />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
