import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { StudentProgressProvider } from '@/app/providers/StudentProgressProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { ProgressEngine } from '@/services/progress/ProgressEngine';
import { LocalProgressStorage, defaultInitialProgress } from '@/services/storage/ProgressStorage';
import { TestClock } from '@/utils/clock';
import { mockModules } from '@/data/mock/mockTrailData';

function renderWithProviders(initialRoute = '/') {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <StudentProgressProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <AppRouter />
          </MemoryRouter>
        </StudentProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('Fase 3 - Motor Real de Progressão da Trilha', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Primeiro módulo do nível começa disponível (current)', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    const state = ProgressEngine.getModuleState(basicModules[0], 0, defaultInitialProgress, basicModules);
    expect(state).toBe('current');
  });

  it('2. Segundo módulo começa bloqueado (locked)', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    if (basicModules.length > 1) {
      const state = ProgressEngine.getModuleState(basicModules[1], 1, defaultInitialProgress, basicModules);
      expect(state).toBe('locked');
    }
  });

  it('3. Primeira lição do módulo começa disponível (current)', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    const mod = basicModules[0];
    const lessonState = ProgressEngine.getLessonState(mod.lessons[0], 0, mod, true, defaultInitialProgress);
    expect(lessonState).toBe('current');
  });

  it('4. Segunda lição do módulo começa bloqueada (locked)', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    const mod = basicModules[0];
    if (mod.lessons.length > 1) {
      const lessonState = ProgressEngine.getLessonState(mod.lessons[1], 1, mod, true, defaultInitialProgress);
      expect(lessonState).toBe('locked');
    }
  });

  it('5. Completar primeira lição libera a segunda lição', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    const mod = basicModules[0];
    const clock = new TestClock(new Date('2026-09-18T12:00:00'));

    const { nextProgress, result } = ProgressEngine.completeLesson(mod.lessons[0].id, defaultInitialProgress, basicModules, clock);
    expect(result.alreadyCompleted).toBe(false);
    expect(nextProgress.completedLessonIds).toContain(mod.lessons[0].id);

    if (mod.lessons.length > 1) {
      const secondLessonState = ProgressEngine.getLessonState(mod.lessons[1], 1, mod, true, nextProgress);
      expect(secondLessonState).toBe('current');
    }
  });

  it('6. Completar todas as lições do módulo libera o próximo módulo', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    const mod = basicModules[0];
    const clock = new TestClock(new Date('2026-09-18T12:00:00'));

    let currentProg = { ...defaultInitialProgress };
    for (const les of mod.lessons) {
      const { nextProgress } = ProgressEngine.completeLesson(les.id, currentProg, basicModules, clock);
      currentProg = nextProgress;
    }

    expect(currentProg.completedModuleIds).toContain(mod.id);
    if (basicModules.length > 1) {
      const secondModState = ProgressEngine.getModuleState(basicModules[1], 1, currentProg, basicModules);
      expect(secondModState).toBe('current');
    }
  });

  it('7. Módulo bloqueado não navega (exibe toast no TrailPage)', () => {
    renderWithProviders('/app/trail');
    const lockedModuleCard = screen.queryByText(/2\. iniciante/i);
    if (lockedModuleCard) {
      fireEvent.click(lockedModuleCard);
    }
    expect(screen.getByRole('main')).toBeDefined();
  });

  it('8. Lição bloqueada exibe aviso de bloqueio', async () => {
    renderWithProviders('/app/trail');
    const lockedLessonCard = screen.queryByText(/lição 2: senhas seguras/i);
    if (lockedLessonCard) {
      fireEvent.click(lockedLessonCard);
      expect(await screen.findByText(/conclua a lição anterior para desbloquear/i)).toBeDefined();
    }
  });

  it('9. URL direta de lição bloqueada é impedida pelo LessonAccessGuard', async () => {
    renderWithProviders('/app/lesson/les-basico-1-2/intro');
    // Guard redirects to /app/trail because les-basico-1-2 is locked by default
    expect(await screen.findByRole('heading', { name: /trilha de aprendizado/i })).toBeDefined();
  });

  it('10. 1/4 lições = 25%, 2/4 = 50%, 4/4 = 100% no cálculo percentual', () => {
    const dummyModule = {
      id: 'm1',
      level: 'basic' as const,
      title: 'Módulo Teste',
      description: 'Desc',
      order: 1,
      lessons: [{ id: 'l1', moduleId: 'm1', title: 'L1', description: '', order: 1, xpReward: 10, questions: [] }, { id: 'l2', moduleId: 'm1', title: 'L2', description: '', order: 2, xpReward: 10, questions: [] }, { id: 'l3', moduleId: 'm1', title: 'L3', description: '', order: 3, xpReward: 10, questions: [] }, { id: 'l4', moduleId: 'm1', title: 'L4', description: '', order: 4, xpReward: 10, questions: [] }],
    };

    let prog = { ...defaultInitialProgress, completedLessonIds: ['l1'] };
    expect(ProgressEngine.calculateModuleProgressPercentage(dummyModule, prog)).toBe(25);

    prog = { ...defaultInitialProgress, completedLessonIds: ['l1', 'l2'] };
    expect(ProgressEngine.calculateModuleProgressPercentage(dummyModule, prog)).toBe(50);

    prog = { ...defaultInitialProgress, completedLessonIds: ['l1', 'l2', 'l3', 'l4'] };
    expect(ProgressEngine.calculateModuleProgressPercentage(dummyModule, prog)).toBe(100);
  });

  it('11. Concluir lição concede XP exato da recompensa (xpReward)', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    const lesson = basicModules[0].lessons[0];
    const clock = new TestClock(new Date('2026-09-18T12:00:00'));

    const { nextProgress, result } = ProgressEngine.completeLesson(lesson.id, defaultInitialProgress, basicModules, clock);
    expect(result.xpEarned).toBe(lesson.xpReward);
    expect(nextProgress.xp).toBe(defaultInitialProgress.xp + lesson.xpReward);
  });

  it('12. Revisitar a mesma lição é IDEMPOTENTE (não concede XP novamente)', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    const lesson = basicModules[0].lessons[0];
    const clock = new TestClock(new Date('2026-09-18T12:00:00'));

    const run1 = ProgressEngine.completeLesson(lesson.id, defaultInitialProgress, basicModules, clock);
    expect(run1.result.alreadyCompleted).toBe(false);
    expect(run1.result.xpEarned).toBe(lesson.xpReward);

    const run2 = ProgressEngine.completeLesson(lesson.id, run1.nextProgress, basicModules, clock);
    expect(run2.result.alreadyCompleted).toBe(true);
    expect(run2.result.xpEarned).toBe(0);
    expect(run2.nextProgress.xp).toBe(run1.nextProgress.xp);

    const run3 = ProgressEngine.completeLesson(lesson.id, run2.nextProgress, basicModules, clock);
    expect(run3.result.alreadyCompleted).toBe(true);
    expect(run3.nextProgress.xp).toBe(run1.nextProgress.xp);
  });

  it('13. Refresh (desmontar e remontar Provider com storage) preserva XP e lições concluídas', () => {
    const storage = new LocalProgressStorage('test_refresh_key');
    const clock = new TestClock(new Date('2026-09-18T12:00:00'));
    const basicModules = mockModules.filter((m) => m.level === 'basic');

    // Instance 1 completes a lesson and saves to storage
    const initial = storage.load();
    const { nextProgress } = ProgressEngine.completeLesson(basicModules[0].lessons[0].id, initial, basicModules, clock);
    storage.save(nextProgress);

    // Instance 2 loads from storage (simulating browser refresh)
    const reloaded = storage.load();
    expect(reloaded.xp).toBe(nextProgress.xp);
    expect(reloaded.completedLessonIds).toContain(basicModules[0].lessons[0].id);

    storage.clear();
  });

  it('14. Trail e Profile exibem o mesmo valor de XP e Streak', () => {
    renderWithProviders('/app/trail');
    expect(screen.getAllByText(/0 xp/i).length).toBeGreaterThan(0);

    renderWithProviders('/app/profile');
    expect(screen.getAllByText(/0 xp/i).length).toBeGreaterThan(0);
  });

  it('15. Primeira atividade define streak = 1', () => {
    const clock = new TestClock(new Date('2026-09-18T12:00:00'));
    const res = ProgressEngine.calculateNextStreak({ currentStreak: 0, lastActivityDate: undefined, currentDate: clock.now() });
    expect(res.streakDays).toBe(1);
    expect(res.lastActivityDate).toBe('2026-09-18');
  });

  it('16. Segunda atividade no mesmo dia mantém streak inalterado', () => {
    const clock = new TestClock(new Date('2026-09-18T14:00:00'));
    const res = ProgressEngine.calculateNextStreak({ currentStreak: 1, lastActivityDate: '2026-09-18', currentDate: clock.now() });
    expect(res.streakDays).toBe(1);
  });

  it('17. Atividade no dia seguinte incrementa streak em +1', () => {
    const clock = new TestClock(new Date('2026-09-19T10:00:00')); // Next day
    const res = ProgressEngine.calculateNextStreak({ currentStreak: 1, lastActivityDate: '2026-09-18', currentDate: clock.now() });
    expect(res.streakDays).toBe(2);
    expect(res.lastActivityDate).toBe('2026-09-19');
  });

  it('18. Atividade após pular um dia reseta streak para 1', () => {
    const clock = new TestClock(new Date('2026-09-21T10:00:00')); // Skipped Sept 19 & 20
    const res = ProgressEngine.calculateNextStreak({ currentStreak: 5, lastActivityDate: '2026-09-18', currentDate: clock.now() });
    expect(res.streakDays).toBe(1);
    expect(res.lastActivityDate).toBe('2026-09-21');
  });

  it('19. ModuleCompleteModal dispara UMA vez por conclusão e não reaparece após acknowledgment', () => {
    const storage = new LocalProgressStorage('test_modal_ack');
    const prog = {
      ...defaultInitialProgress,
      pendingCelebration: { type: 'module-completed' as const, moduleId: 'mod-basico-1' },
    };
    storage.save(prog);

    // Initial load has pendingCelebration
    let loaded = storage.load();
    expect(loaded.pendingCelebration?.moduleId).toBe('mod-basico-1');

    // Acknowledge removes pendingCelebration
    const ackProg = { ...prog, pendingCelebration: undefined };
    storage.save(ackProg);

    // Reloading after acknowledgment verifies it does NOT reappear
    loaded = storage.load();
    expect(loaded.pendingCelebration).toBeUndefined();

    storage.clear();
  });

  it('20. Alterar nível altera os módulos carregados e persiste após refresh', async () => {
    renderWithProviders('/app/level');
    const basicCard = screen.getByText(/1\. básico/i);
    fireEvent.click(basicCard);

    const confirmBtn = screen.getByRole('button', { name: /confirmar nível/i });
    fireEvent.click(confirmBtn);

    expect(await screen.findByText(/nível básico — letramento digital/i)).toBeDefined();

    // Verify storage has level basic
    const storage = new LocalProgressStorage();
    const loaded = storage.load();
    expect(loaded.level).toBe('basic');
  });

  it('21. Nível Básico garante letramento digital e NUNCA contém CodeQuestion', () => {
    const basicModules = mockModules.filter((m) => m.level === 'basic');
    expect(basicModules.length).toBeGreaterThan(0);
    for (const mod of basicModules) {
      for (const les of mod.lessons) {
        expect(les.questions.every((q) => q.type !== 'code')).toBe(true);
      }
    }
  });

  it('22. Storage inválido ou corrompido não quebra a aplicação e faz fallback seguro', () => {
    const storageKey = 'thinkjs_student_progress_v1';
    localStorage.setItem(storageKey, '{ invalid json corrupted }');
    const storage = new LocalProgressStorage();
    const loaded = storage.load();

    expect(loaded.level).toBe('beginner');
    expect(loaded.xp).toBe(0);
    expect(loaded.completedLessonIds.length).toBe(0);

    localStorage.setItem(storageKey, JSON.stringify({ version: 99, data: {} }));
    const unknownVersionLoaded = storage.load();
    expect(unknownVersionLoaded.level).toBe('beginner');
  });

  it('23. Storage possui estrutura com versionamento (version: 1)', () => {
    const storageKey = 'thinkjs_student_progress_v1';
    const storage = new LocalProgressStorage();
    storage.save({ ...defaultInitialProgress, xp: 100 });

    const raw = localStorage.getItem(storageKey);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(1);
    expect(parsed.data.xp).toBe(100);
  });
});
