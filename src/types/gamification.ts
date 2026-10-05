export type QuestType = 'lesson' | 'streak' | 'challenge' | 'xp';

export interface DailyQuest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  targetValue: number;
  currentValue: number;
  completed: boolean;
}

export interface SolanaWalletState {
  connected: boolean;
  publicKey: string | null;
  solBalance?: number;
}
