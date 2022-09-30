import type { api } from '../util/api';

export type MockedApi = typeof api & {
  mocked: boolean;
};
