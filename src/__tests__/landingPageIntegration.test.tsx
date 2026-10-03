import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { StudentProgressProvider } from '@/app/providers/StudentProgressProvider';
import { AppRouter } from '@/app/router/AppRouter';

function renderWithProviders(initialRoute = '/') {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <StudentProgressProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <AppRouter />
          </MemoryRouter>
        </StudentProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('Integração de CTAs - Landing Page e Aplicação do Aluno', () => {
  it('1. "Começar grátis" da Navbar navega para /app/signup', () => {
    renderWithProviders('/');
    const navbarLink = screen.getAllByRole('link', { name: /começar grátis/i })[0];
    expect(navbarLink.getAttribute('href')).toBe('/app/signup');
  });

  it('2. "Entrar" da Navbar navega para /app/login', () => {
    renderWithProviders('/');
    const entrarLink = screen.getAllByRole('link', { name: /entrar/i })[0];
    expect(entrarLink.getAttribute('href')).toBe('/app/login');
  });

  it('3. CTA mobile da Navbar também funciona (Começar grátis e Entrar)', () => {
    renderWithProviders('/');
    const openMenuBtn = screen.getByRole('button', { name: /abrir menu/i });
    fireEvent.click(openMenuBtn);

    const signupLinks = screen.getAllByRole('link', { name: /começar grátis/i });
    const mobileSignupLink = signupLinks[signupLinks.length - 1];
    expect(mobileSignupLink.getAttribute('href')).toBe('/app/signup');

    const entrarLinks = screen.getAllByRole('link', { name: /entrar/i });
    const mobileEntrarLink = entrarLinks[entrarLinks.length - 1];
    expect(mobileEntrarLink.getAttribute('href')).toBe('/app/login');
  });

  it('4. Hero "Sou aluno e quero aprender" navega para /app/signup', () => {
    renderWithProviders('/');
    const heroLink = screen.getByRole('link', { name: /sou aluno e quero aprender/i });
    expect(heroLink.getAttribute('href')).toBe('/app/signup');
  });

  it('5. "Criar conta" em /app navega para /app/signup', () => {
    renderWithProviders('/app');
    const signupBtn = screen.getByRole('button', { name: /criar uma conta/i });
    expect(signupBtn.closest('a')?.getAttribute('href')).toBe('/app/signup');
  });

  it('6. "Já tenho conta" em /app navega para /app/login', () => {
    renderWithProviders('/app');
    const loginBtn = screen.getByRole('button', { name: /já tenho uma conta/i });
    expect(loginBtn.closest('a')?.getAttribute('href')).toBe('/app/login');
  });

  it('7. Login mockado permite navegar para /app/trail', async () => {
    renderWithProviders('/app/login');
    const emailInput = screen.getByLabelText(/e-mail/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/senha/i, { selector: 'input' });
    const submitBtn = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'aluno@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByRole('heading', { name: /trilha de aprendizado/i })).toBeDefined();
  });

  it('8. Cadastro com idade >= 13 segue para /app/onboarding', async () => {
    renderWithProviders('/app/signup');
    const nameInput = screen.getByLabelText(/nome completo/i, { selector: 'input' });
    const emailInput = screen.getByLabelText(/e-mail/i, { selector: 'input' });
    const yearSelect = screen.getByLabelText(/ano de nascimento/i, { selector: 'select' });
    const passwordInput = screen.getByLabelText(/senha/i, { selector: 'input' });
    const submitBtn = screen.getByRole('button', { name: /criar minha conta/i });

    fireEvent.change(nameInput, { target: { value: 'Lucas Teen' } });
    fireEvent.change(emailInput, { target: { value: 'lucas@exemplo.com' } });
    fireEvent.change(yearSelect, { target: { value: '2008' } }); // > 13 anos
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/essa é sua trilha de aprendizado/i)).toBeDefined();
  });

  it('9. Cadastro com idade < 13 segue para /app/parental-consent', async () => {
    renderWithProviders('/app/signup');
    const nameInput = screen.getByLabelText(/nome completo/i, { selector: 'input' });
    const emailInput = screen.getByLabelText(/e-mail/i, { selector: 'input' });
    const yearSelect = screen.getByLabelText(/ano de nascimento/i, { selector: 'select' });
    const passwordInput = screen.getByLabelText(/senha/i, { selector: 'input' });
    const submitBtn = screen.getByRole('button', { name: /criar minha conta/i });

    fireEvent.change(nameInput, { target: { value: 'Pedro Kid' } });
    fireEvent.change(emailInput, { target: { value: 'pedro@exemplo.com' } });
    fireEvent.change(yearSelect, { target: { value: '2018' } }); // < 13 anos
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByRole('heading', { name: /autorização do responsável/i })).toBeDefined();
  });
});
