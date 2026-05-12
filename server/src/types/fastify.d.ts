import type { FastifyRequest, FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      organizationId: string;
    };
  }
}
