import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { PasswordField } from '@/components/ui/PasswordField';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();

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
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      {/* Card Principal (Modal) */}
      <div className="bg-white dark:bg-[var(--sand)] max-w-[480px] w-full min-h-[800px] rounded-[2rem] p-8 shadow-sm border border-[var(--border-color)] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/app"
            className="w-10 h-10 flex items-center justify-start text-[var(--t800)] hover:opacity-70 transition-opacity"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-xl font-bold text-[var(--t900)] tracking-wide">Entrar</h1>

          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/brand/thinkjs-logo.svg" alt="ThinkJS" className="h-11 drop-shadow-sm" />
        </div>

        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <Input
            label="E-mail"
            type="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordField
            label="Senha"
            placeholder="........"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="pt-1">
            <Link
              to="/app/forgot-password"
              className="text-[13px] font-extrabold text-[var(--tq)] hover:text-[var(--tq-dark)] transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>

          <div className="pt-12 mt-auto">
            <Button variant="primary" type="submit" isLoading={isLoading} className="w-full text-base font-extrabold py-4 rounded-xl shadow-sm text-black">
              Entrar
            </Button>
          </div>

          <div className="text-center pt-4 pb-2">
            <span className="text-[13px] text-[var(--t500)]">Ainda não tem conta? </span>
            <Link to="/app/signup" className="text-[13px] font-extrabold text-[var(--tq)] hover:text-[var(--tq-dark)] transition-colors">
              Cadastre-se aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
