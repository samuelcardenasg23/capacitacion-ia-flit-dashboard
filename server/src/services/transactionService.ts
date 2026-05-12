import type { Transaction } from '@prisma/client';
import { TransactionRepository } from '../repositories/transactionRepository.js';
import type { CreateTransactionInput } from '../schemas/transactionSchema.js';

export class TransactionService {
  private repository: TransactionRepository;

  constructor(orgId: string) {
    this.repository = new TransactionRepository(orgId);
  }

  async createTransaction(data: CreateTransactionInput): Promise<Transaction> {
    return this.repository.create(data);
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.repository.findAll();
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.repository.findById(id);
  }
}
