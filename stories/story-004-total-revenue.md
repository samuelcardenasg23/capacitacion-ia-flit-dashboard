# Story 004: Consulta de KPIs Globales (Revenue Total)

## Contexto
Como analista, quiero ver el total de ingresos acumulados de mi organización para entender rápidamente el estado financiero consolidado.

## Archivos a crear/modificar
- `server/src/routes/statRoutes.ts`: Endpoint `GET /stats/total-revenue`.
- `server/src/services/statService.ts`: Lógica de agregación (SUM) de transacciones tipo `INCOME`.

## Snippets de Architecture.md
| Method | Route | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats/total-revenue` | Total accumulated income | `{ total: number }` |

## Criterios de Aceptación
- **Given** transacciones de tipo `INCOME` y `EXPENSE` existentes en la organización.
- **When** consulto el endpoint de `/stats/total-revenue`.
- **Then** recibo la suma total de montos únicamente de las transacciones del tipo `INCOME`.

## Tests Requeridos
- Unit: `statService.getTotalRevenue` calcula correctamente ignorando gastos.
- Integration: El endpoint devuelve el valor esperado según los datos de prueba insertados para ese tenant.
