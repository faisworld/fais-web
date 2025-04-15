// filepath: c:\Users\solar\Projects\fais-web\app\projects\components\ProjectsClientContent.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsClientContent() {
    const projects = [
        {
          id: "mev-staking",
          title: "MEV Staking Dapp",
          description: "Optimized transactions & yield generation via MEV strategies.",
          image: "/images/MEV-Staking-Dapp.webp",
          link: "https://fais.world/projects#mev-staking-dapp-development",
          isExternal: true,
        },
        {
          id: "web3-game",
          title: "Web 3.0 Gaming Platform",
          description: "Engaging Web3 gaming experiences with NFT integration.",
          image: "/images/Web3-Game.webp",
          link: "https://fais.world/projects#web3-game-development",
          isExternal: true,
        },
        {
          id: "nft-marketplace",
          title: "NFT Marketplace",
          description: "Secure and scalable platform for trading unique digital assets.",
          image: "/images/NFT-Marketplace-300x300.webp",
          link: "https://fais.world/projects#nft-marketplace-development",
          isExternal: true,
        },
        {
          id: "ai-services",
          title: "AI Services Integration",
          description: "Seamless integration of AI capabilities into existing business processes.",
          image: "/images/6-AI-Services-bw4.webp",
          link: "https://fais.world/ai-services/",
          isExternal: true,
        },
        {
          id: "ncp-systems",
          title: "Non-Custodial Payment Systems",
          description: "Secure, user-controlled payment solutions leveraging blockchain.",
          image: "/images/Dapp-Development-300x300.webp",
          link: "https://fais.world/projects#non-custodial-payment-system-integration",
          isExternal: true,
        },
    ];

    return (
        <>
            <section className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Showcasing Our Expertise</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Explore our portfolio of successful AI and blockchain projects, demonstrating our capability to deliver innovative and impactful solutions.
                </p>
            </section>

            <section className="mb-16">
                <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800">Featured Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id || project.title} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            {project.isExternal ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="relative w-full h-56 overflow-hidden">
                                        <Image
                                            src={project.image}
                                            alt={`Screenshot of ${project.title}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </a>
                            ) : (
                                <Link href={project.link} className="block group">
                                    <div className="relative w-full h-56 overflow-hidden">
                                        <Image
                                            src={project.image}
                                            alt={`Screenshot of ${project.title}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                            )}
                            <div className="p-6 flex flex-col flex-grow">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h4>
                                <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>
                                {project.isExternal ? (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary mt-auto self-start"
                                    >
                                        Learn More →
                                    </a>
                                ) : (
                                    <Link href={project.link} className="btn btn-secondary mt-auto self-start">
                                        Learn More →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-8 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm my-12 border border-blue-100">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Why Partner with Us?</h2>
                <p className="text-gray-700 text-center max-w-3xl mx-auto">
                    Discover how our tailored AI and blockchain solutions, combined with deep ecosystem expertise, can elevate your project and drive success in the evolving digital landscape.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2 text-indigo-700">Ecosystem Expertise</h3>
                    <p className="text-gray-600">Specializing in cutting-edge AI (LLMs, Chatbots), Web3, and DeFi solutions to drive success across interconnected digital ecosystems.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2 text-indigo-700">Diverse Capabilities</h3>
                    <p className="text-gray-600">Expertise spanning AI-powered tools, L2 launches, DEX development, NFT marketplaces, and cross-chain bridge integrations.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2 text-indigo-700">Commitment to Quality</h3>
                    <p className="text-gray-600">Dedicated to providing secure, scalable, and efficient AI & blockchain solutions tailored to your specific business requirements.</p>
                </div>
            </section>

            <section className="py-8 px-4 bg-white rounded-lg shadow-md my-12 border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Our Technical Capabilities</h2>
                <p className="text-gray-700 text-center max-w-3xl mx-auto">
                    Whether developing custom AI applications, launching Web3 games, or auditing smart contracts, we possess the skills to transform your vision into reality.
                </p>
            </section>

            <div className="space-y-12 mb-16">
                <section className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Non-Custodial Payment System Integration</h3>
                    <p className="text-gray-600 mb-2">Seamlessly integrating non-custodial payment systems for secure, efficient, and user-controlled transactions.</p>
                    <p className="text-gray-600 mb-4">Eliminate third-party custody, maintain asset control, and enhance security.</p>
                    <p className="text-gray-600 mb-2"><strong>Example:</strong> <a href="https://feemaker.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">feemaker.io</a> - Optimized transaction processes.</p>
                    <p className="text-gray-600"><strong>Features:</strong> Wallet link (Metamask + Telegram integration) for streamlined operations.</p>
                </section>

                <section className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Web3 Game Development</h3>
                    <p className="text-gray-600 mb-2">Building the future of gaming with innovative, blockchain-based games offering immersive experiences and decentralized ownership.</p>
                    <p className="text-gray-600 mb-4">Creating engaging and secure gaming environments leveraging blockchain power.</p>
                    <p className="text-gray-600 mb-2"><strong>Examples:</strong></p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li><a href="https://beta.dopple.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Dopple AI</a> - AI-driven personalized gaming.</li>
                        <li><a href="https://degenkombat.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Degen Kombat</a> - Action-packed blockchain gaming with DeFi elements.</li>
                        <li><a href="https://www.mavia.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Heroes of Mavia</a> - Strategic base-building blockchain game.</li>
                    </ul>
                </section>

                <section className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Decentralized Exchange (DEX) Development</h3>
                    <p className="text-gray-600 mb-2">Building secure DEX platforms using Uniswap V2 protocols for seamless, intermediary-free trading.</p>
                    <p className="text-gray-600 mb-4">Enabling users to trade directly from their wallets, fostering true decentralization.</p>
                    <p className="text-gray-600"><strong>Example:</strong> <a href="https://wagyuswap.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wagyuswap (Multichain DEX)</a></p>
                </section>

                <section className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Layer 2 Launch Services (OP Stack)</h3>
                    <p className="text-gray-600 mb-2">Comprehensive L2 launch services, including Optimism bridge deployment and advanced solutions.</p>
                    <p className="text-gray-600">Focusing on scalability, reduced costs, and enhanced user experience within blockchain ecosystems.</p>
                </section>

                <section className="p-6 bg-yellow-100 border border-yellow-300 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-800">Attention: Replicable Project Examples</h3>
                    <p className="text-yellow-700 mb-4">While the following are not our direct projects, we possess the capability and expertise to replicate their quality and functionality:</p>
                    <ul className="list-disc list-inside text-yellow-700 space-y-2">
                        <li><a href="https://www.base.org/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Base.org</a>: Ethereum L2 built on Optimism Superchain, incubated by Coinbase.</li>
                        <li><a href="https://www.optimism.io/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Optimism.io</a>: The Superchain vision for a composable, unified network powered by the OP Stack.</li>
                        <li><a href="http://blast.io/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Blast.io</a>: EVM chain featuring native yield for ETH and stablecoins.</li>
                    </ul>
                </section>
            </div>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 text-center">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-3xl font-bold text-indigo-600">15+</p>
                    <p className="text-gray-600 mt-1">AI & Blockchain Projects Delivered</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-3xl font-bold text-indigo-600">5+</p>
                    <p className="text-gray-600 mt-1">Years Industry Experience</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-3xl font-bold text-indigo-600">95%</p>
                    <p className="text-gray-600 mt-1">Client Satisfaction Rate</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-3xl font-bold text-indigo-600">20+</p>
                    <p className="text-gray-600 mt-1">Successful Integrations</p>
                </div>
            </section>
        </>
    );
}