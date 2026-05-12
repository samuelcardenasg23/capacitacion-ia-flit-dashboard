# Story 006: Listado de Reportes Paginado

## Contexto
Como analista, quiero ver una lista de mis últimas transacciones de forma paginada para navegar por el historial de manera eficiente sin degradar el rendimiento por volumen de datos.

## Archivos a crear/modificar
- `server/src/routes/transactionRoutes.ts`: Parámetros `page` y `limit` en `GET /transactions`.
- `server/src/repositories/transactionRepository.ts`: Implementación de `skip` y `take` en Prisma.

## Snippets de Architecture.md
| Method | Route | Description | Request Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions` | List (Paginated + Filter) | `?page=1&limit=10` |

## Criterios de Aceptación
- **Given** más de 10 transacciones registradas en la organización.
- **When** pido la página 1 con un límite de 10 registros.
- **Then** recibo un objeto con los 10 primeros registros, el total de páginas y el conteo total de registros del tenant.

## Tests Requeridos
- Unit: Verificación de que el repositorio aplica correctamente los offsets de paginación.
- Integration: Comprobar que la respuesta incluye metadatos de paginación correctos (`total`, `page`, `limit`).
