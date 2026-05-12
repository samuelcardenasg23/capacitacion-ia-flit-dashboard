import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/services/authService.js';

const prisma = new PrismaClient();

export const TEST_ORG = {
  id: 'org-test-001',
  name: 'Flit Test Corp',
};

export const TEST_USER = {
  id: 'user-test-001',
  email: 'admin@flit-test.com',
  password: 'SecurePass123!',
  organizationId: TEST_ORG.id,
};

export const SECOND_ORG = {
  id: 'org-test-002',
  name: 'Other Corp',
};

export const SECOND_USER = {
  id: 'user-test-002',
  email: 'admin@other-corp.com',
  password: 'OtherPass456!',
  organizationId: SECOND_ORG.id,
};

async function seed() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create organizations
  await prisma.organization.create({
    data: { id: TEST_ORG.id, name: TEST_ORG.name },
  });

  await prisma.organization.create({
    data: { id: SECOND_ORG.id, name: SECOND_ORG.name },
  });

  // Create users with hashed passwords
  const hashedPassword1 = await hashPassword(TEST_USER.password);
  await prisma.user.create({
    data: {
      id: TEST_USER.id,
      email: TEST_USER.email,
      password: hashedPassword1,
      organizationId: TEST_USER.organizationId,
    },
  });

  const hashedPassword2 = await hashPassword(SECOND_USER.password);
  await prisma.user.create({
    data: {
      id: SECOND_USER.id,
      email: SECOND_USER.email,
      password: hashedPassword2,
      organizationId: SECOND_USER.organizationId,
    },
  });

  // Create transactions for TEST_ORG
  await prisma.transaction.createMany({
    data: [
      {
        amount: 5000,
        type: 'INCOME',
        category: 'Services',
        description: 'Consulting fees',
        date: new Date('2024-05-01T10:00:00Z'),
        organizationId: TEST_ORG.id,
      },
      {
        amount: 150.50,
        type: 'EXPENSE',
        category: 'Office',
        description: 'Office supplies',
        date: new Date('2024-05-02T14:30:00Z'),
        organizationId: TEST_ORG.id,
      },
      {
        amount: 2000,
        type: 'EXPENSE',
        category: 'Rent',
        description: 'Monthly office rent',
        date: new Date('2024-05-05T09:00:00Z'),
        organizationId: TEST_ORG.id,
      }
    ]
  });

  // Create transactions for SECOND_ORG
  await prisma.transaction.create({
    data: {
      amount: 10000,
      type: 'INCOME',
      category: 'Sales',
      description: 'Product sales',
      date: new Date('2024-05-01T11:00:00Z'),
      organizationId: SECOND_ORG.id,
    }
  });

  console.log('✅ Seed complete');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
