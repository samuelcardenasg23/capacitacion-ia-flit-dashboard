import type { FastifyInstance } from 'fastify';
import { createTransactionSchema } from '../schemas/transactionSchema.js';
import { TransactionService } from '../services/transactionService.js';

export default async function transactionRoutes(fastify: FastifyInstance): Promise<void> {
  // All transaction routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.post('/transactions', async (request, reply) => {
    const parsed = createTransactionSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.flatten(),
      });
    }

    try {
      const transactionService = new TransactionService(request.user.organizationId);
      const transaction = await transactionService.createTransaction(parsed.data);

      return reply.status(201).send(transaction);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Could not create transaction',
        details: null,
      });
    }
  });

  fastify.get('/transactions', async (request, reply) => {
    try {
      const transactionService = new TransactionService(request.user.organizationId);
      const transactions = await transactionService.getTransactions();

      return reply.status(200).send(transactions);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Could not fetch transactions',
        details: null,
      });
    }
  });
}
