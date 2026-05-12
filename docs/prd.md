---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-drafting"]
inputDocuments: ["docs/product-brief.md", "docs/backend-spec.md", "docs/architecture.md", "AGENTS.md"]
workflowType: 'prd'
---

# Product Requirements Document - Flit Analytics Backend

**Author:** John (BMad PM)
**Date:** 2026-05-11

## 1. Introducción
Este documento define los requerimientos funcionales y técnicos para el desarrollo del backend de Flit Analytics. El objetivo es entregar un MVP funcional en un plazo de 3 horas de implementación, priorizando la seguridad (RLS) y el rendimiento.

---

## 2. Historias de Usuario

### Story 1: Autenticación y Multi-tenancy (CORE)
- **Descripción:** Como usuario del sistema, quiero iniciar sesión mediante JWT y ser asignado automáticamente a mi organización para que mis datos estén aislados y seguros.
- **Prioridad:** Must (Bloquea todas las demás historias)
- **Estimación:** XL
- **Dependencias:** Ninguna
- **Criterios de Aceptación:**
  - **Given** un usuario con credenciales válidas
  - **When** realiza una petición a `/login`
  - **Then** el sistema devuelve una cookie httpOnly con el JWT y el `organizationId` asociado.

### Story 2: Registro de Transacciones Financieras
- **Descripción:** Como analista financiero, quiero registrar transacciones (monto, fecha, descripción, categoría) para alimentar el dashboard de analytics.
- **Prioridad:** Must
- **Estimación:** M
- **Dependencias:** Story 1
- **Criterios de Aceptación:**
  - **Given** un usuario autenticado
  - **When** envía un POST a `/transactions` con datos válidos (validados por Zod)
  - **Then** el registro se guarda en la DB con el `organizationId` del usuario.

### Story 3: Verificación de Aislamiento de Datos (RLS)
- **Descripción:** Como auditor de seguridad, quiero que el sistema rechace cualquier intento de lectura o escritura de datos de otra organización para garantizar la privacidad absoluta.
- **Prioridad:** Must
- **Estimación:** S
- **Dependencias:** Story 1, Story 2
- **Criterios de Aceptación:**
  - **Given** un usuario de la Org A
  - **When** intenta consultar una transacción de la Org B por ID
  - **Then** el sistema devuelve un error 404 o 403, incluso si el ID existe.

### Story 4: Consulta de KPIs Globales (Revenue Total)
- **Descripción:** Como analista, quiero ver el total de ingresos acumulados de mi organización para entender rápidamente el estado financiero.
- **Prioridad:** Must
- **Estimación:** M
- **Dependencias:** Story 2
- **Criterios de Aceptación:**
  - **Given** transacciones existentes en la organización
  - **When** consulto el endpoint de `/stats/total-revenue`
  - **Then** recibo la suma total de montos de transacciones del tipo 'income'.

### Story 5: Gráfico de Ingresos Mensuales (Time Series)
- **Descripción:** Como analista, quiero ver mis ingresos agrupados por mes para detectar patrones estacionales y crecimiento.
- **Prioridad:** Must
- **Estimación:** L
- **Dependencias:** Story 4
- **Criterios de Aceptación:**
  - **Given** un historial de transacciones de varios meses
  - **When** pido el reporte de `/stats/monthly-revenue`
  - **Then** recibo un array de objetos con `{ month: string, total: number }` ordenados cronológicamente.

### Story 6: Listado de Reportes Paginado
- **Descripción:** Como analista, quiero ver una lista de mis últimas transacciones de forma paginada para navegar por el historial sin afectar el rendimiento del navegador.
- **Prioridad:** Must
- **Estimación:** S
- **Dependencias:** Story 2
- **Criterios de Aceptación:**
  - **Given** 100 transacciones registradas
  - **When** pido la página 1 con límite de 10
  - **Then** recibo solo las primeras 10 y el total de páginas/registros.

### Story 7: Filtro por Rango de Fechas
- **Descripción:** Como analista, quiero filtrar mis KPIs y listas por un rango de fechas `startDate` / `endDate` para analizar periodos específicos (ej. Q1).
- **Prioridad:** Should
- **Estimación:** S
- **Dependencias:** Story 4, Story 5
- **Criterios de Aceptación:**
  - **Given** transacciones en enero y febrero
  - **When** filtro por el mes de enero únicamente
  - **Then** los totales y la lista solo muestran registros de ese mes.

### Story 8: Cálculo de Ticket Promedio
- **Descripción:** Como analista, quiero ver el monto promedio por transacción para medir la eficiencia de ventas.
- **Prioridad:** Should
- **Estimación:** M
- **Dependencias:** Story 4
- **Criterios de Aceptación:**
  - **Given** N transacciones de ingreso
  - **When** consulto el endpoint de `/stats/average-ticket`
  - **Then** recibo el resultado de `Revenue Total / Número de Transacciones`.

### Story 9: Validación Estricta de Esquemas (Zod)
- **Descripción:** Como desarrollador, quiero que cualquier dato mal formado sea rechazado antes de tocar la base de datos para mantener la integridad del sistema.
- **Prioridad:** Must
- **Estimación:** S
- **Dependencias:** Story 2
- **Criterios de Aceptación:**
  - **When** envío un monto negativo o un string donde debe ir un número
  - **Then** el sistema responde con error 400 y un detalle claro de la validación fallida.

### Story 10: Búsqueda por Referencia/Descripción
- **Descripción:** Como usuario de soporte, quiero buscar transacciones por texto para encontrar rápidamente un registro específico.
- **Prioridad:** Should
- **Estimación:** S
- **Dependencias:** Story 6
- **Criterios de Aceptación:**
  - **When** busco el término "Amazon"
  - **Then** el sistema devuelve todas las transacciones cuya descripción contenga esa palabra (case-insensitive).

### Story 11: Categorización de Gastos/Ingresos
- **Descripción:** Como analista, quiero asignar una categoría a cada transacción para entender en qué se gasta más el dinero.
- **Prioridad:** Should
- **Estimación:** S
- **Dependencias:** Story 2
- **Criterios de Aceptación:**
  - **When** registro una transacción con categoría 'Food'
  - **Then** puedo ver esa categoría en los listados y reportes.

### Story 12: Resumen de Gastos por Categoría
- **Descripción:** Como analista, quiero ver un desglose porcentual de mis gastos por categoría para optimizar el presupuesto.
- **Prioridad:** Should
- **Estimación:** M
- **Dependencias:** Story 11
- **Criterios de Aceptación:**
  - **When** consulto `/stats/expenses-by-category`
  - **Then** recibo una lista de categorías con sus montos totales sumados.

---

## 3. Resumen de Priorización (MoSCoW)
- **Must Have:** Historias 1, 2, 3, 4, 5, 6, 9. (Core funcional y seguridad)
- **Should Have:** Historias 7, 8, 10, 11, 12. (Mejoras de análisis)
- **Could Have:** Exportación a CSV, Dashboards personalizados (Fuera de MVP inicial).
- **Won't Have:** Integraciones bancarias reales, Notificaciones Push.

## 4. Estimación de Esfuerzo Total
- **Total Historias:** 12
- **Carga Estimada:** 1 XL, 1 L, 4 M, 6 S.
- **Objetivo:** 3 horas de desarrollo intenso.
