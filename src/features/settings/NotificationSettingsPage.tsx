import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft, Save } from 'lucide-react';

export const NotificationSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [emailReminders, setEmailReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/app/settings')}
          className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sand)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold display-lg">Preferências de Notificação</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Escolha quando e como prefere ser lembrado de praticar.
          </p>
        </div>
      </div>

      {savedSuccess && <Alert kind="success">Preferências de notificação salvas!</Alert>}

      <form onSubmit={handleSave} className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] space-y-5 shadow-xs">
        <Checkbox
          checked={emailReminders}
          onChange={(e) => setEmailReminders(e.target.checked)}
          label={
            <div>
              <div className="font-bold text-sm">Lembretes por E-mail</div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Receba avisos para praticar quando estiver há mais de 2 dias sem acessar.
              </div>
            </div>
          }
        />

        <Checkbox
          checked={streakAlerts}
          onChange={(e) => setStreakAlerts(e.target.checked)}
          label={
            <div>
              <div className="font-bold text-sm">Alertas de Sequência (Streak)</div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Notificações para não perder seu progresso diário de estudos.
              </div>
            </div>
          }
        />

        <Checkbox
          checked={newsAlerts}
          onChange={(e) => setNewsAlerts(e.target.checked)}
          label={
            <div>
              <div className="font-bold text-sm">Novidades e Novos Módulos</div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Fique por dentro do lançamento de novos exercícios e recursos.
              </div>
            </div>
          }
        />

        <div className="pt-2">
          <Button variant="primary" type="submit" className="w-full text-base py-3.5">
            <Save className="w-5 h-5" />
            <span>Salvar Preferências</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
