import { exec as callbackExec } from 'child_process';
import util from 'util';

import { prisma, resetClient } from '../utils/prisma';

const exec = util.promisify(callbackExec);

async function setupPrisma() {
  if (process.env.NODE_ENV === 'test') {
    await exec('yarn prisma migrate reset -f', {
      env: { ...process.env },
    });
  }
}

const originalDatabaseUrl = process.env.DATABASE_URL;
const getDatabaseName = () => 'radiofmtest' + process.env.JEST_WORKER_ID;

export async function createTestClient() {
  if (process.env.NODE_ENV === 'test') {
    await deleteTestClient();
    await dropTestDatabase();
    await prisma.$executeRawUnsafe(`CREATE DATABASE ${getDatabaseName()}`);

    const databaseArr = process.env.DATABASE_URL?.split('/');
    databaseArr?.pop();
    databaseArr?.push(getDatabaseName());

    await prisma.$disconnect();
    process.env.DATABASE_URL = databaseArr?.join('/');
    await setupPrisma();
    resetClient();
  }
}

export async function deleteTestClient() {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$disconnect();
    process.env.DATABASE_URL = originalDatabaseUrl;
    resetClient();
    await dropTestDatabase();
  }
}

async function dropTestDatabase() {
  if (process.env.NODE_ENV === 'test') {
    const data = await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTs ${getDatabaseName()}`);
  }
}

export async function resetDatabase() {
  if (process.env.NODE_ENV === 'test') {
    await deleteTestClient();
    await createTestClient();
  }
}
