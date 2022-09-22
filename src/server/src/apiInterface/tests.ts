import { fullPath } from '.';
import { CookieAccessInfo, CookieJar } from 'cookiejar';
import request from 'supertest';

import { httpServer } from '../app';
import { createEndpoints } from './endpoints';

type BodyMethod = 'POST';
type NoBodyMethod = 'GET';

export type TestClient = ReturnType<typeof makeTestClient>;

export function makeTestClient() {
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
    return async () => {
      const response = await agent.get(fullPath(path)).set('cookie', jar.getCookies(jarAccess).toValueString());

      if (response.headers['set-cookie']) {
        jar.setCookies(response.headers['set-cookie']);
      }

      if (response.status !== 200) {
        console.error(response.status, response.body);
        throw response;
      }

      return parseBody<Resp>(response.body);
    };
  };

  const makeBodyRequest = <Req, Resp>(method: BodyMethod, path: string) => {
    return async (body: Req) => {
      const response = await agent
        .post(fullPath(path))
        .set('cookie', jar.getCookies(jarAccess).toValueString())
        .send(body as any);

      if (response.headers['set-cookie']) {
        jar.setCookies(response.headers['set-cookie']);
      }

      if (response.status !== 200) {
        console.error(response.status, response.body);
        throw response;
      }

      return parseBody<Resp>(response.body);
    };
  };

  return createEndpoints(makeRequest, makeBodyRequest);
}

export const testClient = makeTestClient();
