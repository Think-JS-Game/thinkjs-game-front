const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }
  const origin =
    typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'http://localhost:8000';
  const prefix = envUrl || '/api/v1';
  return `${origin}${prefix.startsWith('/') ? '' : '/'}${prefix}`;
};

let accessToken: string | null = null;
let singleFlightRefreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
  requestId?: string;
}

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
  skipAuthRefresh?: boolean;
  maxRetries?: number;
}

// Single-flight refresh token mutex/promise
async function performSingleFlightRefresh(baseUrl: string): Promise<string | null> {
  if (singleFlightRefreshPromise) {
    return singleFlightRefreshPromise;
  }

  singleFlightRefreshPromise = (async () => {
    try {
      const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newToken = data.access_token || null;
        setAccessToken(newToken);
        return newToken;
      } else {
        setAccessToken(null);
        return null;
      }
    } catch {
      setAccessToken(null);
      return null;
    } finally {
      singleFlightRefreshPromise = null;
    }
  })();

  return singleFlightRefreshPromise;
}

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const timeoutMs = options.timeoutMs ?? 10000;
  const isAuthRoute = endpoint.includes('/auth/login') || endpoint.includes('/auth/refresh') || endpoint.includes('/auth/logout');
  const skipAuthRefresh = options.skipAuthRefresh ?? isAuthRoute;
  const method = (options.method || 'GET').toUpperCase();
  const maxRetries = options.maxRetries ?? (method === 'GET' ? 2 : 0);

  let attempt = 0;
  let lastError: ApiError | null = null;

  while (attempt <= maxRetries) {
    attempt++;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestId = generateRequestId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
      signal: controller.signal,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
      clearTimeout(timeoutId);
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';
      lastError = {
        code: isTimeout ? 'NETWORK_TIMEOUT' : 'NETWORK_ERROR',
        message: isTimeout ? 'Tempo limite da requisição excedido.' : err.message || 'Erro de conexão.',
        requestId,
      };

      if (attempt <= maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 250 + Math.random() * 100;
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }
      throw lastError;
    }

    // Single-Flight Auth Refresh para 401
    if (response.status === 401 && !skipAuthRefresh) {
      const refreshedToken = await performSingleFlightRefresh(baseUrl);
      if (refreshedToken) {
        // Tenta novamente com o novo token recebido pelo refresh
        headers['Authorization'] = `Bearer ${refreshedToken}`;
        const retryRes = await fetch(url, { ...config, headers });
        if (retryRes.ok) {
          if (retryRes.status === 204) return {} as T;
          return retryRes.json();
        }
        response = retryRes;
      }
    }

    // Respeita Retry-After no HTTP 429
    if (response.status === 429 && attempt <= maxRetries) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const waitSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 2;
      await new Promise((r) => setTimeout(r, (waitSeconds || 2) * 1000));
      continue;
    }

    if (!response.ok) {
      let errorData: { error?: ApiError } = {};
      try {
        errorData = await response.json();
      } catch {
        // ignore
      }
      const err: ApiError = errorData.error || {
        code: response.status === 403 ? 'FORBIDDEN' : 'HTTP_ERROR',
        message: `Erro na requisição: ${response.statusText || response.status}`,
        status: response.status,
        requestId: response.headers.get('X-Request-ID') || requestId,
      };
      err.status = response.status;
      err.requestId = response.headers.get('X-Request-ID') || requestId;

      // Retry em 502/503/504 apenas se for requisição GET
      if (method === 'GET' && [502, 503, 504].includes(response.status) && attempt <= maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 300 + Math.random() * 100;
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }

      throw err;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  throw lastError || { code: 'HTTP_ERROR', message: 'Falha ao executar requisição.' };
}
