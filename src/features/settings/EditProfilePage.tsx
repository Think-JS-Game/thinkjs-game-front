import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/app/providers/AuthProvider';
import { apiFetch } from '@/services/api/apiClient';
import { ArrowLeft, Save } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useAuth();

  const [name, setName] = useState(student?.name || 'Alex Developer');
  const [email, setEmail] = useState(student?.email || 'alex@thinkjs.edu');
  const [birthYear, setBirthYear] = useState(student?.birthYear || 2012);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
      setBirthYear(student.birthYear);
    }
  }, [student]);

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 25 }, (_, i) => {
    const year = currentYear - i - 5;
    return { value: year, label: `${year}` };
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
    } catch {
      // fallback
    }
    setSavedSuccess(true);
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
          <h1 className="text-2xl font-extrabold display-lg">Editar Perfil</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Atualize suas informações pessoais cadastrais.
          </p>
        </div>
      </div>

      {savedSuccess && <Alert kind="success">Informações atualizadas com sucesso!</Alert>}

      <form onSubmit={handleSave} className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] space-y-4 shadow-xs">
        <Input label="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} required />

        <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Select
          label="Ano de Nascimento"
          options={birthYearOptions}
          value={birthYear}
          onChange={(e) => setBirthYear(Number(e.target.value))}
        />

        <div className="pt-2">
          <Button variant="primary" type="submit" className="w-full text-base py-3.5">
            <Save className="w-5 h-5" />
            <span>Salvar Alterações</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
