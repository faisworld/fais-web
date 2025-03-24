import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import AssistantWidget from '../components/AssistantWidget';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <AssistantWidget />
    </SessionProvider>
  );
}

export default MyApp;
