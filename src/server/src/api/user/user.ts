import type { User } from '.prisma/client';
import express from 'express';

import type { ApiUser } from '../../apiTypes/user';
import { authUserMiddleware } from '../../utils/authentication';

const UserRouter = express.Router();

UserRouter.use(authUserMiddleware);

UserRouter.get('/delete-account', async () => {});
UserRouter.post('/change-password', async () => {});
UserRouter.post('/change-username', async () => {});
UserRouter.get('/liked-songs', async () => {});

export const mapUserToApiUser = (user: User): ApiUser => {
  return {
    id: user.id,
    username: user.username as string,
    role: user.role,
  };
};

export default UserRouter;
