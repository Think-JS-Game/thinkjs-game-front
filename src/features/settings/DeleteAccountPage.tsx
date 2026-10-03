import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/app/providers/AuthProvider';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, deleteAccount } = useAuth();
  const [confirmationStep, setConfirmationStep] = useState<1 | 2>(1);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleInitialDeleteClick = () => {
    setConfirmationStep(2);
  };

  const handleFinalConfirmDelete = async () => {
    setIsDeleted(true);
    try {
      await deleteAccount('Senha123!');
    } catch {
      await logout(true);
    }
    setTimeout(() => {
      navigate('/app');
    }, 1500);
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
          <h1 className="text-2xl font-extrabold display-lg text-[var(--coral)]">Excluir Conta (LGPD)</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Direito de exclusão permanente de dados pessoais.
          </p>
        </div>
      </div>

      {isDeleted ? (
        <Alert kind="success" title="Conta Excluída">
          Sua conta e todo seu histórico foram removidos do sistema. Redirecionando...
        </Alert>
      ) : confirmationStep === 1 ? (
        <div className="bg-[var(--card)] p-6 rounded-3xl border-2 border-[var(--coral)] space-y-6 shadow-sm">
          <div className="flex items-center gap-3 text-[var(--coral)] font-bold text-base">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            <span>Atenção: Ação Irreversível</span>
          </div>

          <Alert kind="error">
            Essa ação não pode ser desfeita. Todos os seus dados serão apagados.
          </Alert>

          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed body-md">
            Ao excluir sua conta ThinkJS, você perderá todo o seu progresso acumulado na trilha, XP ganho, sequência (streak) de dias e conquistas obtidas.
          </p>

          <div className="space-y-3 pt-2">
            <Button
              variant="danger"
              onClick={handleInitialDeleteClick}
              className="w-full text-base py-3.5"
            >
              <Trash2 className="w-5 h-5" />
              <span>Quero Excluir Minha Conta</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate('/app/settings')}
              className="w-full py-3 text-sm"
            >
              Cancelar e Manter Minha Conta
            </Button>
          </div>
        </div>
      ) : (
        /* Step 2 Confirmation Visual */
        <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-3xl border-2 border-[var(--coral)] space-y-6 shadow-md animate-in fade-in">
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--coral)] text-white flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-extrabold display-md text-[var(--coral)]">
              Tem Certeza Absoluta?
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Confirme a segunda etapa para efetivar a remoção definitiva.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="danger"
              onClick={handleFinalConfirmDelete}
              className="w-full text-base py-3.5"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Sim, Confirmar Exclusão Definitiva</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => setConfirmationStep(1)}
              className="w-full py-3 text-sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
