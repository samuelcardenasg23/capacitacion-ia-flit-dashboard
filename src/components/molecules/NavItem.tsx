
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
}

export function NavItem({ to, icon, label, collapsed = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary',
          isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted'
        )
      }
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
