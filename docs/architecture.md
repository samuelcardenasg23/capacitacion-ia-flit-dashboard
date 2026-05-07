# 🏗️ Arquitectura General

## Visión General

Flit Analytics Dashboard es una **Single Page Application (SPA)** construida con React 19 y TypeScript 6. Utiliza el patrón de diseño **Atomic Design** para organizar los componentes en capas de complejidad creciente.

---

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.html                              │
│                            │                                    │
│                         main.tsx                                │
│                      (React entry point)                        │
│                            │                                    │
│                         App.tsx                                 │
│                   (BrowserRouter + Routes)                      │
│                      ┌─────┴─────┐                              │
│                      │           │                              │
│                 /login      MainLayout                          │
│                   │         (auth guard)                        │
│                Login      ┌────┴────┐                           │
│                           │         │                           │
│                      /dashboard  /reports                       │
│                        Dashboard  Reports                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

```
┌─────────────┐     ┌──────────┐     ┌────────────┐     ┌────────────┐
│   Mocks     │────▶│  Pages   │────▶│ Organisms  │────▶│  Molecules │
│  (data.ts)  │     │          │     │            │     │  / Atoms   │
└─────────────┘     └──────────┘     └────────────┘     └────────────┘
                         │                                     ▲
                         │           ┌────────────┐            │
                         └──────────▶│   Hooks    │────────────┘
                                     │ (useAuth)  │
                                     └────────────┘
```

### Descripción del flujo

1. **Datos (Mocks)**: Los datos se definen en `src/mocks/data.ts` y son importados directamente por las páginas.
2. **Páginas**: Las páginas consumen datos y los pasan como props a los organisms.
3. **Organisms**: Reciben datos tipados y los renderizan usando molecules y atoms.
4. **Hooks**: Proveen lógica reutilizable (como `useAuth`) que se consume a cualquier nivel.

> **Nota**: Actualmente no se usa un state manager global (Redux, Zustand). Los datos son estáticos y se pasan vía props. Para un futuro con datos reales, se recomienda implementar React Context o Zustand.

---

## Capas de la Aplicación

### 1. Entry Point (`main.tsx`)

El punto de entrada renderiza `<App />` dentro de `<StrictMode>` e importa los estilos globales:

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### 2. Router (`App.tsx`)

Define todas las rutas de la aplicación usando `react-router-dom` v7:

- **Rutas públicas**: `/login`
- **Rutas protegidas**: Envueltas en `<MainLayout>` que actúa como auth guard
- **Redirecciones**: `/` → `/dashboard`, rutas desconocidas → `/dashboard`

### 3. Layout (`MainLayout.tsx`)

Componente wrapper que:
- Verifica el estado de autenticación via `useAuth()`
- Muestra un loading state mientras se verifica la sesión
- Redirige a `/login` si no hay sesión activa
- Renderiza la estructura visual: `Sidebar + Header + <Outlet />`

```
┌─────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────┐ │
│ │          │ │         Header             │ │
│ │          │ ├────────────────────────────┤ │
│ │ Sidebar  │ │                            │ │
│ │          │ │       <Outlet />           │ │
│ │          │ │    (page content)          │ │
│ │          │ │                            │ │
│ └──────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 4. Componentes (Atomic Design)

| Capa         | Responsabilidad                           | Ejemplo               |
| ------------ | ----------------------------------------- | ---------------------- |
| **Atoms**    | UI primitiva, sin lógica de negocio       | `Button`, `Card`       |
| **Molecules**| Combinación de atoms con lógica mínima    | `KPICard`, `FormField` |
| **Organisms**| Secciones completas con lógica            | `Header`, `SortableTable` |
| **Pages**    | Composición de organisms + datos          | `Dashboard`, `Login`   |

### 5. Hooks (`src/hooks/`)

Custom hooks que encapsulan lógica reutilizable:
- `useAuth()`: Manejo de autenticación (login, logout, estado del usuario)

### 6. Types (`src/types/`)

Tipos e interfaces compartidas:
- `User`: Datos del usuario
- `KPIData`: Métricas KPI
- `ChartData`: Datos para gráficos
- `ReportItem`: Items de reportes

### 7. Utils (`src/utils/`)

Funciones utilitarias:
- `cn()`: Combinación de clases CSS con `clsx` + `tailwind-merge`

---

## Configuración de Build

### Vite (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Características**:
- Plugin de React con Oxc
- Plugin de Tailwind CSS v4 (integración nativa)
- Path alias `@` → `./src`
- Configuración de Vitest embebida

### TypeScript (`tsconfig.app.json`)

- **Target**: ES2023
- **Module**: ESNext con resolución bundler
- **Strict**: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **JSX**: react-jsx (automatic runtime)
- **Path alias**: `@/*` → `./src/*`

---

## Decisiones Arquitectónicas

| Decisión | Justificación |
| --- | --- |
| **Atomic Design** | Promueve reutilización, consistencia visual y facilita testing unitario |
| **Mock data estático** | Proyecto de capacitación; datos simulados permiten desarrollo sin backend |
| **localStorage para auth** | Simula persistencia de sesión sin infraestructura real |
| **Co-locación de tests** | Tests junto a componentes mejoran la mantenibilidad |
| **Tailwind v4 @theme** | CSS-first config, mejor rendimiento que tailwind.config.js |
| **react-router-dom v7** | Routing declarativo con layout routes para auth guard |
| **Sin state manager** | Complejidad actual no lo justifica; fácil agregar Zustand si es necesario |
