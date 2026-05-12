import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import prismaPlugin from './plugins/prisma.js';
import authPlugin from './plugins/auth.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactionRoutes.js';
import statRoutes from './routes/statRoutes.js';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env['NODE_ENV'] === 'test' ? 'silent' : 'info',
    },
  });

  // Plugins
  app.register(cookie, {
    secret: process.env['COOKIE_SECRET'] ?? 'dev-cookie-secret',
  });
  app.register(prismaPlugin);
  app.register(authPlugin);

  // Routes
  app.register(authRoutes);
  app.register(transactionRoutes);
  app.register(statRoutes);

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
