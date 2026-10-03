import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepDots } from '@/components/ui/StepDots';
import { Button } from '@/components/ui/Button';
import { Compass, HelpCircle, Trophy, ArrowRight } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      title: 'Essa é sua Trilha de Aprendizado',
      description:
        'Conclua lições curtas e interativas para desbloquear novos módulos. Seu aprendizado evolui passo a passo no seu ritmo.',
      icon: Compass,
      colorBg: 'bg-[var(--yellow-light)] text-[var(--yellow-dark)] border-[var(--yellow-mid)]',
    },
    {
      id: 'slide-2',
      title: 'Como Funcionam as Perguntas',
      description:
        'Você tem até 3 tentativas por pergunta. Se errar nas 2 primeiras, receba dicas leves. Na 3ª tentativa, veja a solução sem travar seu progresso e sem perder vidas!',
      icon: HelpCircle,
      colorBg: 'bg-[var(--turquesa-light)] text-[var(--turquesa)] border-[var(--turquesa)]',
    },
    {
      id: 'slide-3',
      title: 'Acompanhe Seu Progresso',
      description:
        'Ganhe XP ao concluir lições, mantenha sua sequência (streak) de estudos diários e conquiste badges no seu perfil.',
      icon: Trophy,
      colorBg: 'bg-[var(--roxo-light)] text-[var(--roxo)] border-[var(--roxo)]',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/app/level-choice');
    }
  };

  const handleSkip = () => {
    navigate('/app/level-choice');
  };

  const activeSlide = slides[currentSlide];
  const Icon = activeSlide.icon;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header with Skip Button */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-xs font-bold text-[var(--muted-foreground)] uppercase">
          Passo {currentSlide + 1} de {slides.length}
        </div>
        <Button variant="ghost" onClick={handleSkip} className="!py-1.5 !px-3 text-xs font-bold">
          Pular
        </Button>
      </div>

      {/* Slide Visual Content */}
      <div className="my-auto py-8 text-center space-y-6">
        <div
          className={`w-32 h-32 rounded-3xl mx-auto flex items-center justify-center border-2 shadow-sm ${activeSlide.colorBg}`}
        >
          <Icon className="w-16 h-16 stroke-[2.2]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold display-lg leading-tight">
            {activeSlide.title}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed body-md">
            {activeSlide.description}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="space-y-6 pb-6">
        <StepDots
          totalSteps={slides.length}
          currentStep={currentSlide}
          onSelectStep={(idx) => setCurrentSlide(idx)}
        />

        <Button variant="primary" onClick={handleNext} className="w-full text-base py-3.5">
          <span>{currentSlide === slides.length - 1 ? 'Começar Jornada' : 'Continuar'}</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
