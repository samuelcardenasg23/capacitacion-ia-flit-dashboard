# Story 001: Autenticación y Multi-tenancy (CORE)

## Contexto
Como usuario del sistema, quiero iniciar sesión mediante JWT y ser asignado automáticamente a mi organización para que mis datos estén aislados y seguros. Esta es la base de todo el sistema y bloquea las demás historias.

## Archivos a crear/modificar
- `server/prisma/schema.prisma`: Modelos `User` y `Organization`.
- `server/src/routes/auth.ts`: Endpoint `/auth/login`.
- `server/src/services/authService.ts`: Lógica de validación de contraseña (Argon2) y generación de JWT.
- `server/src/repositories/userRepository.ts`: Acceso a datos de usuarios.
- `server/src/middlewares/authMiddleware.ts`: Verificación de JWT e inyección de `organizationId` en el contexto.

## Snippets de Architecture.md
```prisma
model Organization {
  id           String        @id @default(uuid())
  name         String
  users        User[]
  transactions Transaction[]
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  password       String       // Argon2 hashed
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
}
```
**JWT Strategy**: `access_token` y `refresh_token` en cookies `httpOnly`, `Secure`, `SameSite: Strict`.

## Criterios de Aceptación
- **Given** un usuario con credenciales válidas.
- **When** realiza una petición POST a `/auth/login`.
- **Then** el sistema devuelve una cookie httpOnly con el JWT y el `organizationId` asociado en el payload/session.

## Tests Requeridos
- Unit: `authService.verifyCredentials` con Argon2.
- Integration: POST `/auth/login` devuelve 200 y cookies correctas.
- Integration: POST `/auth/login` con credenciales inválidas devuelve 401.
