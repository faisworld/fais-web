"use client";

import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from 'next/image';

export default function ProjectsPage() {
    return (
        <>
            <Head>
                <title>Projects &#8211; Fantastic AI Studio</title>
                <meta name="description" content="Explore our innovative AI and blockchain projects." />
            </Head>
            <Header />
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
            <main className="container mx-auto px-4 py-8">
                <section className="text-center py-12">
                    <h1 className="text-3xl font-bold mb-4">Innovative AI and Blockchain Projects: Your Ideas, Our Solutions</h1>
                    <p className="text-lg">Whether it is an AI-based or crypto project, we are here to assist!</p>
                    <div className="relative h-64 w-full mt-8">
                        <Image
                            src="/wp-content/uploads/2024/10/ai-and-blockchain-projects-banner.webp"
                            alt="AI and Crypto Projects Banner"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold mt-4">ai and crypto projects</h1>
                    <p>welcome to our one-stop solution hub for all your ai, blockchain, and crypto project needs. from non-custodial payment system integration to advanced smart contract development</p>
                </section>

                <section className="py-8">
                    <h2 className="text-2xl font-semibold mb-4">Why Choose Us for AI and Blockchain Solutions?</h2>
                    <p>Explore our portfolio of successful projects and discover how we can elevate your AI and blockchain journey in the world of cutting-edge technologies.</p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
                    <div>
                        <h3 className="text-xl font-semibold">ecosystem</h3>
                        <p>we specialize in delivering cutting-edge solutions that drive success across artificial intelligence (LLMs, chat-bots), web3, and decentralized finance (defi) ecosystems.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">experting</h3>
                        <p>our expertise spans a wide range of services, including ai-powered tools, l2 launches, dex development, nft marketplaces, and cross-chain bridge integrations.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">commitment</h3>
                        <p>we are committed to providing secure, scalable, and efficient ai and blockchain solutions tailored to meet the specific requirements of your business.</p>
                    </div>
                </section>

                <section className="py-8">
                    <h2 className="text-2xl font-semibold mb-4">Our Projects and Capabilities in AI and Blockchain</h2>
                    <p>Whether you&apos;re looking to develop a custom AI-driven app or dapp, launch a web3 game, or secure your smart contracts with a comprehensive audit, we have the skills and experience to turn your vision into reality.</p>
                </section>

                <section className="py-8">
                    <h3 className="text-xl font-semibold mb-4">Non-Custodial Payment System Integration</h3>
                    <p>At fantastic ai studio, we specialize in seamlessly integrating non-custodial payment systems.</p>
                    <p>Our solutions are designed to ensure secure, efficient, and user-friendly transactions, tailored to meet the unique needs of your projects.</p>
                    <p>By eliminating the need for third-party custody, we empower businesses to maintain complete control over their assets while enhancing security.</p>
                    <a href="https://feemaker.io/" target="_blank" rel="noopener noreferrer">feemaker.io</a>
                    <p>explore how we&apos;ve successfully implemented non-custodial payment systems with feemaker.io, optimizing transaction processes for enhanced security and efficiency.<strong>wallet link (metamask + telegram integration)</strong>
                        enhance your payment options by integrating seamless wallet connections. we&apos;ve developed robust solutions that link metamask and telegram wallets for streamlined operations.</p>
                </section>

                <section className="py-8">
                    <h3 className="text-xl font-semibold mb-4">Web3 Game Development</h3>
                    <p>Enter the future of gaming with our web 3.0 game development services. we build innovative, blockchain-based games that offer immersive experiences and decentralized ownership.</p>
                    <p>Our expertise spans the creation of engaging and secure gaming environments that leverage the power of blockchain.</p>
                    <a href="https://beta.dopple.ai/" target="_blank" rel="noopener noreferrer">dopple ai</a>
                    <p>an ai-driven gaming platform that personalizes the gaming experience.</p>
                    <a href="https://degenkombat.com/" target="_blank" rel="noopener noreferrer">degen kombat</a>
                    <p>an action-packed blockchain game that combines gaming with decentralized finance.</p>
                    <a href="https://www.mavia.com/" target="_blank" rel="noopener noreferrer">heroes of mavia</a>
                    <p>a strategic base-building game powered by blockchain technology.</p>
                </section>

                <section className="py-8">
                    <h3 className="text-xl font-semibold mb-4">Decentralized Exchange (DEX) Development</h3>
                    <p>We build decentralized exchanges (dex) using uniswap v2 protocols, offering seamless and secure trading experiences.</p>
                    <p>Our dex solutions enable users to trade assets directly from their wallets without intermediaries, fostering true decentralization.</p>
                    <a href="https://wagyuswap.app/" target="_blank" rel="noopener noreferrer">multichain dex</a>
                    <p>check out wagyuswap.app for an example of our dex development work.</p>
                </section>

                <section className="py-8">
                    <h3 className="text-xl font-semibold mb-4">Layer 2 Launch Services (l2 op stack)</h3>
                    <p>We provide comprehensive layer 2 (l2) launch services, including the deployment of optimism bridges and other advanced solutions.</p>
                    <p>Our l2 projects focus on increasing scalability, reducing transaction costs, and enhancing user experiences within blockchain ecosystems.</p>
                </section>

                <section className="py-8">
                    <h3 className="text-xl font-semibold mb-4">Attention: Projects We Can Replicate</h3>
                    <p>While the following are not our projects, we possess the capability to replicate their quality:</p>
                    <a href="https://www.base.org/" target="_blank" rel="noopener noreferrer">base.org</a>
                    <p>Base is built as an Ethereum L2, decentralized with the Optimism Superchain, and incubated by Coinbase.</p>
                    <a href="https://www.optimism.io/" target="_blank" rel="noopener noreferrer">optimism.io</a>
                    <p>The Superchain is a vision of a composable, unified network of blockchains that can support internet-level activity, powered by the MIT-licensed open source OP Stack.</p>
                    <a href="http://blast.io/" target="_blank" rel="noopener noreferrer">blast.io</a>
                    <p>The only EVM chain with native yield for ETH and stablecoins.</p>
                </section>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
                    <div>
                        <p>perfectly realized</p>
                        <p>ai &amp; blockchain projects</p>
                    </div>
                    <div>
                        <p>years of programming</p>
                        <p>ai and crypto industry</p>
                    </div>
                    <div>
                        <p>of</p>
                        <p>profitability growth</p>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div>
                        <p>satisfied clients</p>
                    </div>
                    <div>
                        <p>Clients areas of activity</p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}