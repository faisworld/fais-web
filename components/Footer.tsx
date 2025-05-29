import Logo from './ui/Logo';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-content">      <div className="footer-column footer-column-brand flex flex-col items-start">        <div className="pl-8">
          <Logo variant="black" className="footer-logo" href={undefined} />
        </div>
        <nav className="footer-navigation pl-8">
          <ul>
            <li><Link href="/" aria-label="Navigate to home page">home</Link></li>
            <li><Link href="/services" aria-label="View our AI and blockchain services">services</Link></li>
            <li><Link href="/projects" aria-label="Browse our portfolio of projects">projects</Link></li>
            <li><Link href="/about" aria-label="Learn about our company">about</Link></li>
            <li><Link href="/contact" aria-label="Get in touch with us">contacts</Link></li>
          </ul>
        </nav>
      </div>
      <div className="footer-column">
        <h3>other resources:</h3>
        <ul>
          <li><Link href="/blog/" aria-label="Read our AI and blockchain insights">ai and blockchain blog</Link></li>
          <li><Link href="https://chatgpt.com/g/g-6756a52a58b88191b89dbd4b700f249e-bitcoin-ai" target="_blank" rel="noopener noreferrer" aria-label="Try our Bitcoin AI assistant">bitcoin ai</Link></li>
          <li><Link href="/ai-services/" aria-label="Explore our AI development services">ai services</Link></li>
          <li><Link href="/blockchain-services/" aria-label="Learn about our blockchain solutions">blockchain services</Link></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>contacts:</h3>
        <p>03150, kyiv city, ukraine</p>
        <p>132 vel. vasylkivska str.</p>
        <p>fantasticai.studio</p>
        <p>+380 95 615 1756</p>
        <p>info@fais.world</p>
      </div>
    </footer>
  );
}
