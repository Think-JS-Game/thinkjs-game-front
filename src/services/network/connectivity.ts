export type ConnectivityStatus = 'online' | 'degraded' | 'offline';

export type ConnectivityListener = (status: ConnectivityStatus) => void;

class ConnectivityManager {
  private status: ConnectivityStatus = typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline';
  private listeners: Set<ConnectivityListener> = new Set();
  private checkIntervalId: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.setStatus('online');
    this.checkHealth();
  };

  private handleOffline = () => {
    this.setStatus('offline');
  };

  public getStatus(): ConnectivityStatus {
    return this.status;
  }

  public setStatus(newStatus: ConnectivityStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.notifyListeners();
    }
  }

  public subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.status));
  }

  public async checkHealth(): Promise<ConnectivityStatus> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setStatus('offline');
      return 'offline';
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      const rootUrl = baseUrl.replace(/\/api\/v1\/?$/, '');
      const healthUrl = `${rootUrl}/health`;

      const res = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.setStatus('online');
        return 'online';
      } else {
        this.setStatus('degraded');
        return 'degraded';
      }
    } catch {
      this.setStatus('degraded');
      return 'degraded';
    }
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    if (this.checkIntervalId !== null) {
      clearInterval(this.checkIntervalId);
    }
  }
}

export const connectivity = new ConnectivityManager();
