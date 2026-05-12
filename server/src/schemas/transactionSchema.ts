import { z } from 'zod';

export const createTransactionSchema = z.strictObject({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Type must be INCOME or EXPENSE',
  }),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  date: z.coerce.date().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
