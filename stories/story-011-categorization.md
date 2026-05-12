# Story 011: Categorización de Gastos/Ingresos

## Contexto
Como analista, quiero asignar una categoría (ej. 'Nómina', 'Infraestructura', 'Suscripciones') a cada transacción para permitir un análisis granulado de hacia dónde fluye el capital.

## Archivos a crear/modificar
- `server/prisma/schema.prisma`: Asegurar que el campo `category` es requerido.
- `server/src/repositories/transactionRepository.ts`: Inclusión de índices por categoría.

## Snippets de Architecture.md
```prisma
model Transaction {
  // ...
  category       String
  // ...
  @@index([organizationId, category])
}
```

## Criterios de Aceptación
- **When** se registra una transacción indicando la categoría 'Food' o 'Hosting'.
- **Then** el registro persiste ese valor y es visible en todos los listados de la organización correspondiente.

## Tests Requeridos
- Unit: Validación de que `category` no puede estar vacío en el esquema Zod.
- Integration: Comprobar que el valor de categoría se guarda y recupera correctamente de la DB.
