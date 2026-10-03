import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { PasswordField } from '@/components/ui/PasswordField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft, UserPlus } from 'lucide-react';


import { useAuth } from '@/app/providers/AuthProvider';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState<number>(2012);
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 25 }, (_, i) => {
    const year = currentYear - i - 5;
    return { value: year, label: `${year}` };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const age = currentYear - birthYear;

    // LGPD Check: Age < 13 redirects to Parental Consent
    if (age < 13) {
      navigate('/app/parental-consent', { state: { name, email, birthYear } });
    } else {
      try {
        await signup(name, email, password, birthYear);
        navigate('/app/onboarding');
      } catch (err: any) {
        setError(err.message || 'Erro ao realizar cadastro.');
      }
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
          <h1 className="text-3xl font-extrabold display-lg">Criar Sua Conta</h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            Comece a aprender programação no seu próprio ritmo.
          </p>
        </div>

        {error && <Alert kind="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Select
            label="Ano de Nascimento"
            options={birthYearOptions}
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
          />

          <PasswordField
            label="Senha"
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Código da Escola (Opcional)"
            placeholder="Ex: SCH-1234"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
            helperText="Se você faz parte de um projeto escolar, digite o código fornecido pelo professor."
          />

          <Button variant="primary" type="submit" className="w-full text-base py-3.5 mt-2">
            <UserPlus className="w-5 h-5" />
            <span>Criar Minha Conta</span>
          </Button>
        </form>
      </div>

      <div className="text-center py-6 border-t border-[var(--border)]">
        <span className="text-xs text-[var(--muted-foreground)]">Já tem uma conta? </span>
        <Link to="/app/login" className="text-xs font-extrabold text-[var(--foreground)] underline">
          Entrar agora
        </Link>
      </div>
    </div>
  );
};
