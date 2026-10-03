import { StudentProgress, Module, Lesson, ModuleState, LessonState, ModuleCelebration } from '@/types/trail';
import { Clock, SystemClock, getLocalDateKey } from '@/utils/clock';

export interface LessonCompletionResult {
  alreadyCompleted: boolean;
  xpEarned: number;
  moduleCompleted: boolean;
  completedModuleId?: string;
  unlockedLessonId?: string;
  unlockedModuleId?: string;
}

export interface StreakCalculationInput {
  currentStreak: number;
  lastActivityDate?: string;
  currentDate: Date;
}

export interface StreakCalculationResult {
  streakDays: number;
  lastActivityDate: string;
}

export class ProgressEngine {
  /**
   * Pure function to calculate updated streak based on local calendar dates.
   */
  static calculateNextStreak(input: StreakCalculationInput): StreakCalculationResult {
    const { currentStreak, lastActivityDate, currentDate } = input;
    const todayKey = getLocalDateKey(currentDate);

    if (!lastActivityDate) {
      return { streakDays: 1, lastActivityDate: todayKey };
    }

    if (lastActivityDate === todayKey) {
      return { streakDays: currentStreak, lastActivityDate: todayKey };
    }

    const yesterday = new Date(currentDate.getTime());
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = getLocalDateKey(yesterday);

    if (lastActivityDate === yesterdayKey) {
      return { streakDays: currentStreak + 1, lastActivityDate: todayKey };
    }

    // Skipped 1 or more days -> reset to 1
    return { streakDays: 1, lastActivityDate: todayKey };
  }

  /**
   * Returns true if a module is unlocked for the student.
   */
  static isModuleUnlocked(
    _module: Module,
    moduleIndex: number,
    progress: StudentProgress,
    allLevelModules: Module[]
  ): boolean {
    if (moduleIndex === 0) return true;

    const previousModule = allLevelModules[moduleIndex - 1];
    if (!previousModule) return true;

    if (progress.completedModuleIds.includes(previousModule.id)) {
      return true;
    }

    // Check if all lessons of previous module are completed
    return previousModule.lessons.every((l) => progress.completedLessonIds.includes(l.id));
  }

  /**
   * Determines the state of a module: 'completed' | 'current' | 'locked'.
   */
  static getModuleState(
    module: Module,
    moduleIndex: number,
    progress: StudentProgress,
    allLevelModules: Module[]
  ): ModuleState {
    const isCompleted =
      progress.completedModuleIds.includes(module.id) ||
      (module.lessons.length > 0 && module.lessons.every((l) => progress.completedLessonIds.includes(l.id)));

    if (isCompleted) return 'completed';

    const unlocked = this.isModuleUnlocked(module, moduleIndex, progress, allLevelModules);
    if (unlocked) return 'current';

    return 'locked';
  }

  /**
   * Returns true if a lesson is unlocked for the student.
   */
  static isLessonUnlocked(
    lessonId: string,
    allLevelModules: Module[],
    progress: StudentProgress
  ): boolean {
    if (progress.completedLessonIds.includes(lessonId)) return true;

    for (let mIdx = 0; mIdx < allLevelModules.length; mIdx++) {
      const mod = allLevelModules[mIdx];
      const lIdx = mod.lessons.findIndex((l) => l.id === lessonId);
      if (lIdx !== -1) {
        const modUnlocked = this.isModuleUnlocked(mod, mIdx, progress, allLevelModules);
        if (!modUnlocked) return false;

        if (lIdx === 0) return true;

        const prevLesson = mod.lessons[lIdx - 1];
        return progress.completedLessonIds.includes(prevLesson.id);
      }
    }

    return false;
  }

  /**
   * Determines the state of a lesson: 'completed' | 'current' | 'locked'.
   */
  static getLessonState(
    lesson: Lesson,
    lessonIndex: number,
    module: Module,
    isModuleUnlocked: boolean,
    progress: StudentProgress
  ): LessonState {
    if (progress.completedLessonIds.includes(lesson.id)) {
      return 'completed';
    }

    if (!isModuleUnlocked) {
      return 'locked';
    }

    if (lessonIndex === 0) {
      return 'current';
    }

    const previousLesson = module.lessons[lessonIndex - 1];
    if (previousLesson && progress.completedLessonIds.includes(previousLesson.id)) {
      return 'current';
    }

    return 'locked';
  }

  /**
   * Calculates the completion percentage of a module (0 - 100).
   */
  static calculateModuleProgressPercentage(module: Module, progress: StudentProgress): number {
    if (!module || !module.lessons || module.lessons.length === 0) return 0;
    const completedCount = module.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  }

  /**
   * Pure function to complete a lesson. Idempotent.
   */
  static completeLesson(
    lessonId: string,
    currentProgress: StudentProgress,
    allLevelModules: Module[],
    clock: Clock = new SystemClock()
  ): { nextProgress: StudentProgress; result: LessonCompletionResult } {
    if (currentProgress.completedLessonIds.includes(lessonId)) {
      return {
        nextProgress: currentProgress,
        result: {
          alreadyCompleted: true,
          xpEarned: 0,
          moduleCompleted: false,
        },
      };
    }

    // Find lesson and module
    let targetModule: Module | undefined;
    let targetLesson: Lesson | undefined;
    let targetModuleIndex = -1;

    for (let i = 0; i < allLevelModules.length; i++) {
      const mod = allLevelModules[i];
      const les = mod.lessons.find((l) => l.id === lessonId);
      if (les) {
        targetModule = mod;
        targetLesson = les;
        targetModuleIndex = i;
        break;
      }
    }

    const xpEarned = targetLesson ? targetLesson.xpReward : 0;
    const nextXp = currentProgress.xp + xpEarned;
    const nextCompletedLessonIds = [...currentProgress.completedLessonIds, lessonId];

    const streakResult = this.calculateNextStreak({
      currentStreak: currentProgress.streakDays,
      lastActivityDate: currentProgress.lastActivityDate,
      currentDate: clock.now(),
    });

    let newlyCompletedModule = false;
    const nextCompletedModuleIds = [...currentProgress.completedModuleIds];
    let unlockedModuleId: string | undefined;
    let unlockedLessonId: string | undefined;

    if (targetModule) {
      const isMod100Percent = targetModule.lessons.every((l) => nextCompletedLessonIds.includes(l.id));

      if (isMod100Percent && !nextCompletedModuleIds.includes(targetModule.id)) {
        nextCompletedModuleIds.push(targetModule.id);
        newlyCompletedModule = true;

        const nextModIndex = targetModuleIndex + 1;
        if (nextModIndex < allLevelModules.length) {
          unlockedModuleId = allLevelModules[nextModIndex].id;
        }
      }

      const lessonIndex = targetModule.lessons.findIndex((l) => l.id === lessonId);
      if (lessonIndex >= 0 && lessonIndex + 1 < targetModule.lessons.length) {
        unlockedLessonId = targetModule.lessons[lessonIndex + 1].id;
      }
    }

    let pendingCelebration: ModuleCelebration | undefined = currentProgress.pendingCelebration;
    if (newlyCompletedModule && targetModule) {
      pendingCelebration = {
        type: 'module-completed',
        moduleId: targetModule.id,
        unlockedModuleId,
      };
    }

    const nextProgress: StudentProgress = {
      ...currentProgress,
      xp: nextXp,
      streakDays: streakResult.streakDays,
      lastActivityDate: streakResult.lastActivityDate,
      completedLessonIds: nextCompletedLessonIds,
      completedModuleIds: nextCompletedModuleIds,
      pendingCelebration,
    };

    const result: LessonCompletionResult = {
      alreadyCompleted: false,
      xpEarned,
      moduleCompleted: newlyCompletedModule,
      completedModuleId: newlyCompletedModule && targetModule ? targetModule.id : undefined,
      unlockedLessonId,
      unlockedModuleId,
    };

    return { nextProgress, result };
  }
}
