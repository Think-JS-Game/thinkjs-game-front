import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AchievementBadge } from '@/components/ui/AchievementBadge';
import { mockAchievements } from '@/data/mock/mockTrailData';
import { ArrowLeft } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/app/profile')}
          className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sand)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div>
          <h1 className="text-2xl font-extrabold display-lg">Galeria de Conquistas</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Badges obtidas ao longo da sua jornada no ThinkJS.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAchievements.map((ach) => (
          <AchievementBadge
            key={ach.id}
            title={ach.title}
            description={ach.description}
            state={ach.unlockedAt ? 'unlocked' : 'locked'}
            unlockedAt={ach.unlockedAt}
          />
        ))}
      </div>
    </div>
  );
};
