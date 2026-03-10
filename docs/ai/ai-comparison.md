# AI Comparison
## Objetivo

Este documento compara el uso de herramientas de inteligencia artificial dentro del contexto del desarrollo de software, tomando como referencia el trabajo realizado en este proyecto.

## Comparacion general

### Chat tradicional

- Bueno para dudas rapidas.
- Util para pedir explicaciones, ejemplos o ideas.
- Menos efectivo cuando hay que modificar varios archivos relacionados.

### Agente de codigo

- Mejor cuando puede inspeccionar el repositorio.
- Puede seguir una secuencia de pasos con contexto real.
- Permite refactorizar, editar archivos y validar con comandos como `npm run build`.

### Autocompletado

- Muy util para velocidad.
- Bueno para funciones pequeñas o patrones repetitivos.
- No suele entender por si solo la arquitectura completa del proyecto.

## Uso puntual de GitHub Copilot

GitHub Copilot tambien fue utilizado durante parte del proyecto desde Visual Studio Code, mediante su extension oficial y aprovechando los beneficios de GitHub Education. La herramienta fue util para autocompletado y sugerencias rapidas, pero no resulto la opcion preferida para cambios estructurales o revisiones amplias del proyecto.

La principal limitacion observada fue la relacion entre contexto disponible y capacidad real de seguimiento entre archivos. En tareas pequeñas funciona bien, pero cuando hay renombre de variables, cambios en estructuras de datos, reorganizacion de carpetas o dependencias entre varios modulos, el margen de error aumenta si no alcanza a revisar todo el contexto relevante.

Esto puede provocar que alguna referencia anterior quede sin actualizar o que una decision correcta a nivel local no sea coherente con la arquitectura general del proyecto. Por esa razon, Copilot se percibio como una buena ayuda de apoyo, pero no como la mejor herramienta para dirigir cambios grandes de forma confiable dentro de este repositorio.

## Que resulto mas util en este proyecto

Para este proyecto, el enfoque mas util fue trabajar con un agente capaz de:

- leer el codigo existente,
- proponer cambios pequeños,
- aplicar modificaciones reales,
- y validar el resultado despues de cada paso.

Esto fue especialmente util durante:

- la migracion a Vite,
- la migracion a Tailwind,
- la organizacion de tokens semanticos,
- y la implementacion progresiva del tema light.

## Conclusión

No existe una unica herramienta "mejor" para todo. La utilidad depende del tipo de tarea. En desarrollo real, una combinacion de criterio humano + agente con acceso al proyecto ofrece mejores resultados que una conversacion aislada sin contexto.

Tambien es importante reconocer que algunos modelos de inteligencia artificial pueden ofrecer niveles de razonamiento logico y matematico comparables a los de una persona con formacion avanzada en esas areas. Por eso, gran parte del merito tecnico de ciertas soluciones si pertenece realmente al modelo: no se trata solo de autocompletado, sino de capacidad de analisis, sintesis y propuesta.

Sin embargo, ese valor no elimina la responsabilidad de quien desarrolla. El punto clave sigue siendo revisar, cuestionar y adaptar la solucion al contexto del proyecto. La IA puede producir una respuesta muy potente; el trabajo humano consiste en decidir si esa respuesta respeta la arquitectura, los lineamientos y la intencion real del sistema.
