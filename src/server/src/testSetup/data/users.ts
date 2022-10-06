import { makeTestClient } from '../../apiInterface/tests';
import { prisma } from '../../utils/prisma';

const defaultAdminUsername = 'default_test_admin';
const defaultUserUsername = 'default_test_admin';
const defaultPassword = 'password';

export async function getLoggedInTestClient(username: string, password: string) {
  const client = makeTestClient();
  await client.auth.login({ username, password });
  return client;
}

export async function registerOrLogInTestClient(username: string) {
  const client = makeTestClient();
  try {
    await client.auth.login({ username, password: defaultPassword });
  } catch (e: any) {
    await client.auth.register({ username, password: defaultPassword });
  }
  return client;
}

export async function getTestUserClient() {
  return registerOrLogInTestClient(defaultUserUsername);
}

export async function getTestAdminClient() {
  const client = await registerOrLogInTestClient(defaultAdminUsername);
  await prisma.user.update({ where: { username: defaultAdminUsername }, data: { role: 'ADMIN' } });
  return client;
}
