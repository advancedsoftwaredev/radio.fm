import { initializeDatabaseTesting } from '../utils/databaseTest';

initializeDatabaseTesting();

test('creates test database through prisma', () => {
  console.log('Hello');
});
