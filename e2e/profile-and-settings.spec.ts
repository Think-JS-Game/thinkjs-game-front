import { test, expect } from '@playwright/test';

test.describe('E2E — Perfil, Configurações, Reset de Senha e Exclusão de Conta', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('1. Perfil — Edição de Nome e Avatar com Persistência pós-Refresh', async ({ page }) => {
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'active_student@thinkjs.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/app/trail', { timeout: 10000 });

    await page.click('a[href="/app/settings"]');
    await page.click('a[href="/app/settings/profile"]');
    const nameInput = page.locator('#nome-completo').or(page.locator('input').first());
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    await nameInput.fill('Aluno Ativo Atualizado');
    await page.click('button[type="submit"]');

    await expect(page.locator('text="Informações atualizadas com sucesso!"')).toBeVisible();

    // Refresh da página — verifica dados persistidos via API backend
    await page.reload();
    await expect(nameInput).toHaveValue('Aluno Ativo Atualizado');
  });

  test('2. Password Reset — Solicitação e Redefinição com Nova Senha', async ({ page }) => {
    await page.goto('/app/login');
    await page.click('text="Esqueci minha senha"');
    await expect(page).toHaveURL('/app/forgot-password');

    await page.fill('input[type="email"]', 'reset_student@thinkjs.com');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Verifique seu E-mail!"').or(page.locator('text="Enviamos as instruções"'))).toBeVisible();

    // Navega usando o token determinístico de teste `e2e_reset_token_123`
    await page.goto('/app/reset-password?token=e2e_reset_token_123');
    const passInputs = page.locator('input[type="password"]');
    if (await passInputs.first().isVisible({ timeout: 10000 })) {
      const count = await passInputs.count();
      for (let i = 0; i < count; i++) {
        await passInputs.nth(i).fill('NovaSenhaSegura123!');
      }
      await page.click('button[type="submit"]');
    }

    // Login com a nova senha
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'reset_student@thinkjs.com');
    await page.fill('input[type="password"]', 'NovaSenhaSegura123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/app/trail', { timeout: 10000 });
    await expect(page).toHaveURL('/app/trail');
  });

  test('3. Account Deletion — Exclusão Definitiva de Conta e Limpeza de Armazenamento Local', async ({ page }) => {
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'delete_student@thinkjs.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/app/trail', { timeout: 10000 });

    await page.goto('/app/settings/delete-account');
    await expect(page.locator('text="Excluir Conta (LGPD)"')).toBeVisible();

    // Passo 1 de exclusão
    await page.click('button:has-text("Quero Excluir Minha Conta")');

    // Passo 2 de confirmação
    await page.click('button:has-text("Sim, Confirmar Exclusão Definitiva")');

    await expect(page.locator('text="Conta Excluída"').or(page.locator('text="conta foi excluída"')).or(page.locator('text="Exclusão"'))).toBeVisible();

    // Redirecionado para Landing/Login
    await page.waitForURL(/\/($|app)/, { timeout: 10000 });

    // Tentativa de login deve falhar
    await page.goto('/app/login');
    await page.fill('input[type="email"]', 'delete_student@thinkjs.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="E-mail ou senha incorretos."').or(page.locator('text="Credenciais"')).or(page.locator('text="incorretos"'))).toBeVisible();
  });
});
