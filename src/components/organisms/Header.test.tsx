import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import * as useAuthHook from '@/hooks/useAuth';
import { vi } from 'vitest';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Header', () => {
  it('renders correctly and shows the user name', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { name: 'John Doe', email: 'j@d.com', role: 'admin', id: '1' },
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('Analytics Overview')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls logout when the logout button is clicked', async () => {
    const logoutMock = vi.fn();
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: logoutMock,
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutBtn);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
