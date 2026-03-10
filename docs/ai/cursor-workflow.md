# Cursor Workflow

> Nota:
> Este archivo no es necesario leerlo en detalle. Se incluyo principalmente por fines educativos y para ajustarse a la estructura pedida en la actividad. Si quieres entender mejor el contexto real de trabajo y la comparacion entre herramientas/modelos, revisa directamente [agent-workflow.md](/Users/juanmontero/Documents/taskflow-project/docs/ai/agent-workflow.md).

## Objetivo

Este documento describe el flujo de trabajo asistido por IA aplicado al proyecto, tomando como referencia el tipo de practica que normalmente se asociaria a Cursor o herramientas similares.

## Aclaracion inicial

En esta etapa concreta no se utilizo Cursor de forma directa. En su lugar se trabajo con Antigravity y con un agente de desarrollo sobre el repositorio. Aun asi, el flujo documentado aqui sigue siendo valido porque se apoya en capacidades equivalentes: lectura contextual del codigo, edicion de archivos, razonamiento sobre arquitectura, ejecucion de comandos y validacion incremental.

Tambien es importante anotar que Cursor ya habia sido utilizado en ocasiones anteriores. Precisamente por esa experiencia previa se considero que, para este proyecto, otras herramientas encajaban mejor con la forma de trabajo que se queria mantener.

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

## Ventajas del flujo asistido

- Ahorra tiempo en tareas repetitivas.
- Permite explorar soluciones tecnicas rapidamente.
- Facilita el debugging paso a paso.
- Ayuda a documentar lo que se va construyendo.

## Riesgos del flujo asistido

- Si el prompt es ambiguo, la respuesta puede ser ambigua.
- Si no se valida el resultado, se pueden aceptar cambios incorrectos.
- El asistente puede proponer soluciones correctas tecnicamente, pero no alineadas con la intencion visual del proyecto.
- Tambien puede proponer cambios que no respeten los lineamientos del proyecto, por ejemplo en modularidad, DRY, separacion de capas, organizacion de carpetas o ubicacion de metodos.

## Conclusión

El flujo asistido funciono mejor cuando la IA se uso como copiloto tecnico y no como sustituto del criterio humano. La mejor estrategia fue dar instrucciones pequeñas, revisar el resultado y continuar desde ahi.
