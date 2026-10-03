import { PendingOperationStore, PendingOperation, defaultPendingOperationStore } from '@/services/storage/PendingOperationStore';
import { connectivity } from '@/services/network/connectivity';
import { apiFetch, ApiError } from '@/services/api/apiClient';

export type SyncListener = (status: { syncing: boolean; pendingCount: number; failedCount: number }) => void;

export class SyncCoordinator {
  private store: PendingOperationStore;
  private currentUserId: string | null = null;
  private isSyncing = false;
  private listeners: Set<SyncListener> = new Set();
  private onProgressRehydrate?: () => Promise<void>;
  private unsubscribeConnectivity?: () => void;

  constructor(store: PendingOperationStore = defaultPendingOperationStore) {
    this.store = store;
  }

  public init(userId: string, onProgressRehydrate?: () => Promise<void>) {
    this.currentUserId = userId;
    this.onProgressRehydrate = onProgressRehydrate;

    this.unsubscribeConnectivity = connectivity.subscribe((status) => {
      if (status === 'online' && this.currentUserId) {
        this.triggerSync();
      }
    });
  }

  public setUserId(userId: string | null) {
    this.currentUserId = userId;
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    this.notifyListeners();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private async notifyListeners() {
    if (!this.currentUserId) {
      this.listeners.forEach((l) => l({ syncing: false, pendingCount: 0, failedCount: 0 }));
      return;
    }
    const ops = await this.store.list(this.currentUserId);
    const pendingCount = ops.filter((o) => o.status === 'pending' || o.status === 'syncing').length;
    const failedCount = ops.filter((o) => o.status === 'failed').length;
    this.listeners.forEach((l) => l({ syncing: this.isSyncing, pendingCount, failedCount }));
  }

  private currentSyncPromise: Promise<void> | null = null;

  public async triggerSync(): Promise<void> {
    if (!this.currentUserId) {
      return;
    }
    if (this.currentSyncPromise) {
      return this.currentSyncPromise;
    }

    const isTestEnv = (globalThis as any).process?.env?.NODE_ENV === 'test';
    if (typeof navigator !== 'undefined' && navigator.locks && typeof navigator.locks.request === 'function' && !isTestEnv) {
      const lockName = `thinkjs_sync_lock_${this.currentUserId}`;
      try {
        this.currentSyncPromise = navigator.locks.request(lockName, { ifAvailable: true }, async (lock) => {
          if (!lock) return;
          await this.executeSync();
        });
        await this.currentSyncPromise;
      } catch {
        this.currentSyncPromise = this.executeSync();
        await this.currentSyncPromise;
      } finally {
        this.currentSyncPromise = null;
      }
    } else {
      this.currentSyncPromise = this.executeSync();
      try {
        await this.currentSyncPromise;
      } finally {
        this.currentSyncPromise = null;
      }
    }
  }

  private async executeSync(): Promise<void> {
    if (!this.currentUserId) return;

    this.isSyncing = true;
    await this.notifyListeners();

    try {
      const ops = await this.store.list(this.currentUserId);
      const pendingOps = ops.filter((o) => o.status === 'pending');

      for (const op of pendingOps) {
        const updatedOp: PendingOperation = {
          ...op,
          status: 'syncing',
          leaseExpiresAt: Date.now() + 15000,
        };
        await this.store.update(updatedOp);

        let success = false;
        let isFatal = false;
        let errorCode = '';

        try {
          if (op.type === 'COMPLETE_LESSON') {
            await apiFetch(`/progress/lessons/${op.payload.lessonId}/complete`, {
              method: 'POST',
            });
            success = true;
          }
        } catch (err) {
          const apiErr = err as ApiError;
          errorCode = apiErr.code || 'UNKNOWN_ERROR';

          if (apiErr.code === 'FORBIDDEN' || apiErr.code === 'LESSON_NOT_FOUND' || (apiErr as any).status === 403 || (apiErr as any).status === 404) {
            isFatal = true;
          }
        }

        if (success) {
          await this.store.remove(op.id);
          if (this.onProgressRehydrate) {
            await this.onProgressRehydrate();
          }
        } else if (isFatal) {
          await this.store.update({
            ...op,
            status: 'failed',
            lastErrorCode: errorCode,
            leaseExpiresAt: undefined,
          });
        } else {
          await this.store.update({
            ...op,
            status: 'pending',
            attempts: op.attempts + 1,
            lastErrorCode: errorCode,
            leaseExpiresAt: undefined,
          });
        }
      }
    } finally {
      this.isSyncing = false;
      await this.notifyListeners();
    }
  }

  public destroy() {
    if (this.unsubscribeConnectivity) {
      this.unsubscribeConnectivity();
    }
  }
}

export const syncCoordinator = new SyncCoordinator();
