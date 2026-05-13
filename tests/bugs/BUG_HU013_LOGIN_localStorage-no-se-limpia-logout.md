# [LOGIN] localStorage no se limpia al hacer logout permitiendo re-acceso a rutas protegidas — DEV

**Severidad:** Alto
**Ambiente:** DEV
**HU relacionada:** #HU-013
**Módulo:** LOGIN
**Archivos afectados:**
- `src/hooks/useAuth.ts:27` (línea comentada — causa raíz)
**Fecha:** 2026-05-13
**TCs fallidos:** QA_TC02_LOGIN_LOGOUT, QA_TC03_LOGIN_LOGOUT

## Descripción

La función `logout()` en `useAuth.ts` llama `setUser(null)` para limpiar el estado
React, pero **no elimina la clave `auth_fake` del localStorage**. Como consecuencia,
al navegar a `/dashboard` después del logout (o al recargar la página), `getInitialUser()`
vuelve a leer `localStorage`, encuentra `auth_fake='true'` y re-autentica al usuario
automáticamente, permitiendo acceso a rutas protegidas sin un nuevo login.

## Pasos para reproducir

1. Navegar a `http://localhost:5173/login`.
2. Ingresar email y contraseña válidos → click en "Sign In".
3. Verificar redirección a `/dashboard`.
4. Click en el botón de logout (ícono en el header).
5. Verificar redirección a `/login`.
6. En la barra del navegador, ir directamente a `http://localhost:5173/dashboard`.

## Resultado esperado

- **Paso 5:** Usuario redirigido a `/login`.
- **Paso 6:** Usuario redirigido a `/login` — el guard de `MainLayout` bloquea el acceso.
- `localStorage.getItem('auth_fake')` retorna `null`.

## Resultado observado

- **Paso 6:** Usuario accede a `/dashboard` sin ser redirigido. URL permanece en `/dashboard`.
- `localStorage.getItem('auth_fake')` retorna `"true"` después del logout.

| TC | Assertion | Esperado | Observado |
|----|-----------|----------|-----------|
| TC02 | `localStorage.getItem('auth_fake')` | `null` | `"true"` |
| TC03 | URL tras navegar a `/dashboard` post-logout | `/login` | `/dashboard` |

## Causa raíz

```typescript
// src/hooks/useAuth.ts — línea 27
const logout = () => {
  // BUG: localStorage no se limpia, causando que el usuario se reloguee automáticamente
  // localStorage.removeItem('auth_fake');   ← DESCOMENTAR ESTA LÍNEA
  setUser(null);
};
```

`useState(getInitialUser)` inicializa el estado leyendo `localStorage` en cada nuevo
montaje del hook. Al navegar a `/dashboard`, `MainLayout` monta `useAuth()` de nuevo,
`getInitialUser()` encuentra `auth_fake='true'` y devuelve `MOCK_USER`, por lo que
`isAuthenticated` es `true` y el guard no redirige.

## Fix

Descomentar `localStorage.removeItem('auth_fake')` en `src/hooks/useAuth.ts:27`.

```typescript
const logout = () => {
  localStorage.removeItem('auth_fake');
  setUser(null);
};
```

## Evidencia

- **TC02 screenshot:** `test-results/hu013-logout-HU-013-Logout-1c32f-.../test-failed-1.png`
- **TC02 video:** `test-results/hu013-logout-HU-013-Logout-1c32f-.../video.webm`
- **TC03 screenshot:** `test-results/hu013-logout-HU-013-Logout-16145-.../test-failed-1.png`
- **TC03 video:** `test-results/hu013-logout-HU-013-Logout-16145-.../video.webm`
- **Spec:** `tests/e2e/hu013-logout.spec.ts`

## Asignación

Directo al desarrollador de HU-013 (bug encontrado en DEV dentro de la HU).
