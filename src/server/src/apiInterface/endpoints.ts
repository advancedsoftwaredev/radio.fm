import type { ApiSongInfo, SongByIdInput } from '../apiTypes/song';
import type { ApiUser, UserCredentials } from '../apiTypes/user';

type BodyMethod = 'POST';
type NoBodyMethod = 'GET';

type MakeBodyRequest = <Req, Resp>(method: BodyMethod, path: string) => (body: Req) => Promise<Resp>;
type MakeRequest = <Resp>(method: NoBodyMethod, path: string) => () => Promise<Resp>;

export function createEndpoints(makeRequest: MakeRequest, makeBodyRequest: MakeBodyRequest) {
  return {
    auth: {
      login: makeBodyRequest<UserCredentials, ApiUser>('POST', '/auth/login'),
      register: makeBodyRequest<UserCredentials, ApiUser>('POST', '/auth/register'),
      logout: makeRequest<{}>('GET', '/auth/logout'),
      getSelf: makeRequest<ApiUser>('GET', '/auth/get-self'),
    },
    song: {
      getById: makeBodyRequest<SongByIdInput, ApiSongInfo>('POST', '/song/song-info'),
    },
    user: {},
  };
}
