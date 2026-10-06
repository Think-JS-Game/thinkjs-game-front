import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Home, User, ChevronRight, Moon, Sun, Flame, Zap } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';

export const DesktopSidebar: React.FC = () => {
  const { student } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const streak = 12;
  const totalXp = 240;

  const navItems = [
    { to: '/app/trail', label: 'Trilha', icon: Home },
    { to: '/app/profile', label: 'Perfil', icon: User },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-[260px] lg:w-[280px] fixed top-0 bottom-0 left-0 bg-white dark:bg-[var(--sand)] border-r border-[var(--border-color)] z-30 justify-between"
      aria-label="Navegação Lateral Desktop"
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-6 pb-4">
          <Link to="/app/trail" className="flex items-center">
            <span className="font-display font-black text-2xl tracking-tighter text-[var(--t900)]">
              Think<span className="text-[var(--yellow-dark)] dark:text-[var(--yellow)]">JS</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="px-4 mb-4">
          <button 
            type="button"
            onClick={() => navigate('/app/profile')}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] hover:border-[var(--t400)] transition-colors bg-white dark:bg-[var(--background)] shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--yellow)] text-black font-extrabold flex items-center justify-center flex-shrink-0">
                {student?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[var(--t900)]">
                  {student?.name?.split(' ')[0] || 'Ana'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Zap className="w-[10px] h-[10px] text-[var(--yellow-dark)] dark:text-[var(--yellow)] fill-current" />
                    <span className="text-[10px] font-bold text-[var(--yellow-dark)] dark:text-[var(--yellow)]">{totalXp} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-[10px] h-[10px] text-[var(--coral-mid)] fill-current" />
                    <span className="text-[10px] font-bold text-[var(--coral-mid)]">{streak}</span>
                  </div>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--t400)]" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[14px] transition-all ${
                    isActive
                      ? 'bg-[var(--yellow)] text-black shadow-sm'
                      : 'text-[var(--t600)] hover:bg-[var(--sand)] dark:hover:bg-[var(--background)] hover:text-[var(--t900)]'
                  }`
                }
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area (Theme Toggle) */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={toggle}
          className="w-full flex items-center justify-between p-3 rounded-xl text-[var(--t600)] hover:bg-[var(--sand)] dark:hover:bg-[var(--background)] hover:text-[var(--t900)] transition-colors"
        >
          <span className="text-[13px] font-bold">Aparência</span>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
