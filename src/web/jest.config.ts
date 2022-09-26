// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  displayName: 'web',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  resetMocks: false,
  setupFiles: [],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/testSetup/setup-jest.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
