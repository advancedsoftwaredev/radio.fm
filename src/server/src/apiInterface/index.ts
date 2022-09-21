import { createEndpoints } from './endpoints';

type BodyMethod = 'POST';
type NoBodyMethod = 'GET';

export function fullPath(path: string) {
  return '/api' + path;
}

function makeRequest<Resp>(method: NoBodyMethod, path: string) {
  return async () => {
    const response = await fetch(fullPath(path), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      console.error(response);
      throw response;
    }

    const responseBody = await response.json();
    return responseBody as Resp;
  };
}

function makeBodyRequest<Req, Resp>(method: BodyMethod, path: string) {
  return async (body: Req) => {
    const response = await fetch(fullPath(path), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      console.error(response);
      throw response;
    }

    const responseBody = await response.json();
    return responseBody as Resp;
  };
}

export const api = createEndpoints(makeRequest, makeBodyRequest);
