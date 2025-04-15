"use client";

import Image from "next/image";
import Link from "next/link"; // Use Next.js Link for internal links if applicable

export default function ProjectsSection() {
  const projects = [
    {
      id: "mev-staking", // Example unique ID
      title: "MEV Staking Dapp",
      description: "Optimized transactions & yield generation via MEV strategies.",
      image: "/images/MEV-Staking-Dapp.webp",
      link: "https://fais.world/projects#mev-staking-dapp-development", // External link example
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
      link: "https://fais.world/ai-services/", // Could be internal or external
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
    // Add more projects as needed
  ];

  return (
    // Added padding, max-width container
    <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Amazing Work</h2> {/* Use h2 */}
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore versatile solutions utilized by individuals and companies seeking innovative AI and blockchain services.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    // Use unique ID for key if available, otherwise title is fallback
                    <div key={project.id || project.title} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        {/* Use Next Link for internal links, anchor for external */}
                        {project.isExternal ? (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="relative w-full h-56 sm:h-64 overflow-hidden"> {/* Fixed height container */}
                                    <Image
                                        src={project.image}
                                        alt={`Screenshot of ${project.title}`} // More descriptive alt text
                                        layout="fill" // Use layout fill for responsive container
                                        objectFit="cover" // Cover the container
                                        className="group-hover:scale-105 transition-transform duration-300" // Subtle hover effect
                                    />
                                </div>
                            </a>
                        ) : (
                            <Link href={project.link} className="block group">
                                <div className="relative w-full h-56 sm:h-64 overflow-hidden">
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

                        <div className="p-6 flex flex-col flex-grow"> {/* Added flex-grow */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3> {/* Use h3 */}
                            <p className="text-gray-600 mb-4 flex-grow">{project.description}</p> {/* Added flex-grow */}
                            {/* Button at the bottom */}
                            {project.isExternal ? (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary mt-auto" // Use standard button class, mt-auto pushes to bottom
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