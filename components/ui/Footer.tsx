import React from "react";
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Upper Block */}
      <div className="flex flex-wrap w-full py-8 px-[10%] mt-12">
        {/* Left Column */}
        <div className="w-1/2">
          <h3 className="text-lg font-bold mb-4">other resources:</h3>
          <ul className="list-none">
            <li className="mb-2">
              <Link href="/blog/" className="footer-link">
                AI and Blockchain Blog
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="https://chatgpt.com/g/g-6756a52a58b88191b89dbd4b700f249e-bitcoin-ai"
                className="footer-link"
              >
                Bitcoin AI
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/ai-services/" className="footer-link">
                AI Services
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/blockchain-services/" className="footer-link">
                Blockchain Services
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column */}
        <div className="w-1/2 text-center">
          <h3 className="text-lg font-bold mb-4">Contacts:</h3>
          <p>03150, Kyiv City, Ukraine</p>
          <p>132 Vel. Vasylkivska Str.</p>
          <br />
          <p>fantasticai.studio</p>
          <p>+380 95 615 1756</p>
          <p>
            <a href="mailto:info@fais.world" className="footer-link">
              info@fais.world
            </a>
          </p>
        </div>
      </div>

      {/* Lower Block */}
      <div className="flex items-center justify-center py-4 w-full">
        <p className="text-sm">
          fAis ©. All rights reserved © 2024. |{" "}
          <Link href="/privacy-policy/" className="footer-link">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms-of-use/" className="footer-link">
            Terms of Use
          </Link>
        </p>
      </div>
    </footer>
  );
}