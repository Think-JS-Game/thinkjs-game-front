import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, LogIn, Sparkles } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 sm:p-10 max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="text-center pt-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--yellow-light)] border border-[var(--yellow-mid)] text-[var(--t900)] text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-[var(--yellow-dark)]" />
          <span>Plataforma Gamificada de Programação</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight display-xl text-[var(--foreground)]">
          Think<span className="text-[var(--yellow)]">JS</span>
        </h1>
        <p className="text-base text-[var(--muted-foreground)] body-md">
          Aprenda tecnologia e JavaScript do básico ao avançado de forma divertida e sem punições.
        </p>
      </div>

      {/* Mascot Graphic Hero */}
      <div className="my-8 flex justify-center items-center py-6">
        <div className="w-56 h-56 rounded-3xl bg-[var(--sand)] border-2 border-[var(--border)] p-6 flex flex-col items-center justify-center relative shadow-sm">
          <img
            src="/brand/thinkjs-mascot.svg"
            alt="Mascote ThinkJS"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback element if graphic file missing
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute -bottom-3 px-4 py-1 rounded-full bg-[var(--t900)] text-[var(--yellow)] text-xs font-bold shadow-xs">
            Let's Code! 🚀
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pb-6">
        <Link to="/app/signup" className="block w-full">
          <Button variant="primary" className="w-full text-base py-4">
            <span>Criar uma Conta</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        <Link to="/app/login" className="block w-full">
          <Button variant="ghost" className="w-full text-base py-3.5">
            <LogIn className="w-5 h-5" />
            <span>Já Tenho uma Conta</span>
          </Button>
        </Link>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline font-medium">
            Voltar para o Site Institucional
          </Link>
        </div>
      </div>
    </div>
  );
};
