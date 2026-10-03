import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { StudentProgressProvider } from '@/app/providers/StudentProgressProvider';
import { AppRouter } from '@/app/router/AppRouter';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentProgressProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </StudentProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
