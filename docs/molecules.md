# 🧩 Molecules — Componentes Moleculares

Los molecules son **combinaciones de atoms** que forman unidades funcionales con un propósito específico. Contienen lógica de presentación mínima y son reutilizables en diferentes contextos. Se ubican en `src/components/molecules/`.

---

## Índice

- [KPICard](#kpicard)
- [FormField](#formfield)
- [NavItem](#navitem)

---

## KPICard

**Archivo**: `src/components/molecules/KPICard.tsx`

Tarjeta de indicador clave de rendimiento (KPI) que muestra un título, valor, porcentaje de cambio y un ícono de tendencia.

### Dependencias

| Atom/Tipo     | Origen                  |
| ------------- | ----------------------- |
| `Card`        | `atoms/Card`            |
| `CardHeader`  | `atoms/Card`            |
| `CardTitle`   | `atoms/Card`            |
| `CardContent` | `atoms/Card`            |
| `KPIData`     | `@/types`               |
| Íconos        | `lucide-react` (ArrowUpRight, ArrowDownRight, Minus) |

### Props

```typescript
interface KPICardProps {
  data: KPIData;
}
```

Donde `KPIData` es:

```typescript
interface KPIData {
  id: string;
  title: string;     // Nombre del KPI (ej: "Total Revenue")
  value: string;     // Valor formateado (ej: "$45,231.89")
  change: number;    // Porcentaje de cambio
  trend: 'up' | 'down' | 'neutral';
}
```

### Comportamiento visual

| Tendencia  | Color del cambio | Ícono             |
| ---------- | ---------------- | ----------------- |
| `up`       | `text-green-500` | `ArrowUpRight`    |
| `down`     | `text-red-500`   | `ArrowDownRight`  |
| `neutral`  | `text-muted`     | `Minus`           |

### Ejemplo de uso

```tsx
import { KPICard } from '@/components/molecules/KPICard';

const kpi = {
  id: '1',
  title: 'Total Revenue',
  value: '$45,231.89',
  change: 20.1,
  trend: 'up' as const,
};

<KPICard data={kpi} />
```

### Estructura renderizada

```
┌─────────────────────────┐
│ Total Revenue           │  ← CardTitle (text-sm)
│                         │
│ $45,231.89              │  ← Valor (text-2xl font-bold)
│ ↑ 20.1% from last month│  ← Cambio con ícono de tendencia
└─────────────────────────┘
```

---

## FormField

**Archivo**: `src/components/molecules/FormField.tsx`

Campo de formulario que combina un `<label>`, un `Input` atom y un mensaje de error opcional.

### Dependencias

| Atom           | Origen            |
| -------------- | ----------------- |
| `Input`        | `atoms/Input`     |
| `Typography`   | `atoms/Typography`|

### Props

```typescript
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;    // Texto del label
  error?: string;   // Mensaje de error (si existe, muestra borde rojo)
}
```

| Prop    | Tipo     | Requerido | Descripción                                     |
| ------- | -------- | --------- | ----------------------------------------------- |
| `label` | `string` | Sí        | Texto descriptivo del campo                      |
| `error` | `string` | No        | Mensaje de error de validación                   |
| `id`    | `string` | No        | ID para conectar label con input via `htmlFor`   |
| `...rest` | —      | —         | Todos los props de `<input>` se pasan al Input   |

### Comportamiento

- Si `error` está presente:
  - El input obtiene `border-red-500`
  - Se muestra un `<Typography variant="muted">` con el error en rojo

### Ejemplo de uso

```tsx
import { FormField } from '@/components/molecules/FormField';

// Campo básico
<FormField
  id="email"
  label="Email"
  type="email"
  placeholder="name@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Campo con error
<FormField
  id="password"
  label="Password"
  type="password"
  error="La contraseña debe tener al menos 8 caracteres"
/>
```

### Estructura renderizada

```
┌─────────────────────────────────┐
│ Email                           │  ← <label>
│ ┌─────────────────────────────┐ │
│ │ name@example.com            │ │  ← <Input>
│ └─────────────────────────────┘ │
│ Error message (si aplica)       │  ← <Typography variant="muted">
└─────────────────────────────────┘
```

---

## NavItem

**Archivo**: `src/components/molecules/NavItem.tsx`

Enlace de navegación para el sidebar con soporte para estado activo y modo colapsado.

### Dependencias

| Dependencia    | Origen             |
| -------------- | ------------------ |
| `NavLink`      | `react-router-dom` |
| `cn`           | `@/utils/cn`       |

### Props

```typescript
interface NavItemProps {
  to: string;              // Ruta destino
  icon: React.ReactNode;   // Ícono (Lucide)
  label: string;           // Texto del enlace
  collapsed?: boolean;     // Ocultar texto (solo ícono)
}
```

| Prop        | Tipo             | Requerido | Default | Descripción                    |
| ----------- | ---------------- | --------- | ------- | ------------------------------ |
| `to`        | `string`         | Sí        | —       | Ruta del enlace                |
| `icon`      | `ReactNode`      | Sí        | —       | Ícono a renderizar             |
| `label`     | `string`         | Sí        | —       | Texto descriptivo              |
| `collapsed` | `boolean`        | No        | `false` | Modo sidebar colapsado         |

### Comportamiento

- Usa `NavLink` de react-router-dom para detectar automáticamente la ruta activa
- **Ruta activa**: `bg-muted text-primary`
- **Ruta inactiva**: `text-muted-foreground hover:bg-muted`
- Si `collapsed` es `true`, solo muestra el ícono

### Ejemplo de uso

```tsx
import { NavItem } from '@/components/molecules/NavItem';
import { LayoutDashboard } from 'lucide-react';

<NavItem
  to="/dashboard"
  icon={<LayoutDashboard size={20} />}
  label="Dashboard"
/>

// Modo colapsado
<NavItem
  to="/dashboard"
  icon={<LayoutDashboard size={20} />}
  label="Dashboard"
  collapsed
/>
```

### Estructura renderizada

```
┌──────────────────────────┐
│ 📊  Dashboard            │  ← NavLink (activo = fondo muted)
└──────────────────────────┘
```
