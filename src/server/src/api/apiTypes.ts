import { Send } from 'express-serve-static-core';
import { Response, Request } from 'express';
import { RequestWithUser } from 'src/utils/authentication';
import { User } from '@prisma/client';

export interface TypedRequestBody<T> extends RequestWithUser {
  body: T;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
