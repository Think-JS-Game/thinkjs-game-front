import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { useLessonSession } from './LessonSessionContext';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';
import { LessonCompletionResult } from '@/services/progress/ProgressEngine';
import { Lesson } from '@/types/trail';
import { Trophy, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const LessonSummaryPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { completeLesson } = useStudentProgress();
  const { lessonResult, isSessionCompleted } = useLessonSession();
  const { isDark, toggle } = useTheme();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completionResult, setCompletionResult] = useState<LessonCompletionResult | null>(null);
  const hasExecutedRef = useRef(false);
  const [mascotError, setMascotError] = useState(false);

  useEffect(() => {
    if (!lessonId || hasExecutedRef.current) return;

    // Protection: Summary requires a completed session and valid lessonResult
    if (!isSessionCompleted || !lessonResult) {
      navigate('/app/trail', { replace: true });
      return;
    }

    hasExecutedRef.current = true;

    let isSubscribed = true;

    async function processSummary() {
      const foundLesson = await defaultTrailRepository.getLessonById(lessonId!);
      if (!foundLesson) return;

      const mod = await defaultTrailRepository.getModuleById(foundLesson.moduleId);
      const targetLevel = mod ? mod.level : 'basic';
      const modules = await defaultTrailRepository.getModulesByLevel(targetLevel);

      if (!isSubscribed) return;

      setLesson(foundLesson);
      const res = completeLesson(lessonId!, modules);
      setCompletionResult(res);
    }

    processSummary();

    return () => {
      isSubscribed = false;
    };
  }, [lessonId, completeLesson, isSessionCompleted, lessonResult, navigate]);

  if (!isSessionCompleted || !lessonResult) {
    return null;
  }

  const xpEarnedValue = completionResult?.alreadyCompleted
    ? 0
    : (completionResult?.xpEarned ?? lesson?.xpReward ?? 20);

  const totalQuestions = lessonResult.questionResults.length;
  const correctAnswers = lessonResult.questionResults.filter((r) => r.correct).length;

  return (
    <div className="w-full mx-auto py-0 sm:py-8 md:px-8 bg-[var(--cream)] min-h-screen">
      
      {/* Container Principal */}
      <div className="bg-white dark:bg-[var(--sand)] sm:rounded-[2rem] p-6 md:p-8 sm:shadow-sm sm:border border-[var(--border-color)] h-screen sm:h-auto sm:min-h-[800px] flex flex-col max-w-[800px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-end mb-8">
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 items-center justify-center text-center w-full max-w-[400px] mx-auto pb-10">
          
          {!mascotError ? (
            <img 
              src="/mascote.png" 
              alt="Mascote ThinkJS" 
              className="w-40 h-40 md:w-48 md:h-48 object-contain mb-8 drop-shadow-xl"
              onError={() => setMascotError(true)}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-[var(--yellow-light)] flex items-center justify-center mb-8 shadow-sm border-2 border-[var(--yellow)]">
              <Trophy className="w-16 h-16 text-[#A16207] stroke-[2]" />
            </div>
          )}

          <div className="space-y-2 mb-8">
            <h1 className="font-display font-extrabold text-[28px] md:text-[32px] text-[var(--t900)] leading-tight">
              Lição concluída!
            </h1>
            <p className="text-[14px] text-[var(--t600)] leading-relaxed">
              Mandou muito bem.
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-[var(--background)] border border-[var(--border-color)] rounded-2xl flex items-center shadow-sm w-full max-w-[300px]">
            <div className="flex-1 py-4 flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-[22px] md:text-[26px] text-[#D97706] dark:text-[#EAB308]">
                +{xpEarnedValue}
              </span>
              <span className="text-[11px] font-bold text-[var(--t500)] uppercase mt-0.5">XP ganho</span>
            </div>
            <div className="w-[1px] h-14 bg-[var(--border-color)] opacity-70"></div>
            <div className="flex-1 py-4 flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-[22px] md:text-[26px] text-[#059669] dark:text-[#22C55E]">
                {correctAnswers}/{totalQuestions}
              </span>
              <span className="text-[11px] font-bold text-[var(--t500)] uppercase mt-0.5">Acertos</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 mt-auto max-w-[800px] w-full mx-auto space-y-4">
          <button
            onClick={() => navigate(`/app/lesson/${lesson?.id}/resources`)}
            className="w-full bg-[var(--yellow)] hover:bg-[var(--yellow-dark)] text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-sm"
          >
            Ver materiais de estudo
          </button>

          <button
            onClick={() => navigate('/app/trail')}
            className="w-full text-[var(--t800)] hover:text-[var(--t900)] dark:text-[var(--t600)] dark:hover:text-[var(--t300)] font-bold text-[14px] py-2 transition-colors"
          >
            Voltar à trilha
          </button>
        </div>

      </div>
    </div>
  );
};
