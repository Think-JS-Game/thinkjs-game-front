import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type FeedbackModalKind = 'success' | 'error';

interface FeedbackModalProps {
  isOpen: boolean;
  kind: FeedbackModalKind;
  xpEarned?: number;
  explanation?: string;
  solutionCode?: string;
  onContinue: () => void;
  className?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  kind,
  xpEarned = 20,
  explanation,
  solutionCode,
  onContinue,
  className = '',
}) => {
  if (!isOpen) return null;

  const isSuccess = kind === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-2 space-y-6 ${
          isSuccess
            ? 'bg-[var(--menta-light)] border-[var(--menta)] text-emerald-950 dark:text-emerald-50'
            : 'bg-[var(--coral-light)] border-[var(--coral)] text-rose-950 dark:text-rose-50'
        } ${className}`}
      >
        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isSuccess ? 'bg-[var(--menta)] text-white' : 'bg-[var(--coral)] text-white'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            ) : (
              <XCircle className="w-8 h-8 stroke-[2.5]" />
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold display-lg leading-tight">
              {isSuccess ? 'Muito bem! Resposta Correta!' : 'Não foi dessa vez.'}
            </h2>
            {isSuccess && (
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--yellow)] text-[var(--t900)] font-extrabold text-xs">
                +{xpEarned} XP Adquiridos!
              </span>
            )}
          </div>
        </div>

        {/* Error Resolution / Explanation block */}
        {(!isSuccess || explanation) && (
          <div className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] space-y-3 text-sm font-sans text-[var(--foreground)] shadow-xs">
            <div className="font-bold text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              {isSuccess ? 'Explicação:' : 'Resolução Comentada:'}
            </div>

            {explanation && <p className="leading-relaxed">{explanation}</p>}

            {solutionCode && (
              <div className="bg-[#1E1D17] text-[#FFFDF7] p-3 rounded-xl font-mono text-xs space-y-1">
                <div className="text-[#8C8571] text-[10px] font-sans font-bold uppercase">
                  Código Esperado:
                </div>
                <pre className="whitespace-pre-wrap">{solutionCode}</pre>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant={isSuccess ? 'primary' : 'secondary'}
            onClick={onContinue}
            className="w-full text-base py-3.5"
          >
            <span>{isSuccess ? 'Próxima Pergunta' : 'Continuar Lição'}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Button>
        </div>
      </div>
    </div>
  );
};
