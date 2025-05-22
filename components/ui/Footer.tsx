"use client"

import Link from "next/link"
import Logo from "@/components/ui/Logo"

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Upper Block */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-12">
        <div className="flex flex-wrap justify-between">
          {/* First Column - Logo and Navigation */}
          <div className="w-full md:w-[30%] mb-6 md:mb-0 flex flex-col items-center md:items-start">
            {/* Add pl-8 class to align with navigation links */}
            <div className="mb-8 md:pl-8">
              <Logo variant="black" className="footer-logo" />
            </div>
            {/* Keep the pl-8 that works for alignment */}
            <ul className="list-none w-full text-center md:text-left md:pl-8">
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
              </li>
              <li className="mb-2">
                <Link href="/blockchain-services/" className="footer-link lowercase">
                  blockchain services
                </Link>
              </li>
            </ul>
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
