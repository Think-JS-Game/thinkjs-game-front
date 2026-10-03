import { test, expect } from '@playwright/test';

test.describe('E2E — Autenticação e Consentimento Parental', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });
  test('1. Landing -> Signup (>=13 anos) -> Onboarding -> Trail -> Refresh Persistence', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Navega para Signup
    const signupBtn = page.locator('a[href="/app/signup"]').first();
    if (await signupBtn.isVisible()) {
      await signupBtn.click();
    } else {
      await page.goto('/app/signup');
    }
    await expect(page).toHaveURL('/app/signup');

    const uniqueEmail = `student_${Date.now()}_${Math.floor(Math.random() * 1000)}@thinkjs.com`;

    await page.fill('input[placeholder="Seu nome"]', 'Aluno Novo E2E');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.selectOption('select', '2005'); // >= 13 anos
    await page.fill('input[type="password"]', 'SenhaFortissima123!');
    await page.click('button[type="submit"]');

    // Redireciona após signup
    await page.waitForURL(/\/app\/(onboarding|level-choice|level|trail)/, { timeout: 10000 });

    // Navega para a trilha
    await page.goto('/app/trail');
    await expect(page.locator('h1', { hasText: 'Trilha de Aprendizado' })).toBeVisible({ timeout: 10000 });

    // Refresh da página — deve permanecer autenticado
    await page.reload();
    await expect(page).toHaveURL('/app/trail');
  });

  test('2. Cadastro de Menor de 13 Anos (<13) bloqueado até consentimento parental', async ({ page }) => {
    await page.goto('/app/signup');

    const minorEmail = `minor_${Date.now()}@thinkjs.com`;
    await page.fill('input[placeholder="Seu nome"]', 'Aluno Menor E2E');
    await page.fill('input[type="email"]', minorEmail);
    await page.selectOption('select', '2017'); // < 13 anos
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');

    // Tela de consentimento parental obrigatório
    await page.waitForURL(/\/app\/parental-consent/);
    await expect(page.locator('h1', { hasText: 'Autorização do Responsável' })).toBeVisible();

    // Tentativa de acessar rota protegida /app/trail deve ser bloqueada/redirecionada
    await page.goto('/app/trail');
    await expect(page).not.toHaveURL('/app/trail');
  });

  test('3. Login com Conta Existente -> Logout', async ({ page }) => {
    await page.goto('/app/login');

    await page.fill('input[type="email"]', 'active_student@thinkjs.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');

    await page.waitForURL('/app/trail', { timeout: 10000 });
    await expect(page).toHaveURL('/app/trail');

    // Logout via Settings
    await page.goto('/app/settings');
    await page.click('text="Sair da Conta"');

    // Redirecionado para login e rota protegida bloqueada
    await page.waitForURL('/app/login', { timeout: 10000 });
    await expect(page).toHaveURL('/app/login');

    await page.goto('/app/trail');
    await expect(page).toHaveURL('/app/login');
  });
});
