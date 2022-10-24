import { fireEvent, render, screen } from '@testing-library/react';

import type { ApiSongInfo } from '../../server/src/apiTypes/song';
import SongTable from '../components/SongTable';

const songs: ApiSongInfo[] = [
  {
    id: '12',
    title: 'blanky blank',
    description: 'this is a song',
    length: 342,
    artist: 'blank and the blanks',
    albumImageUrl: '',
    songMediaUrl: '',
  },
  {
    id: '123',
    title: 'random name',
    description: 'this is also a song',
    length: 372,
    artist: 'random band',
    albumImageUrl: '',
    songMediaUrl: '',
  },
  {
    id: '1234',
    title: "chris's song",
    description: 'this might not be a song',
    length: 272,
    artist: 'chris kaza',
    albumImageUrl: '',
    songMediaUrl: '',
  },
];
const deleteMock = jest.fn().mockImplementation(async (id: string) => {});

describe('Song Table', () => {
  it('Renders Correctly', () => {
    render(<SongTable songs={songs} deleteSong={deleteMock} stopSong={() => {}} audio={[]} />);
    const songArray = screen.getAllByTestId('song-element');

    expect(songArray).toHaveLength(songs.length);
    for (let i = 0; i < songs.length; i++) {
      expect(songArray[i].textContent).toBe(songs[i].id);
    }
  });

  it('Deletes Song Correctly', () => {
    render(<SongTable songs={songs} deleteSong={deleteMock} stopSong={() => {}} audio={[]} />);
    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);
    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteMock).toBeCalledWith(songs[0].id);
  });
});
