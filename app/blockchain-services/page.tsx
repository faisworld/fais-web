import Link from "next/link";

export const metadata = {
  title: "Blockchain Services | Fantastic AI Studio",
  description: "Empower your business with our comprehensive blockchain solutions including smart contracts, DeFi applications, NFTs, and enterprise blockchain integration.",
  keywords: [
    "blockchain services",
    "blockchain solutions",
    "smart contracts",
    "decentralized applications",
    "DeFi solutions",
    "NFT development",
    "tokenization",
    "enterprise blockchain",
    "blockchain consulting",
    "web3 development",
    "Fantastic AI Studio"
  ],
  openGraph: {
    title: "Blockchain Services | Fantastic AI Studio",
    description: "Discover our innovative blockchain solutions tailored for enterprise, startups, and digital transformation initiatives.",
    url: "https://fais.world/blockchain-services",
    images: [
      {
        url: "/blockchain-services-hero-placeholder.png",
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio Blockchain Services"
      }
    ]
  }
};

export default function BlockchainServicesPage() {
  return (
    <div className="relative overflow-x-clip">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-neutral-200 opacity-40 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-neutral-200 opacity-30 blur-3xl" />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900">
              enterprise blockchain solutions
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-neutral-700 max-w-3xl mx-auto">
              harness the power of decentralized technology to revolutionize your business with secure, transparent, and future-proof blockchain solutions.
            </p>
            {/* Image Placeholder */}
            <div className="flex justify-center mb-10">
              <div className="w-full max-w-2xl h-64 bg-neutral-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300 shadow-lg">
                <span className="text-neutral-400 text-lg">[blockchain technology image]</span>
              </div>
            </div>
            <Link
              href="/contact"
              className="btn inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white hover:opacity-90 transition"
            >
              schedule a blockchain consultation
            </Link>
          </div>
        </section>

        {/* Blockchain Services Overview */}
        <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16">
          {/* Core Blockchain Services */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-black">core blockchain services</h2>
            <p className="mb-6 text-neutral-700">
              our comprehensive blockchain development services help businesses implement secure, scalable, and efficient decentralized solutions across various industries.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>smart contract development:</strong> create secure, auditable, and automated business logic with expert-crafted smart contracts on Ethereum, Solana, Polygon, and other leading platforms.
              </li>
              <li>
                <strong>decentralized applications (dApps):</strong> build robust web3 applications with intuitive user experiences that leverage blockchain's security and transparency.
              </li>
              <li>
                <strong>blockchain consulting:</strong> receive strategic guidance on blockchain adoption, platform selection, and implementation roadmaps aligned with your business objectives.
              </li>
              <li>
                <strong>private & consortium blockchains:</strong> develop customized blockchain networks for enterprise use cases requiring controlled access and enhanced privacy.
              </li>
              <li>
                <strong>security audits & optimization:</strong> ensure your blockchain solutions meet the highest security standards through comprehensive code reviews and performance tuning.
              </li>
              <li>
                <strong>blockchain integration:</strong> seamlessly connect blockchain systems with your existing enterprise architecture, data stores, and business processes.
              </li>
            </ul>
          </div>

          {/* Specialized Blockchain Solutions */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-black">specialized blockchain solutions</h2>
            <p className="mb-6 text-neutral-700">
              leverage our expertise in cutting-edge blockchain applications to create innovative solutions for specific business needs and emerging markets.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>tokenization & digital assets:</strong> transform physical assets, securities, and intellectual property into blockchain-based tokens for improved liquidity and management.
              </li>
              <li>
                <strong>NFT development & marketplaces:</strong> create, deploy, and manage non-fungible token systems for digital art, collectibles, credentials, and access rights.
              </li>
              <li>
                <strong>DeFi solutions:</strong> implement decentralized finance applications including lending platforms, exchanges, yield farming, and treasury management systems.
              </li>
              <li>
                <strong>supply chain traceability:</strong> enhance transparency and trust in your supply chain with immutable record-keeping and provenance verification.
              </li>
              <li>
                <strong>identity & credential systems:</strong> build self-sovereign identity solutions and verifiable credential systems for secure, user-controlled digital identity.
              </li>
              <li>
                <strong>DAO & governance:</strong> design and implement decentralized autonomous organizations with customized voting mechanisms and governance structures.
              </li>
            </ul>
          </div>
        </section>

        {/* Industry Applications */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center">blockchain across industries</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Finance */}
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-neutral-100">
              <h3 className="text-2xl font-bold mb-3 text-black">finance & banking</h3>
              <p className="text-neutral-700 mb-4">
                Revolutionize financial services with secure payment systems, cross-border transfers, automated compliance, and tamper-proof audit trails.
              </p>
              <ul className="text-neutral-800 space-y-2 list-disc pl-5">
                <li>Tokenized securities & assets</li>
                <li>Cross-border payment networks</li>
                <li>Regulatory compliance solutions</li>
                <li>Trade finance optimization</li>
              </ul>
            </div>

            {/* Healthcare */}
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-neutral-100">
              <h3 className="text-2xl font-bold mb-3 text-black">healthcare</h3>
              <p className="text-neutral-700 mb-4">
                Enhance patient data management, drug traceability, and clinical trials with secure, compliant blockchain solutions.
              </p>
              <ul className="text-neutral-800 space-y-2 list-disc pl-5">
                <li>Patient record management</li>
                <li>Pharmaceutical supply chains</li>
                <li>Clinical trial data integrity</li>
                <li>Healthcare credentialing</li>
              </ul>
            </div>

            {/* Supply Chain */}
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-neutral-100">
              <h3 className="text-2xl font-bold mb-3 text-black">supply chain</h3>
              <p className="text-neutral-700 mb-4">
                Achieve end-to-end visibility, reduce counterfeiting, and streamline logistics with blockchain-powered traceability.
              </p>
              <ul className="text-neutral-800 space-y-2 list-disc pl-5">
                <li>Product provenance verification</li>
                <li>Supplier management</li>
                <li>Automated logistics documentation</li>
                <li>Sustainable sourcing certification</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-neutral-100 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">our blockchain development process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-2">discovery & strategy</h3>
                <p className="text-neutral-700">
                  We analyze your business requirements and develop a tailored blockchain strategy aligned with your objectives.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-2">architecture & design</h3>
                <p className="text-neutral-700">
                  Our experts design a robust blockchain architecture with appropriate protocols and technical specifications.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-2">development & testing</h3>
                <p className="text-neutral-700">
                  We develop and rigorously test your blockchain solution with multiple security audits and quality assurance.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="text-xl font-bold mb-2">deployment & support</h3>
                <p className="text-neutral-700">
                  We handle secure deployment and provide ongoing maintenance, updates, and technical support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-neutral-200 py-16 text-center shadow-inner">
          <h2 className="text-4xl font-bold mb-4">ready to embrace blockchain innovation?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-neutral-700">
            partner with fantastic ai studio to leverage the power of blockchain technology for your business. our expert team will guide you through every step of your blockchain journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white hover:opacity-90 transition"
            >
              schedule a consultation
            </Link>
            <Link
              href="/services"
              className="btn inline-block px-8 py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
            >
              explore all services
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
