import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasswordField } from '@/components/ui/PasswordField';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ArrowLeft, Save } from 'lucide-react';

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('A nova senha e a confirmação não conferem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSavedSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/app/settings')}
          className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sand)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold display-lg">Alterar Senha</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Crie uma nova senha de acesso para sua conta.
          </p>
        </div>
      </div>

      {savedSuccess && <Alert kind="success">Senha alterada com sucesso!</Alert>}
      {error && <Alert kind="error">{error}</Alert>}

      <form onSubmit={handleSave} className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] space-y-4 shadow-xs">
        <PasswordField
          label="Senha Atual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <PasswordField
          label="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <PasswordField
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button variant="primary" type="submit" className="w-full text-base py-3.5">
            <Save className="w-5 h-5" />
            <span>Atualizar Senha</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
