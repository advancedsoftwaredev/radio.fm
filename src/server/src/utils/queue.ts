import { Queue, Song } from '@prisma/client';
import { CurrentSongData } from 'src/socketTypes/socketDataTypes';
import prisma from './prisma';

export interface QueueWithSong extends Queue {
  song: Song;
}

export const getInQueue = async (position: number = 0): Promise<QueueWithSong | null> => {
  return await prisma.queue.findFirst({
    skip: position,
    take: 1,
    orderBy: [
      {
        timeAdded: 'asc',
      },
    ],
    include: {
      song: true,
    },
  });
};

export const getCurrentSong = async (): Promise<CurrentSongData | null> => {
  const currentSong = await getInQueue();

  if (!currentSong) {
    return null;
  }

  const currentTime = new Date().getTime() - currentSong?.timeStarted.getTime();

  return {
    song: currentSong.song,
    time: currentTime,
  };
};

export const getNextSong = async () => await getInQueue(1);

export const goToNextSong = async (): Promise<CurrentSongData | null> => {
  const currentSong = await getInQueue();
  if (!currentSong) {
    return null;
  }
  await prisma.queue.delete({ where: { id: currentSong?.id } });
  return await getCurrentSong();
};

export const getQueueLength = async (): Promise<number> => {
  return (await prisma.queue.aggregate({ _count: true }))._count;
};
