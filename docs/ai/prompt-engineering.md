# Prompt Engineering
## Objetivo

Este documento resume las bases del prompt engineering aplicadas durante el desarrollo del proyecto.

## Principios usados

### 1. Dar contexto antes de pedir cambios

Los mejores resultados aparecieron cuando el prompt explicaba:

- en que parte del proyecto se iba a trabajar,
- que comportamiento actual existia,
- que se esperaba cambiar,
- y que no debia romperse.

### 2. Pedir cambios pequeños

Desde el inicio se entendio que pedir una migracion total de golpe era demasiado riesgoso. Por eso funciono mejor trabajar modulo por modulo, revisando constantemente el resultado visual y funcional mientras el usuario validaba cada cambio dentro de la UI.

La estrategia aplicada fue avanzar por partes como:

- body,
- layout,
- header,
- terminal,
- innerHTML,
- tema,
- hotfixes puntuales.

Ademas, de forma frecuente se pedia ejecutar `npm run build` para comprobar que los cambios no rompieran el proyecto. Esto redujo errores y permitio validar cada paso antes de continuar.

### 3. Especificar restricciones

Por ejemplo:

- no romper el preflight,
- no tocar toda la UI de golpe,
- mantener la estructura existente,
- hacer cambios modulo por modulo,
- verificar con build.

### 4. Corregir con lenguaje directo

No siempre se usaron prompts "bonitos". A veces se usaron prompts raros, cortos o muy conversacionales. Aun asi, funcionaron cuando expresaban una necesidad concreta y accionable.

Ejemplos del estilo usado:

- "next"
- "haz el barrido"
- "se ve horrible"
- "ponlo en amarillo"
- "quiero que esto quede negro en light"

Aunque no son prompts academicos, si contienen una intencion clara y eso fue suficiente para iterar rapido.

### 5. Repetir patrones, no prompts literales

En la practica, no era tan comun repetir exactamente el mismo prompt diez veces. Lo que si se repetia bastante eran ciertos **patrones de intencion**: pedir una division mas clara de responsabilidades, explorar varias propuestas antes de tocar codigo o cambiar algo sin romper el comportamiento actual.

Los patrones que mas se repitieron fueron:

- pedir si una funcion podia dividirse en dos partes mas claras,
- revisar si una funcion estaba llamando algo incorrecto o si debia delegar en otra,
- pedir varias propuestas antes de implementar un cambio,
- pedir cambios sin romper el comportamiento actual,
- pedir cambios sin romper la intencion visual actual,
- ajustar solo una parte concreta sin rehacerlo todo.

Ejemplos muy cercanos al estilo real usado:

- "Esta funcion puede dividirse en dos."
- "Esta funcion deberia estar llamando otra cosa."
- "Dame tres propuestas de codigo interesantes para ver cual aclara mejor este problema."
- "No rompas el comportamiento actual, pero cambia esta parte."
- "No rompas la intencion visual actual, pero ajusta esto."
- "Toca solo esta parte; no rehagas todo."

## Estructura de prompt que mejor funciono

1. Contexto breve.
2. Cambio puntual.
3. Restriccion o criterio visual.
4. Validacion esperada.

Ejemplo:

```text
Revisa las variables de color que ya tenemos en CSS y realiza el cambio pertinente para que el cambio entre light mode y dark mode funcione correctamente.
No quites el token que guarda la preferencia del usuario, porque ese token define que tema debe cargarse cuando la aplicacion vuelva a abrir.
Claramente hace falta ajustar las referencias en la UI.
Verifica el resultado al final.
```

## Conclusión

En este proyecto, el prompt engineering no consistio en escribir prompts perfectos, sino en aprender a dar contexto, reducir ambiguedad y trabajar en iteraciones pequeñas.
