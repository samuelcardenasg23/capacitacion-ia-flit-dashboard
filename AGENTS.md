# Project: Dashboard de Analytics

## Stack
- React 19.2 + Vite 8
- TypeScript 6.0 strict
- Tailwind 4.0
- Recharts 3.3
- Vitest 4 + RTL (unit), Playwright via MCP (E2E)

## Architecture
- Atomic Design: src/components/{atoms,molecules,organisms}/
- Hooks en src/hooks/, tipos en src/types/
- Mocks en src/mocks/, alias @/* desde src/

## Code standards
- TS strict, sin any. Props con interface.
- Tailwind ordenado: layout → spacing → typography → color → states.
- ESLint strict + Prettier (2 esp, single quotes).

## Testing
- Cobertura mínima 80% lines/branches.
- Query por accesibilidad (getByRole), no testid.

## Constraints
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- WCAG 2.1 AA, mobile-first.

# Project: API Backend

## Stack
- Node 20 + Fastify 5
- TypeScript 5.6 strict
- Prisma 6 (Postgres)
- Zod 4 (validación)
- Vitest + Supertest

## Database
- Supabase Postgres
- Migrations vía Supabase MCP
- RLS habilitado por defecto

## API conventions
- REST, kebab-case URLs
- Envelope error: { error, message, details }
- JWT en cookie httpOnly + sameSite

## Testing
- 80% coverage mínimo
- Integration contra DB real
- No mocks