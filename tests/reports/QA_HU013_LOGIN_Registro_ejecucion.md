# Reporte de Ejecución QA — HU #013: Funcionalidad de Logout

**Ambiente:** DEV
**Base URL:** http://localhost:5173
**Spec ejecutado:** `tests/e2e/hu013-logout.spec.ts`
**Timestamp:** 2026-05-13
**Resultado global:** ⚠️ PARCIAL — 2/4 TCs pasan | 1 bug radicado

---

## Resultados por TC

| TC FLIT | Descripción | Tipo | Resultado | Detalle |
|---------|-------------|------|-----------|---------|
| QA_TC01_LOGIN_LOGOUT | Logout exitoso después de login válido | E2E | ✅ PASS | Redirige a /dashboard, nombre y botón logout visibles (1.3s) |
| QA_TC02_LOGIN_LOGOUT | Estado de sesión se limpia del localStorage al hacer logout | E2E | ❌ FAIL | `auth_fake='true'` persiste en localStorage tras logout |
| QA_TC03_LOGIN_LOGOUT | Acceso denegado a ruta protegida después del logout | E2E | ❌ FAIL | `/dashboard` accesible tras logout — no redirige a `/login` |
| QA_TC04_LOGIN_LOGOUT | Botón de logout no visible sin autenticación activa | E2E | ✅ PASS | Guard redirige a /login, botón no visible (298ms) |

---

## Salida del runner

```
Running 4 tests using 1 worker

  ✓  1 [chromium] QA_TC01_LOGIN_LOGOUT - Logout exitoso después de login válido (1.3s)
  ✘  2 [chromium] QA_TC02_LOGIN_LOGOUT - Estado de sesión se limpia del localStorage al hacer logout (509ms)
  ✘  3 [chromium] QA_TC03_LOGIN_LOGOUT - Acceso denegado a ruta protegida después del logout (5.5s)
  ✓  4 [chromium] QA_TC04_LOGIN_LOGOUT - Botón de logout no visible sin autenticación activa (298ms)

2 failed | 2 passed — duración total: 10.1s
```

---

## Bugs radicados en esta ronda

| ID | Título | Severidad | Estado |
|----|--------|-----------|--------|
| BUG-HU013-01 | localStorage no se limpia al hacer logout permitiendo re-acceso a rutas protegidas | Alto | 🔴 Pendiente fix del desarrollador |

---

## Causa raíz de los fallos

`localStorage.removeItem('auth_fake')` está comentado en `src/hooks/useAuth.ts:27`.
El hook `useAuth` inicializa su estado leyendo `localStorage` en cada montaje. Al
navegar a `/dashboard` tras el logout, `MainLayout` re-monta el hook, que encuentra
`auth_fake='true'` y considera al usuario autenticado — saltando el guard de ruta.

---

## Condición de desbloqueo

TC02 y TC03 quedan **bloqueados** hasta que el desarrollador descomentar:

```typescript
// src/hooks/useAuth.ts:27
localStorage.removeItem('auth_fake');
```

---

## Cobertura de la ronda

| Tipo | Total TCs | Ejecutados | Pass | Fail | Skip |
|------|-----------|------------|------|------|------|
| E2E  | 4         | 4          | 2    | 2    | 0    |
| **Total** | **4** | **4** | **2** | **2** | **0** |

---

## Trazabilidad

| TC FLIT | Escenario Gherkin | Archivo |
|---------|-------------------|---------|
| QA_TC01_LOGIN_LOGOUT | Scenario: Usuario hace logout exitosamente después de login | `tests/test-cases/QA_TC01_LOGIN_LOGOUT.md` |
| QA_TC02_LOGIN_LOGOUT | Scenario: Estado se limpia después del logout | `tests/test-cases/QA_TC02_LOGIN_LOGOUT.md` |
| QA_TC03_LOGIN_LOGOUT | Scenario: Acceso denegado a rutas protegidas después del logout | `tests/test-cases/QA_TC03_LOGIN_LOGOUT.md` |
| QA_TC04_LOGIN_LOGOUT | Scenario: Botón de logout no visible en página de login | `tests/test-cases/QA_TC04_LOGIN_LOGOUT.md` |

---

## Evidencia

- `tests/reports/TC01_login_exitoso.png`
- `tests/reports/TC04_logout_no_visible_sin_auth.png`
- `test-results/hu013-logout-HU-013-Logout-1c32f-.../test-failed-1.png` (TC02)
- `test-results/hu013-logout-HU-013-Logout-1c32f-.../video.webm` (TC02)
- `test-results/hu013-logout-HU-013-Logout-16145-.../test-failed-1.png` (TC03)
- `test-results/hu013-logout-HU-013-Logout-16145-.../video.webm` (TC03)
