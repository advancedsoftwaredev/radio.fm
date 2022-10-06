import axios from 'axios';
import fs from 'fs';
import getAudioDurationInSeconds from 'get-audio-duration';

import { seedSongs } from '../../seedData/song';
import { prisma } from '../../utils/prisma';
import { audioStorage, imageStorage } from '../../utils/storage_interface';
import { makeTempFileFromBuffer } from '../../utils/tempfile';

// FIXME: In the future, when we add admin endpoints, this should use the endpoint to create songs.
export const insertSongs = async () =>
  await Promise.all(
    seedSongs.map(async (song) => {
      // We don't store the data locally, we fetch them from the seed urls
      const [audio, image] = await Promise.all([
        axios.get(song.songDownloadUrl, { responseType: 'arraybuffer' }),
        axios.get(song.albumImageDownloadUrl, { responseType: 'arraybuffer' }),
      ]);

      const file = await makeTempFileFromBuffer(audio.data, '.mp3');
      const duration = await getAudioDurationInSeconds(file);
      await fs.promises.rm(file);

      // Then we save the data using the storage interface
      const [audioUrl, imageUrl] = await Promise.all([
        audioStorage.uploadFile(audio.data, song.title),
        imageStorage.uploadFile(image.data, song.title),
      ]);

      await prisma.song.create({
        data: {
          artist: song.artist,
          description: song.description,
          title: song.title,
          albumImageUrl: imageUrl,
          songMediaUrl: audioUrl,
          length: Math.round(duration),
        },
      });
    })
  );
