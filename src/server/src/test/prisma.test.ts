import { makeTestClient } from '../../../server/src/apiInterface/tests';
import { initializeDatabaseTesting } from '../utils/databaseTest';
import { resetDatabase } from '../utils/prisma';

initializeDatabaseTesting();

describe('prisma', () => {
  it('connects to test database', async () => {
    const credentials = { username: 'admin', password: 'test' };

    const client = makeTestClient();
    expect((await client.auth.getSelf()).username).toBeFalsy();

    await client.auth.register(credentials);
    await client.auth.login(credentials);

    expect((await client.auth.getSelf()).username).toBeTruthy();

    await resetDatabase();

    await client.auth.login(credentials);
    expect((await client.auth.getSelf()).username).toBeFalsy();
  });
});
