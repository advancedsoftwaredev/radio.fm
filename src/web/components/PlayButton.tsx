import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Typography } from '@mui/material';

import { useSocketInterface } from './hooks/socketContext';
import { useSong, useSongHandler } from './hooks/songContext';

const PlayButton = () => {
  const songHandler = useSongHandler();
  const song = useSong();
  const socketHandler = useSocketInterface();

  return (
    <Button
      onClick={() => {
        void socketHandler?.getTime();
        if (song?.volume === 0) {
          songHandler?.setVolumeValue(0.5);
        }
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography sx={{ fontSize: '2rem' }}>Play</Typography>
        <PlayArrowIcon sx={{ fontSize: '4rem' }} />
      </Box>
    </Button>
  );
};

export default PlayButton;
