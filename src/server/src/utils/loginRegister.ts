import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

import prisma from './prisma';

export async function getLoginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return null;
  }

  // Can't log in a user that doesn't have a password
  if (!user.passwordSalt || !user.passwordHash) {
    return null;
  }

  const hash = await bcrypt.hash(password, user.passwordSalt);
  if (hash !== user.passwordHash) {
    return null;
  }

  return user;
}

export async function registerUser(username: string, password: string, role: Role = Role.USER) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return prisma.user.create({
    data: {
      username,
      passwordSalt: salt,
      passwordHash: hash,
      role,
    },
  });
}

export async function setUserPassword(userId: string, password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordSalt: salt,
      passwordHash: hash,
    },
  });
}
