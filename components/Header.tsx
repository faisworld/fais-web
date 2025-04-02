"use client";

import Image from "next/image";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full bg-[#000000]/[0.8] z-50">
            <div className="flex items-center justify-between px-[10%] py-4">
                {/* Logo */}
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={100}
                    height={40}
                    priority
                    style={{ width: "auto", height: "auto" }}
                />
                {/* Navigation */}
                <nav>
                    <ul className="flex gap-8 text-white text-sm sm:text-base">
                        <li>
                            <a href="/services" className="hover:underline">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="/projects" className="hover:underline">
                                Projects
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="hover:underline">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contacts" className="hover:underline">
                                Contacts
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}