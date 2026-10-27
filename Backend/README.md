# XClone – Backend (API REST)

API REST del clon de X. Spring Boot 3 + Java 17 + SQL Server + JWT.

**Integrantes:** _(escribir nombres del equipo)_

## Tecnologías
Java 17 · Spring Boot 3.4 · Spring Web · Spring Data JPA (Hibernate) · Spring Security · Validation · Flyway (migraciones) · SQL Server (driver `mssql-jdbc`) · JWT (jjwt) · bcrypt · Maven

## Migraciones (Flyway)
El esquema vive en `src/main/resources/db/migration` y se aplica automáticamente al arrancar:

| Versión | Archivo | Qué hace |
|---|---|---|
| 1 | `V1__init.sql` | Crea `users`, `tweets` y `follows` con PK, FKs y unicidades |
| 2 | `V2__indexes_and_constraints.sql` | Índices para paginación y regla "no seguirse a sí mismo" |

- **Base vacía:** se aplican todas las migraciones en orden.
- **Base ya creada** (por ejemplo por Hibernate en un arranque anterior): Flyway la marca con *baseline* en la versión 1 y salta `V1`; desde ahí solo aplican las versiones nuevas (V2 en adelante).
- Hibernate queda en `ddl-auto=validate`: solo comprueba que el esquema coincide con las entidades, nunca borra ni reconstruye nada.
- Para aplicar una migración manualmente basta con arrancar la app; Flyway lo hace al inicio. Se puede verificar con `SELECT * FROM flyway_schema_history`.

## Inicio rápido (5 pasos)

1. **SQL Server encendido** y escuchando por TCP en el puerto **1433** (SQL Server Configuration Manager → TCP/IP habilitado). Usuario de SQL con contraseña (por ejemplo un login dedicado `xclone`) y modo mixto activado.
2. **Crea la base de datos** ejecutando `database/create-database.sql` (o simplemente `CREATE DATABASE xclone;`). Las tablas las crea Flyway al arrancar la app.
3. **Abre el archivo `.env`** de esta carpeta y reemplaza `your_password_here` por tu contraseña. Es lo único que debes cambiar.
4. **Abre la carpeta `backend` en NetBeans** (File → Open Project; Maven la reconoce) y espera a que descargue las dependencias.
5. **Ejecuta:** clic derecho en el proyecto → *Run Maven → Goals…* → escribe `spring-boot:run` → *OK*.
   (También sirve ejecutar la clase `BackendApplication`.)

Al arrancar verás en la consola `Seed completed: 25 users, 60 tweets...` y `Started BackendApplication`. La API queda en **http://localhost:8080**.

> Las tablas `users`, `tweets` y `follows` las crea Flyway automáticamente la primera vez (migraciones en `src/main/resources/db/migration`). Si la base ya tiene usuarios, el seed no se vuelve a ejecutar.

> **No hay registro de usuarios.** Es una exclusión del alcance del proyecto: los usuarios provienen únicamente del seed. El endpoint `/api/auth/register` no existe y la única ruta pública es `POST /api/auth/login`.

## Usuarios de prueba (seed)
25 usuarios, 60 tweets y seguimientos. Todos con contraseña **`password123`**.
Ejemplos: `laurag`, `carlosr`, `sofiam`, `juanp`, `valer`. `laurag` tiene 24 seguidores y sigue a 12, ideal para probar la paginación.

## Variables de entorno (`.env`, ver `.env.example`)
| Variable | Para qué sirve |
|---|---|
| `DB_URL` | Cadena de conexión a SQL Server |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de SQL Server |
| `JWT_SECRET` | Clave para firmar tokens (mínimo 32 caracteres) |
| `JWT_EXPIRATION_MS` | Duración del token (por defecto 24 h) |
| `CORS_ALLOWED_ORIGIN` | Único origen permitido (frontend). Por defecto `http://localhost:5173` |
| `SEED_ENABLED` | `true` para cargar datos de prueba si la base está vacía |

## Endpoints
🔒 = requiere `Authorization: Bearer <token>`. Todos responden JSON. Los errores devuelven `{ "message": "..." }`.

| Método | Ruta | Descripción | Éxito |
|---|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión (devuelve token y usuario) | 200 |
| GET 🔒 | `/api/users/me` | Usuario conectado con contadores | 200 |
| GET 🔒 | `/api/users/{username}` | Perfil con contadores e `isFollowing` | 200 |
| GET 🔒 | `/api/users/{username}/tweets?page=1&size=10` | Tweets del usuario (recientes primero) | 200 |
| GET 🔒 | `/api/users/{username}/followers?page=1&size=10` | Seguidores (orden alfabético por nombre) | 200 |
| GET 🔒 | `/api/users/{username}/following?page=1&size=10` | Seguidos (orden alfabético por nombre) | 200 |
| POST 🔒 | `/api/tweets` | Publicar tweet (máx. 280) | 201 |
| GET 🔒 | `/api/feed?page=1&size=10` | Tweets propios y de seguidos | 200 |
| POST 🔒 | `/api/follows` | Seguir por `username`; devuelve el perfil actualizado | 201 |

### Ejemplos
```json
POST /api/auth/login
{ "username": "laurag", "password": "password123" }
→ { "token": "eyJ...", "user": { "id": 1, "fullName": "Laura Gómez", "username": "laurag", "email": "...", "createdAt": "..." } }

POST /api/tweets
{ "content": "Hola mundo" }

POST /api/follows
{ "username": "carlosr" }
```

Respuesta paginada estándar:
```json
{ "items": [], "page": 1, "size": 10, "totalItems": 57, "totalPages": 6 }
```
`size` acepta de 1 a 50.

### Códigos de estado
| Código | Cuándo |
|---|---|
| 200 | Consultas e inicio de sesión exitosos |
| 201 | Recurso creado (tweet, seguimiento) |
| 400 | Datos inválidos (campos vacíos, tweet > 280, seguirse a sí mismo, `page`/`size` inválidos) |
| 401 | Sin token, token inválido o credenciales incorrectas |
| 404 | El usuario no existe |
| 409 | Ya se sigue a esa persona |

## Estructura
```
src/main/java/com/xclone/backend
├── config        SecurityConfig (rutas públicas/privadas), CorsConfig
├── controller    Rutas HTTP (Auth, User, Tweet, Feed, Follow)
├── service       Reglas de negocio
├── repository    Acceso a la base de datos (Spring Data JPA)
├── entity        Tablas: User, Tweet, Follow
├── dto           Datos que entran y salen por la API
├── security      JwtService, JwtAuthenticationFilter
├── exception     Errores y GlobalExceptionHandler
├── seed          DataSeeder (25 usuarios, 60 tweets)
└── util          PageRequests (paginación)
```
Flujo de una petición: `controller → service → repository → base de datos`.

## Problemas comunes
| Mensaje | Causa y solución |
|---|---|
| `Could not resolve placeholder 'DB_PASSWORD'` | Falta el archivo `.env` o la contraseña. Ejecuta desde la carpeta `backend`. |
| `Login failed for user 'sa'` | Contraseña incorrecta, o `sa` deshabilitado / modo mixto sin activar. |
| `The TCP/IP connection to the host localhost, port 1433 has failed` | Activa TCP/IP y el puerto 1433 en SQL Server Configuration Manager y reinicia el servicio. |
| `Cannot open database "xclone"` | No has creado la base de datos (paso 2). |
| `Port 8080 was already in use` | Cierra el otro programa o cambia `server.port` en `application.properties`. |
