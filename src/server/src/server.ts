import { httpServer } from './app';

const port = 8080;

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
