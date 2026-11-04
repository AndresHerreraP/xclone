# Frontend de ClonX

Aplicación de una sola página construida con React y Vite. El frontend se comunica con la API del proyecto por HTTP y no accede directamente a SQL Server.

## Instalación

```powershell
cd C:\Users\AndresH\Documents\xclone\frontend\ClonX
npm install
```

## Comandos

```powershell
npm run dev
npm run lint
npm run build
npm run e2e
```

`npm run e2e` requiere que el backend esté disponible en el puerto `8080` y que el servidor de Vite esté activo.

## Configuración

Copia `.env.example` a `.env` si necesitas cambiar la URL de la API:

```text
VITE_API_URL=http://localhost:8080
```

## Pantallas

- `/login`: acceso mediante usuario o correo y contraseña.
- `- `/feed`: publicaciones, compositor de tweets y panel lateral.
- `/search`: búsqueda de usuarios, tendencias y cuentas sugeridas.
- `/notifications`: notificaciones de seguidores, likes y respuestas.
- `/users/:username`: perfil y publicaciones de un usuario.
- `/users/:username/followers`: lista paginada de seguidores.
- `/users/:username/following`: lista paginada de seguidos.

Las pantallas protegidas redirigen a `/login` si no existe un token válido.

## Organización del código

```text
src/
├── components/     Elementos reutilizables
├── pages/          Pantallas completas
├── services/       Llamadas HTTP a la API
├── styles/         Estilos globales
└── utils/          Funciones auxiliares
```

Las páginas no construyen peticiones directamente. Las llamadas pasan por los servicios de `src/services/`, y `apiClient.js` agrega el token Bearer y maneja las respuestas 401.

## Servicios principales

- `authService.js`: inicio de sesión y sesión local.
- `users.js`: perfiles, búsqueda y listas de seguidores.
- `tweets.js`: feed, publicaciones y tweets de perfil.
- `social.js`: seguir y dejar de seguir.
- `apiClient.js`: cliente HTTP común.
