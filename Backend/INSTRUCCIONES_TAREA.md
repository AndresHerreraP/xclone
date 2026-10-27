# INSTRUCCIONES PARA GLM-5.3 — COMPLETAR CLON DE X SIN IMPLEMENTAR REGISTRO

Actúa como un desarrollador senior especializado en Java Spring Boot, React, JavaScript, SQL Server, seguridad y diseño de aplicaciones web.

Debes completar mi proyecto académico de un clon funcional de X (Twitter), siguiendo los requisitos descritos a continuación. Trabaja sobre el código existente, no generes otro proyecto desde cero.

## 1. REGLAS IMPORTANTES

1. Inspecciona primero todo el proyecto, incluyendo frontend, backend, configuración, dependencias, pantallas, servicios, entidades y base de datos.
2. Antes de modificar archivos, crea una copia de seguridad fechada fuera de las carpetas fuente del proyecto. Comprueba que el archivo de respaldo se pueda leer.
3. Conserva el código existente que funcione. No elimines funcionalidades ni reemplaces archivos completos sin una necesidad justificada.
4. No inventes credenciales, servidores, nombres de instancias SQL Server, tablas existentes ni resultados de pruebas.
5. No afirmes que una base de datos fue creada, que una conexión funcionó o que una prueba pasó si no lo verificaste realmente.
6. No expongas contraseñas, tokens, secretos ni datos sensibles en el código, logs, README o repositorio.
7. Si falta un dato imprescindible para conectarte a SQL Server, identifica exactamente qué falta y solicítalo. Mientras tanto, puedes avanzar con las tareas independientes.
8. Trabaja por etapas, ejecuta las pruebas y corrige los errores antes de continuar.
9. No te limites a generar instrucciones o fragmentos de código: implementa los cambios en los archivos reales del proyecto.
10. Al terminar, entrega un informe de los cambios, archivos afectados, comandos ejecutados, pruebas realizadas y problemas pendientes.

## 2. ALCANCE DEL PROYECTO

Construir un clon funcional de X con:

- Inicio de sesión.
- Sesión autenticada persistente.
- Inicio y feed de publicaciones.
- Publicación de tweets.
- Perfil propio y perfiles públicos.
- Seguimiento de otros usuarios.
- Listas de seguidores y seguidos.
- Paginación real desde el backend.
- Manejo de estados de carga, errores y listas vacías.
- Persistencia real en SQL Server.
- Datos de prueba suficientes para verificar todas las funcionalidades.

### EXCLUSIÓN EXPRESA: NO IMPLEMENTAR EL REGISTRO

No implementes el registro de usuarios en esta tarea.

Esto significa:

- No crear el formulario de registro.
- No crear endpoints de registro.
- No implementar códigos de verificación por correo.
- No implementar envío de correos de registro.
- No implementar contraseñas temporales ni permisos temporales de registro.
- No implementar un flujo de alta de cuentas.
- No modificar ni eliminar las pantallas de registro que ya existan en Figma o en el proyecto, salvo que sea indispensable para evitar que se utilicen en la aplicación.
- No crear cuentas mediante la interfaz.

El inicio de sesión sí debe funcionar. Utiliza cuentas de prueba existentes en SQL Server, con contraseñas de prueba almacenadas mediante hash seguro y credenciales de demostración documentadas localmente de forma segura.

No permitas el acceso a cuentas sin autenticar.

## 3. TECNOLOGÍAS EXISTENTES

Respeta las tecnologías y versiones que ya utiliza el proyecto.

### Backend

- Java 17.
- Spring Boot 3.4.5, si esa sigue siendo la versión existente.
- Maven.
- Spring Web para la API REST.
- Spring Security para autenticación y autorización.
- JDBC/JPA según la arquitectura existente.
- Driver JDBC oficial de Microsoft para SQL Server.
- BCrypt para almacenar contraseñas de prueba de forma segura.
- JWT para manejar sesiones, si es compatible con la implementación existente.

No migres a Node.js, Python, NestJS u otro backend.

### Frontend

- React con Vite.
- JavaScript, no TypeScript.
- React Router DOM.
- `fetch` o Axios, según lo que ya exista.
- Bootstrap y los iconos ya utilizados en el proyecto, conservando su identidad visual.
- No migres a Next.js ni reescribas el frontend con otra tecnología.

### Base de datos

- Microsoft SQL Server.
- Administración mediante SQL Server Management Studio (SSMS).
- Conexión real desde Spring Boot.

No uses Firebase, Supabase ni servicios externos como sustitutos del backend o de la base de datos.

## 4. CONEXIÓN REAL Y CREACIÓN DE SQL SERVER

Esta parte es obligatoria.

Primero inspecciona la configuración existente para identificar si ya hay una conexión configurada y si existe una base de datos del proyecto.

Si tienes acceso al servidor y los permisos necesarios:

1. Comprueba la conectividad real con SQL Server.
2. Identifica el servidor y la instancia a partir de la configuración existente.
3. Comprueba qué base de datos corresponde al proyecto.
4. Si ya existe una base de datos del proyecto, inspecciona su esquema y sus datos antes de modificarla.
5. Si no existe, utiliza `ClonXDB` como nombre propuesto para la nueva base de datos.
6. Crea la base de datos solamente si no existe y tienes permisos.
7. Crea las tablas, claves primarias, claves foráneas, restricciones e índices necesarios.
8. Configura Spring Boot para conectarse a la base de datos real.
9. Ejecuta una consulta de verificación mediante la aplicación.
10. Comprueba que las operaciones de lectura y escritura funcionan realmente.

No elimines ni recrees automáticamente una base de datos existente. No ejecutes `DROP DATABASE`, `DROP TABLE` ni truncamientos de tablas existentes sin autorización expresa.

Si no tienes acceso al servidor, no simules la conexión ni declares que la base de datos está lista. Identifica los datos de conexión faltantes y deja preparada la configuración.

Utiliza variables de entorno para los datos de conexión, adaptando los nombres a la configuración existente. Por ejemplo:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

No escribas credenciales reales en archivos versionados.

Utiliza migraciones versionadas mediante Flyway o el mecanismo de migración que ya esté instalado. Evita que Hibernate elimine o reconstruya el esquema automáticamente.

## 5. MODELO DE DATOS

Implementa las entidades mínimas del proyecto.

### User

- `id`
- `fullName`
- `username`, único
- `email`, único
- `passwordHash`
- `createdAt`

### Tweet

- `id`
- `authorId`
- `content`, máximo 280 caracteres
- `createdAt`

### Follow

- `followerId`
- `followedId`
- `createdAt`

Reglas:

- No puede haber nombres de usuario duplicados.
- No puede haber correos duplicados.
- La combinación `followerId` + `followedId` debe ser única.
- Un usuario no puede seguirse a sí mismo.
- Las relaciones deben utilizar claves foráneas válidas.
- Las fechas deben guardarse y devolverse correctamente.
- Los tweets no pueden estar vacíos ni superar los 280 caracteres.

Puedes añadir índices y restricciones útiles para mantener la integridad de los datos.

No implementes el alta de usuarios desde la aplicación. Los usuarios iniciales se deben cargar mediante el mecanismo de datos de prueba.

## 6. AUTENTICACIÓN Y SEGURIDAD

Implementa el inicio de sesión real.

Endpoint:

`POST /api/auth/login`

Debe aceptar el nombre de usuario y la contraseña, validar las credenciales y devolver un token válido y los datos necesarios del usuario autenticado.

Requisitos:

- Verificar las contraseñas mediante BCrypt.
- No devolver nunca el hash de la contraseña.
- No permitir acceso a endpoints protegidos sin un token válido.
- Validar JWT en el backend.
- Enviar el token desde el frontend mediante:

`Authorization: Bearer <token>`

- Guardar el token en `localStorage`, como solicita el documento del proyecto.
- Mantener la sesión después de recargar la página.
- Al cerrar sesión, eliminar el token y redirigir al usuario a la pantalla de inicio de sesión.
- Las rutas internas deben estar protegidas.
- Si el token es inválido o ha expirado, manejar la sesión de manera segura y pedir que el usuario vuelva a iniciar sesión.
- No guardar contraseñas en texto plano.
- No crear una ruta alternativa que permita saltarse la autenticación.

Las cuentas de demostración deben tener credenciales verificables y documentadas para el entorno local de pruebas. No reutilices contraseñas personales.

## 7. ENDPOINTS REST OBLIGATORIOS, EXCEPTO REGISTRO

Implementa y prueba los siguientes endpoints. Todos deben responder JSON.

### Autenticación y usuario actual

- `POST /api/auth/login`
- `GET /api/users/me`

El endpoint `/api/users/me` debe devolver los datos del usuario conectado y sus contadores de seguidores y seguidos.

### Perfiles

- `GET /api/users/{username}`

Debe devolver el perfil, los contadores de seguidores y seguidos y un indicador booleano `isFollowing`, calculado según el usuario autenticado.

- `GET /api/users/{username}/tweets?page=1&size=10`

Debe devolver los tweets de ese usuario, del más reciente al más antiguo, con paginación.

### Seguidores y seguidos

- `GET /api/users/{username}/followers?page=1&size=10`
- `GET /api/users/{username}/following?page=1&size=10`

Ambos endpoints deben devolver resultados paginados de 10 elementos por página y ordenados alfabéticamente por nombre completo.

### Publicaciones

- `POST /api/tweets`

Debe publicar un tweet asociado al usuario autenticado. El autor se obtiene del token, no de un `authorId` arbitrario enviado por el frontend.

### Feed

- `GET /api/feed?page=1&size=10`

Debe devolver los tweets del usuario autenticado y de las personas que sigue, ordenados del más reciente al más antiguo.

### Seguimiento

- `POST /api/follows`

Debe permitir seguir a un usuario mediante su nombre de usuario.

Debe rechazar los siguientes casos:

- El usuario destino no existe.
- El usuario intenta seguirse a sí mismo.
- El usuario ya sigue al destino.
- La solicitud no está autenticada.

No implementes el endpoint `/api/auth/register`.

Si necesitas endpoints adicionales para completar una función obligatoria, puedes crearlos y documentarlos.

## 8. PAGINACIÓN

La paginación debe ejecutarse en SQL Server o en la capa de persistencia del backend. Nunca cargues todos los registros para dividirlos únicamente en React.

Las respuestas paginadas deben seguir una estructura estándar similar a esta:

{
  "items": [],
  "page": 1,
  "size": 10,
  "totalItems": 57,
  "totalPages": 6
}

Los valores deben calcularse a partir de los resultados reales.

Requisitos:

- Tamaño de página predeterminado de 10.
- Orden correcto según el endpoint.
- Página actual y total de páginas.
- Validación de los parámetros de paginación.
- Botón "Anterior" deshabilitado en la primera página.
- Botón "Siguiente" deshabilitado en la última página.
- Respuestas coherentes cuando no existen resultados.

## 9. CÓDIGOS HTTP Y ERRORES

Utiliza códigos HTTP coherentes:

- `200 OK` para consultas e inicio de sesión exitosos.
- `201 Created` para creación de recursos, como tweets y relaciones de seguimiento.
- `400 Bad Request` para datos inválidos.
- `401 Unauthorized` cuando falte un token válido o las credenciales sean incorrectas.
- `404 Not Found` cuando el usuario solicitado no exista.
- `409 Conflict` cuando ya exista una relación de seguimiento que se intenta duplicar.

No se necesita implementar el conflicto de registro porque el registro está excluido.

Los errores deben responder un JSON con una propiedad `message`, por ejemplo:

{
  "message": "Tweet cannot be empty"
}

No expongas trazas internas, consultas SQL, credenciales ni información sensible en los mensajes de error.

## 10. FRONTEND: PANTALLAS Y FUNCIONALIDADES

Conserva la apariencia visual existente y usa el archivo de Figma como referencia:

https://www.figma.com/design/NQhsUzeu8ukJ3zrHaoivd4

No rehagas las pantallas desde cero si ya existen. Identifica cuáles están implementadas y cuáles necesitan ajustes.

Implementa las siguientes pantallas y comportamientos:

### A. Inicio de sesión

- Campos de nombre de usuario y contraseña.
- Validación de campos obligatorios.
- Mensajes de error claros.
- Conexión real al endpoint de inicio de sesión.
- Al autenticarse correctamente, guardar el token y mostrar la aplicación.
- No agregar registro ni verificación por correo.

### B. Inicio y feed

- Encabezado común con logotipo o enlace al inicio.
- Usuario autenticado.
- Opción para cerrar sesión.
- Contadores reales de seguidores y seguidos.
- Acceso a la publicación de tweets.
- Feed de publicaciones propias y de los usuarios seguidos.
- Paginación real de 10 elementos.
- Orden cronológico descendente.

### C. Publicar tweet

- Campo de texto multilínea.
- Contador de caracteres restantes de 280.
- Botón "Publicar".
- Rechazo de mensajes vacíos.
- Rechazo de mensajes de más de 280 caracteres.
- Notificación de éxito o error.
- Actualización del feed después de publicar.

### D. Perfil propio

- Nombre completo.
- Nombre de usuario.
- Información del perfil disponible.
- Contadores de seguidores y seguidos.
- Lista de tweets ordenada del más reciente al más antiguo.
- Paginación de 10.
- Enlace a las listas de seguidores y seguidos.
- No mostrar el botón "Seguir" en el propio perfil.

### E. Perfil público

- Consultar los datos reales de cualquier usuario.
- Mostrar sus contadores.
- Mostrar sus tweets con paginación.
- Mostrar el botón "Seguir" solo cuando corresponda.
- No mostrar ese botón en el perfil propio.
- Actualizar el botón y los contadores sin recargar toda la página.
- Permitir acceder a sus listas de seguidores y seguidos.

### F. Lista de seguidos

- Consultar las personas a las que sigue el usuario seleccionado.
- Paginación de 10.
- Orden alfabético por nombre completo.
- Enlace al perfil de cada persona.

### G. Lista de seguidores

- Consultar las personas que siguen al usuario seleccionado.
- Paginación de 10.
- Orden alfabético por nombre completo.
- Botón "Seguir" para las personas a las que el usuario autenticado todavía no sigue.
- Permitir realizar el seguimiento desde la lista.
- Enlace al perfil de cada persona.

### H. Estados de interfaz

Implementa los estados necesarios en las pantallas conectadas a la API:

- Carga.
- Error.
- Lista vacía.
- Reintentar cuando corresponda.
- Notificaciones de éxito o error.
- Deshabilitar botones cuando una operación esté en curso para evitar envíos duplicados.

Ejemplos de mensajes:

- "Aún no sigues a nadie".
- "No se pudo cargar el contenido".
- "Comprueba tu conexión e inténtalo de nuevo".
- "Tweet publicado correctamente".

### I. Formato de cada tweet

En todas las pantallas, mostrar la información en este orden:

1. Nombre completo.
2. `@nombredeusuario`.
3. Fecha y hora de publicación.
4. Cuerpo del mensaje.

## 11. ORGANIZACIÓN DEL FRONTEND

- Usa React Router DOM.
- Mantén las rutas de perfil basadas en username, por ejemplo `/users/:username`.
- Protege las rutas internas.
- Centraliza las llamadas a la API en un módulo o carpeta de servicios.
- No escribas la misma lógica de llamadas HTTP en cada componente.
- Crea componentes reutilizables, especialmente para tweets, paginación, perfiles, listas de usuarios y estados de carga.
- Mantén el código JavaScript; no conviertas el proyecto a TypeScript.
- Mantén Bootstrap y las dependencias visuales que ya estén instaladas.
- Configura la URL base de la API mediante `VITE_API_URL`.
- No dejes la URL base escrita directamente en los componentes.
- Maneja errores de red y respuestas HTTP no exitosas.
- No dejes datos simulados como fuente de las pantallas finales.

## 12. CORS Y CONFIGURACIÓN

- Configura CORS para aceptar únicamente el origen autorizado del frontend.
- No habilites CORS indiscriminadamente para cualquier origen.
- Configura el backend mediante variables de entorno.
- Añade un `.env.example` sin secretos reales.
- No subas archivos `.env` con credenciales.
- No cambies las versiones de Java, Spring Boot o React sin una razón técnica comprobada.
- Mantén una configuración adecuada para desarrollo local.

## 13. DATOS DE PRUEBA

Carga en SQL Server, mediante un script o mecanismo idempotente:

- Al menos 25 usuarios ficticios.
- Al menos 60 tweets ficticios.
- Relaciones de seguimiento suficientes para probar el feed y las listas.
- Datos que permitan comprobar varias páginas de resultados.
- Contraseñas de prueba almacenadas mediante BCrypt.

Los datos deben ser ficticios, coherentes y reproducibles.

No dupliques usuarios, tweets ni relaciones cada vez que se ejecute el seed. No borres datos existentes para cargar las pruebas.

Documenta las cuentas de prueba para uso local y deja claro que no deben utilizarse en producción.

## 14. PRUEBAS OBLIGATORIAS

Ejecuta las pruebas que sean posibles en el entorno real.

### Base de datos

- Confirmar la conexión real con SQL Server.
- Confirmar la existencia de la base de datos del proyecto.
- Confirmar la existencia de las tablas.
- Verificar claves foráneas y restricciones.
- Confirmar la carga de al menos 25 usuarios y 60 tweets.
- Verificar que Spring Boot pueda consultar y guardar datos.

### Backend

- Inicio de sesión correcto.
- Inicio de sesión con contraseña incorrecta.
- Endpoint protegido sin token.
- Endpoint protegido con token inválido.
- Consulta del usuario autenticado.
- Consulta de perfiles.
- Publicación válida.
- Rechazo de tweets vacíos y demasiado largos.
- Feed con paginación.
- Listas de seguidores y seguidos.
- Seguimiento válido.
- Rechazo de auto-seguimiento.
- Rechazo de seguimiento duplicado.
- Manejo de usuario inexistente.

### Frontend

- Inicio de sesión.
- Persistencia de sesión al recargar.
- Cierre de sesión.
- Protección de rutas.
- Publicación de tweets.
- Actualización del feed.
- Navegación entre perfiles y listas.
- Paginación.
- Estados de carga, error y vacío.
- Actualización de contadores y botón de seguimiento.

No declares una prueba aprobada si no fue ejecutada. Diferencia claramente entre pruebas ejecutadas, pruebas que fallaron y pruebas que no se pudieron realizar.

## 15. GIT, CALIDAD Y DOCUMENTACIÓN

- Todo el código, nombres de variables, funciones, componentes, endpoints, tablas, comentarios y commits debe estar en inglés.
- La interfaz puede permanecer en español.
- Configura o conserva ESLint y un estilo consistente.
- Usa ramas por funcionalidad o corrección.
- Haz commits pequeños y descriptivos cuando tengas acceso al repositorio y autorización para realizar commits.
- No integres cambios directamente en `main` sin respetar el flujo de pull requests del equipo.
- No inventes nombres de integrantes.
- Conserva los cambios anteriores y no sobrescribas trabajo de otros integrantes.

Documenta en el README:

- Tecnologías.
- Requisitos de instalación.
- Cómo ejecutar frontend y backend.
- Variables de entorno necesarias.
- Configuración local de SQL Server.
- Cómo aplicar las migraciones.
- Cómo cargar los datos de prueba.
- Cuentas de demostración.
- Endpoints implementados, métodos, autenticación y parámetros.
- Pruebas disponibles y cómo ejecutarlas.
- Limitaciones que queden pendientes.

Incluye un `.env.example` en los proyectos correspondientes.

## 16. CONDICIONES PARA DAR EL TRABAJO POR TERMINADO

No des por terminado el proyecto solo porque el código compile o se hayan creado archivos.

Debes verificar, hasta donde lo permita el entorno, que:

1. El backend arranca.
2. El frontend arranca.
3. La aplicación se conecta a SQL Server.
4. El inicio de sesión utiliza credenciales verificadas contra la base de datos.
5. Los endpoints protegidos exigen autenticación.
6. Los tweets se guardan realmente en SQL Server.
7. El feed consulta los datos reales y funciona con paginación.
8. Los perfiles y las listas consultan datos reales.
9. El seguimiento persiste y actualiza contadores.
10. Los estados de carga, error y vacío funcionan.
11. Los datos de prueba cumplen los mínimos del proyecto.
12. La documentación coincide con la implementación.
13. No se implementó el registro de usuarios.

## 17. INFORME FINAL

Al terminar, presenta un informe en español con:

- Funcionalidades implementadas.
- Funcionalidades que ya existían y se conservaron.
- Archivos creados o modificados.
- Base de datos y tablas que realmente se crearon o reutilizaron.
- Resultado real de la conexión con SQL Server.
- Comandos ejecutados.
- Pruebas realizadas y resultados.
- Problemas pendientes.
- Datos de configuración que todavía necesito proporcionar, si corresponde.
- Confirmación explícita de que el registro de usuarios quedó excluido.

Empieza inspeccionando el proyecto y creando la copia de seguridad. Después continúa con la implementación, sin limitarte a entregar un plan de trabajo.
