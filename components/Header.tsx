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
                    <ul className="flex gap-8">
                        <li>
                            <a href="/services" className="header-menu-links">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="/projects" className="header-menu-links">
                                Projects
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="header-menu-links">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contacts" className="header-menu-links">
                                Contacts
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}