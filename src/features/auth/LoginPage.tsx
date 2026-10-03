import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { PasswordField } from '@/components/ui/PasswordField';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/app/trail');
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="pt-4 space-y-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold display-lg">Entrar no ThinkJS</h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            Digite suas credenciais para acessar sua trilha.
          </p>
        </div>

        {error && <Alert kind="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="E-mail"
            type="email"
            placeholder="aluno@escola.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordField
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end pt-1">
            <Link
              to="/app/forgot-password"
              className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          <Button variant="primary" type="submit" isLoading={isLoading} className="w-full text-base py-3.5 mt-2">
            <LogIn className="w-5 h-5" />
            <span>Entrar</span>
          </Button>
        </form>
      </div>

      <div className="text-center py-6 border-t border-[var(--border)]">
        <span className="text-xs text-[var(--muted-foreground)]">Ainda não tem conta? </span>
        <Link to="/app/signup" className="text-xs font-extrabold text-[var(--foreground)] underline">
          Cadastre-se aqui
        </Link>
      </div>
    </div>
  );
};
