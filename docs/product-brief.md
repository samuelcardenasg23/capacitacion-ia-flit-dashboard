---
title: "Product Brief: Flit Analytics Dashboard Backend"
status: "draft"
created: "2026-05-11"
updated: "2026-05-11"
inputs: ["docs/backend-spec.md", "docs/architecture.md", "AGENTS.md"]
---

# Product Brief: Flit Analytics Dashboard Backend

## Resumen Ejecutivo

El Backend de Flit Analytics Dashboard es el motor de alto rendimiento diseñado para transformar una interfaz de visualización estática en una plataforma de inteligencia financiera multi-tenant robusta. Su propósito es proporcionar una capa de datos segura, escalable y extremadamente rápida que permita a organizaciones corporativas analizar su rendimiento financiero en tiempo real.

Construido sobre un stack de vanguardia (Node 20, Fastify 5 y Prisma 6), el proyecto no solo busca servir datos, sino garantizar la integridad y el aislamiento absoluto de la información mediante políticas de seguridad a nivel de base de datos (RLS). En un mercado donde la privacidad de los datos financieros es innegociable, este backend se posiciona como una infraestructura "security-first" capaz de soportar decisiones críticas de negocio con latencias inferiores a 300ms.

## El Problema

Las organizaciones corporativas actuales manejan volúmenes crecientes de datos financieros, pero a menudo carecen de herramientas que ofrezcan una visión consolidada y, al mismo tiempo, estrictamente aislada para diferentes departamentos o entidades. 

El status quo suele implicar:
- **Riesgos de Seguridad:** Aplicaciones que dependen únicamente de filtros en el código para separar datos de diferentes clientes, aumentando la posibilidad de filtraciones accidentales.
- **Latencia:** Dashboards que se vuelven lentos a medida que el historial de transacciones crece, frustrando a los usuarios que necesitan agilidad.
- **Desconexión Técnica:** Interfaces modernas (como el frontend actual de Flit) que se quedan como simples maquetas al no tener un motor de datos capaz de realizar agregaciones complejas eficientemente.

## La Solución

Estamos construyendo una API REST multi-tenant especializada en la gestión y agregación de métricas financieras. A diferencia de un backend genérico, este motor está diseñado específicamente para las necesidades de un dashboard de analytics:

- **Aislamiento Nativo (RLS):** Implementamos Row Level Security en PostgreSQL/Supabase. Esto significa que la base de datos misma impide que un usuario vea datos de otra organización, eliminando errores humanos en la lógica de la aplicación (requiere configuración estricta del rol de conexión para evitar bypass de superusuario).
- **Agregaciones de Alto Rendimiento:** Endpoints optimizados para calcular KPIs (Revenue, Ticket Promedio, etc.) y series temporales sobre millones de registros. Se priorizará el uso de índices compuestos y, de ser necesario, consultas SQL puras para agregaciones complejas que superen las capacidades del ORM.
- **Arquitectura Modular:** Un diseño por capas (Routes, Services, Schemas) que facilita la evolución del negocio sin generar deuda técnica, cumpliendo con los estándares más estrictos de TypeScript y testing integrado.

## Qué Nos Hace Diferentes

Lo que separa a este backend de otras implementaciones es el equilibrio entre **velocidad de desarrollo y rigor técnico**:
- **Prisma 6 + Fastify 5:** Utilizamos las versiones más recientes y eficientes de estas herramientas para obtener el máximo rendimiento del runtime de Node.js.
- **Índices Verticales:** El uso de índices compuestos `(organizationId, date)` no es una ocurrencia tardía, sino una decisión de diseño desde el día 1 para garantizar que el dashboard sea siempre "instantáneo".
- **Contrato de Datos Estricto:** Gracias a Zod, cada bit de información que entra o sale de la API es validado, asegurando que el frontend siempre reciba datos coherentes.
- **Trazabilidad Corporativa:** El diseño modular permite la futura integración de un log de auditoría inmutable, vital para el cumplimiento de normativas financieras.

## Usuarios Principales

1. **Analistas Financieros:** Necesitan ver tendencias claras y reportes precisos para la toma de decisiones diaria. Su éxito es tener datos actualizados sin tiempos de espera.
2. **Administradores de Organización:** Responsables de gestionar el acceso de su equipo y asegurar que la información de su entidad permanezca privada.
3. **Equipos de Desarrollo:** Consumidores de una API bien documentada, tipada y predecible que acelera la creación de nuevas funcionalidades en el frontend.

## Criterios de Éxito

- **Seguridad:** 0 incidentes de acceso cruzado entre organizaciones (validado mediante tests de integración automáticos).
- **Rendimiento:** Latencia de respuesta < 300ms para el 95% de las peticiones de KPIs y gráficos.
- **Calidad:** Cobertura de tests superior al 80% y cumplimiento estricto de las reglas de `AGENTS.md`.
- **Adopción:** Migración exitosa de la SPA de datos mock a datos reales sin cambios disruptivos en la experiencia de usuario.

## Alcance (MVP)

### IN (En alcance)
- Autenticación JWT mediante cookies httpOnly.
- Gestión de Organizaciones, Usuarios y Transacciones.
- Endpoints de KPIs financieros centrales.
- Reportes con paginación y ordenamiento.
- Aislamiento mediante RLS y filtrado por `organizationId`.

### OUT (Fuera de alcance)
- Soporte para usuarios multi-organización (en el MVP cada usuario pertenece a 1 sola entidad).
- Integraciones automáticas con bancos (APIs externas).
- Exportación de reportes a PDF/Excel.
- Dashboard de administración global (SuperAdmin).
- Sistema de notificaciones en tiempo real.

## Visión a Futuro

En los próximos 2 años, el Backend de Flit evolucionará de ser un motor de visualización a ser una **plataforma de analítica predictiva**. Integrará modelos de IA para proyectar flujos de caja y se convertirá en el "hub" central donde convergen todas las fuentes financieras de la empresa, manteniendo siempre la promesa de aislamiento y velocidad que define su base hoy.
