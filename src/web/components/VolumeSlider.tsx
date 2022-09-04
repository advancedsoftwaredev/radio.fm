import { Box, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { useSongHandler } from './hooks/songContext';

export default function VolumeSlider() {
  const [value, setValue] = useState<number>(50);

  const songHandler = useSongHandler();

  useEffect(() => {
    songHandler?.setVolumeValue(value / 100);
  }, [value]);

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'sticky',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
        width: '15rem',
        justifyContent: 'space-between',
      }}
    >
      <VolumeDown />
      <Slider
        aria-label="Volume"
        value={value}
        sx={{ margin: 'auto 1rem' }}
        onChange={(event: Event, newValue: number | number[]) => {
          setValue(newValue as number);
        }}
      />
      <VolumeUp />
    </Box>
  );
}
