---
name: playwright-runner
description: Ejecuta suites de tests E2E con Playwright, valida APIs REST y captura evidencia estructurada por TC. Usar cuando el qa-agent necesita ejecutar TCs automatizados de una HU en ambiente DEV o QA.
when_to_use: Invocar en Modo B (ejecución automatizada de TCs de una HU) y Modo D (re-ejecución de TCs fallidos o regresión). Activar cuando se necesite ejecutar tests E2E con Playwright, validar endpoints REST, verificar integridad en BD, o capturar evidencia por TC para registrar en el Discussion de Azure DevOps. No ejecutar contra Producción sin autorización explícita del Líder Técnico.
allowed-tools: Bash(npx playwright *) Bash(curl *) Bash(cat *) Bash(ls *)
---

# playwright-runner

Ejecuta suites de tests E2E con Playwright, valida APIs REST y captura evidencia estructurada por TC. Invocada por el `qa-agent` en Modos B y D.

## Inputs requeridos

Antes de ejecutar, verificar que todos los siguientes inputs estén presentes. Si alguno falta, reportarlo al qa-agent y no ejecutar hasta recibirlo.

| Campo           | Requerido   | Descripción                                                                                 |
| --------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `hu_id`         | Siempre     | ID de la HU cuyos TCs se van a ejecutar                                                     |
| `tcs`           | Siempre     | Lista de TCs (Tasks) a ejecutar con su tipo (E2E, API, BD)                                  |
| `ambiente`      | Siempre     | `DEV` / `QA` — nunca Producción sin autorización explícita                                  |
| `base_url`      | Siempre     | URL base del ambiente sobre el que se ejecutan los tests                                    |
| `spec_files`    | Condicional | Archivos `.spec.ts` a ejecutar — requerido para TCs automatizados                           |
| `fixtures`      | Condicional | Fixtures JSON del módulo en `tests/fixtures/` — requerido si los tests usan datos de prueba |
| `db_connection` | Condicional | Cadena de conexión a BD — requerido para TCs de verificación SQL                            |

## Proceso

### 1. Clasificar TCs por capa

Antes de ejecutar, clasificar cada TC según su capa:

| Tipo     | Capa                         | Herramienta                           |
| -------- | ---------------------------- | ------------------------------------- |
| UI / E2E | Playwright browser           | `.spec.ts` con page objects           |
| API      | Playwright APIRequestContext | Validación request/response           |
| BD       | SQL query                    | Verificación de integridad post-flujo |
| Manual   | Guía paso a paso             | El qa-agent guía al QA humano         |

### 2. Ejecutar por capa

**E2E / UI:**

```bash
npx playwright test [spec_file] --project=chromium --reporter=html
```

- Capturar screenshot en cada paso crítico.
- Grabar video del flujo completo si el TC es Crítico o Alto.
- Capturar trace para debugging si el TC falla.

**API:**

```bash
curl -X [METHOD] [base_url]/[endpoint] \
  -H "Content-Type: application/json" \
  -d '[body]'
```

- Registrar request completo (método, headers, body).
- Registrar response completo (status code, headers, body).
- Verificar contra el contrato esperado en los AC.

**BD:**

```sql
SELECT [campos_esperados] FROM [tabla] WHERE [condicion];
```

- Verificar que los registros existan o no según el escenario.
- Verificar integridad referencial si el flujo involucra múltiples tablas.
- Verificar rollback si el escenario es de error con transacción.

### 3. Evaluar resultado por TC

| Resultado | Criterio                                                               |
| --------- | ---------------------------------------------------------------------- |
| Pass      | Todas las assertions del TC se cumplen                                 |
| Fail      | Al menos una assertion falla                                           |
| Flaky     | El TC pasó en un intento pero falló en otro — reportar como hallazgo   |
| Skip      | El TC no pudo ejecutarse por dependencia faltante — reportar con razón |

### 4. Registrar evidencia por TC

Para cada TC ejecutado, generar un bloque de evidencia con el siguiente formato:

```
TC{##} — [título FLIT] — Pass / Fail
Ambiente: [DEV/QA] | Build: [número] | Timestamp: [fecha hora]
[Screenshot o log adjunto]
[Para API: request + response]
[Para BD: query ejecutada + resultado]
```

Toda la evidencia se registra en el Discussion de la HU, agrupada por TC.

## Output

### Ejecución completada

```
playwright-runner: Ejecución completada — HU #[ID] | Ambiente: [QA/DEV] | Build: [N]

TC01 [PASS] E2E — personas-registro.spec.ts:23
TC02 [PASS] API — POST /api/personas -> 400
TC03 [PASS] API — POST /api/personas -> 400
TC04 [PASS] E2E — validacion tamano archivo
TC05 [PASS] E2E — validacion formato archivo
TC06 [PASS] BD — rollback verificado, 0 registros huerfanos
TC07 [FAIL] API — POST /api/personas -> esperado 409, recibido 500

Resultado: 6/7 TCs pasan
TCs fallidos: TC07
Evidencia registrada en Discussion de HU #[ID]

Activando bug-reporter para TC07.
```

### Ambiente no disponible

```
playwright-runner: [ADVERTENCIA] No se puede ejecutar

El ambiente [QA/DEV] no responde en [base_url].
Verifica que el deploy este activo antes de ejecutar.
Reportando al QA humano para que confirme el estado del ambiente.
```

## Restricciones

- Nunca ejecutar contra Producción sin autorización explícita del Líder Técnico.
- Nunca registrar credenciales reales en logs, screenshots ni evidencia.
- Nunca marcar un TC como Pass sin evidencia que lo respalde.
- Nunca omitir TCs de la lista de ejecución — si un TC no puede ejecutarse, marcarlo como Skip con razón.
- Nunca ejecutar sobre un ambiente no especificado en los inputs.
