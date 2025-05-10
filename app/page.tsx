"use client"

import HomeCarousel from "@/components/pages/HomeCarousel"
import SolutionsSection from "@/components/pages/SolutionsSection"
import ProjectsSection from "@/components/pages/ProjectsSection"
// import TestimonialsSection from "@/components/pages/TestimonialsSection"
import QuoteSection from "@/components/pages/QuoteSection"
import PreFooterSection from "@/components/pages/PreFooterSection"
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/ui/StructuredData"
import { getBlobImage } from "@/utils/image-utils"

// Define the main Home component
export default function Home() {
  return (
    <>
      {/* SEO Structured Data */}
      <WebsiteStructuredData 
        name="Fantastic AI Studio"
        url="https://fais.world"
        description="Industry-leading AI & Blockchain solutions for digital transformation. Custom AI development, blockchain implementation, and innovative technology solutions."
        keywords={["AI development", "Blockchain implementation", "Digital transformation", "Enterprise AI", "Smart contracts", "Machine learning"]}
        author="Fantastic AI Studio"
        logo={getBlobImage("logo")}
        potentialAction={{
          target: "https://fais.world/search?q={search_term_string}",
          query: "required name=search_term_string"
        }}
      />
      
      <OrganizationStructuredData
        name="Fantastic AI Studio"
        url="https://fais.world"
        logo={getBlobImage("logo")}
        description="Leading provider of AI and blockchain solutions for businesses seeking digital transformation and technological innovation."
        sameAs={[
          "https://twitter.com/fantasticaistudio",
          "https://linkedin.com/company/fantasticaistudio",
          "https://github.com/fantastic-ai-studio"
        ]}
        address={{
          addressCountry: "USA"
        }}
        contactPoint={{
          telephone: "+1-234-567-8910",
          contactType: "customer service",
          email: "contact@fais.world",
          availableLanguage: ["English"]
        }}
      />

      {/* Hero Carousel at the top - Desktop only */}
      <HomeCarousel />{/* Content structured for both mobile and desktop */}
      <div className="bg-white md:mt-8">
        {/* SolutionsSection starts the page on mobile */}
        <div className="md:hidden">
          <div className="bg-gradient-to-r from-blue-900 to-black w-full py-8 px-4">
            <h1 className="text-3xl font-bold text-center text-white lowercase" itemProp="name">
              fantastic ai studio
            </h1>
            <p className="text-white text-center mt-2 bg-black inline-block px-4 py-1 rounded-md mx-auto block" itemProp="description">
              innovative <span className="text-blue-300">ai</span> & <span className="text-yellow-400">blockchain</span> solutions
            </p>
          </div>
          <SolutionsSection />
        </div>
        
        {/* Desktop SolutionsSection */}
        <div className="hidden md:block">
          <SolutionsSection />
        </div>
        
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
