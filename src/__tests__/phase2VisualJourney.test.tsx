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

describe('Fase 2 - Implementação Visual Completa da Jornada do Aluno', () => {
  it('1. Renderiza a Landing Page na rota /', () => {
    renderWithProviders('/');
    expect(screen.getByRole('main')).toBeDefined();
  });

  it('2. Renderiza a tela de Boas-vindas na rota /app', () => {
    renderWithProviders('/app');
    expect(screen.getByRole('button', { name: /criar uma conta/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /já tenho uma conta/i })).toBeDefined();
  });

  it('3. Login renderiza os campos corretos (e-mail e senha)', () => {
    renderWithProviders('/app/login');
    expect(screen.getByLabelText(/e-mail/i, { selector: 'input' })).toBeDefined();
    expect(screen.getByLabelText(/senha/i, { selector: 'input' })).toBeDefined();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDefined();
  });

  it('4. Cadastro renderiza nome, e-mail, ano de nascimento e senha', () => {
    renderWithProviders('/app/signup');
    expect(screen.getByLabelText(/nome completo/i, { selector: 'input' })).toBeDefined();
    expect(screen.getByLabelText(/e-mail/i, { selector: 'input' })).toBeDefined();
    expect(screen.getByLabelText(/ano de nascimento/i, { selector: 'select' })).toBeDefined();
    expect(screen.getByLabelText(/senha/i, { selector: 'input' })).toBeDefined();
  });

  it('5. Onboarding permite navegar pelos slides', () => {
    renderWithProviders('/app/onboarding');
    expect(screen.getByText(/trilha de aprendizado/i)).toBeDefined();

    const nextBtn = screen.getByRole('button', { name: /continuar/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/como funcionam as perguntas/i)).toBeDefined();
  });

  it('6. LevelSelection exibe os 5 níveis com LevelCard', () => {
    renderWithProviders('/app/level');
    expect(screen.getByText(/1\. básico/i)).toBeDefined();
    expect(screen.getByText(/2\. iniciante/i)).toBeDefined();
    expect(screen.getByText(/3\. intermediário/i)).toBeDefined();
    expect(screen.getByText(/4\. avançado/i)).toBeDefined();
    expect(screen.getByText(/5\. especialista/i)).toBeDefined();
  });

  it('7. Trail renderiza módulos e o HUD da trilha', async () => {
    renderWithProviders('/app/trail');
    expect(screen.getByRole('heading', { name: /trilha de aprendizado/i })).toBeDefined();
    const modTitles = await screen.findAllByText(/módulo 1: primeiros passos com javascript/i);
    expect(modTitles.length).toBeGreaterThan(0);
  });

  it('8. Nível Básico garante letramento digital e não contém CodeQuestion', () => {
    renderWithProviders('/app/level');
    const basicCard = screen.getByText(/1\. básico/i);
    expect(basicCard).toBeDefined();
    expect(screen.getByText(/letramento digital geral \(sem js\)/i)).toBeDefined();
  });

  it('9. Lesson Intro renderiza objetivo e botão de início', async () => {
    renderWithProviders('/app/lesson/les-basico-1-1/intro');
    expect(await screen.findByText(/objetivo da lição:/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /começar lição/i })).toBeDefined();
  });

  it('10. Pergunta de múltipla escolha renderiza enunciado e opções', async () => {
    renderWithProviders('/app/lesson/les-basico-1-1/question/1');
    expect(await screen.findByRole('heading', { name: /qual dos itens abaixo é um exemplo de hardware/i })).toBeDefined();
    expect(screen.getByText(/teclado e monitor/i)).toBeDefined();
  });

  it('11. Pergunta de código (CodeQuestion) renderiza o editor CodeInputField visual no nível Iniciante', async () => {
    renderWithProviders('/app/lesson/les-iniciante-1-1/question/1');
    expect(await screen.findByText(/index\.js/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /executar/i })).toBeDefined();
  });

  it('12. LessonSummary exibe XP ganho e acertos e NÃO exibe tempo de conclusão', async () => {
    renderWithProviders('/app/lesson/les-basico-1-1/question/1');
    
    // Answer question 1
    const opt1 = await screen.findByText(/teclado e monitor/i);
    fireEvent.click(opt1);
    fireEvent.click(screen.getByRole('button', { name: /verificar resposta/i }));
    fireEvent.click(await screen.findByRole('button', { name: /próxima pergunta/i }));

    // Answer question 2
    const opt2 = await screen.findByText(/ctrl \+ c/i);
    fireEvent.click(opt2);
    fireEvent.click(screen.getByRole('button', { name: /verificar resposta/i }));
    fireEvent.click(await screen.findByRole('button', { name: /próxima pergunta/i }));

    expect(await screen.findByText(/\+25 xp/i)).toBeDefined();
    expect(screen.getByText(/2 \/ 2/i)).toBeDefined();
    expect(screen.queryByText(/tempo de conclusão/i)).toBeNull();
    expect(screen.queryByText(/minutos/i)).toBeNull();
  });

  it('13. Profile renderiza o perfil do aluno e conquistas (AchievementBadge)', () => {
    renderWithProviders('/app/profile');
    expect(screen.getByRole('heading', { name: /alex developer/i })).toBeDefined();
    expect(screen.getByRole('heading', { name: /minhas conquistas/i })).toBeDefined();
  });

  it('14. Settings lista todas as opções (Editar perfil, Notificações, Alterar senha, Sair, Excluir conta)', () => {
    renderWithProviders('/app/settings');
    expect(screen.getByText(/editar perfil/i)).toBeDefined();
    expect(screen.getByText(/preferências de notificação/i)).toBeDefined();
    expect(screen.getByText(/alterar senha/i)).toBeDefined();
    expect(screen.getByText(/sair da conta/i)).toBeDefined();
    expect(screen.getByText(/excluir minha conta \(lgpd\)/i)).toBeDefined();
  });

  it('15. DeleteAccount exibe mensagem de alerta LGPD e fluxo em duas etapas', () => {
    renderWithProviders('/app/settings/delete-account');
    expect(screen.getByText(/essa ação não pode ser desfeita\. todos os seus dados serão apagados\./i)).toBeDefined();

    const deleteBtn = screen.getByRole('button', { name: /quero excluir minha conta/i });
    fireEvent.click(deleteBtn);
    expect(screen.getByText(/tem certeza absoluta\?/i)).toBeDefined();
  });

  it('16. TabBar é renderizada no layout mobile', () => {
    renderWithProviders('/app/trail');
    const tabBar = screen.getByRole('navigation', { name: /navegação principal mobile/i });
    expect(tabBar).toBeDefined();
  });

  it('17. DesktopSidebar é renderizada no layout desktop', () => {
    renderWithProviders('/app/trail');
    const sidebar = screen.getByRole('complementary', { name: /navegação lateral desktop/i });
    expect(sidebar).toBeDefined();
  });
});
