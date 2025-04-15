"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://fais.world'), // Replace with your actual domain
  title: {
    default: 'Fantastic AI Studio',
    template: '%s | Fantastic AI Studio',
  },
  description: 'Driving innovation with AI and Blockchain solutions.',
};

const VapiWidget = dynamic(() => import("@/components/VapiWidget"), { ssr: false });

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
        <header className="fixed top-0 left-0 w-full bg-[#000000]/[0.8] backdrop-blur-sm z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0" onClick={handleLinkClick}>
                    <Image
                        src="/images/logo.png"
                        alt="Fantastic AI Studio Logo"
                        width={100}
                        height={37}
                        priority
                        style={{ width: "auto", height: "37px" }}
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                    <ul className="flex items-center space-x-6 lg:space-x-8">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="text-white text-sm font-medium hover:underline transition-colors">
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
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                className={`md:hidden absolute top-full right-0 w-full sm:w-72 bg-[#000000]/[0.95] backdrop-blur-md overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isMobileMenuOpen ? 'max-h-screen shadow-lg border-t border-gray-700' : 'max-h-0'
                }`}
            >
                <nav className="px-4 pt-2 pb-4 space-y-1 sm:px-6 lg:px-8">
                    <ul className="flex flex-col space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
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