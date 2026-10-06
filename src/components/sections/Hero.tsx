import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, ChevronRight, Star, Shield, Zap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { D, P } from "@/data/colors";

import { fadeUp } from "@/utils/animations";
import { DXL, BLG, CAP } from "@/components/ui/Typography";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const PixelBlast = lazy(() => import("@/components/PixelBlast"));

export function Hero() {
  const { isDark } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Adia o carregamento do chunk pesado para depois do First Paint
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section aria-label="Apresentação da plataforma" className="pt-10 pb-10 md:pt-12 md:pb-12 relative overflow-hidden bg-[var(--color-cream)] transition-colors duration-300">
      <div className="absolute inset-0 z-0" style={{ opacity: isDark ? 0.5 : 0.45 }}>
        <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          {isMounted && (
            <PixelBlast 
              color={isDark ? D.yellow : P.yDark} 
              variant="circle" 
              pixelSize={6} 
              patternDensity={0.65} 
              patternScale={2.8} 
              speed={0.2} 
              edgeFade={0} 
              enableRipples={true} 
              rippleSpeed={0.22} 
              rippleIntensityScale={1} 
              transparent 
            />
          )}
        </Suspense>
        </ErrorBoundary>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-[var(--color-yellow-light)] border border-[var(--color-yellow-mid)]">
                <Sparkles size={14} className="text-[var(--color-yellow-dark)]" aria-hidden />
                <CAP className="text-[var(--color-yellow-dark)]">Programação para jovens</CAP>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.08)}>
              <h1>
                <DXL className="mb-2 leading-tight text-[var(--color-t900)]">Aprenda programação</DXL>
                <DXL className="mb-6 leading-tight text-[var(--color-t900)]">
                  codando de{" "}<span className="inline-block px-3 rounded-lg bg-[var(--color-yellow)] text-[#27261F]">verdade.</span>
                </DXL>
              </h1>
              <BLG className="max-w-xl mb-10 text-[var(--color-t700)]">
                ThinkJS é uma plataforma gamificada de JavaScript para jovens de 12 a 17 anos. Missões de código reais, progressão adaptativa e painel para escolas e professores.
              </BLG>
            </motion.div>
            <motion.div {...fadeUp(0.16)} className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link to="/app/signup" className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 bg-[var(--color-yellow)] text-[#27261F] font-sans text-[15px] shadow-[0_4px_0_var(--color-yellow-dark)]">
                Sou aluno e quero aprender
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <a href="#personas" className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:opacity-80 bg-[var(--color-t900)] text-[var(--color-cream)] font-sans text-[15px]">
                Sou professor ou escola
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
            </motion.div>
            <motion.div {...fadeUp(0.28)} className="mt-12 flex flex-wrap items-center lg:justify-start gap-x-8 gap-y-4 max-w-2xl">
              {[{ icon: Star, label: "Alinhado à BNCC Computação" }, { icon: Shield, label: "Sem punição, estude pelo tempo que quiser" }, { icon: Zap, label: "Acesso à explicação e materiais de apoio" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={16} className="text-[var(--color-yellow-dark)]" aria-hidden />
                  <span className="text-[13px] font-medium text-[var(--color-t900)]">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.12)} className="flex-shrink-0 order-first lg:order-last" aria-label="Mascote do ThinkJS" role="img">
            <div className="w-[260px] h-[260px]"><img src="/brand/thinkjs-mascot.svg" alt="" aria-hidden="true" className="w-full h-full object-contain" /></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
