# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: server/tests/integration/create-transactions.spec.ts >> POST /transactions API >> should return 400 if "amount" has an invalid format
- Location: server/tests/integration/create-transactions.spec.ts:60:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 401
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const baseURL = 'http://localhost:3001';
  4  | 
  5  | test.describe('POST /transactions API', () => {
  6  |   // TC01: Happy Path con datos válidos
  7  |   test('should create a transaction successfully with valid data', async ({ request }) => {
  8  |     const response = await request.post(`${baseURL}/transactions`, {
  9  |       // Assuming a valid token is handled by a global setup or passed here
  10 |       headers: {
  11 |         'Authorization': 'Bearer FAKE_JWT_TOKEN_FOR_TESTING',
  12 |       },
  13 |       data: {
  14 |         amount: 150.75,
  15 |         type: 'INCOME',
  16 |         category: 'Sales',
  17 |         description: 'Sale of Product A',
  18 |         date: new Date().toISOString(),
  19 |       },
  20 |     });
  21 | 
  22 |     expect(response.status()).toBe(201);
  23 |     const responseBody = await response.json();
  24 |     expect(responseBody).toHaveProperty('id');
  25 |     expect(responseBody.amount).toBe('150.75');
  26 |     expect(responseBody.category).toBe('Sales');
  27 |   });
  28 | 
  29 |   // TC02: Falta campo obligatorio 'amount'
  30 |   test('should return 400 if required field "amount" is missing', async ({ request }) => {
  31 |     const response = await request.post(`${baseURL}/transactions`, {
  32 |       headers: {
  33 |         'Authorization': 'Bearer FAKE_JWT_TOKEN_FOR_TESTING',
  34 |       },
  35 |       data: {
  36 |         // amount is missing
  37 |         type: 'INCOME',
  38 |         category: 'Sales',
  39 |         description: 'Sale without amount',
  40 |       },
  41 |     });
  42 | 
  43 |     expect(response.status()).toBe(400);
  44 |   });
  45 | 
  46 |   // TC03: Usuario no autenticado
  47 |   test('should return 401 if user is not authenticated', async ({ request }) => {
  48 |     const response = await request.post(`${baseURL}/transactions`, {
  49 |       data: {
  50 |         amount: 100,
  51 |         type: 'INCOME',
  52 |         category: 'Sales',
  53 |       },
  54 |     });
  55 | 
  56 |     expect(response.status()).toBe(401);
  57 |   });
  58 | 
  59 |   // TC04: 'amount' con formato inválido
  60 |   test('should return 400 if "amount" has an invalid format', async ({ request }) => {
  61 |     const response = await request.post(`${baseURL}/transactions`, {
  62 |       headers: {
  63 |         'Authorization': 'Bearer FAKE_JWT_TOKEN_FOR_TESTING',
  64 |       },
  65 |       data: {
  66 |         amount: 'not-a-number', // Invalid format
  67 |         type: 'EXPENSE',
  68 |         category: 'Utilities',
  69 |       },
  70 |     });
  71 | 
> 72 |     expect(response.status()).toBe(400);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  73 |   });
  74 | });
  75 | 
```