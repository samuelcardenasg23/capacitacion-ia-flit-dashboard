# Story 010: Búsqueda por Referencia/Descripción

## Contexto
Como usuario de soporte o analista, quiero buscar transacciones por texto libre para encontrar rápidamente registros específicos mediante palabras clave en la descripción.

## Archivos a crear/modificar
- `server/src/routes/transactionRoutes.ts`: Parámetro `q` o `search` en el query string.
- `server/src/repositories/transactionRepository.ts`: Uso del operador `contains` de Prisma con `mode: 'insensitive'`.

## Snippets de Architecture.md
| Method | Route | Description | Request Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions` | List (Paginated + Filter) | `?page=1&limit=10&startDate=...&q=amazon` |

## Criterios de Aceptación
- **When** realizo una búsqueda con el término "Amazon" (o cualquier keyword).
- **Then** el sistema devuelve únicamente las transacciones cuya descripción contenga esa palabra, sin importar si está en mayúsculas o minúsculas.

## Tests Requeridos
- Integration: Crear registros con descripciones "Venta Amazon", "Compra AWS", "Gasto Personal" y buscar "amazon" -> solo devolver el primero.
- Integration: Búsqueda con términos vacíos debe devolver todos los registros (paginados).
