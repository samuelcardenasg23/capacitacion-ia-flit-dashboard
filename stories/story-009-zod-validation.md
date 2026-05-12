# Story 009: Validación Estricta de Esquemas (Zod)

## Contexto
Como desarrollador, quiero que cualquier dato mal formado sea rechazado mediante validación de esquemas (Zod) antes de procesar la lógica de negocio o tocar la base de datos, garantizando la integridad de los datos.

## Archivos a crear/modificar
- `server/src/schemas/transactionSchemas.ts`: Esquema de validación para transacciones.
- `server/src/schemas/authSchemas.ts`: Esquema para login.
- `server/src/middlewares/validationMiddleware.ts`: Middleware genérico de Fastify para validación de payloads.

## Snippets de Architecture.md
**Validation Patterns**:
- Usar `z.strictObject()` para evitar campos extra.
- `z.email()` y `z.uuid()` para formatos específicos.
- Envelope de error: `{ error, message, details }`.

## Criterios de Aceptación
- **When** se envía un monto negativo, un string inválido en un campo numérico, o falta un campo requerido.
- **Then** el sistema responde con un error 400 y un detalle (envelope) que explica qué campos fallaron la validación.

## Tests Requeridos
- Unit: Test del esquema Zod con múltiples payloads inválidos.
- Integration: Comprobar que Fastify rechaza peticiones mal formadas sin llegar al controlador.
