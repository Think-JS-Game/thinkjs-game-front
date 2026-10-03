import { motion } from "motion/react";
import { Sparkles, BarChart3, Building2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp } from "@/utils/animations";
import BorderGlow from "@/components/BorderGlow";
import { useTheme } from "@/hooks/useTheme";
import { DMD, BMD, CAP, DXL } from "@/components/ui/Typography";

export function PersonaSection() {
  const { isDark } = useTheme();
  
  const personas = [
    { 
      id: "aluno", icon: Sparkles, label: "Para alunos", 
      accentBg: "var(--color-yellow-light)", accentFg: "var(--color-yellow-dark)", 
      iconBg: "var(--color-yellow)", iconColor: "#27261F", 
      headline: "Programar é mais fácil do que parece.", 
      description: "Sophia tem 12 anos e quer criar jogos. No ThinkJS ela resolve missões reais de JavaScript, vê o resultado na hora e acumula conquistas — sem punição por errar.", 
      benefits: ["4 níveis: Iniciante ao Especialista", "Missões com feedback imediato", "Badges e XP a cada progresso", "Modo claro/escuro e responsivo"], 
      cta: "Quero aprender a programar", ctaBg: "var(--color-yellow)", ctaFg: "#27261F", 
      ctaShadow: "0 4px 0 var(--color-yellow-dark)", glowColor: "48 100 50", 
      glowColors: ["var(--color-yellow)", "var(--color-yellow-mid)", "var(--color-yellow-light)"] 
    },
    { 
      id: "professor", icon: BarChart3, label: "Para professores", 
      accentBg: "var(--color-tq-light)", accentFg: "var(--color-tq-dark)", 
      iconBg: "var(--color-tq)", iconColor: "#FFFFFF", 
      headline: "Saiba quem precisa de atenção.", 
      description: "Você não precisa ser especialista em código. O painel responde uma pergunta simples: quem está travado e em qual competência? Dados acionáveis, não um dashboard denso.", 
      benefits: ["Tabela de progresso por turma", "Alertas de progresso e necessidade de apoio", "Status simples e acionável", "Exportação de relatório"], 
      cta: "Acessar painel do professor", ctaBg: "var(--color-tq)", ctaFg: "#FFFFFF", 
      ctaShadow: "0 4px 0 var(--color-tq-dark)", glowColor: "178 77 31", 
      glowColors: ["var(--color-tq)", "var(--color-tq-mid)", "var(--color-tq-light)"] 
    },
    { 
      id: "escola", icon: Building2, label: "Para escolas", 
      accentBg: "var(--color-roxo-light)", accentFg: "var(--color-roxo-dark)", 
      iconBg: "var(--color-roxo)", iconColor: "#FFFFFF", 
      headline: "Computação na grade, alinhada à BNCC.", 
      description: "Ferramentas validadas pedagogicamente com dados que sustentam decisões. O piloto está em andamento em Alagoas — venha fazer parte da primeira turma.", 
      benefits: ["Alinhamento com BNCC Computação", "Código de escola para vincular turmas", "Relatórios pedagógicos documentados", "Modelo freemium para escolas públicas"], 
      cta: "Quero ser escola parceira", ctaBg: "var(--color-roxo)", ctaFg: "#FFFFFF", 
      ctaShadow: "0 4px 0 var(--color-roxo-dark)", glowColor: "263 87 66", 
      glowColors: ["var(--color-roxo)", "var(--color-roxo-light)", "var(--color-roxo-dark)"] 
    },
  ];

  return (
    <section id="personas" aria-label="Públicos atendidos" className="py-16 md:py-20 bg-[var(--color-cream)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp(0)} className="text-center mb-8">
          <CAP className="mb-2 text-[var(--color-tq-dark)] tracking-[0.06em]">FEITO PARA QUEM FAZ A DIFERENÇA</CAP>
          <DXL as="h2" className="text-[var(--color-t900)]">Para você, seja quem for.</DXL>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {personas.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.id} id={p.id} {...fadeUp(i * 0.08)}>
                <BorderGlow 
                  backgroundColor={p.accentBg} 
                  glowColor={p.glowColor} 
                  colors={p.glowColors} 
                  borderRadius={16} 
                  glowRadius={32} 
                  glowIntensity={isDark ? 1.1 : 0.9} 
                  fillOpacity={isDark ? 0.4 : 0.35} 
                  className="h-full"
                >
                  <div className="p-6 md:p-7 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.iconBg }}>
                        <Icon size={18} style={{ color: p.iconColor }} aria-hidden />
                      </div>
                      <BMD style={{ color: p.accentFg }}>{p.label}</BMD>
                    </div>
                    <DMD as="h3" className="mb-2 text-[var(--color-t900)]">{p.headline}</DMD>
                    <BMD className="mb-4 text-[var(--color-t700)] flex-1">{p.description}</BMD>
                    <ul className="flex flex-col gap-2 mb-6" aria-label={`Benefícios — ${p.label}`}>
                      {p.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check size={13} className="mt-1 shrink-0" style={{ color: p.accentFg }} aria-hidden />
                          <BMD className="text-[var(--color-t800)]">{b}</BMD>
                        </li>
                      ))}
                    </ul>
                    {p.id === "aluno" ? (
                      <Link 
                        to="/app/signup" 
                        className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 min-h-[44px] font-sans text-[15px] flex items-center justify-center text-center" 
                        style={{ background: p.ctaBg, color: p.ctaFg, boxShadow: p.ctaShadow }}
                      >
                        {p.cta}
                      </Link>
                    ) : (
                      <button className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 min-h-[44px] font-sans text-[15px]" style={{ background: p.ctaBg, color: p.ctaFg, boxShadow: p.ctaShadow }}>
                        {p.cta}
                      </button>
                    )}
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
