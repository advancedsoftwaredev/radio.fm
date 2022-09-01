import { User } from '.prisma/client';
import express, { NextFunction } from 'express';
import { authUserMiddleware, RequestWithUser } from '../../utils/authentication';
import { ApiUser } from '../../../../web/apiTypes/user';
import { TypedResponse } from '../apiTypes';

const UserRouter = express.Router();

UserRouter.use(authUserMiddleware);

UserRouter.get('/get-self', async (req: RequestWithUser, res: TypedResponse<ApiUser>, next: NextFunction) => {
  const user = req.user as User;
  res.status(200).json(mapUserToApiUser(user));
});

export const mapUserToApiUser = (user: User): ApiUser => {
  return {
    id: user.id,
    username: user.username as string,
    role: user.role,
  };
};

export default UserRouter;
