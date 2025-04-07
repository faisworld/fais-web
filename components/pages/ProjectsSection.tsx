"use client";

import Image from "next/image";

export default function ProjectsSection() {
  const projects = [
    {
      title: "MEV Staking Dapp",
      description: "Optimized transactions",
      image: "/images/MEV-Staking-Dapp.webp",
      link: "https://fais.world/projects#mev-staking-dapp-development",
    },
    {
      title: "Web 3.0",
      description: "Web3 gaming",
      image: "/images/Web3-Game.webp",
      link: "https://fais.world/projects#web3-game-development",
    },
    {
      title: "Non-Fungible Token",
      description: "NFT projects",
      image: "/images/NFT-Marketplace-300x300.webp",
      link: "https://fais.world/projects#nft-marketplace-development",
    },
    {
      title: "AI Services",
      description: "AI services integration",
      image: "/images/6-AI-Services-bw4.webp",
      link: "https://fais.world/ai-services/",
    },
    {
      title: "NCP Systems",
      description: "Non-custodial systems projects",
      image: "/images/Dapp-Development-300x300.webp",
      link: "https://fais.world/projects#non-custodial-payment-system-integration",
    },
  ];

  return (
    <section className="w-full bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Our Amazing Work</h2>
        <p className="mt-4">
          We offer versatile solutions that can be utilized by individuals and companies looking for innovative AI and blockchain services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={project.image}
                alt={project.title}
                width={500}
                height={500}
                className="w-full h-64 object-cover"
              />
            </a>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2">{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn mt-4">
                Learn More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}