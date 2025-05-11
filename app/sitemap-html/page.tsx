"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Head from "next/head"

export default function SitemapPage() {
  const pathname = usePathname()
  
  // Define site structure with sections
  const siteMap = [
    {
      section: "Main Pages",
      links: [
        { url: "/", label: "Home" },
        { url: "/about", label: "About Us" },
        { url: "/contact", label: "Contact" },
      ]
    },
    {
      section: "Services",
      links: [
        { url: "/services", label: "Services Overview" },
        { url: "/blockchain-services", label: "Blockchain Services" },
        { url: "/instant-id", label: "Instant ID" },
      ]
    },
    {
      section: "Projects",
      links: [
        { url: "/projects", label: "Our Projects" },
        { url: "/kvitka-poloniny", label: "Kvitka Poloniny" },
      ]
    },
    {
      section: "Legal",
      links: [
        { url: "/privacy-policy", label: "Privacy Policy" },
        { url: "/terms-of-service", label: "Terms of Service" },
      ]
    }
  ]
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      <Head>
        <title>Sitemap | Fantastic AI Studio</title>
        <meta name="description" content="HTML sitemap for Fantastic AI Studio." />
        <link rel="canonical" href={`https://fais.world${pathname}`} />
      </Head>
      <h1 className="text-3xl font-bold mb-8 text-center lowercase">site map</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {siteMap.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 lowercase">{section.section.toLowerCase()}</h2>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex} className="transition-colors duration-200">
                  <Link 
                    href={link.url}
                    className={`hover:text-gray-600 lowercase ${pathname === link.url ? 'font-bold' : ''}`}
                  >
                    {link.label.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Last updated: May 10, 2025
        </p>
      </div>
    </div>
  )
}
