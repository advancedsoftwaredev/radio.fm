import express, { NextFunction, Response } from 'express';
import { TypedRequestBody, TypedResponse } from '../apiTypes';
import { ApiUser, UserCredentials } from '../../apiTypes/user';
import { AuthorizationError, BadInputError, NotFoundError } from '../errors';
import { deleteGuestUser, deleteUser, deleteUserSessions, getUserByUsername } from '../../utils/user';
import { getLoginUser, registerUser } from '../../utils/loginRegister';
import { authMiddleware, loginUser, logoutUser, RequestWithUser } from '../../utils/authentication';
import { mapUserToApiUser } from '../user/user';
import { User } from '@prisma/client';

const AuthRouter = express.Router();

AuthRouter.use(authMiddleware);

AuthRouter.post(
  '/register',
  async (req: TypedRequestBody<UserCredentials>, res: TypedResponse<ApiUser>, next: NextFunction) => {
    if (await getUserByUsername(req.body?.username)) {
      return next(new BadInputError('User already exists with that username'));
    }
    if (!(req.body.username && req.body.password)) {
      return next(new BadInputError('Missing registration information'));
    }

    await deleteGuestUser(req.user);

    const user = await registerUser(req.body.username, req.body.password);
    if (!user) {
      return next(new BadInputError('Unable to generate user with provided credentials'));
    }

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
    const deletedGuest = await deleteUser(req.user.id);
    if (!deletedGuest) {
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
