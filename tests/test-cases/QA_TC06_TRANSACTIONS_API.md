# Test Case: QA_TC06_TRANSACTIONS_API - Omitir date usa fecha actual por defecto

**Módulo:** Transacciones
**Alcance:** API (Integration Test)
**Historia de Usuario:** [Story 002: Registro de Transacciones Financieras](stories/story-002-create-transactions.md)
**Tipo:** Borde
**Gherkin origen:** Scenario: Campo date omitido usa valor por defecto

## Escenario

Verificar que el campo `date` es opcional y cuando se omite el registro se guarda con la fecha actual como valor por defecto.

### Pasos

1. **Given** un usuario autenticado con un token JWT válido.
2. **And** un payload de transacción válido con `amount`, `type` y `category` pero **sin** el campo `date`.
3. **When** el usuario envía una petición `POST` a `/transactions` con ese payload.
4. **Then** el servidor debe responder con código de estado `201 Created`.
5. **And** la transacción creada debe tener el campo `date` establecido con la fecha y hora actuales (valor por defecto del modelo).
6. **And** la transacción debe estar registrada en la base de datos asociada al `organizationId` del usuario.
