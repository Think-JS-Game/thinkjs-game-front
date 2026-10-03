# Multi-stage Dockerfile para Frontend React + Vite (Nginx)

# Build Stage
FROM node:22-alpine AS build

WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm ci

# Copia código fonte e builda estáticos
COPY . .
RUN npm run build

# Runtime Stage (Nginx Alpine)
FROM nginx:alpine

# Remove página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build da aplicação React para o diretório web do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx com fallback SPA e headers de segurança
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
