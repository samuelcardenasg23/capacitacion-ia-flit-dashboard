import type { FastifyInstance } from 'fastify';
import { loginSchema } from '../schemas/auth.js';
import { verifyCredentials, generateTokens } from '../services/authService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;

    try {
      const user = await verifyCredentials(fastify.prisma, email, password);
      const { accessToken, refreshToken } = generateTokens(user);

      reply
        .setCookie('access_token', accessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 15 * 60, // 15 minutes
        })
        .setCookie('refresh_token', refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60, // 7 days
        })
        .status(200)
        .send({
          user: {
            id: user.id,
            email: user.email,
            organizationId: user.organizationId,
          },
        });
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        return reply.status(401).send({
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          details: null,
        });
      }

      throw error;
    }
  });

  fastify.post('/auth/logout', async (_request, reply) => {
    reply
      .clearCookie('access_token', COOKIE_OPTIONS)
      .clearCookie('refresh_token', COOKIE_OPTIONS)
      .status(204)
      .send();
  });

  fastify.get(
    '/me',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const user = await fastify.prisma.user.findUnique({
        where: { id: request.user.id },
        select: {
          id: true,
          email: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!user) {
        return reply.status(404).send({
          error: 'USER_NOT_FOUND',
          message: 'User not found',
          details: null,
        });
      }

      return reply.status(200).send(user);
    },
  );
}
