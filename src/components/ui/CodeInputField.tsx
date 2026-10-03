import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type CodeInputFieldState = 'default' | 'success' | 'error';

interface CodeInputFieldProps {
  initialCode?: string;
  expectedOutput?: string[];
  onExecute?: (code: string, state: CodeInputFieldState) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

export const CodeInputField: React.FC<CodeInputFieldProps> = ({
  initialCode = 'console.log("Hello, World!");',
  expectedOutput = ['Hello, World!'],
  onExecute,
  disabled = false,
  readOnly = false,
  className = '',
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [outputState, setOutputState] = useState<CodeInputFieldState>('default');
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRun = () => {
    if (disabled || readOnly) return;
    const trimmed = code.trim();
    if (trimmed.includes('console.log') && expectedOutput.some((exp) => trimmed.includes(exp))) {
      setOutputState('success');
      setOutputLogs(expectedOutput);
      setErrorMessage(null);
      onExecute?.(code, 'success');
    } else {
      setOutputState('error');
      setOutputLogs(['Executando código...']);
      setErrorMessage(null);
      onExecute?.(code, 'error');
    }
  };

  return (
    <div className={`w-full rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-[#1E1D17] text-[#FFFDF7] font-mono shadow-md ${className}`}>
      {/* Editor Header */}
      <div className="bg-[#27261F] px-4 py-2.5 flex items-center justify-between border-b border-[#363327]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-sans font-bold text-[#B0A996] ml-2">index.js</span>
        </div>

        <Button
          variant="primary"
          onClick={handleRun}
          disabled={disabled || readOnly}
          className="!py-1.5 !px-4 !min-h-[36px] text-xs font-bold font-sans"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {disabled ? 'Executando...' : 'Executar'}
        </Button>
      </div>

      {/* Code Textarea */}
      <div className="p-4 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          readOnly={readOnly}
          rows={5}
          spellCheck={false}
          className="w-full bg-transparent text-sm font-mono text-[#F7F4EA] resize-y focus:outline-none leading-relaxed tracking-wide"
          placeholder="// Digite seu código JavaScript aqui..."
        />
      </div>

      {/* Result Output Bar */}
      {outputState !== 'default' && (
        <div
          className={`p-4 border-t-2 font-sans transition-all ${
            outputState === 'success'
              ? 'bg-[#0D2019] border-[#2FB380] text-[#DFF6EA]'
              : 'bg-[#2D1411] border-[#E8483A] text-[#FBE1DD]'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-2">
            {outputState === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#3FCB92]" />
                <span>Execução com Sucesso!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-[#F16657]" />
                <span>Resultado Incorreto</span>
              </>
            )}
          </div>

          <div className="bg-[#1E1D17] p-3 rounded-xl font-mono text-xs text-[#FFFDF7] space-y-1">
            <div className="text-[#8C8571] text-[10px] font-sans font-bold uppercase tracking-wider">
              Console Output:
            </div>
            {outputLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                &gt; {log}
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="mt-2 text-xs font-medium text-[#FBE1DD]">{errorMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};
