import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const WelcomePage: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      {/* Card Principal (Modal) */}
      <div className="bg-white dark:bg-[var(--sand)] max-w-[480px] w-full min-h-[800px] rounded-[2rem] p-8 shadow-sm border border-[var(--border-color)] flex flex-col relative">
        {/* Header - Theme Toggle */}
        <div className="flex items-center justify-end mb-4">
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mascot & Logo */}
        <div className="flex flex-col items-center justify-center flex-1">
          <img
            src="/brand/thinkjs-mascot.svg"
            alt="Mascote ThinkJS"
            className="w-48 mb-4 drop-shadow-md"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <img src="/brand/thinkjs-logo.svg" alt="ThinkJS" className="h-11 drop-shadow-sm mb-6" />

          <p className="text-[14px] text-center text-[var(--t600)] font-medium leading-relaxed max-w-[280px]">
            Aprenda JavaScript jogando &mdash; trilhas, XP e ofensivas do primeiro <span className="font-bold text-[var(--yellow-dark)] dark:text-[var(--yellow)]">console.log</span> ao primeiro projeto.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-12 mt-auto space-y-4">
          <Link to="/app/signup" className="block w-full">
            <Button variant="primary" className="w-full text-base font-extrabold py-4 rounded-xl shadow-sm text-black">
              Criar conta
            </Button>
          </Link>

          <Link to="/app/login" className="block w-full">
            <Button variant="secondary" className="w-full text-base font-extrabold py-4 rounded-xl text-[var(--foreground)] bg-white dark:bg-[var(--background)] border-2 border-[var(--foreground)] hover:bg-[var(--sand)]">
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
