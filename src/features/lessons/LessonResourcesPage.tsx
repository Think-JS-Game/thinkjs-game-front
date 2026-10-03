import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResourceCard } from '@/components/ui/ResourceCard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const LessonResourcesPage: React.FC = () => {
  const navigate = useNavigate();

  const resources = [
    {
      id: 'res-1',
      kind: 'video' as const,
      title: 'Vídeo: Como Funciona um Computador por Dentro?',
      description: 'Entenda os conceitos fundamentais de memória, processador e armazenamento.',
      url: 'https://youtube.com',
    },
    {
      id: 'res-2',
      kind: 'article' as const,
      title: 'Artigo: Guia Prático de Cibersegurança para Alunos',
      description: 'Dicas essenciais para criar senhas fortes e navegar com total segurança na web.',
      url: 'https://wikipedia.org',
    },
    {
      id: 'res-3',
      kind: 'article' as const,
      title: 'Resumo dos Atalhos do Teclado (Windows/Mac)',
      description: 'Lista completa de combinações úteis de teclas para aumentar sua produtividade.',
      url: 'https://wikipedia.org',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between max-w-xl mx-auto p-6">
      <div className="pt-4 space-y-6">
        <button
          type="button"
          onClick={() => navigate('/app/trail')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Trilha</span>
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--turquesa-light)] text-[var(--turquesa)] text-xs font-extrabold border border-[var(--turquesa)]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Materiais de Apoio</span>
          </div>
          <h1 className="text-3xl font-extrabold display-lg">Links de Estudo Recomendados</h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            Aprofunde seus conhecimentos com estes vídeos e artigos selecionados.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {resources.map((res) => (
            <ResourceCard
              key={res.id}
              kind={res.kind}
              title={res.title}
              description={res.description}
              url={res.url}
            />
          ))}
        </div>
      </div>

      <div className="py-6 border-t border-[var(--border)] mt-6">
        <Button variant="primary" onClick={() => navigate('/app/trail')} className="w-full text-base py-3.5">
          <span>Voltar para a Trilha Principal</span>
        </Button>
      </div>
    </div>
  );
};
