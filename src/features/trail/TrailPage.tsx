import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrilhaNode, TrilhaNodeState } from '@/components/ui/TrilhaNode';
import { LessonCard } from '@/components/ui/LessonCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { ProgressEngine } from '@/services/progress/ProgressEngine';
import { Module } from '@/types/trail';
import { Sparkles, Trophy } from 'lucide-react';

export const TrailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { progress, level, pendingCelebration, acknowledgeCelebration } = useStudentProgress();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check for location state toast message (e.g. from guard redirect)
  useEffect(() => {
    const locState = location.state as { toastMessage?: string } | undefined;
    if (locState?.toastMessage) {
      setToastMessage(locState.toastMessage);
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    defaultTrailRepository.getModulesByLevel(level).then((mods) => {
      setModules(mods);
      if (mods.length > 0) {
        setSelectedModuleId((prev) => {
          if (prev && mods.some((m) => m.id === prev)) return prev;
          return mods[0].id;
        });
      }
    });
  }, [level]);

  const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
  const activeModuleIndex = modules.findIndex((m) => m.id === activeModule?.id);

  const handleModuleClick = (mod: Module, index: number) => {
    const state = ProgressEngine.getModuleState(mod, index, progress, modules);
    if (state === 'locked') {
      const prevMod = modules[index - 1];
      const prevTitle = prevMod ? prevMod.title : 'anterior';
      setToastMessage(`Termine o módulo "${prevTitle}" pra desbloquear esse.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    setSelectedModuleId(mod.id);
  };

  const handleLessonSelect = (lessonId: string, isLocked: boolean) => {
    if (isLocked) {
      setToastMessage('Conclua a lição anterior para desbloquear esta.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    navigate(`/app/lesson/${lessonId}/intro`);
  };

  const levelLabels: Record<string, string> = {
    basic: 'Nível Básico — Letramento Digital',
    beginner: 'Nível Iniciante — Introdução ao JS',
    intermediate: 'Nível Intermediário — Lógica de Programação',
    advanced: 'Nível Avançado — Projetos Web',
    expert: 'Nível Especialista — Algoritmos Complexos',
  };

  // Check details for pending celebration modal
  const completedCelebrationModule = pendingCelebration
    ? modules.find((m) => m.id === pendingCelebration.moduleId)
    : null;
  const unlockedCelebrationModule = pendingCelebration?.unlockedModuleId
    ? modules.find((m) => m.id === pendingCelebration.unlockedModuleId)
    : null;

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-in fade-in slide-in-from-top-4">
          <Alert kind="warning" title="Módulo/Lição Bloqueada">
            {toastMessage}
          </Alert>
        </div>
      )}

      {/* Header Level Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--yellow-light)] text-[var(--t900)] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--yellow-dark)]" />
            <span>{levelLabels[level] || level}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold display-lg">Trilha de Aprendizado</h1>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/app/level')}
          className="!py-2 text-xs font-bold shrink-0"
        >
          Alterar Nível
        </Button>
      </div>

      {/* Modules Flow Horizontal / Vertical Grid */}
      <div className="space-y-4">
        <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted-foreground)]">
          Módulos do Nível ({modules.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, index) => {
            const domainState = ProgressEngine.getModuleState(mod, index, progress, modules);
            const nodeState: TrilhaNodeState = domainState === 'completed' ? 'done' : domainState;
            return (
              <TrilhaNode
                key={mod.id}
                title={mod.title}
                order={mod.order}
                state={nodeState}
                lessonCount={mod.lessons.length}
                onClick={() => handleModuleClick(mod, index)}
              />
            );
          })}
        </div>
      </div>

      {/* Active Module Detail Section */}
      {activeModule && (
        <div className="bg-[var(--card)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-xs space-y-6">
          <div className="space-y-3">
            {(() => {
              const pct = ProgressEngine.calculateModuleProgressPercentage(activeModule, progress);
              return (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                      Módulo Ativo
                    </span>
                    <span className="text-xs font-extrabold text-[var(--menta)]">{pct}% Concluído</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold display-md">{activeModule.title}</h2>
                  <p className="text-sm text-[var(--muted-foreground)] body-md">
                    {activeModule.description}
                  </p>

                  <ProgressBar progress={pct} showPercentage={true} />
                </>
              );
            })()}
          </div>

          {/* Lessons List */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-extrabold display-md">Lições do Módulo</h3>

            <div className="space-y-3">
              {activeModule.lessons.map((lesson, idx) => {
                const isActiveModUnlocked = ProgressEngine.isModuleUnlocked(
                  activeModule,
                  activeModuleIndex,
                  progress,
                  modules
                );
                const domainLessonState = ProgressEngine.getLessonState(
                  lesson,
                  idx,
                  activeModule,
                  isActiveModUnlocked,
                  progress
                );

                // Map domain state to LessonCard prop state: 'completed' | 'available' | 'locked'
                const cardState =
                  domainLessonState === 'completed'
                    ? 'completed'
                    : domainLessonState === 'current'
                    ? 'available'
                    : 'locked';

                const isLocked = domainLessonState === 'locked';

                return (
                  <LessonCard
                    key={lesson.id}
                    title={lesson.title}
                    description={lesson.description}
                    order={lesson.order}
                    xpReward={lesson.xpReward}
                    state={cardState}
                    onSelect={() => handleLessonSelect(lesson.id, isLocked)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Module Complete Overlay Modal (Shows ONCE per pendingCelebration) */}
      {pendingCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--card)] rounded-3xl p-6 sm:p-8 border-2 border-[var(--yellow)] shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-[var(--yellow)] text-[var(--t900)] flex items-center justify-center mx-auto shadow-md">
              <Trophy className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[var(--menta)] uppercase">
                Parabéns! Módulo Concluído!
              </span>
              <h2 className="text-2xl font-extrabold display-lg">
                Você finalizou o {completedCelebrationModule?.title || 'Módulo'}!
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] body-md">
                {unlockedCelebrationModule
                  ? `O próximo módulo ("${unlockedCelebrationModule.title}") foi desbloqueado com sucesso.`
                  : 'Você concluiu todos os módulos disponíveis deste nível!'}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => acknowledgeCelebration()}
              className="w-full py-3.5"
            >
              Continuar na Trilha
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
