# Evidencia de Ejecución: QA_TC01_TRANSACTIONS_SCHEMA

**Resultado:** ✅ PASS
**Ambiente:** Local
**Timestamp:** 2026-05-12T17:15:31Z

## Salida de la prueba
```
> flit-analytics-server@1.0.0 test
> vitest run tests/unit/transactionSchema.test.ts

RUN  v4.1.6 /Users/samuelcardenasg23/Desktop/work/Flit/capacitacion-ia-flit/dashboard/server
 ✓ tests/unit/transactionSchema.test.ts (5 tests) 3ms
   ✓ createTransactionSchema (5)
     ✓ should validate a correct INCOME transaction 1ms
     ✓ should validate a correct EXPENSE transaction 0ms
     ✓ should reject a negative amount 0ms
     ✓ should reject invalid type 0ms
     ✓ should reject missing category 0ms
 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  17:15:31
   Duration  141ms (transform 19ms, setup 0ms, import 51ms, tests 3ms, environment 0ms)
```
