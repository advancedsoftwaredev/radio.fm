import type { User } from '@prisma/client';

import type { ApiUser, UserCredentials } from '../../apiTypes/user';
import { loginUser, logoutUser } from '../../utils/authentication';
import { getLoginUser, registerUser } from '../../utils/loginRegister';
import { authenticatedRouter } from '../../utils/routers';
import { deleteGuestUser, deleteUser, deleteUserSessions, getUserByUsername } from '../../utils/user';
import { BadInputError } from '../errors';
import { mapUserToApiUser } from '../user/user';

const AuthRouter = authenticatedRouter('guest');

AuthRouter.post<UserCredentials, ApiUser>('/register', async (req, res) => {
  if (await getUserByUsername(req.body.username)) {
    throw new BadInputError('User already exists with that username');
  }
  if (!(req.body.username && req.body.password)) {
    throw new BadInputError('Missing registration information');
  }

  await deleteGuestUser(req.user);

  const user = await registerUser(req.body.username, req.body.password);

  await loginUser(res, user.id);
  return mapUserToApiUser(user);
});

AuthRouter.post<UserCredentials, ApiUser>('/login', async (req, res) => {
  if (!(req.body.username && req.body.password)) {
    throw new BadInputError('Missing login information');
  }

  const user = await getLoginUser(req.body.username, req.body.password);
  if (!user) {
    throw new BadInputError('Incorrect login information');
  }

  await deleteGuestUser(req.user);

  await loginUser(res, user.id);
  return mapUserToApiUser(user);
});

AuthRouter.get<{ msg: string }>('/logout', async (req, res) => {
  if (req.user.role === 'GUEST') {
    try {
      await deleteUser(req.user.id);
    } catch (e) {
      // Can't delete if the user already liked songs
    }
  } else {
    await deleteUserSessions(req.user.id);
  }
  await logoutUser(res);
  return { msg: 'successful registration' };
});

AuthRouter.get<ApiUser>('/get-self', async (req) => {
  const user = req.user as User;
  return mapUserToApiUser(user);
});

export default AuthRouter;
