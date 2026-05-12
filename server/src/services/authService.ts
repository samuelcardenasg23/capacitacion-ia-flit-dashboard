import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { PrismaClient, User } from '@prisma/client';
import { findByEmail } from '../repositories/userRepository.js';

const JWT_SECRET = process.env['JWT_SECRET'] as string;
const REFRESH_TOKEN_SECRET = process.env['REFRESH_TOKEN_SECRET'] as string;

export interface TokenPayload {
  sub: string;
  email: string;
  organizationId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function verifyCredentials(
  prisma: PrismaClient,
  email: string,
  password: string,
): Promise<User> {
  const user = await findByEmail(prisma, email);

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isValid = await argon2.verify(user.password, password);

  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return user;
}

export function generateTokens(user: Pick<User, 'id' | 'email' | 'organizationId'>): AuthTokens {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    organizationId: user.organizationId,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ sub: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
