import { QuestionEvaluator } from './QuestionEvaluator';
import { MultipleChoiceQuestion } from '@/types/question';
import { EvaluationResult } from '@/types/questionEngine';

export class MultipleChoiceEvaluator implements QuestionEvaluator<MultipleChoiceQuestion, string> {
  async evaluate(question: MultipleChoiceQuestion, selectedOptionId: string): Promise<EvaluationResult> {
    if (!selectedOptionId) {
      return { kind: 'system-error', message: 'Nenhuma opção selecionada.' };
    }

    const isCorrect = selectedOptionId === question.correctOptionId;
    if (isCorrect) {
      return { kind: 'correct' };
    }
    return { kind: 'incorrect' };
  }
}

export const defaultMultipleChoiceEvaluator = new MultipleChoiceEvaluator();
