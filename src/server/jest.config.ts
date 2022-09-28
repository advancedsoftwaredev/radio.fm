import type { Config } from 'jest';

const config: Config = {
  displayName: 'server',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
};

export default config;