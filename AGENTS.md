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