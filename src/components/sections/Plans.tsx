import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import BorderGlow from "@/components/BorderGlow";
import { fadeUp } from "@/utils/animations";
import { useTheme } from "@/hooks/useTheme";
import { DLG, DMD, BMD, CAP } from "@/components/ui/Typography";

export function Plans() {
  const { isDark } = useTheme();
  
  const plans = [
    { name: "Gratuito", badge: null, price: "R$ 0", period: "", desc: "Para alunos que querem começar por conta própria, fora do contexto escolar.", features: ["Acesso a módulos iniciais", "Editor de código integrado", "Conquistas e XP", "Streak de estudo", "Perfil e configurações básicas"], cta: "Criar conta grátis", highlight: false },
    { name: "Escola", badge: "Mais popular", price: "R$ 10", period: "/ aluno / mês", desc: "Para escolas e projetos sociais que querem adotar o ThinkJS em sala de aula.", features: ["Tudo do plano Gratuito", "Trilha completa (todos os módulos)", "Painel do professor", "Código de escola para vincular turmas", "Exportação de relatórios pedagógicos", "Suporte prioritário", "Alinhamento BNCC documentado"], cta: "Falar com a equipe", highlight: true },
    { name: "Piloto Alagoas", badge: "Parceria especial", price: "Grátis", period: "durante o piloto", desc: "Escolas públicas de Alagoas participam do piloto com acesso completo sem custo.", features: ["Acesso completo durante o piloto", "Suporte pedagógico presencial", "Dados anonimizados para validação", "Certificado de participação", "Prioridade em novas funcionalidades"], cta: "Quero participar do piloto", highlight: false },
  ];

  return (
    <section id="planos" aria-label="Planos e preços" className="py-16 md:py-20 bg-[var(--color-cream)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp(0)} className="text-center mb-8">
          <BMD className="mb-2 text-[var(--color-tq-dark)] tracking-[0.06em]">Planos</BMD>
          <DLG as="h2" className="mb-3 text-[var(--color-t900)]">Comece de graça, cresça com a escola.</DLG>
          <BMD className="max-w-xl mx-auto text-[var(--color-t600)]">Alunos podem começar sozinhos. Escolas têm planos pensados para o contexto pedagógico — com suporte e dados que provam resultado.</BMD>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => {
            const isHighlight = plan.highlight;
            
            // Background do card
            const cardBg = isHighlight ? (isDark ? "var(--color-t700)" : "var(--color-t900)") : "var(--color-white-bg)";
            
            // Textos principais
            // No modo dark, o card vira light (t700 = #EDE8D6). EntÃ£o usamos as variÃ¡veis de background do dark (cream/sand) que sÃ£o escuras, como cor de texto!
            const headColor = isHighlight ? "var(--color-cream)" : "var(--color-t900)";
            const priceColor = isHighlight ? (isDark ? "var(--color-yellow-shad)" : "var(--color-yellow)") : "var(--color-t900)";
            const periodColor = isHighlight ? (isDark ? "var(--color-border-color)" : "var(--color-t400)") : "var(--color-t500)";
            const descColor = isHighlight ? (isDark ? "var(--color-border-color)" : "var(--color-t400)") : "var(--color-t600)";
            const itemColor = isHighlight ? (isDark ? "var(--color-sand)" : "var(--color-t300)") : "var(--color-t700)";
            
            // Ãcones e checks
            const checkBg = isHighlight ? "var(--color-yellow)" : "var(--color-menta-light)";
            const checkColor = isHighlight ? (isDark ? "var(--color-cream)" : "var(--color-t900)") : "var(--color-menta)";
            
            // Badge superior
            const badgeBg = isHighlight ? "var(--color-yellow)" : "var(--color-tq)";
            const badgeText = isHighlight ? (isDark ? "var(--color-cream)" : "var(--color-t900)") : "#FFFFFF";
            
            const glowColor = isHighlight ? "48 100 50" : i === 2 ? "178 77 31" : "157 78 29";
            const glowColors = isHighlight ? ["var(--color-yellow)", "var(--color-yellow-mid)", "var(--color-yellow-light)"] : i === 2 ? ["var(--color-tq)", "var(--color-tq-mid)", "var(--color-tq-light)"] : ["var(--color-menta)", "var(--color-menta-mid)", "var(--color-menta-light)"];
            
            return (
              <motion.div key={plan.name} {...fadeUp(i * 0.08)} className="relative">
                {plan.badge && (
                  <div className="absolute -top-3 left-6 md:left-7 z-10 px-3 py-1 rounded-full font-bold" style={{ background: badgeBg, color: badgeText }}>
                    <CAP style={{ color: "inherit" }}>{plan.badge}</CAP>
                  </div>
                )}
                <BorderGlow backgroundColor={cardBg} glowColor={glowColor} colors={glowColors} borderRadius={16} glowRadius={32} glowIntensity={isHighlight ? 1.2 : isDark ? 1.0 : 0.85} fillOpacity={isHighlight ? 0.45 : isDark ? 0.35 : 0.3} animated={isHighlight} className="h-full">
                  <div className="p-6 md:p-7 flex flex-col h-full">
                    <DMD as="h3" className="mb-1" style={{ color: headColor }}>{plan.name}</DMD>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="font-bold text-3xl font-sans" style={{ color: priceColor, fontFamily: "'Baloo 2', sans-serif" }}>{plan.price}</span>
                      {plan.period && <CAP style={{ color: periodColor }}>{plan.period}</CAP>}
                    </div>
                    <BMD className="mb-5" style={{ color: descColor }}>{plan.desc}</BMD>
                    <ul className="flex flex-col gap-2 mb-6 flex-1" aria-label={`Funcionalidades — ${plan.name}`}>
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <div className="mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: checkBg }}>
                            <Check size={10} style={{ color: checkColor }} aria-hidden />
                          </div>
                          <BMD style={{ color: itemColor }}>{f}</BMD>
                        </li>
                      ))}
                    </ul>
                    {plan.cta === "Criar conta grátis" ? (
                      <Link 
                        to="/app/signup" 
                        className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 min-h-[44px] font-sans text-[15px] flex items-center justify-center text-center" 
                        style={{ background: plan.highlight ? "var(--color-yellow)" : "var(--color-t900)", color: plan.highlight ? "#27261F" : "var(--color-cream)", boxShadow: plan.highlight ? "0 4px 0 var(--color-yellow-dark)" : "none" }}
                      >
                        {plan.cta}
                      </Link>
                    ) : (
                      <button className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 min-h-[44px] font-sans text-[15px]" style={{ background: plan.highlight ? "var(--color-yellow)" : "var(--color-t900)", color: plan.highlight ? "#27261F" : "var(--color-cream)", boxShadow: plan.highlight ? "0 4px 0 var(--color-yellow-dark)" : "none" }}>
                        {plan.cta}
                      </button>
                    )}
                  </div>
                </BorderGlow>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center mt-6 body-md text-[var(--color-t500)]">
          Precisa de um plano personalizado para rede de ensino?{" "}
          <a href="#pendente" className="underline underline-offset-2 text-[var(--color-tq-dark)]">Fale com a gente.</a>
        </p>
      </div>
    </section>
  );
}
