'use client'

import HomeCarousel from '@/components/pages/HomeCarousel'
import SolutionsSection from '@/components/pages/SolutionsSection'
import ProjectsSection from '@/components/pages/ProjectsSection'
// import TestimonialsSection from '@/components/pages/TestimonialsSection'
import QuoteSection from '@/components/pages/QuoteSection'
import PreFooterSection from '@/components/pages/PreFooterSection'
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/ui/StructuredData'
import { getBlobImage } from '@/utils/media-utils'

// Define the main Home component
export default function Home() {
  return (
    <>
      {/* SEO Structured Data */}
      <WebsiteStructuredData 
        name='Fantastic AI Studio'
        url='https://fais.world'
        description='Industry-leading AI & Blockchain solutions for digital transformation. Custom AI development, blockchain implementation, and innovative technology solutions.'
        keywords={['AI development', 'Blockchain implementation', 'Digital transformation', 'Enterprise AI', 'Smart contracts', 'Machine learning']}
        author='Fantastic AI Studio'
        logo={getBlobImage('logo')}
        potentialAction={{
          target: 'https://fais.world/search?q={search_term_string}',
          query: 'required name=search_term_string'
        }}
      />
      
      <OrganizationStructuredData
        name='Fantastic AI Studio'
        url='https://fais.world'
        logo={getBlobImage('logo')}
        description='Leading provider of AI and blockchain solutions for businesses seeking digital transformation and technological innovation.'
        sameAs={[
          'https://twitter.com/fantasticaistudio',
          'https://linkedin.com/company/fantasticaistudio',
          'https://github.com/fantastic-ai-studio'
        ]}
        address={{
          addressCountry: 'Ukraine',
          addressLocality: 'Kyiv',
          addressRegion: 'Kyiv City',
          postalCode: '03150',
        }}
        contactPoint={{
          telephone: '+380-93-017-77-17',
          contactType: 'customer service',
          email: 'info@fais.world',
          availableLanguage: ['English']
        }}
      />

      {/* Desktop: HomeCarousel */}
      <div className='hidden md:block'>
        <HomeCarousel />
      </div>

      {/* Content Area */}
      {/* Desktop: md:mt-[100vh] pushes content below viewport-height carousel */}
      {/* Mobile: No specific top margin here, content flows after Mobile Hero */}
      <div className='bg-white pt-20 md:pt-0 md:mt-[90vh]'> {/* Added pt-20 for mobile, md:pt-0 to reset for desktop */}
        {/* Add id='solutions' to SolutionsSection component for the mobile hero link to work */}
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
