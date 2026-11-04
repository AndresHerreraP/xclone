# ClonX

ClonX es una aplicación web inspirada en X. Tiene un frontend en React y una API en Spring Boot que guarda la información en SQL Server.

## Estructura

```text
xclone/
├── backend/
│   ├── database/
│   ├── native-auth/
│   └── src/
└── frontend/
    └── ClonX/
        ├── public/
        └── src/
```

### Backend

- Java 17
- Spring Boot 3.4.5
- Spring Data JPA
- Spring Security
- JWT
- SQL Server

### Frontend

- React 19
- Vite
- React Router
- Bootstrap y Bootstrap Icons
- JavaScript

## Funcionalidades

- Inicio de sesión con usuario o correo y contraseña protegida con BCrypt.
- Feed con publicaciones propias y de las cuentas seguidas.
- Crear publicaciones de hasta 280 caracteres.
- Acciones debajo de cada publicación: responder, republicar, me gusta y compartir.
- Perfiles con publicaciones, seguidores y seguidos.
- Seguir y dejar de seguir usuarios.
- Listas paginadas de seguidores y seguidos.
- Pantalla de búsqueda y exploración.
- Pantalla de notificaciones.
- Redirección al login cuando la sesión no existe o el token deja de ser válido.

## Preparar la base de datos

La aplicación usa una base llamada `xclone` en SQL Server. Desde SQL Server Management Studio ejecuta, en este orden:

1. `backend\database\create-xclone.sql`
2. `backend\database\seed-demo-data.sql`

El segundo script agrega usuarios, publicaciones y relaciones de demostración. Se puede ejecutar varias veces porque revisa si los registros ya existen.

La configuración predeterminada usa autenticación integrada de Windows y no requiere contraseña:

```text
jdbc:sqlserver://localhost:1433;databaseName=xclone;encrypt=true;trustServerCertificate=true;integratedSecurity=true
```

## Ejecutar el backend

Requisitos: JDK 17, Maven y SQL Server activo.

```powershell
cd C:\Users\AndresH\Documents\xclone\backend
mvn spring-boot:run
```

La API queda en `http://localhost:8080`. Para comprobarla:

```text
GET http://localhost:8080/api/health
```

## Ejecutar el frontend

Requisitos: Node.js y npm.

```powershell
cd C:\Users\AndresH\Documents\xclone\frontend\ClonX
npm install
npm run dev
```

La aplicación queda normalmente en `http://localhost:5173`.

Otros comandos útiles:

```powershell
npm run lint
npm run build
npm run e2e
```

La prueba e2e necesita que el backend y Vite estén ejecutándose.

## Rutas de la aplicación

| Ruta | Pantalla |
|---|---|
| `/login` | Inicio de sesión |
| `/feed` | Feed principal |
| `/search` | Búsqueda y exploración |
| `/notifications` | Notificaciones |
| `/users/:username` | Perfil |
| `/users/:username/followers` | Seguidores |
| `/users/:username/following` | Seguidos |

## API principal

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/users?query=` | Buscar usuarios |
| `GET` | `/api/users/me` | Consultar el usuario autenticado`
| `GET` | `/api/trends` | Calcular tendencias desde publicaciones reales
| `GET` | `/api/notifications` | Consultar notificaciones de seguimiento
| `GET` | `/api/users/{username}` | Consultar perfil |
| `GET` | `/api/feed` | Cargar el feed |
| `POST` | `/api/tweets` | Crear una publicación |
| `POST` | `/api/follows` | Seguir un usuario |
| `DELETE` | `/api/follows/{username}` | Dejar de seguir |

Las rutas protegidas reciben el token así:

```text
Authorization: Bearer <token>
```

## Datos de acceso de demostración

Los usuarios creados por el script pueden solicitar un código usando su nombre de usuario o correo. Algunos ejemplos:

```text
laurag
carlosr
sofiam
juanp
valer
sebastianr
```

El código se muestra en la respuesta porque es un proyecto local de desarrollo; no se debe usar este mecanismo tal cual en producción.
