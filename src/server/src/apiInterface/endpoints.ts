import type {
  ApiCreateAlbumArtInfo,
  ApiCreateAlbumArtReturn,
  ApiCreateSongInfo,
  ApiSongInfo,
  SongByIdInput,
} from '../apiTypes/song';
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
      getAllSongs: makeRequest<ApiSongInfo[]>('/song/all-songs'),
    },
    songAdmin: {
      deleteSong: makeBodyRequest<SongByIdInput, {}>('/song-admin/delete-song'),
      uploadArt: makeUploadRequest<ApiCreateAlbumArtInfo, ApiCreateAlbumArtReturn>('/song-admin/upload-art'),
      uploadSong: makeUploadRequest<ApiCreateSongInfo, ApiSongInfo>('/song-admin/upload-song'),
    },
    user: {
      deleteAccount: makeRequest<{}>('/user/delete-account'),
      getLikedSongs: makeRequest<ApiSongInfo[]>('/user/liked-songs'),
      changePassword: makeBodyRequest<{ password: string }, {}>('/user/change-password'),
      changeUsername: makeBodyRequest<{ username: string }, {}>('/user/change-username'),
      likeSong: makeBodyRequest<{ songId: string }, {}>('/user/like-song'),
      unlikeSong: makeBodyRequest<{ songId: string }, {}>('/user/unlike-song'),
      likesSong: makeBodyRequest<{ songId: string }, { liked: boolean }>('/user/likes-song'),
    },
  };
}
