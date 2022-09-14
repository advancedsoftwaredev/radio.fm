import type { User } from '@prisma/client';
import type { NextFunction, Response } from 'express';
import express from 'express';

import type { ApiUser, UserCredentials } from '../../../../web/apiTypes/user';
import type { RequestWithUser } from '../../utils/authentication';
import { authMiddleware, loginUser, logoutUser } from '../../utils/authentication';
import { getLoginUser, registerUser } from '../../utils/loginRegister';
import { deleteGuestUser, deleteUser, deleteUserSessions, getUserByUsername } from '../../utils/user';
import type { TypedRequestBody, TypedResponse } from '../apiTypes';
import { AuthorizationError, BadInputError, NotFoundError } from '../errors';
import { mapUserToApiUser } from '../user/user';

const AuthRouter = express.Router();

AuthRouter.use(authMiddleware);

AuthRouter.post(
  '/register',
  async (req: TypedRequestBody<UserCredentials>, res: TypedResponse<ApiUser>, next: NextFunction) => {
    if (await getUserByUsername(req.body.username)) {
      return next(new BadInputError('User already exists with that username'));
    }
    if (!(req.body.username && req.body.password)) {
      return next(new BadInputError('Missing registration information'));
    }

    await deleteGuestUser(req.user);

    const user = await registerUser(req.body.username, req.body.password);

    await loginUser(res, user.id);
    res.status(200).json(mapUserToApiUser(user));
  }
);

AuthRouter.post(
  '/login',
  async (req: TypedRequestBody<UserCredentials>, res: TypedResponse<ApiUser>, next: NextFunction) => {
    if (!(req.body.username && req.body.password)) {
      return next(new BadInputError('Missing login information'));
    }

    const user = await getLoginUser(req.body.username, req.body.password);
    if (!user) {
      return next(new BadInputError('Incorrect login information'));
    }

    await deleteGuestUser(req.user);

    await loginUser(res, user.id);
    res.status(200).json(mapUserToApiUser(user));
  }
);

AuthRouter.get('/logout', async (req: TypedRequestBody<{}>, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    return next(new AuthorizationError('No active sessions'));
  }
  if (req.user.role === 'GUEST') {
    try {
      const deletedGuest = await deleteUser(req.user.id);
    } catch (e) {
      return next(new NotFoundError('Could not delete guest user'));
    }
  } else {
    await deleteUserSessions(req.user.id);
  }
  await logoutUser(res);
  res.status(200).json({ msg: 'successful registration' });
});

AuthRouter.get('/get-self', async (req: RequestWithUser, res: TypedResponse<ApiUser>, next: NextFunction) => {
  const user = req.user as User;
  res.status(200).json(mapUserToApiUser(user));
});

export default AuthRouter;
