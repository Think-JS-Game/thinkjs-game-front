import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User } from 'lucide-react';

export const TabBar: React.FC = () => {
  const navItems = [
    { to: '/app/trail', label: 'Trilha', icon: Home },
    { to: '/app/profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[var(--sand)] border-t border-[var(--border-color)] pb-safe pt-2 px-6 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]"
      aria-label="Navegação Principal Mobile"
    >
      <ul className="flex items-center justify-around w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-2 transition-colors ${
                    isActive
                      ? 'text-[var(--yellow-dark)] dark:text-[var(--yellow)]'
                      : 'text-[var(--t500)] hover:text-[var(--t800)]'
                  }`
                }
              >
                <Icon className="w-6 h-6 stroke-[2]" />
                <span className="text-[11px] font-bold mt-1.5">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
