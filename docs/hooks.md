# 🪝 Hooks — Custom Hooks

Los custom hooks encapsulan lógica reutilizable que puede ser consumida por cualquier componente. Se ubican en `src/hooks/`.

---

## Índice

- [useAuth](#useauth)

---

## useAuth

**Archivo**: `src/hooks/useAuth.ts`

Hook de autenticación que gestiona el estado del usuario, login y logout utilizando `localStorage` como persistencia.

### Retorno

```typescript
function useAuth(): {
  user: User | null;           // Usuario autenticado o null
  login: () => void;           // Función para iniciar sesión
  logout: () => void;          // Función para cerrar sesión
  isLoading: boolean;          // true durante la verificación inicial
  isAuthenticated: boolean;    // true si hay un usuario autenticado
}
```

| Propiedad         | Tipo           | Descripción                                           |
| ----------------- | -------------- | ----------------------------------------------------- |
| `user`            | `User \| null` | Objeto del usuario autenticado, o `null` si no hay sesión |
| `login`           | `() => void`   | Establece `auth_fake` en localStorage y setea el usuario mock |
| `logout`          | `() => void`   | Remueve `auth_fake` de localStorage y limpia el usuario |
| `isLoading`       | `boolean`      | `true` mientras se lee localStorage al montar el hook  |
| `isAuthenticated` | `boolean`      | Derivado: `!!user`                                     |

### Tipo `User`

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}
```

### Flujo de funcionamiento

```
┌──────────────────────────────────┐
│          useAuth() mount         │
│                                  │
│  1. isLoading = true             │
│  2. Lee localStorage('auth_fake')│
│                                  │
│  ┌────────┐     ┌──────────────┐ │
│  │ Existe │─YES─│ user = MOCK  │ │
│  └────────┘     └──────────────┘ │
│      │ NO                        │
│      ▼                           │
│  user = null                     │
│                                  │
│  3. isLoading = false            │
└──────────────────────────────────┘
```

### Login flow

```
login()
  ├── localStorage.setItem('auth_fake', 'true')
  └── setUser(MOCK_USER)
```

### Logout flow

```
logout()
  ├── localStorage.removeItem('auth_fake')
  └── setUser(null)
```

### Usuario mock

El hook utiliza un usuario mock hardcodeado:

```typescript
const MOCK_USER: User = {
  id: 'usr_123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'admin',
};
```

> **Nota**: Este usuario mock se usa independientemente de las credenciales ingresadas en el login. Cualquier email/password es aceptado.

### Uso en componentes

#### En MainLayout (auth guard)

```tsx
export function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (/* layout */);
}
```

#### En Header (logout)

```tsx
export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      {user?.name}
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  );
}
```

#### En Login (redirect si autenticado)

```tsx
export function Login() {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = () => {
    login();
    navigate('/dashboard');
  };
}
```

### Consideraciones

> [!IMPORTANT]
> **Limitación**: Cada llamada a `useAuth()` crea una instancia independiente de estado. Esto significa que el login/logout en un componente **no se propaga** automáticamente a otros que también usen `useAuth()`.
>
> Para una aplicación de producción, se debería envolver el estado de auth en un **React Context** para compartir el estado entre todos los componentes.

### Testing

El archivo de tests está en `src/hooks/useAuth.test.ts` y cubre:

- Estado inicial (no autenticado, loading)
- Flujo de login (user seteado, localStorage actualizado)
- Flujo de logout (user limpiado, localStorage limpiado)
- Persistencia de sesión (lee localStorage al montar)
