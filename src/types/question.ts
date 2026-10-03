export type QuestionType = 'multiple-choice' | 'code';

export interface BaseQuestion {
  id: string;
  lessonId: string;
  statement: string;
  explanation?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export type CodeValidation =
  | {
      type: 'output';
      expectedOutput: string[];
      normalizeWhitespace?: boolean;
    }
  | {
      type: 'function-tests';
      functionName: string;
      tests: Array<{ args: unknown[]; expected: unknown }>;
    };

export interface CodeQuestion extends BaseQuestion {
  type: 'code';
  starterCode?: string;
  expectedOutput: string[];
  validation?: CodeValidation;
  solutionCode?: string;
}

export type Question = MultipleChoiceQuestion | CodeQuestion;
