import { CookieAccessInfo, CookieJar } from 'cookiejar';
import type { NextApiHandler } from 'next';
import request from 'supertest';

import { httpServer } from '../app';
import { createEndpoints } from './endpoints';

type BodyMethod = 'POST';
type NoBodyMethod = 'GET';

export type TestClient = ReturnType<typeof makeTestClient>;

export function makeTestClient() {
  const getResolver = (path: string) => {
    return require('../pages/api' + path).default;
  };

  const resolvers: Record<string, NextApiHandler> = {};

  const agent = request.agent(httpServer);

  const jar = new CookieJar();
  const jarAccess = new CookieAccessInfo('*', '/', true);

  function parseBody<Resp>(body: any) {
    if (typeof body === 'string') {
      try {
        return JSON.parse(body) as Resp;
      } catch (e) {
        return body as any as Resp;
      }
    } else {
      return body as Resp;
    }
  }

  const makeRequest = <Resp>(method: NoBodyMethod, path: string) => {
    resolvers[path] = getResolver(path);

    return async () => {
      const response = await agent.get(path).set('cookie', jar.getCookies(jarAccess).toValueString());

      if (response.headers['set-cookie']) {
        jar.setCookies(response.headers['set-cookie']);
      }

      if (response.status !== 200) {
        console.error(response);
        throw response;
      }

      return parseBody<Resp>(response.body);
    };
  };

  const makeBodyRequest = <Req, Resp>(method: BodyMethod, path: string) => {
    resolvers[path] = getResolver(path);

    return async (body: Req) => {
      const response = await agent
        .post(path)
        .set('cookie', jar.getCookies(jarAccess).toValueString())
        .send(body as any);

      if (response.headers['set-cookie']) {
        jar.setCookies(response.headers['set-cookie']);
      }

      if (response.status !== 200) {
        console.error(response);
        throw response;
      }

      return parseBody<Resp>(response.body);
    };
  };

  return createEndpoints(makeRequest, makeBodyRequest);
}
