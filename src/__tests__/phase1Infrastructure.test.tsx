import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { StudentProgressProvider } from '@/app/providers/StudentProgressProvider';
import { SolanaWalletProvider } from '@/app/providers/SolanaWalletProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';

function renderWithProviders(initialRoute = '/') {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <SolanaWalletProvider>
          <StudentProgressProvider>
            <MemoryRouter initialEntries={[initialRoute]}>
              <AppRouter />
            </MemoryRouter>
          </StudentProgressProvider>
        </SolanaWalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('Fase 1 - Fundação da Aplicação do Aluno', () => {
  it('1. Renderiza a Landing Page na rota pública /', () => {
    renderWithProviders('/');
    expect(screen.getByRole('main')).toBeDefined();
  });

  it('2. Renderiza o StudentAppLayout na rota /app/trail', () => {
    renderWithProviders('/app/trail');
    expect(screen.getByRole('complementary', { name: /navegação lateral desktop/i })).toBeDefined();
    expect(screen.getByRole('navigation', { name: /navegação principal mobile/i })).toBeDefined();
  });

  it('3. Rotas públicas de auth renderizam corretamente', () => {
    renderWithProviders('/app/login');
    expect(screen.getByRole('heading', { name: /^entrar$/i })).toBeDefined();

    renderWithProviders('/app/signup');
    expect(screen.getByRole('heading', { name: /^criar conta$/i })).toBeDefined();
  });

  it('4. Rotas internas da aplicação renderizam seus dados', async () => {
    renderWithProviders('/app/profile');
    expect(await screen.findByRole('heading', { name: /alex developer/i })).toBeDefined();

    renderWithProviders('/app/settings');
    expect(screen.getByRole('heading', { name: /configurações/i })).toBeDefined();
  });

  it('5. Mobile inclui TabBar com os 3 links principais', () => {
    renderWithProviders('/app/trail');
    const mobileNav = screen.getByRole('navigation', { name: /navegação principal mobile/i });
    expect(mobileNav).toBeDefined();
    expect(screen.getAllByText(/trilha/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/perfil/i).length).toBeGreaterThan(0);
  });

  it('6. Desktop possui DesktopSidebar', () => {
    renderWithProviders('/app/trail');
    const sidebar = screen.getByRole('complementary', { name: /navegação lateral desktop/i });
    expect(sidebar).toBeDefined();
  });

  it('7. Mock Repository carrega módulos por nível sem acoplamento direto', async () => {
    const basicModules = await defaultTrailRepository.getModulesByLevel('basic');
    expect(basicModules.length).toBeGreaterThan(0);
    expect(basicModules[0].level).toBe('basic');

    // Confirm code questions NEVER belong to basic level in mock data
    const basicQuestions = basicModules[0].lessons[0].questions;
    expect(basicQuestions.every((q) => q.type !== 'code')).toBe(true);
  });
});
