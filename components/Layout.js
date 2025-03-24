import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, title = 'Fantastic AI Studio' }) {
  return (
    <>
      <Head>
        <title>{title} | AI Development Services</title>
        <meta name="description" content="Fantastic AI Studio offers cutting-edge AI development services for businesses of all sizes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
