"use client";

import Image from 'next/image';
import Link from "next/link";

export default function ProjectsSection() {
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
    <section className="w-full py-16 bg-gray-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Our Amazing Work</h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto">
                    Explore versatile solutions utilized by individuals and companies seeking innovative AI and blockchain services.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id || project.title} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        {project.isExternal ? (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gray-100">
                                    <Image
                                        src={project.image}
                                        alt={`Screenshot of ${project.title}`}
                                        width={400}
                                        height={256}
                                        className="group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        style={{ objectFit: "cover" }}
                                        priority={false}
                                    />
                                </div>
                            </a>
                        ) : (
                            <Link href={project.link} className="block group">
                                <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gray-100">
                                    <Image
                                        src={project.image}
                                        alt={`Screenshot of ${project.title}`}
                                        width={400}
                                        height={256}
                                        className="group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        style={{ objectFit: "cover" }}
                                        priority={false}
                                    />
                                </div>
                            </Link>
                        )}

                        <div className="p-6 flex flex-col flex-grow bg-gray-50 text-gray-900">
                            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                            <p className="mb-4 flex-grow">{project.description}</p>
                            {project.isExternal ? (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary mt-auto"
                                >
                                    Learn More →
                                </a>
                            ) : (
                                <Link href={project.link} className="btn btn-secondary mt-auto">
                                    Learn More →
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}