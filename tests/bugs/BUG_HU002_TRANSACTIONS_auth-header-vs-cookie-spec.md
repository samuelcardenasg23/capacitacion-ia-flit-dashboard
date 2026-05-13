# [TRANSACTIONS] Spec de integración usa mecanismo de auth incorrecto — Authorization header en vez de cookie — DEV

**Severidad:** Alto
**Ambiente:** DEV
**HU relacionada:** #002
**Módulo:** TRANSACTIONS
**Archivos afectados:**
- `server/tests/integration/create-transactions.spec.ts` (mecanismo de auth incorrecto)
- `server/src/plugins/auth.ts:7` (contrato real del middleware)
**Fecha:** 2026-05-13

## Descripción

El spec `server/tests/integration/create-transactions.spec.ts` envía el token de
autenticación mediante el header `Authorization: Bearer FAKE_JWT_TOKEN_FOR_TESTING`,
pero el plugin de auth (`server/src/plugins/auth.ts`) lee exclusivamente la cookie
`access_token`. El token nunca es leído por el middleware, que devuelve 401 de
inmediato al no encontrar la cookie. Adicionalmente, el token usado es un string
estático no válido; aunque se corrigiera el mecanismo, seguiría siendo rechazado
por `verifyToken()`. Los TCs autenticados (TC01, TC02, TC04) no pueden pasar
mientras persista este defecto.

## Pasos para reproducir

1. Arrancar el servidor en DEV (`npm run dev` en `server/`).
2. Ejecutar: `npx playwright test server/tests/integration/create-transactions.spec.ts`.
3. Observar que TC01, TC02 y TC04 reciben `401` pese a enviar el header `Authorization`.
4. Revisar `server/src/plugins/auth.ts:7` — el middleware solo lee `request.cookies['access_token']`.

## Resultado esperado

Los TCs autenticados deben obtener un token JWT real haciendo `POST /auth/login`
en el setup de la suite, almacenar el `access_token` como cookie y enviarlo en cada
request subsiguiente, obteniendo así las respuestas `201` y `400` esperadas.

## Resultado observado

| TC | Esperado | Recibido |
|----|----------|----------|
| TC01 Happy Path | `201` | `401` |
| TC02 Missing amount | `400` | `401` |
| TC03 Sin auth | `401` | `401` ✓ PASS |
| TC04 Amount inválido | `400` | `401` |

## Evidencia

```typescript
// spec — mecanismo incorrecto
headers: { 'Authorization': 'Bearer FAKE_JWT_TOKEN_FOR_TESTING' }

// server/src/plugins/auth.ts:7 — fuente de verdad
const token = request.cookies['access_token'];
// Si no hay cookie → 401 inmediato, el header nunca se lee.
```

## Fix sugerido

Agregar un `beforeAll` en el spec que llame a `POST /auth/login` con credenciales
de prueba DEV, capture la cookie `access_token` de la respuesta y la inyecte en
cada request autenticado.

## Asignación

Directo al desarrollador de la HU #002 (bug encontrado en DEV dentro de la HU).
