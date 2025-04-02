// filepath: c:\Users\solar\Projects\fais-web\components\Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white text-black">
            {/* Upper Block */}
            <div className="flex flex-wrap w-full py-8 px-[10%]">
                {/* Left Column */}
                <div className="w-1/2">
                    <h3 className="text-lg font-bold mb-4">other resources:</h3>
                    <ul className="list-none">
                        <li className="mb-2">
                            <Link href="/blog/" className="hover:underline">
                                AI and Blockchain Blog
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                href="https://chatgpt.com/g/g-6756a52a58b88191b89dbd4b700f249e-bitcoin-ai"
                                className="hover:underline"
                            >
                                Bitcoin AI
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/ai-services/" className="hover:underline">
                                AI Services
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/blockchain-services/" className="hover:underline">
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
                        <a href="mailto:info@fais.world" className="hover:underline">
                            info@fais.world
                        </a>
                    </p>
                </div>
            </div>

            {/* Lower Block */}
            <div className="flex items-center justify-center py-4 bg-black text-white w-full">
                <p className="text-sm">
                    fAis ©. All rights reserved © 2024. |{" "}
                    <Link href="/privacy-policy/" className="hover:underline">
                        Privacy Policy
                    </Link>{" "}
                    |{" "}
                    <Link href="/terms-of-use/" className="hover:underline">
                        Terms of Use
                    </Link>
                </p>
            </div>
        </footer>
    );
}