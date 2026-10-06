import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { PasswordField } from '@/components/ui/PasswordField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft, Moon, Sun, Zap, Flame, Rocket, Star, Code, Trophy, Award, PartyPopper } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';

const AVATARS = [
  { id: 'zap', icon: Zap, bg: 'bg-[var(--yellow)]', color: 'text-[var(--t900)]' },
  { id: 'flame', icon: Flame, bg: 'bg-[var(--coral)]', color: 'text-white' },
  { id: 'rocket', icon: Rocket, bg: 'bg-[var(--tq-mid)]', color: 'text-white' },
  { id: 'star', icon: Star, bg: 'bg-[var(--menta-mid)]', color: 'text-white' },
  { id: 'code', icon: Code, bg: 'bg-[var(--t800)]', color: 'text-[var(--yellow)]' },
  { id: 'trophy', icon: Trophy, bg: 'bg-[var(--accent)]', color: 'text-[var(--yellow-dark)]' },
  { id: 'award', icon: Award, bg: 'bg-[var(--coral-light)]', color: 'text-[var(--coral)]' },
  { id: 'party', icon: PartyPopper, bg: 'bg-[var(--tq-light)]', color: 'text-[var(--tq-dark)]' },
];

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { isDark, toggle } = useTheme();

  const [avatar, setAvatar] = useState('zap');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState<number>(2012);
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    const age = currentYear - birthYear;

    // LGPD Check: Age < 13 redirects to Parental Consent
    if (age < 13) {
      setIsLoading(false);
      navigate('/app/parental-consent', { state: { name, email, birthYear, avatar } });
    } else {
      try {
        await signup(name, email, password, birthYear);
        navigate('/app/onboarding');
      } catch (err: any) {
        setError(err.message || 'Erro ao realizar cadastro.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      {/* Card Principal (Modal) */}
      <div className="bg-white dark:bg-[var(--sand)] max-w-[480px] w-full max-h-[95vh] h-auto min-h-[700px] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border-color)] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Link
            to="/app"
            className="w-10 h-10 flex items-center justify-start text-[var(--t800)] hover:opacity-70 transition-opacity"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-xl font-bold text-[var(--t900)] tracking-wide">Criar conta</h1>

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
        <div className="flex justify-center mb-4">
          <img src="/brand/thinkjs-logo.svg" alt="ThinkJS" className="h-11 drop-shadow-sm" />
        </div>

        {error && <Alert kind="error" className="mb-2 py-2">{error}</Alert>}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col justify-center">
          
          {/* Seção Avatar */}
          <div className="flex flex-col gap-1 w-full items-center">
            <span className="text-[13px] font-extrabold text-[var(--t800)] self-start">Avatar</span>
            <div className="grid grid-cols-4 gap-2 w-full max-w-[320px] mx-auto">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatar(a.id)}
                  className={`w-[60px] h-[60px] mx-auto rounded-[1rem] flex items-center justify-center border transition-all ${
                    avatar === a.id
                      ? 'border-[var(--yellow)] bg-white dark:bg-[var(--sand)] shadow-[0_2px_10px_rgba(252,204,0,0.2)]'
                      : 'border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:border-[var(--t400)]'
                  }`}
                  aria-label={`Selecionar avatar ${a.id}`}
                >
                  <div className={`w-[65%] h-[65%] rounded-full flex items-center justify-center ${a.bg} ${a.color}`}>
                    <a.icon className="w-1/2 h-1/2 stroke-[2.5]" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Seu nome"
            placeholder="Ana"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Select
            label="Ano de nascimento"
            options={birthYearOptions}
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
          />

          <PasswordField
            label="Senha"
            placeholder="........"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Código da escola (opcional)"
            placeholder="Ex: ESCOLA01"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
          />

          <div className="pt-2 mt-auto">
            <Button variant="primary" type="submit" isLoading={isLoading} className="w-full text-base font-extrabold py-3.5 rounded-xl shadow-sm text-black">
              Criar conta
            </Button>
            <p className="text-[11px] text-center text-[var(--t500)] mt-2">
              Menores de 13 anos precisam da autorização de um responsável.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
