import { io } from './app';
import { prisma } from './utils/prisma';
import {
  addToQueue,
  getInQueue,
  getNextSong,
  getQueueLength,
  removeFromQueue,
  resetFirstSong,
  startQueue,
} from './utils/queue';
import { getSongCount } from './utils/song';
import { addSongLog } from './utils/songLog';

export const songQueueHandler = async (): Promise<any> => {
  const queueLength = await getQueueLength();
  const songCount = await getSongCount();
  const minimumInQueue = 3;

  if (queueLength !== 0) {
    // Update the first song in the queue to make sure it hasn't "started yet", set timeStarted to null or something
    await resetFirstSong();
  }

  if (queueLength < minimumInQueue) {
    for (let i = queueLength; i < minimumInQueue; i++) {
      const skip = Math.floor(Math.random() * songCount);
      const songId = (await prisma.song.findFirst({ skip, take: 1 }))?.id;
      if (!songId) {
        return songQueueHandler();
      }
      await addToQueue(songId);
    }
  }

  console.log('============ Songs in queue ============');
  (await prisma.queue.findMany({ include: { song: true }, orderBy: [{ timeAdded: 'asc' }] })).forEach((song, i) =>
    console.log(`(${i + 1}) ${song.song.title}`)
  );

  await startQueue();

  const currentSong = await getInQueue();
  const nextSong = await getNextSong();

  if (!currentSong || !nextSong || !currentSong.timeStarted) {
    return songQueueHandler();
  }

  setTimeout(async () => {
    await addSongLog(
      currentSong.timeStarted || new Date(new Date().getTime() - currentSong.song.length * 1000),
      currentSong.songId
    );

    await removeFromQueue(currentSong.id);

    io.emit('newSong', {
      song: nextSong.song,
      time: 0,
      finished: true,
    });

    void songQueueHandler();
  }, 1000 + currentSong.song.length * 1000 - (new Date().getTime() - currentSong.timeStarted.getTime()));
};
