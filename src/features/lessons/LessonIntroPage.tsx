import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';
import { Lesson } from '@/types/trail';
import { X, Code, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const LessonIntroPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (lessonId) {
      defaultTrailRepository.getLessonById(lessonId).then((l) => setLesson(l));
    }
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-[var(--t500)]">Carregando lição...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-0 sm:py-8 md:px-8 bg-[var(--cream)] min-h-screen">
      
      {/* Container Principal - Fills height on mobile, acts as a card on desktop */}
      <div className="bg-white dark:bg-[var(--sand)] sm:rounded-[2rem] p-6 md:p-8 sm:shadow-sm sm:border border-[var(--border-color)] h-screen sm:h-auto sm:min-h-[800px] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/trail')}
              className="p-2 -ml-2 rounded-full text-[var(--t800)] hover:text-[var(--t900)] transition-colors hover:bg-[var(--sand)] dark:hover:bg-[var(--background)]"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
            <span className="text-[11px] font-extrabold text-[var(--t500)] uppercase tracking-widest mt-0.5">
              Funções
            </span>
          </div>

          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 md:hidden flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 items-center justify-center text-center w-full max-w-[400px] mx-auto pb-10">
          
          <div className="w-[84px] h-[84px] rounded-3xl bg-[#FEF08A] text-[#A16207] dark:bg-yellow-500/20 dark:text-[var(--yellow)] flex items-center justify-center mb-8">
            <Code className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-[var(--tq-dark)] uppercase tracking-widest">
                Funções
              </span>
              <h1 className="font-display font-extrabold text-[32px] text-[var(--t900)] leading-tight">
                {lesson.title}
              </h1>
            </div>

            <p className="text-[14px] text-[var(--t600)] leading-relaxed px-4">
              {lesson.description}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 mt-auto max-w-[800px] w-full mx-auto">
          <button
            onClick={() => navigate(`/app/lesson/${lesson.id}/question/1`)}
            className="w-full bg-[var(--yellow)] hover:bg-[var(--yellow-dark)] text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-sm"
          >
            Começar
          </button>
        </div>

      </div>
    </div>
  );
};
