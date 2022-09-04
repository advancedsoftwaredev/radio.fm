import prisma from './prisma';

export const getSongCount = async (): Promise<number> => (await prisma.song.aggregate({ _count: true }))._count;
