import { EvaluationResult } from '@/types/questionEngine';

export interface QuestionEvaluator<TQuestion, TAnswer> {
  evaluate(question: TQuestion, answer: TAnswer): Promise<EvaluationResult>;
}
