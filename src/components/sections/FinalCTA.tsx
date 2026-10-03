import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp } from "@/utils/animations";

import { DLG, BLG } from "@/components/ui/Typography";

export function FinalCTA() {
  return (
    <section aria-label="Começar com o ThinkJS" className="py-16 md:py-20 relative overflow-hidden bg-[#27261F]">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <motion.div {...fadeUp(0)} className="flex-shrink-0" aria-hidden>
            <div className="w-[192px] h-[192px]"><img src="/brand/thinkjs-mascot.svg" alt="" aria-hidden="true" className="w-full h-full object-contain" /></div>
          </motion.div>
          <motion.div {...fadeUp(0.08)} className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-[rgba(252,204,0,0.15)] border border-[rgba(252,204,0,0.3)]">
              <Zap size={13} className="text-[var(--color-yellow)]" aria-hidden />
              <span className="text-[13px] font-bold text-[var(--color-yellow)]">Piloto em andamento em Alagoas</span>
            </div>
            <DLG as="h2" className="mb-4 text-[#FFFDF7]">Pronto para começar a jornada?</DLG>
            <BLG className="mb-8 text-[#EDE8D6]">Seja aluno, professor ou escola — o ThinkJS tem um caminho para você.</BLG>
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <Link 
                to="/app/signup" 
                className="px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 min-h-[44px] bg-[var(--color-yellow)] text-[#27261F] font-sans text-[15px] shadow-[0_4px_0_var(--color-yellow-dark)] inline-flex items-center justify-center text-center"
              >
                Criar conta grátis
              </Link>
              <a href="#funcionalidades" className="px-8 py-3.5 rounded-full transition-all hover:opacity-80 min-h-[44px] border-[1.5px] border-[#C4BCAB] text-[#EDE8D6] font-sans text-[15px] font-medium inline-flex items-center justify-center text-center">
                Conhecer a plataforma
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
