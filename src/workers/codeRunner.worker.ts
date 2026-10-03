import { getQuickJS, shouldInterruptAfterDeadline } from 'quickjs-emscripten';
import { CODE_RUNNER_DEFAULTS } from '../services/codeRunner/CodeRunnerDefaults';
import { formatLogArguments } from '../services/codeRunner/consoleFormatter';
import {
  WorkerExecutionRequestMessage,
  WorkerExecutionResponseMessage,
  CodeExecutionResult,
} from '../services/codeRunner/CodeRunner';

self.onmessage = async (event: MessageEvent<WorkerExecutionRequestMessage>) => {
  const { executionId, request } = event.data;
  let result: CodeExecutionResult;

  try {
    const QuickJS = await getQuickJS();
    const runtime = QuickJS.newRuntime();

    // Configure limits (Heap & Stack)
    const memoryLimit = request.memoryLimitBytes || CODE_RUNNER_DEFAULTS.MEMORY_LIMIT_BYTES;
    runtime.setMemoryLimit(memoryLimit);
    runtime.setMaxStackSize(CODE_RUNNER_DEFAULTS.MAX_STACK_SIZE_BYTES);

    const timeoutMs = request.timeoutMs || CODE_RUNNER_DEFAULTS.VM_TIMEOUT_MS;
    runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + timeoutMs));

    const context = runtime.newContext();

    const outputLogs: string[] = [];
    let truncated = false;
    let totalOutputBytes = 0;

    // Intercept console.log safely within QuickJS VM
    const logHandle = context.newFunction('log', (...argsHandles) => {
      if (outputLogs.length >= CODE_RUNNER_DEFAULTS.MAX_LOG_ENTRIES) {
        truncated = true;
        return;
      }
      const dumpedArgs = argsHandles.map((handle) => context.dump(handle));
      const formattedLine = formatLogArguments(dumpedArgs);
      totalOutputBytes += formattedLine.length;

      if (totalOutputBytes > CODE_RUNNER_DEFAULTS.MAX_TOTAL_OUTPUT_BYTES) {
        truncated = true;
        return;
      }

      outputLogs.push(formattedLine);
    });

    const consoleObj = context.newObject();
    context.setProp(consoleObj, 'log', logHandle);
    context.setProp(context.global, 'console', consoleObj);

    // Clean up temporary setup handles immediately
    logHandle.dispose();
    consoleObj.dispose();

    try {
      const evalRes = context.evalCode(request.code);
      if (evalRes.error) {
        const errorDump = context.dump(evalRes.error);
        evalRes.error.dispose();

        const errorMessage =
          typeof errorDump === 'object' && errorDump && 'message' in errorDump
            ? String((errorDump as { message: unknown }).message)
            : String(errorDump);

        const errorName =
          typeof errorDump === 'object' && errorDump && 'name' in errorDump
            ? String((errorDump as { name: unknown }).name)
            : '';

        const fullText = `${errorName} ${errorMessage}`.toLowerCase();

        if (errorName === 'SyntaxError' || fullText.includes('syntaxerror') || fullText.includes('unexpected token') || fullText.includes('parse error')) {
          result = { kind: 'syntax-error', message: `SyntaxError: ${errorMessage}` };
        } else if (fullText.includes('interrupted') || fullText.includes('timeout') || fullText.includes('deadline')) {
          result = { kind: 'timeout' };
        } else if (fullText.includes('out of memory') || fullText.includes('allocation failed') || fullText.includes('stack overflow') || fullText.includes('stack size')) {
          result = { kind: 'memory-limit' };
        } else {
          result = { kind: 'runtime-error', message: errorName ? `${errorName}: ${errorMessage}` : errorMessage };
        }
      } else {
        const valueDump = context.dump(evalRes.value);
        evalRes.value.dispose();
        result = {
          kind: 'success',
          output: outputLogs,
          returnValue: valueDump,
          truncated,
        };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const lower = errMsg.toLowerCase();
      if (lower.includes('interrupted') || lower.includes('timeout')) {
        result = { kind: 'timeout' };
      } else if (lower.includes('out of memory') || lower.includes('stack')) {
        result = { kind: 'memory-limit' };
      } else {
        result = { kind: 'runtime-error', message: errMsg };
      }
    } finally {
      context.dispose();
      runtime.dispose();
    }
  } catch (sysErr: unknown) {
    result = {
      kind: 'system-error',
      message: sysErr instanceof Error ? sysErr.message : 'Falha ao carregar o ambiente QuickJS no Worker.',
    };
  }

  const responseMsg: WorkerExecutionResponseMessage = {
    executionId,
    result,
  };
  self.postMessage(responseMsg);
};
