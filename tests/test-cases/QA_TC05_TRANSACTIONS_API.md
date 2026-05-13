# Test Case: QA_TC05_TRANSACTIONS_API - Campo obligatorio faltante devuelve 400

**Módulo:** Transacciones
**Alcance:** API (Integration Test)
**Historia de Usuario:** [Story 002: Registro de Transacciones Financieras](stories/story-002-create-transactions.md)
**Tipo:** Borde
**Gherkin origen:** Scenario: Campo obligatorio faltante en el body

## Escenario

Verificar que el endpoint rechaza un body al que le falta un campo requerido y retorna 400.

### Pasos

1. **Given** un usuario autenticado con un token JWT válido.
2. **And** un payload de transacción al que le falta el campo `amount` (campo obligatorio según el schema Zod).
3. **When** el usuario envía una petición `POST` a `/transactions` con ese payload incompleto.
4. **Then** el servidor debe responder con código de estado `400 Bad Request`.
5. **And** el cuerpo de la respuesta debe indicar que el campo `amount` es requerido.
6. **And** no se debe haber creado ninguna transacción en la base de datos.
