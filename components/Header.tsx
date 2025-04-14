"use client"; // Required for useState
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Use Link for internal navigation
import VapiWidget from './VapiWidget';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-[#000000]/[0.8] z-50">
                <div className="flex items-center justify-between px-[5%] md:px-[10%] py-4"> {/* Adjusted padding */}
                    {/* Logo */}
                    <Link href="/"> {/* Use Link for home */}
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={100}
                            height={40}
                            priority
                            style={{ width: "auto", height: "auto" }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center"> {/* Hide on small screens, flex on medium+ */}
                        <ul className="flex gap-8 items-center">
                            <li><Link href="/services" className="header-menu-links">Services</Link></li>
                            <li><Link href="/projects" className="header-menu-links">Projects</Link></li>
                            <li><Link href="/about" className="header-menu-links">About</Link></li>
                            <li><Link href="/contact" className="header-menu-links">Contact</Link></li>
                            <li><VapiWidget /></li>
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center"> {/* Visible only on small screens */}
                         <VapiWidget /> {/* Optionally keep VapiWidget visible or move into menu */}
                         <button onClick={toggleMobileMenu} className="text-white ml-4 p-2 focus:outline-none">
                            {/* Simple Hamburger Icon */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden bg-[#000000]/[0.9] px-[5%] pb-4">
                        <ul className="flex flex-col gap-4 items-center">
                            <li><Link href="/services" className="header-menu-links" onClick={toggleMobileMenu}>Services</Link></li>
                            <li><Link href="/projects" className="header-menu-links" onClick={toggleMobileMenu}>Projects</Link></li>
                            <li><Link href="/about" className="header-menu-links" onClick={toggleMobileMenu}>About</Link></li>
                            <li><Link href="/contact" className="header-menu-links" onClick={toggleMobileMenu}>Contact</Link></li>
                            {/* Optionally add VapiWidget here if hidden above */}
                        </ul>
                    </nav>
                )}
            </header>
        </>
    );
}