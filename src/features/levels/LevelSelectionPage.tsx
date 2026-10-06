import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StudentLevel } from '@/types/student';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { Sprout, Zap, Rocket, Crown, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const LevelSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { level: currentLevel, setLevel } = useStudentProgress();
  const [selectedLevel, setSelectedLevel] = useState<StudentLevel>(currentLevel);
  const { isDark, toggle } = useTheme();

  const levels = [
    {
      id: 'beginner' as StudentLevel,
      title: 'Iniciante',
      subtitle: 'Nunca escrevi uma linha de código',
      icon: Sprout,
      isDarkTheme: false,
    },
    {
      id: 'intermediate' as StudentLevel,
      title: 'Intermediário',
      subtitle: 'Já conheço o básico de JS',
      icon: Zap,
      isDarkTheme: false,
    },
    {
      id: 'advanced' as StudentLevel,
      title: 'Avançado',
      subtitle: 'Já construí alguns projetos',
      icon: Rocket,
      isDarkTheme: false,
    },
    {
      id: 'expert' as StudentLevel,
      title: 'Especialista',
      subtitle: 'JS é minha rotina — closures, async e tudo mais',
      icon: Crown,
      isDarkTheme: true,
    },
  ];

  const handleConfirm = () => {
    setLevel(selectedLevel);
    navigate('/app/trail');
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      {/* Card Principal (Modal) */}
      <div className="bg-white dark:bg-[var(--sand)] max-w-[480px] w-full max-h-[95vh] h-auto min-h-[800px] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border-color)] flex flex-col relative overflow-hidden">
        
        {/* Header - Theme Toggle */}
        <div className="flex items-center justify-end mb-6">
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
        <div className="flex flex-col flex-1 w-full overflow-y-auto pr-2 -mr-2" style={{ scrollbarWidth: 'none' }}>
          
          <h1 className="font-display text-[26px] md:text-3xl font-extrabold text-[var(--t900)] tracking-wide mb-6">
            Escolha o seu nível
          </h1>

          <div className="space-y-3">
            {levels.map((lvl) => {
              const isSelected = selectedLevel === lvl.id;
              
              // Estilização baseada em claro/escuro da própria opção
              const isDarkTheme = lvl.isDarkTheme;
              const bgColor = isDarkTheme ? 'bg-[#27261F]' : 'bg-white dark:bg-[var(--background)]';
              const borderColor = isSelected 
                ? 'border-[var(--yellow)] ring-1 ring-[var(--yellow)] shadow-sm' 
                : 'border-[var(--border-color)] hover:border-[var(--t400)]';
                
              const titleColor = isDarkTheme ? 'text-[var(--yellow)]' : 'text-[var(--t900)]';
              const subtitleColor = isDarkTheme ? 'text-[var(--t400)]' : 'text-[var(--t600)]';
              
              const iconBg = isDarkTheme ? 'bg-[var(--yellow)]' : 'bg-[#FEF08A] dark:bg-yellow-500/20';
              const iconColor = isDarkTheme ? 'text-black' : 'text-[#A16207] dark:text-yellow-400';

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`w-full p-4 md:p-5 rounded-2xl border transition-all flex items-center gap-4 text-left ${bgColor} ${borderColor}`}
                >
                  {/* Icon Circle */}
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${iconBg} ${iconColor}`}>
                    <lvl.icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  
                  {/* Texts */}
                  <div className="flex flex-col flex-1 gap-0.5">
                    <h3 className={`font-extrabold text-[15px] ${titleColor}`}>{lvl.title}</h3>
                    <span className={`text-[13px] leading-tight ${subtitleColor}`}>{lvl.subtitle}</span>
                  </div>

                  {/* Radio Button */}
                  <div className="flex-shrink-0 flex items-center justify-center ml-2">
                    <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'border-[var(--yellow)]' 
                        : isDarkTheme 
                          ? 'border-[var(--t500)]' 
                          : 'border-[var(--border-color)]'
                    }`}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--yellow)]" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
        </div>

        {/* Footer */}
        <div className="pt-6 mt-auto">
          <Button variant="primary" onClick={handleConfirm} className="w-full text-base font-extrabold py-4 rounded-xl shadow-sm text-black">
            Confirmar nível
          </Button>
        </div>
      </div>
    </div>
  );
};
