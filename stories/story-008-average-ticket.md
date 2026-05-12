# Story 008: Cálculo de Ticket Promedio

## Contexto
Como analista, quiero ver el monto promedio por transacción para medir la eficiencia de ventas y el valor promedio de cada operación de ingreso.

## Archivos a crear/modificar
- `server/src/routes/statRoutes.ts`: Endpoint `GET /stats/average-ticket`.
- `server/src/services/statService.ts`: Lógica: `SUM(amount) / COUNT(transactions)` donde tipo es `INCOME`.

## Snippets de Architecture.md
| Method | Route | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats/average-ticket` | Revenue / Count | `{ average: number }` |

## Criterios de Aceptación
- **Given** N transacciones de tipo ingreso en la organización.
- **When** consulto el endpoint de `/stats/average-ticket`.
- **Then** recibo el resultado matemático exacto de dividir el Revenue Total entre el número de transacciones de ingreso del tenant.

## Tests Requeridos
- Unit: Verificación de cálculo con división por cero (N=0) manejado correctamente.
- Integration: Resultado consistente con los datos de prueba de la organización.
