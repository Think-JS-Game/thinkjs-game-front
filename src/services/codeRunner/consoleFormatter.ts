import { CODE_RUNNER_DEFAULTS } from './CodeRunnerDefaults';

export function safeSerializeValue(val: unknown, seen = new WeakSet()): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'bigint') return `${val}n`;
  if (typeof val === 'symbol') return val.toString();
  if (typeof val === 'function') return `[Function${val.name ? `: ${val.name}` : ''}]`;

  if (typeof val === 'object') {
    if (seen.has(val)) {
      return '[Circular]';
    }
    seen.add(val);

    try {
      if (Array.isArray(val)) {
        const items = val.map((item) => safeSerializeValue(item, seen));
        return `[ ${items.join(', ')} ]`;
      }
      const entries = Object.entries(val).map(
        ([k, v]) => `${k}: ${safeSerializeValue(v, seen)}`
      );
      return `{ ${entries.join(', ')} }`;
    } catch {
      return '[Object]';
    }
  }

  return String(val);
}

export function formatLogArguments(args: unknown[]): string {
  const formatted = args.map((arg) => safeSerializeValue(arg)).join(' ');
  if (formatted.length > CODE_RUNNER_DEFAULTS.MAX_LOG_ENTRY_LENGTH) {
    return formatted.slice(0, CODE_RUNNER_DEFAULTS.MAX_LOG_ENTRY_LENGTH) + '... [truncado]';
  }
  return formatted;
}
