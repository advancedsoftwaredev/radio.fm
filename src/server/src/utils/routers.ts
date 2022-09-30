import bodyParser from 'body-parser';
import busboy from 'busboy';
import type { RequestHandler, Response, Router } from 'express';
import express from 'express';
import type { Stream } from 'stream';

import type { TypedRequestBody } from '../api/apiTypes';
import type { RequestWithUser } from './authentication';
import { authAdminMiddleware, authMiddleware, authUserMiddleware } from './authentication';

interface AuthenticatedRouter {
  router: Router;
  post: <ReqBody, ResBody>(
    path: string,
    handler: (req: TypedRequestBody<ReqBody>, res: Response) => Promise<ResBody>
  ) => void;
  upload: <ReqBody, ResBody>(
    path: string,
    handler: (req: TypedRequestBody<ReqBody>, file: Stream, res: Response) => Promise<ResBody>
  ) => void;
  get: <ResBody>(path: string, handler: (req: RequestWithUser, res: Response) => Promise<ResBody>) => void;
}

export function authenticatedRouter(role: 'guest' | 'user' | 'admin'): AuthenticatedRouter & RequestHandler {
  const middelware = role === 'guest' ? authMiddleware : role === 'user' ? authUserMiddleware : authAdminMiddleware;
  const router = express.Router();
  router.use(middelware);

  const overrides: AuthenticatedRouter = {
    router,
    post: (path, handler) => {
      router.post(path, bodyParser.json(), async (req, res, next) => {
        try {
          const body = await handler(req as any, res);
          return res.status(200).json(body);
        } catch (e) {
          return next(e);
        }
      });
    },
    get: (path, handler) => {
      router.get(path, bodyParser.json(), async (req, res, next) => {
        try {
          const body = await handler(req as any, res);
          return res.status(200).json(body);
        } catch (e) {
          return next(e);
        }
      });
    },
    upload: (path, handler) => {
      router.post(path, async (req, res, next) => {
        const bb = busboy({
          headers: req.headers,
          limits: {
            fileSize: 10000000, // 10mb
          },
        });

        let body: any = null;
        let file: Stream | null = null as any;

        // Wait for the body to come, as well as the file stream.
        // Don't parse the file stream, instead just forward it to the handler.
        await new Promise<void>((resolve, reject) => {
          bb.on('field', (name, val, info) => {
            if (name !== 'body') {
              return reject(new Error('Invalid field'));
            }
            if (body) {
              return;
            }
            body = JSON.parse(val);
          });
          bb.on('file', (fieldname, stream, info) => {
            // Can only recieve file after body is recieved
            if (fieldname !== 'file' || !body) {
              return reject(new Error('Invalid field'));
            }
            if (file) {
              return;
            }
            file = stream;
            resolve();
          });
          bb.on('error', reject);

          req.pipe(bb);
        });

        if (!body || !file) {
          return res.status(400).send('Invalid request');
        }

        req.body = body;

        try {
          const body = await handler(req as any, file, res);
          return res.status(200).json(body);
        } catch (e) {
          return next(e);
        }
      });
    },
  };

  const call = (...args: any) => (router as any)(...args);

  return Object.setPrototypeOf(call, overrides);
}
