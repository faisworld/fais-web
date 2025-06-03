"use client"

import Breadcrumbs from "@/components/ui/Breadcrumbs"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

// Define custom page titles for specific routes
const pageLabels: Record<string, string> = {
  "services": "Services",
  "ai-services": "AI Services",
  "blockchain-services": "Blockchain Services",
  "projects": "Projects",
  "about": "About Us",
  "contact": "Contact",
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service", 
  "blog": "Blog",
  "instant-id": "InstantID Creator",
  "gallery": "Image Gallery",
  "admin": "Admin Panel",
  "kvitka-poloniny": "Квітка полонини",
}

export default function DynamicBreadcrumbs({ darkBg = false }: { darkBg?: boolean }) {
  const pathname = usePathname()
  const [dynamicLabel, setDynamicLabel] = useState<string | null>(null)
  const [segments, setSegments] = useState<string[]>([])

  useEffect(() => {
    // Set segments when pathname changes
    if (!pathname || pathname === "/") {
      setSegments([])
      return
    }
    
    setSegments(pathname.split("/").filter(Boolean))
  }, [pathname])

  // Try to fetch dynamic content titles for specific routes
  useEffect(() => {
    // Don't process if no segments
    if (segments.length === 0) return

    const fetchDynamicContent = async () => {
      // Blog post page handling
      if (segments.length >= 2 && segments[0] === 'blog' && segments[1] !== 'page') {
        try {
          // For a real implementation, you would fetch the actual blog post title
          // This implementation smartly converts the slug to a readable title
          const slug = segments[1]
          
          // Check if this is a blog post with ID that might match our data
          // In a real implementation, you would fetch this from an API
          // You could implement an API endpoint that returns the title for a given slug
          
          // For now, generate a readable title from the slug
          const formattedTitle = slug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
          
          setDynamicLabel(formattedTitle)
        } catch (error) {
          console.error('Error fetching dynamic content title:', error)
        }
      }
      
      // Gallery item page handling
      if (segments.length >= 2 && segments[0] === 'gallery' && !isNaN(Number(segments[1]))) {
        try {
          setDynamicLabel('Image Details')
        } catch (error) {
          console.error('Error fetching gallery item title:', error)
        }
      }
    }
    
    fetchDynamicContent()
  }, [segments])
  
  // Don't show breadcrumbs on home page
  if (!pathname || pathname === "/") return null
  
  // Handle dynamic routes with special characters like [slug]
  const items = [
    { label: "Home", href: "/" },
    ...segments.map((seg, idx) => {
      // Check if we're on the last segment and we have a dynamic label
      if (idx === segments.length - 1 && dynamicLabel && 
          ((segments[0] === 'blog' && idx > 0) || 
           (segments[0] === 'gallery' && idx > 0))) {
        return {
          label: dynamicLabel,
          href: "/" + segments.slice(0, idx + 1).join("/"),
        }
      }
      
      // Check if the segment is a dynamic route parameter (surrounded by brackets)
      const isDynamicParam = seg.startsWith('[') && seg.endsWith(']')
      
      // Get custom label or generate one
      const label = pageLabels[seg] || 
                  (isDynamicParam ? "Details" : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "))
      
      return {
        label,
        href: "/" + segments.slice(0, idx + 1).join("/"),
      }
    }),
  ]

  return (
    <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="breadcrumbs-container container mx-auto max-w-7xl py-4">
        <Breadcrumbs items={items} darkBg={darkBg} />
      </div>
    </div>
  )
}
