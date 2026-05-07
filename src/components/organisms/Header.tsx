import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="font-semibold text-lg">Analytics Overview</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="bg-muted rounded-full p-2">
            <UserIcon size={16} />
          </div>
          {user?.name}
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
}
