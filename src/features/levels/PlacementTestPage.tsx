import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const PlacementTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  
  const [currentStep, setCurrentStep] = useState(1);

  // Mock de 5 perguntas baseadas no design
  const testQuestions = [
    {
      id: 'pt-1',
      question: "O que faz console.log('Oi')?",
      options: [
        { id: 'opt-a', text: 'Cria uma variável' },
        { id: 'opt-b', text: "Mostra 'Oi' no console" },
        { id: 'opt-c', text: 'Apaga o console' },
      ],
    },
    {
      id: 'pt-2',
      question: 'Como declarar uma variável em JavaScript moderno?',
      options: [
        { id: 'opt-a', text: 'variable x = 10;' },
        { id: 'opt-b', text: 'let x = 10;' },
        { id: 'opt-c', text: 'int x = 10;' },
      ],
    },
    {
      id: 'pt-3',
      question: 'O que é um Array?',
      options: [
        { id: 'opt-a', text: 'Um tipo de erro' },
        { id: 'opt-b', text: 'Uma função que soma números' },
        { id: 'opt-c', text: 'Uma lista de valores' },
      ],
    },
    {
      id: 'pt-4',
      question: 'Qual símbolo é usado para igualdade estrita?',
      options: [
        { id: 'opt-a', text: '==' },
        { id: 'opt-b', text: '===' },
        { id: 'opt-c', text: '=' },
      ],
    },
    {
      id: 'pt-5',
      question: 'Para que serve o if/else?',
      options: [
        { id: 'opt-a', text: 'Tomar decisões no código' },
        { id: 'opt-b', text: 'Repetir um código várias vezes' },
        { id: 'opt-c', text: 'Importar bibliotecas' },
      ],
    },
  ];

  const question = testQuestions[currentStep - 1];

  const handleOptionClick = (_optId: string) => {
    // Para simplificar e ficar fluído, o clique já avança (ou pode aguardar um atraso de 300ms)
    setTimeout(() => {
      if (currentStep < testQuestions.length) {
        setCurrentStep(currentStep + 1);
      } else {
        navigate('/app/placement-test/result');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      {/* Card Principal (Modal) */}
      <div className="bg-white dark:bg-[var(--sand)] max-w-[480px] w-full max-h-[95vh] h-auto min-h-[800px] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border-color)] flex flex-col relative">
        
        {/* Header - Progress & Theme */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-1.5">
            {testQuestions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep - 1
                    ? 'w-6 bg-[var(--yellow)]'
                    : 'w-1.5 bg-[var(--t300)]'
                }`}
              />
            ))}
          </div>
          
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
        <div className="flex flex-col flex-1 w-full">
          
          <div className="mb-6">
            <span className="text-[11px] font-extrabold text-[var(--tq-dark)] uppercase tracking-widest">
              Teste de Nivelamento &bull; {currentStep}/{testQuestions.length}
            </span>
            <h1 className="font-display text-[22px] md:text-2xl font-bold text-[var(--t900)] mt-4">
              {question.question}
            </h1>
          </div>

          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleOptionClick(opt.id)}
                className="w-full text-left px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[var(--background)] text-[14px] font-bold text-[var(--t800)] hover:border-[var(--t400)] transition-all active:scale-[0.98]"
              >
                {opt.text}
              </button>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};
