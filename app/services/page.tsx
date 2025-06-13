'use client'

import Link from 'next/link';
import './services-video.css';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { getBlobImage } from '@/utils/media-utils';
import { ServiceStructuredData, BreadcrumbStructuredData } from '@/components/structured-data';

export default function ServicesPage() {
  const servicesData = [
    {
      name: "AI Solutions",
      description: "Leverage advanced AI to transform your operations, drive innovation, and gain actionable insights. Our AI services include predictive analytics, NLP, computer vision, and custom machine learning models.",
      serviceType: "Artificial Intelligence Development",
      areaServed: ["United States", "United Kingdom", "Germany", "Europe"],
      url: "/ai-services"
    },
    {
      name: "Blockchain & Web3 Solutions", 
      description: "Harness the power of decentralized technology to build secure, transparent, and future-ready applications. Our blockchain services include smart contracts, DApps, and enterprise integration.",
      serviceType: "Blockchain Development",
      areaServed: ["United States", "United Kingdom", "Germany", "Europe"],
      url: "/blockchain-services"
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" }
  ];

  return (    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-x-clip">
      {/* Structured Data */}
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      {servicesData.map((service, index) => (
        <ServiceStructuredData key={index} service={service} />
      ))}

      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Left background shape - positioned wider to align with logo */}
        <div className="absolute top-[-200px] left-[-300px] w-[500px] h-[500px] rounded-full bg-neutral-200 opacity-40 blur-3xl" />
        {/* Right background shape - positioned wider to align with end of menu */}
        <div className="absolute bottom-[-200px] right-[-300px] w-[500px] h-[500px] rounded-full bg-neutral-200 opacity-30 blur-3xl" />
      </div>

      <main className="relative z-10">        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900">
              professional ai & blockchain services
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-neutral-700 max-w-3xl mx-auto">
              unlock the full potential of your business with innovative, secure, and scalable solutions powered by artificial intelligence and blockchain technology.            </p>            {/* Video Display Area */}            <VideoPlayer 
              src={getBlobImage('services-hero-video')}
              className="w-full aspect-video rounded-lg shadow-xl mb-8"
              controls={true}
              muted={true}
              autoPlay={false}
              loop={true}
              poster={getBlobImage('services-og-image')}
            />
            
            <Link
              href="/contact"
              className="btn inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white hover:opacity-90 transition"
            >
              book a free consultation
            </Link>
          </div>
        </section>        {/* Services Overview */}
        <section className="grid md:grid-cols-2 gap-16 mb-12">
          {/* AI Services */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-black">artificial intelligence solutions</h2>
            <p className="mb-6 text-neutral-700">
              leverage advanced ai to transform your operations, drive innovation, and gain actionable insights. our ai services are tailored to solve real business challenges and deliver measurable results.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>predictive analytics:</strong> anticipate trends, customer behaviors, and market shifts with data-driven forecasting models.
              </li>
              <li>
                <strong>natural language processing (nlp):</strong> enable intelligent automation of text and voice data for chatbots, sentiment analysis, and content summarization.
              </li>
              <li>
                <strong>computer vision:</strong> automate image and video analysis for quality control, security, and enhanced user experiences.
              </li>
              <li>
                <strong>custom machine learning models:</strong> develop and deploy models tailored to your unique business needs, from automation to optimization.
              </li>
              <li>
                <strong>ai-powered chatbots & virtual assistants:</strong> enhance customer engagement and support with 24/7 intelligent conversational agents.
              </li>
              <li>
                <strong>robotic process automation (rpa):</strong> streamline repetitive tasks and workflows, reducing costs and minimizing errors.
              </li>
            </ul>
          </div>

          {/* Blockchain Solutions */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-black">blockchain & web3 solutions</h2>
            <p className="mb-6 text-neutral-700">
              harness the power of decentralized technology to build secure, transparent, and future-ready applications. our blockchain services help you innovate with confidence.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>smart contract development:</strong> automate agreements and transactions with secure, self-executing contracts on leading blockchain platforms.
              </li>
              <li>
                <strong>decentralized applications (dapps):</strong> build scalable, censorship-resistant apps that empower users and enhance data security.
              </li>
              <li>
                <strong>tokenization & digital assets:</strong> digitize real-world assets for improved liquidity, fractional ownership, and streamlined management.
              </li>
              <li>
                <strong>enterprise blockchain integration:</strong> seamlessly connect blockchain with your existing systems (erp, crm, scm) for enhanced transparency and efficiency.
              </li>
              <li>
                <strong>consulting & strategy:</strong> receive expert guidance on blockchain adoption, platform selection, and roadmap development for successful implementation.
              </li>
              <li>
                <strong>security audits & compliance:</strong> ensure your blockchain solutions meet the highest standards for security and regulatory compliance.
              </li>
            </ul>
          </div>
        </section>        {/* Call to Action */}
        <section className="bg-neutral-200 py-16 text-center shadow-inner">
          <h2 className="text-4xl font-bold mb-4">ready to transform your business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-neutral-700">
            partner with fantastic ai studio to unlock new opportunities, streamline operations, and stay ahead of the competition with our expert ai and blockchain services.
          </p>
          <Link
            href="/contact"
            className="btn inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white hover:opacity-90 transition"
          >
            get started today
          </Link>
        </section>      </main>
    </div>
  );
}