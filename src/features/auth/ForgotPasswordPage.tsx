import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="pt-4 space-y-6">
        <Link
          to="/app/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Login</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold display-lg">Recuperar Senha</h1>
          <p className="text-sm text-[var(--muted-foreground)] body-md">
            Enviaremos um link de redefinição de senha para seu e-mail cadastrado.
          </p>
        </div>

        {isSent ? (
          <div className="p-6 bg-[var(--menta-light)]/40 border-2 border-[var(--menta)] rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--menta)] font-bold text-lg">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              <span>Verifique seu E-mail!</span>
            </div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              Enviamos as instruções para <strong>{email}</strong>. Siga as orientações para criar uma nova senha.
            </p>
            <Link to="/app/login" className="block pt-2">
              <Button variant="secondary" className="w-full">
                Voltar para Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <Input
              label="Seu E-mail Cadastrado"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button variant="primary" type="submit" className="w-full text-base py-3.5 mt-2">
              <Mail className="w-5 h-5" />
              <span>Enviar Link de Recuperação</span>
            </Button>
          </form>
        )}
      </div>

      <div className="text-center py-6 text-xs text-[var(--muted-foreground)]">
        ThinkJS &bull; Segurança e Privacidade
      </div>
    </div>
  );
};
