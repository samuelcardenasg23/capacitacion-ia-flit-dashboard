import { render, screen } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import * as useAuthHook from '@/hooks/useAuth';
import { vi } from 'vitest';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('MainLayout', () => {
  it('shows loading state when auth is loading', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: true,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders outlet when authenticated', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { id: '1', name: 'Test', email: 'test@t.com', role: 'admin' },
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );

    // Sidebar should be rendered
    expect(screen.getByText(/flit analytics/i)).toBeInTheDocument();
    // Header should be rendered
    expect(screen.getByText(/analytics overview/i)).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <MainLayout />
      </MemoryRouter>
    );

    // Layout content should NOT be rendered
    expect(screen.queryByText(/flit analytics/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/analytics overview/i)).not.toBeInTheDocument();
  });
});
