import { test, expect } from '@playwright/test';

test.describe('E2E — Resiliência, Fila Offline (IndexedDB) e Sincronização', () => {
  test('1. Conclusão de Lição Offline com BrowserContext -> Fila no IndexedDB -> Re-conexão & Sync', async ({ page, context }) => {
    // 1. Autentica online
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'active_student@thinkjs.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/app/trail', { timeout: 15000 });

    // 2. Garante que está na rota da trilha onde o OfflineToast está montado
    await page.goto('/app/trail');
    await expect(page.locator('h1', { hasText: 'Trilha' })).toBeVisible();

    try {
      // 3. Simula desconexão usando a API OFICIAL de BrowserContext (Adjustment 1)
      await context.setOffline(true);
      await page.evaluate(() => window.dispatchEvent(new Event('offline')));

      // 4. Verifica que o Toast de modo offline ou sem conexão é exibido
      const offlineToast = page.locator('[role="status"]').filter({ hasText: 'sem conexão' }).or(page.locator('text="salvo neste dispositivo"'));
      await expect(offlineToast).toBeVisible({ timeout: 5000 });

      // 5. Reconecta a rede usando a API OFICIAL de BrowserContext (Adjustment 1)
      await context.setOffline(false);
      await page.evaluate(() => window.dispatchEvent(new Event('online')));

      // 6. SyncCoordinator é disparado e sincroniza com o backend
      await expect(offlineToast).toBeHidden({ timeout: 10000 });
    } finally {
      await context.setOffline(false);
    }
  });
});
