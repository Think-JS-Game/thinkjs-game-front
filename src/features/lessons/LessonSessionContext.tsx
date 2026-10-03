import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Lesson } from '@/types/trail';
import { Question } from '@/types/question';
import { QuestionResult, LessonResult } from '@/types/questionEngine';

interface LessonSessionContextType {
  lessonId: string | null;
  lesson: Lesson | null;
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  results: QuestionResult[];
  lessonResult: LessonResult | null;
  isSessionCompleted: boolean;
  correctAnswers: number;
  totalQuestions: number;
  startSession: (lesson: Lesson) => void;
  completeCurrentQuestion: (result: QuestionResult) => void;
  resetSession: () => void;
}

const LessonSessionContext = createContext<LessonSessionContextType | undefined>(undefined);

export const LessonSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);
  const [isSessionCompleted, setIsSessionCompleted] = useState<boolean>(false);

  const startSession = useCallback((newLesson: Lesson) => {
    setLessonId(newLesson.id);
    setLesson(newLesson);
    setQuestions(newLesson.questions || []);
    setCurrentQuestionIndex(0);
    setResults([]);
    setLessonResult(null);
    setIsSessionCompleted(false);
  }, []);

  const resetSession = useCallback(() => {
    setLessonId(null);
    setLesson(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResults([]);
    setLessonResult(null);
    setIsSessionCompleted(false);
  }, []);

  const completeCurrentQuestion = useCallback(
    (qResult: QuestionResult) => {
      setResults((prevResults) => {
        // Prevent duplicate results for the same questionId
        if (prevResults.some((r) => r.questionId === qResult.questionId)) {
          return prevResults;
        }

        const nextResults = [...prevResults, qResult];

        // Check if all questions have been answered
        if (nextResults.length >= questions.length && questions.length > 0) {
          const finalCorrectAnswers = nextResults.filter((r) => r.correct).length;
          const generatedLessonResult: LessonResult = {
            lessonId: lessonId || '',
            correctAnswers: finalCorrectAnswers,
            totalQuestions: questions.length,
            questionResults: nextResults,
          };
          setLessonResult(generatedLessonResult);
          setIsSessionCompleted(true);
        } else {
          setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
        }

        return nextResults;
      });
    },
    [questions.length, lessonId]
  );

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);

  const correctAnswers = useMemo(() => {
    return results.filter((r) => r.correct).length;
  }, [results]);

  const totalQuestions = questions.length;

  return (
    <LessonSessionContext.Provider
      value={{
        lessonId,
        lesson,
        questions,
        currentQuestionIndex,
        currentQuestion,
        results,
        lessonResult,
        isSessionCompleted,
        correctAnswers,
        totalQuestions,
        startSession,
        completeCurrentQuestion,
        resetSession,
      }}
    >
      {children}
    </LessonSessionContext.Provider>
  );
};

export const useLessonSession = () => {
  const context = useContext(LessonSessionContext);
  if (!context) {
    throw new Error('useLessonSession must be used within a LessonSessionProvider');
  }
  return context;
};
