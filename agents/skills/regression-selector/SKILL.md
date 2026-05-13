---
name: regression-selector
description: Identifica qué TCs ejecutar en una ronda de regresión dado un módulo afectado o un evento de deploy. Usar cuando el qa-agent necesita determinar el alcance de regresión antes de pasarlo al playwright-runner.
when_to_use: Invocar en Modo D (regresión). Activar cuando se produce un deploy a QA o Producción, cuando se resuelve un bug productivo y se necesita validar que no hay regresión, o cuando el Líder Técnico solicita una ronda de regresión específica. Esta skill selecciona y justifica los TCs a ejecutar pero nunca los ejecuta directamente — siempre entrega la selección al playwright-runner tras aprobación del qa-agent. Regresiones en Producción requieren autorización explícita del Líder Técnico.
---

# regression-selector

Identifica qué TCs ejecutar en una ronda de regresión dado un módulo afectado o un evento de deploy. Invocada por el `qa-agent` en Modo D.

## Inputs requeridos

Antes de ejecutar, verificar que todos los siguientes inputs estén presentes. Si alguno falta, reportarlo al qa-agent y esperar antes de continuar.

| Campo       | Requerido   | Descripción                                                               |
| ----------- | ----------- | ------------------------------------------------------------------------- |
| `trigger`   | Siempre     | `bug_productivo` / `deploy_qa` / `deploy_produccion` / `solicitud_lt`     |
| `modulo`    | Condicional | Requerido si `trigger` es `bug_productivo` o `solicitud_lt`               |
| `ambiente`  | Siempre     | `QA` / `Producción`                                                       |
| `hu_origen` | Condicional | ID de la HU del bug resuelto — requerido si `trigger` es `bug_productivo` |

## Proceso

### 1. Determinar alcance según trigger

| Trigger             | Alcance                                                                          |
| ------------------- | -------------------------------------------------------------------------------- |
| `bug_productivo`    | TCs críticos del módulo afectado + TCs de módulos con dependencia directa        |
| `deploy_qa`         | TCs críticos de todos los módulos incluidos en el deploy                         |
| `deploy_produccion` | TCs críticos de todos los módulos del deploy + smoke tests de flujos principales |
| `solicitud_lt`      | Alcance definido por el Líder Técnico en la solicitud                            |

### 2. Clasificar TCs por criticidad

Consultar las Tasks en Azure DevOps y clasificar cada TC:

| Criticidad | Criterio                                                                     |
| ---------- | ---------------------------------------------------------------------------- |
| Crítico    | Cubre el happy path principal del módulo o un flujo que afecta otros módulos |
| Alto       | Cubre casos de error con impacto en datos o integridad del sistema           |
| Medio      | Cubre casos de borde sin impacto en otros módulos                            |
| Bajo       | Cubre casos cosméticos o de UX                                               |

Por defecto se seleccionan Crítico y Alto. Incluir Medio y Bajo solo si el Líder Técnico lo solicita explícitamente.

### 3. Identificar dependencias entre módulos

Si el bug o deploy afecta un módulo con dependencias conocidas, expandir la selección para incluirlas:

```
Ejemplo:
Módulo afectado: TRASPASOS
Dependencias conocidas: PERSONAS (consulta de titular), VALIDACION_IDENTIDAD
Resultado: incluir TCs críticos de TRASPASOS + PERSONAS + VALIDACION_IDENTIDAD
```

Las dependencias se leen del archivo `agent-templates/definition-of-done.md`. Si no están documentadas, preguntar al QA humano antes de continuar.

### 4. Presentar selección al qa-agent

Antes de pasar la selección al `playwright-runner`, presentar la lista de TCs con justificación por cada uno. El qa-agent puede agregar, quitar o aprobar la selección.

## Output

### Selección lista para ejecutar

```
regression-selector: Suite de regresión identificada

Trigger: [tipo] | Módulo principal: [MODULO] | Ambiente: [QA/Producción]

TCs seleccionados (N):

| TC   | Módulo | Título | Criticidad | Razón de inclusión |
|------|--------|--------|------------|-------------------|
| TC01 | TRASPASOS | QA_TC01_TRASPASOS_Consulta - Happy Path | Crítico | Flujo principal del módulo afectado |
| TC03 | PERSONAS | QA_TC03_PERSONAS_Consulta - Titular activo | Crítico | Dependencia directa de TRASPASOS |
| TC02 | VALIDACION_IDENTIDAD | QA_TC02_VALIDACION_Documento - Verificación exitosa | Alto | Dependencia secundaria |

Cobertura: 3 TCs críticos, 1 alto | Módulos cubiertos: TRASPASOS, PERSONAS, VALIDACION_IDENTIDAD

¿Apruebas esta selección para ejecutar con playwright-runner?
```

### Sin TCs críticos documentados para el módulo

```
regression-selector: [ADVERTENCIA] No se encontraron TCs críticos para el módulo [MODULO]

Opciones:
1. Ejecutar todos los TCs disponibles del módulo (N TCs)
2. Definir manualmente qué TCs incluir

¿Cómo prefieres proceder?
```

## Restricciones

- Nunca ejecutar la regresión directamente — entregar la selección al `playwright-runner`.
- Nunca omitir módulos con dependencia directa del módulo afectado.
- Nunca aprobar la selección por sí misma — siempre esperar confirmación del qa-agent.
- Nunca ejecutar regresión en Producción sin autorización explícita del Líder Técnico.
