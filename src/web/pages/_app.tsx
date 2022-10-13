import { Box } from '@mui/material';
import type { AppProps } from 'next/app';

import { SocketContextProvider } from '../components/hooks/socketContext';
import { SongContextProvider } from '../components/hooks/songContext';
import { UserContextProvider } from '../components/hooks/userContext';
import ParticlesComponent from '../components/Particles';
import VolumeSlider from '../components/VolumeSlider';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <SongContextProvider>
        <SocketContextProvider>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <ParticlesComponent />
            <Component {...pageProps} />
            <VolumeSlider />
          </Box>
        </SocketContextProvider>
      </SongContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
