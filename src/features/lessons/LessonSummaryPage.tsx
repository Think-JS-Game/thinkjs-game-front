import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { useLessonSession } from './LessonSessionContext';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';
import { LessonCompletionResult } from '@/services/progress/ProgressEngine';
import { Lesson } from '@/types/trail';
import { Trophy, Zap, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';

export const LessonSummaryPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { completeLesson } = useStudentProgress();
  const { lessonResult, isSessionCompleted } = useLessonSession();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completionResult, setCompletionResult] = useState<LessonCompletionResult | null>(null);
  const hasExecutedRef = useRef(false);

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

  const xpText = completionResult?.alreadyCompleted
    ? '+0 XP'
    : `+${xpEarnedValue} XP`;

  const totalQuestions = lessonResult.questionResults.length;
  const correctAnswers = lessonResult.questionResults.filter((r) => r.correct).length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between max-w-md mx-auto p-6">
      <div className="my-auto py-8 text-center space-y-8">
        {/* Celebration Trophy */}
        <div className="w-24 h-24 rounded-3xl bg-[var(--yellow)] text-[var(--t900)] border-4 border-[var(--yellow-dark)] flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <Trophy className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold text-[var(--menta)] uppercase tracking-wider">
            Lição Concluída!
          </span>
          <h1 className="text-3xl font-extrabold display-lg">
            {completionResult?.alreadyCompleted ? 'Lição Já Concluída' : 'Parabéns pelo Esforço!'}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            {completionResult?.alreadyCompleted
              ? 'Você já concluiu esta lição anteriormente. Seu progresso e XP foram mantidos.'
              : 'Você completou todos os exercícios desta etapa.'}
          </p>
        </div>

        {/* Stats Grid: XP + Correct Count (NO TIME DISPLAYED!) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--yellow-light)] border border-[var(--yellow-mid)] space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[var(--t900)] font-bold text-xs uppercase">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>XP Ganho</span>
            </div>
            <div className="text-2xl font-black text-[var(--t900)] display-md">{xpText}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--menta-light)] border border-[var(--menta-mid)] space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[var(--menta)] font-bold text-xs uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Acertos</span>
            </div>
            <div className="text-2xl font-black text-[var(--menta)] display-md">
              {`${correctAnswers} / ${totalQuestions}`}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-6">
        <Link to={`/app/lesson/${lessonId}/resources`} className="block w-full">
          <Button variant="primary" className="w-full text-base py-3.5">
            <BookOpen className="w-5 h-5" />
            <span>Ver Material de Estudo</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        <Button
          variant="secondary"
          onClick={() => navigate('/app/trail')}
          className="w-full text-base py-3.5"
        >
          <span>Voltar para a Trilha</span>
        </Button>
      </div>
    </div>
  );
};
