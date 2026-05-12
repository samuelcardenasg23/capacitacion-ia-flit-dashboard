# regression-selector · Skill v1.0

| Campo | Valor |
|---|---|
| **Identificador** | `regression-selector` |
| **Invocada por** | `qa-agent` — Modo D |
| **Propósito** | Identificar qué TCs ejecutar en una ronda de regresión dado un módulo afectado o un evento de deploy |

---

## Inputs

| Campo | Requerido | Descripción |
|---|---|---|
| `trigger` | Sí | `bug_productivo` / `deploy_qa` / `deploy_produccion` / `solicitud_lt` |
| `modulo` | Condicional | Requerido si `trigger` es `bug_productivo` o `solicitud_lt` |
| `ambiente` | Sí | `QA` / `Producción` |
| `hu_origen` | Condicional | ID de la HU del bug resuelto — requerido si `trigger` es `bug_productivo` |

Si algún input requerido falta, la skill lo reporta al qa-agent y espera antes de continuar.

---

## Proceso

### 1. Determinar alcance de regresión según trigger

| Trigger | Alcance |
|---|---|
| `bug_productivo` | TCs críticos del módulo afectado + TCs de módulos con dependencia directa |
| `deploy_qa` | TCs críticos de todos los módulos incluidos en el deploy |
| `deploy_produccion` | TCs críticos de todos los módulos del deploy + smoke tests de flujos principales |
| `solicitud_lt` | Alcance definido por el Líder Técnico en la solicitud |

### 2. Clasificar TCs por criticidad

Consulta las Tasks en Azure DevOps y clasifica cada TC:

| Criticidad | Criterio |
|---|---|
| **Crítico** | Cubre el happy path principal del módulo o un flujo que afecta otros módulos |
| **Alto** | Cubre casos de error con impacto en datos o integridad del sistema |
| **Medio** | Cubre casos de borde sin impacto en otros módulos |
| **Bajo** | Cubre casos cosméticos o de UX |

Para regresión, la skill selecciona por defecto **Crítico + Alto**. Incluye Medio y Bajo solo si el Líder Técnico lo solicita explícitamente.

### 3. Identificar dependencias entre módulos

Si el bug o deploy afecta un módulo que tiene dependencias conocidas, expande la selección:

```
Ejemplo:
Módulo afectado: TRASPASOS
Dependencias conocidas: PERSONAS (consulta de titular), VALIDACION_IDENTIDAD
→ Incluir TCs críticos de TRASPASOS + PERSONAS + VALIDACION_IDENTIDAD
```

Las dependencias se leen del archivo `agent-templates/definition-of-done.md` o se preguntan al QA humano si no están documentadas.

### 4. Presentar selección al qa-agent

Antes de ejecutar, presenta la lista de TCs seleccionados al qa-agent con justificación por cada uno. El qa-agent puede agregar, quitar o aprobar la selección antes de pasarla al `playwright-runner`.

---

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

### Si no hay TCs críticos documentados para el módulo

```
regression-selector: ⚠️ No se encontraron TCs críticos para el módulo [MODULO]

Opciones:
1. Ejecutar todos los TCs disponibles del módulo (N TCs)
2. Definir manualmente qué TCs incluir

¿Cómo prefieres proceder?
```

---

## Restricciones

- **NUNCA** ejecuta la regresión directamente — entrega la selección al `playwright-runner`
- **NUNCA** omite módulos con dependencia directa del módulo afectado
- **NUNCA** aprueba la selección por sí misma — siempre espera confirmación del qa-agent
- **NUNCA** ejecuta regresión en Producción sin autorización explícita del Líder Técnico

---

*skill v1.0 — parte del ecosistema qa-agent · Equipo FLIT*