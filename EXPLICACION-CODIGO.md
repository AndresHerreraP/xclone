# ClonX explicado línea por línea

Este documento sigue el código en el mismo orden en que aparece. Primero se explica el flujo general y después cada archivo importante.

## 1. Qué ocurre cuando una persona inicia sesión

```text
1. El navegador abre /login.
2. React muestra Login.jsx.
3. La persona escribe usuario o correo.
4. El frontend llama POST /api/auth/request-code.
5. Si la cuenta no existe, el frontend pide nombre, username y correo para crearla.
6. El backend genera un código de seis dígitos.
7. La misma caja de texto cambia para recibir el código.
8. El frontend llama POST /api/auth/login.
9. El backend valida el código y crea un JWT.
10. El frontend guarda el JWT y abre /feed.
11. En las siguientes peticiones, el JWT identifica al usuario.
```

No existe campo de contraseña. El código temporal es la única credencial del login.

---

## 2. Frontend

### 2.1 `src/main.jsx`

| Línea | Código | Qué significa |
|---:|---|---|
| 1 | `import React from 'react'` | Importa React. |
| 2 | `import ReactDOM from 'react-dom/client'` | Importa la función que conecta React con el HTML. |
| 3 | `import { BrowserRouter } from 'react-router-dom'` | Importa el sistema de navegación del frontend. |
| 4 | `import { App } from './App.jsx'` | Importa el componente principal de la aplicación. |
| 5 | `import 'bootstrap/dist/css/bootstrap.min.css'` | Carga las clases visuales de Bootstrap. |
| 6 | `import 'bootstrap-icons/font/bootstrap-icons.css'` | Carga los iconos de Bootstrap. |
| 7 | `import './styles/index.css'` | Carga los estilos propios de ClonX. |
| 9 | `ReactDOM.createRoot(...)` | Busca el elemento HTML llamado `root` y prepara React dentro de él. |
| 10 | `document.getElementById('root')` | Busca `<div id="root">` en `index.html`. |
| 10 | `.render(...)` | Indica qué componentes se deben dibujar. |
| 11 | `<React.StrictMode>` | Activa comprobaciones adicionales durante desarrollo. |
| 12 | `<BrowserRouter>` | Permite cambiar de URL sin recargar toda la página. |
| 13 | `<App />` | Dibuja las rutas y pantallas de la aplicación. |
| 14 | `</BrowserRouter>` | Cierra el componente de navegación. |
| 15 | `</React.StrictMode>` | Cierra el modo estricto. |

### 2.2 `src/App.jsx`

| Línea | Código | Qué significa |
|---:|---|---|
| 2 | `import { Navigate, Route, Routes } ...` | Importa los componentes para definir rutas. |
| 3 | `import { Feed } ...` | Importa la pantalla principal después del login. |
| 4 | `import { Login } ...` | Importa la pantalla de acceso. |
| 5 | `import { ProtectedRoute } ...` | Importa el guardia que exige un JWT. |
| 6-9 | Imports de `Profile`, `FollowList`, `Search`, `Notifications` | Importan las demás pantallas. |
| 11 | `export function App()` | Declara el componente principal. |
| 12 | `return (` | Comienza el HTML que React va a dibujar. |
| 13 | `<Routes>` | Agrupa todas las rutas. |
| 14 | `<Route path="/login" ... />` | Si la URL es `/login`, muestra `Login`. |
| 15 | `<Route element={<ProtectedRoute />}>` | Las rutas siguientes quedan protegidas. |
| 16 | `path="/feed"` | Muestra el feed. |
| 17 | `path="/search"` | Muestra la búsqueda. |
| 18 | `path="/notifications"` | Muestra notificaciones. |
| 19 | `path="/users/:username"` | Muestra un perfil; `:username` es variable. |
| 20 | `followers` | Muestra seguidores del usuario. |
| 21 | `following` | Muestra las cuentas seguidas. |
| 23 | `path="*"` | Captura cualquier URL que no exista. |
| 23 | `<Navigate to="/login" replace />` | Redirige las URL desconocidas al login. |
| 24-26 | Cierres de `Routes`, `return` y función | Terminan la definición de rutas y el componente. |

### 2.3 `src/pages/Login.jsx`

#### Imports y estado

| Línea | Código | Qué significa |
|---:|---|---|
| 1 | `import { useState } from "react";` | Importa `useState`, que guarda datos que cambian en pantalla. |
| 2 | `import { useNavigate } ...` | Importa la función para navegar a otra ruta. |
| 3 | `import { Divider } ...` | Importa el separador visual. |
| 4 | `import { EmailLoginForm } ...` | Importa el formulario de login. |
| 5 | `import { login } ...` | Importa la petición que valida el código. |
| 7 | `export function Login()` | Declara la pantalla de login. |
| 8 | `const navigate = useNavigate();` | Guarda una función para cambiar de `/login` a `/feed`. |
| 9 | `useState("")` para `identifier` | Guarda el correo o nombre de usuario. |
| 10 | `useState("")` para `code` | Guarda el código escrito. |
| 11 | `useState(false)` para `codeRequested` | Indica si ya se pidió un código. |
| 12 | `useState("")` para `error` | Guarda el mensaje de error visible. |
| 13 | `useState(false)` para `loading` | Indica que una petición está en curso. |

#### Envío del login

| Línea | Código | Qué significa |
|---:|---|---|
| 15 | `async function handleSubmit(event)` | Define una función asíncrona para enviar el código. |
| 16 | `event.preventDefault();` | Evita que el formulario recargue la página. |
| 17 | `setLoading(true);` | Desactiva botones mientras espera respuesta. |
| 18 | `setError("");` | Borra errores anteriores. |
| 19 | `try {` | Comienza el bloque que puede fallar. |
| 20 | `await login({ identifier, code });` | Envía usuario y código al backend y espera la respuesta. |
| 21 | `navigate("/feed");` | Si todo funciona, abre el feed. |
| 22 | `catch (loginError) {` | Captura errores HTTP o de conexión. |
| 23 | `setError(loginError.message);` | Muestra el texto del error. |
| 24 | `finally {` | Se ejecuta tanto si funciona como si falla. |
| 25 | `setLoading(false);` | Reactiva los botones. |

#### HTML de la pantalla

| Línea o bloque | Qué significa |
|---|---|
| `<main className="login-page">` | Contenedor principal de la pantalla. |
| `container-fluid` | Usa todo el ancho disponible. |
| `row min-vh-100` | Crea una fila con altura mínima de toda la pantalla. |
| `col-12 col-md-6 login-left` | Columna izquierda: ocupa todo en móvil y la mitad desde tamaño medio. |
| `<h1>...` | Muestra el título original en tres líneas. |
| Texto `Escribe tu correo...` | Explica que se recibe un código, no una contraseña. |
| `<EmailLoginForm ... />` | Pasa el estado y las funciones al formulario. |
| `onIdentifierChange` | Actualiza `identifier` cuando se escribe. |
| `onCodeChange` | Actualiza `code` cuando se escribe. |
| `onCodeRequested` | Cambia `codeRequested` a `true`. |
| `onError` | Permite que el formulario envíe errores al padre. |
| `onSubmit={handleSubmit}` | Conecta el botón final con `handleSubmit`. |
| `<Divider />` | Dibuja el separador. |
| `login-right` e `<img>` | Muestran el logo en la columna derecha. |

### 2.4 `src/components/EmailLoginForm.jsx`

| Línea o bloque | Qué significa |
|---|---|
| Import de `Button` | Usa el botón reutilizable del proyecto. |
| Import de `requestLoginCode` | Importa la función que pide el código al backend. |
| Props de `EmailLoginForm` | Recibe valores y funciones desde `Login.jsx`. |
| `handleRequestCode()` | Define qué ocurre al pulsar `Enviar código`. |
| `await requestLoginCode(identifier)` | Envía el usuario/correo y espera respuesta. |
| `onCodeRequested()` | Muestra el segundo paso cuando la respuesta es correcta. |
| `catch (requestError)` | Captura un fallo al pedir código. |
| `onError(requestError.message)` | Muestra ese fallo en el formulario. |
| `<form onSubmit={onSubmit}>` | Usa la función final que recibió de `Login`. |
| Input `identifier` | Campo para correo o username. |
| `value={identifier}` | El valor visible viene del estado del padre. |
| `onChange={onIdentifierChange}` | Cada tecla actualiza el estado. |
| `required` | Impide enviar el formulario vacío. |
| `!codeRequested ? (...) : (...)` | Elige entre el primer y segundo paso. |
| Botón `Enviar código` | Ejecuta `handleRequestCode`; no envía login todavía. |
| `disabled={loading || !identifier.trim()}` | Se desactiva mientras carga o si no hay usuario. |
| `inputMode="numeric"` | Sugiere teclado numérico en móvil. |
| `autoComplete="one-time-code"` | Permite autocompletar códigos recibidos. |
| `value={code}` | Muestra el código guardado en el estado. |
| `onChange={onCodeChange}` | Actualiza el código al escribir. |
| Botón `Iniciar sesión` | Envía el formulario al backend. |
| `disabled={... || !code.trim()}` | No permite login sin código. |
| `{error && ...}` | Solo muestra el error cuando existe. |

### 2.5 `src/services/authService.js`

| Línea o bloque | Qué significa |
|---|---|
| `API_URL` | Usa `VITE_API_URL`; si no existe, usa `localhost:8080`. |
| `TOKEN_KEY` | Nombre donde se guarda el JWT. |
| `USER_KEY` | Nombre donde se guarda el usuario. |
| `parseResponse(response)` | Convierte la respuesta HTTP en objeto JavaScript. |
| `response.json().catch(() => ({}))` | Intenta leer JSON; si no hay JSON, usa objeto vacío. |
| `if (!response.ok)` | Detecta códigos HTTP 400/401/500. |
| `throw new Error(...)` | Convierte el error del backend en excepción. |
| `requestLoginCode(identifier)` | Solicita un código temporal. |
| `fetch(...request-code)` | Hace `POST /api/auth/request-code`. |
| `method: "POST"` | Indica que se envían datos. |
| `Content-Type` | Informa que el cuerpo es JSON. |
| `JSON.stringify(...)` | Convierte el objeto JavaScript a texto JSON. |
| `parseResponse(response)` | Comprueba si la solicitud fue correcta. |
| `error instanceof TypeError` | Detecta que el servidor no sea accesible. |
| `login({ identifier, code })` | Intercambia el código por una sesión. |
| `fetch(...auth/login)` | Hace `POST /api/auth/login`. |
| `!data.token || !data.user` | Rechaza una respuesta sin JWT o usuario. |
| `localStorage.setItem(...)` | Guarda sesión en el navegador. |
| `getToken()` | Recupera el JWT guardado. |
| `getStoredUser()` | Recupera y convierte el usuario guardado. |
| `clearSession()` | Borra JWT y usuario del navegador. |

### 2.6 `src/components/ProtectedRoute.jsx` y `src/services/apiClient.js`

1. `ProtectedRoute` llama a `getToken()`.
2. Si no encuentra token, devuelve `<Navigate to="/login" />`.
3. Si encuentra token, devuelve `<Outlet />`.
4. `apiClient` obtiene el mismo token.
5. Lo envía como `Authorization: Bearer <token>`.
6. El backend usa ese token para saber quién hace la petición.

### 2.7 Resto del frontend

| Archivo | Qué hace cada parte |
|---|---|
| `Feed.jsx` | Carga publicaciones, tendencias y permite publicar. |
| `Profile.jsx` | Carga datos y tweets de un usuario. |
| `Search.jsx` | Envía consultas de búsqueda. |
| `FollowList.jsx` | Carga seguidores o seguidos según `type`. |
| `Notifications.jsx` | Carga notificaciones paginadas. |
| `Header.jsx` | Muestra navegación y usuario actual. |
| `TweetComposer.jsx` | Controla el texto y llama al endpoint de tweets. |
| `TweetItem.jsx` | Presenta una publicación y su autor. |
| `UserList.jsx` | Presenta usuarios y acciones de seguimiento. |
| `FollowForm.jsx` | Envía un username al endpoint de follow. |
| `Pagination.jsx` | Cambia `page` y vuelve a cargar información. |
| `Trends.jsx` | Presenta las tendencias recibidas. |
| `Button.jsx` | Recibe `text`, `type`, `onClick` y `disabled`, y crea un `<button>`. |
| `Divider.jsx` | Dibuja las líneas y el texto central. |
| `LoginSocial.jsx` | Es un botón visual reutilizable para proveedores sociales. |

### 2.8 `src/styles/index.css`

- `body` define el fondo negro global.
- `h1` define color, tamaño y peso del título original.
- `.btn` define botones redondeados.
- `.input-x` define inputs oscuros y bordes.
- `.form-floating` posiciona las etiquetas flotantes.
- `.separador-x` crea líneas a ambos lados de `or`.
- `.login-social` define botones de Google, Apple u otros proveedores visuales.
- `.feed-*` define sidebar, publicaciones, tarjetas, tendencias y responsive.
- `@media` cambia el layout en pantallas pequeñas.

---

## 3. Backend

### 3.1 `ClonXBackendApplication.java`

| Código | Qué significa |
|---|---|
| `package com.clonx;` | Define el paquete Java. |
| Imports de Spring | Cargan clases necesarias para iniciar la aplicación. |
| `@SpringBootApplication` | Activa la configuración automática de Spring. |
| `public class ...` | Declara la clase principal. |
| `main(String[] args)` | Punto de entrada de la JVM. |
| `SpringApplication.run(...)` | Inicia Tomcat, controladores, seguridad y JPA. |

### 3.2 `ApiController.java`: imports y variables

| Código | Qué significa |
|---|---|
| `@RestController` | Indica que la clase responde peticiones HTTP con JSON. |
| `@RequestMapping("/api")` | Todas las rutas empiezan por `/api`. |
| `UserRepository users` | Acceso a la tabla de usuarios. |
| `TweetRepository tweets` | Acceso a publicaciones. |
| `FollowRepository follows` | Acceso a relaciones sociales. |
| `JwtService jwtService` | Crea los tokens de sesión. |
| `Map<String, LoginCode> loginCodes` | Guarda un código por username. |
| `ConcurrentHashMap` | Permite usar el mapa de forma segura con varias peticiones. |
| `SecureRandom random` | Genera códigos aleatorios. |
| Constructor | Spring inyecta automáticamente las dependencias. |

### 3.3 `ApiController.java`: records de entrada

| Código | Qué significa |
|---|---|
| `record Login(...)` | Cuerpo esperado por `/auth/login`. |
| `@NotBlank String identifier` | El usuario/correo es obligatorio. |
| `@NotBlank String code` | El código es obligatorio. |
| `record CodeRequest(...)` | Cuerpo esperado por `/auth/request-code`. |
| `record LoginCode(...)` | Objeto interno con código y vencimiento. |
| `record TweetInput(...)` | Texto recibido al crear un tweet. |
| `@Size(max=280)` | Limita un tweet a 280 caracteres. |
| `record FollowInput(...)` | Username recibido al seguir. |

### 3.4 `ApiController.java`: endpoints de login

| Código | Qué significa |
|---|---|
| `@GetMapping("/health")` | Expone la comprobación de salud. |
| `Map.of("status","ok")` | Devuelve el JSON de salud. |
| `@PostMapping("/auth/request-code")` | Expone la solicitud de código. |
| `@RequestBody CodeRequest input` | Lee el JSON recibido. |
| `findUser(input.identifier())` | Busca por username o email. |
| `random.nextInt(1_000_000)` | Produce un número de 0 a 999999. |
| `String.format("%06d", ...)` | Lo convierte en seis posiciones. |
| `Instant.now().plusSeconds(600)` | Define vencimiento a diez minutos. |
| `loginCodes.put(...)` | Guarda el código en memoria. |
| `ResponseEntity.ok(...)` | Devuelve HTTP 200 y el código local. |
| `@PostMapping("/auth/login")` | Expone la validación del código. |
| `loginCodes.get(key)` | Recupera el código guardado. |
| `loginCode == null` | Detecta que nunca se solicitó código. |
| `expiresAt().isBefore(...)` | Detecta código expirado. |
| `!code().equals(...)` | Detecta código incorrecto. |
| `ResponseStatusException(UNAUTHORIZED, ...)` | Devuelve HTTP 401. |
| `loginCodes.remove(key)` | Hace que el código sea de un solo uso. |
| `jwtService.create(...)` | Genera el JWT. |
| `userDto(...)` | Devuelve la información pública del usuario. |

### 3.5 `ApiController.java`: búsqueda y endpoints sociales

| Código o método | Qué significa |
|---|---|
| `findUser` | Quita espacios y busca username o email ignorando mayúsculas. |
| `me(Authentication)` | Obtiene el usuario que representa el JWT. |
| `tweet(...)` | Valida y guarda una publicación. |
| `feed(...)` | Busca tweets propios y de cuentas seguidas. |
| `pageable(...)` | Valida página/tamaño y ordena resultados. |
| `users(query, authentication)` | Filtra usuarios por nombre o username. |
| `trends()` | Cuenta palabras frecuentes de los tweets. |
| `notifications(...)` | Busca relaciones que producen notificaciones. |
| `profile(...)` | Devuelve un usuario concreto. |
| `userTweets(...)` | Devuelve tweets de un usuario. |
| `followers(...)` | Devuelve seguidores paginados. |
| `following(...)` | Devuelve cuentas seguidas. |
| `follow(...)` | Crea una relación, evitando seguirse a sí mismo o duplicar. |
| `unfollow(...)` | Elimina exactamente la relación del usuario autenticado con el usuario indicado y confirma que se borró una fila. |
| `current(...)` | Busca la entidad del usuario autenticado. |
| `tweetDto`, `userDto`, `pageDto` | Transforman entidades en JSON de respuesta. |

### 3.6 `SecurityConfig.java`

| Código o concepto | Qué significa |
|---|---|
| `@Configuration` | Registra esta clase en Spring. |
| `SecurityFilterChain` | Define las reglas de seguridad HTTP. |
| `csrf(...disable())` | Desactiva CSRF para esta API con JWT. |
| `cors(...)` | Activa comunicación frontend-backend. |
| `STATELESS` | El backend no guarda sesión de navegador. |
| `OPTIONS permitAll` | Permite solicitudes preliminares CORS. |
| `auth/login permitAll` | Permite iniciar sesión sin JWT. |
| `auth/request-code permitAll` | Permite pedir código sin JWT. |
| `health permitAll` | Permite comprobar disponibilidad. |
| `anyRequest authenticated` | Protege todas las demás rutas. |
| `addFilterBefore(jwtFilter, ...)` | Valida JWT antes del controlador. |

### 3.7 `JwtFilter.java`

1. Lee el encabezado `Authorization`.
2. Comprueba que comience por `Bearer `.
3. Elimina `Bearer ` y conserva solo el token.
4. Llama a `jwt.valid(token)`.
5. Extrae el username con `jwt.username(token)`.
6. Comprueba que el usuario siga en la base de datos.
7. Crea una autenticación Spring con autoridad `USER`.
8. Guarda la autenticación en `SecurityContextHolder`.
9. Continúa la petición con `chain.doFilter`.

### 3.8 `JwtService.java`

| Método o campo | Qué significa |
|---|---|
| Secreto JWT | Clave usada para firmar tokens. |
| Duración | Tiempo durante el que el token es válido. |
| `create(username)` | Crea y firma un token. |
| `valid(token)` | Verifica firma y vencimiento. |
| `username(token)` | Lee el sujeto del token. |

### 3.9 Modelos

| Archivo | Explicación |
|---|---|
| `AppUser.java` | `@Entity` conecta la clase con `users`; `@Id` identifica filas; getters leen datos. |
| `Tweet.java` | Guarda contenido, autor y fecha; `@ManyToOne` conecta con `AppUser`. |
| `Follow.java` | Guarda follower, followed y fecha; conecta dos usuarios. |

### 3.10 Repositorios

| Archivo | Explicación |
|---|---|
| `UserRepository.java` | Spring genera búsquedas como `findByUsernameIgnoreCase`. |
| `TweetRepository.java` | Spring genera consultas de tweets por autor y página. |
| `FollowRepository.java` | Spring genera consultas y borrados de relaciones. |

### 3.11 Configuración y datos

| Archivo | Línea o concepto | Qué significa |
|---|---|---|
| `application.properties` | `server.port=8080` | Puerto del backend. |
| `application.properties` | `spring.datasource.url` | Dirección de SQL Server y base `xclone`. |
| `application.properties` | `ddl-auto=validate` | Comprueba el esquema sin modificarlo. |
| `application.properties` | `app.jwt.secret` | Secreto configurable para JWT. |
| `SeedData.java` | `@Configuration` | Registra carga inicial. |
| `SeedData.java` | `CommandLineRunner` | Ejecuta el seed al iniciar. |
| `SeedData.java` | `users.find...` | Evita usuarios duplicados. |
| `SeedData.java` | `tweets.exists...` | Evita publicaciones duplicadas. |
| `SeedData.java` | `follows.exists...` | Evita relaciones duplicadas. |

---

## 4. Cómo leer cualquier línea de este proyecto

1. **Import**: trae una clase o función de otro archivo.
2. **Variable**: guarda un valor.
3. **Función/método**: agrupa instrucciones reutilizables.
4. **Condición `if`**: decide según una regla.
5. **`return`**: devuelve un valor o una respuesta.
6. **`await`**: espera una operación asíncrona.
7. **Anotación Java `@...`**: indica a Spring cómo tratar una clase o método.
8. **Endpoint**: método Java conectado a una URL HTTP.
9. **Repositorio**: objeto que consulta la base de datos.
10. **Componente React**: función que devuelve HTML usando JSX.

## 5. Ejecución

```powershell
cd C:\Users\AndresH\Documents\xclone\backend
mvn spring-boot:run
```

```powershell
cd C:\Users\AndresH\Documents\xclone\frontend\ClonX
npm run dev
```

Backend:

```text
GET http://localhost:8080/api/health
```

Respuesta correcta:

```json
{"status":"ok"}
```

> El código se devuelve en JSON solo para desarrollo local. En producción debe enviarse por correo o SMS y no exponerse en la respuesta.

## 8. Actualización visual del login

Esta es la implementación actual del flujo:

1. `identifier` guarda el correo o nombre de usuario.
2. `code` guarda el código que la persona escribirá.
3. `generatedCode` guarda el código que el backend devuelve durante el desarrollo local.
4. `codeRequested` indica cuándo debe cambiar el formulario al modo código.
5. El formulario usa **un solo elemento `<input>`**:
   - Antes de pedir el código: muestra “Correo electrónico o nombre de usuario”.
   - Después de pedirlo: muestra “Código de acceso”.
6. El mismo input cambia dinámicamente:
   - `id`: cambia de `identifier` a `code`.
   - `name`: cambia de `identifier` a `code`.
   - `value`: cambia de `identifier` a `code`.
   - `onChange`: cambia al manejador correspondiente.
   - `placeholder` y `label`: cambian al texto del código.
7. Cuando llega la respuesta del backend, `Login.jsx`:
   - limpia el contenido del input con `setCode("")`;
   - guarda el código recibido con `setGeneratedCode(value)`;
   - activa el modo código con `setCodeRequested(true)`.
8. `EmailLoginForm.jsx` muestra debajo del mismo input:

   ```text
   Tu código es: 123456
   ```

9. El botón “Iniciar sesión” envía el valor que la persona escribe en ese mismo input.
10. Si la cuenta no existe, se muestran los campos de nombre completo, username y correo. Después de crearla, el input principal vuelve a cambiar al modo código.

### Diferencia entre el código generado y el código escrito

- `generatedCode`: valor que el backend devuelve y se muestra debajo para pruebas locales.
- `code`: valor que la persona escribe en la caja.
- El login envía `code`, no `generatedCode`, porque así se comprueba que la persona realmente introduzca el código.
