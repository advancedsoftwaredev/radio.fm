import songQueueHandler from '../../songQueueHandler';
import { authenticatedRouter } from '../../utils/routers';

export const QueueRouter = authenticatedRouter('admin');

QueueRouter.get<{}>('/skip-song', async () => {
  void songQueueHandler.skipSong(true);
  return {};
});
