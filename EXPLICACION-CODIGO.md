# ClonX: explicación organizada del código

Este documento explica el proyecto desde el inicio de la aplicación hasta el login, la seguridad, la base de datos y las funciones sociales.

## 1. Mapa general del proyecto

```text
xclone/
├── backend/
│   └── src/main/java/com/clonx/
│       ├── ClonXBackendApplication.java
│       ├── controller/ApiController.java
│       ├── config/SecurityConfig.java
│       ├── config/SeedData.java
│       ├── model/
│       ├── repository/
│       └── security/
└── frontend/ClonX/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── pages/
        ├── components/
        ├── services/
        └── styles/index.css
```

## 2. Flujo completo de la aplicación

### Arranque

1. `main.jsx` monta React.
2. `App.jsx` registra las rutas.
3. Spring Boot ejecuta `ClonXBackendApplication`.
4. El backend conecta con SQL Server y publica la API en el puerto `8080`.

### Login sin contraseña

```text
Usuario/correo
      │
      ▼
POST /api/auth/request-code
      │
      ▼
Código temporal de seis dígitos
      │
      ▼
POST /api/auth/login
      │
      ▼
JWT + usuario
      │
      ▼
localStorage y redirección a /feed
```

El proyecto no usa contraseña en la pantalla ni en el endpoint de login. El código expira en diez minutos y se elimina después de utilizarse.

## 3. Backend: cómo está organizado

### 3.1 Punto de entrada

Archivo: `backend/src/main/java/com/clonx/ClonXBackendApplication.java`

```java
package com.clonx;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClonXBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClonXBackendApplication.class, args);
    }
}
```

| Código | Función |
|---|---|
| `package com.clonx;` | Coloca la clase en el paquete raíz del proyecto. |
| `import SpringApplication` | Permite iniciar Spring Boot. |
| `import SpringBootApplication` | Importa la anotación principal de Spring. |
| `@SpringBootApplication` | Activa autoconfiguración, componentes y configuración Spring. |
| `public class ...` | Declara la clase principal. |
| `main(String[] args)` | Es el punto de entrada de Java. |
| `SpringApplication.run(...)` | Inicia el servidor, controladores, seguridad y conexión JPA. |

### 3.2 Controlador de la API

Archivo: `backend/src/main/java/com/clonx/controller/ApiController.java`

#### Dependencias y estado

| Código | Función |
|---|---|
| `@RestController` | Convierte la clase en un controlador REST que devuelve JSON. |
| `@RequestMapping("/api")` | Añade `/api` al inicio de cada ruta. |
| `UserRepository users` | Busca y guarda usuarios. |
| `TweetRepository tweets` | Busca y guarda publicaciones. |
| `FollowRepository follows` | Administra seguidores y seguidos. |
| `JwtService jwtService` | Crea y valida tokens JWT. |
| `loginCodes` | Guarda temporalmente el código de cada usuario. |
| `SecureRandom random` | Genera códigos aleatorios. |

#### Modelos de entrada

| Código | Función |
|---|---|
| `record Login(...)` | Representa el identificador y código del login. |
| `record CodeRequest(...)` | Representa la solicitud de un nuevo código. |
| `record LoginCode(...)` | Guarda el código y su fecha de expiración. |
| `@NotBlank` | Rechaza valores vacíos. |
| `@Valid` | Activa las validaciones del objeto recibido. |

#### Endpoint de salud

```java
@GetMapping("/health")
Map<String, String> health() {
    return Map.of("status", "ok");
}
```

- `@GetMapping("/health")` responde a `GET /api/health`.
- `health()` es el método ejecutado.
- `Map.of(...)` devuelve JSON:

```json
{"status":"ok"}
```

#### Solicitud del código

```java
@PostMapping("/auth/request-code")
ResponseEntity<Map<String, String>> requestCode(
        @Valid @RequestBody CodeRequest input) {
    AppUser user = findUser(input.identifier());
    String code = String.format("%06d", random.nextInt(1_000_000));
    loginCodes.put(
        user.getUsername().toLowerCase(Locale.ROOT),
        new LoginCode(code, Instant.now().plusSeconds(600))
    );
    return ResponseEntity.ok(
        Map.of("message", "Código enviado.", "code", code)
    );
}
```

| Línea o bloque | Función |
|---|---|
| `@PostMapping(...)` | Expone `POST /api/auth/request-code`. |
| `@RequestBody` | Convierte el JSON recibido en `CodeRequest`. |
| `findUser(...)` | Busca por username o correo. |
| `random.nextInt(...)` | Genera un número entre 0 y 999999. |
| `String.format("%06d", ...)` | Lo convierte siempre en seis dígitos. |
| `plusSeconds(600)` | Hace que el código expire en 600 segundos. |
| `loginCodes.put(...)` | Guarda o reemplaza el código pendiente. |
| `ResponseEntity.ok(...)` | Devuelve respuesta HTTP 200. |

> En desarrollo local el código se devuelve en la respuesta para poder probarlo. En producción debe enviarse por correo o SMS.

#### Login con código

```java
@PostMapping("/auth/login")
ResponseEntity<Map<String, Object>> login(
        @Valid @RequestBody Login input) {
    AppUser user = findUser(input.identifier());
    String key = user.getUsername().toLowerCase(Locale.ROOT);
    LoginCode loginCode = loginCodes.get(key);

    if (loginCode == null
            || loginCode.expiresAt().isBefore(Instant.now())
            || !loginCode.code().equals(input.code().trim())) {
        throw new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Código inválido o expirado."
        );
    }

    loginCodes.remove(key);
    return ResponseEntity.ok(Map.of(
        "token", jwtService.create(user.getUsername()),
        "user", userDto(user, null)
    ));
}
```

| Línea o bloque | Función |
|---|---|
| `@PostMapping("/auth/login")` | Expone `POST /api/auth/login`. |
| `findUser(...)` | Identifica al usuario. |
| `loginCodes.get(key)` | Recupera su código pendiente. |
| `loginCode == null` | Rechaza si nunca pidió código. |
| `isBefore(Instant.now())` | Rechaza si ya expiró. |
| `!equals(...)` | Rechaza si el código no coincide. |
| `ResponseStatusException` | Devuelve HTTP 401 con mensaje claro. |
| `loginCodes.remove(key)` | Impide reutilizar el código. |
| `jwtService.create(...)` | Genera el token de sesión. |
| `userDto(...)` | Devuelve datos públicos del usuario. |

#### Endpoints sociales

| Endpoint | Función |
|---|---|
| `GET /api/users/me` | Devuelve el usuario autenticado. |
| `GET /api/feed` | Devuelve publicaciones paginadas. |
| `POST /api/tweets` | Crea una publicación. |
| `GET /api/users` | Busca usuarios. |
| `GET /api/users/{username}` | Devuelve un perfil. |
| `GET /api/trends` | Calcula tendencias. |
| `GET /api/notifications` | Devuelve notificaciones. |
| `POST /api/follows` | Sigue a otro usuario. |
| `DELETE /api/follows/{username}` | Deja de seguir. |

Los endpoints protegidos reciben el usuario desde `Authentication`, que fue creado por el filtro JWT.

### 3.3 Seguridad

#### `SecurityConfig.java`

| Configuración | Función |
|---|---|
| `@Configuration` | Registra la configuración como componente Spring. |
| `csrf(...disable())` | Desactiva CSRF para esta API stateless. |
| `cors(...)` | Permite llamadas desde el frontend local. |
| `SessionCreationPolicy.STATELESS` | No guarda sesiones tradicionales. |
| `permitAll()` | Hace públicos login, solicitud de código, salud y errores. |
| `authenticated()` | Exige JWT en las demás rutas. |
| `addFilterBefore(...)` | Ejecuta `JwtFilter` antes de los filtros estándar. |

#### `JwtFilter.java`

1. Lee `Authorization`.
2. Comprueba que empiece por `Bearer `.
3. Extrae el token quitando los primeros siete caracteres.
4. Comprueba firma y expiración con `JwtService`.
5. Obtiene el username.
6. Busca si el usuario sigue existiendo.
7. Guarda la autenticación en `SecurityContextHolder`.
8. Continúa la petición con `chain.doFilter`.

#### `JwtService.java`

- `create` firma un JWT con el username.
- `valid` verifica firma y expiración.
- `username` lee el sujeto del token.
- El secreto se obtiene de `JWT_SECRET`.

### 3.4 Modelos y repositorios

| Archivo | Función |
|---|---|
| `AppUser.java` | Mapea la tabla `users`. |
| `Tweet.java` | Mapea publicaciones y su autor. |
| `Follow.java` | Mapea relaciones entre usuarios. |
| `UserRepository.java` | Consultas de usuarios. |
| `TweetRepository.java` | Consultas paginadas de tweets. |
| `FollowRepository.java` | Consultas de seguidores y seguidos. |

Anotaciones principales:

- `@Entity`: la clase representa una tabla.
- `@Table`: indica el nombre de la tabla.
- `@Id`: identifica la fila.
- `@GeneratedValue`: genera el ID automáticamente.
- `@ManyToOne`: relaciona una fila con otro usuario.
- `Pageable`: permite paginar resultados.

### 3.5 Configuración y datos iniciales

#### `application.properties`

| Propiedad | Función |
|---|---|
| `server.port=8080` | Publica el backend en el puerto 8080. |
| `spring.datasource.url` | Define la conexión a SQL Server. |
| `spring.jpa.hibernate.ddl-auto=validate` | Comprueba que el esquema exista. |
| `app.jwt.secret` | Configura la clave para firmar JWT. |

#### `SeedData.java`

1. Spring ejecuta el `CommandLineRunner` al arrancar.
2. Busca usuarios demo.
3. Crea los que no existan.
4. Inserta publicaciones demo.
5. Inserta relaciones de seguimiento.
6. Comprueba existencia para no duplicar datos.

## 4. Frontend: cómo está organizado

### 4.1 Arranque y rutas

#### `main.jsx`

| Código | Función |
|---|---|
| `createRoot(...)` | Crea la raíz React. |
| `BrowserRouter` | Permite navegación con URLs. |
| `App` | Carga las rutas de la aplicación. |
| Import de CSS | Carga estilos globales y Bootstrap. |

#### `App.jsx`

| Ruta | Componente | Acceso |
|---|---|---|
| `/login` | `Login` | Público |
| `/feed` | `Feed` | Protegido |
| `/search` | `Search` | Protegido |
| `/notifications` | `Notifications` | Protegido |
| `/users/:username` | `Profile` | Protegido |
| `*` | `Navigate` | Redirige a login |

`ProtectedRoute` comprueba si existe token antes de mostrar las rutas privadas.

### 4.2 `pages/Login.jsx`

| Código | Función |
|---|---|
| `useState` | Guarda usuario, código, errores y carga. |
| `useNavigate` | Permite ir a `/feed`. |
| `handleSubmit` | Procesa el segundo paso del login. |
| `preventDefault()` | Evita recargar el navegador. |
| `setLoading(true)` | Desactiva acciones mientras espera. |
| `login({ identifier, code })` | Envía el código al backend. |
| `navigate("/feed")` | Redirige tras login correcto. |
| `catch` | Muestra errores de red o validación. |
| `<EmailLoginForm />` | Renderiza el formulario. |
| `<Divider />` | Renderiza el separador. |
| `login-right` | Renderiza el logo lateral. |

### 4.3 `components/EmailLoginForm.jsx`

1. Recibe valores y callbacks desde `Login`.
2. Renderiza el campo de correo o usuario.
3. Si no hay código solicitado, muestra `Enviar código`.
4. Solicita el código con `requestLoginCode`.
5. Si la solicitud funciona, muestra `Código de acceso`.
6. El botón `Iniciar sesión` ejecuta `onSubmit`.
7. No contiene ningún campo de contraseña.

### 4.4 `services/authService.js`

| Función | Función |
|---|---|
| `API_URL` | Selecciona la URL del backend. |
| `parseResponse` | Procesa JSON y errores HTTP. |
| `requestLoginCode` | Solicita el código temporal. |
| `login` | Intercambia código por JWT. |
| `getToken` | Recupera el JWT guardado. |
| `getStoredUser` | Recupera el usuario guardado. |
| `clearSession` | Borra la sesión local. |

### 4.5 `services/apiClient.js`

1. Recibe método, ruta y datos.
2. Obtiene el token con `getToken`.
3. Añade `Authorization: Bearer <JWT>`.
4. Envía la petición con `fetch`.
5. Convierte la respuesta JSON.
6. Si el token dejó de ser válido, limpia la sesión.

### 4.6 Páginas y componentes

| Archivo | Responsabilidad |
|---|---|
| `Feed.jsx` | Feed, composición y tendencias. |
| `Profile.jsx` | Perfil y publicaciones de usuario. |
| `Search.jsx` | Búsqueda de usuarios. |
| `FollowList.jsx` | Seguidores o seguidos. |
| `Notifications.jsx` | Notificaciones. |
| `Header.jsx` | Navegación y sesión actual. |
| `TweetComposer.jsx` | Formulario para publicar. |
| `TweetItem.jsx` | Tarjeta de publicación. |
| `UserList.jsx` | Lista y acciones sobre usuarios. |
| `FollowForm.jsx` | Formulario para seguir. |
| `Pagination.jsx` | Controles de paginación. |
| `Trends.jsx` | Lista de tendencias. |
| `Button.jsx` | Botón reutilizable. |
| `Divider.jsx` | Separador visual. |

### 4.7 `styles/index.css`

- Define el fondo oscuro y colores globales.
- Estiliza inputs, botones, formularios y separadores.
- Organiza columnas del login.
- Organiza sidebar, feed y panel derecho.
- Las media queries adaptan la aplicación a pantallas pequeñas.

## 5. Qué ocurre en una petición protegida

```text
React
  │ fetch + Authorization: Bearer JWT
  ▼
Spring Security
  │ JwtFilter valida token
  ▼
ApiController
  │ consulta repositorio
  ▼
SQL Server
  │ devuelve datos
  ▼
JSON → React
```

## 6. Ejecución local

### Backend

```powershell
cd C:\Users\AndresH\Documents\xclone\backend
mvn spring-boot:run
```

Comprobación:

```text
GET http://localhost:8080/api/health
```

Respuesta esperada:

```json
{"status":"ok"}
```

### Frontend

```powershell
cd C:\Users\AndresH\Documents\xclone\frontend\ClonX
npm run dev
```

## 7. Nota de producción

El código se devuelve actualmente en la respuesta de `request-code` porque es un proyecto local de demostración. En producción debe enviarse mediante correo, SMS o un proveedor de autenticación y nunca exponerse en JSON.
