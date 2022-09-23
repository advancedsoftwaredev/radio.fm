import { api } from '../../server/src/apiInterface/index';
import type { MockedApi } from '../testSetup/mocks';

jest.mock('../../server/src/apiInterface');

describe('mocks', () => {
  it('api interface with test api interface', async () => {
    expect((api as MockedApi).mocked).toBeTruthy();
    expect(api.song).toBeTruthy();
    const user = await api.auth.getSelf();
    expect(user.role).toBe('GUEST');
  });
});
