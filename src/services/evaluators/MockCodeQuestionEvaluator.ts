import { QuestionEvaluator } from './QuestionEvaluator';
import { CodeQuestion } from '@/types/question';
import { EvaluationResult } from '@/types/questionEngine';

/**
 * Temporary Mock Evaluator for CodeQuestion.
 * ISOLATED: Phase 5 will replace this with CodeRunnerEvaluator (running real JS in Web Workers/sandbox)
 * without requiring any changes to useQuestionAttempts, LessonSession, or FeedbackModal.
 */
export class MockCodeQuestionEvaluator implements QuestionEvaluator<CodeQuestion, { code: string; isSimulatedSuccess?: boolean }> {
  async evaluate(
    question: CodeQuestion,
    answer: { code: string; isSimulatedSuccess?: boolean }
  ): Promise<EvaluationResult> {
    if (answer.isSimulatedSuccess !== undefined) {
      return answer.isSimulatedSuccess ? { kind: 'correct' } : { kind: 'incorrect' };
    }

    // Deterministic check for starter vs edited code or expected output match
    const codeTrimmed = (answer.code || '').trim();
    if (!codeTrimmed) {
      return { kind: 'system-error', message: 'Código vazio.' };
    }

    // Simple deterministic heuristic for temporary mock:
    // If solutionCode is provided and matches trimmed, or if expected output substring exists
    if (question.solutionCode && codeTrimmed === question.solutionCode.trim()) {
      return { kind: 'correct' };
    }

    if (question.expectedOutput && question.expectedOutput.some((out) => codeTrimmed.includes(out))) {
      return { kind: 'correct' };
    }

    return { kind: 'incorrect' };
  }
}

export const defaultMockCodeQuestionEvaluator = new MockCodeQuestionEvaluator();
