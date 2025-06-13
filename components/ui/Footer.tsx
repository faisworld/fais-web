"use client"

import Link from "next/link"
import Logo from "@/components/ui/Logo"

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Upper Block */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-12">        <div className="flex flex-wrap justify-between">          
          {/* First Column - Logo and Navigation */}          
          <div className="w-full md:w-[30%] mb-6 md:mb-0 flex flex-col items-center md:items-start">
            {/* Logo aligned with container */}
            <div className="mb-2 logo-container w-full flex justify-center md:justify-start">
              <Logo variant="black" className="footer-logo" />
            </div>            {/* Navigation aligned with breadcrumbs */}
            <ul className="footer-navigation-links list-none w-full text-center md:text-left">
              <li className="mb-2">
                <Link href="/" className="footer-link lowercase">
                  home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/services" className="footer-link lowercase">
                  services
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/projects" className="footer-link lowercase">
                  projects
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="footer-link lowercase">
                  about
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="footer-link lowercase">
                  contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Second Column - Other Resources */}
          <div className="w-full md:w-[30%] mb-6 md:mb-0 flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-4 lowercase">other resources:</h3>
            <ul className="list-none w-full text-center md:text-left">
              <li className="mb-2">
                <Link href="/blog/" className="footer-link lowercase">
                  ai and blockchain blog
                </Link>
              </li>
              <li className="mb-2">
                <Link href="https://chatgpt.com/g/g-6756a52a58b88191b89dbd4b700f249e-bitcoin-ai" className="footer-link lowercase">
                  bitcoin ai
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/ai-services/" className="footer-link lowercase">
                  ai services
                </Link>
              </li>              <li className="mb-2">
                <Link href="/blockchain-services/" className="footer-link lowercase">
                  blockchain services
                </Link>
              </li>
            </ul>
              {/* Social Media Icons - moved under blockchain services */}
            <div className="footer-social-media mt-4">
              <h4 className="text-sm font-medium mb-3 text-gray-700 lowercase">follow us:</h4>
              <div className="flex justify-center md:justify-start space-x-3">
                <a 
                  href="https://twitter.com/fantasticaistudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter/X"
                  className="footer-social-icon"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/company/fantasticaistudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Connect with us on LinkedIn"
                  className="footer-social-icon"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Third Column - Contacts */}
          <div className="w-full md:w-[30%] flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-4 lowercase">contacts:</h3>
            <div className="w-full text-center md:text-left">
              <p className="lowercase">03150, kyiv city, ukraine</p>
              <p className="lowercase">132 vel. vasylkivska str.</p>
              <br />
              <p className="lowercase">fantasticai.studio</p>
              <p className="lowercase">+380 95 615 1756</p>
              <p>
                <a href="mailto:info@fais.world" className="footer-link lowercase">
                  info@fais.world
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Block */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center text-center">
          <p className="text-sm lowercase">
            fais ©. all rights reserved © 2024. |{" "}
            <Link href="/privacy-policy/" className="footer-link lowercase">
              privacy policy
            </Link>{" "}
            |{" "}
            <Link href="/terms-of-use/" className="footer-link lowercase">
              terms of use
            </Link>{" "}
            |{" "}
            <Link href="/sitemap-html" className="footer-link lowercase">
              sitemap
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
