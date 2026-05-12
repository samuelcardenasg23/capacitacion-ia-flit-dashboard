import type { PrismaClient, User } from '@prisma/client';

export async function findByEmail(prisma: PrismaClient, email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(prisma: PrismaClient, id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
