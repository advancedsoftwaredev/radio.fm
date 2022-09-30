import type { Role } from '@prisma/client';

export interface UserSeed {
  username: string;
  password: string;
  role: Role;
}

export const seedUsers: UserSeed[] = [
  {
    username: 'John Fortnite',
    password: 'password',
    role: 'ADMIN',
  },
  {
    username: 'Rain Holloway',
    password: 'password',
    role: 'USER',
  },
  {
    username: 'Hugh Jass',
    password: 'password',
    role: 'USER',
  },
];
