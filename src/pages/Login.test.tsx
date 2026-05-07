import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Login } from './Login';
import * as useAuthHook from '@/hooks/useAuth';
import { vi } from 'vitest';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  it('renders login form', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls login and navigates on submit', async () => {
    const loginMock = vi.fn();
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      login: loginMock,
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to dashboard when already authenticated', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { id: '1', name: 'Test', email: 'test@t.com', role: 'admin' },
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    );

    // Form should NOT be rendered when authenticated
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
  });
});
