import { createTestClient, deleteTestClient } from '../testSetup/database';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('This file should only be used in test environment');
}

export function initializeDatabaseTesting() {
  jest.setTimeout(30000);

  beforeAll(async () => {
    await createTestClient();
  });

  afterAll(async () => {
    await deleteTestClient();
  });
}
