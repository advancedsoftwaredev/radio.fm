import type { ApiSongInfo, SongByIdInput } from '../apiTypes/song';
import type { ApiUser, UserCredentials } from '../apiTypes/user';

type MakeBodyRequest = <Req, Resp>(path: string) => (body: Req) => Promise<Resp>;
type MakeRequest = <Resp>(path: string) => () => Promise<Resp>;
type MakeUploadRequest = <Req, Resp>(
  path: string,
  progressCallback?: (progress: number) => void
) => (body: Req, file: File) => Promise<Resp>;

export function createEndpoints(
  makeRequest: MakeRequest,
  makeBodyRequest: MakeBodyRequest,
  makeUploadRequest: MakeUploadRequest
) {
  return {
    auth: {
      login: makeBodyRequest<UserCredentials, ApiUser>('/auth/login'),
      register: makeBodyRequest<UserCredentials, ApiUser>('/auth/register'),
      logout: makeRequest<{}>('/auth/logout'),
      getSelf: makeRequest<ApiUser>('/auth/get-self'),
    },
    song: {
      getById: makeBodyRequest<SongByIdInput, ApiSongInfo>('/song/song-info'),
    },
    user: {},
  };
}
