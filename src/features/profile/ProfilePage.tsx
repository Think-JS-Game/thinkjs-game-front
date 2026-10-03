import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chip } from '@/components/ui/Chip';
import { AchievementBadge } from '@/components/ui/AchievementBadge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/app/providers/AuthProvider';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { mockAchievements, mockAvatars } from '@/data/mock/mockTrailData';
import { Settings, Award, Edit2, Sparkles, X, Check } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useAuth();
  const { xp, streakDays, level } = useStudentProgress();

  const [selectedAvatarId, setSelectedAvatarId] = useState(student?.avatarId || 'avatar-1');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const currentAvatar = mockAvatars.find((a) => a.id === selectedAvatarId) || mockAvatars[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header */}
      <div className="bg-[var(--card)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Circle with edit badge */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-[var(--yellow-light)] border-2 border-[var(--yellow)] flex items-center justify-center text-4xl shadow-sm">
                <span>{currentAvatar.icon}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                aria-label="Trocar avatar"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--yellow)] text-[var(--t900)] border border-[var(--yellow-dark)] flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
              >
                <Edit2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--sand)] border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--yellow-dark)]" />
                <span>Nível: {level.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold display-lg">
                {student?.name || 'Alex Developer'}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">{student?.email}</p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate('/app/settings')}
            className="!py-2 text-xs font-bold shrink-0"
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </Button>
        </div>

        {/* HUD Stats */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border)]">
          <Chip kind="xp" value={xp} label="Acumulados" />
          <Chip kind="streak" value={streakDays} label="Seguidos" />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--yellow-dark)] stroke-[2.5]" />
            <h2 className="text-xl font-extrabold display-md">Minhas Conquistas</h2>
          </div>
          <Link
            to="/app/profile/achievements"
            className="text-xs font-bold text-[var(--yellow-dark)] hover:underline"
          >
            Ver Todas ({mockAchievements.length})
          </Link>
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

      {/* Avatar Selector Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--card)] rounded-3xl p-6 border-2 border-[var(--border)] shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold display-md">Escolha seu Avatar</h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Grid (8 options from DS) */}
            <div className="grid grid-cols-4 gap-3">
              {mockAvatars.map((av) => {
                const isSelected = av.id === selectedAvatarId;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(av.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[var(--yellow-light)] border-[var(--yellow-dark)] ring-2 ring-[var(--yellow)] scale-105'
                        : 'bg-[var(--sand)] border-[var(--border)] hover:bg-[var(--border-color)]'
                    }`}
                  >
                    <span className="text-3xl">{av.icon}</span>
                    <span className="text-[10px] font-bold text-[var(--foreground)] truncate w-full text-center">
                      {av.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              onClick={() => setShowAvatarModal(false)}
              className="w-full py-3"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar Avatar</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
