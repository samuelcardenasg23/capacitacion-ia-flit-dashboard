# Story 007: Filtro por Rango de Fechas

## Contexto
Como analista, quiero filtrar mis KPIs y listas por un rango de fechas (`startDate` / `endDate`) para analizar periodos específicos como trimestres (Q1, Q2) o campañas puntuales.

## Archivos a crear/modificar
- `server/src/routes/transactionRoutes.ts`: Inclusión de `startDate` y `endDate` en el schema de validación de query.
- `server/src/routes/statRoutes.ts`: Inclusión de filtros temporales en endpoints de estadísticas.
- `server/src/services/transactionService.ts`: Propagación de filtros a la capa de datos.

## Snippets de Architecture.md
```prisma
model Transaction {
  // ...
  @@index([organizationId, date])
}
```
**Query Params**: `?startDate=2024-01-01&endDate=2024-01-31`.

## Criterios de Aceptación
- **Given** transacciones distribuidas en diferentes meses.
- **When** filtro por un rango de fechas que cubre solo el mes de enero.
- **Then** todos los totales (KPIs) y el listado de transacciones solo muestran registros contenidos en ese intervalo.

## Tests Requeridos
- Integration: GET `/transactions` con fechas límite devuelve exactamente los registros esperados.
- Integration: GET `/stats/total-revenue` con filtro de fecha devuelve la suma parcial correcta.
