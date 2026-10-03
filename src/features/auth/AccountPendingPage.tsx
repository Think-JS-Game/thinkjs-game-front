import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const AccountPendingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const guardianEmail = location.state?.guardianEmail || 'responsavel@email.com';

  const handleSimulateApproval = () => {
    navigate('/app/onboarding');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="pt-10 space-y-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[var(--yellow-light)] text-[var(--yellow-dark)] border-2 border-[var(--yellow-mid)] flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold display-lg">Conta Pendente de Autorização</h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Aguardando autorização do responsável para continuar.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sand)] border border-[var(--border)] text-left space-y-2 text-xs font-sans">
          <div className="font-bold text-[var(--foreground)]">Próximos passos:</div>
          <p className="text-[var(--muted-foreground)]">
            Enviamos uma mensagem para <strong>{guardianEmail}</strong>. Assim que seu responsável clicar no link de confirmação, seu acesso ao Onboarding será liberado automaticamente.
          </p>
        </div>

        {/* Demo trigger button for interactive navigation flow */}
        <div className="pt-4 space-y-3">
          <Button
            variant="primary"
            onClick={handleSimulateApproval}
            className="w-full py-3.5 text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Simular Confirmação do Responsável</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Link to="/app/login" className="block text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline pt-2">
            Voltar para o Login
          </Link>
        </div>
      </div>

      <div className="text-center py-6 text-xs text-[var(--muted-foreground)]">
        ThinkJS &bull; Plataforma Gamificada e Segura
      </div>
    </div>
  );
};
