import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, ShieldCheck, Check, Copy, ExternalLink, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SolanaWalletCard: React.FC = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  const address = publicKey ? publicKey.toBase58() : null;
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Wallet className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-base display-md text-[var(--foreground)]">
              Carteira Solana (Web3)
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Conecte sua carteira para receber credenciais e certificados on-chain
            </p>
          </div>
        </div>

        {connected ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Conectada (Devnet)</span>
          </span>
        ) : (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--sand)] text-[var(--muted-foreground)] border border-[var(--border)]">
            Desconectada
          </span>
        )}
      </div>

      {connected && address ? (
        <div className="p-4 rounded-2xl bg-[var(--sand)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted-foreground)]">Endereço Público:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--foreground)]">{shortAddress}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                title="Copiar endereço completo"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <a
              href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:underline"
            >
              <span>Ver no Solana Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <Button
              variant="secondary"
              onClick={() => disconnect()}
              className="!py-1 !px-3 text-xs font-bold text-rose-400 hover:text-rose-300"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Desconectar</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--sand)]/50 border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)]">
            Compatível com Phantom, Solflare, Backpack e qualquer carteira padrão Solana.
          </p>
          <Button
            variant="primary"
            onClick={() => setVisible(true)}
            className="w-full sm:w-auto !py-2 !px-5 text-xs font-bold shrink-0 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Wallet className="w-4 h-4" />
            <span>Conectar Carteira</span>
          </Button>
        </div>
      )}
    </div>
  );
};
