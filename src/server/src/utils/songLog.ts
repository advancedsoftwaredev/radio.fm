import prisma from './prisma';

export const addSongLog = async (startTime: Date, songId: string) =>
  await prisma.songLog.create({ data: { startTime, endTime: new Date(), songId } });
