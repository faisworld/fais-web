"use client"

import { getBlobImage } from "@/utils/image-utils"
import ClientImage from "@/components/ui/ClientImage"

export default function SolutionsSection() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white" itemScope itemType="https://schema.org/Service">
      <div className="max-w-7xl mx-auto">
        {/* Section header with consistent alignment */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" itemProp="name">advanced {"{ai}"} - [blockchain] solutions</h2>
          <p className="max-w-3xl mx-auto" itemProp="description">
            fantastic ai studio merges sleek, modern design with robust technological frameworks to revolutionize your
            digital experiences. we stand at the intersection of creativity and technology, crafting ai and blockchain
            solutions that push the boundaries of what&apos;s possible.
          </p>
        </div>

        {/* Two-column layout that maintains alignment on all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI-Powered Solutions Column */}
          <div className="flex flex-col items-center" itemScope itemType="https://schema.org/Product">
            <h3 className="text-2xl font-bold mb-6 text-center" itemProp="name">ai-powered solutions</h3>
            <div className="relative w-full aspect-[3/2] mb-6">
              <ClientImage
                src={getBlobImage("ai-solutions")}
                alt="AI Solutions - Advanced artificial intelligence development and implementation"
                fill
                className="mx-auto"
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "contain" }}
                fallbackSrc="/interconnected-ai.png"
                itemProp="image"
              />
            </div>
            <p className="text-center" itemProp="description">
              Harness the power of artificial intelligence to optimize your operations, enhance decision-making, and
              create intelligent systems that learn and adapt.
            </p>
            <meta itemProp="category" content="AI Technology" />
          </div>

          {/* Blockchain Innovations Column */}
          <div className="flex flex-col items-center" itemScope itemType="https://schema.org/Product">
            <h3 className="text-2xl font-bold mb-6 text-center" itemProp="name">blockchain innovations</h3>
            <div className="relative w-full aspect-[3/2] mb-6">
              <ClientImage
                src={getBlobImage("blockchain-solutions")}
                alt="Blockchain Solutions - Secure and transparent blockchain development and implementation"
                fill
                className="mx-auto"
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "contain" }}
                fallbackSrc="/interconnected-blockchain.png"
                itemProp="image"
              />
            </div>
            <p className="text-center" itemProp="description">
              Secure and transparent blockchain applications custom-designed to streamline your business processes and
              ensure integrity in every transaction.
            </p>
            <meta itemProp="category" content="Blockchain Technology" />
          </div>
        </div>
      </div>
    </section>
  )
}
