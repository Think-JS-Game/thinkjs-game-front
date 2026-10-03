export const CODE_RUNNER_DEFAULTS = {
  VM_TIMEOUT_MS: 1500,
  HOST_TIMEOUT_MS: 2500,
  MEMORY_LIMIT_BYTES: 16 * 1024 * 1024, // 16MB heap limit
  MAX_STACK_SIZE_BYTES: 512 * 1024,     // 512KB call stack limit
  MAX_LOG_ENTRIES: 100,                 // Maximum log lines
  MAX_LOG_ENTRY_LENGTH: 1000,           // Max length per log line
  MAX_TOTAL_OUTPUT_BYTES: 50000,        // Max total serialized output bytes
};
