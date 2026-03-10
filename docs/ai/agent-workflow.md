# Agent Workflow

## Objetivo

Este documento resume el flujo de trabajo seguido al utilizar un agente de IA para apoyar el desarrollo del proyecto. El enfoque no consistio en delegar todo el trabajo, sino en usar la IA como soporte tecnico para acelerar tareas repetitivas, proponer refactors y validar decisiones.

## Flujo de trabajo utilizado

1. Se definia un objetivo pequeño y concreto.
2. Se daba contexto del proyecto antes de pedir cambios grandes.
3. Se revisaba el resultado visual o funcional despues de cada cambio.
4. Tambien se revisaba el codigo para asegurar que no se escaparan errores estructurales o decisiones tecnicas inconsistentes.
5. Se corregian errores de forma incremental.
6. Se hacia commit solo cuando una parte quedaba estable.
7. Esto se alineo con un flujo de GitFlow reducido: `main` para base estable, `feature/develop` para desarrollo continuo y ramas `hotfix` para correcciones puntuales.

## Forma de trabajo aplicada en este proyecto

- Primero se comprobo que una migracion progresiva de CSS a Tailwind fuera posible sin romper por completo la interfaz.
- Una vez validado ese enfoque, se decidio conservar las variables de color en CSS y migrar la aplicacion modulo por modulo.
- Cuando surgian errores visuales, se pedia corregir un detalle especifico y se revisaba en caliente.
- En cambios delicados, como tema light, persistencia o estructura de datos, el codigo se inspeccionaba antes de modificarlo.
- Para hotfixes, se separo el trabajo en ramas independientes.

## Ventajas del flujo con agente

- Ahorra tiempo en tareas repetitivas.
- Permite explorar soluciones tecnicas rapidamente.
- Facilita el debugging paso a paso.
- Ayuda a documentar lo que se va construyendo.

## Riesgos del flujo con agente

- Si el prompt es ambiguo, la respuesta puede ser ambigua.
- Si no se valida el resultado, se pueden aceptar cambios incorrectos.
- El agente puede proponer soluciones correctas tecnicamente, pero no alineadas con la intencion visual del proyecto.
- El agente tambien puede proponer cambios que no respeten los lineamientos del proyecto, por ejemplo en modularidad, DRY, separacion de capas, organizacion de carpetas o ubicacion de metodos. Por eso no basta con aceptar la solucion: hay que contrastarla con la arquitectura que se quiere mantener.

## Conclusión

El agente funciono mejor cuando se uso como copiloto tecnico y no como sustituto del criterio humano. La mejor estrategia fue dar instrucciones pequeñas, revisar el resultado y continuar desde ahi.
