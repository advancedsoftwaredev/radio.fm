import { Prisma } from '@prisma/client';
import { ApiSongInfo, SongByIdInput } from '../apiTypes/song';

type BodyMethod = 'POST';
type NoBodyMethod = 'GET';

type MakeBodyRequest = <Req, Resp>(method: BodyMethod, path: string) => (body: Req) => Promise<Resp>;
type MakeRequest = <Resp>(method: NoBodyMethod, path: string) => () => Promise<Resp>;

export function createEndpoints(makeRequest: MakeRequest, makeBodyRequest: MakeBodyRequest) {
  return {
    song: {
      getById: makeBodyRequest<SongByIdInput, ApiSongInfo>('POST', '/song/song-info'),
    },
  };
}
