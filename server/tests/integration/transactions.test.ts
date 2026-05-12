import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../../src/app.js';
import { hashPassword } from '../../src/services/authService.js';
import type { FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

const TEST_ORG = {
  id: 'org-trx-test-001',
  name: 'Trx Test Corp',
};

const TEST_USER = {
  id: 'user-trx-test-001',
  email: 'test@trx-test.com',
  password: 'SecurePass123!',
  organizationId: TEST_ORG.id,
};

let app: FastifyInstance;
let accessToken: string;

beforeAll(async () => {
  // Clean and seed test data
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  await prisma.organization.create({
    data: { id: TEST_ORG.id, name: TEST_ORG.name },
  });

  const hashed = await hashPassword(TEST_USER.password);
  await prisma.user.create({
    data: {
      id: TEST_USER.id,
      email: TEST_USER.email,
      password: hashed,
      organizationId: TEST_USER.organizationId,
    },
  });

  // Build Fastify app
  app = buildApp();
  await app.ready();

  // Login to get access token
  const loginResponse = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: {
      email: TEST_USER.email,
      password: TEST_USER.password,
    },
  });
  
  const accessCookie = loginResponse.cookies.find(
    (c: { name: string }) => c.name === 'access_token'
  );
  if (!accessCookie) throw new Error('Failed to login in beforeAll');
  accessToken = accessCookie.value;
});

afterAll(async () => {
  // Cleanup
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.$disconnect();
  await app.close();
});

describe('POST /transactions', () => {
  it('should return 401 without auth', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        amount: 100,
        type: 'INCOME',
        category: 'Sales'
      }
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 401 with invalid auth token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      cookies: { access_token: 'invalid-token-format' },
      payload: {
        amount: 100,
        type: 'INCOME',
        category: 'Sales'
      }
    });

    expect(response.statusCode).toBe(401);
  });

  it('should create a valid transaction and return 201', async () => {
    const payload = {
      amount: 1000,
      type: 'INCOME',
      category: 'Sales',
      description: 'First sale',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      cookies: { access_token: accessToken },
      payload
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.id).toBeDefined();
    expect(Number(body.amount)).toBe(1000);
    expect(body.type).toBe('INCOME');
    expect(body.category).toBe('Sales');
    expect(body.description).toBe('First sale');
    expect(body.organizationId).toBe(TEST_ORG.id);
  });

  it('should return 400 for invalid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      cookies: { access_token: accessToken },
      payload: {
        amount: -100, // Invalid
        type: 'INCOME',
        category: 'Sales',
      }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('VALIDATION_ERROR');
  });

  it('should return 500 when create fails', async () => {
    // We can simulate failure by providing missing data to Prisma, 
    // but schema validation protects it. We will spy on the service.
    const { TransactionService } = await import('../../src/services/transactionService.js');
    const spy = vi.spyOn(TransactionService.prototype, 'createTransaction').mockRejectedValueOnce(new Error('Simulated DB error'));
    
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      cookies: { access_token: accessToken },
      payload: {
        amount: 100,
        type: 'INCOME',
        category: 'Sales'
      }
    });

    expect(response.statusCode).toBe(500);
    spy.mockRestore();
  });
});

describe('GET /transactions', () => {
  it('should return transactions for the organization', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/transactions',
      cookies: { access_token: accessToken },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].organizationId).toBe(TEST_ORG.id);
  });

  it('should return 500 when fetch fails', async () => {
    const { TransactionService } = await import('../../src/services/transactionService.js');
    const spy = vi.spyOn(TransactionService.prototype, 'getTransactions').mockRejectedValueOnce(new Error('Simulated DB error'));
    
    const response = await app.inject({
      method: 'GET',
      url: '/transactions',
      cookies: { access_token: accessToken },
    });

    expect(response.statusCode).toBe(500);
    spy.mockRestore();
  });
});
