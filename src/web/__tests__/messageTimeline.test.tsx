import { render, screen, waitFor } from '@testing-library/react';
import react from 'react';
import ReactDOM from 'react-dom';
import { IMessage } from '../components/hooks/socketContext';
import MessageTimeline from '../components/MessageTimeline';

const message: IMessage[] = [
  {
    id: '1',
    username: 'Nas',
    time: new Date(),
    msg: 'Hello',
  },
  {
    id: '2',
    username: 'Nis',
    time: new Date(),
    msg: 'hi',
  },
  {
    id: '3',
    username: 'Ron',
    time: new Date(),
    msg: 'Hey',
  },
];
describe('MessageTimeline component test', () => {
  it('Correctly rendering message', async () => {
    render(<MessageTimeline messages={message} />);
    const messageItem = screen.getAllByTestId('messageItem');

    expect(messageItem).toHaveLength(message.length);

    const messageItem_username = screen.getAllByTestId('messageItem_username');
    const messageItem_mssg = screen.getAllByTestId('messageItem_mssg');

    for (let i = message.length - 1; i >= 0; i--) {
      expect(messageItem_username[message.length - i - 1].textContent).toBe(message[i].username);
      expect(messageItem_mssg[message.length - i - 1].textContent).toBe(message[i].msg);
    }
  });
});
