import { StudentProgress } from '@/types/trail';
import { StudentLevel } from '@/types/student';

export interface ProgressStorageDataV1 {
  version: 1;
  data: StudentProgress;
}

export interface ProgressStorage {
  load(): StudentProgress;
  save(progress: StudentProgress): void;
  clear(): void;
}

export const defaultInitialProgress: StudentProgress = {
  level: 'beginner',
  xp: 0,
  streakDays: 0,
  completedLessonIds: [],
  completedModuleIds: [],
};

const VALID_LEVELS: StudentLevel[] = ['basic', 'beginner', 'intermediate', 'advanced', 'expert'];
const STORAGE_KEY = 'thinkjs_student_progress_v1';

export class LocalProgressStorage implements ProgressStorage {
  private key: string;

  constructor(key: string = STORAGE_KEY) {
    this.key = key;
  }

  load(): StudentProgress {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) {
        return { ...defaultInitialProgress };
      }

      const parsed = JSON.parse(raw);

      // Validate version
      if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
        return { ...defaultInitialProgress };
      }

      const data = parsed.data;
      if (!data || typeof data !== 'object') {
        return { ...defaultInitialProgress };
      }

      // Structural validation of required fields
      if (
        typeof data.xp !== 'number' ||
        isNaN(data.xp) ||
        typeof data.streakDays !== 'number' ||
        isNaN(data.streakDays) ||
        !Array.isArray(data.completedLessonIds) ||
        !Array.isArray(data.completedModuleIds) ||
        !VALID_LEVELS.includes(data.level)
      ) {
        return { ...defaultInitialProgress };
      }

      return {
        level: data.level,
        xp: data.xp,
        streakDays: data.streakDays,
        completedLessonIds: data.completedLessonIds,
        completedModuleIds: data.completedModuleIds,
        lastActivityDate: typeof data.lastActivityDate === 'string' ? data.lastActivityDate : undefined,
        pendingCelebration: data.pendingCelebration && typeof data.pendingCelebration === 'object' ? data.pendingCelebration : undefined,
      };
    } catch {
      return { ...defaultInitialProgress };
    }
  }

  save(progress: StudentProgress): void {
    try {
      const payload: ProgressStorageDataV1 = {
        version: 1,
        data: progress,
      };
      localStorage.setItem(this.key, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save student progress to localStorage:', err);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (err) {
      console.warn('Failed to clear student progress from localStorage:', err);
    }
  }
}
