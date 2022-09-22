import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { Box, Slider } from '@mui/material';

import { useSong, useSongHandler } from './hooks/songContext';

export default function VolumeSlider() {
  const song = useSong();
  const songHandler = useSongHandler();

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        alignItems: 'center',
        width: '15rem',
        justifyContent: 'space-between',
      }}
    >
      <VolumeDown />
      <Slider
        aria-label="Volume"
        value={(song?.volume ?? 0.5) * 100}
        sx={{ margin: 'auto 1rem' }}
        onChange={(event: Event, newValue: number | number[]) => {
          songHandler?.setVolumeValue((newValue as number) / 100);
        }}
      />
      <VolumeUp />
    </Box>
  );
}
