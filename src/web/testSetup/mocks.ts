import type { api } from '../../server/src/apiInterface';

export type MockedApi = typeof api & {
  mocked: boolean;
};
