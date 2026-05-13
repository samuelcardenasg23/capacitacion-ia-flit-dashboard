# Test Case: QA_TC03_LOGIN_LOGOUT - Acceso denegado a ruta protegida después del logout

**Módulo:** LOGIN
**Alcance:** LOGOUT (E2E)
**Historia de Usuario:** [Story 013: Funcionalidad de Logout](stories/story-013-logout-functionality.md)
**Resultado:** ❌ FAIL — BUG-HU013-01

## Escenario Gherkin de origen

> Scenario: Acceso denegado a rutas protegidas después del logout

## Pasos

1. **Given** el usuario está autenticado en `/dashboard`
2. **When** el usuario hace click en el botón de logout
3. **Then** el usuario es redirigido a `/login`
4. **When** el usuario intenta navegar directamente a `/dashboard`
5. **Then** el usuario es redirigido a `/login`
6. **And** el contenido del dashboard no es visible

## Datos de prueba

| Campo    | Valor               |
|----------|---------------------|
| email    | test@example.com    |
| password | password123         |

## Assertions

- Tras logout: `page.url()` contiene `/login`
- Al navegar a `/dashboard`: `page.url()` contiene `/login`
- `text=Analytics Overview` no es visible

## Resultado de ejecución

- **Estado:** FAIL
- **Duración:** 5.5s
- **Spec:** `tests/e2e/hu013-logout.spec.ts:91`
- **Ambiente:** DEV | http://localhost:5173
- **Fecha:** 2026-05-13

## Error capturado

```
Error: expect(page).toHaveURL(/\/login/) failed
Expected pattern: /\/login/
Received string:  "http://localhost:5173/dashboard"
Timeout: 5000ms (14 checks — unexpected value "/dashboard" en todos)

  at tests/e2e/hu013-logout.spec.ts:91:24
```

## Causa raíz

Al navegar a `/dashboard` tras el logout, `MainLayout` monta `useAuth()` nuevamente.
`useState(getInitialUser)` llama `getInitialUser()` que lee `localStorage.auth_fake`.
Como la clave no fue eliminada (BUG-HU013-01), retorna `MOCK_USER` → `isAuthenticated=true`
→ el guard de `MainLayout` no redirige → usuario accede al dashboard sin autenticarse.

## Evidencia

- Screenshot: `test-results/hu013-logout-HU-013-Logout-16145-.../test-failed-1.png`
- Video: `test-results/hu013-logout-HU-013-Logout-16145-.../video.webm`

## Bug asociado

BUG-HU013-01 → `tests/bugs/BUG_HU013_LOGIN_localStorage-no-se-limpia-logout.md`
