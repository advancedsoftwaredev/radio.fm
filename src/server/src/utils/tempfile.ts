import fs from 'fs';
import { customAlphabet } from 'nanoid';
import path from 'path';
import type { Stream } from 'stream';
import { Readable } from 'stream';

import { env } from '../env';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export async function makeTempFileFromBuffer(buffer: Buffer, extension: string) {
  return makeTempFileFromStream(Readable.from(buffer), extension);
}

export async function makeTempFileFromStream(stream: Stream, extension: string) {
  await fs.promises.mkdir(env.tempPath, { recursive: true });

  const id = nanoid();
  const filename = `${id}.${extension}`;

  const filepath = path.join(env.tempPath, filename);
  const writer = fs.createWriteStream(filepath);
  stream.pipe(writer);
  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  return filepath;
}
