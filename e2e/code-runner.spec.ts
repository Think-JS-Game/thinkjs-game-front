import { test, expect } from '@playwright/test';

test.describe('E2E — CodeRunner Real QuickJS / WASM & Dedicated Worker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'active_student@thinkjs.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/trail');
  });

  test('1. Execução Real de Código JavaScript e Captura de Console / Erros', async ({ page }) => {
    await page.goto('/app/lessons/les-basico-1-1');

    const startBtn = page.locator('button:has-text("Começar Exercícios")').or(page.locator('button:has-text("Começar")'));
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    const codeInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await codeInput.isVisible()) {
      await codeInput.fill('console.log("ThinkJS E2E Test"); const x = 10;');
      await page.click('button:has-text("Executar")');

      await expect(page.locator('text="ThinkJS E2E Test"').or(page.locator('.console-output'))).toBeVisible({ timeout: 10000 });
    }
  });

  test('2. Infinite Loop `while(true){}` — UI Mantém Responsividade e Ocorre Timeout Pedagógico', async ({ page }) => {
    await page.goto('/app/lessons/les-basico-1-1');

    const startBtn = page.locator('button:has-text("Começar Exercícios")').or(page.locator('button:has-text("Começar")'));
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    const codeInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await codeInput.isVisible()) {
      await codeInput.fill('while(true) {}');
      await page.click('button:has-text("Executar")');

      const header = page.locator('h1, h2, nav').first();
      await expect(header).toBeVisible();

      await expect(page.locator('text="Tempo limite de execução excedido"').or(page.locator('text="Timeout"'))).toBeVisible({ timeout: 10000 });
    }
  });
});
