# 📊 Flit Analytics Dashboard

Dashboard de analytics construido con React 19, TypeScript 6, Vite 8 y Tailwind CSS 4. Diseñado para visualizar métricas clave de negocio con gráficos interactivos, tablas ordenables y autenticación simulada.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación y Setup](#instalación-y-setup)
- [Scripts Disponibles](#scripts-disponibles)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Sistema de Diseño](#sistema-de-diseño)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Autenticación](#autenticación)
- [Testing](#testing)
- [Estándares de Código](#estándares-de-código)
- [Documentación Adicional](#documentación-adicional)

---

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar con        |
| ----------- | -------------- | -------------------- |
| **Node.js** | 18.x           | `node --version`     |
| **npm**     | 9.x            | `npm --version`      |
| **Git**     | 2.x            | `git --version`      |

> [!TIP]
> Se recomienda usar [nvm](https://github.com/nvm-sh/nvm) para gestionar versiones de Node.js.

---

## Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-org/capacitacion-ia-flit.git
cd capacitacion-ia-flit/dashboard
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

### 4. Login

La autenticación es simulada (mock). Ingresa cualquier email y contraseña en el formulario de login para acceder al dashboard.

---

## Scripts Disponibles

| Script           | Comando              | Descripción                                            |
| ---------------- | -------------------- | ------------------------------------------------------ |
| `dev`            | `npm run dev`        | Inicia el servidor de desarrollo con HMR               |
| `build`          | `npm run build`      | Compila TypeScript y genera el bundle de producción     |
| `preview`        | `npm run preview`    | Previsualiza el build de producción localmente          |
| `lint`           | `npm run lint`       | Ejecuta ESLint sobre todos los archivos `.ts` y `.tsx`  |
| `test`           | `npm run test`       | Ejecuta los tests unitarios con Vitest en modo watch    |
| `coverage`       | `npm run coverage`   | Genera reporte de cobertura de código (mínimo 80%)      |

---

## Stack Tecnológico

### Core

| Tecnología          | Versión | Propósito                    |
| ------------------- | ------- | ---------------------------- |
| **React**           | 19.2    | Librería de UI               |
| **TypeScript**      | 6.0     | Tipado estático (strict)     |
| **Vite**            | 8.0     | Build tool y dev server      |
| **Tailwind CSS**    | 4.0     | Estilos utilitarios          |

### Librerías UI

| Librería            | Propósito                                       |
| ------------------- | ----------------------------------------------- |
| **Recharts**        | Gráficos (LineChart, BarChart)                  |
| **Lucide React**    | Íconos SVG                                      |
| **clsx**            | Composición condicional de clases               |
| **tailwind-merge**  | Merge inteligente de clases Tailwind            |

### Routing

| Librería              | Propósito                  |
| --------------------- | -------------------------- |
| **react-router-dom**  | Routing SPA con BrowserRouter |

### Testing

| Herramienta            | Propósito                         |
| ---------------------- | --------------------------------- |
| **Vitest**             | Test runner                       |
| **@testing-library/react** | Render y queries para React   |
| **@testing-library/jest-dom** | Matchers DOM adicionales   |
| **@testing-library/user-event** | Simulación de eventos   |
| **jsdom**              | Entorno DOM para tests            |

---

## Estructura del Proyecto

```
dashboard/
├── public/                    # Archivos estáticos
├── src/
│   ├── assets/                # Imágenes y recursos
│   ├── components/
│   │   ├── atoms/             # Componentes base (Button, Card, Input, etc.)
│   │   ├── molecules/         # Componentes compuestos (KPICard, FormField, NavItem)
│   │   └── organisms/         # Componentes complejos (Header, Sidebar, Charts, Table)
│   ├── hooks/                 # Custom hooks (useAuth)
│   ├── layouts/               # Layout wrappers (MainLayout)
│   ├── mocks/                 # Datos mock para desarrollo
│   ├── pages/                 # Vistas/páginas (Dashboard, Login, Reports)
│   ├── types/                 # Interfaces y tipos TypeScript
│   ├── utils/                 # Funciones utilitarias (cn)
│   ├── App.tsx                # Componente raíz con rutas
│   ├── App.css                # Estilos legacy (del scaffold)
│   ├── index.css              # Tailwind + design tokens CSS
│   ├── main.tsx               # Entry point de React
│   └── setupTests.tsx         # Configuración global de tests
├── docs/                      # 📖 Documentación de arquitectura
├── AGENTS.md                  # Reglas para agentes de IA
├── eslint.config.js           # Configuración ESLint
├── .prettierrc                # Configuración Prettier
├── tsconfig.json              # Config TypeScript raíz
├── tsconfig.app.json          # Config TypeScript para la app
├── tsconfig.node.json         # Config TypeScript para Node
└── vite.config.ts             # Configuración Vite + Vitest
```

---

## Arquitectura

Este proyecto sigue el patrón **Atomic Design** para organizar los componentes:

```
Atoms → Molecules → Organisms → Pages
```

- **Atoms**: Componentes UI primitivos y reutilizables (`Button`, `Card`, `Input`, `Typography`, `Logo`).
- **Molecules**: Combinaciones de atoms con lógica mínima (`KPICard`, `FormField`, `NavItem`).
- **Organisms**: Secciones completas de UI con lógica de negocio (`Header`, `Sidebar`, `AnalyticsCharts`, `SortableTable`).
- **Pages**: Vistas que componen organisms y proveen datos (`Dashboard`, `Login`, `Reports`).

> 📖 Para documentación detallada de cada capa, consulta la carpeta [`docs/`](./docs/).

### Path Aliases

El alias `@/*` mapea a `src/*` para imports limpios:

```typescript
// ✅ Correcto
import { Button } from '@/components/atoms/Button';

// ❌ Evitar
import { Button } from '../../../components/atoms/Button';
```

---

## Sistema de Diseño

Los design tokens se definen en `src/index.css` usando la directiva `@theme` de Tailwind CSS 4:

| Token                   | Valor     | Uso                          |
| ----------------------- | --------- | ---------------------------- |
| `--color-primary`       | `#18181b` | Color principal              |
| `--color-secondary`     | `#f4f4f5` | Color secundario             |
| `--color-muted`         | `#f4f4f5` | Elementos deshabilitados     |
| `--color-destructive`   | `#ef4444` | Acciones destructivas        |
| `--color-background`    | `#ffffff` | Fondo de la aplicación       |
| `--color-card`          | `#ffffff` | Fondo de tarjetas            |
| `--color-border`        | `#e4e4e7` | Bordes                       |

### Utilidad `cn()`

La función `cn()` combina `clsx` + `tailwind-merge` para componer clases CSS de manera segura:

```typescript
import { cn } from '@/utils/cn';

cn('px-4 py-2', isActive && 'bg-primary text-white', className);
```

---

## Rutas de la Aplicación

| Ruta          | Componente     | Protegida | Descripción                    |
| ------------- | -------------- | --------- | ------------------------------ |
| `/login`      | `Login`        | No        | Formulario de autenticación    |
| `/dashboard`  | `Dashboard`    | Sí        | Vista principal con KPIs       |
| `/reports`    | `Reports`      | Sí        | Vista de reportes              |
| `/`           | —              | —         | Redirige a `/dashboard`        |
| `/*`          | —              | —         | Cualquier ruta → `/dashboard`  |

Las rutas protegidas están envueltas en `MainLayout`, que valida la autenticación y redirige a `/login` si el usuario no está autenticado.

---

## Autenticación

El sistema de autenticación actual es **simulado (mock)** para desarrollo y capacitación:

- **Hook**: `useAuth()` maneja el estado de autenticación
- **Persistencia**: Usa `localStorage` con la key `auth_fake`
- **Usuario mock**: `Jane Doe (jane.doe@example.com, role: admin)`
- **Login**: Cualquier email/password funciona
- **Logout**: Limpia localStorage y redirige a `/login`

> [!IMPORTANT]
> Este sistema de auth es solo para demostración. En producción se debe reemplazar con un provider real (Firebase Auth, Auth0, Supabase, etc.).

---

## Testing

### Ejecutar tests

```bash
# Tests en modo watch
npm run test

# Cobertura de código
npm run coverage
```

### Convenciones

- **Framework**: Vitest 4 + React Testing Library
- **Entorno**: jsdom
- **Queries**: Se priorizan queries de accesibilidad (`getByRole`, `getByText`, `getByLabelText`)
- **Cobertura mínima**: 80% en líneas, ramas, funciones y declaraciones
- **Archivos de test**: Co-localizados junto al componente (`Button.tsx` → `Button.test.tsx`)

### Configuración especial

El archivo `setupTests.tsx` incluye:
- Limpieza automática del DOM después de cada test
- Mock global de `ResponsiveContainer` de Recharts (evita errores de SVG en jsdom)

---

## Estándares de Código

### TypeScript
- Modo **strict**, sin uso de `any`
- Props definidas con `interface`
- Path alias `@/*` para imports

### Tailwind CSS
- Orden de clases: `layout → spacing → typography → color → states`
- Composición con `cn()` para clases condicionales

### Linting y Formateo
- **ESLint**: Configuración strict con plugins para React Hooks y React Refresh
- **Prettier**: 2 espacios, single quotes, trailing commas ES5

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2
}
```

### Performance
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **INP**: < 200ms

### Accesibilidad
- **WCAG 2.1 AA**
- Diseño **mobile-first**

---

## Documentación Adicional

Para documentación detallada de la arquitectura de componentes, consulta:

| Documento                                           | Descripción                                           |
| --------------------------------------------------- | ----------------------------------------------------- |
| [Arquitectura General](./docs/architecture.md)      | Visión general de la arquitectura y flujo de datos     |
| [Atoms](./docs/atoms.md)                            | Documentación de componentes atómicos                  |
| [Molecules](./docs/molecules.md)                    | Documentación de componentes moleculares               |
| [Organisms](./docs/organisms.md)                    | Documentación de componentes organismo                 |
| [Hooks](./docs/hooks.md)                            | Custom hooks y su uso                                  |
| [Design Tokens](./docs/design-tokens.md)            | Sistema de tokens de diseño                            |

---

## Licencia

Proyecto interno de capacitación — Flit.
