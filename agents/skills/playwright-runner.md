# playwright-runner · Skill v1.0

| Campo | Valor |
|---|---|
| **Identificador** | `playwright-runner` |
| **Invocada por** | `qa-agent` — Modos B y D |
| **Propósito** | Ejecutar suites de tests E2E con Playwright, validar APIs REST y capturar evidencia estructurada por TC |

---

## Inputs

| Campo | Requerido | Descripción |
|---|---|---|
| `hu_id` | Sí | ID de la HU cuyos TCs se van a ejecutar |
| `tcs` | Sí | Lista de TCs (Tasks) a ejecutar con su tipo (E2E, API, BD) |
| `ambiente` | Sí | `DEV` / `QA` — nunca Producción sin autorización explícita |
| `base_url` | Sí | URL base del ambiente sobre el que se ejecutan los tests |
| `spec_files` | Condicional | Archivos `.spec.ts` a ejecutar — requerido para TCs automatizados |
| `fixtures` | Condicional | Fixtures JSON del módulo en `tests/fixtures/` — requerido si los tests usan datos de prueba |
| `db_connection` | Condicional | Cadena de conexión a BD — requerido para TCs de verificación SQL |

Si algún input requerido falta, la skill lo reporta al qa-agent y no ejecuta hasta recibirlo.

---

## Proceso

### 1. Clasificar TCs por capa

Antes de ejecutar, clasifica cada TC según su capa:

| Tipo | Capa | Herramienta |
|---|---|---|
| UI / E2E | Playwright browser | `.spec.ts` con page objects |
| API | Playwright APIRequestContext | Request/response validation |
| BD | SQL query | Verificación de integridad post-flujo |
| Manual | Guía paso a paso | El qa-agent guía al QA humano |

### 2. Ejecutar por capa

**E2E / UI:**
```bash
npx playwright test [spec_file] --project=chromium --reporter=html
```
- Captura screenshot en cada paso crítico
- Graba video del flujo completo si el TC es Crítico o Alto
- Captura trace para debugging si el TC falla

**API:**
```bash
# Vía Playwright APIRequestContext o curl
curl -X [METHOD] [base_url]/[endpoint] \
  -H "Content-Type: application/json" \
  -d '[body]'
```
- Registra request completo (método, headers, body)
- Registra response completo (status code, headers, body)
- Verifica contra el contrato esperado en los AC

**BD:**
```sql
-- Consulta de verificación post-flujo
SELECT [campos_esperados] FROM [tabla] WHERE [condicion];
```
- Verifica que los registros existan o no existan según el escenario
- Verifica integridad referencial si el flujo involucra múltiples tablas
- Verifica rollback si el escenario es de error con transacción

### 3. Evaluar resultado por TC

| Resultado | Criterio |
|---|---|
| ✅ Pass | Todas las assertions del TC se cumplen |
| ❌ Fail | Al menos una assertion falla |
| ⚠️ Flaky | El TC pasó en un intento pero falló en otro — se reporta como hallazgo |
| ⏭️ Skip | El TC no pudo ejecutarse por dependencia faltante — se reporta con razón |

### 4. Registrar evidencia por TC

Para cada TC ejecutado, genera un bloque de evidencia:

```
TC{##} — [título FLIT] — ✅ Pass / ❌ Fail
Ambiente: [DEV/QA] | Build: [número] | Timestamp: [fecha hora]
[Screenshot o log adjunto]
[Para API: request + response]
[Para BD: query ejecutada + resultado]
```

Toda la evidencia se registra en el Discussion de la HU, agrupada por TC.

---

## Output

### Ejecución completada

```
playwright-runner: Ejecución completada — HU #[ID] | Ambiente: [QA/DEV] | Build: [N]

TC01 ✅ E2E — personas-registro.spec.ts:23
TC02 ✅ API — POST /api/personas → 400 ✅
TC03 ✅ API — POST /api/personas → 400 ✅
TC04 ✅ E2E — validación tamaño archivo
TC05 ✅ E2E — validación formato archivo
TC06 ✅ BD — rollback verificado, 0 registros huérfanos
TC07 ❌ API — POST /api/personas → esperado 409, recibido 500

Resultado: 6/7 TCs pasan
TCs fallidos: TC07
Evidencia registrada en Discussion de HU #[ID]

Activando bug-reporter para TC07.
```

### Si el ambiente no está disponible

```
playwright-runner: ⚠️ No se puede ejecutar

El ambiente [QA/DEV] no responde en [base_url].
Verifica que el deploy esté activo antes de ejecutar.
Reportando al QA humano para que confirme el estado del ambiente.
```

---

## Restricciones

- **NUNCA** ejecuta contra Producción sin autorización explícita del Líder Técnico
- **NUNCA** registra credenciales reales en logs, screenshots ni evidencia
- **NUNCA** marca un TC como Pass sin evidencia que lo respalde
- **NUNCA** omite TCs de la lista de ejecución — si un TC no puede ejecutarse, lo marca como Skip con razón
- **NUNCA** ejecuta sobre un ambiente no especificado en los inputs

---

*skill v1.0 — parte del ecosistema qa-agent · Equipo FLIT*