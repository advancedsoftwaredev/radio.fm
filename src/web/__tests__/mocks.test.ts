import { api } from '../../server/src/apiInterface/index';
import type { MockedApi } from '../testSetup/mocks';

jest.mock('../../server/src/apiInterface');

describe('mocks', () => {
  it('api interface with test api interface', () => {
    expect((api as MockedApi).mocked).toBeTruthy();
    expect(api.song).toBeTruthy();
  });
});
