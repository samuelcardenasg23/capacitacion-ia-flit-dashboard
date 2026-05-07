# 🎨 Design Tokens — Sistema de Diseño

El sistema de diseño se define mediante CSS custom properties (variables CSS) en `src/index.css`, utilizando la directiva `@theme` de **Tailwind CSS v4**. Esto permite referenciar los tokens directamente como clases de Tailwind.

---

## Índice

- [Configuración](#configuración)
- [Paleta de Colores](#paleta-de-colores)
- [Radios de borde](#radios-de-borde)
- [Estilos base](#estilos-base)
- [Utilidad cn()](#utilidad-cn)
- [Convenciones de Tailwind](#convenciones-de-tailwind)
- [Cómo extender el sistema](#cómo-extender-el-sistema)

---

## Configuración

Los tokens se definen dentro de `@theme {}` en `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-background: #ffffff;
  --color-foreground: #09090b;
  /* ... */
}
```

**¿Por qué `@theme`?** Tailwind CSS v4 usa un enfoque CSS-first. Los tokens dentro de `@theme` son automáticamente registrados como clases de Tailwind (ej: `bg-background`, `text-primary`, etc.).

---

## Paleta de Colores

### Colores principales

| Token                        | Valor     | Clase Tailwind          | Uso                              |
| ---------------------------- | --------- | ----------------------- | -------------------------------- |
| `--color-background`         | `#ffffff` | `bg-background`         | Fondo general de la app          |
| `--color-foreground`         | `#09090b` | `text-foreground`       | Texto principal                  |
| `--color-primary`            | `#18181b` | `bg-primary`            | Botones principales, acentos     |
| `--color-primary-foreground` | `#fafafa` | `text-primary-foreground`| Texto sobre primary              |

### Colores secundarios

| Token                           | Valor     | Clase Tailwind             | Uso                           |
| ------------------------------- | --------- | -------------------------- | ----------------------------- |
| `--color-secondary`             | `#f4f4f5` | `bg-secondary`             | Botones secundarios           |
| `--color-secondary-foreground`  | `#18181b` | `text-secondary-foreground`| Texto sobre secondary         |

### Colores de estado

| Token                           | Valor     | Clase Tailwind              | Uso                           |
| ------------------------------- | --------- | --------------------------- | ----------------------------- |
| `--color-muted`                 | `#f4f4f5` | `bg-muted`                  | Fondos sutiles, nav activa    |
| `--color-muted-foreground`      | `#71717a` | `text-muted-foreground`     | Texto secundario/placeholder  |
| `--color-accent`                | `#f4f4f5` | `bg-accent`                 | Hover states                  |
| `--color-accent-foreground`     | `#18181b` | `text-accent-foreground`    | Texto en hover state          |
| `--color-destructive`           | `#ef4444` | `bg-destructive`            | Acciones peligrosas           |
| `--color-destructive-foreground`| `#fafafa` | `text-destructive-foreground`| Texto sobre destructive      |

### Colores de superficie

| Token                        | Valor     | Clase Tailwind          | Uso                              |
| ---------------------------- | --------- | ----------------------- | -------------------------------- |
| `--color-card`               | `#ffffff` | `bg-card`               | Fondo de tarjetas (Card)         |
| `--color-card-foreground`    | `#09090b` | `text-card-foreground`  | Texto dentro de tarjetas         |
| `--color-popover`            | `#ffffff` | `bg-popover`            | Fondo de popovers/dropdowns      |
| `--color-popover-foreground` | `#09090b` | `text-popover-foreground`| Texto en popovers               |

### Colores de interfaz

| Token             | Valor     | Clase Tailwind | Uso                               |
| ----------------- | --------- | -------------- | --------------------------------- |
| `--color-border`  | `#e4e4e7` | `border-border`| Bordes generales                  |
| `--color-input`   | `#e4e4e7` | `border-input` | Bordes de inputs                  |
| `--color-ring`    | `#18181b` | `ring-ring`    | Anillo de focus                   |

---

## Radios de borde

| Token          | Valor                    | Clase Tailwind    | Uso                    |
| -------------- | ------------------------ | ----------------- | ---------------------- |
| `--radius-lg`  | `0.5rem` (8px)           | `rounded-lg`      | Tarjetas, modales      |
| `--radius-md`  | `calc(0.5rem - 2px)` (~6px) | `rounded-md`  | Botones, inputs        |
| `--radius-sm`  | `calc(0.5rem - 4px)` (~4px) | `rounded-sm`  | Badges, chips          |

---

## Estilos base

Los estilos globales se aplican en la capa `@layer base`:

```css
@layer base {
  *, ::after, ::before {
    box-sizing: border-box;
    border: 0 solid var(--color-border);
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### Características

- **Box sizing**: `border-box` global
- **Bordes por defecto**: Todos los elementos tienen `border: 0 solid` con el color de borde del tema
- **Body**: Fondo y color de texto del tema
- **Tipografía**: Ligaduras habilitadas (`rlig`, `calt`)

---

## Utilidad `cn()`

**Archivo**: `src/utils/cn.ts`

Función que combina `clsx` (composición condicional de clases) con `tailwind-merge` (resolución de conflictos de Tailwind):

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### ¿Por qué usar `cn()`?

```tsx
// ❌ Sin cn() — las clases podrían entrar en conflicto
<div className={`px-4 py-2 ${isActive ? 'px-6' : ''}`} />
// Resultado: "px-4 py-2 px-6" — ambos px-4 y px-6 se aplican (conflicto)

// ✅ Con cn() — tailwind-merge resuelve conflictos
<div className={cn('px-4 py-2', isActive && 'px-6')} />
// Resultado: "py-2 px-6" — px-4 se elimina porque px-6 tiene prioridad
```

### Patrones de uso

```tsx
// Clases condicionales
cn('base-class', isActive && 'active-class')

// Objetos de clases
cn('base', { 'bg-primary': isPrimary, 'bg-secondary': isSecondary })

// Merge con className externo (patrón de componentes)
cn('default-styles', className)
```

---

## Convenciones de Tailwind

### Orden de clases

Las clases de Tailwind deben seguir este orden:

```
layout → spacing → typography → color → states
```

**Ejemplo**:
```tsx
// ✅ Correcto
<div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary" />

// ❌ Incorrecto (orden mezclado)
<div className="text-sm hover:text-primary flex px-3 text-muted-foreground items-center" />
```

### Categorías de orden

| Orden | Categoría   | Ejemplos                               |
| ----- | ----------- | -------------------------------------- |
| 1     | Layout      | `flex`, `grid`, `block`, `w-full`      |
| 2     | Spacing     | `px-4`, `py-2`, `gap-3`, `space-y-2`  |
| 3     | Typography  | `text-sm`, `font-medium`, `leading-7`  |
| 4     | Color       | `bg-primary`, `text-foreground`        |
| 5     | States      | `hover:bg-muted`, `focus:ring-1`       |

---

## Cómo extender el sistema

### Agregar un nuevo color

1. Añadir el token en `src/index.css` dentro de `@theme`:

```css
@theme {
  /* ... tokens existentes ... */
  --color-success: #22c55e;
  --color-success-foreground: #ffffff;
}
```

2. Usarlo directamente como clase Tailwind:

```tsx
<span className="bg-success text-success-foreground">Éxito</span>
```

### Agregar un nuevo radio

```css
@theme {
  --radius-xl: 0.75rem;
}
```

```tsx
<div className="rounded-xl">...</div>
```

### Agregar dark mode (futuro)

Para implementar dark mode, se puede usar la directiva `@media (prefers-color-scheme: dark)` o una clase en el `<html>`:

```css
@theme {
  /* Light (default) */
  --color-background: #ffffff;
  --color-foreground: #09090b;
}

/* Dark mode override */
.dark {
  --color-background: #09090b;
  --color-foreground: #fafafa;
  /* ... sobrescribir todos los tokens ... */
}
```

> **Nota**: Dark mode no está implementado actualmente, pero el sistema de tokens lo soporta de forma nativa.
