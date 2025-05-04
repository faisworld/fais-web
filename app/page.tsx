"use client"

import HomeCarousel from "@/components/pages/HomeCarousel"
import SolutionsSection from "@/components/pages/SolutionsSection"
import ProjectsSection from "@/components/pages/ProjectsSection"
// import TestimonialsSection from "@/components/pages/TestimonialsSection"
import QuoteSection from "@/components/pages/QuoteSection"
import PreFooterSection from "@/components/pages/PreFooterSection"

// Define the main Home component
export default function Home() {
  return (
    <>
      {/* Hero Carousel at the top */}
      <HomeCarousel />

      {/* The rest of the page sections with consistent spacing */}
      <div className="bg-white">
        <SolutionsSection />
        <ProjectsSection />
        {/* Testimonials section commented out until we have real client feedback */}
        {/* <TestimonialsSection /> */}

        {/* Quote Section */}
        <QuoteSection />

        {/* PreFooterSection */}
        <PreFooterSection />
      </div>
    </>
  )
}
