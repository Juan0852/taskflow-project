# Backend

Este directorio contiene el backend del proyecto, pensado como una API profesional para soportar autenticacion por usuario, persistencia real de tareas, preferencias de interfaz y futuras extensiones del sistema.

El objetivo no es solo "hacer que funcione", sino construir una base mantenible y defendible para que el frontend actual pueda evolucionar desde un enfoque local-first hacia una arquitectura completa de `frontend + backend`.

## Objetivo del backend

Este backend se va a encargar de:

- autenticar usuarios,
- persistir tareas por usuario,
- gestionar preferencias persistidas de UI,
- exponer endpoints REST claros y organizados,
- servir de base para futuras features como uploads, procesamiento de imagenes y seguridad adicional.

## Stack tecnologico

### Node.js

`Node.js` sera el runtime del backend.

Se utiliza porque:

- encaja bien con el ecosistema actual del proyecto,
- permite mantener JavaScript en frontend y backend,
- facilita una integracion rapida con Express y Prisma.

### Express

`Express` sera el framework HTTP principal.

Se utilizara para:

- definir rutas REST,
- montar middlewares,
- separar controladores, servicios y repositorios,
- manejar autenticacion, cookies y flujo general del servidor.

### CORS

`cors` se utilizara para controlar que origenes pueden hablar con la API.

Es importante porque:

- el frontend y el backend viviran en partes separadas del monorepo,
- en desarrollo usaremos origenes distintos,
- mas adelante se enviaran cookies de sesion entre frontend y backend.

### dotenv

`dotenv` se utilizara para cargar configuracion sensible desde variables de entorno.

Aqui se guardaran cosas como:

- `PORT`
- `DATABASE_URL`
- `SESSION_SECRET`
- `CLIENT_URL`

Esto cumple el mismo papel que un `application.properties` o `application.yml` en Spring Boot, pero en el ecosistema Node.

### Nodemon

`nodemon` se utilizara en desarrollo para recargar el servidor automaticamente al guardar cambios.

Su objetivo es mejorar la velocidad de iteracion mientras construimos el backend.

### PostgreSQL

`PostgreSQL` sera la base de datos relacional del proyecto.

Se eligio porque:

- encaja muy bien con Prisma,
- ofrece un modelo relacional robusto,
- tiene mejor ecosistema gratuito para despliegue y pruebas que MySQL en este contexto,
- se integra bien con Supabase para despliegue y persistencia remota.

En desarrollo local se trabajara con un servidor local de PostgreSQL.
En despliegue, la base de datos objetivo sera la gestionada por Supabase.

### Prisma

`Prisma` sera la capa de modelado y acceso a datos.

Se utilizara para:

- definir modelos y relaciones mediante `schema.prisma`,
- generar el cliente de acceso a base de datos,
- gestionar migraciones,
- consultar PostgreSQL sin escribir SQL manual para cada operacion comun.

En este proyecto Prisma cumple un papel parecido al de:

- entidades,
- repositorios,
- y parte del acceso tipado a datos

que normalmente se veria en proyectos tipo Spring Boot, aunque con un estilo diferente y mas ligero.

### Argon2

`argon2` se utilizara para hashear contrasenas.

No se guardaran contrasenas en claro ni "encriptadas" de forma reversible.
Lo correcto es almacenar un hash robusto y verificarlo en login.

Se eligio `argon2` porque es una opcion moderna y muy solida para password hashing.
Ademas, su uso no se siente tan lejano respecto a `bcrypt`, que era la referencia previa mas familiar dentro del proyecto. Eso permite mantener una curva de adopcion razonable sin abandonar una decision tecnicamente fuerte.

### express-session

`express-session` se utilizara para gestionar sesiones del lado del servidor.

La idea general es:

- el backend autentica,
- el backend crea la sesion,
- el navegador conserva la cookie,
- el frontend no maneja tokens manualmente en `localStorage`.

Esto encaja mejor con el objetivo del proyecto que un modelo improvisado con JWT guardado en cliente.

### Zod

`zod` se utilizara para validar DTOs de entrada.

Servira para:

- validar request bodies,
- controlar que campos entran realmente a la API,
- evitar payloads sucios o inconsistentes,
- modelar request DTOs de forma clara.

## Tecnologias previstas para fases posteriores

Estas tecnologias todavia no forman parte del backend funcional base, pero estan previstas porque encajan con la direccion del proyecto.

### Multer

`multer` se utilizara cuando se implemente subida de archivos.

Su papel sera:

- recibir archivos multipart,
- exponerlos a middlewares posteriores,
- controlar limites basicos de upload.

### Sharp

`sharp` se utilizara para procesamiento de imagenes.

Se tiene pensado usarlo para:

- comprimir imagenes,
- redimensionarlas,
- convertir formatos cuando haga falta,
- reducir peso antes de persistir la referencia o subir el archivo final.

Esto sera especialmente util cuando el usuario pueda subir imagen de perfil.

### Antivirus / escaneo de archivos

Todavia no se ha elegido una implementacion final, pero esta contemplado introducir una capa de escaneo de archivos para uploads.

La idea seria usarlo para:

- revisar archivos antes de aceptarlos,
- endurecer seguridad si el sistema crece,
- evitar subir contenido potencialmente malicioso.

Esto no se implementara en la primera fase porque no es prioritario para levantar auth, tareas y preferencias.

## Modelo de datos actual pensado

Las entidades base contempladas en esta primera fase son:

- `User`
- `Task`
- `UserPreference`

### User

La entidad `User` representara:

- identidad del usuario,
- credenciales,
- nombre visible,
- imagen de perfil,
- estado activo/inactivo.

### Task

La entidad `Task` representara:

- el contenido principal de la tarea,
- tipo,
- estado,
- prioridad,
- relacion con el usuario,
- papelera mediante `trashedAt`.

Las tareas no se borraran directamente al ir a papelera.
El soft delete se modelara mediante `trashedAt`, y el borrado definitivo se hara despues con un delete real.

### UserPreference

La entidad `UserPreference` representara:

- tema visual,
- configuracion de toolbar,
- preferencias de filtros,
- configuraciones relacionadas con el calendario o la UI.

Parte de esta informacion se guardara en `Json` para evitar sobredisenar demasiadas tablas desde el inicio.

## Arquitectura prevista

Aunque todavia no esta montada completa, la idea es organizar el backend por modulos, siguiendo una estructura clara y mantenible.

La direccion prevista es algo parecido a:

```text
backend/
├── prisma/
│   └── schema.prisma
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    ├── lib/
    ├── middlewares/
    ├── security/
    ├── utils/
    └── modules/
        ├── auth/
        ├── users/
        ├── tasks/
        └── preferences/
```

Dentro de cada modulo se pretende mantener una separacion clara entre:

- routes
- controllers
- services
- repositories
- request DTOs
- response DTOs
- mappers

## Estado actual

En este punto ya existe:

- el `package.json` del backend,
- el stack base decidido,
- el `schema.prisma` inicial,
- la rama dedicada de backend,
- y el archivo `.env` local ignorado por Git.

Todavia faltan:

- crear `.env.example`,
- inicializar Prisma formalmente con migraciones,
- conectar PostgreSQL local,
- crear el cliente Prisma,
- y empezar a construir auth, tareas y preferencias.

## Nota de alcance

La prioridad inmediata del backend es:

1. autenticacion por usuario,
2. persistencia real de tareas,
3. preferencias persistidas,
4. base limpia para que el frontend deje de depender de `localStorage` como fuente principal.

Uploads, procesamiento de imagenes y capas de seguridad mas avanzadas se haran despues, sobre una base ya estable.
