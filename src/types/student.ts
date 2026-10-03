export type StudentLevel = 'basic' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Student {
  id: string;
  name: string;
  email: string;
  birthYear: number;
  avatarId: string;
  level: StudentLevel;
  xp: number;
  streakDays: number;
  schoolCode?: string;
  guardianConsentGranted?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
