# Test Case: QA_TC04_LOGIN_LOGOUT - Botón de logout no visible sin autenticación activa

**Módulo:** LOGIN
**Alcance:** LOGOUT (E2E)
**Historia de Usuario:** [Story 013: Funcionalidad de Logout](stories/story-013-logout-functionality.md)
**Resultado:** ✅ PASS

## Escenario Gherkin de origen

> Scenario: Botón de logout no visible en página de login

## Pasos

1. **Given** el usuario NO está autenticado
2. **When** el usuario navega directamente a `/dashboard`
3. **Then** el usuario es redirigido a `/login`
4. **And** el botón de logout NO es visible en la página

## Assertions

- `page.url()` contiene `/login` al intentar acceder a `/dashboard` sin auth
- `button[title="Logout"]` no es visible

## Resultado de ejecución

- **Estado:** PASS
- **Duración:** 298ms
- **Evidencia:** `tests/reports/TC04_logout_no_visible_sin_auth.png`
- **Spec:** `tests/e2e/hu013-logout.spec.ts:104`
- **Ambiente:** DEV | http://localhost:5173
- **Fecha:** 2026-05-13
