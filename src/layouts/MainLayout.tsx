import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { useAuth } from '@/hooks/useAuth';

export function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
