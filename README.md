# ThinkJS — Frontend

Aplicação frontend em React + TypeScript + Vite + Tailwind CSS para a plataforma educacional ThinkJS.

## 📦 Estrutura

- `src/` — Código-fonte da aplicação React
- `preview/` — Shell de preview da aplicação
- `e2e/` — Testes E2E com Playwright
- `nginx.conf` — Configuração do Nginx para produção (SPA fallback + Security Headers)
- `Dockerfile` — Imagem multi-stage (Node 22 Alpine + Nginx Alpine)
- `stack.yml` — Definição do serviço para o Docker Swarm

## 🚀 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes unitários
npm run test

# Executar typecheck
npm run typecheck

# Executar lint
npm run lint

# Build de produção
npm run build
```

## 🐳 Docker & Swarm

```bash
# Build da imagem
docker build -t thinkjsgame-frontend:latest .

# Deploy no Docker Swarm
docker stack deploy -c stack.yml thinkjs_frontend
```

## 🔄 CI/CD

O repositório conta com pipeline em `.github/workflows/deploy.yml` configurada para rodar em **GitHub Actions Self-Hosted Runner** no servidor Docker Swarm, realizando lint, testes, build da imagem e deploy com zero-downtime rolling update.
