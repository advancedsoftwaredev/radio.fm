import {} from 'nanoid';

import { seedUsers } from './seedData/user';
import { insertSongs } from './testSetup/data/songs';
import { registerUser } from './utils/loginRegister';
import { audioStorage, imageStorage } from './utils/storage_interface';

async function seed() {
  await audioStorage._dangerous_delete_all_files();
  await imageStorage._dangerous_delete_all_files();

  await insertSongs();
  seedUsers.forEach(async (user) => await registerUser(user.username, user.password, user.role));
}

void seed();
