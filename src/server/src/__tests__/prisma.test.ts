import { makeTestClient } from '../apiInterface/tests';
import { resetDatabase } from '../testSetup/database';
import { initializeDatabaseTesting } from '../utils/databaseTest';

initializeDatabaseTesting();

describe('prisma', () => {
  // Change this test later to interact with song count or user count once implemented
  it('connects to test database', async () => {
    const credentials = { username: 'user', password: 'password' };

    const client = makeTestClient();
    expect((await client.auth.getSelf()).role).toBe('GUEST');

    await client.auth.register(credentials);

    expect((await client.auth.getSelf()).role).toBe('USER');

    await resetDatabase();

    // Cookie of logged in user is still attached to client, test it doesn't work
    expect((await client.auth.getSelf()).role).toBe('GUEST');
  });
});
