import Logo from './ui/Logo';

export default function Footer() {
  return (
    <footer className="footer-content">
      <div className="footer-column footer-column-brand flex flex-col items-start">
        <div className="pl-8 mb-6">
          <Logo variant="black" className="footer-logo" href={undefined} />
        </div>
        <nav className="footer-navigation mt-2 pl-8">
          <ul>
            <li><a href="#">home</a></li>
            <li><a href="#">services</a></li>
            <li><a href="#">projects</a></li>
            <li><a href="#">about</a></li>
            <li><a href="#">contacts</a></li>
          </ul>
        </nav>
      </div>
      <div className="footer-column">
        <h3>other resources:</h3>
        <ul>
          <li>ai and blockchain blog</li>
          <li>bitcoin ai</li>
          <li>ai services</li>
          <li>blockchain services</li>
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
