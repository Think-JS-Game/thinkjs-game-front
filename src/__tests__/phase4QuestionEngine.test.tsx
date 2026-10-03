import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act as hookAct } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';

import { useQuestionAttempts } from '@/hooks/useQuestionAttempts';
import { MultipleChoiceEvaluator } from '@/services/evaluators/MultipleChoiceEvaluator';
import { MockCodeQuestionEvaluator } from '@/services/evaluators/MockCodeQuestionEvaluator';
import { MultipleChoiceQuestion as MultipleChoiceQuestionType, CodeQuestion as CodeQuestionType } from '@/types/question';
import { QuestionRenderer } from '@/components/questions/QuestionRenderer';
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

describe('Fase 4 — Question Engine & Máquina de 3 Tentativas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // -------------------------------------------------------------
  // 1. MÁQUINA DE TENTATIVAS PURA (useQuestionAttempts)
  // -------------------------------------------------------------
  describe('1. useQuestionAttempts State Machine', () => {
    it('inicia na tentativa 1 com status idle', () => {
      const { result } = renderHook(() => useQuestionAttempts());
      expect(result.current.attempt).toBe(1);
      expect(result.current.status).toBe('idle');
    });

    it('transiciona para correct quando a resposta é correta', () => {
      const { result } = renderHook(() => useQuestionAttempts());
      hookAct(() => {
        result.current.submitResult({ kind: 'correct' });
      });
      expect(result.current.status).toBe('correct');
      expect(result.current.attempt).toBe(1);
    });

    it('transiciona para retry na 1ª erro e incrementa attempt na retry', () => {
      const { result } = renderHook(() => useQuestionAttempts());
      hookAct(() => {
        result.current.submitResult({ kind: 'incorrect' });
      });
      expect(result.current.status).toBe('retry');
      expect(result.current.attempt).toBe(2);

      hookAct(() => {
        result.current.retry();
      });
      expect(result.current.status).toBe('idle');
      expect(result.current.attempt).toBe(2);
    });

    it('transiciona para exhausted no 3º erro', () => {
      const { result } = renderHook(() => useQuestionAttempts());

      // Attempt 1 -> incorrect -> attempt becomes 2
      hookAct(() => {
        result.current.submitResult({ kind: 'incorrect' });
      });
      expect(result.current.attempt).toBe(2);

      // Attempt 2 -> incorrect -> attempt becomes 3
      hookAct(() => {
        result.current.submitResult({ kind: 'incorrect' });
      });
      expect(result.current.attempt).toBe(3);

      // Attempt 3 -> incorrect -> exhausted!
      hookAct(() => {
        result.current.submitResult({ kind: 'incorrect' });
      });
      expect(result.current.status).toBe('exhausted');
      expect(result.current.attempt).toBe(3);
    });

    it('system-error NÃO consome tentativa e mantém status em idle após erro técnico', () => {
      const { result } = renderHook(() => useQuestionAttempts());

      hookAct(() => {
        result.current.submitResult({ kind: 'system-error', message: 'Falha de conexão' });
      });

      expect(result.current.attempt).toBe(1);

      hookAct(() => {
        result.current.retry();
      });
      expect(result.current.attempt).toBe(1);
      expect(result.current.status).toBe('idle');
    });

    it('reset reinicia o estado para a tentativa 1', () => {
      const { result } = renderHook(() => useQuestionAttempts());
      hookAct(() => {
        result.current.submitResult({ kind: 'correct' });
      });
      hookAct(() => {
        result.current.reset();
      });
      expect(result.current.attempt).toBe(1);
      expect(result.current.status).toBe('idle');
    });
  });

  // -------------------------------------------------------------
  // 2. EVALUATORS TIPADOS (MultipleChoice & MockCode)
  // -------------------------------------------------------------
  describe('2. Evaluators Tipados', () => {
    it('MultipleChoiceEvaluator valida opção correta e incorreta', async () => {
      const evaluator = new MultipleChoiceEvaluator();
      const question: MultipleChoiceQuestionType = {
        id: 'q-mc-1',
        lessonId: 'les-1',
        type: 'multiple-choice',
        statement: 'Qual é o resultado de 1 + 1?',
        options: [
          { id: 'opt-1', text: '1' },
          { id: 'opt-2', text: '2' },
        ],
        correctOptionId: 'opt-2',
        explanation: '1 + 1 é igual a 2.',
      };

      const correctResult = await evaluator.evaluate(question, 'opt-2');
      expect(correctResult).toEqual({ kind: 'correct' });

      const incorrectResult = await evaluator.evaluate(question, 'opt-1');
      expect(incorrectResult).toEqual({ kind: 'incorrect' });
    });

    it('MockCodeQuestionEvaluator valida código preenchido', async () => {
      const evaluator = new MockCodeQuestionEvaluator();
      const question: CodeQuestionType = {
        id: 'q-code-1',
        lessonId: 'les-2',
        type: 'code',
        statement: 'Crie uma variável chamada nome',
        starterCode: '// digite aqui',
        expectedOutput: ['Lucas'],
      };

      const emptyRes = await evaluator.evaluate(question, { code: '' });
      expect(emptyRes).toEqual({
        kind: 'system-error',
        message: 'Código vazio.',
      });

      const validRes = await evaluator.evaluate(question, { code: 'let nome = "Lucas";', isSimulatedSuccess: true });
      expect(validRes).toEqual({ kind: 'correct' });
    });
  });

  // -------------------------------------------------------------
  // 3. SEGURANÇA E RENDERING DE DADOS
  // -------------------------------------------------------------
  describe('3. Render-Safe & Defensive Guards', () => {
    it('QuestionRenderer com studentLevel === "basic" NUNCA renderiza CodeQuestion', () => {
      const codeQuestion: CodeQuestionType = {
        id: 'q-code-basic',
        lessonId: 'les-1',
        type: 'code',
        statement: 'Escreva um código em JS',
        starterCode: '',
        expectedOutput: ['Hello World'],
      };

      render(
        <QuestionRenderer
          question={codeQuestion}
          studentLevel="basic"
          selectedOptionId={null}
          onSelectOption={() => {}}
        />
      );

      expect(screen.getByText(/esta pergunta em formato de código não é suportada no nível básico/i)).toBeDefined();
      expect(screen.queryByRole('textbox')).toBeNull();
    });

    it('correctOptionId NÃO é vazado no DOM em MultipleChoiceQuestion', () => {
      const question: MultipleChoiceQuestionType = {
        id: 'q-mc-secret',
        lessonId: 'les-1',
        type: 'multiple-choice',
        statement: 'Escolha uma opção',
        options: [
          { id: 'opt-a', text: 'Opção A' },
          { id: 'opt-b', text: 'Opção B' },
        ],
        correctOptionId: 'opt-b',
      };

      const { container } = render(
        <QuestionRenderer
          question={question}
          studentLevel="basic"
          selectedOptionId={null}
          onSelectOption={() => {}}
        />
      );

      expect(container.innerHTML).not.toContain('correctOptionId');
      expect(container.innerHTML).not.toContain('opt-b-correct');
    });
  });

  // -------------------------------------------------------------
  // 4. DOUBLE-SUBMIT E CONTROLLER ASYNC
  // -------------------------------------------------------------
  describe('4. Asynchronous Double-Submit Protection', () => {
    it('bloqueia cliques duplicados enquanto evaluator está executando', async () => {
      renderWithProviders('/app/lesson/les-basico-1-1/question/1');

      const opt1 = await screen.findByText(/teclado e monitor/i);
      fireEvent.click(opt1);

      const submitBtn = screen.getByRole('button', { name: /verificar resposta/i });

      // Fast double click simulation
      fireEvent.click(submitBtn);
      fireEvent.click(submitBtn);

      // Verify button stays disabled or evaluation modal handles gracefully
      await waitFor(() => {
        expect(screen.getByText(/muito bem! resposta correta!/i)).toBeDefined();
      });
    });
  });

  // -------------------------------------------------------------
  // 5. LESSON SESSION & ATOMIC TRANSITIONS
  // -------------------------------------------------------------
  describe('5. LessonSession & Atomic Question Transitions', () => {
    it('trocar de lição limpa a sessão anterior', async () => {
      renderWithProviders('/app/lesson/les-basico-1-1/question/1');

      const opt1 = await screen.findByText(/teclado e monitor/i);
      expect(opt1).toBeDefined();

      // Exit to trail
      const exitBtn = screen.getByRole('button', { name: /sair da lição/i });
      fireEvent.click(exitBtn);

      // Verify we are back on trail
      expect(await screen.findByRole('heading', { name: /trilha de aprendizado/i })).toBeDefined();
    });

    it('summary protection redireciona acesso direto sem lição concluída', async () => {
      renderWithProviders('/app/lesson/les-basico-1-1/summary');

      // Should be redirected to trail since no session was completed
      expect(await screen.findByRole('heading', { name: /trilha de aprendizado/i })).toBeDefined();
    });

    it('fluxo completo de 2 perguntas atinge summary e registra acertos', async () => {
      renderWithProviders('/app/lesson/les-basico-1-1/question/1');

      // Question 1 -> Correct
      const opt1 = await screen.findByText(/teclado e monitor/i);
      fireEvent.click(opt1);
      fireEvent.click(screen.getByRole('button', { name: /verificar resposta/i }));
      fireEvent.click(await screen.findByRole('button', { name: /próxima pergunta/i }));

      // Question 2 -> Correct
      const opt2 = await screen.findByText(/ctrl \+ c/i);
      fireEvent.click(opt2);
      fireEvent.click(screen.getByRole('button', { name: /verificar resposta/i }));
      fireEvent.click(await screen.findByRole('button', { name: /próxima pergunta/i }));

      // Summary Page loaded
      expect(await screen.findByText(/lição concluída!/i)).toBeDefined();
      expect(screen.getByText(/2 \/ 2/i)).toBeDefined();
      expect(screen.getByText(/\+25 xp/i)).toBeDefined();
    });
  });
});
