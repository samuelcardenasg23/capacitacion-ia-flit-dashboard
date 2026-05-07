import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { afterEach } from 'vitest';

describe('useAuth', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('starts as unauthenticated by default', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('logs in and sets the user', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login();
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(localStorage.getItem('auth_fake')).toBe('true');
  });

  it('logs out and clears the user', () => {
    localStorage.setItem('auth_fake', 'true');
    const { result } = renderHook(() => useAuth());

    // initially authenticated due to localStorage mock setup above
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('auth_fake')).toBeNull();
  });
});
