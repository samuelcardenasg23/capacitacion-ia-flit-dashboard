import { getTenantPrisma, TenantPrismaClient } from '../lib/prisma.js';
import type { Transaction } from '@prisma/client';
import type { CreateTransactionInput } from '../schemas/transactionSchema.js';

export class TransactionRepository {
  private prisma: TenantPrismaClient;
  private orgId: string;

  constructor(orgId: string) {
    this.orgId = orgId;
    this.prisma = getTenantPrisma(orgId);
  }

  async findById(id: string): Promise<Transaction | null> {
    // Usamos findFirst en lugar de findUnique porque la extensión RLS
    // inyecta el organizationId y findUnique es estricto sobre claves únicas puras.
    return this.prisma.transaction.findFirst({
      where: { id }
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });
  }

  async create(data: CreateTransactionInput): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        ...data,
        organizationId: this.orgId,
      }
    });
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true
      },
      where: {
        type: 'INCOME'
      }
    });
    
    // El resultado de Prisma puede ser null si no hay filas.
    // También _sum.amount es un Prisma.Decimal.
    return result._sum.amount ? Number(result._sum.amount) : 0;
  }
}
