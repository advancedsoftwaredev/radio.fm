import type { Session, UnwrapPromise, User } from '@prisma/client';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { prisma } from './prisma';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is not defined');
}
const jwt_secret = process.env.JWT_SECRET ?? '_dev_secret';

const sessionAge = 1000 * 60 * 60 * 24 * 90; // 90 days

export type RequestWithUser = Request & {
  user: User;
};

/*
  Functions for token management
*/

interface TokenData {
  /** Session ID */
  sid: string;
}

async function encodeToken(sessionId: string): Promise<string> {
  const data: TokenData = { sid: sessionId };
  return jwt.sign(data, jwt_secret);
}

export async function decodeToken(token: string): Promise<string> {
  return (jwt.verify(token, jwt_secret) as TokenData).sid;
}

/*
  Basic functions for request/response token interaction
*/

async function getReqSessionId(req: Request): Promise<string | null> {
  const token = req.cookies.token;
  if (token) {
    return decodeToken(token);
  }
  return null;
}

async function setResSessionId(res: Response, sessionId: string): Promise<void> {
  const token = await encodeToken(sessionId);
  res.cookie('token', token, {
    expires: new Date(Date.now() + sessionAge),
    httpOnly: true,
  });
}

async function clearResSessionId(res: Response): Promise<void> {
  res.clearCookie('token');
}

/*
  Functions for session database interaction
*/

type SessionWithUser = NonNullable<UnwrapPromise<ReturnType<typeof getSessionWithUserBySessionId>>>;
export async function getSessionWithUserBySessionId(sessionId: string) {
  const session = await prisma.session.findFirst({ where: { id: sessionId }, include: { user: true } });
  if (session && session.invalidatedAt > new Date()) {
    return session;
  }
}

async function createSessionForUser(userId: string): Promise<Session> {
  return await prisma.session.create({
    data: {
      invalidatedAt: new Date(Date.now() + sessionAge),
      userId,
    },
  });
}

async function createGuestUser(): Promise<User> {
  return await prisma.user.create({
    data: {
      role: 'GUEST',
    },
  });
}

async function createGuestSessionWithUser(): Promise<SessionWithUser> {
  const guestUser = await createGuestUser();
  const session = await createSessionForUser(guestUser.id);
  return {
    ...session,
    user: guestUser,
  };
}

/*
  Functions for authentication
*/

export async function loginUser(res: Response, userId: string) {
  const session = await createSessionForUser(userId);
  await setResSessionId(res, session.id);
}

export async function logoutUser(res: Response) {
  await clearResSessionId(res);
}

async function getSessionUser(req: Request): Promise<User | null> {
  const sessionId = await getReqSessionId(req);
  if (sessionId) {
    const session = await getSessionWithUserBySessionId(sessionId);
    if (session) {
      return session.user;
    }
  }
  return null;
}

async function getOrCreateGuestSession(req: Request, res: Response): Promise<User> {
  const user = await getSessionUser(req);
  if (user) {
    return user;
  }
  const session = await createGuestSessionWithUser();
  await setResSessionId(res, session.id);
  return session.user;
}

export async function authMiddleware(req: Request, res: Response, next: Function) {
  const user = await getOrCreateGuestSession(req, res);
  (req as RequestWithUser).user = user;
  next();
}

export async function authUserMiddleware(req: Request, res: Response, next: Function) {
  const user = await getSessionUser(req);
  if (user && user.role !== 'GUEST') {
    (req as RequestWithUser).user = user;
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

export async function authAdminMiddleware(req: Request, res: Response, next: Function) {
  const user = await getSessionUser(req);
  if (user?.role === 'ADMIN') {
    (req as RequestWithUser).user = user;
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}
