import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonProgressHeader } from '@/components/ui/LessonProgressHeader';
import { AttemptIndicator } from '@/components/ui/AttemptIndicator';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { useLessonSession } from '@/features/lessons/LessonSessionContext';
import { useQuestionController } from '@/hooks/useQuestionController';
import { QuestionRenderer } from '@/components/questions/QuestionRenderer';
import { CodeInputFieldState } from '@/components/ui/CodeInputField';

export const LessonQuestionPage: React.FC = () => {
  const { lessonId, questionId } = useParams<{ lessonId: string; questionId: string }>();
  const navigate = useNavigate();
  const { level } = useStudentProgress();
  const session = useLessonSession();

  // Load lesson and start session when lessonId changes
  useEffect(() => {
    if (!lessonId) return;

    let isSubscribed = true;
    defaultTrailRepository.getLessonById(lessonId).then((loadedLesson) => {
      if (!isSubscribed || !loadedLesson) return;
      if (session.lessonId !== loadedLesson.id) {
        session.startSession(loadedLesson);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [lessonId, session]);

  const currentQuestion = session.currentQuestion;

  const controller = useQuestionController(
    currentQuestion,
    (qResult) => {
      session.completeCurrentQuestion(qResult);
      if (session.currentQuestionIndex >= session.totalQuestions - 1) {
        // Last question finished -> navigate to Summary
        navigate(`/app/lesson/${session.lessonId}/summary`);
      } else {
        const nextQuestionNumber = session.currentQuestionIndex + 2;
        navigate(`/app/lesson/${session.lessonId}/question/${nextQuestionNumber}`);
      }
    }
  );

  // Sync questionId from URL if user navigated directly
  useEffect(() => {
    if (questionId && session.questions.length > 0) {
      const idx = parseInt(questionId, 10) - 1;
      if (idx >= 0 && idx < session.questions.length && idx !== session.currentQuestionIndex) {
        controller.resetForNewQuestion();
      }
    }
  }, [questionId, session.questions.length, session.currentQuestionIndex, controller]);

  if (!session.lesson || !currentQuestion) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-[var(--muted-foreground)]">Carregando pergunta...</p>
      </div>
    );
  }

  const isMultipleChoice = currentQuestion.type === 'multiple-choice';

  const handleVerifyClick = () => {
    if (controller.isEvaluating) return;
    controller.evaluateAnswer(controller.selectedOptionId || '');
  };

  const handleCodeExecute = (_code: string, state: CodeInputFieldState) => {
    if (controller.isEvaluating) return;
    controller.evaluateAnswer({ code: _code, isSimulatedSuccess: state === 'success' });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between max-w-2xl mx-auto">
      {/* Lesson Progress Header */}
      <LessonProgressHeader
        questionNumber={session.currentQuestionIndex + 1}
        totalQuestions={session.totalQuestions}
        onClose={() => navigate('/app/trail')}
      />

      {/* Main Question Body */}
      <div className="p-4 sm:p-6 space-y-6 my-auto">
        {/* Attempt Indicator */}
        <div className="flex items-center justify-between">
          <AttemptIndicator currentAttempt={controller.attempt} />
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">
            {isMultipleChoice ? 'Múltipla Escolha' : 'Escrita de Código'}
          </span>
        </div>

        {/* Light Toast Feedback for Attempts 1 & 2 */}
        {controller.lightFeedback && <Alert kind="warning">{controller.lightFeedback}</Alert>}

        {/* System Error Technical Feedback */}
        {controller.systemErrorMessage && <Alert kind="error">{controller.systemErrorMessage}</Alert>}

        {/* Question Statement */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-extrabold display-md leading-relaxed">
            {currentQuestion.statement}
          </h2>
        </div>

        {/* Central Question Renderer */}
        <QuestionRenderer
          question={currentQuestion}
          studentLevel={level}
          selectedOptionId={controller.selectedOptionId}
          onSelectOption={controller.selectOption}
          onCodeExecute={handleCodeExecute}
          disabled={controller.isEvaluating}
        />
      </div>

      {/* Verify Button Footer for Multiple Choice */}
      {isMultipleChoice && (
        <div className="p-4 sm:p-6 border-t border-[var(--border)] bg-[var(--background)]">
          <Button
            variant="primary"
            onClick={handleVerifyClick}
            disabled={!controller.selectedOptionId || controller.isEvaluating}
            isLoading={controller.isEvaluating}
            className="w-full text-base py-3.5"
          >
            <span>{controller.isEvaluating ? 'Verificando...' : 'Verificar Resposta'}</span>
          </Button>
        </div>
      )}

      {/* Feedback Modal (Success or 3rd Attempt Error) */}
      <FeedbackModal
        isOpen={controller.modalState.isOpen}
        kind={controller.modalState.kind}
        explanation={controller.modalState.explanation}
        solutionCode={controller.modalState.solutionCode}
        onContinue={controller.handleModalContinue}
      />
    </div>
  );
};
