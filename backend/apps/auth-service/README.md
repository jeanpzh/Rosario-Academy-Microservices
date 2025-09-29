# Auth Service - Microservicio de Autenticación

## Descripción

Microservicio de autenticación que maneja registro, login, JWT tokens y roles de usuarios usando Supabase como backend de autenticación.

## Características

- 🔐 Autenticación completa (registro, login, logout)
- 🔄 Refresh tokens
- 👥 Sistema de roles (admin, athlete, auxiliar)  
- 🛡️ Guards y decoradores para protección de rutas
- 🌐 API HTTP para frontend + TCP para microservicios
- 📧 Recuperación de contraseña
- ✅ Validación de datos con class-validator

## Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
# Supabase (obtener de https://supabase.com/dashboard)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# JWT
JWT_SECRET=tu-secret-super-secreto
JWT_EXPIRES_IN=1h

# Puertos
AUTH_SERVICE_PORT=3001
AUTH_SERVICE_TCP_PORT=3002
```

### 2. Configuración de Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ir a Authentication > Settings
3. Configurar Site URL y Redirect URLs
4. Habilitar Email authentication

### 3. Instalación

```bash
# Instalar dependencias (desde la raíz del monorepo)
npm install

# Iniciar auth service en desarrollo
npm run start:auth

# O usar Docker
docker-compose up auth-service
```

## API Endpoints

### Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/signup` | Registro de usuario |
| POST | `/auth/signin` | Login de usuario |
| POST | `/auth/refresh` | Renovar token |
| POST | `/auth/forgot-password` | Solicitar recuperación |
| POST | `/auth/reset-password` | Restablecer contraseña |
| GET | `/auth/health` | Health check |

### Endpoints Protegidos

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|--------|
| GET | `/auth/profile` | Perfil del usuario | Todos |
| POST | `/auth/signout` | Cerrar sesión | Todos |
| GET | `/auth/admin-only` | Endpoint de prueba | admin |

## Ejemplo de Uso

### Registro
```bash
curl -X POST http://localhost:3001/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "password123",
    "full_name": "Usuario Ejemplo",
    "role": "athlete"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/auth/signin \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "usuario@ejemplo.com", 
    "password": "password123"
  }'
```

### Acceder a perfil
```bash
curl -X GET http://localhost:3001/auth/profile \\
  -H "Authorization: Bearer tu-jwt-token"
```

## Roles del Sistema

- **admin**: Acceso completo al sistema
- **athlete**: Usuario atleta (rol por defecto)
- **auxiliar**: Usuario auxiliar/asistente

## Arquitectura

```
┌─────────────────┐    HTTP    ┌─────────────────┐
│    Frontend     │ ◄────────► │   Auth Service  │
└─────────────────┘            │   (Port 3001)   │
                               └─────────────────┘
                                        │
                                  TCP   │
                                        ▼
                               ┌─────────────────┐
                               │ Other Services  │
                               │   (Port 3002)   │
                               └─────────────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │    Supabase     │
                               │   (Database)    │
                               └─────────────────┘
```

## Patrones de Microservicio

El servicio expone patrones TCP para comunicación interna:

- `{ cmd: 'validate_token' }` - Validar token JWT
- `{ cmd: 'get_user_by_id' }` - Obtener usuario por ID
- `{ cmd: 'check_user_role' }` - Verificar rol de usuario

## Desarrollo

```bash
# Desarrollo con hot reload
npm run start:auth

# Modo debug
npm run start:auth:debug

# Build para producción
npm run build:auth

# Iniciar en producción
npm run start:auth:prod
```

## Testing

```bash
# Health check
curl http://localhost:3001/auth/health

# Verificar que el servicio responde
curl http://localhost:3001/auth/signup -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@test.com","password":"123456"}'
```

## Próximos Pasos

1. Implementar middleware de rate limiting
2. Agregar logging estructurado
3. Implementar métricas con Prometheus
4. Agregar tests unitarios e integración
5. Configurar CI/CD
