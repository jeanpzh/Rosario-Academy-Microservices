# Dockerfile simple para monorepo NestJS
FROM node:24-alpine AS base

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY apps/ ./apps/

# Construir todas las aplicaciones
RUN npm run build:gateway
RUN npm run build:auth
RUN npm run build:user
RUN npm run build:payment

# Development stage (para hot reload)
FROM node:24-alpine AS development

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Instalar TODAS las dependencias (incluye devDependencies)
RUN npm ci

# Exponer puerto por defecto
EXPOSE 8000

# El código se monta como volumen, no se copia aquí
CMD ["npm", "run", "start:dev"]

# Gateway
FROM node:24-alpine AS gateway
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
EXPOSE 8000
CMD ["node", "dist/apps/gateway/main.js"]

# Auth Service  
FROM node:24-alpine AS auth-service
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
CMD ["node", "dist/apps/auth-service/main.js"]

# User Service
FROM node:24-alpine AS user-service
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
CMD ["node", "dist/apps/user-service/main.js"]

# Payment Service
FROM node:24-alpine AS payment-service
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
CMD ["node", "dist/apps/payment-service/main.js"]

# Backend (app principal)
FROM node:24-alpine AS backend
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /app/dist ./dist
CMD ["npm", "run", "start:prod"]

