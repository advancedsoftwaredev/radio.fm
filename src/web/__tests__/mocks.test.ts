import type { MockedApi } from '../testSetup/mocks';
import { api } from '../util/api';

jest.mock('../../server/src/apiInterface');

describe('mocks', () => {
  it('api interface with test api interface', async () => {
    expect((api as MockedApi).mocked).toBeTruthy();
    const user = await api.auth.getSelf();
    expect(user.role).toBe('GUEST');
  });
});
