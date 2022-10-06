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
  favoriteSongFrequency: number;
  favoriteSongChoice: number;
  favoriteCount: number;
  songRepeatCount: number;

  constructor(minimumInQueue = 3, favoriteSongFrequency = 3, favoriteSongChoice = 10, songRepeatCount = 2) {
    this.minimumInQueue = minimumInQueue;
    this.favoriteSongFrequency = favoriteSongFrequency;
    this.favoriteSongChoice = favoriteSongChoice;
    this.songRepeatCount = songRepeatCount;
    this.favoriteCount = 0;
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
        await this.skipSong();

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
    const songCount = await getSongCount();
    if (songCount === 0) {
      return;
    }

    const ignoreSongRepeat = (await getSongCount()) <= this.songRepeatCount;

    const previousSongs = [];

    if (!ignoreSongRepeat) {
      previousSongs.push(
        ...(
          await prisma.queue.findMany({
            take: this.songRepeatCount,
            orderBy: [
              {
                timeAdded: 'desc',
              },
            ],
          })
        ).map((queueSong) => queueSong.songId)
      );

      if (this.songRepeatCount - previousSongs.length !== 0) {
        previousSongs.push(
          ...(
            await prisma.songLog.findMany({
              take: this.songRepeatCount - previousSongs.length,
              orderBy: [
                {
                  startTime: 'desc',
                },
              ],
            })
          ).map((songLog) => songLog.songId)
        );
      }
    }

    this.favoriteCount++;

    let songId = null;

    const favoriteSongs = await prisma.likedSong.groupBy({
      by: ['songId'],
      _count: { userId: true },
      having: { userId: { _count: { gte: 1 } } },
      orderBy: { _count: { userId: 'desc' } },
      take: this.favoriteSongChoice,
    });

    let fromFavorites = false;

    while (!songId) {
      if (this.favoriteCount < this.favoriteSongFrequency || favoriteSongs.length === 0) {
        const skip = Math.floor(Math.random() * songCount);
        songId = (await prisma.song.findFirst({ skip, take: 1 }))?.id;
        fromFavorites = false;
      } else {
        const random = Math.floor(Math.random() * favoriteSongs.length);
        songId = favoriteSongs[random].songId;
        favoriteSongs.splice(random, 1);
        fromFavorites = true;
      }

      if (!ignoreSongRepeat) {
        for (let i = 0; i < previousSongs.length; i++) {
          if (songId === previousSongs[i]) {
            songId = null;
            break;
          }
        }
      }
    }

    if (fromFavorites) {
      this.favoriteCount = 0;
    }

    await addToQueue(songId);
  }

  async checkInQueue(id: string) {
    return (await getInQueue())?.song.id === id || (await getNextSong())?.song.id === id;
  }

  async skipSong(manualSkip = false) {
    const currentSong = await getInQueue();

    if (!currentSong) {
      return;
    }

    await this.addSongToLog(
      currentSong.timeStarted || new Date(new Date().getTime() - currentSong.song.length * 1000),
      currentSong.songId
    );

    await removeFromQueue(currentSong.id);

    if (manualSkip) {
      void this.queueHandler(true);
    }
  }

  async addSongToLog(startTime: Date, songId: string) {
    await addSongLog(startTime, songId);
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
