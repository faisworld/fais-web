"use client"

import { getBlobImage } from "@/utils/media-utils"
import ClientImage from "@/components/ui/ClientImage"

export default function SolutionsSection() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white" itemScope itemType="https://schema.org/Service">
      <div className="max-w-7xl mx-auto">        {/* Section header with consistent alignment */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" itemProp="name">Enterprise AI & Blockchain Development Solutions</h2>
          <p className="max-w-3xl mx-auto" itemProp="description">
            Fantastic AI Studio delivers enterprise-grade AI and blockchain solutions to Fortune 500 companies across USA, UK, and Germany. Our cutting-edge technology frameworks drive digital transformation, optimize business operations, and deliver measurable ROI for enterprise clients.
          </p>
        </div>

        {/* Two-column layout that maintains alignment on all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">          {/* AI-Powered Solutions Column */}
          <div className="flex flex-col items-center" itemScope itemType="https://schema.org/Service">
            <h3 className="text-2xl font-bold mb-6 text-center" itemProp="name">Enterprise AI Development</h3>
            <div className="relative w-full aspect-[3/2] mb-6">
              <ClientImage
                src={getBlobImage("ai-solutions")}
                alt="Enterprise AI Development - Custom AI solutions for Fortune 500 companies"
                fill
                className="mx-auto"
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "contain" }}
                fallbackSrc="/interconnected-ai.png"
                itemProp="image"
              />
            </div>
            <p className="text-center" itemProp="description">
              Deploy enterprise-grade AI solutions including machine learning models, natural language processing, computer vision, and predictive analytics to transform your business operations and drive competitive advantage.
            </p>
            <meta itemProp="serviceType" content="Enterprise AI Development" />
          </div>          {/* Blockchain Innovations Column */}
          <div className="flex flex-col items-center" itemScope itemType="https://schema.org/Service">
            <h3 className="text-2xl font-bold mb-6 text-center" itemProp="name">Enterprise Blockchain Development</h3>
            <div className="relative w-full aspect-[3/2] mb-6">
              <ClientImage
                src={getBlobImage("blockchain-solutions")}
                alt="Enterprise Blockchain Development - Smart contracts and DeFi platform development"
                fill
                className="mx-auto"
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "contain" }}
                fallbackSrc="/interconnected-blockchain.png"
                itemProp="image"
              />
            </div>
            <p className="text-center" itemProp="description">
              Build secure, scalable blockchain infrastructure including smart contracts, DeFi platforms, NFT marketplaces, and enterprise blockchain solutions that ensure transparency, security, and regulatory compliance.
            </p>
            <meta itemProp="serviceType" content="Enterprise Blockchain Development" />
          </div>
        </div>
      </div>
    </section>
  )
}
