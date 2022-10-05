import { Box, Button, styled, TableCell, tableCellClasses, TableRow, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import type { ApiSongInfo } from '../../server/src/apiTypes/song';
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
  const user = useUserData();
  const router = useRouter();

  const getSongs = async () => {
    const songList = await api.song.getAllSongs();
    setSongs(songList);
  };

  const deleteSong = async (id: string) => {
    await api.songAdmin.deleteSong({ id });
    await getSongs();
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
    <Box sx={{ padding: '2rem' }}>
      <Button onClick={() => router.push('/')}>
        <Typography>{'<<'} Back</Typography>
      </Button>
      <h1>Song Management</h1>
      <SongTable songs={songs} deleteSong={deleteSong} />
    </Box>
  );
};

export default SongManagement;
