import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Bell, Lock, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      to: '/app/settings/profile',
      label: 'Editar Perfil',
      description: 'Nome, e-mail e ano de nascimento',
      icon: User,
      color: 'text-[var(--turquesa)] bg-[var(--turquesa-light)]/40',
    },
    {
      to: '/app/settings/notifications',
      label: 'Preferências de Notificação',
      description: 'Lembretes de estudo e e-mails',
      icon: Bell,
      color: 'text-[var(--yellow-dark)] bg-[var(--yellow-light)]/40',
    },
    {
      to: '/app/settings/password',
      label: 'Alterar Senha',
      description: 'Segurança da sua conta',
      icon: Lock,
      color: 'text-[var(--roxo)] bg-[var(--roxo-light)]/40',
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/app/login');
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold display-lg">Configurações</h1>
        <p className="text-sm text-[var(--muted-foreground)] body-md">
          Gerencie suas preferências de conta e segurança.
        </p>
      </div>

      {/* Main Settings List */}
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-xs divide-y divide-[var(--border)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--sand)] transition-colors min-h-[64px]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-extrabold text-base display-md text-[var(--foreground)]">
                    {item.label}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">{item.description}</div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
            </Link>
          );
        })}
      </div>

      {/* Danger Zone Options */}
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-xs divide-y divide-[var(--border)]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--sand)] transition-colors text-left min-h-[64px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--sand)] text-[var(--foreground)] flex items-center justify-center border border-[var(--border)]">
              <LogOut className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-base display-md text-[var(--foreground)]">
                Sair da Conta
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">Encerrar sua sessão atual</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
        </button>

        <Link
          to="/app/settings/delete-account"
          className="flex items-center justify-between p-4 sm:p-5 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors min-h-[64px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--coral-light)]/40 text-[var(--coral)] flex items-center justify-center border border-[var(--coral)]">
              <Trash2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-base display-md text-[var(--coral)]">
                Excluir Minha Conta (LGPD)
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">Ação permanente e irreversível</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--coral)]" />
        </Link>
      </div>
    </div>
  );
};
