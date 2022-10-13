import type { SongLogWithLike } from '../../apiTypes/song';
import { prisma } from '../../utils/prisma';
import { authenticatedRouter } from '../../utils/routers';
import { mapSongToApiSong } from '../song/song';

const SongLogRouter = authenticatedRouter('guest');

SongLogRouter.get<SongLogWithLike[]>('/song-logs', async (req, res) => {
  const startTime = new Date(new Date().getTime() - 60000 * 60);
  const songLogsWithLike: SongLogWithLike[] = [];

  const songLogs = await prisma.songLog.findMany({
    where: {
      startTime: {
        gte: startTime,
      },
    },
    include: {
      song: true,
    },
  });

  for (let i = 0; i < songLogs.length; i++) {
    const songLiked = await prisma.likedSong.findFirst({
      where: { userId: req.user.id, songId: songLogs[i].songId },
    });
    songLogsWithLike.push({ ...songLogs[i], song: mapSongToApiSong(songLogs[i].song), liked: !!songLiked });
  }

  return songLogsWithLike;
});

export default SongLogRouter;
