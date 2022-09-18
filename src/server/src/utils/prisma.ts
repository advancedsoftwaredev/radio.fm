import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient();

const getDatabaseName = () => `RadioFMTest`;

export async function resetClient() {
  prisma = new PrismaClient();
  await prisma.$connect();
}

export async function createTestClient() {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$executeRaw`CREATE DATABASE RadioFMTest`;
    const databaseArr = process.env.DATABASE_URL?.split('/');
    databaseArr?.pop();
    databaseArr?.push(getDatabaseName());
    process.env.DATABASE_URL = databaseArr?.join('/');
    console.log(process.env.DATABASE_URL);
    await resetClient();
  }
}

export async function deleteTestClient() {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$executeRaw`DROP DATABASE IF EXISTS RadioFMTest`;
    await prisma.$disconnect();
  }
}

export default prisma;
