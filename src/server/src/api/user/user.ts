import type { User } from '.prisma/client';

import type { ApiSongInfo } from '../../apiTypes/song';
import type { ApiUser } from '../../apiTypes/user';
import { setUserPassword } from '../../utils/loginRegister';
import { prisma } from '../../utils/prisma';
import { authenticatedRouter } from '../../utils/routers';
import { getUserByUsername } from '../../utils/user';
import { BadInputError } from '../errors';
import { mapSongToApiSong } from '../song/song';

const UserRouter = authenticatedRouter('user');

UserRouter.get('/delete-account', async (req, res) => {
  await prisma.$transaction([
    prisma.likedSong.deleteMany({ where: { userId: req.user.id } }),
    prisma.songManagementLog.deleteMany({ where: { userId: req.user.id } }),
    prisma.session.deleteMany({ where: { userId: req.user.id } }),
    prisma.user.delete({ where: { id: req.user.id } }),
  ]);
});

UserRouter.post<{ password: string }, {}>('/change-password', async (req, res) => {
  await setUserPassword(req.user.id, req.body.password);
  return {};
});

UserRouter.post<{ username: string }, {}>('/change-username', async (req, res) => {
  const user = await getUserByUsername(req.body.username);
  if (user) {
    throw new BadInputError('Username already taken');
  }
  await prisma.user.update({ where: { id: req.user.id }, data: { username: req.body.username } });
  return {};
});

UserRouter.get<ApiSongInfo[]>('/liked-songs', async (req, res) => {
  const likedSongs = await prisma.likedSong.findMany({ where: { userId: req.user.id }, include: { song: true } });
  return likedSongs.map((likedSong) => mapSongToApiSong(likedSong.song));
});

export const mapUserToApiUser = (user: User): ApiUser => {
  return {
    id: user.id,
    username: user.username as string,
    role: user.role,
  };
};

export default UserRouter;
