import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';
import { Lesson } from '@/types/trail';
import { BookOpen, Zap, ArrowRight, ArrowLeft, Target } from 'lucide-react';

export const LessonIntroPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (lessonId) {
      defaultTrailRepository.getLessonById(lessonId).then((l) => setLesson(l));
    }
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-[var(--muted-foreground)]">Carregando lição...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between max-w-lg mx-auto p-6">
      <div className="pt-4 space-y-6">
        <button
          type="button"
          onClick={() => navigate('/app/trail')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Trilha</span>
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--yellow-light)] text-[var(--t900)] text-xs font-bold border border-[var(--yellow-mid)]">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+{lesson.xpReward} XP Recompensa</span>
          </div>

          <h1 className="text-3xl font-extrabold display-lg leading-tight">{lesson.title}</h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed body-md">
            {lesson.description}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sand)] border border-[var(--border)] space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[var(--foreground)]">
            <Target className="w-4 h-4 text-[var(--yellow-dark)]" />
            <span>Objetivo da Lição:</span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Responda a {lesson.questions.length} perguntas interativas para reforçar os conceitos e garantir seu XP.
          </p>
        </div>
      </div>

      <div className="pb-6">
        <Button
          variant="primary"
          onClick={() => navigate(`/app/lesson/${lesson.id}/question/1`)}
          className="w-full text-base py-4"
        >
          <BookOpen className="w-5 h-5" />
          <span>Começar Lição</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
