# Story 012: Resumen de Gastos por Categoría

## Contexto
Como analista, quiero ver un desglose porcentual y absoluto de mis gastos por categoría para identificar áreas de optimización de presupuesto.

## Archivos a crear/modificar
- `server/src/routes/statRoutes.ts`: Endpoint `GET /stats/expenses-by-category`.
- `server/src/services/statService.ts`: Lógica de agrupación (`groupBy`) por categoría sumando montos de tipo `EXPENSE`.

## Snippets de Architecture.md
| Method | Route | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats/expenses-by-category` | Breakdown | `[{ category: string, total: number, percentage: number }]` |

## Criterios de Aceptación
- **When** consulto el endpoint de `/stats/expenses-by-category`.
- **Then** recibo una lista de categorías con sus montos totales sumados (solo para egresos) y el peso porcentual de cada una sobre el total de gastos del periodo.

## Tests Requeridos
- Unit: Verificación del cálculo de porcentajes (suma total debe ser 100%).
- Integration: El reporte solo incluye transacciones de tipo `EXPENSE` y respeta el tenant.
