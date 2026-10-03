import { QuestionEvaluator } from './QuestionEvaluator';
import { CodeQuestion, CodeValidation } from '@/types/question';
import { EvaluationResult } from '@/types/questionEngine';
import { CodeRunner, CodeExecutionResult } from '../codeRunner/CodeRunner';
import { defaultQuickJSCodeRunner } from '../codeRunner/QuickJSCodeRunner';
import { safeSerializeValue } from '../codeRunner/consoleFormatter';

export function normalizeOutputLines(output: string[]): string[] {
  return output.map((line) => line.replace(/\r\n/g, '\n').trimEnd());
}

export class CodeQuestionEvaluator
  implements QuestionEvaluator<CodeQuestion, string | { code: string; isSimulatedSuccess?: boolean }> {
  constructor(private runner: CodeRunner = defaultQuickJSCodeRunner) {}

  async evaluate(
    question: CodeQuestion,
    answer: string | { code: string; isSimulatedSuccess?: boolean }
  ): Promise<EvaluationResult> {
    const code = typeof answer === 'string' ? answer : answer.code;

    // Fast-path for empty code input
    if (!code || !code.trim()) {
      return {
        kind: 'incorrect',
        feedback: 'Por favor, digite uma solução de código válida antes de verificar.',
      };
    }

    const execResult: CodeExecutionResult = await this.runner.execute({ code });

    return this.processResult(question, execResult);
  }

  private processResult(question: CodeQuestion, res: CodeExecutionResult): EvaluationResult {
    switch (res.kind) {
      case 'success': {
        const validation: CodeValidation = question.validation || {
          type: 'output',
          expectedOutput: question.expectedOutput || [],
        };

        if (validation.type === 'output') {
          const normalizedActual = normalizeOutputLines(res.output);
          const normalizedExpected = normalizeOutputLines(validation.expectedOutput);

          // Check if expected output is satisfied
          const isMatch =
            normalizedExpected.length > 0 &&
            normalizedExpected.every((exp, idx) => {
              const actualLine = normalizedActual[idx] || '';
              return actualLine === exp || actualLine.includes(exp);
            });

          if (isMatch) {
            return { kind: 'correct' };
          } else {
            return {
              kind: 'incorrect',
              feedback: 'A saída no console foi diferente da esperada para este exercício.',
            };
          }
        }

        if (validation.type === 'function-tests') {
          const actualReturn = safeSerializeValue(res.returnValue);
          const isMatch = validation.tests.some(
            (t) => safeSerializeValue(t.expected) === actualReturn
          );

          if (isMatch) {
            return { kind: 'correct' };
          }
          return {
            kind: 'incorrect',
            feedback: 'O retorno da sua função não correspondeu ao resultado esperado.',
          };
        }

        return { kind: 'correct' };
      }

      case 'syntax-error':
        return {
          kind: 'incorrect',
          feedback: 'Há um erro na sintaxe do seu código. Revise e tente novamente.',
        };

      case 'runtime-error': {
        // Sanitize error message: omit internal paths or engine traces
        const cleanMsg = res.message.split('\n')[0].replace(/\/.*\/|\(.*\)/g, '');
        return {
          kind: 'incorrect',
          feedback: `Ocorreu um erro na execução do código: ${cleanMsg}`,
        };
      }

      case 'timeout':
        return {
          kind: 'incorrect',
          feedback: 'Seu código demorou demais para terminar. Verifique se existe um loop que não termina.',
        };

      case 'memory-limit':
        return {
          kind: 'incorrect',
          feedback: 'Seu código usou recursos demais durante a execução.',
        };

      case 'system-error':
        return {
          kind: 'system-error',
          message: res.message || 'Falha técnica no ambiente de execução.',
        };
    }
  }
}

export const defaultCodeQuestionEvaluator = new CodeQuestionEvaluator();
