import { useState, useCallback } from 'react';
import { EvaluationResult } from '@/types/questionEngine';

export type QuestionAttemptStatus = 'idle' | 'evaluating' | 'correct' | 'retry' | 'exhausted';

export interface UseQuestionAttemptsReturn {
  attempt: number;
  maxAttempts: number;
  status: QuestionAttemptStatus;
  submitResult: (result: EvaluationResult) => void;
  setEvaluatingState: () => void;
  retry: () => void;
  reset: () => void;
}

export const MAX_ATTEMPTS = 3;

export function useQuestionAttempts(initialAttempt = 1): UseQuestionAttemptsReturn {
  const [attempt, setAttempt] = useState<number>(initialAttempt);
  const [status, setStatus] = useState<QuestionAttemptStatus>('idle');

  const setEvaluatingState = useCallback(() => {
    setStatus('evaluating');
  }, []);

  const submitResult = useCallback((result: EvaluationResult) => {
    if (result.kind === 'system-error') {
      // System errors do NOT consume an attempt
      setStatus('idle');
      return;
    }

    if (result.kind === 'correct') {
      setStatus('correct');
      return;
    }

    // Incorrect answer handling
    setAttempt((prev) => {
      if (prev < MAX_ATTEMPTS) {
        setStatus('retry');
        return prev + 1;
      } else {
        setStatus('exhausted');
        return MAX_ATTEMPTS;
      }
    });
  }, []);

  const retry = useCallback(() => {
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    setAttempt(1);
    setStatus('idle');
  }, []);

  return {
    attempt,
    maxAttempts: MAX_ATTEMPTS,
    status,
    submitResult,
    setEvaluatingState,
    retry,
    reset,
  };
}
