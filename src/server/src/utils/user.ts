import { User } from '.prisma/client';
import prisma from './prisma';

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return null;
  }
  return user;
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return null;
  }
  return user;
}

export async function deleteGuestUser(user: User | undefined) {
  if (user?.role !== 'GUEST') {
    return null;
  }

  const deleteGuestSessions = deleteUserSessions(user?.id);
  const deleteGuest = deleteUser(user?.id);

  return await prisma.$transaction([deleteGuestSessions, deleteGuest]);
}

export const deleteUser = (userId: string) => prisma.user.delete({ where: { id: userId } });
export const deleteUserSessions = (userId: string) => prisma.session.deleteMany({ where: { userId: userId } });
