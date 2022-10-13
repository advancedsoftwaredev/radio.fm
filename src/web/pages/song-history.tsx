import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import type { SongLogWithLike } from '../../server/src/apiTypes/song';
import Header from '../components/Header';
import SongHistoryItem from '../components/SongHistoryItem';
import { api } from '../util/api';

const SongHistory = () => {
  const [songHistory, setSongHistory] = useState<SongLogWithLike[] | null>(null);
  const [spin, setSpin] = useState<boolean>(false);

  const getSongHistory = async () => {
    const songs = await api.songLog.songLogs();
    setSongHistory(songs);
  };

  useEffect(() => {
    void getSongHistory();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box
        sx={{ maxWidth: '40rem', alignSelf: 'center', display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '.3rem',
            right: '1rem',
            cursor: 'pointer',
            transition: '.5s all ease',
            transform: spin ? 'rotateZ(1080deg)' : 'rotateZ(0deg)',
          }}
          onClick={() => {
            setSpin((current) => !current);
            void getSongHistory();
          }}
        >
          <RefreshIcon fontSize="large" sx={{ display: 'flex', alignItems: 'center' }} />
        </Box>
        <Typography variant="h4" sx={{ alignSelf: 'center' }}>
          Song History
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1',
            marginTop: '1rem',
            marginBottom: '1rem',
            alignSelf: 'center',
          }}
        >
          {songHistory
            ?.slice()
            .reverse()
            .map((songLog) => (
              <SongHistoryItem key={songLog.id} songLog={songLog} refresh={getSongHistory} />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SongHistory;
