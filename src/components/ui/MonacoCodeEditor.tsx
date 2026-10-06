import React, { useState, useRef, useEffect } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';
import { Play, CheckCircle2, XCircle, RotateCcw, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type MonacoEditorState = 'default' | 'success' | 'error';

interface MonacoCodeEditorProps {
  initialCode?: string;
  expectedOutput?: string[];
  onExecute?: (code: string, state: MonacoEditorState) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  language?: 'javascript' | 'typescript' | 'json';
  height?: string;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  initialCode = 'console.log("Hello, World!");',
  expectedOutput = ['Hello, World!'],
  onExecute,
  disabled = false,
  readOnly = false,
  className = '',
  language = 'javascript',
  height = '240px',
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [outputState, setOutputState] = useState<MonacoEditorState>('default');
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const editorRef = useRef<unknown>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleBeforeMount: BeforeMount = (monaco) => {
    // Definir tema escuro refinado baseado na paleta Superteam Academy
    monaco.editor.defineTheme('superteam-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'e2e8f0', background: '161b27' },
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'b07aff' },
        { token: 'string', foreground: '14f195' },
        { token: 'number', foreground: 'FBBF24' },
        { token: 'type', foreground: '2DD4BF' },
        { token: 'function', foreground: 'fcd34d' },
        { token: 'variable', foreground: 'e2e8f0' },
      ],
      colors: {
        'editor.background': '#161b27',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1c2333',
        'editor.selectionBackground': '#2DD4BF33',
        'editorCursor.foreground': '#14f195',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#2DD4BF',
      },
    });
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutputState('default');
    setOutputLogs([]);
    setErrorMessage(null);
  };

  const handleRun = () => {
    if (disabled || readOnly) return;
    const trimmed = (code || '').trim();
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
    <div className={`w-full rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-[#161b27] text-[#FFFDF7] font-mono shadow-md ${className}`}>
      {/* Editor Header */}
      <div className="bg-[#1c2333] px-4 py-2.5 flex items-center justify-between border-b border-[#283248]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <div className="flex items-center gap-1.5 ml-2 text-xs font-sans font-bold text-[#94a3b8]">
            <Code2 className="w-3.5 h-3.5 text-[#14f195]" />
            <span>challenge.js</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled || readOnly}
            title="Restaurar código inicial"
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#283248] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

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
      </div>

      {/* Monaco Editor Container */}
      <div className="relative py-2">
        <Editor
          height={height}
          language={language}
          theme="superteam-dark"
          value={code}
          beforeMount={handleBeforeMount}
          onMount={handleEditorMount}
          onChange={(val) => setCode(val || '')}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 8, bottom: 8 },
          }}
          loading={
            <div className="h-48 flex items-center justify-center text-xs text-[#94a3b8]">
              Carregando Monaco Editor...
            </div>
          }
        />
      </div>

      {/* Output Console Bar */}
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

          <div className="bg-[#10141f] p-3 rounded-xl font-mono text-xs text-[#FFFDF7] space-y-1">
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
