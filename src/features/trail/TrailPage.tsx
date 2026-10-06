import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { mockModules } from '@/data/mock/mockTrailData';
import { ProgressEngine } from '@/services/progress/ProgressEngine';
import { Check, Lock, Play, Flame, Zap } from 'lucide-react';

export const TrailPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, level } = useStudentProgress();
  const { student } = useAuth();
  
  const modules = mockModules.filter(m => m.level === level);
  
  // Acha o módulo ativo: o último disponível/concluído
  const defaultActiveIndex = modules.findIndex((m, i) => ProgressEngine.getModuleState(m, i, progress, modules) === 'current') || 0;
  const [activeModuleIndex, setActiveModuleIndex] = useState(defaultActiveIndex !== -1 ? defaultActiveIndex : 0);
  const [lockedMessage, setLockedMessage] = useState<{ title: string } | null>(null);

  const activeModule = modules[activeModuleIndex];

  const handleModuleClick = (mod: any, index: number) => {
    const state = ProgressEngine.getModuleState(mod, index, progress, modules);
    if (state === 'locked') {
      const prevMod = modules[index - 1];
      setLockedMessage({ title: prevMod ? prevMod.title : 'anterior' });
      setTimeout(() => setLockedMessage(null), 4000);
      return;
    }
    setLockedMessage(null);
    setActiveModuleIndex(index);
  };

  const handleLessonSelect = (lessonId: string, isLocked: boolean) => {
    if (isLocked) return;
    navigate(`/app/lesson/${lessonId}/intro`);
  };

  // Mock dados de streak e XP para a UI (se não houver no provider)
  const streak = 12;
  const totalXp = 240;

  return (
    <div className="w-full max-w-[800px] mx-auto py-6 sm:py-8 space-y-8 px-4 sm:px-6 md:px-8">
      
      {/* Header - Mobile Only (Badges are hidden on md: because they go to sidebar) */}
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] md:text-2xl font-extrabold text-[var(--t900)]">
          Oi, <span className="text-[var(--yellow-dark)]">{student?.name?.split(' ')[0] || 'Aluno'}</span> <span className="inline-block hover:animate-wiggle cursor-default">👋</span>
        </h1>
        
        {/* Badges - visible only on mobile, hidden on md */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-color)] bg-white dark:bg-[var(--sand)]">
            <Flame className="w-3.5 h-3.5 text-[var(--coral-mid)]" />
            <span className="text-[13px] font-bold text-[var(--coral-mid)]">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-color)] bg-white dark:bg-[var(--sand)]">
            <Zap className="w-3.5 h-3.5 text-[var(--yellow-dark)] dark:text-[var(--yellow)]" />
            <span className="text-[13px] font-bold text-[var(--yellow-dark)] dark:text-[var(--yellow)]">{totalXp}</span>
          </div>
        </div>
      </div>

      {/* Seção Módulos (SUA TRILHA) */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-extrabold text-[var(--t500)] uppercase tracking-widest">
          Sua Trilha
        </h2>
        
        {/* Horizontal Scroll list */}
        <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 snap-x pr-4 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
          {modules.map((mod, index) => {
            const state = ProgressEngine.getModuleState(mod, index, progress, modules);
            const isSelected = index === activeModuleIndex;
            
            // Render circle based on state
            let circleContent;
            let circleStyles;
            let labelColor = state === 'locked' ? 'text-[var(--t500)]' : 'text-[var(--t900)]';

            if (state === 'completed') {
              circleStyles = `bg-[var(--menta)] text-white shadow-sm border-2 border-transparent ${isSelected ? 'ring-4 ring-[var(--menta)]/20 scale-105' : ''}`;
              circleContent = <Check className="w-7 h-7 stroke-[3]" />;
            } else if (state === 'current') {
              circleStyles = `bg-white dark:bg-[var(--background)] text-[var(--t900)] shadow-sm border-[4px] border-[var(--yellow)] scale-105`;
              circleContent = <span className="font-display font-bold text-xl">{index + 1}</span>;
            } else { // locked
              circleStyles = `bg-[var(--t300)]/30 text-[var(--t500)] border-2 border-transparent`;
              circleContent = <Lock className="w-5 h-5 stroke-[2]" />;
            }

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => handleModuleClick(mod, index)}
                className={`flex flex-col items-center gap-2 snap-start flex-shrink-0 focus:outline-none transition-transform ${state !== 'locked' ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
              >
                <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all ${circleStyles}`}>
                  {circleContent}
                </div>
                <span className={`text-[12px] font-extrabold max-w-[80px] text-center leading-tight truncate px-1 ${labelColor}`}>
                  {mod.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Banner Inline de Módulo Bloqueado */}
        {lockedMessage && (
          <div className="flex items-center gap-2.5 bg-[#27261F] dark:bg-[var(--background)] text-white p-3.5 rounded-xl animate-in fade-in slide-in-from-top-2 mt-4">
            <Lock className="w-4 h-4 text-[var(--t400)] flex-shrink-0" />
            <span className="text-[13px] text-[var(--t300)]">
              Termine o módulo <strong className="text-white font-extrabold">{lockedMessage.title}</strong> pra desbloquear esse.
            </span>
          </div>
        )}
      </div>

      {/* Módulo Selecionado (Lições) */}
      {activeModule && (() => {
        const pct = ProgressEngine.calculateModuleProgressPercentage(activeModule, progress);
        
        return (
          <div className="space-y-6 pt-2">
            
            {/* Título e Barra de Progresso */}
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <h3 className="text-[22px] font-extrabold text-[var(--t900)] leading-none">{activeModule.title}</h3>
                <span className="text-[12px] font-bold text-[var(--t600)] leading-none">{pct}%</span>
              </div>
              
              {/* Barra Progress */}
              <div className="h-3 w-full bg-[var(--t300)]/40 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-[var(--yellow)] rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${pct}%` }} 
                />
              </div>
            </div>

            {/* Lista de Lições */}
            <div className="space-y-3 pt-2">
              {activeModule.lessons.map((lesson, idx) => {
                const isActiveModUnlocked = ProgressEngine.isModuleUnlocked(activeModule, activeModuleIndex, progress, modules);
                const state = ProgressEngine.getLessonState(lesson, idx, activeModule, isActiveModUnlocked, progress);
                const isLocked = state === 'locked';

                let bgClasses = '';
                let borderClasses = '';
                let contentLeft = null;
                let contentRight = null;
                let titleColor = '';
                let subtitleColor = '';
                let subtitleText = '';

                if (state === 'completed') {
                  bgClasses = 'bg-white dark:bg-[var(--background)]';
                  borderClasses = 'border-[1.5px] border-[var(--menta-mid)]/40 shadow-sm';
                  titleColor = 'text-[var(--t900)] font-extrabold';
                  subtitleColor = 'text-[var(--t500)]';
                  subtitleText = `Concluído • ${lesson.xpReward} XP`;
                  contentLeft = (
                    <div className="w-11 h-11 rounded-full bg-[var(--menta-mid)]/10 text-[var(--menta)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  );
                } else if (state === 'current') {
                  bgClasses = 'bg-white dark:bg-[var(--background)]';
                  borderClasses = 'border-[2px] border-[var(--yellow)] shadow-sm';
                  titleColor = 'text-[var(--t900)] font-extrabold';
                  subtitleColor = 'text-[var(--t500)]';
                  subtitleText = `Disponível agora • ${lesson.xpReward} XP`;
                  contentLeft = (
                    <div className="w-11 h-11 rounded-full bg-[var(--yellow)] text-black flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  );
                  contentRight = (
                    <div className="ml-auto pl-3">
                      <button className="px-5 py-2.5 bg-[var(--yellow)] hover:bg-[var(--yellow-dark)] text-black font-extrabold text-[13px] rounded-xl transition-colors shadow-sm">
                        Continuar
                      </button>
                    </div>
                  );
                } else { // locked
                  bgClasses = 'bg-[var(--t300)]/10';
                  borderClasses = 'border border-[var(--t300)] border-dashed opacity-80';
                  titleColor = 'text-[var(--t600)] font-bold';
                  subtitleColor = 'text-[var(--t500)] text-[12px]';
                  subtitleText = 'Depende da lição anterior';
                  contentLeft = (
                    <div className="w-11 h-11 rounded-full bg-[var(--t300)]/30 text-[var(--t600)] flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 stroke-[2]" />
                    </div>
                  );
                }

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson.id, isLocked)}
                    disabled={isLocked}
                    className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all focus:outline-none ${isLocked ? 'cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'} ${bgClasses} ${borderClasses}`}
                  >
                    {contentLeft}
                    
                    <div className="flex flex-col gap-0.5 justify-center">
                      <h4 className={`text-[15px] leading-tight ${titleColor}`}>
                        {lesson.title}
                      </h4>
                      <span className={`text-[12px] leading-tight ${subtitleColor}`}>
                        {subtitleText}
                      </span>
                    </div>

                    {contentRight}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

    </div>
  );
};
