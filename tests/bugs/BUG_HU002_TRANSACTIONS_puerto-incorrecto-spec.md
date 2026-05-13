# [TRANSACTIONS] Puerto incorrecto hardcodeado en spec de integración bloquea ejecución de todos los TCs — DEV

**Severidad:** Alto
**Ambiente:** DEV
**HU relacionada:** #002
**Módulo:** TRANSACTIONS
**Archivo afectado:** `server/tests/integration/create-transactions.spec.ts:4`
**Fecha:** 2026-05-13

## Descripción

El archivo de spec de integración `server/tests/integration/create-transactions.spec.ts`
tiene hardcodeado el puerto 3000 en la variable `baseURL` (línea 4), pero el servidor
arranca en el puerto 3001 según `server/src/server.ts`. Esto provoca que todos los
TCs de la HU #002 fallen con conexión rechazada antes de evaluar cualquier lógica
de negocio, haciendo que la suite de integración sea completamente inútil mientras
el defecto persista.

## Pasos para reproducir

1. Arrancar el servidor con `npm run dev` desde la carpeta `server/`.
2. Verificar que el servidor escucha en `http://localhost:3001`.
3. Ejecutar la suite: `npx playwright test server/tests/integration/create-transactions.spec.ts`.
4. Observar que todos los TCs fallan con `ECONNREFUSED` contra `localhost:3000`.

## Resultado esperado

El spec debe apuntar a `http://localhost:3001` (puerto definido en `server/src/server.ts`)
y todos los TCs deben poder conectarse al servidor para evaluar las respuestas HTTP.

## Resultado observado

La variable `baseURL` en la línea 4 del spec tiene el valor `'http://localhost:3000'`.
El servidor no escucha en ese puerto. Resultado: `ECONNREFUSED` en todos los TCs
(TC01 a TC04 del spec), ninguno produce evidencia válida de pass/fail.

## Evidencia

```typescript
// server/tests/integration/create-transactions.spec.ts — línea 4
const baseURL = 'http://localhost:3000';  // ← defecto: debe ser 3001

// server/src/server.ts — fuente de verdad
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
```

## Asignación

Directo al desarrollador de la HU #002 (bug encontrado en DEV dentro de la HU).
