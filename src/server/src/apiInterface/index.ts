import { createEndpoints } from './endpoints';

type BodyMethod = 'POST';
type NoBodyMethod = 'GET';

export function fullPath(path: string) {
  return '/api' + path;
}

function makeRequest<Resp>(path: string) {
  return async () => {
    const response = await fetch(fullPath(path), {
      method: 'GET',
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

function makeBodyRequest<Req, Resp>(path: string) {
  return async (body: Req) => {
    const response = await fetch(fullPath(path), {
      method: 'POST',
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

function makeUploadRequest<Req, Resp>(path: string, progressCallback?: (progress: number) => void) {
  return async (body: Req, file: Blob) => {
    const formData = new FormData();
    formData.append('body', JSON.stringify(body));
    formData.append('file', file);

    const request = new XMLHttpRequest();
    request.open('POST', fullPath(path));
    request.send(formData);

    return new Promise<Resp>((resolve, reject) => {
      request.onload = async () => {
        if (request.status !== 200) {
          console.error(request);
          reject(request);
        } else {
          const responseBody = JSON.parse(request.response);
          resolve(responseBody as Resp);
        }
      };

      request.onerror = (e) => {
        console.error(e);
        reject(e);
      };

      request.upload.onprogress = (e) => {
        if (e.lengthComputable && progressCallback) {
          progressCallback(e.loaded / e.total);
        }
      };
    });
  };
}

export const api = createEndpoints(makeRequest, makeBodyRequest, makeUploadRequest);
