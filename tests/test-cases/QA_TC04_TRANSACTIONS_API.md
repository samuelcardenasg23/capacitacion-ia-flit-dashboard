# Test Case: QA_TC04_TRANSACTIONS_API - Datos invalidos devuelven 400 por validacion Zod

**Módulo:** Transacciones
**Alcance:** API (Integration Test)
**Historia de Usuario:** [Story 002: Registro de Transacciones Financieras](stories/story-002-create-transactions.md)
**Tipo:** Error
**Gherkin origen:** Scenario: Validación Zod rechaza datos inválidos

## Escenario

Verificar que el endpoint rechaza datos inválidos y retorna 400 con detalle de errores Zod.

### Pasos

1. **Given** un usuario autenticado con un token JWT válido.
2. **And** un payload de transacción con datos inválidos (e.g., `amount` negativo, `type` con valor no permitido por el enum).
3. **When** el usuario envía una petición `POST` a `/transactions` con ese payload.
4. **Then** el servidor debe responder con código de estado `400 Bad Request`.
5. **And** el cuerpo de la respuesta debe incluir los errores de validación Zod indicando los campos inválidos.
6. **And** no se debe haber creado ninguna transacción en la base de datos.
