# Test Case: QA_TC02_TRANSACTIONS_API - Creacion exitosa de transaccion con datos validos

**Módulo:** Transacciones
**Alcance:** API (Integration Test)
**Historia de Usuario:** [Story 002: Registro de Transacciones Financieras](stories/story-002-create-transactions.md)

## Escenario
Verificar que un usuario autenticado puede crear una transacción exitosamente.

### Pasos

1.  **Given** un usuario autenticado con un token JWT válido.
2.  **And** un payload de transacción con datos válidos (monto, tipo, categoría, descripción, fecha).
3.  **When** el usuario envía una petición `POST` a `/transactions` con el payload y el token de autenticación.
4.  **Then** el servidor debe responder con un código de estado `201 Created`.
5.  **And** la respuesta debe contener los datos de la transacción creada.
6.  **And** la transacción debe estar registrada en la base de datos, asociada al `organizationId` del usuario.
