import fs from 'fs';
import { customAlphabet } from 'nanoid';
import path from 'path';
import type { Stream } from 'stream';

import { env } from '../env';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

export interface StorageInterface {
  uploadFile(data: Stream, name: string): Promise<string>;
  getFileStream(partial: string): Promise<Stream>;
  _dangerous_delete_all_files(): Promise<void>;
}

// Initialize a storage class based on environment vaiables
const StorageClass = (() => {
  const storage = env.storage;
  switch (storage.type) {
    case 'local': {
      return class LocalFileStorage implements StorageInterface {
        constructor(readonly extension: string, readonly subfolder: string) {}

        async uploadFile(data: Stream, name: string): Promise<string> {
          const id = nanoid();
          const filename = `${id}-${name.toLowerCase().replace(/ /g, '-')}.${this.extension}`;
          const filepath = path.join(storage.path, this.subfolder, filename);

          await fs.promises.mkdir(path.dirname(filepath), { recursive: true });
          await fs.promises.writeFile(filepath, data);

          return filename;
        }

        async getFileStream(partial: string) {
          const file = path.join(storage.path, this.subfolder, partial);

          // Make sure the file exists so that the stream doesnt crash
          await fs.promises.stat(file);

          return fs.createReadStream(file);
        }

        async _dangerous_delete_all_files() {
          try {
            await fs.promises.rm(path.join(storage.path, this.subfolder), { recursive: true });
          } catch (e) {
            // not empty
          }
        }
      };
    }
    case 'remote': {
      return class RemoteFileStorage implements StorageInterface {
        constructor(readonly extension: string, readonly subfolder: string) {}

        async uploadFile(data: Stream, name: string): Promise<string> {
          throw new Error('Method not implemented.');
        }

        async getFileStream(partial: string): Promise<Stream> {
          throw new Error('Method not implemented.');
        }

        _dangerous_delete_all_files(): Promise<void> {
          throw new Error('Method not implemented.');
        }
      };
    }
  }
})();

export const imageStorage = new StorageClass('jpg', 'images');
export const audioStorage = new StorageClass('mp3', 'songs');
