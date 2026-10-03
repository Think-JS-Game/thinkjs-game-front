import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LevelCard } from '@/components/ui/LevelCard';
import { Button } from '@/components/ui/Button';
import { StudentLevel } from '@/types/student';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { ArrowRight, Check } from 'lucide-react';

export const LevelSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { level: currentLevel, setLevel } = useStudentProgress();
  const [selectedLevel, setSelectedLevel] = useState<StudentLevel>(currentLevel);

  const levelsData: {
    level: StudentLevel;
    title: string;
    subtitle: string;
    description: string;
  }[] = [
    {
      level: 'basic',
      title: '1. Básico',
      subtitle: 'Letramento Digital Geral (Sem JS)',
      description:
        'Funcionamento de computadores, atalhos de teclado, navegação na internet, e-mail, senhas e cibersegurança.',
    },
    {
      level: 'beginner',
      title: '2. Iniciante',
      subtitle: 'Introdução ao JavaScript',
      description: 'Primeiras linhas de código, console.log, sintaxe básica e tipos de dados.',
    },
    {
      level: 'intermediate',
      title: '3. Intermediário',
      subtitle: 'Lógica e Controle',
      description: 'Condicionais (if/else), loops, funções e manipuladores simples.',
    },
    {
      level: 'advanced',
      title: '4. Avançado',
      subtitle: 'Projetos e Web',
      description: 'Integração com HTML/CSS, manipulação de DOM e projetos práticos.',
    },
    {
      level: 'expert',
      title: '5. Especialista',
      subtitle: 'Desafios Complexos',
      description: 'Algoritmos avançados, tratamento de erros e aplicações completas.',
    },
  ];

  const handleConfirm = () => {
    setLevel(selectedLevel);
    navigate('/app/trail');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-xl mx-auto">
      <div className="pt-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Sua Jornada
          </span>
          <h1 className="text-3xl font-extrabold display-lg">Escolha seu Nível Inicial</h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            Selecione onde se sente mais confortável. Você pode mudar a qualquer momento.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {levelsData.map((item) => (
            <LevelCard
              key={item.level}
              level={item.level}
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              isSelected={selectedLevel === item.level}
              onSelect={(lvl) => setSelectedLevel(lvl)}
            />
          ))}
        </div>
      </div>

      <div className="py-6 sticky bottom-0 bg-[var(--background)]/90 backdrop-blur-md border-t border-[var(--border)] mt-6">
        <Button variant="primary" onClick={handleConfirm} className="w-full text-base py-3.5">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>Confirmar Nível e Ir para a Trilha</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
