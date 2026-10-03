import { motion } from "motion/react";
import { Code2, Brain, Trophy, Flame, Target, GraduationCap, Users } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";
import { fadeUp } from "@/utils/animations";
import { useTheme } from "@/hooks/useTheme";
import { DLG, DMD, BMD, CAP } from "@/components/ui/Typography";

export function Features() {
  const { isDark } = useTheme();
  
  const features = [
    { icon: Code2, title: "Editor de código real", desc: "Escreva JavaScript de verdade com syntax highlighting e feedback instantâneo.", color: "var(--color-tq)", bg: "var(--color-tq-light)", glowColor: "178 77 31", glowColors: ["var(--color-tq)", "var(--color-tq-mid)", "var(--color-tq-light)"] },
    { icon: Brain, title: "Progressão adaptativa", desc: "O nível se adapta ao perfil do aluno — cada erro orienta a próxima missão de forma explicável.", color: "var(--color-roxo)", bg: "var(--color-roxo-light)", glowColor: "263 87 66", glowColors: ["var(--color-roxo)", "var(--color-roxo-light)", "var(--color-roxo-dark)"] },
    { icon: Trophy, title: "Conquistas & XP", desc: "Badges e pontos a cada missão. Sem moeda virtual, sem loja, sem pressão de consumo.", color: "var(--color-yellow-dark)", bg: "var(--color-yellow-light)", glowColor: "48 100 35", glowColors: ["var(--color-yellow)", "var(--color-yellow-mid)", "var(--color-yellow-light)"] },
    { icon: Flame, title: "Streaks de estudo", desc: "Histórico de dias consecutivos que motiva a consistência sem punição por pausas.", color: "var(--color-coral)", bg: "var(--color-coral-light)", glowColor: "4 78 56", glowColors: ["var(--color-coral)", "var(--color-coral-mid)", "var(--color-coral-light)"] },
    { icon: Target, title: "3 tentativas livres", desc: "Na 3ª tentativa incorreta, o ThinkJS mostra a resolução comentada e segue em frente.", color: "var(--color-menta)", bg: "var(--color-menta-light)", glowColor: "157 78 29", glowColors: ["var(--color-menta)", "var(--color-menta-mid)", "var(--color-menta-light)"] },
    { icon: GraduationCap, title: "Painel do professor", desc: "Radar de intervenção: quem está travado e em qual competência — visível em segundos.", color: "var(--color-tq-dark)", bg: "var(--color-tq-light)", glowColor: "179 78 26", glowColors: ["var(--color-tq-dark)", "var(--color-tq)", "var(--color-tq-light)"] },
    { icon: Users, title: "Consentimento LGPD", desc: "Para menores de 13 anos, o cadastro inclui consentimento verificável do responsável.", color: "var(--color-menta)", bg: "var(--color-menta-light)", glowColor: "157 78 29", glowColors: ["var(--color-menta)", "var(--color-menta-mid)", "var(--color-menta-light)"] },
  ];

  return (
    <section id="funcionalidades" aria-label="Funcionalidades principais" className="py-16 md:py-20 bg-[var(--color-sand)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <CAP className="mb-3 text-[var(--color-tq-dark)] tracking-[0.06em]">FUNCIONALIDADES PRINCIPAIS</CAP>
          <DLG as="h2" className="mb-4 text-[var(--color-t900)]">Tudo que um jovem programador precisa.</DLG>
          <BMD className="max-w-xl mx-auto text-[var(--color-t600)]">Do primeiro "olá, mundo" ao projeto real no portfólio.</BMD>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div 
                key={f.title} 
                {...fadeUp(i * 0.04)}
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
              >
                <BorderGlow backgroundColor="var(--color-white-bg)" glowColor={f.glowColor} colors={f.glowColors} borderRadius={16} glowRadius={28} glowIntensity={isDark ? 1.0 : 0.85} fillOpacity={isDark ? 0.35 : 0.3} className="h-full">
                  <div className="p-5 h-full flex flex-col">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0" style={{ background: f.bg }}>
                      <Icon size={18} style={{ color: f.color }} aria-hidden />
                    </div>
                    <DMD as="h3" className="mb-2 text-[var(--color-t900)] text-[16px]">{f.title}</DMD>
                    <BMD className="text-[var(--color-t600)] flex-1">{f.desc}</BMD>
                  </div>
                </BorderGlow>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
