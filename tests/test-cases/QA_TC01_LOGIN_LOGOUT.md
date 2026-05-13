# Test Case: QA_TC01_LOGIN_LOGOUT - Logout exitoso después de login válido

**Módulo:** LOGIN
**Alcance:** LOGOUT (E2E)
**Historia de Usuario:** [Story 013: Funcionalidad de Logout](stories/story-013-logout-functionality.md)
**Resultado:** ✅ PASS

## Escenario Gherkin de origen

> Scenario: Usuario hace logout exitosamente después de login

## Pasos

1. **Given** el usuario está en la página `/login`
2. **When** el usuario ingresa email y contraseña válidos
3. **And** hace click en el botón "Sign In"
4. **Then** el usuario es redirigido a `/dashboard`
5. **And** el header muestra el nombre del usuario ("Jane Doe")
6. **And** el botón de logout (ícono LogOut) está visible en el header

## Datos de prueba

| Campo    | Valor               |
|----------|---------------------|
| email    | test@example.com    |
| password | password123         |

## Assertions

- `page.url()` contiene `/dashboard`
- `header` contiene texto `Jane Doe`
- `header button[title="Logout"]` es visible

## Resultado de ejecución

- **Estado:** PASS
- **Duración:** 1.3s
- **Evidencia:** `tests/reports/TC01_login_exitoso.png`
- **Spec:** `tests/e2e/hu013-logout.spec.ts:18`
- **Ambiente:** DEV | http://localhost:5173
- **Fecha:** 2026-05-13
