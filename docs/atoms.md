# ⚛️ Atoms — Componentes Atómicos

Los atoms son los **bloques de construcción más pequeños** de la interfaz. No contienen lógica de negocio y son 100% reutilizables. Se ubican en `src/components/atoms/`.

---

## Índice

- [Button](#button)
- [Card (Card, CardHeader, CardTitle, CardContent)](#card)
- [Input](#input)
- [Typography](#typography)
- [Logo](#logo)

---

## Button

**Archivo**: `src/components/atoms/Button.tsx`

Botón reutilizable con múltiples variantes y tamaños. Usa `forwardRef` para compatibilidad con refs.

### Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}
```

| Prop       | Tipo                                                       | Default     | Descripción                       |
| ---------- | ---------------------------------------------------------- | ----------- | --------------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Estilo visual del botón           |
| `size`     | `'sm' \| 'md' \| 'lg' \| 'icon'`                          | `'md'`      | Tamaño del botón                  |
| `className`| `string`                                                   | —           | Clases CSS adicionales            |
| `...rest`  | `ButtonHTMLAttributes`                                     | —           | Atributos HTML nativos del botón  |

### Variantes visuales

| Variante      | Descripción                                      |
| ------------- | ------------------------------------------------ |
| `primary`     | Fondo oscuro, texto claro. Acción principal      |
| `secondary`   | Fondo gris claro. Acción secundaria              |
| `outline`     | Solo borde. Acción terciaria                     |
| `ghost`       | Sin fondo. Hover sutil                           |
| `destructive` | Fondo rojo. Acciones destructivas                |

### Tamaños

| Tamaño | Altura | Padding     |
| ------ | ------ | ----------- |
| `sm`   | `h-8`  | `px-3`      |
| `md`   | `h-9`  | `px-4 py-2` |
| `lg`   | `h-10` | `px-8`      |
| `icon` | `h-9 w-9` | —       |

### Ejemplo de uso

```tsx
import { Button } from '@/components/atoms/Button';

// Botón primario
<Button onClick={handleClick}>Guardar</Button>

// Botón destructivo pequeño
<Button variant="destructive" size="sm">Eliminar</Button>

// Botón de ícono (ej: logout)
<Button variant="ghost" size="icon">
  <LogOut size={20} />
</Button>
```

---

## Card

**Archivo**: `src/components/atoms/Card.tsx`

Sistema de tarjetas compuesto por 4 sub-componentes. Todos usan `forwardRef`.

### Sub-componentes

| Componente     | Elemento HTML | Estilos base                                        |
| -------------- | ------------- | --------------------------------------------------- |
| `Card`         | `<div>`       | `rounded-xl border bg-card text-card-foreground shadow` |
| `CardHeader`   | `<div>`       | `flex flex-col space-y-1.5 p-6`                     |
| `CardTitle`    | `<h3>`        | `font-semibold leading-none tracking-tight`          |
| `CardContent`  | `<div>`       | `p-6 pt-0`                                          |

### Props

Todos los sub-componentes aceptan `HTMLAttributes<HTMLDivElement>` (o `HTMLHeadingElement` para `CardTitle`) más `className`.

### Ejemplo de uso

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

<Card>
  <CardHeader>
    <CardTitle>Título de la tarjeta</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenido aquí</p>
  </CardContent>
</Card>
```

---

## Input

**Archivo**: `src/components/atoms/Input.tsx`

Input de texto estilizado. Usa `forwardRef` para compatibilidad con formularios controlados.

### Props

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
```

Acepta todos los atributos nativos de `<input>`.

### Características

- Altura fija: `h-9`
- Borde con token `border-input`
- Fondo transparente
- Focus ring con token `ring`
- Soporte para estado deshabilitado
- Soporte para `file` inputs

### Ejemplo de uso

```tsx
import { Input } from '@/components/atoms/Input';

<Input
  type="email"
  placeholder="name@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## Typography

**Archivo**: `src/components/atoms/Typography.tsx`

Componente de tipografía con variantes semánticas. Renderiza el elemento HTML apropiado según la variante.

### Props

```typescript
interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted';
  as?: React.ElementType;
}
```

| Prop      | Tipo                                                    | Default | Descripción                                 |
| --------- | ------------------------------------------------------- | ------- | ------------------------------------------- |
| `variant` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'p' \| 'small' \| 'muted'` | `'p'`   | Variante tipográfica                        |
| `as`      | `React.ElementType`                                     | —       | Override del elemento HTML renderizado        |

### Variantes

| Variante | Elemento | Estilos                                              |
| -------- | -------- | ---------------------------------------------------- |
| `h1`     | `<h1>`   | `text-4xl font-extrabold tracking-tight lg:text-5xl` |
| `h2`     | `<h2>`   | `text-3xl font-semibold tracking-tight border-b`     |
| `h3`     | `<h3>`   | `text-2xl font-semibold tracking-tight`              |
| `h4`     | `<h4>`   | `text-xl font-semibold tracking-tight`               |
| `p`      | `<p>`    | `leading-7`                                          |
| `small`  | `<p>`    | `text-sm font-medium leading-none`                   |
| `muted`  | `<p>`    | `text-sm text-muted-foreground`                      |

### Ejemplo de uso

```tsx
import { Typography } from '@/components/atoms/Typography';

<Typography variant="h2">Dashboard</Typography>
<Typography variant="muted">Texto secundario</Typography>
<Typography variant="h3" as="span">Renderiza como span</Typography>
```

---

## Logo

**Archivo**: `src/components/atoms/Logo.tsx`

Logo de la aplicación con ícono de `Activity` (Lucide) y texto "Flit Analytics".

### Props

```typescript
interface LogoProps {
  className?: string;
  collapsed?: boolean;
}
```

| Prop        | Tipo      | Default | Descripción                               |
| ----------- | --------- | ------- | ----------------------------------------- |
| `className` | `string`  | —       | Clases CSS adicionales                    |
| `collapsed` | `boolean` | `false` | Si `true`, oculta el texto y solo muestra el ícono |

### Ejemplo de uso

```tsx
import { Logo } from '@/components/atoms/Logo';

// Logo completo
<Logo />

// Logo colapsado (solo ícono)
<Logo collapsed />
```
