import { Module, Lesson } from '@/types/trail';
import { StudentLevel } from '@/types/student';

export interface TrailRepository {
  getModulesByLevel(level: StudentLevel): Promise<Module[]>;
  getModuleById(moduleId: string): Promise<Module | null>;
  getLessonById(lessonId: string): Promise<Lesson | null>;
}
