import { httpServer } from './app';
import { prisma } from './prisma';
import songQueueHandler from './songQueueHandler';

const port = 8080;

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

void songQueueHandler.restartQueue();

async function runSeedsOnFirstStartup() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log('Running seeds');
    import('./seed');
  }
}

void runSeedsOnFirstStartup();
