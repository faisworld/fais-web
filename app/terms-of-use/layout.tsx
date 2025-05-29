import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Use | Service Agreement | Fantastic AI Studio",
  description: "Comprehensive terms of use and service agreement for Fantastic AI Studio's AI and blockchain development services. Legal terms, conditions, and user agreements for enterprise clients and website visitors.",
  keywords: [
    // Core Legal Keywords
    'terms of use', 'terms of service', 'service agreement', 'user agreement',
    'legal terms', 'website terms', 'terms and conditions', 'service contract',
    
    // Business Legal Keywords
    'enterprise service terms', 'business agreement', 'professional services terms', 'consulting agreement',
    'development services terms', 'technology services agreement', 'AI services contract', 'blockchain services terms',
    
    // Legal Compliance Keywords
    'legal compliance', 'service liability', 'intellectual property terms', 'software licensing terms',
    'user responsibilities', 'service limitations', 'warranty terms', 'indemnification clause',
    
    // AI & Blockchain Specific
    'AI development terms', 'blockchain service agreement', 'smart contract terms', 'technology consulting terms',
    'machine learning services terms', 'enterprise AI agreement', 'blockchain consulting contract', 'development liability',
    
    // Geographic Keywords
    'US service terms', 'UK service agreement', 'German service contract', 'international service terms',
    'cross-border service agreement', 'global service terms', 'enterprise service agreement worldwide',
    
    // Industry Keywords
    'technology service terms', 'software development agreement', 'consulting service contract', 'enterprise technology terms',
    'professional development services', 'business technology agreement', 'digital services contract'
  ],
  authors: [{ name: 'Fantastic AI Studio' }],
  creator: 'Fantastic AI Studio',
  publisher: 'Fantastic AI Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Terms of Use | Service Agreement | Fantastic AI Studio',
    description: 'Comprehensive terms of use and service agreement for AI and blockchain development services. Legal framework for enterprise clients.',
    url: 'https://fais.world/terms-of-use',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Use | Fantastic AI Studio',
    description: 'Service agreement and legal terms for AI and blockchain development services.',
    creator: '@FantasticAI',
    site: '@FantasticAI',
  },
  alternates: {
    canonical: 'https://fais.world/terms-of-use',
    languages: {
      'en-US': 'https://fais.world/terms-of-use',
      'en-GB': 'https://fais.world/en-gb/terms-of-use',
      'de-DE': 'https://fais.world/de/nutzungsbedingungen',
    },
  },
  other: {
    'DC.title': 'Terms of Use - Service Agreement - Fantastic AI Studio',
    'DC.creator': 'Fantastic AI Studio',
    'DC.subject': 'terms of use service agreement legal contract AI blockchain services',
    'DC.description': 'Comprehensive terms of use and service agreement for AI and blockchain development services',
    'DC.publisher': 'Fantastic AI Studio',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Legal Document',
    'DC.format': 'text/html',
    'DC.identifier': 'https://fais.world/terms-of-use',
    'DC.language': 'en',
    'DC.rights': 'Copyright Fantastic AI Studio',
    'rating': 'general',
    'distribution': 'global',
    'target': 'all',
  },
};

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Use",
            "description": "Terms of use and service agreement for Fantastic AI Studio's AI and blockchain development services",
            "url": "https://fais.world/terms-of-use",
            "mainEntity": {
              "@type": "DigitalDocument",
              "name": "Terms of Use Agreement",
              "description": "Legal document outlining terms of service, user agreements, and service conditions",
              "datePublished": "2024-01-01",
              "dateModified": new Date().toISOString(),
              "author": {
                "@type": "Organization",
                "name": "Fantastic AI Studio"
              },
              "about": {
                "@type": "Service",
                "name": "AI & Blockchain Development Services",
                "provider": {
                  "@type": "Organization",
                  "name": "Fantastic AI Studio"
                }
              }
            },
            "publisher": {
              "@type": "Organization",
              "name": "Fantastic AI Studio",
              "url": "https://fais.world",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fais.world/logo.png"
              }
            },
            "inLanguage": "en-US",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://fais.world"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Terms of Use",
                  "item": "https://fais.world/terms-of-use"
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}
