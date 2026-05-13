# Test Case: QA_TC02_LOGIN_LOGOUT - Estado de sesión se limpia del localStorage al hacer logout

**Módulo:** LOGIN
**Alcance:** LOGOUT (E2E)
**Historia de Usuario:** [Story 013: Funcionalidad de Logout](stories/story-013-logout-functionality.md)
**Resultado:** ❌ FAIL — BUG-HU013-01

## Escenario Gherkin de origen

> Scenario: Estado se limpia después del logout

## Pasos

1. **Given** el usuario está autenticado en `/dashboard`
2. **When** el usuario hace click en el botón de logout
3. **Then** el usuario es redirigido a `/login`
4. **And** `localStorage.getItem('auth_fake')` retorna `null`
5. **And** al navegar a `/dashboard` el usuario es redirigido a `/login`

## Datos de prueba

| Campo    | Valor               |
|----------|---------------------|
| email    | test@example.com    |
| password | password123         |

## Assertions

- `page.url()` contiene `/login` después del logout
- `localStorage.getItem('auth_fake')` === `null`
- Al navegar a `/dashboard`: `page.url()` contiene `/login`

## Resultado de ejecución

- **Estado:** FAIL
- **Duración:** 509ms
- **Spec:** `tests/e2e/hu013-logout.spec.ts:63`
- **Ambiente:** DEV | http://localhost:5173
- **Fecha:** 2026-05-13

## Error capturado

```
Error: expect(received).toBeNull()
Received: "true"

  at tests/e2e/hu013-logout.spec.ts:63:22
```

## Causa raíz

`localStorage.removeItem('auth_fake')` está comentado en `src/hooks/useAuth.ts:27`.
El estado React se limpia (`setUser(null)`) pero `auth_fake` persiste en localStorage.

## Evidencia

- Screenshot: `test-results/hu013-logout-HU-013-Logout-1c32f-.../test-failed-1.png`
- Video: `test-results/hu013-logout-HU-013-Logout-1c32f-.../video.webm`

## Bug asociado

BUG-HU013-01 → `tests/bugs/BUG_HU013_LOGIN_localStorage-no-se-limpia-logout.md`
