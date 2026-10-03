import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LessonProgressHeader } from '@/components/ui/LessonProgressHeader';

export const PlacementTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const testQuestions = [
    {
      id: 'pt-1',
      question: 'Você já utilizou computadores para navegar na internet, enviar e-mails ou criar senhas?',
      options: [
        { id: 'opt-a', text: 'Sim, mas quero reforçar conceitos básicos de segurança e computador.' },
        { id: 'opt-b', text: 'Sim, já tenho boa familiaridade com computadores.' },
        { id: 'opt-c', text: 'Estou começando do zero absoluto.' },
      ],
    },
    {
      id: 'pt-2',
      question: 'Você já escreveu alguma linha de código em JavaScript antes (como console.log ou variáveis)?',
      options: [
        { id: 'opt-a', text: 'Nunca escrevi código antes.' },
        { id: 'opt-b', text: 'Já vi um pouco de código ou fiz alguns exemplos simples.' },
        { id: 'opt-c', text: 'Já sei usar variáveis, if/else e funções.' },
      ],
    },
  ];

  const question = testQuestions[currentStep - 1];

  const handleNext = () => {
    if (currentStep < testQuestions.length) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      navigate('/app/placement-test/result');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between max-w-xl mx-auto">
      <LessonProgressHeader
        questionNumber={currentStep}
        totalQuestions={testQuestions.length}
        onClose={() => navigate('/app/level')}
      />

      <div className="p-6 space-y-6 my-auto">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Pergunta Diagnóstica {currentStep}
          </span>
          <h2 className="text-2xl font-extrabold display-lg">{question.question}</h2>
        </div>

        <div className="space-y-3 pt-2">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedOption(opt.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all min-h-[56px] text-sm font-semibold flex items-center justify-between ${
                selectedOption === opt.id
                  ? 'bg-[var(--yellow-light)] border-[var(--yellow-dark)] text-[var(--t900)] ring-2 ring-[var(--yellow)]'
                  : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--sand)]'
              }`}
            >
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[var(--border)]">
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!selectedOption}
          className="w-full text-base py-3.5"
        >
          <span>{currentStep === testQuestions.length ? 'Ver Resultado' : 'Próxima'}</span>
        </Button>
      </div>
    </div>
  );
};
