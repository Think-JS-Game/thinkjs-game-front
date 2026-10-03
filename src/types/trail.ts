import { StudentLevel } from './student';
import { Question } from './question';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  questions: Question[];
  resources?: {
    id: string;
    title: string;
    type: 'video' | 'article';
    url: string;
  }[];
}

export interface Module {
  id: string;
  level: StudentLevel;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface ModuleCelebration {
  type: 'module-completed';
  moduleId: string;
  unlockedModuleId?: string;
}

export interface StudentProgress {
  studentId?: string;
  level: StudentLevel;
  xp: number;
  streakDays: number;
  completedLessonIds: string[];
  completedModuleIds: string[];
  lastActivityDate?: string; // YYYY-MM-DD local date key
  pendingCelebration?: ModuleCelebration;
}

export type ModuleState = 'completed' | 'current' | 'locked';
export type LessonState = 'completed' | 'current' | 'locked';
