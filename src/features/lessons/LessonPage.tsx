import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold display-md">Lição: {lessonId}</h1>
        <Link to="/app/trail" className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          &larr; Voltar para a Trilha
        </Link>
      </div>

      <div className="p-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
        <div className="text-sm font-medium text-center text-[var(--muted-foreground)]">
          Question Engine &amp; Renderizador de Pergunta (Fases 4 e 5)
        </div>
      </div>
    </div>
  );
};
