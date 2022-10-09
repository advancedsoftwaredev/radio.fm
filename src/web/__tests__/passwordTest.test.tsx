import { fireEvent, render, screen } from '@testing-library/react';

import PasswordUpdate from '../components/PasswordUpdate';

const updateMock = jest.fn().mockImplementation(async (username: string) => {});
const testVariable = 'testPassword';

describe('Password', () => {
  it('Updates correctly', async () => {
    render(<PasswordUpdate updatePass={updateMock} error={false} loading={false} />);
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
