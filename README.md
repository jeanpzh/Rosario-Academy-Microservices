# Rosario Academia

Plataforma de gestión deportiva con arquitectura de microservicios (NestJS) y frontend Next.js.

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+

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

