import { execSync } from 'child_process';
import path from 'path';

async function globalSetup() {
  console.log('🚀 Iniciando Global Setup E2E...');
  const rootDir = process.cwd();
  const backendDir = path.join(rootDir, 'backend');

  try {
    console.log('1. Executando Alembic upgrade head...');
    execSync('PYTHONPATH=. .venv/bin/alembic upgrade head', {
      cwd: backendDir,
      stdio: 'inherit',
    });

    console.log('2. Executando Backend Seed E2E...');
    execSync('PYTHONPATH=. .venv/bin/python scripts/seed_e2e.py', {
      cwd: backendDir,
      stdio: 'inherit',
    });
    console.log('✅ Global Setup E2E concluído com sucesso!');
  } catch (err) {
    console.error('❌ Falha no Global Setup E2E:', err);
    throw err;
  }
}

export default globalSetup;
