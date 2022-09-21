import { PrismaClient } from '@prisma/client';
import { exec as callbackExec } from 'child_process';
import util from 'util';

const exec = util.promisify(callbackExec);

async function setupPrisma() {
  if (process.env.NODE_ENV === 'test') {
    await exec('yarn prisma migrate reset -f', {
      env: { ...process.env },
    });
  }
}

let prisma = new PrismaClient();

const originalDatabaseUrl = process.env.DATABASE_URL;
const getDatabaseName = () => 'radiofmtest' + process.env.JEST_WORKER_ID;

export async function resetClient() {
  prisma = new PrismaClient();
  await prisma.$connect();
}

export async function createTestClient() {
  if (process.env.NODE_ENV === 'test') {
    await deleteTestClient();
    await prisma.$executeRawUnsafe(`CREATE DATABASE ${getDatabaseName()}`);

    const databaseArr = process.env.DATABASE_URL?.split('/');
    databaseArr?.pop();
    databaseArr?.push(getDatabaseName());

    await prisma.$disconnect();
    process.env.DATABASE_URL = databaseArr?.join('/');
    await setupPrisma();
    await resetClient();
  }
}

export async function deleteTestClient() {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$disconnect();
    process.env.DATABASE_URL = originalDatabaseUrl;
    await resetClient();
    await dropTestDatabase();
  }
}

async function dropTestDatabase() {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${getDatabaseName()}`);
  }
}

export async function resetDatabase() {
  if (process.env.NODE_ENV === 'test') {
    await deleteTestClient();
    await createTestClient();
  }
}

export default prisma;
