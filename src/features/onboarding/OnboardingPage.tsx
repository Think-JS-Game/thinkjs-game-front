import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Route, Moon, Sun, Zap, RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { InteractiveMascot } from '@/components/sections/InteractiveMascot';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      title: 'Siga a sua trilha',
      description:
        'Cada mÃ³dulo Ã© um grupo de liÃ§Ãµes curtas. Termine um para desbloquear o prÃ³ximo.',
      icon: Route,
      colorBg: 'bg-[var(--accent)] text-[var(--yellow-dark)]',
    },
    {
      id: 'slide-2',
      title: 'Ganhe XP e ofensivas',
      description:
        'Cada liÃ§Ã£o concluÃ­da rende XP. Pratique todo dia para manter sua ofensiva acesa.',
      icon: Zap,
      colorBg: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    },
    {
      id: 'slide-3',
      title: 'Errar faz parte',
      description:
        'VocÃª tem atÃ© 3 tentativas por pergunta, sem perder nada. Na Ãºltima, mostramos a resoluÃ§Ã£o.',
      icon: RefreshCw,
      colorBg: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400',
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
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      {/* Card Principal (Modal) */}
      <div className="bg-white dark:bg-[var(--sand)] max-w-[480px] w-full max-h-[95vh] h-auto min-h-[800px] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border-color)] flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Custom Step Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-6 bg-[var(--yellow)]'
                    : 'w-1.5 bg-[var(--t300)]'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="text-[13px] font-extrabold text-[var(--t800)] hover:text-[var(--t900)] transition-colors"
            >
              Pular
            </button>
            <button
              type="button"
              onClick={toggle}
              className="w-10 h-10 flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] hover:bg-[var(--sand)]"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Slide Visual Content */}
        <div className="flex flex-col items-center justify-center flex-1 w-full pt-4">
          <div className="relative mb-12 flex justify-center">
            {/* Main Mascot */}
            <InteractiveMascot className="w-40 drop-shadow-md relative z-10" />
            {/* Floating Badge */}
            <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg z-20 ${activeSlide.colorBg}`}>
              <Icon className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-4 px-2 text-center w-full">
            <h1 className="font-display text-2xl font-bold text-[var(--t900)] tracking-wide">
              {activeSlide.title}
            </h1>
            <p className="text-[14px] text-[var(--t600)] leading-relaxed max-w-[320px] mx-auto">
              {activeSlide.description}
            </p>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="pt-8 mt-auto">
          <Button variant="primary" onClick={handleNext} className="w-full text-base font-extrabold py-4 rounded-xl shadow-sm text-black">
            {currentSlide === slides.length - 1 ? 'Bora comeÃ§ar!' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

