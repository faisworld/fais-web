"use client"

import Link from "next/link"
import Logo from "@/components/ui/Logo"

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Upper Block */}
      <div className="flex flex-wrap w-full py-8 px-4 sm:px-6 lg:px-[10%] mt-12">
        {/* First Column - Logo and Navigation */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center md:text-left md:pl-0">
          <div className="flex justify-center md:justify-start logo-container p-0 m-0">
            <Logo variant="black" className="h-[50px]" />
          </div>
          <ul className="list-none mt-2 w-full text-center md:text-left">
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
        <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center md:text-left">
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
            <li className="mb-2">
              <Link href="/instant-id" className="footer-link lowercase">
                instantid image creator
              </Link>
            </li>
          </ul>
        </div>

        {/* Third Column - Contacts */}
        <div className="w-full md:w-1/3 text-center md:text-left">
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

      {/* Lower Block */}
      <div className="flex flex-col sm:flex-row items-center justify-center py-4 w-full px-4 text-center">
        <p className="text-sm lowercase">
          fais ©. all rights reserved © 2024. |{" "}
          <Link href="/privacy-policy/" className="footer-link lowercase">
            privacy policy
          </Link>{" "}
          |{" "}
          <Link href="/terms-of-use/" className="footer-link lowercase">
            terms of use
          </Link>
        </p>
      </div>
    </footer>
  )
}
