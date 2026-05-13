---
name: tc-formatter
description: Valida y estructura Casos de Prueba en formato FLIT estricto, garantizando trazabilidad con el escenario Gherkin de origen. Usar cuando el qa-agent ha generado TCs y necesita validar títulos, consecutivos, trazabilidad Gherkin y cobertura mínima antes de publicarlos como Tasks en Azure DevOps.
when_to_use: Invocada en el Modo A antes de generar o publicar Tasks de QA en Azure DevOps.
---

# tc-formatter

Valida y formatea Casos de Prueba en formato FLIT antes de publicarlos como Tasks en Azure DevOps. Es invocada por el `qa-agent` en Modo A.

## Inputs requeridos

Antes de ejecutar, verificar que todos los siguientes inputs estén presentes. Si alguno falta, reportarlo y detenerse — no producir output hasta recibirlos todos.

- `hu_id` — ID de la HU en Azure DevOps
- `modulo` — nombre del módulo tal como aparece en el work item
- `escenarios_gherkin` — lista de escenarios Gherkin de los AC de la HU
- `tcs_propuestos` — lista de TCs generados por el qa-agent para validar
- `tasks_existentes` — Tasks actuales vinculadas a la HU (para determinar el siguiente consecutivo)

## Pasos de validación

### 1. Formato del título

Cada TC debe cumplir estrictamente este patrón:

```
QA_TC{##}_{MODULO}_{ALCANCE} - {ESCENARIO}
```

| Componente    | Regla                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `QA_TC`       | Prefijo fijo — siempre en mayúsculas                                                             |
| `{##}`        | Consecutivo de 2 dígitos con cero a la izquierda: `01`, `02` ... `99`                            |
| `{MODULO}`    | Nombre exacto del módulo del work item — en mayúsculas, sin espacios (usar guión bajo si aplica) |
| `{ALCANCE}`   | Funcionalidad específica dentro del módulo que se está probando — en mayúsculas                  |
| `{ESCENARIO}` | Descripción corta del caso — en español, capitalizado, sin abreviaciones                         |

Ejemplos válidos:

```
QA_TC01_PERSONAS_Registro - Happy Path con todos los archivos validos
QA_TC02_PERSONAS_Registro - Falta campo obligatorio numero_identificacion
QA_TC01_TRASPASOS_Consulta - Traspaso exitoso entre cuentas del mismo titular
```

Ejemplos inválidos y razón:

```
QA_TC1_PERSONAS_Registro - Happy Path       -> consecutivo sin cero: debe ser TC01
qa_tc01_personas_registro - happy path      -> debe ir en mayúsculas
QA_TC01_PERSONAS - Happy Path               -> falta el ALCANCE
QA_TC01_PERSONAS_Registro Happy Path        -> falta el separador " - "
```

### 2. Consecutivos

- Consultar las Tasks existentes en la HU para determinar el último consecutivo usado.
- El siguiente TC debe ser `último + 1`.
- Si no hay Tasks previas, empezar en `TC01`.
- Si se detecta un salto o duplicado, reportarlo al qa-agent antes de continuar.

### 3. Trazabilidad Gherkin

Cada TC propuesto debe estar trazado a un escenario Gherkin específico de los AC. Verificar:

- Que exista un escenario Gherkin de origen para cada TC.
- Que el `{ALCANCE}` y `{ESCENARIO}` del título reflejen el escenario Gherkin de origen.
- Que no haya TCs sin escenario Gherkin asociado.

Si un TC no tiene trazabilidad clara, marcarlo como `[ADVERTENCIA: sin trazabilidad]` y reportarlo al qa-agent para revisión.

### 4. Cobertura mínima

Verificar que el conjunto de TCs propuestos cubra al menos:

| Tipo       | Mínimo            |
| ---------- | ----------------- |
| Happy Path | 1                 |
| Borde      | 1                 |
| Error      | 1                 |
| Total      | 3 (recomendado 5) |

Si la cobertura mínima no se cumple, advertir al qa-agent indicando los tipos faltantes.

## Output

### Todos los TCs son válidos

```
tc-formatter: [OK] N TCs validados

| TC   | Título                                      | Gherkin origen            | Tipo       |
|------|---------------------------------------------|---------------------------|------------|
| TC01 | QA_TC01_{MODULO}_{ALCANCE} - {ESCENARIO}   | Scenario: [nombre]        | Happy Path |
| TC02 | QA_TC02_{MODULO}_{ALCANCE} - {ESCENARIO}   | Scenario: [nombre]        | Borde      |
...

Cobertura: [OK] Happy Path (N) | [OK] Borde (N) | [OK] Error (N)
Consecutivos: [OK] TC01 -> TCN sin saltos ni duplicados
Listos para publicar como Tasks en HU #[ID]
```

### Se encontraron errores

```
tc-formatter: [ADVERTENCIA] N problemas encontrados

TC02: [ERROR] Consecutivo incorrecto — debe ser TC02, se recibió TC2
TC04: [ERROR] Falta ALCANCE en el título
TC06: [ADVERTENCIA] Sin trazabilidad Gherkin — no se encontró escenario de origen

Cobertura: [OK] Happy Path | [ERROR] Faltan casos de Error

Corrige los problemas antes de publicar.
```

## Restricciones

- Nunca publicar un TC con formato inválido — devolver error al qa-agent.
- Nunca asumir el módulo si no está explícito en el input.
- Nunca omitir la validación de trazabilidad Gherkin aunque el título sea formalmente correcto.
- Nunca asignar consecutivos sin consultar primero las Tasks existentes en la HU.
