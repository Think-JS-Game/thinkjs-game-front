import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { StudentLevel } from '@/types/student';
import { StudentProgress, Module, ModuleCelebration } from '@/types/trail';
import { LocalProgressStorage, ProgressStorage, defaultInitialProgress } from '@/services/storage/ProgressStorage';
import { ProgressEngine, LessonCompletionResult } from '@/services/progress/ProgressEngine';
import { Clock, SystemClock } from '@/utils/clock';
import { apiFetch, getAccessToken } from '@/services/api/apiClient';
import { useAuth } from '@/app/providers/AuthProvider';
import { defaultPendingOperationStore, PendingOperation } from '@/services/storage/PendingOperationStore';
import { syncCoordinator } from '@/services/network/SyncCoordinator';

interface SyncState {
  syncing: boolean;
  pendingCount: number;
  failedCount: number;
}

interface StudentProgressContextType {
  progress: StudentProgress;
  level: StudentLevel;
  xp: number;
  streakDays: number;
  completedLessonIds: string[];
  completedModuleIds: string[];
  pendingCelebration?: ModuleCelebration;
  isHydrated: boolean;
  syncState: SyncState;
  syncError?: string | null;
  setLevel: (level: StudentLevel) => void;
  completeLesson: (lessonId: string, allLevelModules: Module[], clock?: Clock) => LessonCompletionResult;
  completeLessonRemote: (lessonId: string) => Promise<LessonCompletionResult>;
  acknowledgeCelebration: () => void;
  isLessonUnlocked: (lessonId: string, allLevelModules: Module[]) => boolean;
  isModuleUnlocked: (moduleId: string, allLevelModules: Module[]) => boolean;
  resetProgress: () => void;
}

const StudentProgressContext = createContext<StudentProgressContextType | undefined>(undefined);

export const StudentProgressProvider: React.FC<{
  children: React.ReactNode;
  storage?: ProgressStorage;
}> = ({ children, storage: customStorage }) => {
  const { student, isAuthenticated } = useAuth();
  const userId = student?.id || null;
  const storage = useMemo(() => customStorage || new LocalProgressStorage(), [customStorage]);
  const [progress, setProgress] = useState<StudentProgress>(defaultInitialProgress);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>({ syncing: false, pendingCount: 0, failedCount: 0 });

  // Inicia a reidratação do progresso remoto
  const rehydrateRemoteProgress = useCallback(async () => {
    if (!isAuthenticated || !getAccessToken()) return;
    try {
      const remoteProgress: any = await apiFetch('/progress');
      setProgress((prev) => ({
        ...prev,
        level: (remoteProgress.level as StudentLevel) || prev.level,
        xp: remoteProgress.total_xp ?? prev.xp,
        streakDays: remoteProgress.streak ?? prev.streakDays,
        completedLessonIds: remoteProgress.completed_lessons || [],
        completedModuleIds: remoteProgress.completed_modules || [],
        achievements: remoteProgress.achievements || [],
      }));
      setSyncError(null);
    } catch {
      setSyncError('Não foi possível sincronizar o progresso com o servidor.');
    }
  }, [isAuthenticated]);

  // Inicializa o SyncCoordinator e limpa listeners
  useEffect(() => {
    if (userId) {
      syncCoordinator.init(userId, rehydrateRemoteProgress);
      const unsub = syncCoordinator.subscribe(setSyncState);
      return () => {
        unsub();
        syncCoordinator.destroy();
      };
    }
  }, [userId, rehydrateRemoteProgress]);

  // Carregamento inicial do estado
  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      if (isAuthenticated && getAccessToken()) {
        await rehydrateRemoteProgress();
      } else {
        const loaded = storage.load();
        if (isMounted) {
          setProgress(loaded);
        }
      }
      if (isMounted) {
        setIsHydrated(true);
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, rehydrateRemoteProgress, storage]);

  // Atualização de progresso e persistência local/fallback
  const updateProgress = useCallback(
    (updater: (prev: StudentProgress) => StudentProgress) => {
      setProgress((prev) => {
        const next = updater(prev);
        storage.save(next);
        return next;
      });
    },
    [storage]
  );

  const setLevel = useCallback(
    (newLevel: StudentLevel) => {
      updateProgress((prev) => ({
        ...prev,
        level: newLevel,
      }));
      if (isAuthenticated && getAccessToken()) {
        apiFetch('/profiles/level', {
          method: 'PATCH',
          body: JSON.stringify({ level: newLevel }),
        }).catch(() => {
          // fallback
        });
      }
    },
    [isAuthenticated, updateProgress]
  );

  // Conclusão local de lição (desacoplada para componentes/testes locais)
  const completeLesson = useCallback(
    (lessonId: string, allLevelModules: Module[], clock: Clock = new SystemClock()): LessonCompletionResult => {
      let resultToReturn: LessonCompletionResult = {
        alreadyCompleted: false,
        xpEarned: 0,
        moduleCompleted: false,
      };

      updateProgress((prev) => {
        const { nextProgress, result } = ProgressEngine.completeLesson(lessonId, prev, allLevelModules, clock);
        resultToReturn = result;
        return nextProgress;
      });

      return resultToReturn;
    },
    [updateProgress]
  );

  // Conclusão Server-Authoritative com resiliência de Fila Offline (IndexedDB)
  const completeLessonRemote = useCallback(
    async (lessonId: string): Promise<LessonCompletionResult> => {
      setSyncError(null);
      try {
        const res: any = await apiFetch(`/progress/lessons/${lessonId}/complete`, {
          method: 'POST',
        });

        setProgress((prev) => {
          const completedLessons = prev.completedLessonIds.includes(lessonId)
            ? prev.completedLessonIds
            : [...prev.completedLessonIds, lessonId];

          const nextProg: StudentProgress = {
            ...prev,
            xp: res.total_xp,
            streakDays: res.streak,
            completedLessonIds: completedLessons,
            completedModuleIds: res.module_completed
              ? [...new Set([...prev.completedModuleIds, res.unlocked_module_id || ''])]
              : prev.completedModuleIds,
          };
          storage.save(nextProg);
          return nextProg;
        });

        return {
          alreadyCompleted: res.already_completed,
          xpEarned: res.xp_earned,
          moduleCompleted: res.module_completed,
          unlockedLessonId: res.unlocked_lesson_id || undefined,
          unlockedModuleId: res.unlocked_module_id || undefined,
        };
      } catch (err: any) {
        // Se a requisição falhar por motivo de rede/servidor offline, registra na PendingOperationQueue
        if (userId && (err.code === 'NETWORK_ERROR' || err.code === 'NETWORK_TIMEOUT' || err.code === 'HTTP_ERROR')) {
          const pendingOp: PendingOperation = {
            schemaVersion: 1,
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `op_${Date.now()}`,
            userId,
            type: 'COMPLETE_LESSON',
            payload: { lessonId },
            createdAt: new Date().toISOString(),
            attempts: 0,
            status: 'pending',
          };
          await defaultPendingOperationStore.add(pendingOp);
          await syncCoordinator.triggerSync();
        }

        setSyncError(err.message || 'Erro de rede ao salvar progresso. Salvo na fila offline.');
        throw err;
      }
    },
    [userId, storage]
  );

  const acknowledgeCelebration = useCallback(() => {
    updateProgress((prev) => ({
      ...prev,
      pendingCelebration: undefined,
    }));
  }, [updateProgress]);

  const isLessonUnlocked = useCallback(
    (lessonId: string, allLevelModules: Module[]): boolean => {
      return ProgressEngine.isLessonUnlocked(lessonId, allLevelModules, progress);
    },
    [progress]
  );

  const isModuleUnlocked = useCallback(
    (moduleId: string, allLevelModules: Module[]): boolean => {
      const idx = allLevelModules.findIndex((m) => m.id === moduleId);
      if (idx === -1) return false;
      const mod = allLevelModules[idx];
      return ProgressEngine.isModuleUnlocked(mod, idx, progress, allLevelModules);
    },
    [progress]
  );

  const resetProgress = useCallback(() => {
    storage.clear();
    setProgress({ ...defaultInitialProgress });
  }, [storage]);

  return (
    <StudentProgressContext.Provider
      value={{
        progress,
        level: progress.level,
        xp: progress.xp,
        streakDays: progress.streakDays,
        completedLessonIds: progress.completedLessonIds,
        completedModuleIds: progress.completedModuleIds,
        pendingCelebration: progress.pendingCelebration,
        isHydrated,
        syncState,
        syncError,
        setLevel,
        completeLesson,
        completeLessonRemote,
        acknowledgeCelebration,
        isLessonUnlocked,
        isModuleUnlocked,
        resetProgress,
      }}
    >
      {children}
    </StudentProgressContext.Provider>
  );
};

export const useStudentProgress = () => {
  const context = useContext(StudentProgressContext);
  if (!context) {
    throw new Error('useStudentProgress deve ser utilizado dentro de um StudentProgressProvider');
  }
  return context;
};
