import type { Response } from 'express';
import type { Send } from 'express-serve-static-core';

import type { RequestWithUser } from '../utils/authentication';

export type TypedRequestBody<T> = RequestWithUser & {
  body: T;
};

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
