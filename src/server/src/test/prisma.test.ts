import { makeTestClient } from '../../../server/src/apiInterface/tests';
import { resetDatabase } from '../testSetup/database';
import { initializeDatabaseTesting } from '../utils/databaseTest';
import { prisma, resetClient } from '../utils/prisma';

initializeDatabaseTesting();

describe('prisma', () => {
  it('connects to test database', async () => {
    resetClient();
    const credentials = { username: 'admin', password: 'test' };

    const client = makeTestClient();
    expect((await client.auth.getSelf()).role).toBe('GUEST');

    await client.auth.register(credentials);

    expect((await client.auth.getSelf()).username).toBeTruthy();

    await resetDatabase();

    await client.auth.login(credentials);
  });
});
