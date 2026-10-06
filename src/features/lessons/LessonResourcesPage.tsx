import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const LessonResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  const resources = [
    {
      id: 'res-1',
      kind: 'video' as const,
      title: 'Vídeo: o que são funções?',
      subtitle: '6 min · introdução visual',
      url: 'https://youtube.com',
    },
    {
      id: 'res-2',
      kind: 'article' as const,
      title: 'Artigo: guia de arrow functions',
      subtitle: '8 min de leitura',
      url: 'https://wikipedia.org',
    },
    {
      id: 'res-3',
      kind: 'article' as const,
      title: 'Artigo: parâmetros e retorno',
      subtitle: '5 min de leitura',
      url: 'https://wikipedia.org',
    },
  ];

  return (
    <div className="w-full mx-auto py-0 sm:py-8 md:px-8 bg-[var(--cream)] min-h-screen">
      
      {/* Container Principal */}
      <div className="bg-white dark:bg-[var(--sand)] sm:rounded-[2rem] p-6 md:p-8 sm:shadow-sm sm:border border-[var(--border-color)] h-screen sm:h-auto sm:min-h-[800px] flex flex-col max-w-[800px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-extrabold text-[18px] md:text-[20px] text-[var(--t900)]">
            Materiais de estudo
          </h1>
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 md:hidden flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:bg-[var(--sand)] shrink-0"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 w-full max-w-[600px] mx-auto pb-10 space-y-6">
          
          <p className="text-[14px] text-[var(--t600)] leading-relaxed">
            Quer se aprofundar? Estes materiais combinam com o que você acabou de praticar.
          </p>

          <div className="space-y-3">
            {resources.map((res) => {
              const Icon = res.kind === 'video' ? Play : FileText;
              
              return (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white dark:bg-[var(--background)] border border-[var(--border-color)] rounded-2xl hover:border-[var(--t400)] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] dark:bg-[#115E59]/30 text-[#0F766E] dark:text-[#5EEAD4] flex items-center justify-center shrink-0 mr-4">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[14px] text-[var(--t900)] truncate">
                      {res.title}
                    </h3>
                    <p className="text-[12px] text-[var(--t500)] mt-0.5">
                      {res.subtitle}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[var(--t400)] group-hover:text-[var(--t600)] shrink-0 ml-2" />
                </a>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 mt-auto max-w-[800px] w-full mx-auto">
          <button
            onClick={() => navigate('/app/trail')}
            className="w-full bg-[var(--yellow)] hover:bg-[var(--yellow-dark)] text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-sm"
          >
            Voltar à trilha
          </button>
        </div>

      </div>
    </div>
  );
};
