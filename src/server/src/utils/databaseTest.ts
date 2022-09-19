import { createTestClient, deleteTestClient } from './prisma';

export function initializeDatabaseTesting() {
  jest.setTimeout(30000);

  describe('test', () => {
    beforeAll(async () => {
      await createTestClient();
    });

    afterAll(async () => {
      await deleteTestClient();
    });
  });
}
