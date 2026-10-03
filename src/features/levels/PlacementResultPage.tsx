import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LevelCard } from '@/components/ui/LevelCard';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { Award, Check, RefreshCw } from 'lucide-react';

export const PlacementResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { setLevel } = useStudentProgress();

  const suggestedLevel = 'beginner';

  const handleConfirm = () => {
    setLevel(suggestedLevel);
    navigate('/app/trail');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="my-auto space-y-6 text-center py-6">
        <div className="w-16 h-16 rounded-3xl bg-[var(--yellow)] text-[var(--t900)] border-2 border-[var(--yellow-dark)] flex items-center justify-center mx-auto shadow-sm">
          <Award className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Resultado do Teste
          </span>
          <h1 className="text-3xl font-extrabold display-lg">Nível Recomendado para Você</h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            Com base nas suas respostas, sugerimos começar no nível:
          </p>
        </div>

        <div className="pt-2 text-left">
          <LevelCard
            level="beginner"
            title="2. Iniciante"
            subtitle="Introdução ao JavaScript"
            description="Perfeito para quem deseja aprender sintaxe básica de JavaScript, console.log e lógica inicial."
            isSelected={true}
          />
        </div>

        <div className="space-y-3 pt-4">
          <Button variant="primary" onClick={handleConfirm} className="w-full text-base py-3.5">
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Confirmar e Ir para a Trilha</span>
          </Button>

          <Button variant="ghost" onClick={() => navigate('/app/level')} className="w-full text-xs">
            <RefreshCw className="w-4 h-4" />
            <span>Escolher outro nível manualmente</span>
          </Button>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-[var(--muted-foreground)]">
        Você pode redefinir seu nível no perfil sempre que desejar.
      </div>
    </div>
  );
};
