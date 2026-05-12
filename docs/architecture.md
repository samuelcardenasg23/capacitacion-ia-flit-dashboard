# Technical Architecture - Flit Analytics Backend

**Author:** Winston (BMad Architect)
**Date:** 2026-05-11
**Version:** 1.0.0

## 1. Introduction
This document defines the technical architecture for the Flit Analytics Backend. It follows a modular, layered structure optimized for a 3-hour implementation sprint using Node 20, Fastify 5, and Prisma 6.

---

## 2. Database Schema (Prisma 6)

We use PostgreSQL (Supabase) with Row Level Security (RLS) enabled. The `organizationId` is the primary tenant separator.

```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id           String        @id @default(uuid())
  name         String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  users        User[]
  transactions Transaction[]
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  password       String       // Argon2 hashed
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum TransactionType {
  INCOME
  EXPENSE
}

model Transaction {
  id             String          @id @default(uuid())
  amount         Decimal         @db.Decimal(12, 2)
  type           TransactionType
  category       String
  description    String?
  date           DateTime        @default(now())
  organizationId String
  organization   Organization    @relation(fields: [organizationId], references: [id])
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([organizationId, date])
  @@index([organizationId, category])
}
```

---

## 3. API Endpoints (REST)

All endpoints (except login) require a valid JWT session.

### 3.1 Authentication
| Method | Route | Request Body | Response |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | `{ email, password }` | `200 OK` + Cookies |
| `POST` | `/auth/refresh` | `(From Cookie)` | `200 OK` + New Cookies |
| `POST` | `/auth/logout` | `None` | `204 No Content` |

### 3.2 User & Org
| Method | Route | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Get current user and org info | `{ id, email, organization: { id, name } }` |

### 3.3 Transactions
| Method | Route | Description | Request Query/Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions` | List (Paginated + Filter) | `?page=1&limit=10&startDate=...&endDate=...` |
| `POST` | `/transactions` | Create new | `{ amount, type, category, description, date? }` |
| `GET` | `/transactions/:id` | Get detail | `None` |

### 3.4 Statistics (Analytics)
| Method | Route | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats/total-revenue` | Total accumulated income | `{ total: number }` |
| `GET` | `/stats/monthly-revenue` | Time series (last 12m) | `[{ month: string, total: number }]` |
| `GET` | `/stats/average-ticket` | Revenue / Count | `{ average: number }` |
| `GET` | `/stats/expenses-by-category` | Breakdown | `[{ category: string, total: number, percentage: number }]` |

---

## 4. Layered Architecture

The project is divided into three main layers to separate concerns:

1.  **Routes (Controllers)**:
    - Registered via Fastify plugins.
    - Handle input validation using **Zod 4**.
    - Extract `organizationId` from request context (injected by Auth hook).
2.  **Services (Business Logic)**:
    - Perform complex calculations (KPIs, time-series grouping).
    - Orchestrate multiple repository calls if needed.
3.  **Repositories (Data Access)**:
    - Thin layer over **Prisma 6**.
    - Responsible for ensuring the `organizationId` is always included in the query (manual RLS enforcement at application level or via Prisma Extension).

### RLS Implementation Pattern
We will use a Prisma Extension to automatically filter all queries by the authenticated user's `organizationId`.

```typescript
// Example Logic
const prisma = new PrismaClient().$extends({
  query: {
    transaction: {
      async findMany({ args, query }) {
        args.where = { ...args.where, organizationId: context.orgId };
        return query(args);
      }
    }
  }
});
```

---

## 5. Security Strategy

- **JWT Storage**: 
    - `access_token`: Stored in `httpOnly`, `Secure`, `SameSite: Strict` cookie. Expires in 15 minutes.
    - `refresh_token`: Stored in `httpOnly`, `Secure`, `SameSite: Strict` cookie. Expires in 7 days.
- **Validation**: 
    - Use `z.strictObject()` for all request payloads.
    - Use `z.email()` and `z.uuid()` for format checks.
- **Database**:
    - Row Level Security (RLS) enabled in PostgreSQL.
    - Application user connects to Postgres with a limited role.

---

## 6. Error Handling

All errors follow a unified envelope.

```typescript
interface ErrorResponse {
  error: string;    // e.g. "VALIDATION_ERROR"
  message: string;  // e.g. "Amount must be positive"
  details: any;     // e.g. Zod error details or null
}
```

---

## 7. Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"

# Authentication
JWT_SECRET="super-secret-key"
REFRESH_TOKEN_SECRET="another-super-secret-key"
COOKIE_SECRET="cookie-signing-key"

# App
PORT=3000
NODE_ENV="development"
```
