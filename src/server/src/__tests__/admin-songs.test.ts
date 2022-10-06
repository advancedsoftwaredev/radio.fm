import axios from 'axios';

import { seedSongs } from '../seedData/song';
import { getTestAdminClient } from '../testSetup/data/users';
import { initializeDatabaseTesting } from '../utils/databaseTest';

initializeDatabaseTesting();

describe('admin-songs', () => {
  let createdSongId!: string;
  const song = seedSongs[0];

  it('should successfully upload a song', async () => {
    const client = await getTestAdminClient();

    const [audio, image] = await Promise.all([
      axios.get(song.songDownloadUrl, { responseType: 'arraybuffer' }),
      axios.get(song.albumImageDownloadUrl, { responseType: 'arraybuffer' }),
    ]);

    const artUpload = await client.songAdmin.uploadArt(
      {
        title: 'test-song',
      },
      image.data
    );

    const songUpload = await client.songAdmin.uploadSong(
      {
        albumImageUrl: artUpload.albumImageUrl,
        artist: song.artist,
        description: song.description,
        title: song.title,
      },
      audio.data
    );

    expect(songUpload).toEqual(
      expect.objectContaining({
        title: song.title,
        description: song.description,
        artist: song.artist,
        length: 216,
      })
    );

    createdSongId = songUpload.id;
  });

  it('should recieve a list of all songs', async () => {
    const client = await getTestAdminClient();

    const songs = await client.song.getAllSongs();

    expect(songs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdSongId,
          title: song.title,
          description: song.description,
          artist: song.artist,
        }),
      ])
    );
  });

  it('should delete a song', async () => {
    const client = await getTestAdminClient();

    await client.songAdmin.deleteSong({
      id: createdSongId,
    });

    const songs = await client.song.getAllSongs();
    expect(songs).toHaveLength(0);
  });
});
