import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { connectivity, ConnectivityStatus } from '@/services/network/connectivity';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';

export const OfflineToast: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<ConnectivityStatus>(connectivity.getStatus());
  const { syncState } = useStudentProgress();

  useEffect(() => {
    return connectivity.subscribe((status) => {
      setNetworkStatus(status);
    });
  }, []);

  const isOffline = networkStatus === 'offline' || networkStatus === 'degraded';
  const hasPending = syncState.pendingCount > 0;
  const isSyncing = syncState.syncing;
  const hasFailed = syncState.failedCount > 0;

  if (!isOffline && !hasPending && !isSyncing && !hasFailed) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 p-4 rounded-2xl bg-[var(--t900)] text-[var(--yellow)] border border-[var(--yellow-dark)] shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4"
    >
      {isSyncing ? (
        <RefreshCw className="w-5 h-5 flex-shrink-0 animate-spin text-amber-400" />
      ) : hasFailed ? (
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
      ) : (
        <WifiOff className="w-5 h-5 flex-shrink-0" />
      )}

      <div className="text-xs font-bold leading-relaxed">
        {isSyncing ? (
          <span>Sincronizando seu progresso...</span>
        ) : hasFailed ? (
          <span>Não foi possível sincronizar o progresso. Nova tentativa em breve.</span>
        ) : isOffline ? (
          <span>Você está sem conexão. Seu progresso será salvo neste dispositivo.</span>
        ) : hasPending ? (
          <span>Seu progresso está aguardando sincronização ({syncState.pendingCount}).</span>
        ) : null}
      </div>
    </div>
  );
};
