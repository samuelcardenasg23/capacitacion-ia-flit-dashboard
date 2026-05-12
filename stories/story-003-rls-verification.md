# Story 003: Verificación de Aislamiento de Datos (RLS)

## Contexto
Como auditor de seguridad, quiero que el sistema rechace cualquier intento de lectura o escritura de datos de otra organización para garantizar la privacidad absoluta entre tenants.

## Archivos a crear/modificar
- `server/src/repositories/transactionRepository.ts`: Implementación de Prisma Extension para filtrado automático.
- `server/src/lib/prisma.ts`: Configuración global del cliente Prisma con la extensión de RLS.

## Snippets de Architecture.md
```typescript
// RLS Implementation Pattern
const prisma = new PrismaClient().$extends({
  query: {
    transaction: {
      async findMany({ args, query }) {
        args.where = { ...args.where, organizationId: context.orgId };
        return query(args);
      }
    }
  }
});
```

## Criterios de Aceptación
- **Given** un usuario de la Org A.
- **When** intenta consultar una transacción de la Org B por ID (`GET /transactions/:id`).
- **Then** el sistema devuelve un error 404 o 403, incluso si el ID existe en la base de datos global.

## Tests Requeridos
- Integration (Security): Un usuario autenticado intenta acceder a un recurso cuyo `organizationId` no le pertenece.
- Integration: Listado de transacciones solo devuelve registros del tenant actual.
