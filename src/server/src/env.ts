import dotenv from 'dotenv';
import path from 'path';

dotenv.config({});
dotenv.config({ path: '../../.env' });

function envVar(name: string): string | undefined {
  return process.env[name];
}

function envVarProdForce(name: string): string | undefined {
  const value = envVar(name);
  if (value === undefined && process.env.NODE_ENV === 'production') {
    throw new Error(`${name} environment variable must be defined in production`);
  }
  return value;
}

interface LocalStorage {
  type: 'local';
  path: string;
}

interface RemoteStorage {
  type: 'remote';
  url: string;
}

type StorageConfig = LocalStorage | RemoteStorage;

let local_data_path = envVarProdForce('LOCAL_DATA_PATH') ?? path.join(__dirname, '../../../local_storage');

const local_path_addon = envVar('LOCAL_PATH_EXTENSION');
if (local_path_addon) {
  local_data_path = path.join(local_data_path, local_path_addon);
}

function getStorageConfig(): StorageConfig {
  return {
    type: 'local',
    path: local_data_path,
  };
}

export const env = {
  jwtSecret: envVarProdForce('JWT_SECRET') ?? '_dev_secret',
  storage: getStorageConfig(),
  tempPath: path.join(local_data_path, 'tmp'),
  corsUrl: envVarProdForce('CLIENT_URL') ?? 'http://localhost:3000',
  serverUrl: envVarProdForce('SERVER_URL') ?? 'http://localhost:8080',
  publicDir: envVarProdForce('PUBLIC_DIR'),
};
