---
name: bug-reporter
description: Redacta bugs estructurados con Repro Steps, evidencia y severidad, listos para radicar en Azure DevOps. Usar cuando el qa-agent detecta un fallo durante la ejecución de TCs o en revisión de ambiente y necesita documentar y radicar el bug correctamente.
when_to_use: Invocar en Modo C (reporte de bugs). Activar cuando un TC falla y se necesita redactar el bug con estructura completa (descripción, pasos de reproducción, resultado esperado vs observado, evidencia y severidad) antes de radicarlo en Azure DevOps. También activar cuando se detecta un fallo fuera de un TC formal, ya sea en DEV, QA o Producción. No radicar nunca sin confirmación explícita del qa-agent. Bugs productivos siempre deben asignarse vía Líder Técnico, nunca directo al desarrollador.
---

# bug-reporter

Redacta bugs estructurados con Repro Steps, evidencia y severidad, listos para radicar en Azure DevOps. Invocada por el `qa-agent` en Modo C.

## Inputs requeridos

Antes de ejecutar, verificar que todos los siguientes inputs estén presentes. Si alguno falta, reportarlo al qa-agent y esperar antes de continuar.

| Campo                 | Requerido   | Descripción                                                         |
| --------------------- | ----------- | ------------------------------------------------------------------- |
| `origen`              | Siempre     | `hu` / `ambiente` / `productivo` — determina el flujo de asignación |
| `hu_id`               | Condicional | Requerido si `origen` es `hu` o `ambiente` con HU asociada          |
| `modulo`              | Siempre     | Módulo afectado tal como aparece en el work item                    |
| `descripcion`         | Siempre     | Descripción corta del fallo observado                               |
| `repro_steps`         | Siempre     | Pasos para reproducir el bug — puede venir del TC fallido           |
| `resultado_esperado`  | Siempre     | Qué debería ocurrir según los AC                                    |
| `resultado_observado` | Siempre     | Qué ocurrió realmente                                               |
| `evidencia`           | Siempre     | Screenshots, logs, responses o videos del fallo                     |
| `ambiente`            | Siempre     | `DEV` / `QA` / `Producción`                                         |
| `asignado_a`          | Condicional | Dev o Líder Técnico — determinado por la tabla de flujo controlado  |

## Proceso

### 1. Determinar severidad

Evaluar el impacto del bug según este criterio:

| Severidad | Criterio                                                                    |
| --------- | --------------------------------------------------------------------------- |
| Crítico   | Bloquea un flujo completo en producción, sin workaround posible             |
| Alto      | Afecta funcionalidad principal, existe workaround pero es difícil o costoso |
| Medio     | Afecta funcionalidad secundaria o existe workaround fácil                   |
| Bajo      | Error cosmético o de UX, no afecta funcionalidad                            |

Cuando hay duda entre dos niveles, asignar el más alto e indicar al qa-agent que lo revise.

### 2. Determinar asignación

Aplicar la tabla de flujo controlado del qa-agent:

| Origen                                         | Asignación                                       |
| ---------------------------------------------- | ------------------------------------------------ |
| Bug encontrado en HU (DEV o QA)                | Directo al desarrollador de la HU                |
| Bug en DEV/QA sin HU asociada                  | Dev responsable del módulo o Líder Técnico       |
| Bug productivo (soporte, operaciones, cliente) | Siempre vía Líder Técnico — nunca directo al dev |

### 3. Redactar el bug

Estructurar el bug con el siguiente formato:

```
Título: [MODULO] [descripción corta del fallo] — [ambiente]

Severidad: Crítico / Alto / Medio / Bajo
Ambiente: DEV / QA / Producción
HU relacionada: #[ID] (si aplica)
Módulo: [MODULO]

--- DESCRIPCIÓN ---
[Descripción clara del comportamiento incorrecto observado]

--- PASOS PARA REPRODUCIR ---
1. [Paso 1]
2. [Paso 2]
3. [Paso N]

--- RESULTADO ESPERADO ---
[Qué debería ocurrir según los AC o el comportamiento definido]

--- RESULTADO OBSERVADO ---
[Qué ocurrió realmente — incluir código de error, mensaje, respuesta HTTP si aplica]

--- EVIDENCIA ---
[Screenshots / logs / response body adjuntos]

--- INFORMACIÓN DEL SISTEMA ---
Ambiente: [DEV / QA / Producción]
Build / versión: [número de build o versión desplegada]
Fecha y hora: [timestamp de cuando se reprodujo]
```

### 4. Validar antes de radicar

Presentar el bug redactado al qa-agent para confirmación antes de publicar en Azure DevOps. No radicar sin aprobación explícita.

## Output

### Bug listo para radicar

```
bug-reporter: [OK] Bug redactado

Título: [MODULO] [descripción] — [ambiente]
Severidad: [nivel]
Asignado a: [dev / Líder Técnico]
HU relacionada: #[ID]

[Cuerpo completo del bug]

¿Confirmas la radicación en Azure DevOps?
```

### Inputs insuficientes

```
bug-reporter: [ADVERTENCIA] Inputs insuficientes para radicar el bug

Falta:
- resultado_esperado: ¿qué debería haber ocurrido según los AC?
- evidencia: adjunta screenshot o log del fallo

Proporciona los datos faltantes para continuar.
```

## Restricciones

- Nunca radicar un bug productivo asignado directamente al desarrollador.
- Nunca publicar un bug sin evidencia adjunta.
- Nunca radicar sin confirmación explícita del qa-agent.
- Nunca omitir el resultado esperado vs observado — es obligatorio en todos los bugs.
- Nunca asumir la asignación si el origen no está claro — preguntar al qa-agent.
