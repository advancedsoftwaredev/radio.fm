import type { Queue, Song } from '@prisma/client';
import type { CurrentSongData } from 'src/socketTypes/socketDataTypes';

import prisma from './prisma';

export interface QueueWithSong extends Queue {
  song: Song;
}

export const getInQueue = async (position = 0): Promise<QueueWithSong | null> => {
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

  if (!currentSong || !currentSong.timeStarted) {
    return null;
  }

  const currentTime = (new Date().getTime() - currentSong.timeStarted.getTime()) / 1000;

  return {
    song: currentSong.song,
    time: currentTime,
    finished: false,
  };
};

export const getNextSong = async () => await getInQueue(1);

export const goToNextSong = async (): Promise<CurrentSongData | null> => {
  const currentSong = await getInQueue();
  if (!currentSong) {
    return null;
  }
  await removeFromQueue(currentSong.id);
  return await getCurrentSong();
};

export const getQueueLength = async (): Promise<number> => {
  return (await prisma.queue.aggregate({ _count: true }))._count;
};

export const removeFromQueue = async (id: string) => await prisma.queue.delete({ where: { id } });
export const addToQueue = async (songId: string) =>
  await prisma.queue.create({ data: { songId, timeAdded: new Date() } });

export const resetFirstSong = async () => {
  const firstInQueue = await getInQueue();
  await prisma.queue.update({ where: { id: firstInQueue?.id }, data: { timeStarted: null } });
};

export const startQueue = async () => {
  const currentSong = await getInQueue();

  if (!currentSong?.id) {
    return;
  }

  await prisma.queue.update({
    where: { id: currentSong.id },
    data: { timeStarted: new Date() },
  });
};
