import { fireEvent, render, screen } from '@testing-library/react';

import UserUpdate from '../components/UserUpdate';

const updateMock = jest.fn().mockImplementation(async (username: string) => {});
const testVariable = 'testUsername';

describe('Username', () => {
  it('Updates correctly', async () => {
    render(<UserUpdate updateUser={updateMock} error={false} loading={false} />);
    const input = (await screen.findByTestId('testButton')).querySelector('input');
    const submit = await screen.findByTestId('updateButton');
    if (input) {
      fireEvent.change(input, { target: { value: testVariable } });
    }
    fireEvent.click(submit);
    expect(updateMock).toBeCalledTimes(1);
    expect(updateMock).toBeCalledWith(testVariable);
  });
});
