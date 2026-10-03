export interface PendingOperationPayload {
  lessonId: string;
  [key: string]: unknown;
}

export interface PendingOperation {
  schemaVersion: 1;
  id: string;
  userId: string;
  type: 'COMPLETE_LESSON';
  payload: PendingOperationPayload;
  createdAt: string;
  attempts: number;
  status: 'pending' | 'syncing' | 'failed';
  lastErrorCode?: string;
  leaseExpiresAt?: number;
}

export interface PendingOperationStore {
  list(userId: string): Promise<PendingOperation[]>;
  add(operation: PendingOperation): Promise<void>;
  update(operation: PendingOperation): Promise<void>;
  remove(id: string): Promise<void>;
  clearForUser(userId: string): Promise<void>;
}

const DB_NAME = 'thinkjs_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'pending_operations';

export class IndexedDBPendingOperationStore implements PendingOperationStore {
  private memoryFallback: Map<string, PendingOperation> = new Map();
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB não suportado neste ambiente.');
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by_userId', 'userId', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  public async list(userId: string): Promise<PendingOperation[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('by_userId');
        const request = index.getAll(userId);

        request.onsuccess = () => {
          const ops: PendingOperation[] = request.result || [];
          const now = Date.now();
          const recovered = ops.map((op) => {
            // Recupera operações presas em syncing se o lease tiver expirado
            if (op.status === 'syncing' && op.leaseExpiresAt && op.leaseExpiresAt < now) {
              return { ...op, status: 'pending' as const, leaseExpiresAt: undefined };
            }
            return op;
          });
          resolve(recovered);
        };
        request.onerror = () => reject(request.error);
      });
    } catch {
      // Fallback em memória
      const ops = Array.from(this.memoryFallback.values()).filter((op) => op.userId === userId);
      const now = Date.now();
      return ops.map((op) => {
        if (op.status === 'syncing' && op.leaseExpiresAt && op.leaseExpiresAt < now) {
          return { ...op, status: 'pending' as const, leaseExpiresAt: undefined };
        }
        return op;
      });
    }
  }

  public async add(operation: PendingOperation): Promise<void> {
    // Validação estrita: Não permitir credenciais ou tokens no payload
    const payloadStr = JSON.stringify(operation.payload);
    if (
      payloadStr.includes('access_token') ||
      payloadStr.includes('refresh_token') ||
      payloadStr.includes('password')
    ) {
      throw new Error('Operações pendentes não podem armazenar credenciais ou tokens.');
    }

    this.memoryFallback.set(operation.id, operation);
    try {
      const existing = await this.list(operation.userId);
      // Evita duplicatas pendentes para o mesmo userId + tipo + lessonId
      const isDuplicate = existing.some(
        (op) =>
          op.id !== operation.id &&
          op.type === operation.type &&
          op.payload.lessonId === operation.payload.lessonId &&
          op.status !== 'failed'
      );
      if (isDuplicate) {
        this.memoryFallback.delete(operation.id);
        return;
      }

      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(operation);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch {
      // Memory fallback já foi atualizado
    }
  }

  public async update(operation: PendingOperation): Promise<void> {
    this.memoryFallback.set(operation.id, operation);
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(operation);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch {
      // Memory fallback já foi atualizado
    }
  }

  public async remove(id: string): Promise<void> {
    this.memoryFallback.delete(id);
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch {
      // Memory fallback já foi atualizado
    }
  }

  public async clearForUser(userId: string): Promise<void> {
    for (const [id, op] of Array.from(this.memoryFallback.entries())) {
      if (op.userId === userId) {
        this.memoryFallback.delete(id);
      }
    }
    try {
      const ops = await this.list(userId);
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        let completed = 0;
        if (ops.length === 0) {
          resolve();
          return;
        }
        for (const op of ops) {
          const req = store.delete(op.id);
          req.onsuccess = () => {
            completed++;
            if (completed === ops.length) resolve();
          };
          req.onerror = () => reject(req.error);
        }
      });
    } catch {
      // Memory fallback já foi atualizado
    }
  }
}

export const defaultPendingOperationStore = new IndexedDBPendingOperationStore();
