# Story 005: Gráfico de Ingresos Mensuales (Time Series)

## Contexto
Como analista, quiero ver mis ingresos agrupados por mes para detectar patrones estacionales y tendencias de crecimiento inter-mensual.

## Archivos a crear/modificar
- `server/src/routes/statRoutes.ts`: Endpoint `GET /stats/monthly-revenue`.
- `server/src/services/statService.ts`: Lógica de agrupación por fecha (mes/año) de transacciones tipo `INCOME`.

## Snippets de Architecture.md
| Method | Route | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats/monthly-revenue` | Time series (last 12m) | `[{ month: string, total: number }]` |

## Criterios de Aceptación
- **Given** un historial de transacciones que abarca varios meses.
- **When** realizo una petición GET a `/stats/monthly-revenue`.
- **Then** recibo un array de objetos con `{ month: string, total: number }` ordenados cronológicamente, representando los últimos 12 meses.

## Tests Requeridos
- Unit: Lógica de transformación de registros planos a agregados mensuales.
- Integration: El endpoint devuelve datos agrupados correctamente y respeta el aislamiento por organización.
