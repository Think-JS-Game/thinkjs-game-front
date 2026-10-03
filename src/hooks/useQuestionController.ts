import { useState, useCallback } from 'react';
import { Question } from '@/types/question';
import { EvaluationResult } from '@/types/questionEngine';
import { useQuestionAttempts } from './useQuestionAttempts';
import { defaultMultipleChoiceEvaluator } from '@/services/evaluators/MultipleChoiceEvaluator';
import { defaultCodeQuestionEvaluator } from '@/services/evaluators/CodeQuestionEvaluator';

export interface ModalState {
  isOpen: boolean;
  kind: 'success' | 'error';
  explanation?: string;
  solutionCode?: string;
}

export function useQuestionController(
  question: Question | null,
  onQuestionCompleted: (result: { questionId: string; correct: boolean; attemptsUsed: number }) => void
) {
  const attempts = useQuestionAttempts(1);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [lightFeedback, setLightFeedback] = useState<string | null>(null);
  const [systemErrorMessage, setSystemErrorMessage] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    kind: 'success',
  });

  const evaluateAnswer = useCallback(
    async (answerPayload: string | { code: string; isSimulatedSuccess?: boolean }) => {
      if (!question || isEvaluating) return;

      // Synchronous double-submit guard
      setIsEvaluating(true);
      attempts.setEvaluatingState();
      setLightFeedback(null);
      setSystemErrorMessage(null);

      try {
        let evalResult: EvaluationResult;

        if (question.type === 'multiple-choice') {
          evalResult = await defaultMultipleChoiceEvaluator.evaluate(question, answerPayload as string);
        } else {
          evalResult = await defaultCodeQuestionEvaluator.evaluate(
            question,
            typeof answerPayload === 'string' ? { code: answerPayload } : answerPayload
          );
        }

        // Process EvaluationResult discriminated union
        if (evalResult.kind === 'system-error') {
          attempts.submitResult(evalResult);
          setSystemErrorMessage(evalResult.message || 'Ocorreu um erro técnico no sistema.');
          setIsEvaluating(false);
          return;
        }

        if (evalResult.kind === 'correct') {
          attempts.submitResult(evalResult);
          setModalState({
            isOpen: true,
            kind: 'success',
            explanation: question.explanation,
          });
        } else {
          // kind === 'incorrect'
          const nextAttempt = attempts.attempt;
          attempts.submitResult(evalResult);

          if (nextAttempt < 3) {
            const feedbackMsg =
              question.type === 'multiple-choice'
                ? 'Resposta incorreta. Tente novamente!'
                : 'Código com erros ou saída incorreta. Tente novamente!';
            setLightFeedback(feedbackMsg);
            setTimeout(() => setLightFeedback(null), 3000);
          } else {
            // 3rd attempt failed -> open Error FeedbackModal with solution/explanation
            setModalState({
              isOpen: true,
              kind: 'error',
              explanation: question.explanation,
              solutionCode: question.type === 'code' ? question.solutionCode : undefined,
            });
          }
        }
      } catch (err: unknown) {
        setSystemErrorMessage(err instanceof Error ? err.message : 'Erro inesperado na avaliação.');
      } finally {
        setIsEvaluating(false);
      }
    },
    [question, isEvaluating, attempts]
  );

  const handleModalContinue = useCallback(() => {
    if (!question) return;

    const isCorrect = modalState.kind === 'success';
    const attemptsUsed = attempts.attempt;

    setModalState((prev) => ({ ...prev, isOpen: false }));
    setSelectedOptionId(null);
    setLightFeedback(null);
    setSystemErrorMessage(null);
    attempts.reset();

    onQuestionCompleted({
      questionId: question.id,
      correct: isCorrect,
      attemptsUsed,
    });
  }, [question, modalState.kind, attempts, onQuestionCompleted]);

  const selectOption = useCallback((optionId: string) => {
    setSelectedOptionId(optionId);
  }, []);

  const resetForNewQuestion = useCallback(() => {
    setSelectedOptionId(null);
    setLightFeedback(null);
    setSystemErrorMessage(null);
    setModalState({ isOpen: false, kind: 'success' });
    attempts.reset();
  }, [attempts]);

  return {
    attempt: attempts.attempt,
    maxAttempts: attempts.maxAttempts,
    status: attempts.status,
    isEvaluating,
    selectedOptionId,
    lightFeedback,
    systemErrorMessage,
    modalState,
    selectOption,
    evaluateAnswer,
    handleModalContinue,
    resetForNewQuestion,
  };
}
