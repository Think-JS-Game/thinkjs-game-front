import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Conteúdo exibido quando um erro é capturado. Padrão: tela de erro amigável. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Captura erros de renderização/efeitos dos filhos para evitar que um único
 * componente quebrado desmonte a aplicação inteira (tela branca).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Ops! Algo deu errado.</h1>
        <p>Tente recarregar a página.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Recarregar
        </button>
      </div>
    );
  }
}
