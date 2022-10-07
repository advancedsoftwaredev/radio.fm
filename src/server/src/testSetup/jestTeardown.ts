import fs from 'fs';

import { env } from '../env';

export default function teardown() {
  if (env.storage.type === 'local') {
    fs.rmdirSync(env.storage.path, { recursive: true });
  }
}
