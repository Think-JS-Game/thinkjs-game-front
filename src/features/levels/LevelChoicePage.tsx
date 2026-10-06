import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sprout, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const LevelChoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

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
        <div className="flex flex-col flex-1 justify-center w-full">
          
          <div className="space-y-4 mb-8">
            <h1 className="font-display text-[26px] md:text-3xl font-extrabold text-[var(--t900)] tracking-wide">
              Qual é o seu nível?
            </h1>
            <p className="text-[14px] text-[var(--t600)] leading-relaxed">
              Isso ajuda a começar no ponto certo. Você pode mudar depois.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate('/app/level')}
              className="w-full p-5 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-[var(--background)] text-left hover:border-[var(--t400)] transition-all flex items-center gap-5 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full flex-shrink-0 bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 flex items-center justify-center">
                <Sprout className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-extrabold text-[15px] text-[var(--t900)]">Escolher um nível</h3>
                <span className="text-[13px] text-[var(--t600)]">Eu já sei mais ou menos onde estou.</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/app/placement-test')}
              className="w-full p-5 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-[var(--background)] text-left hover:border-[var(--t400)] transition-all flex items-center gap-5 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full flex-shrink-0 bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 flex items-center justify-center">
                <Compass className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-extrabold text-[15px] text-[var(--t900)]">Não sei meu nível</h3>
                <span className="text-[13px] text-[var(--t600)]">Faça um teste rápido e a gente sugere.</span>
              </div>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
