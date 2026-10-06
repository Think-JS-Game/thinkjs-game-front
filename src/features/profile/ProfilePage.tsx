import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';
import { SolanaWalletCard } from '@/components/wallet/SolanaWalletCard';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Settings, 
  Moon, 
  Sun,
  Star,
  Code,
  Medal,
  Lock
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { student } = useAuth();
  const { isDark, toggle } = useTheme();

  const totalXp = 240;
  const streak = 12;
  const achievementsCount = 4;

  const achievements = [
    {
      id: 'a1',
      title: 'Primeiros passos',
      icon: Star,
      isLocked: false,
    },
    {
      id: 'a2',
      title: 'Ofensiva de 7 dias',
      icon: Flame,
      isLocked: false,
    },
    {
      id: 'a3',
      title: 'Mestre das variÃ¡veis',
      icon: Code,
      isLocked: false,
    },
    {
      id: 'a4',
      title: '100 XP',
      icon: Medal,
      isLocked: false,
    },
    {
      id: 'a5',
      title: 'Mestre das funÃ§Ãµes',
      icon: Lock,
      isLocked: true,
    },
    {
      id: 'a6',
      title: 'Explorador de laÃ§os',
      icon: Lock,
      isLocked: true,
    }
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto py-6 sm:py-8 space-y-10 px-4 sm:px-6 md:px-8 bg-[var(--cream)] min-h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] md:text-xl font-extrabold text-[var(--t900)]">
          Perfil
        </h1>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 md:hidden flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] bg-white dark:bg-[var(--sand)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-[var(--t800)] rounded-full transition-colors hover:bg-[var(--sand)]"
            aria-label="ConfiguraÃ§Ãµes"
          >
            <Settings className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-[var(--yellow)] flex items-center justify-center shadow-sm">
          <Zap className="w-10 h-10 fill-current text-black" />
        </div>
        
        <div className="text-center space-y-1">
          <h2 className="font-display font-bold text-2xl text-[var(--t900)] tracking-wide">
            {student?.name || 'Ana'}
          </h2>
          <p className="text-[13px] text-[var(--t600)]">
            Aprendiz de JavaScript
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* XP Card */}
        <div className="bg-white dark:bg-[var(--sand)] p-4 rounded-2xl border border-[var(--border-color)] flex flex-col items-center justify-center gap-1.5 shadow-sm">
          <Zap className="w-5 h-5 text-[var(--yellow-dark)] dark:text-[var(--yellow)] fill-current" />
          <span className="font-display font-bold text-[18px] md:text-xl text-[var(--yellow-dark)] dark:text-[var(--yellow)] leading-none mt-1">
            {totalXp}
          </span>
          <span className="text-[10px] md:text-[11px] text-[var(--t500)] uppercase tracking-wider">
            XP total
          </span>
        </div>

        {/* Streak Card */}
        <div className="bg-white dark:bg-[var(--sand)] p-4 rounded-2xl border border-[var(--border-color)] flex flex-col items-center justify-center gap-1.5 shadow-sm">
          <Flame className="w-5 h-5 text-[var(--coral-mid)] fill-current" />
          <span className="font-display font-bold text-[18px] md:text-xl text-[var(--coral-mid)] leading-none mt-1">
            {streak}
          </span>
          <span className="text-[10px] md:text-[11px] text-[var(--t500)] uppercase tracking-wider">
            Ofensiva
          </span>
        </div>

        {/* Achievements Card */}
        <div className="bg-white dark:bg-[var(--sand)] p-4 rounded-2xl border border-[var(--border-color)] flex flex-col items-center justify-center gap-1.5 shadow-sm">
          <Trophy className="w-5 h-5 text-[var(--menta)] stroke-[2.5]" />
          <span className="font-display font-bold text-[18px] md:text-xl text-[var(--menta)] leading-none mt-1">
            {achievementsCount}
          </span>
          <span className="text-[10px] md:text-[11px] text-[var(--t500)] uppercase tracking-wider">
            Conquistas
          </span>
        </div>
      </div>
      {/* Web3 & Carteira */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-[18px] text-[var(--t900)]">
          Web3 & Carteira
        </h3>
        <SolanaWalletCard />
      </div>

      {/* NFTs de Recompensa */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-[18px] text-[var(--t900)]">
          NFTs de Recompensa
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[var(--sand)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
            <div className="h-32 bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center p-4">
              <span className="text-4xl">🚀</span>
            </div>
            <div className="p-3 text-center border-t border-[var(--border-color)]">
              <span className="font-bold text-[var(--t900)] text-sm block">Pioneiro ThinkJS</span>
              <span className="text-[10px] text-[var(--t500)]">Edição Limitada #42</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[var(--sand)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col opacity-60">
            <div className="h-32 bg-[var(--t300)] dark:bg-[var(--t700)] flex items-center justify-center p-4">
              <Lock className="w-8 h-8 text-[var(--t500)]" />
            </div>
            <div className="p-3 text-center border-t border-[var(--border-color)]">
              <span className="font-bold text-[var(--t900)] text-sm block">Mestre dos Arrays</span>
              <span className="text-[10px] text-[var(--t500)]">Bloqueado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-[18px] text-[var(--t900)]">
          Conquistas
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            
            if (ach.isLocked) {
              return (
                <div key={ach.id} className="bg-[var(--t300)]/10 p-4 md:p-5 rounded-2xl border border-[var(--t300)] border-dashed flex flex-col items-center justify-center gap-3 text-center opacity-80 min-h-[110px]">
                  <div className="w-10 h-10 rounded-full bg-[var(--t300)]/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--t600)] stroke-[2]" />
                  </div>
                  <span className="text-[11px] md:text-[12px] font-bold text-[var(--t600)] leading-tight px-1">
                    {ach.title}
                  </span>
                </div>
              );
            }

            return (
              <div key={ach.id} className="bg-white dark:bg-[var(--sand)] p-4 md:p-5 rounded-2xl border border-[var(--border-color)] flex flex-col items-center justify-center gap-3 text-center shadow-sm min-h-[110px] transition-transform hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-yellow-600 dark:text-[var(--yellow)] stroke-[2]" />
                </div>
                <span className="text-[11px] md:text-[12px] font-extrabold text-[var(--t900)] leading-tight px-1">
                  {ach.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

