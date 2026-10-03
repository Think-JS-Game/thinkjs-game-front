import { TrailRepository } from './TrailRepository';
import { Module, Lesson } from '@/types/trail';
import { StudentLevel } from '@/types/student';
import { mockModules } from '@/data/mock/mockTrailData';

export class MockTrailRepository implements TrailRepository {
  async getModulesByLevel(level: StudentLevel): Promise<Module[]> {
    return mockModules.filter((m) => m.level === level);
  }

  async getModuleById(moduleId: string): Promise<Module | null> {
    const found = mockModules.find((m) => m.id === moduleId);
    return found || null;
  }

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    for (const mod of mockModules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  }
}

export const defaultTrailRepository = new MockTrailRepository();
