export interface CodeExecutionRequest {
  code: string;
  timeoutMs?: number;
  memoryLimitBytes?: number;
}

export type CodeExecutionResult =
  | { kind: 'success'; output: string[]; returnValue?: unknown; truncated?: boolean }
  | { kind: 'syntax-error'; message: string }
  | { kind: 'runtime-error'; message: string }
  | { kind: 'timeout' }
  | { kind: 'memory-limit' }
  | { kind: 'system-error'; message: string };

export interface CodeRunner {
  execute(request: CodeExecutionRequest): Promise<CodeExecutionResult>;
}

export interface WorkerExecutionRequestMessage {
  executionId: string;
  request: CodeExecutionRequest;
}

export interface WorkerExecutionResponseMessage {
  executionId: string;
  result: CodeExecutionResult;
}
