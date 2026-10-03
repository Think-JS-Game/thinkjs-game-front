import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, User, Settings } from 'lucide-react';

export const TabBar: React.FC = () => {
  const navItems = [
    { to: '/app/trail', label: 'Trilha', icon: Compass },
    { to: '/app/profile', label: 'Perfil', icon: User },
    { to: '/app/settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)] border-t border-[var(--border)] px-4 py-2 shadow-lg"
      aria-label="Navegação Principal Mobile"
    >
      <ul className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-3 rounded-xl transition-colors ${
                    isActive
                      ? 'text-[var(--primary-foreground)] bg-[var(--yellow)] font-bold'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sand)]'
                  }`
                }
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
                <span className="text-[11px] mt-1 font-medium">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
