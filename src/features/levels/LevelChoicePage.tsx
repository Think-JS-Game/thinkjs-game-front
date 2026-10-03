import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, HelpCircle, ArrowRight } from 'lucide-react';

export const LevelChoicePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="my-auto py-8 space-y-8 text-center">
        <div className="space-y-3">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Nivelamento
          </span>
          <h1 className="text-3xl font-extrabold display-lg">Como Você Quer Começar?</h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            Você pode selecionar seu nível diretamente ou fazer um teste curto de nivelamento.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/app/level')}
            className="w-full p-5 rounded-2xl border-2 border-[var(--yellow-dark)] bg-[var(--yellow-light)]/40 text-left hover:bg-[var(--yellow-light)] transition-all flex items-center justify-between min-h-[72px]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--yellow)] text-[var(--t900)] flex items-center justify-center">
                <Compass className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base display-md text-[var(--foreground)]">Escolher um Nível</h3>
                <span className="text-xs text-[var(--muted-foreground)]">Selecione diretamente entre os 5 níveis disponíveis</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--t900)] flex-shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/placement-test')}
            className="w-full p-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] text-left hover:bg-[var(--sand)] transition-all flex items-center justify-between min-h-[72px]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--turquesa-light)] text-[var(--turquesa)] flex items-center justify-center">
                <HelpCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base display-md text-[var(--foreground)]">Não Sei Meu Nível</h3>
                <span className="text-xs text-[var(--muted-foreground)]">Responda a 3 perguntas para descobrir onde começar</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0" />
          </button>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-[var(--muted-foreground)]">
        Você poderá alterar seu nível a qualquer momento no perfil.
      </div>
    </div>
  );
};
