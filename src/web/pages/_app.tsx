import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SocketContextProvider } from '../components/hooks/socketContext';
import { UserContextProvider } from '../components/hooks/userContext';
import { SongContextProvider } from '../components/hooks/songContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <SongContextProvider>
        <SocketContextProvider>
          <Component {...pageProps} />
        </SocketContextProvider>
      </SongContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
