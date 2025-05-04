"use client"

import { getBlobImage } from "@/utils/image-utils"
import ClientImage from "@/components/ui/ClientImage"

export default function SolutionsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header with consistent alignment */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">advanced {"{ai}"} - [blockchain] solutions</h2>
          <p className="max-w-3xl mx-auto">
            fantastic ai studio merges sleek, modern design with robust technological frameworks to revolutionize your
            digital experiences. we stand at the intersection of creativity and technology, crafting ai and blockchain
            solutions that push the boundaries of what&apos;s possible.
          </p>
        </div>

        {/* Two-column layout that maintains alignment on all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI-Powered Solutions Column */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6 text-center">AI-Powered Solutions</h3>
            <div className="relative w-full aspect-[3/2] mb-6">
              <ClientImage
                src={getBlobImage("ai-solutions")}
                alt="AI Solutions"
                fill
                className="mx-auto"
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "contain" }}
                fallbackSrc="/interconnected-ai.png"
              />
            </div>
            <p className="text-center">
              Harness the power of artificial intelligence to optimize your operations, enhance decision-making, and
              create intelligent systems that learn and adapt.
            </p>
          </div>

          {/* Blockchain Innovations Column */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6 text-center">Blockchain Innovations</h3>
            <div className="relative w-full aspect-[3/2] mb-6">
              <ClientImage
                src={getBlobImage("blockchain-solutions")}
                alt="Blockchain Solutions"
                fill
                className="mx-auto"
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "contain" }}
                fallbackSrc="/interconnected-blockchain.png"
              />
            </div>
            <p className="text-center">
              Secure and transparent blockchain applications custom-designed to streamline your business processes and
              ensure integrity in every transaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
