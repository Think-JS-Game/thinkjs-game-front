import { Link } from "react-router-dom";

export function Footer() {
  
  return (
    <footer role="contentinfo" className="py-10 border-t bg-[#1E1D17] border-[#363327]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" aria-label="ThinkJS — ir para a página inicial" className="block w-[90px] h-[29px]"><img src="/brand/thinkjs-logo.svg" alt="" aria-hidden="true" className="w-full h-full object-contain" /></Link>
        <span className="text-[13px] font-medium text-[#B0A996]">© 2026 ThinkJS. Todos os direitos reservados.</span>
        <nav aria-label="Links do rodapé">
          <div className="flex items-center gap-5">
            {["Privacidade", "Termos", "Contato"].map((item) => (
              <a key={item} href="#pendente" className="text-[14px] font-medium transition-opacity hover:opacity-70 min-h-[44px] flex items-center text-[#B0A996]">{item}</a>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
