import { PrismaClient } from '@prisma/client';

export let prisma = new PrismaClient();

export function resetClient() {
  prisma = new PrismaClient();
}
