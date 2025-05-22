'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getBlobImage } from '@/utils/media-utils'; // Added import

// Dynamically import the AnimatedCounter to ensure it only runs on the client
const AnimatedCounter = dynamic(() => import('@/components/ui/AnimatedCounter'), {
  ssr: false
});

export default function ProjectsPage() {
  return (
    // Changed pt-20 pb-12 to py-20
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
      
        {/* Page Title Updated */}
        <h1 className='text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900 text-center md:text-left lowercase'>AI and Blockchain Projects</h1>

      {/* Section: Why Choose Us */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-center mb-4 lowercase'>
          Why Choose Us for AI and Blockchain Solutions?
        </h2>
        <p className='text-center text-gray-700 mb-8 lowercase'>
          explore our portfolio of successful projects and discover how we can elevate your ai and blockchain journey in the world of cutting-edge technologies.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-lg shadow p-6 text-center'>
            <h3 className='text-xl font-semibold mb-2 lowercase'>ecosystem</h3>
            <p className='text-gray-600 lowercase'>
              we specialize in delivering cutting-edge solutions that drive success across artificial intelligence (LLMs, chat-bots), web3, and decentralized finance (defi) ecosystems.
            </p>
          </div>
          <div className='bg-white rounded-lg shadow p-6 text-center'>
            <h3 className='text-xl font-semibold mb-2 lowercase'>expertise</h3>
            <p className='text-gray-600 lowercase'>
              our expertise spans a wide range of services, including ai-powered tools, l2 launches, dex development, nft marketplaces, and cross-chain bridge integrations.
            </p>
          </div>
          <div className='bg-white rounded-lg shadow p-6 text-center'>
            <h3 className='text-xl font-semibold mb-2 lowercase'>commitment</h3>
            <p className='text-gray-600 lowercase'>
              we are committed to providing secure, scalable, and efficient ai and blockchain solutions tailored to meet the specific requirements of your business.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Our Projects and Capabilities */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold text-center mb-4 lowercase'>
          Our Projects and Capabilities in AI and Blockchain
        </h2>
        <p className='text-center text-gray-700 mb-8 lowercase'>
          whether you&apos;re looking to develop a custom ai-driven app or dapp, launch a web3 game, or secure your smart contracts with a comprehensive audit, we have the skills and experience to turn your vision into reality.
        </p>
      </section>

      {/* Example Project: Non-Custodial Payment System Integration */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase' id='non-custodial-payment-system-integration'>
          non-custodial payment system integration
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <Image
              src={getBlobImage('projects-payment-system')}
              alt='Non-Custodial Payment Systems Implementation in AI and Blockchain Projects'
              width={700}
              height={300}
              className='rounded-lg shadow-lg'
            />
          </div>
          <div className='bg-slate-50 p-8 rounded-lg shadow-md'>
            <h4 className='text-lg font-semibold mb-2 lowercase'>feemaker.io</h4>
            <p className='mb-2 text-gray-700 lowercase'>
              explore how we&apos;ve successfully implemented non-custodial payment systems with <a href='https://feemaker.io/' className='text-blue-600 hover:underline' target='_blank' rel='noopener noreferrer'>feemaker.io</a>, optimizing transaction processes for enhanced security and efficiency.
            </p>
            <p className='mb-2 text-gray-700 lowercase'>
              <strong>wallet link (metamask + telegram integration):</strong> enhance your payment options by integrating seamless wallet connections. we’ve developed robust solutions that link metamask and telegram wallets for streamlined operations.
            </p>
          </div>
        </div>
      </section>

      {/* Example Project: Web3 Game Development */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase' id='web3-game-development'>
          web3 game development
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>          
          <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border-t-4 border-indigo-600 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage('projects-dopple-ai')}
              alt='Dopple AI'
              width={400}
              height={200}
              className='rounded mb-4'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase'>dopple ai</h4>
            <p className='text-gray-700 mb-3 lowercase'>an ai-driven gaming platform that personalizes the gaming experience.</p>
            <a href='https://beta.dopple.ai/' className='btn btn-secondary mt-auto' target='_blank' rel='noopener noreferrer'>website</a>
          </div>
          <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border-t-4 border-indigo-600 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage('projects-degen-kombat')}
              alt='Degen Kombat'
              width={400}
              height={200}
              className='rounded mb-4'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase'>degen kombat</h4>
            <p className='text-gray-700 mb-3 lowercase'>an action-packed blockchain game that combines gaming with decentralized finance.</p>
            <a href='https://degenkombat.com/' className='btn btn-secondary mt-auto' target='_blank' rel='noopener noreferrer'>website</a>
          </div>
          <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border-t-4 border-indigo-600 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage('projects-heroes-of-mavia')}
              alt='Heroes of Mavia'
              width={400}
              height={200}
              className='rounded mb-4'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase'>heroes of mavia</h4>
            <p className='text-gray-700 mb-3 lowercase'>a strategic base-building game powered by blockchain technology.</p>
            <a href='https://www.mavia.com/' className='btn btn-secondary mt-auto' target='_blank' rel='noopener noreferrer'>website</a>
          </div>
        </div>
      </section>

      {/* Example Project: DEX Development */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase' id='dex-uniswap-v2'>
          decentralized exchange (dex) development
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <Image
              src={getBlobImage('projects-multichain-dex')}
              alt='Multichain DEX'
              width={700}
              height={300}
              className='rounded-lg shadow-lg'
            />
          </div>
          <div className='bg-slate-50 p-8 rounded-lg shadow-md'>
            <h4 className='text-lg font-semibold mb-2 lowercase'>multichain dex</h4>
            <p className='mb-2 text-gray-700 lowercase'>
              check out <a href='https://wagyuswap.app/' className='text-blue-600 hover:underline' target='_blank' rel='noopener noreferrer'>wagyuswap.app</a> for an example of our dex development work.
            </p>
          </div>
        </div>
      </section>

      {/* Example Project: Layer 2 Launch Services */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase' id='l2-launch-op-stack'>
          layer 2 launch services (l2 op stack)
        </h3>
        <div className='bg-sky-50 rounded-lg shadow-md p-6 border-l-4 border-sky-500'>
          <p className='text-gray-700 mb-2 lowercase'>
            we provide comprehensive layer 2 (l2) launch services, including the deployment of optimism bridges and other advanced solutions.
          </p>
          <p className='text-gray-700 lowercase'>
            our l2 projects focus on increasing scalability, reducing transaction costs, and enhancing user experiences within blockchain ecosystems.
          </p>
        </div>
      </section>

      {/* Section: Projects We Can Replicate */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase'>
          Attention: Projects We Can Replicate
        </h3>
        <p className='mb-4 text-gray-700 lowercase'>
          while the following are not our projects, we possess the capability to replicate their quality:
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border-t-4 border-teal-500 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage('projects-base-org')}
              alt='Base.org'
              width={400}
              height={200}
              className='rounded mb-4'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase'>base.org</h4>
            <p className='text-gray-700 mb-3 lowercase'>
              base is built as an ethereum l2, decentralized with the optimism superchain, and incubated by coinbase.
            </p>
            <a href='https://www.base.org/' className='btn btn-secondary mt-auto' target='_blank' rel='noopener noreferrer'>website</a>
          </div>
          <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border-t-4 border-teal-500 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage('projects-optimism-io')}
              alt='Optimism.io'
              width={400}
              height={200}
              className='rounded mb-4'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase'>optimism.io</h4>
            <p className='text-gray-700 mb-3 lowercase'>
              the superchain is a vision of a composable, unified network of blockchains that can support internet-level activity, powered by the mit-licensed open source op stack.
            </p>
            <a href='https://www.optimism.io/' className='btn btn-secondary mt-auto' target='_blank' rel='noopener noreferrer'>website</a>
          </div>
          <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border-t-4 border-teal-500 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage('projects-blast-io')}
              alt='Blast.io'
              width={400}
              height={200}
              className='rounded mb-4'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase'>blast.io</h4>
            <p className='text-gray-700 mb-3 lowercase'>
              the only evm chain with native yield for eth and stablecoins.
            </p>
            <a href='http://blast.io/' className='btn btn-secondary mt-auto' target='_blank' rel='noopener noreferrer'>website</a>
          </div>
        </div>
      </section>      
      
      {/* Stats Section */}
      <section className='py-12 bg-neutral-800 my-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <h2 className='text-2xl font-bold text-center mb-10 lowercase text-white'>our achievements</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='text-4xl font-bold text-black mb-2'>
                <AnimatedCounter end={40} suffix='+' duration={1800} />
              </div>
              <p className='text-gray-700 lowercase font-medium'>ai & blockchain projects delivered</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='text-4xl font-bold text-black mb-2'>
                <AnimatedCounter end={8} suffix='+' duration={1200} delay={200} />
              </div>
              <p className='text-gray-700 lowercase font-medium'>years of programming</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='text-4xl font-bold text-black mb-2'>
                <AnimatedCounter end={60} prefix='>' suffix='%' duration={1500} delay={400} />
              </div>
              <p className='text-gray-700 lowercase font-medium'>profitability growth</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='text-4xl font-bold text-black mb-2'>
                <AnimatedCounter end={99} suffix='%' duration={2000} delay={600} />
              </div>
              <p className='text-gray-700 lowercase font-medium'>satisfied clients</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}