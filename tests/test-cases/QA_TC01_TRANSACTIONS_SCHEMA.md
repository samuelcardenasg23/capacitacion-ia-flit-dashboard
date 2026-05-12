# Test Case: QA_TC01_TRANSACTIONS_SCHEMA - Validacion de esquema Zod para transaccion

**Módulo:** Transacciones
**Alcance:** Esquema (Unit Test)
**Historia de Usuario:** [Story 002: Registro de Transacciones Financieras](stories/story-002-create-transactions.md)

## Escenario
Validar que el esquema de Zod para la creación de transacciones rechaza datos inválidos y acepta datos válidos.

### Pasos

1.  **Given** el esquema de Zod para una nueva transacción.
2.  **When** se intenta validar un objeto con datos que **no cumplen** el esquema (e.g., `amount` no es un número, `type` es inválido, `category` está vacío).
3.  **Then** la validación debe fallar con un error descriptivo.
4.  **When** se intenta validar un objeto con todos los datos requeridos y válidos.
5.  **Then** la validación debe ser exitosa.
