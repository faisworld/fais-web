"use client"

import { getBlobImage } from "@/utils/image-utils"
import ClientImage from "@/components/ui/ClientImage"

export default function SolutionsSection() {
  return (
    <section className="mt-[20px] mx-[10%]">
      <h2 className="text-3xl font-bold text-center">advanced {"{ai}"} - [blockchain] solutions</h2>
      <p className="text-center">
        fantastic ai studio merges sleek, modern design with robust technological frameworks to revolutionize your
        digital experiences. we stand at the intersection of creativity and technology, crafting ai and blockchain
        solutions that push the boundaries of what&apos;s possible.
      </p>

      <div className="flex flex-wrap justify-center">
        {/* AI-Powered Solutions Column */}
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-2xl font-bold mb-4 text-center">AI-Powered Solutions</h3>
          <div className="relative w-full aspect-[3/2] mx-auto">
            {/* Use ClientImage with placeholder */}
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
          <p className="mt-4 text-center">
            Harness the power of artificial intelligence to optimize your operations, enhance decision-making, and
            create intelligent systems that learn and adapt.
          </p>
        </div>

        {/* Blockchain Innovations Column */}
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-2xl font-bold mb-4 text-center">Blockchain Innovations</h3>
          <div className="relative w-full aspect-[3/2] mx-auto">
            {/* Use ClientImage with placeholder */}
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
          <p className="mt-4 text-center">
            Secure and transparent blockchain applications custom-designed to streamline your business processes and
            ensure integrity in every transaction.
          </p>
        </div>
      </div>
    </section>
  )
}
