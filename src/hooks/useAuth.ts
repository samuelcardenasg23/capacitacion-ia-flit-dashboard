import { useState } from 'react';
import type { User } from '@/types';

const MOCK_USER: User = {
  id: 'usr_123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'admin',
};

function getInitialUser(): User | null {
  const storedAuth = localStorage.getItem('auth_fake');
  return storedAuth ? MOCK_USER : null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const isLoading = false;

  const login = () => {
    localStorage.setItem('auth_fake', 'true');
    setUser(MOCK_USER);
  };

  const logout = () => {
    localStorage.removeItem('auth_fake');
    setUser(null);
  };

  return { user, login, logout, isLoading, isAuthenticated: !!user };
}
