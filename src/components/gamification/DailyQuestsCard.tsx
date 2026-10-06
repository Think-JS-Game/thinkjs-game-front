import React from 'react';
import { Target, Zap, Flame, Trophy, CheckCircle2, ChevronRight } from 'lucide-react';
import type { DailyQuest } from '@/types/gamification';

interface DailyQuestsCardProps {
  quests: DailyQuest[];
  onClaim?: (questId: string) => void;
  className?: string;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  quests,
  className = '',
}) => {
  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 'challenge':
        return <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />;
      case 'xp':
        return <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
      default:
        return <Target className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className={`bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 shadow-xs space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--yellow-light)] flex items-center justify-center text-[var(--yellow-dark)]">
            <Target className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-base display-md text-[var(--foreground)]">Missões Diárias</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Reseta todos os dias às 00:00</p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--sand)] text-[var(--muted-foreground)] border border-[var(--border)]">
          {quests.filter((q) => q.completed).length}/{quests.length} Concluídas
        </span>
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {quests.map((quest) => {
          const progressPercent = Math.min(
            100,
            Math.round((quest.currentValue / quest.targetValue) * 100)
          );

          return (
            <div
              key={quest.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-4 ${
                quest.completed
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-[var(--sand)]/50 border-[var(--border)] hover:border-[var(--muted-foreground)]/30'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 shadow-xs">
                {quest.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
                ) : (
                  getQuestIcon(quest.type)
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-[var(--foreground)] truncate">
                    {quest.title}
                  </h4>
                  <span className="text-xs font-extrabold text-[var(--yellow-dark)] shrink-0">
                    +{quest.xpReward} XP
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        quest.completed ? 'bg-emerald-500' : 'bg-[var(--yellow-dark)]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[var(--muted-foreground)]">
                    <span>{quest.description}</span>
                    <span className="font-bold">
                      {quest.currentValue}/{quest.targetValue}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-50" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
