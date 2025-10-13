# Arquitectura del Sistema - Rosario Academia

## 📊 Diagrama de Alto Nivel

```mermaid
graph TB
    subgraph "Frontend Layer"
        CLIENT[Next.js Client<br/>rosario-academia<br/>Port: 3000]
    end

    subgraph "API Gateway Layer"
        GATEWAY[API Gateway<br/>NestJS HTTP<br/>Port: 8000<br/>Swagger Docs]
    end

    subgraph "Microservices Layer"
        AUTH[Auth Service<br/>TCP: 8002]
        USER[User Service<br/>TCP: 8005<br/>gRPC: 50051]
        PAYMENT[Payment Service<br/>TCP: 8001]
        ATHLETE[Athlete Service<br/>TCP: 8003]
        WORKER[Worker Service<br/>TCP: 8004]
    end

    subgraph "Cache & Message Broker Layer"
        REDIS[(Redis<br/>Cache<br/>Port: 6379)]
        KAFKA[Apache Kafka<br/>Event Streaming<br/>Port: 9092]
        ZOOKEEPER[Zookeeper<br/>Port: 2181]
    end

    subgraph "External Services"
        SUPABASE[(Supabase<br/>Auth & Database)]
        CLOUDINARY[Cloudinary<br/>Media Storage]
    end

    CLIENT -->|HTTP/REST<br/>CORS Enabled| GATEWAY
    
    GATEWAY -->|TCP| AUTH
    GATEWAY -->|TCP| USER
    GATEWAY -->|TCP| PAYMENT
    GATEWAY -->|TCP| ATHLETE
    GATEWAY -->|TCP| WORKER
    
    AUTH -->|gRPC| USER
    
    GATEWAY -.->|Cache| REDIS
    AUTH -.->|Cache| REDIS
    PAYMENT -.->|Cache| REDIS
    
    PAYMENT -->|Pub/Sub| KAFKA
    KAFKA -->|Depends| ZOOKEEPER
    
    AUTH -->|Auth & Data| SUPABASE
    USER -->|Data| SUPABASE
    GATEWAY -->|Upload| CLOUDINARY

    style CLIENT fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    style GATEWAY fill:#E535AB,stroke:#333,stroke-width:3px
    style AUTH fill:#10B981,stroke:#333,stroke-width:2px
    style USER fill:#10B981,stroke:#333,stroke-width:2px
    style PAYMENT fill:#10B981,stroke:#333,stroke-width:2px
    style ATHLETE fill:#10B981,stroke:#333,stroke-width:2px
    style WORKER fill:#10B981,stroke:#333,stroke-width:2px
    style REDIS fill:#DC382D,stroke:#333,stroke-width:2px
    style KAFKA fill:#231F20,stroke:#333,stroke-width:2px,color:#fff
    style SUPABASE fill:#3ECF8E,stroke:#333,stroke-width:2px
```

---

## 🔧 Diagrama de Bajo Nivel (Detallado)

```mermaid
graph TB
    subgraph "Client Layer - Port 3000"
        CLIENT[Next.js Frontend<br/>---<br/>React Components<br/>TanStack Query<br/>Zustand Store<br/>Context API]
    end

    subgraph "API Gateway - Port 8000"
        GATEWAY_HTTP[HTTP Server<br/>Express/NestJS<br/>---<br/>Cookie Parser<br/>CORS Middleware<br/>Validation Pipes]
        GATEWAY_SWAGGER[Swagger UI<br/>/api/docs<br/>---<br/>JWT Auth<br/>Cookie Auth]
        GATEWAY_CLIENTS[TCP Clients Pool<br/>---<br/>Auth: localhost:8002<br/>User: localhost:8005<br/>Payment: localhost:8001<br/>Athlete: localhost:8003<br/>Worker: localhost:8004]
        GATEWAY_CACHE[Cache Service<br/>Redis Client]
        GATEWAY_CLOUD[Cloudinary Service<br/>Image Upload]
        
        GATEWAY_HTTP --> GATEWAY_CLIENTS
        GATEWAY_HTTP --> GATEWAY_CACHE
        GATEWAY_HTTP --> GATEWAY_CLOUD
    end

    subgraph "Auth Service - TCP:8002"
        AUTH_TCP[TCP Server<br/>Port: 8002<br/>0.0.0.0]
        AUTH_GRPC_CLIENT[gRPC Client<br/>→ User Service<br/>Port: 50051]
        AUTH_SERVICE[Auth Service<br/>---<br/>Login/Logout<br/>Token Management<br/>Session Handling]
        AUTH_CACHE[Redis Cache<br/>Session Storage<br/>TTL: 600s]
        AUTH_SUPABASE[Supabase Client<br/>Authentication<br/>User Data]
        
        AUTH_TCP --> AUTH_SERVICE
        AUTH_SERVICE --> AUTH_GRPC_CLIENT
        AUTH_SERVICE --> AUTH_CACHE
        AUTH_SERVICE --> AUTH_SUPABASE
    end

    subgraph "User Service - TCP:8005 + gRPC:50051"
        USER_TCP[TCP Server<br/>Port: 8005<br/>0.0.0.0]
        USER_GRPC[gRPC Server<br/>Port: 50051<br/>user.proto<br/>---<br/>GetUserById<br/>GetUserProfile<br/>CreateUser]
        USER_SERVICE[User Service<br/>---<br/>User Management<br/>Profile CRUD<br/>Role Management]
        USER_SUPABASE[Supabase Client<br/>User Data<br/>Profiles Table]
        
        USER_TCP --> USER_SERVICE
        USER_GRPC --> USER_SERVICE
        USER_SERVICE --> USER_SUPABASE
    end

    subgraph "Payment Service - TCP:8001"
        PAYMENT_TCP[TCP Server<br/>Port: 8001<br/>0.0.0.0]
        PAYMENT_SERVICE[Payment Service<br/>---<br/>Payment Processing<br/>Enrollment Requests<br/>Webhook Handler]
        PAYMENT_CACHE[Redis Cache<br/>Payment Status<br/>Transaction Cache]
        PAYMENT_KAFKA[Kafka Producer<br/>---<br/>Topics:<br/>- payment.created<br/>- payment.completed<br/>- enrollment.pending]
        PAYMENT_REPO[Repository<br/>Supabase Tables<br/>---<br/>payments<br/>enrollment_requests]
        
        PAYMENT_TCP --> PAYMENT_SERVICE
        PAYMENT_SERVICE --> PAYMENT_CACHE
        PAYMENT_SERVICE --> PAYMENT_KAFKA
        PAYMENT_SERVICE --> PAYMENT_REPO
    end

    subgraph "Athlete Service - TCP:8003"
        ATHLETE_TCP[TCP Server<br/>Port: 8003]
        ATHLETE_SERVICE[Athlete Service<br/>---<br/>Athlete Management<br/>Schedule Handling<br/>Status Updates]
        ATHLETE_SUPABASE[Supabase Client<br/>Athletes Data]
        
        ATHLETE_TCP --> ATHLETE_SERVICE
        ATHLETE_SERVICE --> ATHLETE_SUPABASE
    end

    subgraph "Worker Service - TCP:8004"
        WORKER_TCP[TCP Server<br/>Port: 8004]
        WORKER_SERVICE[Worker Service<br/>---<br/>Staff Management<br/>Assistant CRUD<br/>Shift Management]
        WORKER_SUPABASE[Supabase Client<br/>Workers Data]
        
        WORKER_TCP --> WORKER_SERVICE
        WORKER_SERVICE --> WORKER_SUPABASE
    end

    subgraph "Infrastructure - Cache & Messaging"
        REDIS_SERVER[Redis Server<br/>Port: 6379<br/>---<br/>Keyv Redis Adapter<br/>AOF Persistence<br/>TTL: 600s default]
        
        ZOOKEEPER_SERVER[Zookeeper<br/>Port: 2181<br/>---<br/>Kafka Coordination<br/>Topic Management]
        
        KAFKA_BROKER[Kafka Broker<br/>Port: 9092 internal<br/>Port: 9093 external<br/>---<br/>Broker ID: 1<br/>Auto-create topics<br/>Replication: 1]
        
        KAFKA_UI[Kafka UI<br/>Port: 8080<br/>---<br/>Topic Monitoring<br/>Message Inspector]
        
        ZOOKEEPER_SERVER --> KAFKA_BROKER
        KAFKA_BROKER --> KAFKA_UI
    end

    subgraph "External Services"
        SUPABASE_FULL[Supabase<br/>---<br/>PostgreSQL Database<br/>Auth Service<br/>Row Level Security<br/>Real-time Subscriptions<br/>---<br/>Tables:<br/>- users<br/>- profiles<br/>- athletes<br/>- workers<br/>- payments<br/>- enrollment_requests]
        
        CLOUDINARY_FULL[Cloudinary API<br/>---<br/>Image Upload<br/>Transformation<br/>CDN Delivery<br/>Avatar Storage]
    end

    subgraph "Network Layer"
        DOCKER_NETWORK[Docker Network: backend<br/>Bridge Driver<br/>---<br/>Internal DNS Resolution<br/>Service Discovery]
    end

    CLIENT -->|HTTP REST API<br/>JSON Payload<br/>Cookies: auth_session| GATEWAY_HTTP
    
    GATEWAY_HTTP -->|TCP MessagePattern<br/>Request-Response| AUTH_TCP
    GATEWAY_HTTP -->|TCP MessagePattern| USER_TCP
    GATEWAY_HTTP -->|TCP MessagePattern| PAYMENT_TCP
    GATEWAY_HTTP -->|TCP MessagePattern| ATHLETE_TCP
    GATEWAY_HTTP -->|TCP MessagePattern| WORKER_TCP
    
    AUTH_GRPC_CLIENT -->|gRPC Protobuf<br/>GetUserById| USER_GRPC
    
    GATEWAY_CACHE -->|GET/SET/DEL| REDIS_SERVER
    AUTH_CACHE -->|GET/SET/DEL<br/>Session Keys| REDIS_SERVER
    PAYMENT_CACHE -->|GET/SET/DEL<br/>Payment Keys| REDIS_SERVER
    
    PAYMENT_KAFKA -->|Publish Events<br/>Async Messages| KAFKA_BROKER
    
    AUTH_SUPABASE -->|SQL Queries<br/>RLS Policies| SUPABASE_FULL
    USER_SUPABASE -->|SQL Queries| SUPABASE_FULL
    ATHLETE_SUPABASE -->|SQL Queries| SUPABASE_FULL
    WORKER_SUPABASE -->|SQL Queries| SUPABASE_FULL
    PAYMENT_REPO -->|SQL Queries| SUPABASE_FULL
    
    GATEWAY_CLOUD -->|HTTPS Upload<br/>Multipart Form| CLOUDINARY_FULL

    style CLIENT fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    style GATEWAY_HTTP fill:#E535AB,stroke:#333,stroke-width:2px
    style AUTH_TCP fill:#10B981,stroke:#333,stroke-width:2px
    style USER_TCP fill:#10B981,stroke:#333,stroke-width:2px
    style USER_GRPC fill:#5865F2,stroke:#333,stroke-width:2px
    style PAYMENT_TCP fill:#10B981,stroke:#333,stroke-width:2px
    style REDIS_SERVER fill:#DC382D,stroke:#333,stroke-width:2px
    style KAFKA_BROKER fill:#231F20,stroke:#333,stroke-width:2px,color:#fff
    style SUPABASE_FULL fill:#3ECF8E,stroke:#333,stroke-width:2px
    style DOCKER_NETWORK fill:#2496ED,stroke:#333,stroke-width:2px
```

---

## 📋 Descripción de Componentes

### 🎨 Frontend (Next.js - Port 3000)
- **Framework**: Next.js 14+ con App Router
- **State Management**: 
  - TanStack Query para server state
  - Zustand para client state
  - Context API para autenticación
- **Comunicación**: HTTP REST API con el Gateway
- **Autenticación**: Cookies HTTP-only (auth_session)
- **Features**: 
  - Dashboard de atletas
  - Gestión de pagos
  - Perfiles de usuarios
  - Sistema de roles (RBAC)

### 🌐 API Gateway (Port 8000)
- **Función**: Punto de entrada único para el frontend
- **Protocolo Externo**: HTTP/REST
- **Protocolo Interno**: TCP con MessagePattern
- **Responsabilidades**:
  - Enrutamiento de peticiones a microservicios
  - Validación de DTOs con class-validator
  - Manejo de CORS
  - Gestión de sesiones con cookies
  - Documentación Swagger en /api/docs
  - Upload de imágenes a Cloudinary
  - Cache con Redis
- **Seguridad**:
  - JWT Bearer token
  - Cookie authentication
  - Guards y decoradores para roles
  - Exception filters

### 🔐 Auth Service (TCP: 8002)
- **Protocolo**: TCP Server
- **Comunicación Externa**: gRPC Client hacia User Service
- **Responsabilidades**:
  - Autenticación de usuarios (login/logout)
  - Generación y validación de JWT
  - Gestión de sesiones con Redis
  - Integración con Supabase Auth
  - Estrategias de autenticación (JWT)
- **Cache**: Redis para sesiones con TTL configurable
- **Base de Datos**: Supabase para usuarios

### 👤 User Service (TCP: 8005 + gRPC: 50051)
- **Protocolos**: 
  - TCP Server para el Gateway
  - gRPC Server para Auth Service
- **Proto File**: user.proto con servicios:
  - GetUserById
  - GetUserProfile
  - CreateUser
  - UpdateUser
- **Responsabilidades**:
  - CRUD de usuarios
  - Gestión de perfiles
  - Manejo de roles y permisos
- **Base de Datos**: Supabase (tablas: users, profiles)

### 💳 Payment Service (TCP: 8001)
- **Protocolo**: TCP Server
- **Responsabilidades**:
  - Procesamiento de pagos
  - Gestión de solicitudes de matrícula
  - Webhooks de pasarelas de pago
  - Emisión de eventos a Kafka
- **Eventos Kafka**:
  - payment.created
  - payment.completed
  - enrollment.pending
- **Cache**: Redis para estados de pago
- **Base de Datos**: Supabase (tablas: payments, enrollment_requests)

### 🏃 Athlete Service (TCP: 8003)
- **Protocolo**: TCP Server
- **Responsabilidades**:
  - Gestión de atletas
  - Horarios y cronogramas
  - Actualización de estados y niveles
  - Distribución por categorías
- **Base de Datos**: Supabase (tabla: athletes)

### 👷 Worker Service (TCP: 8004)
- **Protocolo**: TCP Server
- **Responsabilidades**:
  - Gestión de trabajadores/asistentes
  - Manejo de turnos
  - CRUD de staff
- **Base de Datos**: Supabase (tabla: workers)

### 🗄️ Redis (Port 6379)
- **Función**: Cache distribuido y almacenamiento de sesiones
- **Adapter**: Keyv Redis (@keyv/redis)
- **Persistencia**: AOF (Append Only File)
- **TTL Default**: 600 segundos (10 minutos)
- **Usado por**:
  - Gateway: Cache general
  - Auth Service: Sesiones de usuario
  - Payment Service: Estados de transacciones

### 📨 Apache Kafka (Port 9092/9093)
- **Función**: Message broker para eventos asíncronos
- **Configuración**:
  - Broker ID: 1
  - Zookeeper: zookeeper:2181
  - Auto-create topics: Enabled
  - Replication factor: 1 (dev)
- **Listeners**:
  - Internal: kafka:9092
  - External: localhost:9093
- **Topics Principales**:
  - payment.created
  - payment.completed
  - enrollment.pending
- **UI**: Kafka UI en port 8080 para monitoreo

### 🐘 Zookeeper (Port 2181)
- **Función**: Coordinación de Kafka
- **Responsabilidades**:
  - Gestión de brokers
  - Metadata de topics
  - Leader election

### 🗃️ Supabase
- **Función**: Backend as a Service
- **Servicios Utilizados**:
  - PostgreSQL Database
  - Authentication Service
  - Row Level Security (RLS)
  - Real-time Subscriptions
- **Tablas Principales**:
  - users: Usuarios del sistema
  - profiles: Perfiles extendidos
  - athletes: Atletas registrados
  - workers: Personal/asistentes
  - payments: Transacciones de pago
  - enrollment_requests: Solicitudes de matrícula

### ☁️ Cloudinary
- **Función**: Almacenamiento y transformación de imágenes
- **Usado para**:
  - Avatares de usuarios
  - Imágenes de atletas
  - Documentos adjuntos
- **Features**:
  - Upload multipart
  - Transformaciones automáticas
  - CDN global

---

## 🔄 Flujos de Datos Principales

### 1️⃣ Flujo de Autenticación
```
Client → Gateway (POST /auth/login)
  → Gateway → Auth Service (TCP)
    → Auth Service → Supabase (verify credentials)
    → Auth Service → User Service (gRPC: GetUserById)
    → Auth Service → Redis (store session)
    → Auth Service generates JWT
  ← Gateway stores cookie
← Client receives auth_session cookie
```

### 2️⃣ Flujo de Consulta de Usuario
```
Client → Gateway (GET /users/profile)
  → Gateway validates JWT
  → Gateway → User Service (TCP)
    → User Service → Supabase (query profiles)
  ← Gateway formats response
← Client receives user data
```

### 3️⃣ Flujo de Pago
```
Client → Gateway (POST /payments)
  → Gateway → Payment Service (TCP)
    → Payment Service → Supabase (insert payment)
    → Payment Service → Redis (cache payment status)
    → Payment Service → Kafka (publish payment.created event)
  ← Gateway returns payment confirmation
← Client receives payment ID
```

### 4️⃣ Flujo de Upload de Imagen
```
Client → Gateway (POST /users/avatar)
  → Gateway → Cloudinary (multipart upload)
  ← Gateway receives Cloudinary URL
  → Gateway → User Service (update profile)
← Client receives updated profile
```

---

## 🐳 Arquitectura de Contenedores

### Docker Network
- **Nombre**: backend
- **Driver**: bridge
- **DNS Interno**: Resolución automática por hostname

### Servicios Dockerizados
1. **gateway** → Expone port 8000
2. **auth-service** → Interno
3. **user-service** → Interno
4. **payment-service** → Interno
5. **athlete-service** → Interno (inferido)
6. **worker-service** → Interno (inferido)
7. **redis** → Expone port 6379
8. **kafka** → Expone ports 9092, 9093
9. **zookeeper** → Expone port 2181
10. **kafka-ui** → Expone port 8080

### Volúmenes Persistentes
- `redis_data`: Datos de Redis
- `kafka_data`: Logs y datos de Kafka
- `zookeeper_data`: Datos de Zookeeper
- `zookeeper_logs`: Logs de Zookeeper

---

## 🔒 Seguridad

### Autenticación
- JWT con secret configurable
- Cookies HTTP-only para sesiones
- Expiración de tokens: 24h

### Autorización
- Guards de roles en el Gateway
- Decoradores @Roles para endpoints
- Row Level Security en Supabase

### Validación
- DTOs con class-validator
- Whitelist enabled
- Forbidden non-whitelisted properties
- Transform enabled

---

## ⚡ Optimizaciones

### Cache Strategy
- Redis como cache layer
- TTL configurable por servicio
- Cache invalidation en mutations

### Event-Driven Architecture
- Kafka para desacoplamiento
- Async processing de pagos
- Event sourcing para auditoría

### Protocol Optimization
- TCP para comunicación interna (menor overhead que HTTP)
- gRPC para comunicación de alta frecuencia (Auth → User)
- HTTP/REST solo en el borde (Client → Gateway)

---

## 📊 Métricas y Monitoreo

### Puntos de Observabilidad
1. **Kafka UI** (port 8080): Monitoreo de eventos
2. **Swagger UI** (port 8000/api/docs): Documentación y testing
3. **Logs**: Logger de NestJS en cada servicio
4. **Exception Filters**: Captura de errores en Gateway y microservicios

---

## 🚀 Escalabilidad

### Horizontal Scaling
- Cada microservicio puede escalar independientemente
- Redis como cache compartido
- Kafka como event bus distribuido

### Load Balancing
- Gateway puede replicarse detrás de un load balancer
- Servicios internos con múltiples instancias
- Redis Cluster para alta disponibilidad (futuro)

---

## 🔧 Tecnologías Utilizadas

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Frontend | Next.js | 14+ |
| API Gateway | NestJS | Latest |
| Microservicios | NestJS | Latest |
| Cache | Redis | 7.2-alpine |
| Message Broker | Apache Kafka | 7.5.0 |
| Zookeeper | Confluent Zookeeper | 7.5.0 |
| Database | Supabase (PostgreSQL) | Latest |
| Auth | Supabase Auth + JWT | Latest |
| Media Storage | Cloudinary | API v2 |
| Container | Docker + Docker Compose | Latest |
| Protocol - Internal | TCP, gRPC | - |
| Protocol - External | HTTP/REST | - |

---

## 📝 Convenciones

### Ports
- **3000**: Frontend (Next.js)
- **8000**: API Gateway
- **8001**: Payment Service
- **8002**: Auth Service
- **8003**: Athlete Service
- **8004**: Worker Service
- **8005**: User Service (TCP)
- **50051**: User Service (gRPC)
- **6379**: Redis
- **9092/9093**: Kafka
- **2181**: Zookeeper
- **8080**: Kafka UI

### Nomenclatura
- **Microservicios**: kebab-case (auth-service, user-service)
- **Clases**: PascalCase
- **Variables**: camelCase
- **Archivos**: kebab-case
- **Constantes ENV**: UPPERCASE

### Patrones de Diseño
- Repository Pattern
- Dependency Injection
- Adapter Pattern (Cache)
- Strategy Pattern (Auth)
- Observer Pattern (Kafka events)

---

**Generado el**: 2025-10-13
**Proyecto**: Rosario Academia  
**Arquitectura**: Microservicios con API Gateway

