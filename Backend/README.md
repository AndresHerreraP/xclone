# Backend de ClonX

API de ClonX hecha con Java 25 LTS, Spring Boot, SQL Server y JWT.

## Antes de ejecutar

1. Comprueba que SQL Server esté iniciado y acepte conexiones en el puerto `1433`.
2. Desde SQL Server Management Studio ejecuta:

   ```text
   database\create-xclone.sql
   ```

3. Para cargar los usuarios y publicaciones de prueba ejecuta:

   ```text
   database\seed-demo-data.sql
   ```

Los scripts se pueden ejecutar más de una vez. Revisan si los datos ya existen antes de insertarlos.

## Ejecutar el backend

La configuración predeterminada usa la autenticación integrada de Windows y la base `xclone`. No hace falta escribir una contraseña.

```powershell
cd C:\Users\AndresH\Documents\xclone\backend
mvn spring-boot:run
```

La API queda disponible en `http://localhost:8080`. Para comprobarla:

```text
http://localhost:8080/api/health
```

Debe responder:

```json
{"status":"ok"}
```

Si se ejecuta el JAR directamente, hay que indicar la carpeta de la DLL nativa:

```powershell
java "-Djava.library.path=native-auth" -jar target\clon-x-backend-0.0.1-SNAPSHOT.jar
```

## Inicio de sesión

ClonX no tiene registro público. El usuario solicita un código con su nombre de usuario o correo y lo usa para iniciar sesión:

```text
POST /api/auth/request-code
POST /api/auth/login
```

`/api/auth/request-code` genera un código temporal de un solo uso. En este proyecto local el código se devuelve en la respuesta para poder probar el flujo; en producción debe enviarse por correo o SMS. `/api/auth/login` valida ese código y devuelve un JWT.

## Endpoints principales

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/health` | Comprobar el estado del backend |
| `GET` | `/api/users?query=laura` | Buscar usuarios |
| `GET` | `/api/users/me` | Consultar el usuario autenticado`
| `GET` | `/api/trends` | Calcular tendencias desde publicaciones reales
| `GET` | `/api/notifications` | Consultar notificaciones de seguimiento
| `GET` | `/api/users/{username}` | Consultar un perfil |
| `GET` | `/api/users/{username}/tweets` | Consultar publicaciones de un usuario |
| `GET` | `/api/users/{username}/followers` | Consultar sus seguidores |
| `GET` | `/api/users/{username}/following` | Consultar sus seguidos |
| `GET` | `/api/feed` | Cargar el feed |
| `POST` | `/api/tweets` | Publicar un tweet |
| `POST` | `/api/tweets/{id}/like` | Dar o quitar me gusta |
| `POST` | `/api/tweets/{id}/repost` | Republicar o quitar la republicación |
| `POST` | `/api/follows` | Seguir a un usuario |
| `DELETE` | `/api/follows/{username}` | Dejar de seguirlo |

Salvo los endpoints de autenticación y salud, las solicitudes necesitan el encabezado:

```text
Authorization: Bearer <token>
```

Las tendencias se calculan contando palabras de los tweets guardados en SQL
Server. Los me gusta y las republicaciones se guardan en las tablas `likes` y
`reposts`, cada par usuario-tweet es único y las respuestas todavía no existen
en el esquema, así que el botón de responder sigue sin acción. Las
notificaciones actuales representan seguimientos guardados en la tabla
`follows`.

## Frontend

El frontend está en `frontend\ClonX`. Para ejecutarlo:

```powershell
cd C:\Users\AndresH\Documents\xclone\frontend\ClonX
npm install
npm run dev
```

La aplicación usa el backend de `http://localhost:8080` por defecto.
