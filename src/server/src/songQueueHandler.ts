import { io } from './app';
import { prisma } from './utils/prisma';
import {
  addToQueue,
  emptyQueue,
  getCurrentSong,
  getInQueue,
  getNextSong,
  getQueueLength,
  removeFromQueue,
  resetFirstSong,
  startQueue,
} from './utils/queue';
import { getSongCount } from './utils/song';
import { addSongLog } from './utils/songLog';

class SongQueue {
  minimumInQueue: number;

  constructor(minimumInQueue: number) {
    this.minimumInQueue = minimumInQueue;
  }

  async restartQueue() {
    await emptyQueue();
    void this.queueHandler(true);
  }

  async queueHandler(broadcastNewQueue = false): Promise<void> {
    if ((await getSongCount()) === 0) {
      return;
    }

    const queueLength = await getQueueLength();

    if (queueLength !== 0) {
      await resetFirstSong();
    }

    if (queueLength < this.minimumInQueue) {
      for (let i = queueLength; i < this.minimumInQueue; i++) {
        await this.queueNewSong();
      }
    }

    await this.printQueue();

    await startQueue();

    const currentSong = await getInQueue();
    const nextSong = await getNextSong();

    if (!currentSong || !nextSong || !currentSong.timeStarted) {
      return this.queueHandler();
    }

    if (broadcastNewQueue) {
      io.emit('newSong', {
        song: currentSong.song,
        time: (await getCurrentSong())?.time,
        newQueue: true,
        finished: false,
      });
    }

    setTimeout(async () => {
      if ((await getInQueue())?.id === currentSong.id && (await getNextSong())?.id === nextSong.id) {
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

        void this.queueHandler();
      }
    }, 1000 + currentSong.song.length * 1000 - (new Date().getTime() - currentSong.timeStarted.getTime()));
  }

  async queueNewSong() {
    const skip = Math.floor(Math.random() * (await getSongCount()));
    const songId = (await prisma.song.findFirst({ skip, take: 1 }))?.id;
    if (!songId) {
      void this.queueHandler();
      return;
    }
    await addToQueue(songId);
  }

  async checkInQueue(id: string) {
    return (await getInQueue())?.song.id === id || (await getNextSong())?.song.id === id;
  }

  async printQueue() {
    console.log('============ Songs in queue ============');
    (await prisma.queue.findMany({ include: { song: true }, orderBy: [{ timeAdded: 'asc' }] })).forEach((song, i) =>
      console.log(`(${i + 1}) ${song.song.title}`)
    );
  }
}

const songQueueHandler = new SongQueue(3);

export default songQueueHandler;
