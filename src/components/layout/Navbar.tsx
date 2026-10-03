import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme, useC } from "@/hooks/useTheme";

import { P } from "@/data/colors";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const c = useC();
  
  // Usando CSS vars para permitir transições fluidas já definidas no theme.css
  const navBg = isDark ? "rgba(30,29,23,0.95)" : "rgba(255,253,247,0.95)";
  
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg" style={{ background: P.yellow, color: P.t900 }}>Ir para o conteúdo principal</a>
      <nav role="navigation" aria-label="Navegação principal" className="sticky top-0 z-50 w-full border-b" style={{ backgroundColor: navBg, borderColor: c.border, backdropFilter: "blur(12px)", transition: "background-color 0.3s ease, border-color 0.3s ease" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" aria-label="ThinkJS — página inicial" className="block" style={{ width: "108px", height: "35px" }}>
            <img src="/brand/thinkjs-logo.svg" alt="" aria-hidden="true" className="w-full h-full object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[{ label: "Para alunos", href: "#personas" }, { label: "Para professores", href: "#personas" }, { label: "Para escolas", href: "#personas" }, { label: "Planos", href: "#planos" }].map(({ label, href }) => (
              <a key={label} href={href} className="body-md transition-opacity hover:opacity-60 text-[var(--color-t700)]">{label}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggle} aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] text-[var(--color-t600)] bg-[var(--color-border-color)]">
              {isDark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
            </button>
            <Link to="/app/login" className="body-md px-4 py-2 rounded-full min-h-[44px] flex items-center justify-center text-[var(--color-t700)] hover:opacity-80">
              Entrar
            </Link>
            <Link to="/app/signup" className="body-md px-5 py-2 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center bg-[var(--color-yellow)] text-[#27261F] shadow-[0_3px_0_var(--color-yellow-dark)]">
              Começar grátis
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[var(--color-t600)] bg-[var(--color-border-color)]">
              {isDark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
            </button>
            <button className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-t700)]" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"}>
              {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden px-6 pb-5 flex flex-col gap-3 border-t border-[var(--color-border-color)]">
            {[{ label: "Para alunos", href: "#personas" }, { label: "Para professores", href: "#personas" }, { label: "Para escolas", href: "#personas" }, { label: "Planos", href: "#planos" }].map(({ label, href }) => (
              <a key={label} href={href} className="body-lg py-1 min-h-[44px] flex items-center text-[var(--color-t800)]" onClick={() => setOpen(false)}>{label}</a>
            ))}
            <Link to="/app/login" onClick={() => setOpen(false)} className="body-lg px-5 py-2 rounded-full min-h-[44px] flex items-center justify-center text-[var(--color-t700)] hover:opacity-80">
              Entrar
            </Link>
            <Link to="/app/signup" onClick={() => setOpen(false)} className="body-lg px-5 py-3 rounded-full font-semibold min-h-[44px] flex items-center justify-center bg-[var(--color-yellow)] text-[#27261F]">
              Começar grátis
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
