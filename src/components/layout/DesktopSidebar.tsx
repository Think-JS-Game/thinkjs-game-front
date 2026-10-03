import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Compass, User, Settings, ArrowLeft } from 'lucide-react';
import { Chip } from '@/components/ui/Chip';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';

export const DesktopSidebar: React.FC = () => {
  const { xp, streakDays } = useStudentProgress();

  const navItems = [
    { to: '/app/trail', label: 'Trilha de Aprendizado', icon: Compass },
    { to: '/app/profile', label: 'Meu Perfil', icon: User },
    { to: '/app/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-64 fixed top-0 bottom-0 left-0 bg-[var(--card)] border-r border-[var(--border)] z-30 p-4 justify-between"
      aria-label="Navegação Lateral Desktop"
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link to="/app/trail" className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight text-[var(--foreground)] display-md">
              Think<span className="text-[var(--yellow)]">JS</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 p-1 rounded-md transition-colors"
            title="Voltar para a Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Site</span>
          </Link>
        </div>

        {/* HUD Chips */}
        <div className="flex flex-col gap-2 p-3 bg-[var(--sand)] rounded-xl border border-[var(--border)]">
          <div className="text-xs font-semibold text-[var(--muted-foreground)]">Seu Progresso:</div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip kind="xp" value={xp} />
            <Chip kind="streak" value={streakDays} />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl min-h-[44px] font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-[var(--yellow)] text-[var(--primary-foreground)] shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--sand)] hover:text-[var(--foreground)]'
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

      {/* Footer Info */}
      <div className="px-2 py-3 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
        ThinkJS v1.0 &bull; Aluno
      </div>
    </aside>
  );
};
