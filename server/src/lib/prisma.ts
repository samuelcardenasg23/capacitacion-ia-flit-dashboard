import { PrismaClient } from '@prisma/client';

export const globalPrisma = new PrismaClient();

export function getTenantPrisma(orgId: string) {
  return globalPrisma.$extends({
    query: {
      transaction: {
        async findMany({ args, query }) {
          args.where = { ...args.where, organizationId: orgId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, organizationId: orgId };
          return query(args);
        },
        async aggregate({ args, query }) {
          args.where = { ...args.where, organizationId: orgId };
          return query(args);
        }
      }
    }
  });
}

export type TenantPrismaClient = ReturnType<typeof getTenantPrisma>;
