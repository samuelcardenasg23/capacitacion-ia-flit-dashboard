# tc-formatter · Skill v1.0

| Campo | Valor |
|---|---|
| **Identificador** | `tc-formatter` |
| **Invocada por** | `qa-agent` — Modo A, antes de publicar cualquier TC |
| **Propósito** | Validar y estructurar Test Cases en formato FLIT estricto, garantizando trazabilidad con el escenario Gherkin de origen |

---

## Inputs

| Campo | Requerido | Descripción |
|---|---|---|
| `hu_id` | Sí | ID de la HU en Azure DevOps |
| `modulo` | Sí | Nombre del módulo tal como aparece en el work item |
| `escenarios_gherkin` | Sí | Lista de escenarios Gherkin de los AC de la HU |
| `tcs_propuestos` | Sí | Lista de TCs generados por el qa-agent para validar |
| `tasks_existentes` | Sí | Tasks actuales vinculadas a la HU (para verificar consecutivos) |

Si algún input falta, la skill lo reporta al qa-agent y no produce output hasta recibirlo.

---

## Proceso

### 1. Validar formato de título

Cada TC debe cumplir estrictamente:

```
QA_TC{##}_{MODULO}_{ALCANCE} - {ESCENARIO}
```

| Componente | Regla |
|---|---|
| `QA_TC` | Prefijo fijo — siempre en mayúsculas |
| `{##}` | Consecutivo de 2 dígitos con cero a la izquierda: `01`, `02`... `99` |
| `{MODULO}` | Nombre exacto del módulo del work item — en mayúsculas, sin espacios (usar guión bajo si aplica) |
| `{ALCANCE}` | Funcionalidad específica dentro del módulo que se está probando — en mayúsculas |
| `{ESCENARIO}` | Descripción corta del caso — en español, capitalizado, sin abreviaciones |

**Ejemplos válidos:**
```
QA_TC01_PERSONAS_Registro - Happy Path con todos los archivos válidos
QA_TC02_PERSONAS_Registro - Falta campo obligatorio numero_identificacion
QA_TC01_TRASPASOS_Consulta - Traspaso exitoso entre cuentas del mismo titular
```

**Ejemplos inválidos y razón:**
```
QA_TC1_PERSONAS_Registro - Happy Path        → consecutivo sin cero: debe ser TC01
qa_tc01_personas_registro - happy path       → debe ir en mayúsculas
QA_TC01_PERSONAS - Happy Path                → falta el ALCANCE
QA_TC01_PERSONAS_Registro Happy Path         → falta el separador " - "
```

### 2. Validar consecutivos

- Consulta las Tasks existentes en la HU para determinar el último consecutivo usado
- El siguiente TC debe ser `último + 1`
- Si no hay Tasks previas, empieza en `TC01`
- Si detecta un salto o duplicado en los consecutivos, lo reporta al qa-agent antes de continuar

### 3. Validar trazabilidad Gherkin

Cada TC propuesto debe estar trazado a un escenario Gherkin específico de los AC. La skill verifica:

- Que exista un escenario Gherkin de origen para cada TC
- Que el `{ALCANCE}` y `{ESCENARIO}` del título reflejen el escenario Gherkin de origen
- Que no haya TCs sin escenario Gherkin asociado

Si un TC no tiene trazabilidad clara, lo marca como `⚠️ sin trazabilidad` y lo reporta al qa-agent para revisión.

### 4. Validar cobertura mínima

Por HU, verifica que el conjunto de TCs propuestos cubra al menos:

| Tipo | Mínimo |
|---|---|
| Happy Path | 1 |
| Borde | 1 |
| Error | 1 |
| **Total** | **3** (recomendado 5) |

Si la cobertura mínima no se cumple, advierte al qa-agent con los tipos faltantes.

---

## Output

### Si todos los TCs son válidos

```
tc-formatter: ✅ N TCs validados

| TC   | Título                                      | Gherkin origen            | Tipo       |
|------|---------------------------------------------|---------------------------|------------|
| TC01 | QA_TC01_{MODULO}_{ALCANCE} - {ESCENARIO}   | Scenario: [nombre]        | Happy Path |
| TC02 | QA_TC02_{MODULO}_{ALCANCE} - {ESCENARIO}   | Scenario: [nombre]        | Borde      |
...

Cobertura: ✅ Happy Path (N) | ✅ Borde (N) | ✅ Error (N)
Consecutivos: ✅ TC01 → TCN sin saltos ni duplicados
Listos para publicar como Tasks en HU #[ID]
```

### Si hay errores

```
tc-formatter: ⚠️ Se encontraron N problemas

TC02: ❌ Consecutivo incorrecto — debe ser TC02, se recibió TC2
TC04: ❌ Falta ALCANCE en el título
TC06: ⚠️ Sin trazabilidad Gherkin — no se encontró escenario de origen

Cobertura: ✅ Happy Path | ❌ Faltan casos de Error

Corrige los problemas antes de publicar.
```

---

## Restricciones

- **NUNCA** publica un TC con formato inválido — devuelve error al qa-agent
- **NUNCA** asume el módulo si no está explícito en el input
- **NUNCA** omite la validación de trazabilidad Gherkin aunque el título sea formalmente correcto
- **NUNCA** asigna consecutivos sin consultar las Tasks existentes en la HU

---

*skill v1.0 — parte del ecosistema qa-agent · Equipo FLIT*