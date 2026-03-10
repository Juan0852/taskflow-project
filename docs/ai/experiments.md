# Experiments

## Objetivo

Este documento resume algunos experimentos realizados con apoyo de IA durante el desarrollo del proyecto.

## Experimento 1: Migracion progresiva a Tailwind

- **Hipotesis:** Migrar de forma incremental reduciria el riesgo de romper toda la interfaz.

- **Resultado:** Funciono mejor que una migracion completa de golpe. Permitio revisar cada modulo visual antes de continuar.

## Experimento 2: Activar preflight despues de la migracion base

- **Hipotesis:** Activar `preflight` al final seria mas seguro que activarlo desde el principio.

- **Resultado:** La hipotesis fue correcta. Primero se estabilizo la migracion visual y luego se activo `preflight`, corrigiendo solo lo necesario.

## Experimento 3: Mover keyframes manuales a Tailwind config

- **Hipotesis:** Centralizar animaciones en `tailwind.config.cjs` dejaria el proyecto mas limpio.

- **Resultado:** La animacion `slideDown` se pudo migrar correctamente y el CSS base quedo mas ordenado.

## Experimento 4: Tokens semanticos de color

- **Hipotesis:** Renombrar colores de marca a tokens semanticos facilitaria el mantenimiento del tema.

- **Resultado:** Se logro mejorar la legibilidad del sistema de estilos sin cambiar el aspecto visual base del proyecto.

## Experimento 5: Persistencia local con serializacion JSON

- **Hipotesis:** Para guardar tareas en persistencia local, era mejor serializar una estructura clara de datos a JSON que usar estructuras de control menos estables o mas acopladas al render.

- **Resultado:** Se utilizo un array de tareas en memoria y luego `JSON.stringify(...)` para persistirlo en `localStorage`. Esto recordo el flujo de serializacion usado en controladores REST y resulto mas claro, mas mantenible y mas seguro para el guardado de informacion que improvisar una estructura menos consistente.

## Experimento 6: Hotfix aislado por rama

- **Hipotesis:** Separar un problema de light mode en una rama hotfix haria mas seguro el arreglo.

- **Resultado:** Permitio corregir el bug del color del texto fuerte sin mezclarlo con trabajo de documentacion o desarrollo general.

## Experimento 7: Cambio grande sobre modelo, terminal y UI

- **Hipotesis:** Se quiso medir que tan consistente podia ser la inteligencia artificial realizando un cambio grande dentro del proyecto en un solo proceso, concretamente al añadir `status` y `type` a las tareas.

- **Resultado:** El experimento fue un exito. El cambio se aplico de forma consistente en el modelo de datos, la persistencia, la terminal, la GUI, el render y la documentacion. No es posible asegurar con certeza si el buen resultado se debio principalmente a la modularidad del proyecto, a la separacion de carpetas, a la claridad del flujo o a que el codigo no estaba excesivamente revuelto. Probablemente fue una combinacion de todos esos factores. En cualquier caso, el resultado final fue muy consistente y demostro que un cambio relativamente grande podia integrarse sin romper la coherencia general del sistema.

## Conclusión

Los experimentos mas exitosos fueron los que se hicieron en pasos pequeños, con validacion inmediata y con posibilidad de rollback rapido.

Este documento seguira creciendo a medida que se realicen nuevos experimentos en el proyecto.
