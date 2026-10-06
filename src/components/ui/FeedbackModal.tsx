import React from 'react';
import { Check, X, Zap } from 'lucide-react';

export type FeedbackModalKind = 'success' | 'error' | 'retry-error';

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
  xpEarned = 5,
  explanation,
  solutionCode,
  onContinue,
  className = '',
}) => {
  if (!isOpen) return null;

  const isSuccess = kind === 'success';
  const isRetry = kind === 'retry-error';

  const getTitle = () => {
    if (isSuccess) return 'Muito bem!';
    if (isRetry) return 'Quase!';
    return 'Ops, não foi dessa vez!';
  };

  const getButtonText = () => {
    if (isRetry) return 'Tentar de novo';
    return 'Continuar';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-sm rounded-[1.5rem] overflow-hidden flex flex-col shadow-2xl ${className}`}>
        
        {/* Top Section */}
        <div className={`py-8 px-6 flex flex-col items-center justify-center text-center ${
          isSuccess 
            ? 'bg-[#EAF6ED] dark:bg-[var(--menta)]/20' 
            : 'bg-[#FEE2E2] dark:bg-[var(--coral)]/20'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm ${
            isSuccess ? 'bg-[#22C55E]' : 'bg-[var(--coral)]'
          }`}>
            {isSuccess ? (
              <Check className="w-6 h-6 text-white stroke-[3]" />
            ) : (
              <X className="w-6 h-6 text-white stroke-[3]" />
            )}
          </div>
          
          <h2 className="text-[18px] font-extrabold text-[var(--t900)] leading-none">
            {getTitle()}
          </h2>
          
          {isSuccess && (
            <div className="flex items-center gap-1 mt-2 text-[#EAB308] dark:text-[var(--yellow)] font-bold text-[13px]">
              <Zap className="w-4 h-4 fill-current" />
              <span>+{xpEarned} XP</span>
            </div>
          )}
        </div>

        {/* Bottom Section (White) */}
        <div className="p-5 bg-white dark:bg-[var(--sand)] text-center space-y-4">
          
          {isRetry && (
            <p className="text-[13px] text-[var(--t500)]">
              Não foi dessa vez. Tente outra opção!
            </p>
          )}

          {(!isSuccess && !isRetry && (explanation || solutionCode)) && (
            <div className="text-left bg-[var(--cream)] dark:bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)]">
              {explanation && (
                <p className="text-[13px] text-[var(--t800)] leading-relaxed mb-2">
                  {explanation}
                </p>
              )}
              {solutionCode && (
                <div className="bg-[#27261F] text-white p-3 rounded-lg font-mono text-[12px] overflow-x-auto">
                  <pre>{solutionCode}</pre>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={onContinue} 
            className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-sm"
          >
            {getButtonText()}
          </button>
        </div>

      </div>
    </div>
  );
};
