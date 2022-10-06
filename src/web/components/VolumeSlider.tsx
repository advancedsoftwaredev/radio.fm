import { VolumeDown, VolumeUp } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, Button, Slider, Typography } from '@mui/material';
import { useState } from 'react';

import { api } from '../util/api';
import { useSong, useSongHandler } from './hooks/songContext';
import { useUserData } from './hooks/userContext';

export default function VolumeSlider() {
  const song = useSong();
  const songHandler = useSongHandler();
  const [open, setOpen] = useState<boolean>(false);
  const user = useUserData();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '1rem',
      }}
    >
      <Box sx={{ display: 'flex', height: '3rem' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: open ? '0 1rem' : '0',
            backgroundColor: '#222',
            width: open ? '100%' : '0rem',
            transition: '.5s all ease',
            overflow: 'hidden',
          }}
        >
          <VolumeDown />
          <Slider
            data-testid="volume-slider"
            aria-label="Volume"
            value={(song?.volume ?? 0.5) * 100}
            sx={{ margin: 'auto 1rem', width: '10rem' }}
            onChange={(event: Event, newValue: number | number[]) => {
              songHandler?.setVolumeValue((newValue as number) / 100);
            }}
          />
          <VolumeUp />

          {user && user.role === 'ADMIN' && (
            <Button
              sx={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', whiteSpace: 'nowrap' }}
              onClick={() => void api.queue.skipSong()}
            >
              <Typography>Skip Song</Typography>
              <KeyboardDoubleArrowRightIcon />
            </Button>
          )}
        </Box>
        <Box
          onClick={() => setOpen((current) => !current)}
          sx={{
            backgroundColor: '#444',
            display: 'flex',
            alignItems: 'center',
            padding: '0 .25rem',
            borderRadius: '0 .5rem .5rem 0',
          }}
        >
          <ArrowForwardIosIcon
            sx={{
              display: 'flex',
              alignItems: 'center',
              transform: open ? 'rotateZ(180deg)' : '',
              transition: '.5s all ease',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
