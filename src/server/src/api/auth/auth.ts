import express, { NextFunction, Request, Response } from 'express';
import { TypedRequestBody, TypedResponse } from '../apiTypes';
import { ApiUser, UserCredentials } from '../../../../web/apiTypes/user';
import { AuthorizationError, BadInputError, NotFoundError } from '../errors';
import { deleteGuestUser, deleteUser, deleteUserSessions, getUserByUsername } from '../../utils/user';
import { getLoginUser, registerUser } from '../../utils/loginRegister';
import { loginUser, logoutUser } from '../../utils/authentication';
import { mapUserToApiUser } from '../user/user';

const AuthRouter = express.Router();

AuthRouter.post(
  '/register',
  async (req: TypedRequestBody<UserCredentials>, res: TypedResponse<ApiUser>, next: NextFunction) => {
    if (await getUserByUsername(req.body?.username)) {
      return next(new BadInputError('User already exists with that username'));
    }
    if (!(req.body.username && req.body.password)) {
      return next(new BadInputError('Missing registration information'));
    }
    const user = await registerUser(req.body.username, req.body.password);
    if (!user) {
      return next(new BadInputError('Unable to generate user with provided credentials'));
    }
    if (!(await deleteGuestUser(req.user))) {
      return next(new NotFoundError('Could not delete guest user'));
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

    if (!(await deleteGuestUser(req.user))) {
      return next(new NotFoundError('Could not delete guest user'));
    }

    await loginUser(res, user.id);
    res.status(200).json(mapUserToApiUser(user));
  }
);

AuthRouter.post('/logout', async (req: TypedRequestBody<{}>, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    return next(new AuthorizationError('No active sessions'));
  }
  if (req.user.role === 'GUEST') {
    const deletedGuest = await deleteUser(req.user.id);
    if (!deletedGuest) {
      return next(new NotFoundError('Could not delete guest user'));
    }
  } else {
    if (!(await deleteUserSessions(req.user.id))) {
      return next(new NotFoundError('Could not delete user sessions'));
    }
  }
  await logoutUser(res);
  res.status(200).send();
});

export default AuthRouter;
