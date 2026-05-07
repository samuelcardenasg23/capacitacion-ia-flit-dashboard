import { useState, useEffect } from 'react';
import type { User } from '@/types';

const MOCK_USER: User = {
  id: 'usr_123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'admin',
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth_fake');
    if (storedAuth) {
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

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
