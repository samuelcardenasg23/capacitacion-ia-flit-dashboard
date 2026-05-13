# Reporte de Ejecución QA — HU #002: Registro de Transacciones Financieras

**Ambiente:** DEV
**Base URL:** http://localhost:3001
**Spec ejecutado:** `server/tests/integration/create-transactions.spec.ts`
**Timestamp:** 2026-05-13
**Resultado global:** ⚠️ BLOQUEADO — 1/4 TCs pasan | 2 bugs radicados

---

## Resultados por TC

| TC FLIT | Descripción | Tipo | Resultado | Detalle |
|---------|-------------|------|-----------|---------|
| QA_TC01_TRANSACTIONS_SCHEMA | Validación de esquema Zod para transacción | Unit | ⚠️ SKIP | Sin spec Playwright — cubierto por Vitest |
| QA_TC02_TRANSACTIONS_API | Transacción exitosa con datos válidos | Integration | ❌ FAIL | Esperado `201`, recibido `401` |
| QA_TC03_TRANSACTIONS_API | POST sin token devuelve 401 | Integration | ✅ PASS | `401` correcto |
| QA_TC04_TRANSACTIONS_API | Datos inválidos devuelven 400 por Zod | Integration | ❌ FAIL | Esperado `400`, recibido `401` |
| QA_TC05_TRANSACTIONS_API | Campo obligatorio faltante devuelve 400 | Integration | ❌ FAIL | Esperado `400`, recibido `401` |
| QA_TC06_TRANSACTIONS_API | Omitir date usa fecha por defecto | Integration | ⚠️ SKIP | Sin cobertura en spec actual |

---

## Salida del runner

```
Running 4 tests using 1 worker

  ✘  1 › POST /transactions API › should create a transaction successfully with valid data (342ms)
         Expected: 201 | Received: 401

  ✘  2 › POST /transactions API › should return 400 if required field "amount" is missing (327ms)
         Expected: 400 | Received: 401

  ✓  3 › POST /transactions API › should return 401 if user is not authenticated (332ms)

  ✘  4 › POST /transactions API › should return 400 if "amount" has an invalid format (7ms)
         Expected: 400 | Received: 401

3 failed | 1 passed — duración total: 2.0s
```

---

## Bugs radicados en esta ronda

| ID | Título | Severidad | Estado |
|----|--------|-----------|--------|
| BUG-HU002-01 | Puerto incorrecto hardcodeado en spec (3000 vs 3001) | Alto | ✅ Corregido en esta sesión |
| BUG-HU002-02 | Spec usa Authorization header en vez de cookie `access_token` | Alto | 🔴 Pendiente fix del desarrollador |

---

## Causa raíz de los fallos

El middleware de autenticación (`server/src/plugins/auth.ts:7`) lee exclusivamente
la cookie `access_token`. El spec envía `Authorization: Bearer FAKE_JWT_TOKEN_FOR_TESTING`
vía header, mecanismo que el servidor no contempla. El 401 se dispara antes de que
cualquier lógica de negocio o validación Zod sea alcanzada.

## Condición de desbloqueo

Los TCs TC02, TC04 y TC05 quedan **bloqueados** hasta que el spec implemente un
`beforeAll` que ejecute `POST /auth/login` con credenciales de prueba DEV, capture
la cookie `access_token` y la propague en cada request autenticado.

TC06 (omitir `date`) requiere además ser añadido al spec antes de poder ejecutarse.

---

## Cobertura de la ronda

| Tipo | Total TCs | Ejecutados | Pass | Fail | Skip/Bloqueado |
|------|-----------|------------|------|------|----------------|
| Unit | 1 | 0 | 0 | 0 | 1 |
| Integration | 5 | 4 | 1 | 3 | 1 |
| **Total** | **6** | **4** | **1** | **3** | **2** |
