import getConfig from 'next/config';

export type PageServerConfig = {
  variant: 'server';
  serverUrl: string;
};

export type PagePublicConfig = {
  variant: 'public';
  serverUrl: string;
};

/**
 * Get the config for the current caller.
 * Returns either PageServerConfig if called on the server, or
 * PagePublicConfig if called on the client. Can be discriminated
 * using the `variant` field.
 */
export function getCurrentConfig() {
  const { serverRuntimeConfig, publicRuntimeConfig } = getTypedConfig();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (serverRuntimeConfig.variant !== 'server') {
    return publicRuntimeConfig;
  }
  return serverRuntimeConfig;
}

/**
 * Get the server side config.
 * Returns PageServerConfig if called on the server, or
 * throws an error if called on the client. Make sure this is
 * only ever called on the server.
 */
export function getServerConfig() {
  const { serverRuntimeConfig } = getTypedConfig();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (serverRuntimeConfig.variant !== 'server') {
    throw new Error('Fetching server config on the client');
  }
  return serverRuntimeConfig;
}

/**
 * Get the public config.
 * Returns PagePublicConfig, regardless of where it's called.
 */
export function getPublicConfig() {
  const { publicRuntimeConfig } = getTypedConfig();
  return publicRuntimeConfig;
}

function getTypedConfig() {
  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
  return {
    serverRuntimeConfig: serverRuntimeConfig as PageServerConfig,
    publicRuntimeConfig: publicRuntimeConfig as PagePublicConfig,
  };
}
