import React from 'react';
import { Question, MultipleChoiceQuestion as MCQuestion, CodeQuestion } from '@/types/question';
import { StudentLevel } from '@/types/student';
import { RenderableMultipleChoiceQuestion } from '@/types/questionEngine';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { type CodeInputFieldState } from '@/components/ui/CodeInputField';
import { MonacoCodeEditor } from '@/components/ui/MonacoCodeEditor';
import { Alert } from '@/components/ui/Alert';

interface QuestionRendererProps {
  question: Question;
  studentLevel: StudentLevel;
  selectedOptionId: string | null;
  incorrectOptionIds?: string[];
  onSelectOption: (optionId: string) => void;
  onCodeExecute?: (code: string, state: CodeInputFieldState) => void;
  disabled?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  studentLevel,
  selectedOptionId,
  incorrectOptionIds = [],
  onSelectOption,
  onCodeExecute,
  disabled = false,
}) => {
  // Defensive Guard: Level Basic must NEVER render CodeQuestion
  if (studentLevel === 'basic' && question.type === 'code') {
    console.error('Dado Inválido: Nível Básico não pode conter CodeQuestion.', { questionId: question.id });
    return (
      <Alert kind="error" title="Formato Inválido">
        Esta pergunta em formato de código não é suportada no nível Básico.
      </Alert>
    );
  }

  if (question.type === 'multiple-choice') {
    const mc = question as MCQuestion;

    // Sanitize question data for UI (stripping correctOptionId)
    const renderableQuestion: RenderableMultipleChoiceQuestion = {
      id: mc.id,
      lessonId: mc.lessonId,
      statement: mc.statement,
      codeSnippet: mc.codeSnippet,
      options: mc.options.map((o) => ({ id: o.id, text: o.text })),
      type: 'multiple-choice',
    };

    return (
      <MultipleChoiceQuestion
        question={renderableQuestion}
        selectedOptionId={selectedOptionId}
        incorrectOptionIds={incorrectOptionIds}
        onSelectOption={onSelectOption}
        disabled={disabled}
      />
    );
  }

  if (question.type === 'code') {
    const codeQ = question as CodeQuestion;
    return (
      <div className="pt-2">
        <MonacoCodeEditor
          initialCode={codeQ.starterCode}
          expectedOutput={codeQ.expectedOutput}
          onExecute={(code, state) => onCodeExecute && onCodeExecute(code, state)}
          disabled={disabled}
        />
      </div>
    );
  }

  return null;
};
