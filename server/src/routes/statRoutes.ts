import type { FastifyPluginAsync } from 'fastify';
import { StatService } from '../services/statService.js';

const statRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/stats/total-revenue', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    const orgId = request.user.organizationId;
    const statService = new StatService(orgId);
    
    const total = await statService.getTotalRevenue();
    return reply.status(200).send({ total });
  });
};

export default statRoutes;
