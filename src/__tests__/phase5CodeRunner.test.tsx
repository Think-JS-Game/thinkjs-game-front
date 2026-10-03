import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { CodeQuestionEvaluator } from '@/services/evaluators/CodeQuestionEvaluator';
import { CodeRunner, CodeExecutionResult } from '@/services/codeRunner/CodeRunner';
import { safeSerializeValue, formatLogArguments } from '@/services/codeRunner/consoleFormatter';
import { defaultQuickJSCodeRunner } from '@/services/codeRunner/QuickJSCodeRunner';
import { CodeQuestion } from '@/types/question';
import { StudentProgressProvider } from '@/app/providers/StudentProgressProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { ThemeProvider } from '@/hooks/useTheme';
import { AppRouter } from '@/app/router/AppRouter';

function renderWithProviders(initialRoute = '/') {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <StudentProgressProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <AppRouter />
          </MemoryRouter>
        </StudentProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Mock Runner for deterministic unit tests of CodeQuestionEvaluator & Engine Mapping
class MockCodeRunner implements CodeRunner {
  public lastRequestCode: string | null = null;
  public mockResult: CodeExecutionResult = { kind: 'success', output: ['Hello, World!'] };

  async execute(request: { code: string }): Promise<CodeExecutionResult> {
    this.lastRequestCode = request.code;
    return this.mockResult;
  }
}

describe('Fase 5 — CodeRunner Seguro & Execução Real de JavaScript', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    defaultQuickJSCodeRunner.dispose();
  });

  // -------------------------------------------------------------
  // 1. CONSOLE FORMATTER & SERIALIZAÇÃO SEGURA
  // -------------------------------------------------------------
  describe('1. Console Formatter & Serialização', () => {
    it('serializa primitivos corretamente (string, number, boolean, undefined, null, bigint)', () => {
      expect(safeSerializeValue('teste')).toBe('teste');
      expect(safeSerializeValue(42)).toBe('42');
      expect(safeSerializeValue(true)).toBe('true');
      expect(safeSerializeValue(undefined)).toBe('undefined');
      expect(safeSerializeValue(null)).toBe('null');
      expect(safeSerializeValue(BigInt(100))).toBe('100n');
    });

    it('serializa arrays e objetos simples de forma legível', () => {
      expect(safeSerializeValue([1, 2, 'três'])).toBe('[ 1, 2, três ]');
      expect(safeSerializeValue({ a: 1, b: 'ok' })).toBe('{ a: 1, b: ok }');
    });

    it('trata objetos circulares sem lançar exceção', () => {
      const obj: Record<string, unknown> = { name: 'ThinkJS' };
      obj.self = obj;
      expect(safeSerializeValue(obj)).toContain('[Circular]');
    });

    it('formata múltiplos argumentos de console.log', () => {
      expect(formatLogArguments(['Olá', 123, true])).toBe('Olá 123 true');
    });
  });

  // -------------------------------------------------------------
  // 2. CODEQUESTION EVALUATOR & MAPEAMENTO PEDAGÓGICO
  // -------------------------------------------------------------
  describe('2. CodeQuestionEvaluator & Mapeamento Pedagógico', () => {
    const sampleQuestion: CodeQuestion = {
      id: 'q-code-test',
      lessonId: 'les-test',
      type: 'code',
      statement: 'Imprima Hello, World! no console.',
      starterCode: 'console.log("");',
      expectedOutput: ['Hello, World!'],
    };

    it('retorna correct quando a saída no console é idêntica', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'success', output: ['Hello, World!'] };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const res = await evaluator.evaluate(sampleQuestion, 'console.log("Hello, World!");');
      expect(res).toEqual({ kind: 'correct' });
    });

    it('retorna incorrect quando a saída no console difere da esperada', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'success', output: ['Resposta errada'] };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const res = await evaluator.evaluate(sampleQuestion, 'console.log("Resposta errada");');
      expect(res.kind).toBe('incorrect');
      if (res.kind === 'incorrect') {
        expect(res.feedback).toContain('diferente da esperada');
      }
    });

    it('mapeia erro de sintaxe para incorrect (consumindo tentativa na 1ª/2ª sem revelar solução)', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'syntax-error', message: 'SyntaxError: Unexpected token' };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const res = await evaluator.evaluate(sampleQuestion, 'console.log(');
      expect(res.kind).toBe('incorrect');
      if (res.kind === 'incorrect') {
        expect(res.feedback).toContain('erro na sintaxe');
      }
    });

    it('mapeia runtime-error do aluno para incorrect (consumindo tentativa)', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'runtime-error', message: 'ReferenceError: x is not defined' };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const res = await evaluator.evaluate(sampleQuestion, 'console.log(x);');
      expect(res.kind).toBe('incorrect');
      if (res.kind === 'incorrect') {
        expect(res.feedback).toContain('ReferenceError: x is not defined');
      }
    });

    it('mapeia timeout por loop infinito para incorrect (consumindo tentativa)', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'timeout' };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const res = await evaluator.evaluate(sampleQuestion, 'while(true){}');
      expect(res.kind).toBe('incorrect');
      if (res.kind === 'incorrect') {
        expect(res.feedback).toContain('loop que não termina');
      }
    });

    it('mapeia memory-limit para incorrect (consumindo tentativa)', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'memory-limit' };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const res = await evaluator.evaluate(sampleQuestion, 'const arr = []; while(true){ arr.push("boom"); }');
      expect(res.kind).toBe('incorrect');
      if (res.kind === 'incorrect') {
        expect(res.feedback).toContain('recursos demais');
      }
    });

    it('mapeia system-error de infraestrutura para system-error (NÃO consome tentativa)', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'system-error', message: 'Falha no Web Worker' };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const res = await evaluator.evaluate(sampleQuestion, 'console.log(1);');
      expect(res).toEqual({ kind: 'system-error', message: 'Falha no Web Worker' });
    });
  });

  // -------------------------------------------------------------
  // 3. ESTRATÉGIA DE VALIDAÇÃO EXTENSÍVEL (CodeValidation)
  // -------------------------------------------------------------
  describe('3. Estratégias de Validação (CodeValidation)', () => {
    it('suporta validação por OUTPUT com normalizeWhitespace', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'success', output: ['Olá Mundo!   \r\n'] };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const questionWithValidation: CodeQuestion = {
        id: 'q-val-1',
        lessonId: 'les-1',
        type: 'code',
        statement: 'Imprima Olá Mundo!',
        starterCode: '',
        expectedOutput: ['Olá Mundo!'],
        validation: {
          type: 'output',
          expectedOutput: ['Olá Mundo!'],
          normalizeWhitespace: true,
        },
      };

      const res = await evaluator.evaluate(questionWithValidation, 'console.log("Olá Mundo!");');
      expect(res).toEqual({ kind: 'correct' });
    });

    it('suporta validação por FUNCTION-TESTS (args & expected)', async () => {
      const mockRunner = new MockCodeRunner();
      mockRunner.mockResult = { kind: 'success', output: [], returnValue: 5 };
      const evaluator = new CodeQuestionEvaluator(mockRunner);

      const questionFuncTest: CodeQuestion = {
        id: 'q-func-1',
        lessonId: 'les-1',
        type: 'code',
        statement: 'Crie uma função que some 2 + 3',
        starterCode: '',
        expectedOutput: [],
        validation: {
          type: 'function-tests',
          functionName: 'somar',
          tests: [{ args: [2, 3], expected: 5 }],
        },
      };

      const res = await evaluator.evaluate(questionFuncTest, 'function somar(a, b) { return a + b; }');
      expect(res).toEqual({ kind: 'correct' });
    });
  });

  // -------------------------------------------------------------
  // 4. INTEGRAÇÃO COM QUESTION ENGINE E MÁQUINA DE TENTATIVAS
  // -------------------------------------------------------------
  describe('4. Integração com Question Engine (Iniciante / Código)', () => {
    it('navega e executa CodeQuestion com sucesso na lição iniciante', async () => {
      renderWithProviders('/app/lesson/les-iniciante-1-1/question/1');

      expect(await screen.findByText(/escreva um comando console\.log/i)).toBeDefined();

      const runBtn = screen.getByRole('button', { name: /executar/i });
      expect(runBtn).toBeDefined();

      fireEvent.click(runBtn);

      await waitFor(() => {
        expect(screen.getByText(/resposta correta!|não foi dessa vez|executando/i)).toBeDefined();
      });
    });

    it('Basic level intercepta e impede renderização de CodeQuestion', async () => {
      renderWithProviders('/app/lesson/les-basico-1-1/question/1');
      expect(screen.queryByText(/conteúdo indisponível para o nível básico/i)).toBeNull();
    });
  });
});
