# Story 002: Registro de Transacciones Financieras

## Contexto
Como analista financiero, quiero registrar transacciones (monto, fecha, descripción, categoría) para alimentar el dashboard de analytics. Cada transacción debe quedar vinculada de forma inmutable a la organización del usuario autenticado.

## Archivos a crear/modificar
- `server/src/routes/transactionRoutes.ts`: Endpoint `POST /transactions`.
- `server/src/services/transactionService.ts`: Lógica de creación y validación de negocio.
- `server/src/repositories/transactionRepository.ts`: Inserción en DB usando Prisma.

## Snippets de Architecture.md
```prisma
model Transaction {
  id             String          @id @default(uuid())
  amount         Decimal         @db.Decimal(12, 2)
  type           TransactionType
  category       String
  description    String?
  date           DateTime        @default(now())
  organizationId String
}
```
**Endpoint**: `POST /transactions` -> `{ amount, type, category, description, date? }`.

## Criterios de Aceptación
- **Given** un usuario autenticado.
- **When** envía un POST a `/transactions` con datos válidos (validados por Zod).
- **Then** el registro se guarda en la DB incluyendo automáticamente el `organizationId` del usuario.

## Tests Requeridos
- Unit: Validación de esquema Zod para `Transaction`.
- Integration: POST `/transactions` guarda correctamente y devuelve 201.
- Integration: Intento de POST sin token devuelve 401.
