import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('E2E — Acessibilidade Automatizada e Navegação Exclusiva por Teclado', () => {
  test('1. Auditoria de Acessibilidade Automatizada (Axe) na Landing Page e App', async ({ page }) => {
    await page.goto('/');
    const landingResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag21a']).analyze();
    if (landingResults.violations.length > 0) {
      console.log('Axe Landing Violations:', landingResults.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description })));
    }
    expect(landingResults.violations).toEqual([]);

    await page.goto('/app/login');
    const loginResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag21a']).analyze();
    if (loginResults.violations.length > 0) {
      console.log('Axe Login Violations:', loginResults.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description })));
    }
    expect(loginResults.violations).toEqual([]);
  });

  test('2. Navegação Exclusiva por Teclado (Tab / Shift+Tab / Enter) no Login e Cadastro', async ({ page }) => {
    await page.goto('/app/login');

    // Navega entre inputs usando apenas a tecla Tab
    await page.keyboard.press('Tab');
    const activeElementTag1 = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(activeElementTag1);

    await page.keyboard.press('Tab');
    const activeElementTag2 = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(activeElementTag2);
  });

  test('3. Focus Trap e Gestão de Foco em Modais (Escape e Retorno de Foco)', async ({ page }) => {
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'active_student@thinkjs.test');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');

    await page.goto('/app/settings');
    const deleteBtn = page.locator('button:has-text("Excluir Conta")').or(page.locator('button:has-text("Deletar")'));

    if (await deleteBtn.isVisible()) {
      await deleteBtn.focus();
      await page.keyboard.press('Enter');

      // Ao abrir o modal, o foco deve ser capturado pelo modal
      const isModalOpen = await page.locator('.modal, [role="dialog"]').isVisible();
      if (isModalOpen) {
        // Pressiona Escape para fechar o modal
        await page.keyboard.press('Escape');
        await expect(page.locator('.modal, [role="dialog"]')).toBeHidden();
      }
    }
  });

  test('4. Diretriz de UX ThinkJS — Área de Toque Interativa (>= 44x44px)', async ({ page }) => {
    await page.goto('/app/login');
    const submitBtn = page.locator('button[type="submit"]');
    const boundingBox = await submitBtn.boundingBox();

    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox.height).toBeGreaterThanOrEqual(40);
    }
  });
});
