import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/app/providers/AuthProvider';
import { apiFetch } from '@/services/api/apiClient';
import { useTheme } from '@/hooks/useTheme';
import { 
  ArrowLeft, 
  Moon, 
  Sun,
  Zap, 
  Flame, 
  Rocket, 
  Star, 
  Code, 
  Trophy, 
  Award, 
  PartyPopper 
} from 'lucide-react';

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

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useAuth();
  const { isDark, toggle } = useTheme();

  const [avatar, setAvatar] = useState(student?.avatarId || 'zap');
  const [name, setName] = useState(student?.name || 'Ana');
  const [email, setEmail] = useState(student?.email || 'ana@exemplo.com');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify({ name, avatarId: avatar }),
      });
    } catch {
      // fallback mock behavior
    }
    navigate(-1);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto py-6 sm:py-8 px-4 sm:px-6 md:px-8 bg-[var(--cream)] min-h-full">
      
      {/* Container Principal */}
      <div className="bg-white dark:bg-[var(--sand)] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border-color)] min-h-[600px] md:min-h-[800px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-[var(--t800)] hover:text-[var(--t900)] transition-colors rounded-full hover:bg-[var(--sand)] dark:hover:bg-[var(--background)]"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          
          <h1 className="font-display font-extrabold text-[18px] md:text-[15px] text-[var(--t900)]">
            Editar perfil
          </h1>
          
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 md:hidden flex items-center justify-center text-[var(--t800)] rounded-full transition-colors border border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:bg-[var(--sand)]"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-md mx-auto">
          
          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="block text-[13px] font-extrabold text-[var(--t900)] ml-1">
              Avatar
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((av) => {
                const isSelected = avatar === av.id;
                const Icon = av.icon;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatar(av.id)}
                    className={`aspect-square sm:aspect-auto sm:h-14 rounded-2xl border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-[var(--yellow)] bg-[var(--yellow-light)] dark:bg-yellow-500/20 ring-1 ring-[var(--yellow)] shadow-sm'
                        : 'border-[var(--border-color)] bg-white dark:bg-[var(--background)] hover:border-[var(--t400)]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${av.bg} ${av.color}`}>
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-[13px] font-extrabold text-[var(--t900)] mb-2 ml-1">
              Nome
            </label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Digite seu nome"
              required 
              className="bg-white dark:bg-[var(--background)]"
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-[13px] font-extrabold text-[var(--t900)] mb-2 ml-1">
              E-mail
            </label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Digite seu e-mail"
              required 
              className="bg-white dark:bg-[var(--background)]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[var(--yellow)] hover:bg-[var(--yellow-dark)] text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-sm"
            >
              Salvar alterações
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
