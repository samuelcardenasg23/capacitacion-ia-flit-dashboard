import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app.js';
import { hashPassword, verifyCredentials, generateTokens, verifyToken } from '../src/services/authService.js';
import type { FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

const TEST_ORG = {
  id: 'org-auth-test-001',
  name: 'Auth Test Corp',
};

const TEST_USER = {
  id: 'user-auth-test-001',
  email: 'test@auth-test.com',
  password: 'SecurePass123!',
  organizationId: TEST_ORG.id,
};

let app: FastifyInstance;

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
});

afterAll(async () => {
  // Cleanup
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.$disconnect();
  await app.close();
});

// ─── UNIT TESTS: authService ────────────────────────────────────────

describe('authService', () => {
  describe('hashPassword + verifyCredentials', () => {
    it('should verify correct password against Argon2 hash', async () => {
      const user = await verifyCredentials(prisma, TEST_USER.email, TEST_USER.password);
      expect(user.id).toBe(TEST_USER.id);
      expect(user.email).toBe(TEST_USER.email);
      expect(user.organizationId).toBe(TEST_ORG.id);
    });

    it('should reject wrong password', async () => {
      await expect(
        verifyCredentials(prisma, TEST_USER.email, 'WrongPassword99!')
      ).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should reject non-existent email', async () => {
      await expect(
        verifyCredentials(prisma, 'ghost@nowhere.com', 'anything')
      ).rejects.toThrow('INVALID_CREDENTIALS');
    });
  });

  describe('generateTokens + verifyToken', () => {
    it('should generate valid JWT tokens', () => {
      const tokens = generateTokens({
        id: TEST_USER.id,
        email: TEST_USER.email,
        organizationId: TEST_ORG.id,
      });

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();

      const decoded = verifyToken(tokens.accessToken);
      expect(decoded.sub).toBe(TEST_USER.id);
      expect(decoded.email).toBe(TEST_USER.email);
      expect(decoded.organizationId).toBe(TEST_ORG.id);
    });
  });
});

// ─── INTEGRATION TESTS: POST /auth/login ────────────────────────────

describe('POST /auth/login', () => {
  it('should return 200 and set httpOnly cookies with valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: TEST_USER.email,
        password: TEST_USER.password,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body) as {
      user: { id: string; email: string; organizationId: string };
    };
    expect(body.user.id).toBe(TEST_USER.id);
    expect(body.user.email).toBe(TEST_USER.email);
    expect(body.user.organizationId).toBe(TEST_ORG.id);

    // Verify cookies are set
    const cookies = response.cookies;
    const accessCookie = cookies.find(
      (c: { name: string }) => c.name === 'access_token'
    );
    const refreshCookie = cookies.find(
      (c: { name: string }) => c.name === 'refresh_token'
    );

    expect(accessCookie).toBeDefined();
    expect(refreshCookie).toBeDefined();
    expect(accessCookie?.httpOnly).toBe(true);
    expect(refreshCookie?.httpOnly).toBe(true);
  });

  it('should return 401 with invalid password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: TEST_USER.email,
        password: 'WrongPassword99!',
      },
    });

    expect(response.statusCode).toBe(401);

    const body = JSON.parse(response.body) as { error: string; message: string };
    expect(body.error).toBe('INVALID_CREDENTIALS');
  });

  it('should return 401 with non-existent email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'nobody@example.com',
        password: 'SomePassword1!',
      },
    });

    expect(response.statusCode).toBe(401);

    const body = JSON.parse(response.body) as { error: string };
    expect(body.error).toBe('INVALID_CREDENTIALS');
  });

  it('should return 400 with invalid body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'not-an-email',
        password: '123',
      },
    });

    expect(response.statusCode).toBe(400);

    const body = JSON.parse(response.body) as { error: string };
    expect(body.error).toBe('VALIDATION_ERROR');
  });
});

// ─── INTEGRATION TESTS: Protected routes ────────────────────────────

describe('GET /me', () => {
  it('should return 401 without auth cookie', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/me',
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return user profile with valid auth cookie', async () => {
    // First, login to get cookies
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

    const response = await app.inject({
      method: 'GET',
      url: '/me',
      cookies: {
        access_token: accessCookie?.value ?? '',
      },
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body) as {
      id: string;
      email: string;
      organization: { id: string; name: string };
    };
    expect(body.id).toBe(TEST_USER.id);
    expect(body.email).toBe(TEST_USER.email);
    expect(body.organization.id).toBe(TEST_ORG.id);
    expect(body.organization.name).toBe(TEST_ORG.name);
  });

  it('should return 404 when user is not found', async () => {
    // Generate valid token for a user that doesn't exist
    const tokens = generateTokens({
      id: 'deleted-user-id',
      email: 'deleted@example.com',
      organizationId: TEST_ORG.id,
    });

    const response = await app.inject({
      method: 'GET',
      url: '/me',
      cookies: {
        access_token: tokens.accessToken,
      },
    });

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body) as { error: string };
    expect(body.error).toBe('USER_NOT_FOUND');
  });
});

// ─── INTEGRATION TESTS: POST /auth/logout ───────────────────────────

describe('POST /auth/logout', () => {
  it('should clear auth cookies', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout',
    });

    expect(response.statusCode).toBe(204);

    const accessCookie = response.cookies.find(
      (c: { name: string }) => c.name === 'access_token'
    );
    // Cookie should be cleared (empty or expired)
    expect(accessCookie).toBeDefined();
    expect(accessCookie?.value).toBe('');
  });
});

// ─── INTEGRATION TESTS: GET /health ─────────────────────────────────

describe('GET /health', () => {
  it('should return 200 ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body) as { status: string };
    expect(body.status).toBe('ok');
  });
});
