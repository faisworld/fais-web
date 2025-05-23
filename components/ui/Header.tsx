"use client"

import Link from "next/link"
import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Logo from "@/components/ui/Logo"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  const menuItems = [
    { href: "/", label: "home" },
    { href: "/services", label: "services" },
    { href: "/projects", label: "projects" },
    { href: "/about", label: "about" },
    { href: "/contact", label: "contact" },
  ]

  return (
    <header className="site-header fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black bg-opacity-80 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-4 lg:px-6 h-20">
        {/* Apply header-logo class to white logo */}
        <Logo variant="white" href="/" className="header-logo" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-start space-x-6 lg:space-x-8">
          <ul className="flex items-center space-x-6 lg:space-x-8">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="header-menu-links">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Section */}
        <div className="md:hidden flex items-center">
          {/* Mobile Menu Button */}
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
        className={`md:hidden fixed top-20 right-0 w-72 max-w-full bg-black/95 shadow-xl rounded-l-xl border-t border-gray-700 transition-all duration-500 ease-in-out z-40 ${
          isMobileMenuOpen ? "max-h-screen opacity-100 pointer-events-auto" : "max-h-0 pointer-events-none opacity-0"
        }`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-1">
          <ul className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="header-menu-links block py-2" onClick={handleLinkClick}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
