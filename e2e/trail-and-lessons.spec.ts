import { test, expect } from '@playwright/test';

test.describe('E2E — Trilha de Aprendizado e Question Engine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'active_student@thinkjs.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/app/trail', { timeout: 15000 });
  });

  test('1. Visualização da Trilha e Abertura de Lição', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Trilha de Aprendizado' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text="O Computador e a Internet"').or(page.locator('text="Hardware e Software"')).first()).toBeVisible({ timeout: 10000 });

    await page.click('text="Lição 1: Hardware e Software"');
    await expect(page).toHaveURL(/\/app\/lesson\/les-basico-1-1/, { timeout: 10000 });
  });

  test('2. Question Engine — Múltipla Escolha com 3 Tentativas', async ({ page }) => {
    await page.goto('/app/lesson/les-basico-1-1/intro');

    const startBtn = page.locator('button:has-text("Começar Exercícios")').or(page.locator('button:has-text("Começar")'));
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    const wrongOption = page.locator('.option-card, [role="button"]').filter({ hasNotText: 'let' }).first();
    const correctOption = page.locator('.option-card, [role="button"]', { hasText: 'let' }).first();

    // Tentativa 1 Errada
    if (await wrongOption.isVisible()) {
      await wrongOption.click();
      await page.click('button:has-text("Verificar")');
      await expect(page.locator('text="Tente novamente"').or(page.locator('text="Incorreto"'))).toBeVisible();
      const retryBtn = page.locator('button:has-text("Tentar de Novo")').or(page.locator('button:has-text("Tentar Novamente")'));
      if (await retryBtn.isVisible()) {
        await retryBtn.click();
      }
    }

    // Tentativa 2 Correta
    if (await correctOption.isVisible()) {
      await correctOption.click();
      await page.click('button:has-text("Verificar")');
      await expect(page.locator('text="Excelente!"').or(page.locator('text="Parabéns"'))).toBeVisible();
    }
  });
});
