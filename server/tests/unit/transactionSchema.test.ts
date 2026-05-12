import { describe, it, expect } from 'vitest';
import { createTransactionSchema } from '../../src/schemas/transactionSchema.js';

describe('createTransactionSchema', () => {
  it('should validate a correct INCOME transaction', () => {
    const validData = {
      amount: 1500,
      type: 'INCOME',
      category: 'Sales',
      description: 'Monthly sale',
      date: '2024-05-12T00:00:00Z',
    };
    const result = createTransactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate a correct EXPENSE transaction', () => {
    const validData = {
      amount: 50.5,
      type: 'EXPENSE',
      category: 'Office',
      date: new Date(),
    };
    const result = createTransactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject a negative amount', () => {
    const invalidData = {
      amount: -100,
      type: 'INCOME',
      category: 'Sales',
    };
    const result = createTransactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Amount must be positive');
    }
  });

  it('should reject invalid type', () => {
    const invalidData = {
      amount: 100,
      type: 'INVALID',
      category: 'Sales',
    };
    const result = createTransactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Type must be INCOME or EXPENSE');
    }
  });

  it('should reject missing category', () => {
    const invalidData = {
      amount: 100,
      type: 'INCOME',
      category: '',
    };
    const result = createTransactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Category is required');
    }
  });
});
