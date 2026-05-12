# Backend Technical Specification - Dashboard de Analytics

## 1. Understanding Summary
- **Purpose**: A multi-tenant REST API to manage financial transactions and serve aggregated metrics for an analytics dashboard.
- **Target Users**: Corporate users who need isolated access to their organization's financial performance.
- **Core Entity**: Transactions (Sales).
- **Multi-tenancy**: Isolated by Organizations using database-level filtering and RLS concepts.

## 2. Technical Stack
- **Runtime**: Node.js 20
- **Framework**: Fastify 5
- **Language**: TypeScript 5.6 (Strict)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 6
- **Validation**: Zod 4
- **Testing**: Vitest + Supertest (Real DB integration)

## 3. Data Model (Prisma Schema)
```prisma
model Organization {
  id           String        @id @default(uuid())
  name         String
  createdAt    DateTime      @default(now())
  users        User[]
  transactions Transaction[]
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  password       String       // Argon2/Bcrypt Hashed
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
}

model Transaction {
  id             String       @id @default(uuid())
  amount         Decimal      @db.Decimal(10, 2)
  date           DateTime     @default(now())
  status         String       // "completed", "pending", "cancelled"
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId, date])
}
```

## 4. API Endpoints
All protected endpoints require a valid `auth_token` cookie.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Authenticates user, sets `httpOnly` cookie. |
| `GET` | `/me` | Returns current user profile and organization. |
| `GET` | `/kpis` | Returns 4 core financial metrics (Total Revenue, Avg Ticket, etc.). |
| `GET` | `/charts/timeseries` | Aggregated data for the last 30 days. |
| `GET` | `/reports` | List of transactions with sorting and pagination. |

### Error Envelope
```json
{
  "error": "STRING_CODE",
  "message": "Human readable message",
  "details": null
}
```

## 5. Folder Structure
The backend will live in a dedicated `server/` directory.
```text
server/
├── prisma/               # Schema and migrations
├── src/
│   ├── routes/           # Fastify routes (Controllers)
│   ├── services/         # Business Logic (Calculations)
│   ├── schemas/          # Zod validation schemas
│   ├── plugins/          # Auth & Prisma setup
│   └── app.ts            # App entry point
├── tests/                # Integration tests
└── package.json
```

## 6. Security & Auth
- **Auth Strategy**: JWT stored in `httpOnly`, `Secure`, `SameSite: Strict` cookies.
- **Tenant Isolation**: Every service call must inject the `organizationId` from the authenticated user into Prisma queries.
- **Input Validation**: Strict Zod schemas for all request bodies and query parameters.

## 7. Testing Strategy
- **Coverage**: Minimum 80%.
- **Type**: Integration tests against a real Postgres database (Shadow/Test DB).
- **Constraint**: No mocking of database layers.
- **Validation**: Verify that users cannot access data from organizations other than their own.

## 8. Decision Log
- **Modular Layered Architecture**: Chosen for long-term maintainability of complex analytics logic.
- **Cookie-based JWT**: Selected for superior protection against XSS and CSRF.
- **Prisma 6**: Chosen for type-safety and developer productivity with modern Postgres.
- **Vertical Indexing**: Added composite index on `(organizationId, date)` to ensure sub-300ms latency on time-series queries.
