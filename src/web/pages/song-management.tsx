import { Box, styled, TableCell, tableCellClasses, TableRow } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import type { ApiSongInfo } from '../../server/src/apiTypes/song';
import Header from '../components/Header';
import { useSong } from '../components/hooks/songContext';
import { useUserData } from '../components/hooks/userContext';
import SongTable from '../components/SongTable';
import { api } from '../util/api';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1f1f1f',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#dedede',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SongManagement = () => {
  const [songs, setSongs] = useState<ApiSongInfo[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement[] | null>([]);
  const user = useUserData();
  const router = useRouter();
  const song = useSong();

  const getSongs = async () => {
    const songList = await api.song.getAllSongs();
    setAudio(() => songList.map((song) => new Audio(song.songMediaUrl)));
    setSongs(songList);
  };

  const deleteSong = async (id: string) => {
    await api.songAdmin.deleteSong({ id });
    await getSongs();
  };

  const stopSong = async () => {
    audio?.forEach((element) => {
      element.pause();
    });

    if (song) {
      song.audio?.pause();
    }
  };

  useEffect(() => {
    void getSongs();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      void router.push('/');
    }
  }, [router, user]);

  return (
    <Box>
      <Header />

      <Box sx={{ padding: '1rem', paddingTop: '.25rem' }}>
        <h1>Song Management</h1>
        <SongTable songs={songs} deleteSong={deleteSong} stopSong={stopSong} audio={audio} />
      </Box>
    </Box>
  );
};

export default SongManagement;
