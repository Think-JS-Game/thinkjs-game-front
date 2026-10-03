import { motion } from "motion/react";
import { Check } from "lucide-react";
import { fadeUp } from "@/utils/animations";
import { DLG, BMD, CAP } from "@/components/ui/Typography";

export function WhatIsThinkJS() {
  return (
    <section id="o-que-e" aria-label="O que é o ThinkJS" className="py-16 md:py-20 bg-[var(--color-sand)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp(0)}>
            <CAP className="mb-3 text-[var(--color-tq-dark)] tracking-[0.06em]">COMO FUNCIONA</CAP>
            <DLG as="h2" className="mb-5 text-[var(--color-t900)]">Cada tentativa vira evidência de aprendizado.</DLG>
            <BMD className="mb-4 text-[var(--color-t700)]">
              Não é só gamificação + programação. O ThinkJS transforma cada pergunta em evidência que orienta a próxima missão do aluno e a intervenção do professor, com adaptação na aprendizagem.
            </BMD>
            <BMD className="text-[var(--color-t700)]">
              O sistema registra <strong>por que</strong> sugeriu um reforço. Assim o professor sabe exatamente quem precisa de atenção e em qual competência, sem horas de análise de exercícios individuais.
            </BMD>
            <div className="mt-8 flex flex-col gap-3">
              {["JavaScript do zero ao apoio de um projeto real", "Progressão por missões, não por cronograma rígido", "Feedback imediato, não-punitivo e explicado"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[var(--color-menta-light)]">
                    <Check size={11} className="text-[var(--color-menta)]" aria-hidden />
                  </div>
                  <BMD className="text-[var(--color-t800)]">{item}</BMD>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-[#4A4638] bg-[#27261F]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#363327]">
                <div className="w-3 h-3 rounded-full bg-[var(--color-coral-mid)]" />
                <div className="w-3 h-3 rounded-full bg-[#FDD52E]" />
                <div className="w-3 h-3 rounded-full bg-[var(--color-menta-mid)]" />
                <span className="ml-3 text-sm font-semibold tracking-wide text-[#8C8571]">missão-03.js</span>
              </div>
              <div className="p-5 code text-[#D9D3BF] leading-[1.7]">
                <div><span className="text-[#FDD52E]">function</span><span className="text-[#1CB3AF]"> calcularMedia</span><span>(notas) {"{"}</span></div>
                <div className="pl-6"><span className="text-[#FDD52E]">const</span><span> soma = notas.</span><span className="text-[#1CB3AF]">reduce</span><span>((a, b) ={">"} a + b, 0);</span></div>
                <div className="pl-6"><span className="text-[#FDD52E]">return</span><span> soma / notas.</span><span className="text-[#1CB3AF]">length</span><span>;</span></div>
                <div>{"}"}</div>
              </div>
              <div className="px-5 py-3 flex items-center gap-2 bg-[#DFF6EA] border-t border-[#3FCB92]">
                <Check size={14} className="text-[#0F8656]" aria-hidden />
                <span className="text-sm font-bold text-[#0F8656]">+120 XP — Missão concluída!</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 px-3 py-2 rounded-xl shadow-lg bg-[var(--color-yellow)] text-[#27261F]">
              <span className="text-sm font-bold tracking-wide">🔥 Streak 7 dias</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
