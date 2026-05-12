import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../services/authService.js';

async function authPlugin(fastify: FastifyInstance): Promise<void> {
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies['access_token'];

    if (!token) {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
        details: null,
      });
    }

    try {
      const payload = verifyToken(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        organizationId: payload.organizationId,
      };
    } catch {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
        details: null,
      });
    }
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(authPlugin, {
  name: 'auth',
  dependencies: ['prisma'],
});
