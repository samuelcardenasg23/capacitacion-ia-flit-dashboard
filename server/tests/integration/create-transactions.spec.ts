import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001';

test.describe('POST /transactions API', () => {
  // TC01: Happy Path con datos válidos
  test('should create a transaction successfully with valid data', async ({ request }) => {
    const response = await request.post(`${baseURL}/transactions`, {
      // Assuming a valid token is handled by a global setup or passed here
      headers: {
        'Authorization': 'Bearer FAKE_JWT_TOKEN_FOR_TESTING',
      },
      data: {
        amount: 150.75,
        type: 'INCOME',
        category: 'Sales',
        description: 'Sale of Product A',
        date: new Date().toISOString(),
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.amount).toBe('150.75');
    expect(responseBody.category).toBe('Sales');
  });

  // TC02: Falta campo obligatorio 'amount'
  test('should return 400 if required field "amount" is missing', async ({ request }) => {
    const response = await request.post(`${baseURL}/transactions`, {
      headers: {
        'Authorization': 'Bearer FAKE_JWT_TOKEN_FOR_TESTING',
      },
      data: {
        // amount is missing
        type: 'INCOME',
        category: 'Sales',
        description: 'Sale without amount',
      },
    });

    expect(response.status()).toBe(400);
  });

  // TC03: Usuario no autenticado
  test('should return 401 if user is not authenticated', async ({ request }) => {
    const response = await request.post(`${baseURL}/transactions`, {
      data: {
        amount: 100,
        type: 'INCOME',
        category: 'Sales',
      },
    });

    expect(response.status()).toBe(401);
  });

  // TC04: 'amount' con formato inválido
  test('should return 400 if "amount" has an invalid format', async ({ request }) => {
    const response = await request.post(`${baseURL}/transactions`, {
      headers: {
        'Authorization': 'Bearer FAKE_JWT_TOKEN_FOR_TESTING',
      },
      data: {
        amount: 'not-a-number', // Invalid format
        type: 'EXPENSE',
        category: 'Utilities',
      },
    });

    expect(response.status()).toBe(400);
  });
});
