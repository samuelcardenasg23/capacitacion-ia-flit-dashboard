import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildApp } from '../src/app.js';
import { globalPrisma } from '../src/lib/prisma.js';
import { generateTokens } from '../src/services/authService.js';
import type { FastifyInstance } from 'fastify';

describe('Stats API', () => {
  let app: FastifyInstance;
  const orgId = 'org-test-001'; 
  const userId = 'user-test-001'; 
  const secondOrgId = 'org-test-002';
  let accessToken: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
    const tokens = generateTokens({
      id: userId,
      email: 'user-a@test.com',
      organizationId: orgId,
    });
    accessToken = tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar transacciones antes de cada prueba para tener un estado predecible
    await globalPrisma.transaction.deleteMany();
  });

  describe('GET /stats/total-revenue', () => {
    it('should return 0 when there are no transactions', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/stats/total-revenue',
        cookies: {
          access_token: accessToken,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(0);
    });

    it('should calculate the sum of INCOME transactions correctly', async () => {
      // Create some mixed transactions
      await globalPrisma.transaction.createMany({
        data: [
          { amount: 100.50, type: 'INCOME', category: 'Sales', organizationId: orgId },
          { amount: 50.25, type: 'INCOME', category: 'Consulting', organizationId: orgId },
          { amount: 200.00, type: 'EXPENSE', category: 'Software', organizationId: orgId },
          { amount: 300.00, type: 'INCOME', category: 'Sales', organizationId: secondOrgId } // Other org
        ]
      });

      const response = await app.inject({
        method: 'GET',
        url: '/stats/total-revenue',
        cookies: {
          access_token: accessToken,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(150.75); // 100.50 + 50.25
    });

    it('should return 401 when not authenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/stats/total-revenue',
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
