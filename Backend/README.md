# Backend de ClonX

API de ClonX hecha con Java 17, Spring Boot, SQL Server y JWT.

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

ClonX no tiene registro público. El usuario inicia sesión con su nombre de usuario o correo y la contraseña de una cuenta existente:

```text
POST /api/auth/login
```

La contraseña se compara con BCrypt y, si es correcta, el backend devuelve un JWT.

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
| `POST` | `/api/follows` | Seguir a un usuario |
| `DELETE` | `/api/follows/{username}` | Dejar de seguirlo |

Salvo los endpoints de autenticación y salud, las solicitudes necesitan el encabezado:

```text
Authorization: Bearer <token>
```

Las tendencias se calculan contando palabras de los tweets guardados en SQL
Server. Las notificaciones actuales representan seguimientos guardados en la
tabla `follows`; no se muestran likes o respuestas inventados porque esas
relaciones no existen en el esquema actual.

## Frontend

El frontend está en `frontend\ClonX`. Para ejecutarlo:

```powershell
cd C:\Users\AndresH\Documents\xclone\frontend\ClonX
npm install
npm run dev
```

La aplicación usa el backend de `http://localhost:8080` por defecto.
