import { httpServer } from './app';
import { songQueueHandler } from './songQueueHandler';

const port = 8080;

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

void songQueueHandler();
