import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { Rocket, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const PlacementResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { setLevel } = useStudentProgress();
  const { isDark, toggle } = useTheme();

  // O nível seria retornado do teste. Para demonstrar a tela conforme imagem, fixamos em 'advanced'.
  const suggestedLevel = 'advanced';

  const handleConfirm = () => {
    setLevel(suggestedLevel);
    navigate('/app/trail');
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      {/* Card Principal (Modal) */}
      <div className="bg-white dark:bg-[var(--sand)] max-w-[480px] w-full max-h-[95vh] h-auto min-h-[800px] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border-color)] flex flex-col relative">
        
        {/* Header - Theme Toggle */}
        <div className="flex items-center justify-end mb-8">
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
          
          <div className="w-[84px] h-[84px] rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 flex items-center justify-center mb-6">
            <Rocket className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-3 px-2">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-extrabold text-[var(--tq-dark)] uppercase tracking-widest">
                Nível sugerido
              </span>
              <h1 className="font-display text-4xl font-extrabold text-[var(--t900)] tracking-wide">
                Avançado
              </h1>
            </div>
            
            <p className="text-[14px] text-[var(--t600)] leading-relaxed max-w-[280px] mx-auto pt-2">
              Com base nas suas respostas, esse é o melhor ponto de partida. Você pode ajustar se quiser.
            </p>
          </div>
          
        </div>

        {/* Footer */}
        <div className="pt-8 mt-auto space-y-3">
          <Button variant="primary" onClick={handleConfirm} className="w-full text-base font-extrabold py-4 rounded-xl shadow-sm text-black">
            Começar nesse nível
          </Button>
          
          <button
            type="button"
            onClick={() => navigate('/app/level')}
            className="w-full py-3 text-[14px] font-bold text-[var(--t800)] hover:text-[var(--t900)] transition-colors"
          >
            Ajustar manualmente
          </button>
        </div>
      </div>
    </div>
  );
};
