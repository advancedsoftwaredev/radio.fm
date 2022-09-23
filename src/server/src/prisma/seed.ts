import songs from '../../src/modelData/song';
import users from '../../src/modelData/user';
import { registerUser } from '../../src/utils/loginRegister';
import { prisma } from '../../src/utils/prisma';

async function seed() {
  songs.forEach(async (song) => await prisma.song.create({ data: song }));
  users.forEach(async (user) => await registerUser(user.username, user.password, user.role));
}

void seed();
