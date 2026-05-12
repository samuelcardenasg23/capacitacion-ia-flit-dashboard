# Test Case: QA_TC03_TRANSACTIONS_API - Intento de creacion de transaccion sin autenticacion

**Módulo:** Transacciones
**Alcance:** API (Integration Test)
**Historia de Usuario:** [Story 002: Registro de Transacciones Financieras](stories/story-002-create-transactions.md)

## Escenario
Verificar que el sistema rechaza la creación de transacciones si el usuario no está autenticado.

### Pasos

1.  **Given** un payload de transacción con datos válidos.
2.  **When** se envía una petición `POST` a `/transactions` con el payload pero **sin** un token de autenticación.
3.  **Then** el servidor debe responder con un código de estado `401 Unauthorized`.
4.  **And** no se debe haber creado ninguna transacción en la base de datos.
