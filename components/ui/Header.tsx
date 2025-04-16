"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://fais.world'), // Set to your production domain
  title: {
    default: 'Fantastic AI Studio',
    template: '%s | Fantastic AI Studio',
  },
  description: 'Driving innovation with AI and Blockchain solutions.',
};

const VapiWidget = dynamic(() => import("@/components/ui/VapiWidget"), { ssr: false });

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkClick = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const menuItems = [
        { href: "/", label: "Home" },
        { href: "/services", label: "Services" },
        { href: "/projects", label: "Projects" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <header className="site-header fixed top-0 left-0 w-full z-50 transition-all duration-300">
            <div className="max-w-7x1 mx-auto flex items-center justify-between px-4 sm:px-4 lg:px-6 h-25">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0" onClick={handleLinkClick}>
                    <Image
                        src="/images/logo.png"
                        alt="Fantastic AI Studio Logo"
                        width={100}
                        height={40}
                        priority
                        style={{ width: "auto", height: "40px" }}
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                    <ul className="flex items-center space-x-6 lg:space-x-8">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="header-menu-links">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="ml-4">
                         <VapiWidget />
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                     <div className="mr-4">
                        <VapiWidget />
                     </div>
                    <button
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        {isMobileMenuOpen ? (
                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden fixed top-20 right-0 w-72 max-w-full bg-black/95 shadow-xl rounded-l-xl border-t border-gray-200 transition-all duration-500 ease-in-out z-50 ${
                    isMobileMenuOpen ? 'max-h-screen' : 'max-h-0 pointer-events-none opacity-0'
                }`}
            >
                <nav className="px-4 pt-2 pb-4 space-y-1">
                    <ul className="flex flex-col space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="header-menu-links"
                                    onClick={handleLinkClick}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}