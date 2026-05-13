# HU-013: Funcionalidad de Logout después de Login Exitoso

## Descripción
Como usuario autenticado, necesito poder hacer logout de la aplicación para cerrar mi sesión de forma segura y regresar a la pantalla de login.

## Criterios de Aceptación
- El botón de logout debe estar visible en el header cuando el usuario esté autenticado
- Al hacer click en el botón de logout, la sesión debe cerrarse completamente
- El usuario debe ser redirigido a la página de login
- El estado de autenticación debe limpiarse del localStorage
- El usuario no debe poder acceder a rutas protegidas después del logout

## Especificación Gherkin

```gherkin
Feature: Logout Functionality
  Como usuario autenticado
  Quiero poder hacer logout de la aplicación
  Para cerrar mi sesión de forma segura

  Background:
    Given el usuario está en la página de login

  Scenario: Usuario hace logout exitosamente después de login
    When el usuario ingresa credenciales válidas
    And el usuario hace click en el botón "Sign In"
    Then el usuario debe ser redirigido al dashboard
    And el usuario debe ver su nombre en el header
    And el botón de logout debe estar visible

  Scenario: Estado se limpia después del logout
    Given el usuario está autenticado
    And el usuario está en el dashboard
    When el usuario hace click en el botón de logout
    Then el usuario debe ser redirigido a la página de login
    And el localStorage no debe contener datos de sesión
    And el usuario no debe poder acceder a /dashboard

  Scenario: Acceso denegado a rutas protegidas después del logout
    Given el usuario está autenticado
    And el usuario está en el dashboard
    When el usuario hace click en el botón de logout
    And el usuario intenta acceder directamente a /dashboard
    Then el usuario debe ser redirigido a /login
    And no debe ver contenido del dashboard

  Scenario: Botón de logout no visible en página de login
    Given el usuario está en la página de login
    When el usuario intenta navegar directamente al dashboard sin autenticación
    Then el usuario debe ser redirigido a /login
    And el botón de logout no debe estar visible
```

## Notas Técnicas
- El logout debe limpiar `localStorage.auth_fake`
- El estado del usuario debe resetearse a `null`
- La navegación debe usar React Router para redirigir a `/login`
- El hook `useAuth()` es responsable de manejar la lógica de logout

## Dependencias
- HU-001: Autenticación básica (login)
- Hook: `useAuth()`
- Componentes: Header, MainLayout
