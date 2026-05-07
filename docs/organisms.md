# 🏢 Organisms — Componentes Organismo

Los organisms son **secciones completas de la interfaz** que combinan molecules y atoms con lógica de presentación o de negocio. Representan partes significativas de la UI. Se ubican en `src/components/organisms/`.

---

## Índice

- [Header](#header)
- [Sidebar](#sidebar)
- [AnalyticsCharts](#analyticscharts)
- [SortableTable](#sortabletable)

---

## Header

**Archivo**: `src/components/organisms/Header.tsx`

Barra superior de la aplicación que muestra el título de la sección, información del usuario autenticado y un botón de logout.

### Dependencias

| Dependencia     | Origen               |
| --------------- | -------------------- |
| `Button`        | `atoms/Button`       |
| `useAuth`       | `@/hooks/useAuth`    |
| `useNavigate`   | `react-router-dom`   |
| `LogOut`, `User`| `lucide-react`       |

### Lógica interna

1. Obtiene `user` y `logout` del hook `useAuth()`
2. Obtiene `navigate` de `useNavigate()`
3. `handleLogout()`:
   - Llama a `logout()` (limpia localStorage y estado)
   - Navega a `/login`

### Estructura visual

```
┌──────────────────────────────────────────────────────────────┐
│  Analytics Overview                    👤 Jane Doe   [🚪]   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
     ↑ Título                    ↑ Info usuario    ↑ Logout
```

### Elementos renderizados

| Elemento                     | Descripción                                    |
| ---------------------------- | ---------------------------------------------- |
| Título "Analytics Overview"  | `<div>` con `font-semibold text-lg`            |
| Avatar del usuario           | `<div>` circular con ícono `User` de Lucide    |
| Nombre del usuario           | `user?.name` del hook `useAuth()`              |
| Botón logout                 | `<Button variant="ghost" size="icon">` con ícono `LogOut` |

### Ejemplo de uso

```tsx
// Se usa dentro de MainLayout, no requiere props
import { Header } from '@/components/organisms/Header';

<Header />
```

---

## Sidebar

**Archivo**: `src/components/organisms/Sidebar.tsx`

Panel de navegación lateral con el logo y los enlaces principales.

### Dependencias

| Dependencia        | Origen                   |
| ------------------ | ------------------------ |
| `Logo`             | `atoms/Logo`             |
| `NavItem`          | `molecules/NavItem`      |
| `cn`               | `@/utils/cn`             |
| Íconos             | `lucide-react` (LayoutDashboard, FileText, Settings) |

### Props

```typescript
interface SidebarProps {
  className?: string;
}
```

### Enlaces de navegación

| Ruta          | Ícono             | Label       |
| ------------- | ----------------- | ----------- |
| `/dashboard`  | `LayoutDashboard` | Dashboard   |
| `/reports`    | `FileText`        | Reports     |
| `/settings`   | `Settings`        | Settings    |

### Responsive behavior

El sidebar se oculta en pantallas pequeñas (`hidden md:flex` se aplica desde `MainLayout`):

```tsx
<Sidebar className="hidden md:flex" />
```

### Estructura visual

```
┌──────────────────┐
│  🔵 Flit Analytics│  ← Logo
│                  │
│  📊 Dashboard    │  ← NavItem (activo)
│  📄 Reports      │  ← NavItem
│  ⚙️ Settings     │  ← NavItem
│                  │
│                  │
└──────────────────┘
```

### Ejemplo de uso

```tsx
import { Sidebar } from '@/components/organisms/Sidebar';

<Sidebar />
<Sidebar className="hidden md:flex" />
```

---

## AnalyticsCharts

**Archivo**: `src/components/organisms/AnalyticsCharts.tsx`

Sección de gráficos de analytics con dos visualizaciones: un gráfico de líneas (revenue) y un gráfico de barras (usuarios).

### Dependencias

| Dependencia          | Origen                |
| -------------------- | --------------------- |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | `atoms/Card` |
| `ChartData`          | `@/types`             |
| Componentes Recharts | `recharts` (LineChart, BarChart, etc.) |

### Props

```typescript
interface AnalyticsChartsProps {
  data: ChartData[];
}
```

Donde `ChartData` es:

```typescript
interface ChartData {
  name: string;     // Etiqueta del eje X (ej: "Jan", "Feb")
  revenue: number;  // Datos de revenue
  users: number;    // Datos de usuarios
}
```

### Gráficos renderizados

| Gráfico | Tipo       | Data key  | Color     | Descripción          |
| ------- | ---------- | --------- | --------- | -------------------- |
| Revenue Trend  | `LineChart` | `revenue` | `#18181b` | Línea de tendencia de ingresos |
| Active Users   | `BarChart`  | `users`   | `#18181b` | Barras de usuarios activos     |

### Características de los gráficos

- **Layout responsive**: Usa `ResponsiveContainer` de Recharts (100% width/height)
- **Grid**: `CartesianGrid` con `strokeDasharray="3 3"`, sin líneas verticales
- **Ejes**: Sin línea de eje ni ticks visibles, formato de moneda en Y del revenue
- **Interactividad**: Tooltip y Legend habilitados
- **Barras**: Radio redondeado superior `[4, 4, 0, 0]`

### Estructura visual

```
┌─────────────────────────┐  ┌─────────────────────────┐
│ Revenue Trend           │  │ Active Users             │
│                         │  │                          │
│    📈 Line Chart        │  │    📊 Bar Chart          │
│    (revenue data)       │  │    (users data)          │
│                         │  │                          │
│ height: 300px           │  │ height: 300px            │
└─────────────────────────┘  └─────────────────────────┘
```

### Ejemplo de uso

```tsx
import { AnalyticsCharts } from '@/components/organisms/AnalyticsCharts';
import { mockChartData } from '@/mocks/data';

<AnalyticsCharts data={mockChartData} />
```

### Nota sobre testing

En el entorno de tests, `ResponsiveContainer` se mockea globalmente en `setupTests.tsx` porque jsdom no soporta el cálculo de dimensiones SVG:

```tsx
// setupTests.tsx
ResponsiveContainer: ({ children }) =>
  React.createElement('div', { style: { width: 800, height: 800 } }, children),
```

---

## SortableTable

**Archivo**: `src/components/organisms/SortableTable.tsx`

Tabla de reportes con ordenamiento interactivo por columna.

### Dependencias

| Dependencia   | Origen              |
| ------------- | ------------------- |
| `Card`, etc.  | `atoms/Card`        |
| `ReportItem`  | `@/types`           |
| `cn`          | `@/utils/cn`        |
| Íconos        | `lucide-react` (ChevronDown, ChevronUp) |

### Props

```typescript
interface SortableTableProps {
  data: ReportItem[];
}
```

Donde `ReportItem` es:

```typescript
interface ReportItem {
  id: string;
  date: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  title: string;
}
```

### Estado interno

```typescript
const [sortKey, setSortKey] = useState<SortKey>('date');       // Columna activa
const [sortOrder, setSortOrder] = useState<SortOrder>('desc'); // Dirección
```

- **Default**: Ordenado por `date` en orden descendente
- **Al hacer clic en una columna**:
  - Si es la misma columna → alterna `asc` / `desc`
  - Si es una columna diferente → cambia columna y establece `asc`

### Columnas

| Columna  | Sort key | Descripción                      |
| -------- | -------- | -------------------------------- |
| Title    | `title`  | Nombre del reporte               |
| Author   | `author` | Autor del reporte                |
| Status   | `status` | Badge de estado con color        |
| Date     | `date`   | Fecha de creación                |

### Badges de status

| Estado      | Clases CSS                           |
| ----------- | ------------------------------------ |
| `published` | `bg-green-100 text-green-800`        |
| `draft`     | `bg-yellow-100 text-yellow-800`      |
| `archived`  | `bg-gray-100 text-gray-800`          |

### Indicadores de ordenamiento

- Columna activa muestra `ChevronUp` (asc) o `ChevronDown` (desc)
- Columnas inactivas no muestran ícono

### Ejemplo de uso

```tsx
import { SortableTable } from '@/components/organisms/SortableTable';
import { mockReports } from '@/mocks/data';

<SortableTable data={mockReports} />
```

### Estructura visual

```
┌──────────────────────────────────────────────────────────────┐
│ Recent Reports                                               │
├──────────────────────────────────────────────────────────────┤
│ Title ▼         │ Author       │ Status      │ Date         │
├─────────────────┼──────────────┼─────────────┼──────────────┤
│ Q1 Performance  │ Alice Smith  │ 🟢 published│ 2026-05-01   │
│ User Growth     │ Bob Jones    │ 🟡 draft    │ 2026-05-03   │
│ Server Costs    │ Charlie Brown│ ⚪ archived │ 2026-04-20   │
│ Marketing ROI   │ Alice Smith  │ 🟢 published│ 2026-05-05   │
└─────────────────┴──────────────┴─────────────┴──────────────┘
```
