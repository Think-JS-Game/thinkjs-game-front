import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ShieldCheck, ArrowLeft, Mail } from 'lucide-react';

export const ParentalConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentData = location.state || {};

  const [guardianEmail, setGuardianEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianEmail) {
      setError('Digite o e-mail do seu responsável.');
      return;
    }
    if (!consentChecked) {
      setError('Marque a caixa de seleção de autorização.');
      return;
    }

    navigate('/app/parental-consent/pending', {
      state: { ...studentData, guardianEmail },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="pt-4 space-y-6">
        <Link
          to="/app/signup"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Cadastro</span>
        </Link>

        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--turquesa-light)] text-[var(--turquesa)] border border-[var(--turquesa)] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-extrabold display-lg">Autorização do Responsável (LGPD)</h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Como você indicou idade inferior a 13 anos, precisamos do consentimento de um pai ou responsável legal para ativar sua conta de forma segura.
          </p>
        </div>

        {error && <Alert kind="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="E-mail do Pai ou Responsável Legal"
            type="email"
            placeholder="responsavel@email.com"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
            required
          />

          <Checkbox
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            label={
              <span>
                Declaro que sou o responsável legal e autorizo o cadastro na plataforma ThinkJS de acordo com a{' '}
                <a href="#privacy" className="underline font-bold text-[var(--foreground)]">
                  Política de Privacidade
                </a>.
              </span>
            }
          />

          <Button variant="primary" type="submit" className="w-full text-base py-3.5 mt-2">
            <Mail className="w-5 h-5" />
            <span>Enviar Solicitação de Autorização</span>
          </Button>
        </form>
      </div>

      <div className="text-center py-6 text-xs text-[var(--muted-foreground)]">
        Conformidade com a LGPD e Proteção Digital de Menores
      </div>
    </div>
  );
};
