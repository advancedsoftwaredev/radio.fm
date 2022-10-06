import type { AppProps } from 'next/app';

import { SocketContextProvider } from '../components/hooks/socketContext';
import { SongContextProvider } from '../components/hooks/songContext';
import { UserContextProvider } from '../components/hooks/userContext';
import VolumeSlider from '../components/VolumeSlider';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <SongContextProvider>
        <SocketContextProvider>
          <Component {...pageProps} />
          <VolumeSlider />
        </SocketContextProvider>
      </SongContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
