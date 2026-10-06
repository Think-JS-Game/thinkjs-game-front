import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Bell, Lock, LogOut, Trash2, ChevronRight, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/app/login');
  };

  const menuItems = [
    {
      to: '/app/settings/profile',
      label: 'Editar perfil',
      icon: User,
    },
    {
      to: '/app/settings/notifications',
      label: 'Notificações',
      icon: Bell,
    },
    {
      to: '/app/settings/password',
      label: 'Alterar senha',
      icon: Lock,
    },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto py-6 sm:py-8 px-4 sm:px-6 md:px-8 bg-[var(--cream)] min-h-full">
      
      {/* Header Modal-like container */}
      <div className="bg-white dark:bg-[var(--sand)] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border-color)] min-h-[600px] md:min-h-[800px]">
        
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-[var(--t800)] hover:text-[var(--t900)] transition-colors rounded-full hover:bg-[var(--sand)] dark:hover:bg-[var(--background)]"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          
          <h1 className="font-display font-extrabold text-[18px] md:text-[15px] text-[var(--t900)]">
            Configurações
          </h1>
          
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 md:hidden flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* List of Settings */}
        <div className="space-y-2 px-2 md:px-6">
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between py-4 group"
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-[var(--t600)] group-hover:text-[var(--t900)] transition-colors stroke-[2]" />
                  <span className="font-bold text-[15px] text-[var(--t800)] group-hover:text-[var(--t900)] transition-colors">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--t400)] group-hover:text-[var(--t600)] transition-colors" />
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between py-4 group text-left"
          >
            <div className="flex items-center gap-4">
              <LogOut className="w-5 h-5 text-[var(--t600)] group-hover:text-[var(--t900)] transition-colors stroke-[2]" />
              <span className="font-bold text-[15px] text-[var(--t800)] group-hover:text-[var(--t900)] transition-colors">
                Sair da conta
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--t400)] group-hover:text-[var(--t600)] transition-colors" />
          </button>

          <button
            type="button"
            className="w-full flex items-center py-4 group text-left pt-6"
          >
            <div className="flex items-center gap-4">
              <Trash2 className="w-5 h-5 text-red-500 stroke-[2]" />
              <span className="font-bold text-[15px] text-red-500">
                Excluir conta
              </span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
