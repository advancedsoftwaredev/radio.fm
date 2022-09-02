import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SocketContextProvider } from '../components/hooks/socketContext';
import { UserContextProvider } from '../components/hooks/userContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketContextProvider>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </SocketContextProvider>
  );
}

export default MyApp;
