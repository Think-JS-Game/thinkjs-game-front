import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AttemptIndicator } from '@/components/ui/AttemptIndicator';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import { Alert } from '@/components/ui/Alert';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { useLessonSession } from '@/features/lessons/LessonSessionContext';
import { useQuestionController } from '@/hooks/useQuestionController';
import { QuestionRenderer } from '@/components/questions/QuestionRenderer';
import { CodeInputFieldState } from '@/components/ui/CodeInputField';
import { X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const LessonQuestionPage: React.FC = () => {
  const { lessonId, questionId } = useParams<{ lessonId: string; questionId: string }>();
  const navigate = useNavigate();
  const { level } = useStudentProgress();
  const session = useLessonSession();
  const { isDark, toggle } = useTheme();

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
        <p className="text-sm text-[var(--t500)]">Carregando pergunta...</p>
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
    <div className="w-full mx-auto py-0 sm:py-8 md:px-8 bg-[var(--cream)] min-h-screen">
      
      {/* Container Principal - Fills height on mobile, acts as a card on desktop */}
      <div className="bg-white dark:bg-[var(--sand)] sm:rounded-[2rem] p-6 md:p-8 sm:shadow-sm sm:border border-[var(--border-color)] h-screen sm:h-auto sm:min-h-[800px] flex flex-col max-w-[800px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/trail')}
              className="p-2 -ml-2 rounded-full text-[var(--t800)] hover:text-[var(--t900)] transition-colors hover:bg-[var(--sand)] dark:hover:bg-[var(--background)]"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
            <AttemptIndicator currentAttempt={controller.attempt} />
          </div>

          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 md:hidden flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 w-full max-w-[600px] mx-auto pb-10 space-y-6">
          
          {/* Light Toast Feedback for Attempts 1 & 2 */}
          {controller.lightFeedback && <Alert kind="warning">{controller.lightFeedback}</Alert>}

          {/* System Error Technical Feedback */}
          {controller.systemErrorMessage && <Alert kind="error">{controller.systemErrorMessage}</Alert>}

          {/* Question Statement */}
          <h2 className="text-[18px] sm:text-xl font-display font-bold text-[var(--t900)] leading-snug">
            {currentQuestion.statement}
          </h2>

          {/* Central Question Renderer */}
          <QuestionRenderer
            question={currentQuestion}
            studentLevel={level}
            selectedOptionId={controller.selectedOptionId}
            incorrectOptionIds={controller.incorrectOptionIds}
            onSelectOption={controller.selectOption}
            onCodeExecute={handleCodeExecute}
            disabled={controller.isEvaluating}
          />

        </div>

        {/* Verify Button Footer for Multiple Choice */}
        {isMultipleChoice && (
          <div className="pt-6 mt-auto max-w-[800px] w-full mx-auto">
            <button
              onClick={handleVerifyClick}
              disabled={!controller.selectedOptionId || controller.isEvaluating}
              className={`w-full font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-sm ${
                !controller.selectedOptionId || controller.isEvaluating
                  ? 'bg-[var(--yellow)]/50 text-black/50 cursor-not-allowed'
                  : 'bg-[var(--yellow)] hover:bg-[var(--yellow-dark)] text-black'
              }`}
            >
              {controller.isEvaluating ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        )}
      </div>

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
