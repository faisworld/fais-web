"use client"

import HomeCarousel from "@/components/pages/HomeCarousel"
import SolutionsSection from "@/components/pages/SolutionsSection"
import ProjectsSection from "@/components/pages/ProjectsSection"
// import TestimonialsSection from "@/components/pages/TestimonialsSection"
import ContactUs from "@/components/pages/ContactUs"
import PreFooterSection from "@/components/pages/PreFooterSection"

// Define the main Home component
export default function Home() {
  return (
    <>
      {/* Hero Carousel at the top */}
      <HomeCarousel />

      {/* The rest of the page sections */}
      <div className="bg-white">
        <SolutionsSection />
        <ProjectsSection />
        {/* Testimonials section commented out until we have real client feedback */}
        {/* <TestimonialsSection /> */}
        <ContactUs />
        <PreFooterSection />
      </div>
    </>
  )
}
