import {
  CodeRunner,
  CodeExecutionRequest,
  CodeExecutionResult,
  WorkerExecutionRequestMessage,
  WorkerExecutionResponseMessage,
} from './CodeRunner';
import { CODE_RUNNER_DEFAULTS } from './CodeRunnerDefaults';

export class QuickJSCodeRunner implements CodeRunner {
  private worker: Worker | null = null;
  private currentExecutionId: string | null = null;

  private getOrCreateWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('../../workers/codeRunner.worker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return this.worker;
  }

  private terminateWorker() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.currentExecutionId = null;
  }

  getCurrentExecutionId(): string | null {
    return this.currentExecutionId;
  }

  async execute(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    const worker = this.getOrCreateWorker();
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.currentExecutionId = executionId;

    const hostTimeoutMs = request.timeoutMs
      ? request.timeoutMs + 1000
      : CODE_RUNNER_DEFAULTS.HOST_TIMEOUT_MS;

    return new Promise<CodeExecutionResult>((resolve) => {
      let isSettled = false;
      let hostTimer: ReturnType<typeof setTimeout> | null = null;

      const cleanup = () => {
        if (hostTimer) {
          clearTimeout(hostTimer);
          hostTimer = null;
        }
        if (worker) {
          worker.removeEventListener('message', handleMessage);
          worker.removeEventListener('error', handleError);
        }
      };

      const handleMessage = (event: MessageEvent<WorkerExecutionResponseMessage>) => {
        const { executionId: resId, result } = event.data;
        if (resId !== executionId || isSettled) return;

        isSettled = true;
        cleanup();
        resolve(result);
      };

      const handleError = (errorEvent: ErrorEvent) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        this.terminateWorker();
        resolve({
          kind: 'system-error',
          message: errorEvent.message || 'Falha catastrófica no Web Worker.',
        });
      };

      hostTimer = setTimeout(() => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        // Host timeout: terminate stuck worker and re-create fresh for next run
        this.terminateWorker();
        resolve({ kind: 'timeout' });
      }, hostTimeoutMs);

      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);

      const requestMsg: WorkerExecutionRequestMessage = {
        executionId,
        request,
      };

      worker.postMessage(requestMsg);
    });
  }

  dispose() {
    this.terminateWorker();
  }
}

export const defaultQuickJSCodeRunner = new QuickJSCodeRunner();
