export type EvaluationResult =
  | { kind: 'correct'; feedback?: string }
  | { kind: 'incorrect'; feedback?: string }
  | { kind: 'system-error'; message: string };

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  attemptsUsed: number;
}

export interface LessonResult {
  lessonId: string;
  correctAnswers: number;
  totalQuestions: number;
  questionResults: QuestionResult[];
}

export interface RenderableOption {
  id: string;
  text: string;
}

export interface RenderableMultipleChoiceQuestion {
  id: string;
  lessonId: string;
  statement: string;
  codeSnippet?: string;
  options: RenderableOption[];
  type: 'multiple-choice';
}
