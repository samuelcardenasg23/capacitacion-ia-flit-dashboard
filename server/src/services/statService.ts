import { TransactionRepository } from '../repositories/transactionRepository.js';

export class StatService {
  private transactionRepository: TransactionRepository;

  constructor(orgId: string) {
    this.transactionRepository = new TransactionRepository(orgId);
  }

  async getTotalRevenue(): Promise<number> {
    return this.transactionRepository.getTotalRevenue();
  }
}
