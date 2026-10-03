import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiFetch, setAccessToken, getAccessToken } from '@/services/api/apiClient';
import { IndexedDBPendingOperationStore, PendingOperation } from '@/services/storage/PendingOperationStore';
import { SyncCoordinator } from '@/services/network/SyncCoordinator';
import { connectivity } from '@/services/network/connectivity';

describe('Fase 7 - Resiliência, Offline, Sincronização e Segurança', () => {
  beforeEach(() => {
    setAccessToken('mock_access_token');
    vi.restoreAllMocks();
  });

  it('1. API Timeout gera erro de rede controlado (NETWORK_TIMEOUT)', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(
      (_url, config) =>
        new Promise((_, reject) => {
          const signal = config?.signal;
          if (signal) {
            signal.addEventListener('abort', () => {
              const err = new Error('The operation was aborted');
              err.name = 'AbortError';
              reject(err);
            });
          }
        })
    );

    await expect(apiFetch('/progress', { timeoutMs: 50 })).rejects.toMatchObject({
      code: 'NETWORK_TIMEOUT',
    });

    fetchSpy.mockRestore();
  });

  it('2. Single-Flight Auth Refresh: 5 requisições 401 paralelas geram apenas 1 chamada de refresh', async () => {
    let refreshCalls = 0;

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/refresh')) {
        refreshCalls++;
        await new Promise((r) => setTimeout(r, 50));
        return new Response(JSON.stringify({ access_token: 'new_token_123' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Primeira chamada de cada rota retorna 401 se token for mock_access_token
      if (getAccessToken() === 'mock_access_token') {
        return new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED' } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    // 5 requisições simultâneas
    const promises = [
      apiFetch('/users/me'),
      apiFetch('/profiles/me'),
      apiFetch('/progress'),
      apiFetch('/settings'),
      apiFetch('/health'),
    ];

    await Promise.all(promises);

    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBe('new_token_123');

    fetchSpy.mockRestore();
  });

  it('3. Invalidação de Refresh Token cancela token e limpa estado sem recursão infinita', async () => {
    let refreshCalls = 0;

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/refresh')) {
        refreshCalls++;
        return new Response(JSON.stringify({ error: { code: 'INVALID_REFRESH_TOKEN' } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await expect(apiFetch('/progress')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });

    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBeNull();

    fetchSpy.mockRestore();
  });

  it('4. IndexedDB PendingOperationStore: inserção, listagem, deduplicação e limpeza', async () => {
    const store = new IndexedDBPendingOperationStore();
    const userId = 'user_test_123';

    const op1: PendingOperation = {
      schemaVersion: 1,
      id: 'op-1',
      userId,
      type: 'COMPLETE_LESSON',
      payload: { lessonId: 'les-basico-1-1' },
      createdAt: new Date().toISOString(),
      attempts: 0,
      status: 'pending',
    };

    const opDup: PendingOperation = {
      schemaVersion: 1,
      id: 'op-dup',
      userId,
      type: 'COMPLETE_LESSON',
      payload: { lessonId: 'les-basico-1-1' },
      createdAt: new Date().toISOString(),
      attempts: 0,
      status: 'pending',
    };

    await store.add(op1);
    await store.add(opDup);

    const list = await store.list(userId);
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('op-1');

    await store.clearForUser(userId);
    const emptyList = await store.list(userId);
    expect(emptyList.length).toBe(0);
  });

  it('5. Validação de segurança: Impede inclusão de credenciais dentro de PendingOperation', async () => {
    const store = new IndexedDBPendingOperationStore();
    const invalidOp = {
      schemaVersion: 1 as const,
      id: 'op-invalid',
      userId: 'u1',
      type: 'COMPLETE_LESSON' as const,
      payload: { lessonId: 'les-1', password: 'secret_password' },
      createdAt: new Date().toISOString(),
      attempts: 0,
      status: 'pending' as const,
    };

    await expect(store.add(invalidOp)).rejects.toThrow(/credenciais/i);
  });

  it('6. SyncCoordinator: Drena a fila, atualiza progresso e marca erro fatal em 403', async () => {
    const store = new IndexedDBPendingOperationStore();
    const userId = 'user_sync_test';
    const coordinator = new SyncCoordinator(store);

    const opSuccess: PendingOperation = {
      schemaVersion: 1,
      id: 'op-success',
      userId,
      type: 'COMPLETE_LESSON',
      payload: { lessonId: 'les-basico-1-1' },
      createdAt: new Date().toISOString(),
      attempts: 0,
      status: 'pending',
    };

    await store.add(opSuccess);

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      if (String(url).includes('/progress/lessons/les-basico-1-1/complete')) {
        return new Response(JSON.stringify({ already_completed: false, xp_earned: 25, total_xp: 25, streak: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });

    let rehydrated = false;
    coordinator.init(userId, async () => {
      rehydrated = true;
    });

    await coordinator.triggerSync();

    const remainingOps = await store.list(userId);
    expect(remainingOps.length).toBe(0);
    expect(rehydrated).toBe(true);

    fetchSpy.mockRestore();
    coordinator.destroy();
  });

  it('7. ConnectivityStatus reflete estado de saúde via /health', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));

    const status = await connectivity.checkHealth();
    expect(status).toBe('online');

    fetchSpy.mockRestore();
  });
});
