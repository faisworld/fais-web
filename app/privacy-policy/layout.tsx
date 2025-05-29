import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Data Protection & Security | Fantastic AI Studio",
  description: "Comprehensive privacy policy for Fantastic AI Studio. Learn how we protect your personal data, comply with GDPR, CCPA regulations, and ensure enterprise-grade security for our AI and blockchain services.",
  keywords: [
    // Core Privacy Keywords
    'privacy policy', 'data protection', 'personal data security', 'GDPR compliance',
    'CCPA compliance', 'data privacy rights', 'information security', 'privacy practices',
    
    // Technical Security Keywords
    'data encryption', 'secure data handling', 'privacy by design', 'data minimization',
    'consent management', 'data retention policy', 'security measures', 'privacy controls',
    
    // Legal Compliance Keywords
    'GDPR privacy policy', 'California privacy rights', 'EU data protection', 'US privacy laws',
    'data subject rights', 'privacy regulations', 'compliance framework', 'legal privacy requirements',
    
    // Enterprise Keywords
    'enterprise data privacy', 'business data protection', 'client data security', 'confidentiality policy',
    'AI data ethics', 'blockchain privacy', 'technology privacy standards', 'professional data handling',
    
    // Geographic Keywords
    'US privacy policy', 'UK data protection', 'German privacy laws', 'European privacy standards',
    'international data transfers', 'cross-border data protection', 'global privacy compliance',
    
    // AI & Blockchain Specific
    'AI privacy policy', 'blockchain data protection', 'machine learning privacy', 'smart contract privacy',
    'AI data processing', 'algorithmic transparency', 'ML model privacy', 'decentralized data protection'
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
    title: 'Privacy Policy | Data Protection & Security | Fantastic AI Studio',
    description: 'Comprehensive privacy policy ensuring GDPR and CCPA compliance. Learn how we protect your data with enterprise-grade security.',
    url: 'https://fais.world/privacy-policy',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Fantastic AI Studio',
    description: 'Comprehensive privacy policy ensuring GDPR and CCPA compliance. Enterprise-grade data protection.',
    creator: '@FantasticAI',
    site: '@FantasticAI',
  },
  alternates: {
    canonical: 'https://fais.world/privacy-policy',
    languages: {
      'en-US': 'https://fais.world/privacy-policy',
      'en-GB': 'https://fais.world/en-gb/privacy-policy',
      'de-DE': 'https://fais.world/de/datenschutz',
    },
  },
  other: {
    'DC.title': 'Privacy Policy - Data Protection & Security - Fantastic AI Studio',
    'DC.creator': 'Fantastic AI Studio',
    'DC.subject': 'privacy policy data protection GDPR CCPA compliance security',
    'DC.description': 'Comprehensive privacy policy detailing data protection practices, GDPR and CCPA compliance, and security measures',
    'DC.publisher': 'Fantastic AI Studio',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Policy',
    'DC.format': 'text/html',
    'DC.identifier': 'https://fais.world/privacy-policy',
    'DC.language': 'en',
    'DC.rights': 'Copyright Fantastic AI Studio',
    'rating': 'general',
    'distribution': 'global',
    'target': 'all',
  },
};

export default function PrivacyPolicyLayout({
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
            "name": "Privacy Policy",
            "description": "Comprehensive privacy policy for Fantastic AI Studio detailing data protection practices and compliance",
            "url": "https://fais.world/privacy-policy",
            "mainEntity": {
              "@type": "DigitalDocument",
              "name": "Privacy Policy Document",
              "description": "Legal document outlining privacy practices, data protection measures, and user rights",
              "datePublished": "2024-01-01",
              "dateModified": new Date().toISOString(),
              "author": {
                "@type": "Organization",
                "name": "Fantastic AI Studio"
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
                  "name": "Privacy Policy",
                  "item": "https://fais.world/privacy-policy"
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
