import type { Response } from 'express';
import type { Send } from 'express-serve-static-core';
import type { RequestWithUser } from 'src/utils/authentication';

export interface TypedRequestBody<T> extends RequestWithUser {
  body: T;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
