# Rosario Academia

Plataforma de gestión deportiva con arquitectura de microservicios (NestJS) y frontend Next.js.

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+

## Configuración

### Backend

Crear `backend/.env.local`:

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_key
SUPABASE_JWT_SECRET=tu_jwt_secret
REDIS_HOST=redis
REDIS_PORT=6379
KAFKA_BROKERS=kafka:9092
JWT_SECRET=tu_jwt_secret_key
JWT_EXPIRATION=1d
STRIPE_SECRET_KEY=tu_stripe_secret_key
MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_token
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Frontend

Crear `rosario-academia/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_mercadopago_public_key
```

## Ejecución

### Desarrollo con Hot Reload

```bash
cd backend
docker compose -f docker-compose.dev.yml watch
```

Los cambios en `apps/*/src` se sincronizan automáticamente. El contenedor se reconstruye solo si cambia `package.json`.

### Frontend

```bash
cd rosario-academia
npm install
npm run dev
```

Acceder en http://localhost:3000

### Producción

```bash
cd backend
docker compose up -d
```

## Comandos Útiles

```bash
# Ver logs
docker compose logs -f [servicio]

# Reiniciar servicio
docker compose restart [servicio]

# Detener todo
docker compose down

# Limpiar volúmenes
docker compose down -v

# Reconstruir
docker compose up -d --build

# Estado de servicios
docker compose ps

# Acceder a contenedor
docker compose exec [servicio] sh

# Redis CLI
docker compose exec redis redis-cli

# Limpiar caché
docker compose exec redis redis-cli FLUSHALL
```

## Puertos

- Gateway: 8000
- Frontend: 3000
- Redis: 6379
- Kafka: 9092/9093
- Kafka UI: 8080
- Zookeeper: 2181

## Solución de Problemas

```bash
# Puerto ocupado (Windows)
netstat -ano | findstr :8000

# Puerto ocupado (Linux/Mac)
lsof -i :8000

# Reinicio limpio
docker compose down -v && docker compose up -d --build

# Verificar Docker Compose
docker compose version  # Necesita v2.22+
```

