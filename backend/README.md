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

`zod` se utiliza para validar DTOs de entrada.

Servira para:

- validar request bodies,
- controlar que campos entran realmente a la API,
- evitar payloads sucios o inconsistentes,
- modelar request DTOs de forma clara.

Es importante distinguir dos capas de validacion:

- **validacion estructural**: vive principalmente en los request DTOs con `zod`
- **validacion de negocio**: vive en `services`

La validacion estructural responde preguntas como:

- si el campo existe,
- si tiene el tipo correcto,
- si el email tiene formato valido,
- si falta un dato obligatorio,
- o si el payload ya viene roto desde el cliente.

La validacion de negocio responde preguntas como:

- si el email ya esta en uso,
- si el username ya esta ocupado,
- si un username esta reservado,
- si la password no cumple una politica real del sistema,
- o si una accion concreta esta permitida segun el estado actual de la base de datos.

En este proyecto se entiende que habra validaciones en frontend y backend, pero el backend sigue siendo la capa definitiva de confianza.

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

Las entidades base de esta primera fase son:

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

La arquitectura del backend se esta organizando por modulos, siguiendo una estructura clara y mantenible.

La direccion actual es esta:

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

Dentro de cada modulo se mantiene o se seguira manteniendo una separacion clara entre:

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
- el bootstrap funcional del servidor con `app.js` y `server.js`,
- validacion de entorno centralizada en `src/config/env.js`,
- el `PrismaClient` preparado en `src/lib/prisma.js`,
- la estructura modular inicial de `auth`, `tasks`, `users` y `preferences`,
- rutas placeholder montadas para todos esos modulos,
- un endpoint base de salud para comprobar que el backend arranca correctamente,
- la base de datos local `taskflow_db` ya inicializada,
- la migracion inicial de Prisma ya generada y aplicada,
- y las tablas base ya creadas en PostgreSQL (`User`, `Task`, `UserPreference`, `_prisma_migrations`).

## Estado tecnico del bootstrap

Actualmente el backend ya puede arrancar con:

- `express`
- `cors`
- `dotenv`
- `express-session`
- `zod`

Tambien quedan configurados desde el arranque:

- `CORS` con `credentials: true`,
- cookie de sesion `HttpOnly`,
- parseo de JSON,
- rutas base para cada modulo,
- middleware de `404`,
- y middleware central de manejo de errores.

Tambien queda ya comprobado en runtime real que:

- `Prisma 6` conecta correctamente con PostgreSQL,
- el backend puede arrancar con conexion viva a base de datos,
- y la base del servidor ya no es solo teorica, sino funcional.

## Estado actual del modulo auth

En este punto el modulo `auth` ya cuenta con una primera version funcional de:

- `register`
- `login`
- `me`
- `logout`

Ademas, la implementacion ya sigue una separacion real entre:

- request DTOs,
- response DTOs,
- `service`,
- `repository`,
- `mapper`,
- errores especificos del modulo,
- y servicio de hashing de password.

Tambien queda establecida la distincion entre:

- validacion estructural (DTOs / `zod`)
- validacion de negocio (`service`)

En `auth` ya estan implementadas y probadas las siguientes piezas:

- registro de usuario con hash de contrasena mediante `argon2`,
- login con verificacion de credenciales,
- recuperacion del usuario actual mediante sesion (`me`),
- cierre de sesion (`logout`),
- sesiones basadas en cookie con `express-session`,
- errores de negocio propios del modulo (`EMAIL_ALREADY_IN_USE`, `USERNAME_ALREADY_IN_USE`, `USERNAME_RESERVED`, `PASSWORD_TOO_WEAK`, `INVALID_CREDENTIALS`, `INACTIVE_ACCOUNT`),
- mensajes y respuestas preparados en espanol,
- y validaciones estructurales separadas de las validaciones de negocio.

El flujo completo de `auth` ya fue probado manualmente en desarrollo con respuestas correctas para:

- `status`
- `register`
- `login`
- `me`
- `logout`
- `me` sin sesion activa

Con esto, el modulo `auth` puede considerarse cerrado como primera version funcional y el siguiente paso natural del backend pasa a ser el modulo `tasks`.

## Decision tecnica resuelta sobre Prisma

La decision `Prisma 6` vs `Prisma 7` ya quedo cerrada:

- el proyecto usara `Prisma 6`

La razon principal es practica: el `schema.prisma` actual ya esta escrito con el flujo clasico que encaja de forma natural con Prisma 6, mientras que Prisma 7 introduce cambios de configuracion que no aportan valor inmediato para esta fase del proyecto.

Con esta decision ya queda validado que:

- el esquema actual es compatible con la version elegida,
- `prisma generate` funciona correctamente,
- y el backend puede seguir avanzando sobre una base mas estable y predecible.
- y el archivo `.env` local ignorado por Git.

Todavia faltan:

- revisar si conviene añadir `.env.example` mas adelante,
- continuar con el modulo `tasks`,
- construir el modulo `preferences`,
- y seguir integrando el frontend actual con la API del backend.

## Nota de alcance

La prioridad inmediata del backend es:

1. autenticacion por usuario,
2. persistencia real de tareas,
3. preferencias persistidas,
4. base limpia para que el frontend deje de depender de `localStorage` como fuente principal.

Uploads, procesamiento de imagenes y capas de seguridad mas avanzadas se haran despues, sobre una base ya estable.
