import type { User } from '.prisma/client';
import express from 'express';

import type { ApiUser } from '../../../../web/apiTypes/user';
import { authUserMiddleware } from '../../utils/authentication';

const UserRouter = express.Router();

UserRouter.use(authUserMiddleware);

export const mapUserToApiUser = (user: User): ApiUser => {
  return {
    id: user.id,
    username: user.username as string,
    role: user.role,
  };
};

export default UserRouter;
